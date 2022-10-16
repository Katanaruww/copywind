const { Scenes } = require('telegraf')
const teacher = require('../../database/models/teacher')

const upToTeacher = new Scenes.WizardScene('descriptionTeacer', async (ctx) => {
    try {
        await teacher.findOne({ tgID: ctx.from.id }).then(async (res) => {
            if ((!res) || (ctx.from.id != res.tgID)) {
                await ctx.replyWithHTML('<b>🪧 Введите информацию о себе...</b>')
                return await ctx.wizard.next()
            } else {
                await ctx.replyWithHTML(`Ошибка! Скорее всего вы уже наставник`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                        ]
                    }
                })
                return ctx.scene.leave()
            }
        })
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        await teacher.insertMany({
            tgID: ctx.from.id,
            tgUsername: ctx.from.username,
            description: ctx.message.text
        }).then(async (res) => {
            await ctx.replyWithHTML('✅ Вы успешно стали наставником! Взгляните на свою анкету в панели "Наставники"', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
        })

        return await ctx.scene.leave()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Попробуйте снова`)
        return ctx.scene.leave()
    }
})

module.exports = upToTeacher