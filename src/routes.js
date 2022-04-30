const express = require('express');
const { listingAllTheCategories } = require('./controllers/categories');
const { listingAllTheCollectPoints } = require('./controllers/collectPoints');
const { doAexchange, showExchange } = require('./controllers/exchanges');
const { registerUser, userLogIn } = require('./controllers/users');
const { listingAllTheVouchers } = require('./controllers/voucher');
const { authorizationToken } = require('./middlewares/tokenNeeded');
const route = express();

// Rotas de usuario
//-crud
route.post('/user', registerUser);
route.post('/login', userLogIn);

route.use(authorizationToken);

route.get('/categories', listingAllTheCategories);

route.get('/collect-points', listingAllTheCollectPoints);

route.get('/vouchers', listingAllTheVouchers);

// Rotas de trocas
//-crud
route.post('/exchange', doAexchange);
route.get('/exchange', showExchange);
module.exports = route;