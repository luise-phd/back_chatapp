const UsuariosCtrl = {}
const Usuario = require('../models/Usuario.model')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

UsuariosCtrl.crearUsuario = async(req, res) => {
    const{nombre, email, phone, admin, state, pass} = req.body
    const NuevoUsuario = new Usuario({
        nombre,
        email,
        phone,
        admin,
        state,
        pass
    })

    const phoneUsuario = await Usuario.findOne({phone: phone})
    if (phoneUsuario) {
        res.json({
            mensaje: 'El usuario ya existe'
        })
    } else {
        NuevoUsuario.pass = await bcrypt.hash(pass, 10)
        const token = jwt.sign({_id: NuevoUsuario._id}, 'secreta')
        await NuevoUsuario.save()
        
        res.json({
            mensaje: 'Usuario registrado',
            id: NuevoUsuario._id,
            nombre: NuevoUsuario.nombre,
            token
        })
    }
}

UsuariosCtrl.listarUsuarios = async(req, res) => {
    const respuesta = await Usuario.find()
    res.json(respuesta)
}

UsuariosCtrl.buscarUsuario = async(req, res) => {
    const id = req.params.id
    const respuesta = await Usuario.findById({_id: id})
    res.json(respuesta)
}

UsuariosCtrl.eliminarUsuario = async(req, res) => {
    const id = req.params.id
    const respuesta = await Usuario.findByIdAndRemove({_id: id})
    res.json({
        mensaje: 'Usuario eliminado',
        respuesta
    })
}

UsuariosCtrl.editarUsuario = async(req, res) => {
    const id = req.params.id
    const respuesta = await Usuario.findByIdAndUpdate({_id: id}, req.body)

    res.json({
        mensaje: 'Usuario editado',
    })
}

UsuariosCtrl.login = async(req, res) => {
    const{phone, pass} = req.body
    const usuario = await Usuario.findOne({phone: phone})
    if (!usuario) {
        return res.json({
            mensaje: 'No. de teléfono incorrecto'
        })
    }
    const match = await bcrypt.compare(pass, usuario.pass)
    if (match) {
        const token = jwt.sign({_id: usuario._id}, 'secreta')
        res.json({
            mensaje: 'Bienvenido',
            id: usuario._id,
            nombre: usuario.nombre,
            token
        })
    } else {
        res.json({
            mensaje: 'Contraseña incorrecta',
        })
    }
}

module.exports = UsuariosCtrl