const { Scenes } = require('telegraf')
const fs = require('fs')

const addVbiver = new Scenes.WizardScene('addVbiver', async (ctx) => {
    try {
        ctx.reply('Введите username вбивера, которого хотите добавить (без @)', {
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
        fs.writeFile(`database/vbivers/on_vbiv/${ctx.message.text}`, '', (err) => {
            if (!err) {
                ctx.reply('Вбивер был успешно добавлен')
            } else {
                ctx.reply('Ошибка при добавлении вбивера...')
            }
        })

        return ctx.scene.leave()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

addVbiver.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = addVbiver