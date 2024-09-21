const Order = require("../models/order");


const getOrderById = async (id) => {
    return await Order.findOne({ _id: id });
};


const getAllOrders = async (id) => {
    // return all Orders
    return Order.find({});
}


const createOrder = async (team) => {

    // create new document using team parameter provided by the user
    const Order = new Order({
        team: team,
        price: "$80",
        kitType: "2000 Home Kit"
    });

    // update values
    Order.price = "$84.99"; 
    Order.kitType = "2024 Home Kit"; 
    
    // actually add this document inside our Orders collection
    return await Order.save();
};


const deleteOrderById = async (id) => {
    // get the Order
    // we need to add try and exceptions, like un exist id drop the server.
    const Order = await getOrderById(id);

    if (!Order)
        return null;

    await Order.deleteOne({_id: id});
    
    // also return the deleted Order if you wanna use it
    return Order;
};
    
module.exports = {
    getOrderById,
    getAllOrders,
    createOrder,
    deleteOrderById
    // updateOrder
}