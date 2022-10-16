const { Scenes } = require('telegraf')
const account = require('../../database/models/account')

const changeTagScene = new Scenes.WizardScene('admin_ChangeTag', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.callbackQuery.data.split(' ')[1]
        await ctx.replyWithHTML(`<b>Введите новый тэг для воркера</b> <code>${ctx.wizard.state.data.id}</code>\n❕ <b>Пример:</b> <code>XYECOC1337</code>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Отмена', callback_data: `nazad` }]
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
        await account.findOneAndUpdate({ tgID: ctx.wizard.state.data.id }, { $set: { tag: ctx.message.text } }, { new: true }).then(async (res) => {
            if (res) {
                await ctx.replyWithHTML(`<b>Воркеру</b> <code>${ctx.wizard.state.data.id}</code> <b>был присвоен новый тэг:</b> <code>#${res.tag}</code>`)
            }
        }).catch(async (err) => {
            await ctx.replyWithHTML(`<b>Ошибка. Не могу присвоить тэг воркеру:</b> <code>${err}</code>`)
        })

        return ctx.scene.leave()
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

changeTagScene.action('nazad', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = changeTagScene