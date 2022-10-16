const { Scenes } = require('telegraf')

const config = require('../../configs/config.json')
const account = require('../../database/models/account')

const changeTagScene = new Scenes.WizardScene('changeTag', async (ctx) => {
    try {
        await ctx.replyWithHTML(`<b>❕ Введите TAG, который хотите установить</b>\n❔ <b>Внимание:</b> <code>данный тэг будет отображаться не только в главном меню, но и в выплатах</code>\n❔ <b>Пожалуйста, вводите тэг без решетки, это очень очень очень важно</b>`, {
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
        if (ctx.message.text == 'Назад') {
            await ctx.reply(`Вернитесь в меню`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⬅️ Назад', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
            
            return ctx.scene.leave()
        } else {
            await account.findOne({ tag: ctx.message.text }).then(async (res) => {
                if (res) {
                    await ctx.replyWithHTML(`❕ <b>К сожалению, данный тэг уже занят, вернитесь сюда через меню снова и попробуйте другой!</b>`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                            ]
                        }
                    })
    
                    return ctx.scene.leave()
                } else {
                    await account.findOneAndUpdate({ tgID: ctx.from.id }, { $set: { tag: ctx.message.text } }, { new: true }).then(async (res_change) => {
                        await ctx.replyWithHTML(`🎉 <b>Поздравляем, теперь у вас тэг #${res_change.tag}</b>`, {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                                ]
                            }
                        })
    
                        await ctx.telegram.sendMessage(config.bot.archive_chat, `<b>Воркер</b> @${ctx.from.username} <b>сменил тэг на</b> #${res_change.tag}`, { parse_mode: 'HTML' }).catch(async (e) => {
                            console.log(e)
                        })
    
                        return ctx.scene.leave()
                    })
                }
            })
    
            return ctx.scene.leave()
        }
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

changeTagScene.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = changeTagScene