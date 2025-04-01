const jwt = require('jsonwebtoken')

const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, 'coxinha123', { expiresIn: '7d' })


    return res.status(201).json({
        msg: 'você está autenticado', token: token, userId: user._id
    })
}

module.exports = createUserToken