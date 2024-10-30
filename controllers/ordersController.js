const orderServices = require("../services/orderServices"); // Adjust the path as necessary
const jerseyServices = require("../services/jerseysServices"); // Adjust the path as necessary


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

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;  // Order ID from URL
    const { status } = req.body;  // New status from AJAX request

    console.log(`Received request to update Order ID ${id} to Status: ${status}`);  // Debugging

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        // Update the order with the new status
        const updatedOrder = await orderServices.updateOrder(id, { status });
        
        if (!updatedOrder) {
            console.log(`Order ID ${id} not found`);  // Debugging
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log(`Order ID ${id} updated successfully to Status: ${status}`);  // Debugging
        return res.status(200).json({ message: 'Order status updated successfully', updatedOrder });
    } catch (error) {
        console.error(`Error updating order ${id}:`, error);  // Log the error
        return res.status(500).json({ message: 'Internal server error', error });
    }
};


exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.session.username;
        let orders = await orderServices.getOrdersByUser(userId);
        console.log("Orders fetched:", orders); // Log orders to verify data
        orders = await getOrdersWithJerseyDetails(orders); // Add jersey details
        res.render('userOrders', { orders, title: 'My Orders' });
    } catch (error) {
        console.error("Error getting user orders:", error); // Log the error
        res.status(500).json({ message: error.message });
    }
};

const getOrdersWithJerseyDetails = async (orders) => {
    for (let order of orders) {
        for (let item of order.items) {
            const jersey = await jerseyServices.getJerseyById(item.itemId);
            if (jersey) {
                item.jerseyDetails = {
                    team: jersey.team,
                    kitType: jersey.kitType,
                    image: jersey.image
                };
            }
        }
    }
    return orders;
};