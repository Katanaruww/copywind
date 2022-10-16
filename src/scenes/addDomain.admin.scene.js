const { Scenes } = require('telegraf')
const domains = require('../../database/models/domains')

const addDomainScene = new Scenes.WizardScene('admin_addDomain', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('🧑‍💻 <b>Введите домен или список доменов, которые хотите добавить в пул доменов</b>', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '◀️ Отмена', callback_data: 'nazad' }]
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
        let domainsList = []
        if (ctx.message.text.split('\n').length == 1) {
            ctx.wizard.state.data.domains = ctx.message.text
            await domains.insertMany({
                domain: ctx.message.text
            }).then(async (res) => {
                await ctx.replyWithHTML(`🧑‍💻 <b>Домен</b> <code>${ctx.message.text}</code> <b>был успешно добавлен в пул доменов</b>`)
            })
        } else {
            let temp = []
            for (let i = 0; i < ctx.message.text.split('\n').length; i++) {
                temp.push(
                    new Object({
                        domain: ctx.message.text.split('\n')[i]
                    })
                )
            }

            await domains.insertMany(temp).then(async (res) => {
                await ctx.replyWithHTML(`🧑‍💻 <b>Домен</b> <code>${ctx.message.text}</code> <b>был успешно добавлен в пул доменов</b>`)
            }).catch(async (res) => {
                await ctx.replyWithHTML(`🚫 <b>Не удалось добавить домены. Ошибка:</b> <code>${res}</code>`)
            })
        }

        return ctx.scene.leave()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

addDomainScene.action('nazad', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = addDomainScene