const { Scenes } = require('telegraf')
const account = require('../../database/models/account')

const upPercent = new Scenes.WizardScene('upPercent_scene', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.tgID = ctx.callbackQuery.data.split(' ')[1]
        await ctx.replyWithHTML(`<b>🧑‍💻 Введите %, который хотите установить воркеру</b> <code>${ctx.wizard.state.data.tgID}</code>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Отмена', callback_data: `Отмена` }]
                ]
            }
        })
        
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
        await account.findOneAndUpdate({ tgID: ctx.wizard.state.data.tgID }, { $set: { percent: parseInt(ctx.message.text) } }, { new: true }).then(async (res) => {
            await ctx.replyWithHTML(`🧑‍💻 <b>Воркеру</b> <code>${ctx.wizard.state.data.tgID}</code> <b>(</b><code>#${res.tag}</code><b>) был установлен процент при выплатах —</b> <code>${parseInt(ctx.message.text)}%</code>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
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

upPercent.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = upPercent