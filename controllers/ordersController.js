const orderServices = require("../services/orderServices"); 
const userServices = require("../services/userServices"); 

// Create a new order
const createOrder = async (req, res) => {
    try {
        const order = await orderServices.createOrder(res.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderServices.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await orderServices.getOrderById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders by status
const getOrdersByStatus = async (req, res) => {
    const { status } = req.body

    try {
        
        // Find orders with the specified status
        const orders = await orderServices.getOrdersByStatus(status)
        
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found with that status' });
        }
        
        res.status(200).json(orders); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update an order by ID
const updateOrder = async (req, res) => {
    try {
        const order = await orderServices.updateOrder(req.params.id, req.body)
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
    try {
        const order = await orderServices.deleteOrder(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json({ message: 'Order deleted successfully' }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {

        // Update the order with the new status
        const updatedOrder = await orderServices.updateOrder(id, { status });
        
        if (!updatedOrder) {
            console.log(`Order ID ${id} not found`);
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log(`Order ID ${id} updated successfully to Status: ${status}`);
        return res.status(200).json({ message: 'Order status updated successfully', updatedOrder });
    } catch (error) {
        console.error(`Error updating order ${id}:`, error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

// Get user's order
const getOrdersByUser = async (req, res) => {
    try {
        const userId = req.session.username;
        let orders = await orderServices.getOrdersByUser(userId);
        console.log("Orders fetched:", orders);
        orders = await getOrdersWithJerseyDetails(orders);
        res.render('userOrders', { orders, title: 'My Orders' });
    } catch (error) {
        console.error("Error getting user orders:", error);
        res.status(500).json({ message: error.message });
    }
};

// Fetch all orders
const getAllOrdersAdmin = async (req, res) => {
    try {
        const { username, status, startDate, endDate, minPrice, maxPrice } = req.query;
        console.log('Filter values:', { username, status, startDate, endDate, minPrice, maxPrice });

        const filter = {};

        // Filter by username
        if (username) {
            console.log('Filtering by username:', username);
            filter.userId = { $in: Array.isArray(username) ? username : [username] };
        }

        // Filter by status
        if (status) {
            console.log('Filtering by status:', status);
            filter.status = { $in: Array.isArray(status) ? status : [status] };
        }

        // Filter by date range
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
            console.log('Filtering by date range:', { startDate, endDate });
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            filter.totalPrice = {};
            if (minPrice) filter.totalPrice.$gte = parseFloat(minPrice);
            if (maxPrice) filter.totalPrice.$lte = parseFloat(maxPrice);
            console.log('Filtering by price range:', { minPrice, maxPrice });
        }

        // Fetch filtered orders
        let orders = await orderServices.getAllOrders(filter);
        const users = await userServices.getAllUsers();

        // Fetch jersey details for each order
        orders = await getOrdersWithJerseyDetails(orders);

        // Render the orders view with filter selections
        res.render('adminOrders', {
            orders,
            users,
            usernames: Array.isArray(username) ? username : (username ? [username] : []),
            statuses: Array.isArray(status) ? status : (status ? [status] : []),
            startDate,
            endDate,
            minPrice,
            maxPrice
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Helper function to fetch jersey details for each item in an order
const getOrdersWithJerseyDetails = async (orders) => {
    const jerseysServices = require("../services/jerseysServices");

    for (let order of orders) {
        for (let item of order.items) {
            try {
                const jersey = await jerseysServices.getJerseyById(item.itemId);
                if (jersey) {
                    item.jerseyDetails = {
                        team: jersey.team,
                        kitType: jersey.kitType,
                        image: jersey.image,
                        size: item.size
                    };
                } else {
                    console.warn(`Jersey with ID ${item.itemId} not found`);
                }
            } catch (error) {
                console.error(`Error fetching jersey details for ID ${item.itemId}:`, error);
            }
        }
    }
    return orders;
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByStatus,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    getOrdersByUser,
    getAllOrdersAdmin,
};