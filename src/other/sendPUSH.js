const xssFilters = require('xss-filters')
const currency = require('currency.js')

module.exports = function send(res, id, service, price) {
    if (service.includes('🇵🇹')) {
        res.render('pages/push/pPT', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇷🇴')) {
        res.render('pages/push/pRO', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇪')) {
        res.render('pages/push/pSE', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇮🇹')) {
        res.render('pages/push/pIT', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇵🇱')) {
        res.render('pages/push/pPL', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')) {
        res.render('pages/push/pUK', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇦🇺')) {
        res.render('pages/push/pAU', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇧🇾')) {
        res.render('pages/push/pBY', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇨🇦')) {
        
    } else if (service.includes('🇰🇿')) {
        
    } else if (service.includes('🇪🇸')) {
        res.render('pages/push/pES', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if ((service.includes('🇩🇪')) || (service.includes('🇨🇭')) || (service.includes('🇦🇹'))) {
        res.render('pages/push/pDE', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇭🇷')) {
        res.render('pages/push/pHR', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇫🇷')) {
        res.render('pages/push/pFR', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇦🇪')) {
        res.render('pages/push/pAE', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇰')) {
        res.render('pages/push/pSK', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🗺')) {
        res.render('pages/push/pBBC', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇮')) {
        res.render('pages/push/pSI', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇧🇷')) {
        res.render('pages/push/pBR', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    }
}