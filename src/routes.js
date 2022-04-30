const express = require('express');
const { listingAllTheCategories } = require('./controllers/categories');
const { listingAllTheCollectPoints } = require('./controllers/collectPoints');
const { doAexchange, showExchange } = require('./controllers/exchanges');
const { registerUser, userLogIn, informationToTheUserHimself, userUpdate } = require('./controllers/users');
const { listingAllTheVouchers } = require('./controllers/voucher');
const { authorizationToken } = require('./middlewares/tokenNeeded');
const route = express();

route.post('/user', registerUser);
route.post('/login', userLogIn);

route.use(authorizationToken);

route.get('/user', informationToTheUserHimself);
route.patch('/user', userUpdate);
route.get('/categories', listingAllTheCategories);
route.get('/collect-points', listingAllTheCollectPoints);
route.get('/vouchers', listingAllTheVouchers);

route.post('/exchange', doAexchange);
route.get('/exchange', showExchange);
module.exports = route;