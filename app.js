//inicializamos express:
const express = require('express');
const usuarios = require('./routes/usuarios');
const auth = require('./routes/auth');
const cursos = require('./routes/cursos');

//nos conectamos a la base de datos :
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get('configDB.HOST'), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.log('No se pudo conectar con MongoDB'));
mongoose.set('useCreateIndex', true);

//instanciamos express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //permite leer las url que estamos recibiendo
app.use('/api/usuarios', usuarios);
app.use('/api/cursos', cursos);
app.use('/api/auth', auth);

//definimos puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Api RESTful funcionando ....!');
});