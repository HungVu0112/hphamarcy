const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = Schema({
    customer: {
        type: Schema.Types.ObjectId,
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
        },
        quantity: Number
    }],
    totalPrice: Number,
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Pending'
    }
})

module.exports = mongoose.model('Order', orderSchema);