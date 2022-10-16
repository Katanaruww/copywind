const { Scenes } = require('telegraf')
const config = require('../../configs/config.json')

const account = require('../../database/models/account')
const teacher = require('../../database/models/teacher')
const receive = require('../../database/models/receive')
const cassa = require('../../database/models/cassa')
const bbc = require('../../database/models/bbc')

const convertCurr = require('../other/convertCurr2')
const getCurrentDate = require('../other/getCurrentDate')

const currency = require('currency.js')

// const successScene = new Scenes.BaseScene('success')
const successScene = new Scenes.WizardScene('success', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.vbiver_id = ctx.from.id
        ctx.wizard.state.data.vbiverUS = ctx.from.username
        ctx.wizard.state.data.link = ctx.callbackQuery.data.split(' ')[1]

        await ctx.replyWithHTML(`Введите сумму профита в рублях\nДля отмены нажмите кнопку ниже`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Отмена', callback_data: `Отмена` }]
                ]
            }
        })

        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        if (ctx.message.text != NaN) {
            if (parseInt(ctx.message.text) < 0) {
                await ctx.replyWithHTML(`Сумма профита не может быть меньше 0`)
                return ctx.scene.leave()
            } else {
                ctx.wizard.state.data.price = parseInt(ctx.message.text)
                let data = await receive.findOne({ link: ctx.wizard.state.data.link }).lean()
                if (!data) data = await bbc.findOne({ link: ctx.wizard.state.data.link }).lean()
                
                let accData = await account.findOne({ tgID: data.tgID }).lean()
                let res_percent = (accData.percent != undefined) ? accData.percent : 60
    
                let msg = [
                    `<b>💰 НОВЫЙ ЗАЛЕТ | ${data.service}</b>`, // 0
                    `✅ <b>Профит добавлен воркеру</b> @${data.tgUsername} (${data.tgID})`, // 1
                    `💸 <b>Сумма: ${ctx.wizard.state.data.price} RUB</b>`, // 2
                    `\n`, // 3
                    `💰 <b>Выплата: ... RUB</b>`, // 4
                    `💰 <b>BTC адрес:</b> <code>${(accData.btc != undefined) ? accData.btc : 'Не присвоен.'}</code>`, // 5
                    ``, // 6
                    ``, // 7
                    ``, // 8
                    `🤖 <b>Выплата заму: ${parseInt(ctx.wizard.state.data.price) / 100 * 8} RUB</b>`, // 9
                    `👨‍💻 <b>Выплата кодеру: ${parseInt(ctx.wizard.state.data.price) / 100 * 7} RUB</b>`, // 10
                    `💳 <b>Вбил: ${ctx.from.username}</b> <b>(${parseInt(ctx.wizard.state.data.price) / 100 * 10} RUB)</b>`
                ]
    
                if (data.sms == 'yes') {
                    res_percent -= 5
                    msg[6] = `💌 <b>Выплата смсеру: ${parseInt(ctx.wizard.state.data.price) / 100 * 7.5} RUB</b>`
                    try {
                        await ctx.telegram.sendMessage(633715506, `СПАСИБО ЗА СМС СЕРВИС БРАТАНЧИК\n\nпрофит на сумму ${ctx.wizard.state.data.price} RUB\nтвой процентик братанчик ${parseInt(ctx.wizard.state.data.price) / 100 * 7.5} RUB\n\nно сука) было бы апи) было бы ващеее бомба балджееееж`)
                    } catch (e) {
                        console.log('cant send message to gooso about profit')
                    }
                }
    
                if (data.email == 'yes') {
                    res_percent -= 5
                    msg[7] = `💌 <b>Выплата емейлеру: ${parseInt(ctx.wizard.state.data.price) / 100 * 5} RUB</b>`
                }
    
                if (accData.teacher != 'Отсутствует') {
                    res_percent -= 5
                    msg[8] = `👨‍🎓 <b>Выплата наставнику: ${parseInt(ctx.wizard.state.data.price) / 100 * 5} RUB (@${accData.teacher})</b>`
                    await teacher.findOneAndUpdate({ tgUsername: accData.teacher }, { $inc: { profits_count: 1, profits_rub: ctx.wizard.state.data.price } }, { new: true }).then(async (res) => {
                        await ctx.telegram.sendMessage(res.tgID, `👨‍🎓 <b>Ваш ученик (@${data.tgUsername}) сделал профит!</b> 👨‍🎓\n\n<b>🗳 Сервис: ${data.service}</b>\n💸 <b>Сумма: ${ctx.wizard.state.data.price} RUB</b>`, { parse_mode: 'HTML' })
                    })
                }
    
                let total = parseInt(ctx.wizard.state.data.price) / 100 * res_percent
                msg[4] = msg[4].replace('...', total)
    
                /* post profits and etc */
                await ctx.telegram.sendMessage(config.bot.cassa_chat, msg.join('\n'), { parse_mode: 'HTML' })
    
                convertCurr(data.service, parseInt(ctx.wizard.state.data.price)).then(async (vvv) => {
                    let msg_profit = `<b>${(accData.hide_service == 'yes') ? '👀 Сервис скрыт' : data.service}</b>\n🎊 <b>УСПЕШНОЕ СПИСАНИЕ</b> 🎊\n💷 <b>Сумма:</b> <b>${currency(parseInt(ctx.wizard.state.data.price), { separator: ' ', symbol: '', }).format()} RUB</b>\n📊 <b>Процент воркера:</b> <b>${res_percent}</b>%\n🌚 <b>Воркер:</b> #${accData.tag}`
                    /* let msg_profit = `🔥 <b>УСПЕШНО ${data.service}</b>\n💲 <b>Сумма: ${currency(parseInt(ctx.wizard.state.data.price), { separator: ' ', symbol: '', }).format()} RUB</b>\n💲 <b>Ваш процент: ${res_percent}%</b>\n👤 <b>Завёл: @${data.tgUsername}</b>\n🎩 <b>Вбивал: ${ctx.from.username}</b>` */
                    if (accData.teacher != 'Отсутствует') {
                        msg_profit += `\n👨‍🎓 <b>Наставник:</b> @${accData.teacher}`
                    }
    
                    /* await ctx.telegram.sendMessage(data.tgID, `📬 <b>${data.service}:</b> <code>Успешная оплата! 🥳</code>\n\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n✅ <b>Сумма:</b> <code>${currency(parseInt(ctx.wizard.state.data.price), { separator: ' ', symbol: '', }).format()}</code> <b>RUB</b> ✅\n💰 <b>Выплата:</b> <code>${total}</code> RUB\n💵 <b>Статус:</b> [<code>В обработке</code>] 💵\n<b>❌ Внимание:</b> курс EUR к рублю является условным и статичным, сугубо для ориентирования. Выплата производится по актуальному курсу.\n\n❌ <b>Внимание!</b>\n👉🏼 Не меняйте свой @username до того момента как получите выплату\n👉🏼 СВЕРЯЙТЕ данные людей которые представляются АДМИНИСТРАЦИЕЙ с реальными из чата\n👉🏼 Если не уверены — СПРОСИТЕ В ЧАТЕ`, {
                        parse_mode: 'HTML'
                    }).catch(async (e) => { console.log(e) }) */

                    await ctx.telegram.sendVideo(data.tgID, 'https://i.imgur.com/BnrNqGt.mp4', {
                        parse_mode: 'HTML',
                        caption: `📬 <b>${data.service}:</b> <code>Успешная оплата! 🥳</code>\n\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n✅ <b>Сумма:</b> <code>${currency(parseInt(ctx.wizard.state.data.price), { separator: ' ', symbol: '', }).format()}</code> <b>RUB</b> ✅\n💰 <b>Выплата:</b> <code>${total}</code> RUB\n💵 <b>Статус:</b> [<code>В обработке</code>] 💵\n<b>❌ Внимание:</b> курс EUR к рублю является условным и статичным, сугубо для ориентирования. Выплата производится по актуальному курсу.\n\n❌ <b>Внимание!</b>\n👉🏼 Не меняйте свой @username до того момента как получите выплату\n👉🏼 СВЕРЯЙТЕ данные людей которые представляются АДМИНИСТРАЦИЕЙ с реальными из чата\n👉🏼 Если не уверены — СПРОСИТЕ В ЧАТЕ`
                    }).catch(async (e) => { console.log(e) })
    
                    await ctx.telegram.sendMessage(config.bot.profits_channel, msg_profit, {  parse_mode: 'HTML' }).catch(async (e) => { console.log(e) })
    
                    let todayDate = getCurrentDate()
                    await cassa.insertMany({
                        link: data.link,
                        date: todayDate,
                        who_vbiver: ctx.from.username,
                        vbiver: parseInt(ctx.wizard.state.data.price) / 100 * 10,
                        zam: parseInt(ctx.wizard.state.data.price) / 100 * 10,
                        coder: parseInt(ctx.wizard.state.data.price) / 100 * 7,
                        sumToTake: total,
                        all: parseInt(ctx.wizard.state.data.price),

                        kurator: (accData.teacher != 'Отсутствует') ? parseInt(ctx.wizard.state.data.price) / 100 * 5 : 0,
                        kurator_name: (accData.teacher != 'Отсутствует') ? `${accData.teacher}` : 'no',

                        emailer: (data.email == 'yes') ? parseInt(ctx.wizard.state.data.price) / 100 * 5 : 0,
                        smser: (data.sms == 'yes') ? parseInt(ctx.wizard.state.data.price) / 100 * 7.5 : 0
                    }).then(async (res_cassa) => {
                        console.log(res_cassa[0])
                    }).catch(async (err_cassa) => {
                        console.log(`cant write the record in cassa db => ${err_cassa}`)
                    })
                })
    
                await account.findOneAndUpdate({ tgID: data.tgID }, { $inc: { total_profits: 1, profit_sum_rub: ctx.wizard.state.data.price }}, { new: true }).then(async (res) => {
                    if (res.total_profits == 5) {
                        await ctx.telegram.sendMessage(data.tgID, `🎉 <b>Поздравляем! Вам был выдан доступ к PRO системе!</b> 🎊\n\n❔ <b>В чём заключаются преимущества:</b>\n1️⃣ <b>Повышенный процент при выплатах (</b><code>63%</code><b>)</b>\n2️⃣ <b>Доступ к PRO доменам</b>`, { 
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: 'Чат PRO Воркеров 💬', url: 'https://t.me/+IBJ2iR-TQ0JhYWZi' }]
                                ]
                            }
                        })
                        await account.findOneAndUpdate({ tgID: data.tgID }, { $set: { status: "ПРО Воркер", percent: 55 } }, { new: true })
                    }
                })
                
                return ctx.scene.leave()
            }
        }
    } catch (e) {
        console.log(e)
        return ctx.scene.leave() 
    }
})

