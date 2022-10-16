const bot = require('../bot')

module.exports = async function response(res, tgid) {
    await bot.telegram.sendMessage(tgid, 'click on me', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'test', callback_data: 'testtttt' }]
            ]
        }
    })

    bot.on('callback_query', async (q) => {
        console.log(q)
    })

    return res
}