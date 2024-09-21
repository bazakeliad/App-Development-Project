const jerseysServices = require("../services/jerseysServices")


// return all jerseys page.
const getAllJerseys = async(req, res) => {
    const jerseys = await jerseysServices.getAllJerseys()

    // by default ejs engine search inside views directory, so we dont have to specify this.
    res.render("getAllJerseys.ejs", { jerseys } )

    // **** replace every render with json, or example:    res.render("getAllJerseys.ejs", { jerseys } ) ->  res.json(jerseys)
}    


// return specific jersey page
const getJerseyById = async (req, res) => {
    // we need to get the id of the jersey, for displaying the specified jersey in the request.
    const jerseyId = req.query.id

    if (jerseyId == undefined)
        res.status(404).send()
    
    else {

        // get the specified jersey from the model
        const jersey = await jerseysServices.getJerseyById(jerseyId)
        
        // the model always will return undefined if did not find or did not done the operation, as our standard.
        if (jersey == undefined)
            res.status(404).send()
        else
            res.render("getJersey.ejs", { jersey } )
    }
}



const createJersey = async (res, team) => {
    await jerseysServices.createJersey(team); 
}



const deleteJerseyById = async (req, res) => {
    const jerseyId = req.query.id
    if (jerseyId == undefined)
        res.status(404).send()
    else{
        const code = await jerseysServices.deleteJerseyById(jerseyId)

        // the model always will return undefined if did not find or did not done the operation, as our standard.
        if (code == undefined)
            res.status(404).send()
        else{
            // we could do this line instead:
            // getAllJerseys(req, res)
            // but the user would be staying in this url - /deleteJersey?id=2 , and a refresh would do this operation again. so we want redirect him to another url,
            // so after refresh we will get the same page he is  again and not the operation
            res.redirect("/getAllJerseys")
        }
    }
}




// const updateJersey = async (req, res) => {
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
    getAllJerseys,
    getJerseyById,
    createJersey,
    deleteJerseyById
}