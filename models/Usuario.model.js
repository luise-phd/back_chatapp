const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UsuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'Nombre obligatorio']},
    email: String,
    phone: String,
    admin: String,
    state: String,
    pass: String,
    date: {type: Date, default: Date.now}
})

// Convertir modelo
module.exports = mongoose.model('usuario', UsuarioSchema)