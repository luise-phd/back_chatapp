require('./database')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyparser = require('body-parser')

const app = express();

// Configuración del puerto
app.set('puerto', process.env.PORT || 4000)
app.use(morgan('dev'))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(cors({origin: '*'}))

app.use('/usuarios', require('./routes/Usuario.route'))
app.use('/mensajes', require('./routes/Mensaje.route'))

// const Usuarios = require("./models/Usuario.model");

// Ruta para obtener los elementos desde la base de datos
app.get('/usuarios', async (req, res) => {
  try {
    const elementos = await Usuarios.find();
    res.json(elementos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

app.listen(app.get('puerto'), function() {
    console.log('Escuchando en el puerto ' + app.get('puerto'))
})