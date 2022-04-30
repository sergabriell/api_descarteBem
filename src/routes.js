const express = require('express');
const { listingAllTheCategories } = require('./controllers/categories');
const { listingAllTheCollectPoints } = require('./controllers/collectPoints');
const { doAexchange, showExchange, updateExchange } = require('./controllers/exchanges');
const { registerUser, informationToTheUserHimself, updateUser, loginUser, deleteUser } = require('./controllers/users');
const { listingAllTheVouchers } = require('./controllers/voucher');
const { authorizationToken } = require('./middlewares/tokenNeeded');
const route = express();

route.post('/user', registerUser);
route.post('/login', loginUser);

route.use(authorizationToken);

route.get('/user', informationToTheUserHimself);
route.patch('/user', updateUser);
route.delete('/user', deleteUser);

route.get('/categories', listingAllTheCategories);

route.get('/collect-points', listingAllTheCollectPoints);

route.get('/vouchers', listingAllTheVouchers);

route.post('/exchange', doAexchange);
route.get('/exchange', showExchange);
route.put('/exchange/:exchange_id', updateExchange);
module.exports = route;