// successScene.enter(async (ctx) => {
//     try {
//         ctx.session.data = {}
//         ctx.session.data.vbiver_id = ctx.from.id
//         ctx.session.data.vbiverUS = ctx.from.username
//         ctx.session.data.link = ctx.callbackQuery.data.split(' ')[1]

//         await ctx.replyWithHTML(`Введите сумму профита в рублях\nДля отмены нажмите кнопку ниже`, {
//             reply_markup: {
//                 inline_keyboard: [
//                     [{ text: 'Отмена', callback_data: `Отмена` }]
//                 ]
//             }
//         })
//     } catch (e) {
//         console.log(e)
//         return ctx.scene.leave()
//     }
// })

// successScene.on('text', async (ctx) => {
//     try {
//         if (parseInt(ctx.message.text) < 0) {
//             await ctx.replyWithHTML(`Сумма профита не может быть меньше 0`)
//             return ctx.scene.leave()
//         } else {
//             ctx.session.data.price = parseInt(ctx.message.text)
//             let data = await receive.findOne({ link: ctx.session.data.link }).lean()
//             if (!data) data = await bbc.findOne({ link: ctx.session.data.link }).lean()
            
//             let accData = await account.findOne({ tgID: data.tgID }).lean()
//             let res_percent = (accData.percent != undefined) ? accData.percent : 60

