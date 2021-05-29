const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const Usuario = require('../models/usuario_model');
const verificaToken = require('../middlewares/auth');
const ruta = express.Router();

const schema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(10)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});



ruta.get('/', verificaToken, (req, res) => {
    let resultado = listarUsuariosActivos();
    resultado.then(usuarios => {
        res.json(usuarios)
    }).catch(err => {
        res.status(400).json({
            mensaje: "Error en la peticion",
            error: err
        })
    })
});

ruta.post('/', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ error: 'Server Error..' });
        }

        if (user) {
            return res.status(400).json({
                msj: 'ATENCION, el usuario ya existe'
            });
        }



    });

    const { error, value } = schema.validate({ nombre: body.nombre, email: body.email });

    if (!error) {
        let resultado = crearUsuario(body);

        resultado.then(user => {
            res.json({
                nombre: user.nombre,
                email: user.email
            })
        }).catch(err => {
            res.status(400).json({
                error: err
            })
        });
    } else {
        res.status(400).json({
            error: error
        })
    }

});


ruta.put('/:email', verificaToken, (req, res) => {

    const { error, value } = schema.validate({ nombre: req.body.nombre });

    if (!error) {
        let resultado = actualizarUsuario(req.params.email, req.body);
        resultado.then(valor => {
            res.json({
                nombre: valor.nombre,
                email: valor.email
            })
        }).catch(err => {
            res.status(400).json({
                error: error
            })
        });

    } else {
        res.status(400).json({
            error: error
        })
    }

});

ruta.delete('/:email', verificaToken, (req, res) => {
    let resultado = desactivarUsuario(req.params.email);
    resultado.then(valor => {
        res.json({
            mensaje: 'Usuario Desactivado',
            nombre: valor.nombre,
            email: valor.email
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    });
});

async function crearUsuario(body) {
    let usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        cedula: body.cedula,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10)
    });
    return usuario.save();
}

async function listarUsuariosActivos() {
    let usuarios = await Usuario.find({ "estado": true })
        .select({ nombre: 1, email: 1 });
    return usuarios;
}

async function actualizarUsuario(email, body) {
    let usuario = await Usuario.findOneAndUpdate({ "email": email }, {
        $set: {
            nombre: body.nombre,
            apellido: body.apellido,
            password: body.password
        }
    }, { new: true });
    return usuario;
}


async function desactivarUsuario(email) {
    let usuario = await Usuario.findOneAndUpdate(email, {
        $set: {
            estado: false

        }
    }, { new: true });
    return usuario;
}

module.exports = ruta;