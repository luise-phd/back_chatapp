const {Router} = require('express')
const router = Router()

const usuarioCtrl = require('../controller/Usuario.controller')
const Auth = require('../authorization/Auth')

router.post('/crear', Auth.verificarToken, usuarioCtrl.crearUsuario)
router.post('/login', usuarioCtrl.login)
router.get('/listar', Auth.verificarToken, usuarioCtrl.listarUsuarios)
router.get('/listarUsuariosConMensajes/:phoneDestino', Auth.verificarToken, usuarioCtrl.listarUsuariosConMensajes)
router.get('/buscar/:id', Auth.verificarToken, usuarioCtrl.buscarUsuario)
router.delete('/eliminar/:id', Auth.verificarToken, usuarioCtrl.eliminarUsuario)
router.put('/editar/:id', Auth.verificarToken, usuarioCtrl.editarUsuario)
// router.get('/listarUsuariosEstado/:estado', Auth.verificarToken, usuarioCtrl.listarUsuariosEstado)
// router.get('/listarUsuariosCriterio/:criterio', Auth.verificarToken, usuarioCtrl.listarUsuariosCriterio)

module.exports = router