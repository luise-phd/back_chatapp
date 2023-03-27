const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyparser = require('body-parser')
require('./database')

const app = express()

// Configuración del puerto
app.set('puerto', process.env.PORT || 4000)
app.use(morgan('dev'))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(cors({origin: '*'}))

app.use('/usuario', require('./routes/Usuario.route'))
// app.use('/ciudad', require('./routes/Ciudad.route'))

app.listen(app.get('puerto'), function() {
    console.log('Escuchando en el puerto ' + app.get('puerto'))
})