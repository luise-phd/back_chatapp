const mongoose = require('mongoose');

url = ('mongodb://localhost/chatapp')
// url = ('mongodb+srv://ingluise:luis_chatapp@cluster0.1omyz.mongodb.net/ChatApp?retryWrites=true&w=majority')

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then ( db => console.log('Conectado a MongoDB', db.connection.name))
.catch (err => console.log(err))

module.exports = mongoose