const jerseysModel = require("../models/jerseys")
const jerseysController = require("../controllers/jerseysController")


function getHomePage(req, res){
    const jerseys = jerseysModel.getAllJerseys()
    res.render("getHomePage.ejs", { jerseys } )
}    


function handleFormSubmission(req, res){
    const { userInput, operation } = req.body;
    
    if (operation === 'create') {
        jerseysController.CreateJersey(res, userInput)
    }

    else if (operation === 'read') {
        jerseysController.getAllJerseys(req, res)
    }

}



module.exports = {
    getHomePage,
    handleFormSubmission
}