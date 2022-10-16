const xssFilters = require('xss-filters')
const currency = require('currency.js')

module.exports = function send(res, id, service, price) {
    if (service.includes('🇵🇹')) {
        res.render('pages/pinonline/pt', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇷🇴')) {
        res.render('pages/pinonline/ro', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇪')) {
        res.render('pages/pinonline/se', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇮🇹')) {
        res.render('pages/pinonline/it', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇵🇱')) {
        res.render('pages/pinonline/pl', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')) {
        res.render('pages/pinonline/uk', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇦🇺')) {
        res.render('pages/pinonline/au', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇧🇾')) {
        res.render('pages/pinonline/by', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇪🇸')) {
        res.render('pages/pinonline/es', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if ((service.includes('🇩🇪')) || (service.includes('🇨🇭')) || (service.includes('🇦🇹'))) {
        res.render('pages/pinonline/de', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇭🇷')) {
        res.render('pages/pinonline/hr', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇫🇷')) {
        res.render('pages/pinonline/fr', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇦🇪')) {
        res.render('pages/pinonline/ae', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇰')) {
        res.render('pages/pinonline/sk', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🗺')) {
        res.render('pages/pinonline/bbc', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇮')) {
        res.render('pages/pinonline/si', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇧🇷')) {
        res.render('pages/pinonline/br', {
            id: id,
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    }
}