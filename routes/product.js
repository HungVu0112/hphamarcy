const express = require('express');
const { 
    createProduct,
    getAll,
    getProductById,
    reduceQuantity
} = require('../controllers/productController');

const router = express.Router();

router.patch('/:id/reduce', reduceQuantity);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.get('/', getAll);

module.exports = router