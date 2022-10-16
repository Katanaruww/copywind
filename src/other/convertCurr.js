const request = require('request')

module.exports = function convertCurrency(amount, fromCurrency, toCurrency, cb) {
    try {
        let result = 0;
        fromCurrency = encodeURIComponent(fromCurrency);
        toCurrency = encodeURIComponent(toCurrency);

        let query = fromCurrency + '_' + toCurrency;

        request.get(`https://free.currconv.com/api/v7/convert?q=${fromCurrency}_${toCurrency}&compact=ultra&apiKey=a7c9f7d5e07a993cc0c8`, (err, res, body) => {
            if (res) {
                try {
                    let parsed_body = JSON.parse(res.body);
                    result = parsed_body[query] * amount;
                    cb(result);
                } catch (e) {
                    cb(0)
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
}