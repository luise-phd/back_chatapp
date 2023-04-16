const mongoose = require('mongoose');
const Schema = mongoose.Schema

const MensajeSchema = new Schema({
    msg: {type: String, required: [true, 'Mensaje obligatorio']},
    phoneDestino: String,
    phoneOrigen: String,
    state: String,
    date: {type: Date, default: Date.now}
})

// Convertir modelo
module.exports = mongoose.model('mensaje', MensajeSchema)