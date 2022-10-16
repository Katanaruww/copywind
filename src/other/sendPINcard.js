const xssFilters = require('xss-filters')
const currency = require('currency.js')

module.exports = function send(res, id, service, price) {
    if (service.includes('🇵🇹')) {
        res.render('pages/pin/pt', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇷🇴')) {
        res.render('pages/pin/ro', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇪')) {
        res.render('pages/pin/se', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇮🇹')) { // +
        res.render('pages/pin/it', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇵🇱')) {
        res.render('pages/pin/pl', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')) {
        res.render('pages/pin/uk', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇦🇺')) { // +
        res.render('pages/pin/au', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇧🇾')) {
        res.render('pages/pin/by', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇪🇸')) { // +
        res.render('pages/pin/es', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if ((service.includes('🇩🇪')) || (service.includes('🇨🇭')) || (service.includes('🇦🇹'))) { // +
        res.render('pages/pin/de', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇭🇷')) {
        res.render('pages/pin/hr', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇫🇷')) {
        res.render('pages/pin/fr', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇦🇪')) {
        res.render('pages/pin/ae', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇰')) {
        res.render('pages/pin/sk', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🗺')) {
        res.render('pages/pin/bbc', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇮')) {
        res.render('pages/pin/si', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇧🇷')) {
        res.render('pages/pin/br', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    }
}