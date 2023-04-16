const MensajesCtrl = {};
const Mensaje = require("../models/Mensaje.model");

MensajesCtrl.listarMensajes = async (req, res) => {
  const phoneDestino = req.params.phoneDestino;
  const phoneOrigen = req.params.phoneOrigen;

  try {
    const respuesta = await Mensaje.find({
      $or: [
        {
          $and: [{ phoneDestino: phoneDestino }, { phoneOrigen: phoneOrigen }],
        },
        {
          $and: [{ phoneDestino: phoneOrigen }, { phoneOrigen: phoneDestino }],
        },
      ],
    });

    res.json(respuesta);
  } catch (err) {
    return res.status(400).json({
      mensaje: "Ocurrió un error",
      err,
    });
  }
};

MensajesCtrl.enviarMensaje = async (req, res, io) => {
  const { msg, phoneDestino, phoneOrigen, state } = req.body;
  const NuevoMensaje = new Mensaje({
    msg,
    phoneDestino,
    phoneOrigen,
    state: "0",
  });

  await NuevoMensaje.save();

  res.json({
    mensaje: "Mensaje almacenado",
  });
};

// MensajesCtrl.listarMensajes = async(req, res) => {
//   const respuesta = await Mensaje.find()
//   res.json(respuesta)
// }

module.exports = MensajesCtrl;