//             let msg = [
//                 `<b>💰 НОВЫЙ ЗАЛЕТ | ${data.service}</b>`, // 0
//                 `✅ <b>Профит добавлен воркеру</b> @${data.tgUsername} (${data.tgID})`, // 1
//                 `💸 <b>Сумма: ${ctx.session.data.price} RUB</b>`, // 2
//                 `\n`, // 3
//                 `💰 <b>Выплата: ... RUB</b>`, // 4
//                 `💰 <b>BTC адрес:</b> <code>${(accData.btc != undefined) ? accData.btc : 'Не присвоен.'}</code>`, // 5
//                 ``, // 6
//                 ``, // 7
//                 ``, // 8
//                 `🤖 <b>Выплата заму: ${parseInt(ctx.session.data.price) / 100 * 8} RUB</b>`, // 9
//                 `👨‍💻 <b>Выплата кодеру: ${parseInt(ctx.session.data.price) / 100 * 7} RUB</b>`, // 10
//                 `💳 <b>Вбил: ${ctx.from.username}</b> <b>(${parseInt(ctx.session.data.price) / 100 * 10} RUB)</b>`
//             ]

//             if (data.sms == 'yes') {
//                 res_percent -= 5
//                 msg[6] = `💌 <b>Выплата смсеру: ${parseInt(ctx.session.data.price) / 100 * 5} RUB</b>`
//             }

