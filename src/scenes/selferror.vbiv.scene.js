const { Scenes } = require('telegraf')

const receive = require('../../database/models/receive')

const selfErrorScene = new Scenes.WizardScene('selfError', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.callbackQuery.data.split(' ')[1]
        await ctx.reply(`Опишите ошибку, которую вам выдало при вбиве. Передам её воркеру.`, {
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
        await receive.findOne({ link: ctx.wizard.state.data.id }).then(async (res) => {
            if (!res) {
                await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
                return ctx.scene.leave()
            } else {
                await ctx.telegram.sendMessage(res.tgID, `📬 <b>${res.service}:</b> <code>💌 Сообщение от вбивера 💌</code>\n\n📬 Текст сообщения: ${ctx.wizard.state.data.text}`, { parse_mode: 'HTML' })
                return ctx.scene.leave()
            }
        })
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

selfErrorScene.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = selfErrorScene