const {Router} = require('express')
const router = Router()

const mensajeCtrl = require('../controllers/Mensaje.controller')
const Auth = require('../authorization/Auth')

router.post('/enviar', Auth.verificarToken, mensajeCtrl.enviarMensaje)
router.get('/listar/:phoneOrigen/:phoneDestino', Auth.verificarToken, mensajeCtrl.listarMensajes)
router.post('/editarEstado/:phoneOrigen/:phoneDestino', Auth.verificarToken, mensajeCtrl.editarEstado)

module.exports = router