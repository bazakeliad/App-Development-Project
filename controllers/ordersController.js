const orderServices = require("../services/orderServices"); // Adjust the path as necessary

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const order = await orderServices.createOrder(res.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderServices.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await orderServices.getOrderById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders by status
exports.getOrdersByStatus = async (req, res) => {
    const { status } = req.body // Get status from query parameters

    try {
        // Find orders with the specified status
        const orders = await orderServices.getOrdersByStatus(status)
        
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found with that status' });
        }
        
        res.status(200).json(orders); // Respond with the orders
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update an order by ID
exports.updateOrder = async (req, res) => {
    try {
        const order = await orderServices.updateOrder(req.params.id, req.body)
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const order = await orderServices.deleteOrder(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders for the logged-in user
exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.session.username;
        const orders = await orderServices.getOrdersByUser(userId);
        if (orders.length === 0) {
            return res.render('userOrders', { orders, title: 'My Orders' });
        }
        res.render('userOrders', { orders, title: 'My Orders' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};