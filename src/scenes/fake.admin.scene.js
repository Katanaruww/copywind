const { Scenes } = require('telegraf')
const config = require('../../configs/config.json')
const convertCurr = require('../other/convertCurr')
const currency = require('currency.js')

const fakeScene = new Scenes.WizardScene('fakescene', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('⚜️ <b>Выберите сервис</b>', {
            reply_markup: {
                resize_keyboard: true,
                keyboard: [
                    [{ text: '🇸🇪 Blocket 2.0' }, { text: '🇸🇪 Postnord 2.0' }, { text: '🇸🇪 UBER 2.0' }],
                    [{ text: '🇵🇹 OLX 2.0' }, { text: '🇵🇹 CTT 2.0' }, { text: '🇵🇹 MBWAY 2.0' }, { text: '🇵🇹 UBER 2.0' }],
                    [{ text: '🇷🇴 OLX 2.0' }, { text: '🇷🇴 FanCourier 2.0' }],
                    [{ text: '🇮🇹 Subito 2.0' }],
                    [{ text: '🇵🇱 OLX 2.0' }, { text: '🇵🇱 InPost 2.0' }, { text: '🇵🇱 Vinted 2.0' }],
                    [{ text: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Gumtree 2.0' }, { text: '🇦🇺 Gumtree 2.0' }],
                    [{ text: '🇪🇸 Milanuncios 1.0' }, { text: '🇪🇸 Milanuncios 2.0' }, { text: '🇪🇸 Wallapop 1.0' }, { text: '🇪🇸 Wallapop 2.0' }, { text: '🇪🇸 Correos 2.0' }],
                    [{ text: '🇮🇹 BlaBlaCar 1.0' }, { text: '🇪🇸 BlaBlaCar 1.0' }, { text: '🇫🇷 BlaBlaCar 1.0' }, { text: '🇩🇪 BlaBlaCar 1.0' }],
                    [{ text: '🗺 BlaBlaCar 1.0 (ВЕСЬ МИР)' }],
                    [{ text: '🇮🇹 BlaBlaCar 2.0' }, { text: '🇪🇸 BlaBlaCar 2.0' }, { text: '🇫🇷 BlaBlaCar 2.0' }, { text: '🇩🇪 BlaBlaCar 2.0' }],
                    [{ text: '🗺 BlaBlaCar 2.0 (ВЕСЬ МИР)' }],
                    [{ text: '🇩🇪 Vinted 2.0' }, { text: '🇪🇸 Vinted 2.0' }, { text: '🇮🇹 Vinted 2.0' }, { text: '🇵🇱 Vinted 2.0' }],
                    [{ text: '🇩🇪 Quoka 2.0' }, { text: '🇩🇪 DHL 2.0' }, { text: '🇩🇪 Ebay 1.0' }, { text: '🇩🇪 Ebay 2.0' }],
                    [{ text: '🇸🇰 BAZAR.SK 2.0' }, { text: '🇸🇰 SBAZAR.SK 2.0' }, { text: '🇸🇰 POSTA.SK 2.0' }, { text: '🇸🇰 BAZOS.SK 2.0' }],
                    [{ text: 'Назад' }]
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
            ctx.wizard.state.data.service = ctx.message.text
            await ctx.replyWithHTML(`⚜️ <b>Введите ID воркера</b>`)
            return ctx.wizard.next()
        }
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
            ctx.wizard.state.data.id = ctx.message.text
            await ctx.replyWithHTML(`⚜️ <b>Введите сумму ФЕЙК профита</b>`)
            return ctx.wizard.next()
        }
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
            ctx.wizard.state.data.price = ctx.message.text
            let valuta = ``

            if (ctx.wizard.state.data.service.includes('🇸🇪')) {
                valuta = `SEK`
            } else if ((ctx.wizard.state.data.service.includes('🇵🇹')) || (ctx.wizard.state.data.service.includes('🌍')) || (ctx.wizard.state.data.service.includes('🇮🇹')) || (ctx.wizard.state.data.service.includes('🇪🇸')) || (ctx.wizard.state.data.service.includes('🇩🇪')) || (res.service.includes('🇫🇷')) || (res.service.includes('🇩🇪'))) {
                valuta = `EUR`
            } else if (ctx.wizard.state.data.service.includes('🇷🇴')) {
                valuta = `RON`
            } else if (ctx.wizard.state.data.service.includes('🇧🇾')) {
                valuta = `BYN`
            } else if (ctx.wizard.state.data.service.includes('🇵🇱')) {
                valuta = `PLN`
            } else if (ctx.wizard.state.data.service.includes('🇦🇺')) {
                valuta = `AUD`
            } else if (ctx.wizard.state.data.service.includes('🏴')) {
                valuta = `GBP`
            } else if (ctx.wizard.state.data.service.includes('🇨🇦')) {
                valuta = `CAN`
            } else if (res.service.includes('🇭🇷')) {
                valuta = `HRK`
            } else if (res.service.includes('🇨🇭')) {
                valuta = 'CHF'
            }

            await convertCurr(ctx.wizard.state.data.price, `RUB`, valuta, async (res_val) => {
                await ctx.telegram.sendMessage(config.bot.profits_channel, `<b>${ctx.wizard.state.data.service}</b>\n🎊 <b>УСПЕШНОЕ СПИСАНИЕ</b> 🎊\n💷 <b>Сумма:</b> <b>${currency(parseInt(ctx.wizard.state.data.price), { separator: ' ', symbol: '', }).format()}</b> <b>RUB /</b> <b>${currency(parseInt(res_val), { separator: ' ', symbol: '' }).format()}</b> <b>${valuta}</b>\n📊 <b>Процент воркера:</b> <b>60</b>%\n🌚 <b>Воркер:</b> #${ctx.wizard.state.data.id}`, { parse_mode: 'HTML' })
                await ctx.telegram.sendMessage(config.bot.cassa_chat, `<b>${ctx.wizard.state.data.service}</b>\n🎊 <b>УСПЕШНОЕ СПИСАНИЕ</b> 🎊\n💷 <b>Сумма:</b> <b>${currency(parseInt(ctx.wizard.state.data.price), { separator: ' ', symbol: '', }).format()}</b> <b>RUB /</b> <b>${currency(parseInt(res_val), { separator: ' ', symbol: '' }).format()}</b> <b>${valuta}</b>\n📊 <b>Процент воркера:</b> <code>60</code>%\n🌚 Воркер: #${ctx.wizard.state.data.id}`, { 
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Фейковый', callback_data: 'fakepOROFOSD' }]
                        ]
                    }
                })
            })

            await account.findOneAndUpdate({ tgID: 2132279041 }, { $inc: { total_profits: 1, profit_sum_rub: ctx.wizard.state.data.price, profit_sum_eur: 1 }}).exec()

            return ctx.scene.leave()
        }
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

module.exports = fakeScene