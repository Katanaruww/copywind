const { Scenes } = require('telegraf')
const fs = require('fs')

const delVbiver = new Scenes.WizardScene('delVbiver', async (ctx) => {
    try {
        ctx.reply('Введите username вбивера, которого хотите удалить (без @)', {
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
        fs.unlink(`database/vbivers/${ctx.message.text}`, (err) => {
            if (!err) {
                ctx.reply('Вбивер был успешно удален')
            } else {
                ctx.reply('Ошибка при удалении вбивера...')
            }
        })

        try {
            fs.unlink(`database/vbivers/on_vbiv/${ctx.message.text}`, (err) => {
                if (!err) {
                    ctx.reply('Вбивер был успешно удален из списка "на вбиве"')
                }
            })
        } catch (e) {
            // 
        }

        return ctx.scene.leave()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

delVbiver.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = delVbiver