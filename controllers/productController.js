const Product = require('../models/product');

const getAll = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(201).json(products);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

const createProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        quantity,
        category,
        image,
        ingredients,
        factory,
        country,
        unit,
    } = req.body;

    try {
        const newProduct = await Product.create({
            name,
            description,
            price,
            quantity,
            category,
            image,
            ingredients,
            factory,
            country,
            unit,
        })
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const reduceQuantity = async (req, res) => {
    const { id } = req.params; 
    const { quantityToReduce } = req.body;

    try {   
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity < quantityToReduce) {
            return res.status(400).json({ message: 'Not enough stock to reduce the requested quantity' });
        }

        product.quantity -= quantityToReduce;

        await product.save();

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


module.exports = {
    createProduct,
    getAll,
    getProductById,
    reduceQuantity
}