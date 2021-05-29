const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    apellido: {
        type: String,
        required: true
    },

    cedula: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
        unique: true
    },

    estado: {
        type: Boolean,
        default: true
    },

    imagen: {
        type: String,
        required: false
    },

});

module.exports = mongoose.model('Usuario', usuarioSchema);