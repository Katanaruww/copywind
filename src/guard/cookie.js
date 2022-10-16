module.exports = async function protect(req, res, next) {
    const { cookies } = req

    if ('session_id' in cookies) {
        next()
    } else {
        res.status(403).json({
            msg: 'Not Authorized! Maybe you are bot!'
        })
    }
}