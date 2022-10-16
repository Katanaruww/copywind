const { Scenes } = require('telegraf')
const config = require('../../configs/config.json')

const sayAboutError = new Scenes.WizardScene('aboutError', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML(`❕ <b>Опишите проблему, которую увидели в нашем проекте!</b>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Отмена', callback_data: `Отмена` }]
                ]
            }
        })

        return await ctx.wizard.next()
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
        ctx.wizard.state.data.error = ctx.message.text
        await ctx.replyWithHTML(`❕ <b>Отправьте ссылку на скриншот, описывающий проблему!</b> (@Images_24_bot)`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Назад', callback_data: 'nazad_data' }]
                ]
            }
        })

        return await ctx.wizard.next()
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
        ctx.wizard.state.data.image = ctx.message.text
        await ctx.replyWithHTML(`❕ <b>Спасибо, что сообщили о проблеме!</b>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Назад', callback_data: '⬅️ Назад' }]
                ]
            }
        })

        await ctx.telegram.sendMessage(-1001530239473, `⚠️ <b>Новый запрос об ошибке!</b> ⚠️\n<b>От:</b> @${ctx.from.username}\n\n<b>Текст сообщения:</b> ${ctx.wizard.state.data.error}\nПруф скриншот: ${ctx.wizard.state.data.image}`, { parse_mode: 'HTML' })
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

sayAboutError.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = sayAboutError