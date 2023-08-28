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

MensajesCtrl.editarEstado = async (req, res, io) => {
  try {
    const phoneDestino = req.params.phoneDestino;
    const phoneOrigen = req.params.phoneOrigen;
    console.log(phoneDestino + "-" + phoneOrigen);
    const { mensajeIds } = req.body;

    // Actualizar los mensajes con estado 1
    // for (const id of mensajeIds) {
    //   await Mensaje.findByIdAndUpdate(id, { state: "1" });
    // }

    // Actualizar los mensajes con estado 1 y los correspondientes a los teléfonos de origen y destino
    await Mensaje.updateMany(
      {
        _id: { $in: mensajeIds },
        phoneDestino: phoneDestino,
        phoneOrigen: phoneOrigen
      },
      { state: '1' }
    );

    res
      .status(200)
      .json({ message: "Estado de mensajes actualizado exitosamente" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al actualizar el estado de los mensajes" });
  }
};

// MensajesCtrl.listarMensajes = async(req, res) => {
//   const respuesta = await Mensaje.find()
//   res.json(respuesta)
// }

module.exports = MensajesCtrl;
