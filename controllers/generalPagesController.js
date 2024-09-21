const jerseysServices = require("../services/jerseysServices")
const jerseysController = require("../controllers/jerseysController")


// return home page to the user
const getHomePage = async(req, res) => {
    const jerseys = await jerseysServices.getAllJerseys()
    res.render("getHomePage.ejs", { jerseys } )
}


// handle user input operation in home page
const handleFormSubmission = async(req, res) => {
    const { userInput, operation } = req.body;
    
    if (operation === 'create') {
        await jerseysController.createJersey(res, userInput)
        
        // Redirect to the home page, so the user would not stay at /submit path. 
        // the controller function who is responsible of a path of creating or deleting(get is ok of course, will give the same page again), 
        // we want it to call the function to give the page after by redirect and not calling a function,
        // because we dont want it to do the same operation again
        // by using that we make the user\explorer ask for the page, and dont give it to him while he staying on delete\create path
        res.redirect("/");  
    }

    else if (operation === 'read') {
        // we can do this:
        // jerseysController.getAllJerseys(req, res)
        // but the user will stay at /submit path

        // we want redirect the user to another url(where this page is given), so after refresh we will get the same page he is again and not the operation
        res.redirect("/getAllJerseys")
    }
}



// exporting functions
module.exports = {
    getHomePage,
    handleFormSubmission
}