const xssFilters = require('xss-filters')
const currency = require('currency.js')

module.exports = function send(res, id, service, name, price, photo, address, buyer, city_from, place_from, city_to, date_from, price_bbc) {
    if (service == '🇵🇹 OLX 2.0') {
        res.render('olxpt', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇵🇹 CTT 2.0') {
        res.render('cttpt', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇷🇴 OLX 2.0') {
        res.render('olxro', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            buyer: xssFilters.inHTMLData(buyer),
        })
    } else if (service == '🇷🇴 FanCourier 2.0') {
        res.render('fancourier', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇪 Blocket 2.0') {
        res.render('blocket', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇪 Postnord 2.0') {
        res.render('postnord', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇵🇹 UBER 2.0') {
        res.render('uberpt', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇪 UBER 2.0') {
        res.render('uberse', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇵🇹 MBWAY 2.0') {
        res.render('mbwaypt', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇮🇹 Subito 1.0') {
        res.render('subito10', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1]),
            image: xssFilters.inHTMLData(photo)
        })
    } else if (service == '🇮🇹 Subito 2.0') {
        res.render('subitoit', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            buyer: xssFilters.inHTMLData(buyer),
        })
    } else if (service == '🇵🇱 OLX 2.0') {
        res.render('olxpl', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇵🇱 InPost 2.0') {
        res.render('inpostpl', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇵🇱 Vinted 2.0') {
        res.render('vintedpl', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Gumtree 2.0') {
        res.render('gumtreeuk', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇦🇺 Gumtree 2.0') {
        res.render('gumtreeau', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇧🇾 Куфар 2.0') {
        res.render('kufarby', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id)
        })
    } else if (service == '🇧🇾 СДЭК 2.0') {
        res.render('cdekby', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇨🇦 Kijiji 2.0') {
       
    } else if (service == '🇪🇸 Milanuncios 1.0') {
        res.render('milanuncios1', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id)
        })
    } else if (service == '🇪🇸 Milanuncios 2.0') {
        res.render('milanuncios2', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1]),
            address: xssFilters.inHTMLData(address)
        })
    } else if (service == '🇪🇸 Wallapop 1.0') {
        res.render('wallapop1', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id)
        })
    } else if (service == '🇪🇸 Wallapop 2.0') {
        res.render('wallapop2', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address)
        })
    } else if (service == '🇩🇪 Quoka 2.0') {
        res.render('quoka', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1]),
            address: xssFilters.inHTMLData(address)
        })
    } else if (service == '🇩🇪 DHL 2.0') {
        res.render('dhl', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1]),
            address: xssFilters.inHTMLData(address)
        })
    } else if (service == '🇩🇪 Ebay 2.0') {
        res.render('ebayde', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1]),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
        })
    } else if (service == '🇩🇪 Vinted 2.0') {
        res.render('vintedde', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1]),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
        })
    } else if (service == '🇪🇸 Vinted 2.0') {
        res.render('vintedes', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1]),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
        })
    } else if (service == '🇮🇹 Vinted 2.0') {
        res.render('vintedit', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1]),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
        })
    } else if (service == '🇵🇹 Vinted 2.0') {
        res.render('vintedpt', {
            name: xssFilters.inHTMLData(name),
            image: xssFilters.inHTMLData(photo),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1]),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
        })
    } else if (service == '🇮🇹 BlaBlaCar 1.0') {
        res.render('bbcit', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇪🇸 BlaBlaCar 1.0') {
        res.render('bbces', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇫🇷 BlaBlaCar 1.0') {
        res.render('bbcfr', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇩🇪 BlaBlaCar 1.0') {
        res.render('bbcde', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇷🇴 BlaBlaCar 1.0') {
        res.render('bbcro1', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇵🇹 BlaBlaCar 1.0') {
        res.render('bbcpt1', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇭🇷 BlaBlaCar 1.0') {
        res.render('bbchr1', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇧🇷 BlaBlaCar 1.0') { 
        res.render('bbcbr1', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🗺 BlaBlaCar 1.0 (ВЕСЬ МИР)') {
        res.render('bbceu1', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇮🇹 BlaBlaCar 2.0') {
        res.render('bbcit2', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇪🇸 BlaBlaCar 2.0') {
        res.render('bbces2', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇫🇷 BlaBlaCar 2.0') {
        res.render('bbcfr2', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇩🇪 BlaBlaCar 2.0') {
        res.render('bbcde2', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇷🇴 BlaBlaCar 2.0') {
        res.render('bbcro2', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇵🇹 BlaBlaCar 2.0') {
        res.render('bbcpt2', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇭🇷 BlaBlaCar 2.0') {
        res.render('bbchr2', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇧🇷 BlaBlaCar 2.0') {
        res.render('bbcbr2', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🗺 BlaBlaCar 2.0 (ВЕСЬ МИР)') {
        res.render('bbceu2', {
            id: xssFilters.inHTMLData(id),
            city_from: xssFilters.inHTMLData(city_from),
            place_from: xssFilters.inHTMLData(place_from),
            city_to: xssFilters.inHTMLData(city_to),
            date_from: xssFilters.inHTMLData(date_from),
            price: xssFilters.inHTMLData(currency(price_bbc, { separator: ' ', symbol: '', }).format())
        })
    } else if (service == '🇮🇹 Kijiji 2.0') {
        res.render('kijijiit', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇭🇷 POSTA.HR 2.0') {
        res.render('postahr', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇨🇭 POST.CH 2.0') {
        res.render('postch', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇦🇪 EmiratesPost 2.0') {
        res.render('emiratespost', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇦🇪 Dubizzle 2.0') {
        res.render('dubizzle', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇰 BAZAR.SK 2.0') {
        res.render('bazarsk', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇰 BAZOS.SK 2.0') {
        res.render('bazossk', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇰 DPD.SK 2.0') {
        res.render('dpdsk', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇮🇹 Wallapop 2.0') {
        res.render('wallapopit', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Wallapop 2.0') {
        res.render('wallapopuk', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇮 BOLHA.SI 2.0') {
        res.render('bolhasi', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇮 POSTA.SI 2.0') {
        res.render('postasi', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇮 SALOMON.SI 2.0') {
        res.render('salomonsi', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇰 POSTA.SK 2.0') {
        res.render('postask', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇪🇸 Correos 2.0') {
        res.render('correos', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇦🇹 Post 1.0') {
        res.render('postat10', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇦🇹 Post 2.0') {
        res.render('postaut2', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇦🇹 Laendleanzeiger 2.0') {
        res.render('laendleanzeigerat2', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇦🇹 Laendleanzeiger 1.0') {
        res.render('laendleanzeiger10', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇦🇪 FedEx 2.0') {
        res.render('fedexoae', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇮🇹 Wallapop 1.0') { // +
        res.render('wallapopit10', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇫🇷 Wallapop 1.0') { // +
        res.render('wallapopfr10', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇫🇷 Wallapop 2.0') { // +
        res.render('wallapopfr20', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇬🇧 Wallapop 1.0') {
        res.render('wallapopuk10', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇮🇹 Spedire 2.0') {
        res.render('spedire', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇧🇬 OLX 2.0') {
        res.render('olxbg', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇧🇬 Post 2.0') {
        res.render('postbg', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇨🇿 Bazos 2.0') { // ++++++++++++++++++++
        res.render('bazoscz', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇨🇿 Sbazar 2.0') {
        res.render('sbazarcz', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇨🇿 Dpd 2.0') {
        res.render('dpdcz', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇩🇪 FedEx 2.0') {
        res.render('fedexde', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇮🇹 FedEx 2.0') {
        res.render('fedexit', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇪🇸 FedEx 2.0') {
        res.render('fedexes', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇰 FedEx 2.0') {
        res.render('fedexsk', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇸🇮 FedEx 2.0') {
        res.render('fedexsi', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    } else if (service == '🇵🇹 FedEx 2.0') {
        res.render('fedexpt', {
            name: xssFilters.inHTMLData(name),
            price: xssFilters.inHTMLData(currency(parseInt(price), { separator: ' ', symbol: '', }).format()),
            image: xssFilters.inHTMLData(photo),
            id: xssFilters.inHTMLData(id),
            address: xssFilters.inHTMLData(address),
            surname: xssFilters.inHTMLData(buyer.split(' ')[0]),
            firstName: xssFilters.inHTMLData(buyer.split(' ')[1])
        })
    }
}