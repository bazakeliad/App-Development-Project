const Order = require("../models/order");

const getOrderById = async (id) => {
    return await Order.findById(id);
};

const getAllOrders = async (query = {}, sort = {}) => {
    try {
        return await Order.find(query).sort(sort);
    } catch (error) {
        console.error("Error fetching Orders:", error);
        throw error;
    }
};

const createOrder = async (OrderData) => {
    const order = new Order(OrderData);
    return await Order.save();
};

// Update a jersey by ID
const updateOrderById = async (id, updateData) => {
    try {
        const order = await Jersey.findByIdAndUpdate(id, updateData, { new: true });
        return order;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
};

// Delete a jersey by ID
const deleteOrderById = async (id) => {
    try {
        const order = await Jersey.findByIdAndDelete(id);
        return order;
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
};

module.exports = {
    getOrderById,
    getAllOrders,
    createOrder,
    updateOrderById,
    deleteOrderById
};
