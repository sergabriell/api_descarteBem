const express = require('express');
const { listingAllTheCategories } = require('./controllers/categories');
const { listingAllTheCollectPoints } = require('./controllers/collectPoints');
const { doAexchange, showExchange, updateExchange, deleteExchange } = require('./controllers/exchanges');
const { registerShopping, getAllShopping, deleteShopping } = require('./controllers/onlineShopping');
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

route.post('/exchange', doAexchange);
route.get('/exchange', showExchange);
route.put('/exchange/:exchange_id', updateExchange);
route.delete('/exchange/:exchange_id', deleteExchange);

route.get('/vouchers', listingAllTheVouchers);
route.post('/shopping', registerShopping);
route.get('/shopping', getAllShopping);
route.delete('/shopping/:id_shopping', deleteShopping);
module.exports = route;