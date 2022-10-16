const { Scenes } = require('telegraf')
const request = require('request')
const config = require('../../configs/config.json')

const domains = require('../../database/models/domains')
const support = require('../../database/models/support')

const sendDefScene = new Scenes.WizardScene('sendMessageDefault', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.callbackQuery.data.split(' ')[1]
        await ctx.reply('Введите сообщение, которое хотите отправить', {
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
        await support.insertMany({
            id: ctx.wizard.state.data.id,
            who: 'Support',
            text: ctx.message.text,
            time: parseInt(new Date().getTime() / 1000)
        }).then(async (res) => {
            ctx.replyWithHTML(`📩 <b>Сообщение было доставлено!</b>`, {  reply_to_message_id: ctx.message.message_id });
        }).catch(async (err) => {
            ctx.replyWithHTML(`📩 <b>Ошибка в доставке сообщения!</b>\n<b>❔ Перешлите это сообщение ТСу:</b> <code>${err}</code>`)
        })

        return ctx.scene.leave()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

sendDefScene.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = sendDefScene