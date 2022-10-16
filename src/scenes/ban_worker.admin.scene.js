const { Scenes } = require('telegraf')

const account = require('../../database/models/account')

const banWorker = new Scenes.WizardScene('banWorker', async (ctx) => {
    try {
        ctx.reply('Введите Telegram ID воркера, которого хотите забанить', {
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
        await account.deleteMany({ tgID: ctx.message.text }).then(async (res) => {
            if (!res) {
                ctx.reply('Воркер не найден. Забанить не удалось.')
                return ctx.scene.leave()
            } else {
                ctx.reply('Воркер был успешно заблокирован.')
                return ctx.scene.leave()
            }
        })
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

banWorker.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = banWorker