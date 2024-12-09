const express = require('express');
const { 
    getOrdersByUser, 
    createOrder, 
    deleteOrder, 
    purchaseOrder 
} = require('../controllers/orderController');

const router = express.Router();

router.get('/user/:userId', getOrdersByUser);

router.post('/', createOrder);

router.delete('/:id', deleteOrder);

router.patch('/purchase/:id', purchaseOrder);

module.exports = router