//             if (data.email == 'yes') {
//                 res_percent -= 5
//                 msg[7] = `💌 <b>Выплата емейлеру: ${parseInt(ctx.session.data.price) / 100 * 5} RUB</b>`
//             }

//             if (accData.teacher != 'Отсутствует') {
//                 res_percent -= 5
//                 msg[8] = `👨‍🎓 <b>Выплата наставнику: ${parseInt(ctx.session.data.price) / 100 * 5} RUB (@${accData.teacher})</b>`
//                 await teacher.findOneAndUpdate({ tgUsername: accData.teacher }, { $inc: { profits_count: 1, profits_rub: ctx.session.data.price } }, { new: true }).then(async (res) => {
//                     await ctx.telegram.sendMessage(res.tgID, `👨‍🎓 <b>Ваш ученик (@${data.tgUsername}) сделал профит!</b> 👨‍🎓\n\n<b>🗳 Сервис: ${data.service}</b>\n💸 <b>Сумма: ${ctx.session.data.price} RUB</b>`, { parse_mode: 'HTML' })
//                 })
//             }

//             let total = parseInt(ctx.session.data.price) / 100 * res_percent
//             msg[4] = msg[4].replace('...', total)

//             /* post profits and etc */
//             await ctx.telegram.sendMessage(config.bot.cassa_chat, msg.join('\n'), { parse_mode: 'HTML' })

//             convertCurr(data.service, parseInt(ctx.session.data.price)).then(async (vvv) => {
//                 let msg_profit = `<b>${data.service}</b>\n🎊 <b>УСПЕШНОЕ СПИСАНИЕ</b> 🎊\n💷 <b>Сумма:</b> <b>${currency(parseInt(ctx.session.data.price), { separator: ' ', symbol: '', }).format()}</b> <b>RUB /</b> <b>${currency(parseInt(ctx.session.data.price * 0.0116), { separator: ' ', symbol: '' }).format()}</b> <b>EUR</b>\n📊 <b>Процент воркера:</b> <b>${res_percent}</b>%\n🌚 <b>Воркер:</b> #${accData.tag}`
//                 if (accData.teacher != 'Отсутствует') {
//                     msg_profit += `\n👨‍🎓 <b>Наставник:</b> @${accData.teacher}`
//                 }

