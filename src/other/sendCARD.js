module.exports = function send(res, id, service) {
    if (service.includes('🇵🇹')) {
        res.render('pages/cardPT', {
            id: id
        })
    } else if (service.includes('🇷🇴')) {
        res.render('pages/cardRO', {
            id: id
        })
    } else if (service.includes('🇸🇪')) {
        res.render('pages/cardSE', {
            id: id
        })
    } else if (service.includes('🇮🇹')) {
        res.render('pages/cardIT', {
            id: id
        })
    } else if (service.includes('🇵🇱')) {
        res.render('pages/cardPL', {
            id: id
        })
    } else if (service.includes('🏴󠁧󠁢󠁥󠁮󠁧󠁿')) {
        res.render('pages/cardUK', {
            id: id
        })
    } else if (service.includes('🇦🇺')) {
        res.render('pages/cardAU', {
            id: id
        })
    } else if (service.includes('🇧🇾')) {
        res.render('pages/cardBY', {
            id: id
        })
    } else if (service.includes('🇨🇦')) {
        
    } else if (service.includes('🇰🇿')) {
        
    } else if (service.includes('🇪🇸')) {
        res.render('pages/cardES', {
            id: id
        })
    } else if ((service.includes('🇩🇪')) || (service.includes('🇨🇭')) || (service.includes('🇦🇹'))) {
        res.render('pages/cardDE', {
            id: id
        })
    } else if (service.includes('🇭🇷')) {
        res.render('pages/cardHR', {
            id: id
        })
    } else if (service.includes('🇫🇷')) {
        res.render('pages/cardFR', {
            id: id
        })
    } else if (service.includes('🇦🇪')) {
        res.render('pages/cardAE', {
            id: id
        })
    } else if (service.includes('🇸🇰')) {
        res.render('pages/cardSK', {
            id: id
        })
    } else if (service.includes('🗺')) {
        res.render('pages/cardBBC', {
            id: id
        })
    } else if (service.includes('🇸🇮')) {
        res.render('pages/cardSI', {
            id: id
        })
    } else if (service.includes('🇧🇷')) {
        res.render('pages/cardBR', {
            id: id
        })
    }
}