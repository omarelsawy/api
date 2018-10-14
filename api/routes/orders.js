const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');

router.get('/' , checkAuth , OrdersController.orders_get_all);

router.post('/' , OrdersController.orders_create_order);
module.exports = router;






