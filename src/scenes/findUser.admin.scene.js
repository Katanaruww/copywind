const { Scenes } = require('telegraf')
const accounts = require('../../database/models/account')
const receive = require('../../database/models/receive')
const bbc = require('../../database/models/bbc')

const findUser = new Scenes.WizardScene('admin_findUser', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>🧑‍💻 Введите Telegram ID воркера.</b>', {
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
        ctx.wizard.state.data.tgid = ctx.message.text

        ctx.wizard.state.data.links = 0
        await receive.find({ tgID: ctx.wizard.state.data.tgid }).then(async (res) => { ctx.wizard.state.data.links += res.length })
        await bbc.find({ tgID: ctx.wizard.state.data.tgid }).then(async (res) => { ctx.wizard.state.data.links += res.length })

        await accounts.findOne({ tgID: ctx.wizard.state.data.tgid }).then(async (res) => {
            if (res) {
                await ctx.replyWithHTML(`🦣 <b>Воркер:</b> #${res.tag}\n\n<b>🆔 ID:</b> ${res.tgID}\n<b>⚖️ Ставка:</b> ${(res.percent != undefined) ? res.percent : 60}%\n🥷 <b>PRO:</b> ${(res.status == 'Воркер') ? 'Воркер' : (res.status == 'ПРО Воркер') ? 'ПРО Воркер' : (res.status == undefined) ? 'Воркер' : 'Воркер'}\n\n<b>💸 Профитов:</b> ${res.total_profits}\n<b>💸 Профитов с наставником:</b> ${res.profits_with_teacher}\n\n<b>🚚 Объявлений:</b> ${ctx.wizard.state.data.links}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🛑 Заблокировать', callback_data: `Заблокировать воркера` }],
                            [{ text: `⚙️ Изменить тэг`, callback_data: `admin_changeTag ${ctx.wizard.state.data.tgid}` }],
                            [{ text: '🧑‍🏫 Удалить наставника', callback_data: `admin_teacherdelete ${ctx.wizard.state.data.tgid}` }],
                            [{ text: '💲 Изменить процент', callback_data: `admin_percent ${ctx.wizard.state.data.tgid}` }],
                            [{ text: '🔥 Выдать PRO доступ', callback_data: `admin_proAcces ${ctx.wizard.state.data.tgid}` }],
                            [{ text: '🔥 Забрать PRO доступ', callback_data: `admin_proBACK ${ctx.wizard.state.data.tgid}` }],
                            [{ text: '🗑 Удалить все объявления', callback_data: `admin_deleteAll ${ctx.wizard.state.data.tgid}` }],
                            [{ text: '◀️ Назад', callback_data: `⬅️ Назад` }]
                        ]
                    }
                })
            } else {
                await ctx.replyWithHTML(`Пользователь не найден. Вернитесь в меню и попробуйте снова.`)
                return ctx.scene.leave()
            }
        })

        return ctx.scene.leave()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

findUser.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = findUser