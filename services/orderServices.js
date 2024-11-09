const Order = require("../models/order");

const createOrder = async (orderData) => {
    const order = new Order(orderData);
    return await order.save();
}

const getAllOrders = async (filter = {}) => {
    const orders = await Order.find(filter);

    // Fetch jersey details for each order item
    for (let order of orders) {
        for (let item of order.items) {
            try {
                const jersey = await Jersey.findById(item.itemId);
                if (jersey) {
                    item.jerseyDetails = {
                        team: jersey.team,
                        kitType: jersey.kitType,
                        image: jersey.image,
                        size: item.size
                    };
                }
            } catch (error) {
                console.error(`Error fetching jersey details for ID ${item.itemId}:`, error);
            }
        }
    }

    return orders;
};

const getOrderById = async (id) => {
    return await Order.findById(id);
};

const getOrdersByStatus = async (status) => {
    return await Order.find({ status });
};

const updateOrder = async (orderId, orderData) => {
    return await Order.findByIdAndUpdate(orderId, orderData, { 
        new: true,
        runValidators: true
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