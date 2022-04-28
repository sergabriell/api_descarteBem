const express = require('express');
const route = express();

// Rotas de usuario
//-crud

// Rotas de categorias
//-get
route.get('/', (req, res) => {
    res.send('Hello World');
});
// Rotas de pontos de coleta
//-get

// Rotas de cupons
//-get

// Rotas de trocas
//-crud

module.exports = route;