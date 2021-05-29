const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const Joi = require('joi');
const Usuario = require('../models/usuario_model');
const { post } = require('./usuarios');
const ruta = express.Router();


ruta.post('/', (req, res) => {
    Usuario.findOne({ email: req.body.email })
        .then(datos => {
            if (datos) {
                const passwordValido = bcrypt.compareSync(req.body.password, datos.password);
                if (!passwordValido) return res.status(400).json({ error: 'ok', mensaje: 'Usuario o contraseña incorrecta' })
                const jwToken = jwt.sign({
                    usuario: { _iked: datos._id, nombre: datos.nombre, email: datos.email }
                }, config.get('configToken.SEED'), { expiresIn: config.get('configToken.expiration') });

                //jwt.sign({ _iked: datos._id, nombre: datos.nombre, email: datos.email }, 'passwordgabo')
                res.json({
                    usuario: {
                        _id: datos._id,
                        nombre: datos.nombre,
                        email: datos.email

                    },
                    jwToken
                });
            } else {
                res.status(400).json({
                    error: 'ok',
                    mensaje: 'Usuario o contraseña incorrecta'
                })
            }
        })
        .catch(err => {
            res.status(400).json({
                error: 'ok',
                msj: 'Error en el servicio' + err
            })
        })
})









module.exports = ruta;