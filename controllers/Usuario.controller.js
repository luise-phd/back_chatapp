const UsuariosCtrl = {};
const Usuario = require("../models/Usuario.model");
const Mensaje = require('../models/Mensaje.model');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

UsuariosCtrl.crearUsuario = async (req, res) => {
  const { nombre, email, phone, admin, state, pass } = req.body;
  const NuevoUsuario = new Usuario({
    nombre,
    email,
    phone,
    admin,
    state,
    pass,
  });

  const phoneUsuario = await Usuario.findOne({ phone: phone });
  if (phoneUsuario) {
    res.json({
      mensaje: "El usuario ya existe",
    });
  } else {
    NuevoUsuario.pass = await bcrypt.hash(pass, 10);
    const token = jwt.sign({ _id: NuevoUsuario._id }, "secreta");
    await NuevoUsuario.save();

    res.json({
      mensaje: "Usuario registrado",
      id: NuevoUsuario._id,
      nombre: NuevoUsuario.nombre,
      token,
    });
  }
};

UsuariosCtrl.listarUsuarios = async (req, res) => {
  const respuesta = await Usuario.find();
  res.json(respuesta);
};

UsuariosCtrl.listarUsuariosConMensajes = async (req, res) => {
  const phoneDestino = req.params.phoneDestino;
  const usuarios = await Usuario.find({ state: "Activo" });
  const usuariosConMensajesSinLeer = await Promise.all(
    usuarios.map(async (usuario) => {
      const mensajesSinLeer = await Mensaje.countDocuments({
        phoneOrigen: phoneDestino,
        phoneDestino: usuario.phone,
        state: "0",
      });
      return { ...usuario._doc, mensajesSinLeer };
    })
  );

  const usuariosOrdenados = usuariosConMensajesSinLeer.sort((a, b) => {
    if (a.mensajesSinLeer > 0 && b.mensajesSinLeer === 0) {
      return -1; // a viene antes que b
    } else if (a.mensajesSinLeer === 0 && b.mensajesSinLeer > 0) {
      return 1; // b viene antes que a
    } else {
      return a.nombre.localeCompare(b.nombre); // orden alfabético si ambos tienen o no tienen mensajes sin leer
    }
  });

  res.json({ usuarios: usuariosOrdenados });
  // res.json({ usuarios: usuariosConMensajesSinLeer });
};

UsuariosCtrl.buscarUsuario = async (req, res) => {
  const id = req.params.id;
  const respuesta = await Usuario.findById({ _id: id });
  res.json(respuesta);
};

UsuariosCtrl.editarPass = async (req, res) => {
  const id = req.params.id;
  const oldPass = req.params.oldPass;
  const newPass = req.params.newPass;
  const respuesta = await Usuario.findById({ _id: id });
  const match = await bcrypt.compare(oldPass, respuesta.pass);
  if (match) {
    const newRespuesta = await Usuario.findByIdAndUpdate(
      // await bcrypt.hash(pass, 10)
      { _id: id },
      { $set: { pass: await bcrypt.hash(newPass, 10) } },
      { new: true }
    );
    res.json("ok")
  } else {
    res.json("La contraseña actual no coincide con la Contraseña almacenada")
  }
};

UsuariosCtrl.eliminarUsuario = async (req, res) => {
  const id = req.params.id;
  const respuesta = await Usuario.findByIdAndRemove({ _id: id });
  res.json({
    mensaje: "Usuario eliminado",
    respuesta,
  });
};

UsuariosCtrl.editarUsuario = async (req, res) => {
  const id = req.params.id;
  const respuesta = await Usuario.findByIdAndUpdate({ _id: id }, req.body);

  res.json({
    mensaje: "Usuario editado",
  });
};

UsuariosCtrl.login = async (req, res) => {
  const { phone, pass } = req.body;
  const usuario = await Usuario.findOne({ phone: phone });
  if (!usuario) {
    return res.json({
      mensaje: "No. de teléfono incorrecto",
    });
  }
  if (usuario.state === "Activo") {
    const match = await bcrypt.compare(pass, usuario.pass);
    if (match) {
      const token = jwt.sign({ _id: usuario._id }, "secreta");
      res.json({
        mensaje: "Bienvenido",
        id: usuario._id,
        nombre: usuario.nombre,
        token,
      });
    } else {
      console.log("Error");
      res.json({
        mensaje: "Contraseña incorrecta",
      });
    }
  }
  else {
    return res.json({
      mensaje: "Usuario inactivo",
    });
  }
};

module.exports = UsuariosCtrl;
