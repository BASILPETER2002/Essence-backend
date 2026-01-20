const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/', protect, admin, getOrders);

module.exports = router;
