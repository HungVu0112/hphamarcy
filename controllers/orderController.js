const Order = require('../models/order');
const axios = require('axios');

const getProductDetails = async (productId) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product ${productId} details:`, error.message);
        return null;
    }
};

const reduceProductQuantity = async (productId, quantity) => {
    try {
        const res = await axios.patch(`http://localhost:3001/api/product/${productId}/reduce`, {
            quantityToReduce: quantity
        });
        return res.data;
    } catch (error) {
        console.error(`Error fetching product ${productId} details:`, error.message);
        return null;
    }
};

const getOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ customer: userId });

        const ordersWithProductDetails = await Promise.all(
            orders.map(async (order) => {
                const detailedItems = await Promise.all(
                    order.items.map(async (item) => {
                        const productDetails = await getProductDetails(item.product);

                        return {
                            product: productDetails || { id: item.product, message: 'Product not found' },
                            quantity: item.quantity,
                        };
                    })
                );

                return {
                    ...order._doc,
                    items: detailedItems,
                };
            })
        );

        res.status(200).json(ordersWithProductDetails);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(404).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
    }
};

const createOrder = async (req, res) => {
    try {
        const { customer, items, totalPrice } = req.body;

        await Promise.all(
            items.map(async (item) => {
                const response = await reduceProductQuantity(item.product, item.quantity);
            })
        );

        const newOrder = new Order({
            customer,
            items,
            totalPrice
        });

        await newOrder.save();
        res.status(201).json({ message: 'Đơn hàng đã được tạo thành công', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Lỗi khi tạo đơn hàng' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        res.status(200).json({ message: 'Đơn hàng đã được xóa thành công' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Lỗi khi xóa đơn hàng' });
    }
};

const purchaseOrder = async (req, res) => {
    try {
        const orderId = req.params.id; 

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: 'Purchased' },
            { new: true } 
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        res.status(200).json({ message: 'Đơn hàng đã được thanh toán', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Lỗi khi thanh toán đơn hàng' });
    }
};

module.exports = {
    getOrdersByUser,
    createOrder,
    deleteOrder,
    purchaseOrder
};