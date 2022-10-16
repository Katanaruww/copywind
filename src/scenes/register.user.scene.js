const { Scenes } = require('telegraf')
const loggy = require('loggy')

const config = require('../../configs/config.json')
const account = require('../../database/models/account')

const registerScene = new Scenes.WizardScene('registerScene', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML(`1️⃣ <b>Расскажи о своём опыте!</b>`)
        return ctx.wizard.next()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        })

        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        ctx.wizard.state.data.exp = ctx.message.text
        await ctx.replyWithHTML(`2️⃣ <b>Отлично, теперь скажи откуда узнал о нас</b>`)
        return ctx.wizard.next()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        })

        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        ctx.wizard.state.data.where = ctx.message.text
        await ctx.replyWithHTML(`3️⃣ <b>И последний вопрос: сколько готов уделять времени работе?</b>`)
        return ctx.wizard.next()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        })

        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        ctx.wizard.state.data.time = ctx.message.text
        await ctx.replyWithHTML(`🧨 <b>Отлично! Я передам твои ответы администрации... Ожидай результат!</b> 🧨`)
        await ctx.telegram.sendMessage(config.bot.request_logs, `🤖 <b>Новая заявка на вступление!</b> 🤖\n\n🧾 <b>Пользователь:</b> @${ctx.from.username} (${ctx.from.id})\n\n<b>📧 Опыт работы:</b> ${ctx.wizard.state.data.exp}\n<b>📧 Откуда узнал:</b> ${ctx.wizard.state.data.where}\n<b>📧 Время для работы:</b> ${ctx.wizard.state.data.time}`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '✅ Принять', callback_data: `✅ Принять ${ctx.from.id}` }, { text: '⛔️ Отклонить', callback_data: `⛔️ Отклонить ${ctx.from.id}` }]
                ]
            }
        }).catch(async (err) => {
            loggy.warn(`problems with register user => ${err}`)
        })

        return await ctx.scene.leave()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        })

        return ctx.scene.leave()
    }
})

module.exports = registerScene