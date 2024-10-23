const Order = require("../models/order");

const createOrder = async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
}

const getAllOrders = async () => {
    return await Order.find();
};

const getOrderById = async (id) => {
    return await Order.findById(id);
};

const getOrdersByStatus = async (status) => {
    return await Order.find({ status });
};

const updateOrder = async (orderId, orderData) => {
    return await Order.findByIdAndUpdate(orderId, orderData, { 
        new: true,  // Return the updated document
        runValidators: true  // Ensure the validators (like enum) run on update
    });
};

const getOrdersByUser = async (userId) => {
    return await Order.find({ userId });
}


const deleteOrder = async (orderId) => {
    return await Order.findByIdAndDelete(orderId);
}
module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByStatus,
    updateOrder,
    deleteOrder,
    getOrdersByUser
};