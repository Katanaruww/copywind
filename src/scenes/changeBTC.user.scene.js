const { validate } = require('bitcoin-address-validation')
const { Scenes } = require('telegraf')

const config = require('../../configs/config.json')
const account = require('../../database/models/account')

const changeBTCAddr = new Scenes.WizardScene('changeBTCAddr', async (ctx) => {
    try {
        await ctx.replyWithPhoto('https://i.ibb.co/g9TFQ5b/Untitled.png', {
            caption: `<b>❕ Введите BTC адрес кошелька, на который хотите получать выплаты</b>`,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Отмена', callback_data: 'Отмена' }]
                ]
            }
        })

        return ctx.wizard.next()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        if (validate(ctx.message.text)) {
            await account.findOneAndUpdate({ tgID: ctx.from.id }, { $set: { btc: ctx.message.text } }, { new: true }).then(async (res) => {
                await ctx.replyWithHTML(`<b>❕ Вашему аккаунта был присвоен</b> <code>${res.btc}</code> <b>BTC адрес</b>`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                        ]
                    }
                })

                await ctx.telegram.sendMessage(config.bot.archive_chat, `<b>Воркер</b> @${ctx.from.username} <b>сменил BTC адрес на</b> ${res.btc}`, { parse_mode: 'HTML' }).catch(async (e) => {
                    console.log(e)
                })

                return ctx.scene.leave()
            })
        } else {
            await ctx.replyWithHTML(`<b>❕ Система не смогла проверить ваш адрес на валидность. Проверьте, правильно ли вы ввели адрес и попробуйте снова (вернитесь в меню и зайдите сюда снова)</b>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })

            return ctx.scene.leave()
        }

        return ctx.scene.leave()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

changeBTCAddr.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = changeBTCAddr