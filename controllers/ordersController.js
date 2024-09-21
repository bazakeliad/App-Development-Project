const OrdersServices = require("../services/ordersServices")


// return all Orders page.
const getAllOrders = async(req, res) => {
    const Orders = await OrdersServices.getAllOrders()

    // by default ejs engine search inside views directory, so we dont have to specify this.
    res.render("getAllOrders.ejs", { Orders } )

    // **** replace every render with json, or example:    res.render("getAllOrders.ejs", { Orders } ) ->  res.json(Orders)
}    


// return specific Order page
const getOrderById = async (req, res) => {
    // we need to get the id of the Order, for displaying the specified Order in the request.
    const OrderId = req.query.id

    if (OrderId == undefined)
        res.status(404).send()
    
    else {

        // get the specified Order from the model
        const Order = await OrdersServices.getOrderById(OrderId)
        
        // the model always will return undefined if did not find or did not done the operation, as our standard.
        if (Order == undefined)
            res.status(404).send()
        else
            res.render("getOrder.ejs", { Order } )
    }
}



const createOrder = async (res, team) => {
    await OrdersServices.createOrder(team); 
}



const deleteOrderById = async (req, res) => {
    const OrderId = req.query.id
    if (OrderId == undefined)
        res.status(404).send()
    else{
        const code = await OrdersServices.deleteOrderById(OrderId)

        // the model always will return undefined if did not find or did not done the operation, as our standard.
        if (code == undefined)
            res.status(404).send()
        else{
            // we could do this line instead:
            // getAllOrders(req, res)
            // but the user would be staying in this url - /deleteOrder?id=2 , and a refresh would do this operation again. so we want redirect him to another url,
            // so after refresh we will get the same page he is  again and not the operation
            res.redirect("/getAllOrders")
        }
    }
}




// const updateOrder = async (req, res) => {
//     if (!req.body.title) {
//         res.status(404).json({
//             message: "title is required", });
//     }

//     const article = await articleService.updateArticle (req.params.id, req.body.title);
//     if (!article) {
//         return res.status(404).json({ errors: ['Article not found'] });
//     }

//     res.json(article);    
// };



module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrderById
}