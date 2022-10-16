const { Scenes } = require('telegraf')
const loggy = require('loggy')

const account = require('../../database/models/account')
const config = require('../../configs/config.json')

const prScene = new Scenes.WizardScene('prScene', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithPhoto('https://raw.githubusercontent.com/hosein2398/node-telegram-bot-api-tutorial/master/pics/parse_mode.JPG', {
            caption: `Введите текст, который хотите разослать по ЛС каждого воркера.\n\nУ вас есть возможность сделать дизайн для сообщения:\n\nВыделение текста жирном шрифтом - <b>ZeroRent</b>\nНаклонный - <i>ZeroRent</i>\nВыделение текста в виде кода - <code>ZeroRent</code>`,
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Отмена', callback_data: `Отмена` }]
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
        ctx.wizard.state.data.text = ctx.message.text
        await ctx.replyWithHTML(`<b>Выберите тип рассылки</b>`, {
            reply_markup: {
                resize_keyboard: true,
                keyboard: [
                    [{ text: 'Бот' }, { text: 'Бот + выплаты' }, { text: 'Бот + выплаты + чат' }],
                    [{ text: 'Назад' }]
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
        ctx.wizard.state.data.type = ctx.message.text

        if (ctx.wizard.state.data.type == 'Бот') {
            await account.find({  }).lean().then(async (res) => {
                await ctx.replyWithHTML(`🔔 <b>Начинаем рассылку по</b> <code>${res.length}</code> <b>пользователям...</b>`)
                for (let i = 0; i < res.length; i++) {
                    await ctx.telegram.sendMessage(res[i].tgID, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n${ctx.wizard.state.data.text}`, { 
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '❌ Скрыть', callback_data: 'Фэйк_profittzz' }]
                            ]
                        }
                    }).catch(async (err) => {
                        loggy.warn(`problems with sending message to all => ${err}`)
                    })
                }
            })
    
            return ctx.scene.leave()
        } else if (ctx.wizard.state.data.type == 'Бот + выплаты') {
            await account.find({  }).lean().then(async (res) => {
                await ctx.telegram.sendMessage(config.bot.profits_channel, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>${ctx.wizard.state.data.text}</b>`, { parse_mode: 'HTML' })
                await ctx.replyWithHTML(`🔔 <b>Начинаем рассылку по</b> <code>${res.length}</code> <b>пользователям...</b>`)
                for (let i = 0; i < res.length; i++) {
                    await ctx.telegram.sendMessage(res[i].tgID, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n${ctx.wizard.state.data.text}`, { 
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '❌ Скрыть', callback_data: 'Фэйк_profittzz' }]
                            ]
                        }
                    }).catch(async (err) => {
                        loggy.warn(`problems with sending message to all => ${err}`)
                    })
                }
            })
    
            return ctx.scene.leave()
        } else if (ctx.wizard.state.data.type == 'Бот + выплаты + чат') {
            await account.find({  }).lean().then(async (res) => {
                await ctx.telegram.sendMessage(config.bot.profits_channel, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>${ctx.wizard.state.data.text}</b>`, { parse_mode: 'HTML' })
                await ctx.telegram.sendMessage(-1001759957604, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>${ctx.wizard.state.data.text}</b>`, { parse_mode: 'HTML' })
                await ctx.replyWithHTML(`🔔 <b>Начинаем рассылку по</b> <code>${res.length}</code> <b>пользователям...</b>`)
                for (let i = 0; i < res.length; i++) {
                    await ctx.telegram.sendMessage(res[i].tgID, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n${ctx.wizard.state.data.text}`, { 
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '❌ Скрыть', callback_data: 'Фэйк_profittzz' }]
                            ]
                        }
                    }).catch(async (err) => {
                        loggy.warn(`problems with sending message to all => ${err}`)
                    })
                }
            })
        } else {
            await ctx.replyWithHTML(`Вернитесь в меню`, {
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
        console.log(e)
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

prScene.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = prScene