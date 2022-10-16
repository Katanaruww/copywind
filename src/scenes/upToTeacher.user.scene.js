const { Scenes } = require('telegraf')
const config = require('../../configs/config.json')

const upToTeacher = new Scenes.WizardScene('upToTeacher', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.tgID = ctx.from.id
        ctx.wizard.state.data.tgUsername = ctx.from.username

        await ctx.replyWithHTML('1️⃣ <b>Расскажите о своём опыте максимально подробно!</b>', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Отмена', callback_data: `Отмена` }]
                ]
            }
        })
        return await ctx.wizard.next()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        if (ctx.message.text == 'Назад') {
            await ctx.replyWithHTML(`Вернитесь в меню.`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
    
            return ctx.scene.leave()
        } else {
            ctx.wizard.state.data.exp = ctx.message.text

            await ctx.replyWithHTML('2️⃣ <b>Отправьте ссылки на скриншоты с вашими профитами (в одном сообщении)</b>')
            return await ctx.wizard.next()
        }
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        if (ctx.message.text == 'Назад') {
            await ctx.replyWithHTML(`Вернитесь в меню.`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
    
            return ctx.scene.leave()
        } else {
            ctx.wizard.state.data.proofs = ctx.message.text

            await ctx.replyWithHTML('3️⃣ <b>Заявка на становлением наставником была передана администрации. Ожидайте...</b>')
            await ctx.telegram.sendMessage(config.bot.request_logs, `🏦 <b>Заявка на наставника!</b>\n\n<b>Воркер:</b> @${ctx.wizard.state.data.tgUsername} (${ctx.wizard.state.data.tgID})\n\n<b>Опыт:</b> ${ctx.wizard.state.data.exp}\n<b>Пруфы ворка:</b> ${ctx.wizard.state.data.proofs}`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '✅ Принять и отправить на заполнение "о себе"', callback_data: `accessTeacher ${ctx.wizard.state.data.tgID}` }],
                        [{ text: '❌ Отклонить', callback_data: `denyTeacher ${ctx.wizard.state.data.tgID}` }]
                    ]
                }
            })
            return await ctx.scene.leave()
        }
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

upToTeacher.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = upToTeacher