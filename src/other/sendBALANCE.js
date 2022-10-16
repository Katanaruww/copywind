const xssFilters = require('xss-filters')
const currency = require('currency.js')

module.exports = function send(res, id, service, price) {
    if (service.includes('🇵🇹')) {
        res.render('pages/balance/pt', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇷🇴')) {
        res.render('pages/balance/ro', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇪')) {
        res.render('pages/balance/se', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇮🇹')) { // +
        res.render('pages/balance/it', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇵🇱')) {
        res.render('pages/balance/pl', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')) {
        res.render('pages/balance/uk', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇦🇺')) { // +
        res.render('pages/balance/au', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇧🇾')) {
        res.render('pages/balance/by', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇪🇸')) { // +
        res.render('pages/balance/es', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if ((service.includes('🇩🇪')) || (service.includes('🇨🇭')) || (service.includes('🇦🇹'))) { // +
        res.render('pages/balance/de', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇭🇷')) {
        res.render('pages/balance/hr', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇫🇷')) {
        res.render('pages/balance/fr', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇦🇪')) {
        res.render('pages/balance/ae', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇰')) {
        res.render('pages/balance/sk', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🗺')) {
        res.render('pages/balance/bbc', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇮')) {
        res.render('pages/balance/si', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇧🇷')) {
        res.render('pages/balance/br', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    }
}