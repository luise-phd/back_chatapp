const Auth = {}
const jwt = require('jsonwebtoken')

Auth.verificarToken = (req, res, next) => {
    if (!req.headers.autorizacion) {
        return res.json({
            mensaje: 'Usuario no autorizado'
        })
    }
    const token = req.headers.autorizacion
    if (token === null) {
        return res.json({
            mensaje: 'Usuario no autorizado'
        })
    }
    jwt.verify(token, 'secreta', (error, resultado)=>{
        if (error) {
            return res.json({
                mensaje: 'Usuario no autorizado'
            })
        }
        next()
    })
}

module.exports = Auth