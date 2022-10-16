const express = require('express')
const bodyParser = require('body-parser')
const subdomain = require('express-subdomain')
const noBots = require('express-badbots')
const loggy = require('loggy')

const server = express()
server.disable('x-powered-by')
server.set('view engine', 'ejs')
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
/* server.use(noBots()) */

server.use('/static', express.static('views'))

server.use(subdomain('*', require('../routes/receive')))
server.use('/receive', require('../routes/receive'))
server.use('/api', require('../routes/api'))

server.get('/', (req, res) => {
    try {
        res.sendStatus(403)
    } catch (e) {
        loggy.warn(e)
    }
})

server.use((req, res, next) => {
    res.setTimeout(999999, () => {
        res.status(403).send('Error! Go back a page and try again.')
    })
    next()
})

module.exports = server