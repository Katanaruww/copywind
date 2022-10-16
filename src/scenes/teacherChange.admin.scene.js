const { Scenes } = require('telegraf')
const teacher = require('../../database/models/teacher')

const changeDescription = new Scenes.WizardScene('changeDescriptionTeacher', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.callbackQuery.data.split(' ')[1]

        await ctx.replyWithHTML(`<b>❕ Введите новое описание для наставника.</b>\n❔ Дизайн текста можно изменять с помощью HTML тэгов, для уточнения и корректировки текста с дизайном уточняйте у кодера.`, {
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
        ctx.wizard.state.data.text = ctx.message.text
        await teacher.findOneAndUpdate({ tgID: ctx.wizard.state.data.id }, { $set: { description: ctx.wizard.state.data.text } }, { new: true }).then(async (res) => {
            if (res) {
                await ctx.replyWithHTML(`🧑‍🏫 <b>Описание наставника</b> <code>${ctx.wizard.state.data.id}</code> <b>было успешно изменено</b>`)
            }
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

changeDescription.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = changeDescription