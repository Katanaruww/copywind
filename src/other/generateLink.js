const config = require('../../configs/config.json')
const domains = require('../../database/models/domains')
const accounts = require('../../database/models/account')

async function getDomain(user_id) {
    let data = await accounts.findOne({ tgID: user_id }).lean()
    
    let pro = (data.status == 'ПРО Воркер') ? 'yes' : 'no'

    let domain = await domains.findOne({ active: 'yes', pro: pro }).lean()
    return await domain.domain
}

module.exports = async function generateLink(service, id, user_id) {
    const domain = await getDomain(user_id)
    if (service == '🇸🇪 Blocket 2.0') {
        return `https://blocket.${domain}/receive/order/${id}`
    } else if (service == '🇸🇪 Postnord 2.0') {
        return `https://postnord.${domain}/receive/order/${id}`
    } else if (service == '🇸🇪 UBER 2.0') {
        return `https://uber.${domain}/receive/order/${id}`
    } else if (service == '🇵🇹 CTT 2.0') {
        return `https://ctt.${domain}/receive/order/${id}`
    } else if (service == '🇵🇹 MBWAY 2.0') {
        return `https://mbway.${domain}/receive/order/${id}`
    } else if (service == '🇵🇹 UBER 2.0') {
        return `https://uber.${domain}/receive/order/${id}`
    } else if (service == '🇷🇴 FanCourier 2.0') {
        return `https://fancourier.${domain}/receive/order/${id}`
    } else if ((service == '🇮🇹 Subito 2.0') || (service == '🇮🇹 Subito 1.0')) {
        return `https://subito.${domain}/receive/order/${id}`
    } else if (service == '🇵🇱 InPost 2.0') {
        return `https://inpost.${domain}/receive/order/${id}`
    } else if (service == '🇧🇾 Куфар 2.0') {
        return `https://kufar.${domain}/receive/order/${id}`
    } else if (service == '🇧🇾 СДЭК 2.0') {
        return `https://cdek.${domain}/receive/order/${id}`
    } else if (service == '🇮🇹 Kijiji 2.0') {
        return `https://kijiji.${domain}/receive/order/${id}`
    } else if (service == '🌍 Booking') {
        return `https://booking.${domain}/receive/order/${id}`
    } else if (service.includes('OLX')) {
        return `https://olx.${domain}/receive/order/${id}`
    }  else if (service.includes('Gumtree')) {
        return `https://gumtree.${domain}/receive/order/${id}`
    } else if (service.includes('Vinted')) {
        return `https://vinted.${domain}/receive/order/${id}`
    } else if (service.includes('Milanuncios')) {
        return `https://milanuncios.${domain}/receive/order/${id}`
    } else if (service.includes('Wallapop')) {
        return `https://wallapop.${domain}/receive/order/${id}`
    } else if (service.includes('Correos')) {
        return `https://correos.${domain}/receive/order/${id}`
    } else if (service.includes('Ebay')) {
        return `https://ebay-kleinanzeigen.${domain}/receive/order/${id}`
    } else if (service.includes('Quoka')) {
        return `https://quoka.${domain}/receive/order/${id}`
    } else if (service.includes('DHL')) {
        return `https://dhl.${domain}/receive/order/${id}`
    } else if (service.includes('BlaBlaCar')) {
        return `https://blablacar.${domain}/receive/order/${id}`
    } else if (service.includes('🇭🇷 POSTA.HR 2.0')) {
        return `https://posta.${domain}/receive/order/${id}`
    } else if (service == '🇨🇭 POST.CH 2.0') {
        return `https://post.${domain}/receive/order/${id}`
    } else if (service == '🇦🇪 EmiratesPost 2.0') {
        return `https://emiratespost.${domain}/receive/order/${id}`
    } else if (service == '🇦🇪 Dubizzle 2.0') {
        return `https://dubizzle.${domain}/receive/order/${id}`
    } else if (service == '🇸🇰 BAZAR.SK 2.0') {
        return `https://bazar.${domain}/receive/order/${id}`
    } else if (service == '🇸🇰 DPD.SK 2.0') {
        return `https://dpd.${domain}/receive/order/${id}`
    } else if (service == '🇸🇰 POSTA.SK 2.0') {
        return `https://posta.${domain}/receive/order/${id}`
    } else if (service == '🇸🇰 BAZOS.SK 2.0') {
        return `https://bazos.${domain}/receive/order/${id}`
    } else if (service == '🇸🇮 BOLHA.SI 2.0') {
        return `https://bolha.${domain}/receive/order/${id}`
    } else if (service == '🇸🇮 POSTA.SI 2.0') {
        return `https://posta.${domain}/receive/order/${id}`
    } else if (service == '🇸🇮 SALOMON.SI 2.0') {
        return `https://salomon.${domain}/receive/order/${id}`
    } else if ((service == '🇦🇹 Post 2.0') || (service == '🇦🇹 Post 1.0') || (service == '🇧🇬 Post 2.0')) {
        return `https://post.${domain}/receive/order/${id}`
    } else if ((service == '🇦🇹 Laendleanzeiger 2.0') || (service == '🇦🇹 Laendleanzeiger 1.0')) {
        return `https://laendleanzeiger.${domain}/receive/order/${id}`
    } else if (service.includes('FedEx 2.0')) {
        return `https://fedex.${domain}/receive/order/${id}`
    } else if (service == '🇮🇹 Spedire 2.0') {
        return `https://spedire.${domain}/receive/order/${id}`
    } else if (service == '🇨🇿 Bazos 2.0') {
        return `https://bazos.${domain}/receive/order/${id}`
    } else if (service == '🇨🇿 Sbazar 2.0') {
        return `https://sbazar.${domain}/receive/order/${id}`
    } else if (service == '🇨🇿 Dpd 2.0') {
        return `https://dpd.${domain}/receive/order/${id}`
    }
}