//                 await ctx.telegram.sendVideo(data.tgID, 'https://i.imgur.com/BnrNqGt.mp4', {
//                     parse_mode: 'HTML',
//                     caption: `📬 <b>${data.service}:</b> <code>Успешная оплата! 🥳</code>\n\n📬 <b>Товар:</b> <code>${(data.product_name != undefined) ? data.product_name : `${data.city_from} -> ${data.city_to}`}</code>\n✅ <b>Сумма:</b> <code>${currency(parseInt(ctx.session.data.price), { separator: ' ', symbol: '', }).format()}</code> <b>RUB /</b> <code>${currency(parseInt(ctx.session.data.price * 0.0116), { separator: ' ', symbol: '' }).format()}</code> <b>EUR</b> ✅\n💰 <b>Выплата:</b> <code>${total}</code> RUB\n💵 <b>Статус:</b> [<code>В обработке</code>] 💵\n<b>❌ Внимание:</b> курс EUR к рублю является условным и статичным, сугубо для ориентирования. Выплата производится по актуальному курсу.\n\n❌ <b>Внимание!</b>\n👉🏼 Не меняйте свой @username до того момента как получите выплату\n👉🏼 СВЕРЯЙТЕ данные людей которые представляются АДМИНИСТРАЦИЕЙ с реальными из чата\n👉🏼 Если не уверены — СПРОСИТЕ В ЧАТЕ`
//                 }).catch(async (e) => { console.log(e) })

//                 await ctx.telegram.sendMessage(config.bot.profits_channel, msg_profit, { parse_mode: 'HTML' }).catch(async (e) => { console.log(e) })

//                 let todayDate = getCurrentDate()
//                 await cassa.insertMany({
//                     link: data.link,
//                     date: todayDate,
//                     who_vbiver: ctx.from.username,
//                     vbiver: parseInt(ctx.session.data.price) / 100 * 10,
//                     zam: parseInt(ctx.session.data.price) / 100 * 10,
//                     coder: parseInt(ctx.session.data.price) / 100 * 7,
//                     sumToTake: total
//                 }).then(async (res_cassa) => {
//                     console.log(res_cassa[0])
//                 }).catch(async (err_cassa) => {
//                     console.log(`cant write the record in cassa db => ${err_cassa}`)
//                 })
//             })

//             await account.findOneAndUpdate({ tgID: data.tgID }, { $inc: { total_profits: 1, profit_sum_rub: ctx.session.data.price }}, { new: true }).then(async (res) => {
//                 if (res.total_profits == 5) {
//                     await ctx.telegram.sendMessage(data.tgID, `🎉 <b>Поздравляем! Вам был выдан доступ к PRO системе!</b> 🎊\n\n❔ <b>В чём заключаются преимущества:</b>\n1️⃣ <b>Повышенный процент при выплатах (</b><code>63%</code><b>)</b>\n2️⃣ <b>Доступ к PRO доменам</b>\n3️⃣ <b>Возможность установить свой домен (</b><code>оговаривается лично с кодером (связаться можно через ТСа)</code><b>)</b>`, { parse_mode: 'HTML' })
//                     await account.findOneAndUpdate({ tgID: data.tgID }, { $set: { status: "ПРО Воркер", percent: 63 } }, { new: true })
//                 }
//             })
            
//             return ctx.scene.leave()
//         }
//     } catch (e) {
//         console.log(e)
//         return ctx.scene.leave()
//     }
// })

successScene.action('Отмена', async (ctx) => {
    await ctx.deleteMessage(ctx.update.callback_query.message.message_id)
    return await ctx.scene.leave()
})

module.exports = successScene