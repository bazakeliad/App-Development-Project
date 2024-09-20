const jerseysModel = require("../models/jerseys")


function getHomePage(req, res){
    const jerseys = jerseysModel.getAllJerseys()
    res.render("getHomePage.ejs", { jerseys } )
}    




// function handleDeleteNoteById(res, noteId){
//     const code = notesModel.deleteNote(noteId)
//     if (code == -1)
//         res.status(404).send()
//     else {
//         res.redirect("/")
//     }
// }

// function handleUpdateNoteById(res, noteId, newContent){
//     const returnedValue = notesModel.updateNote(noteId, newContent)
//     if (returnedValue == undefined)
//         res.status(404).send()
//     else {
//         res.redirect("/")
//     }
// }




function handleFormSubmission(req, res){
    const { userInput, operation } = req.body;
    
    if (operation === 'create') {
        handleCreateJersey(res, userInput)
    }

    else if (operation === 'read') {
        getAllJerseys(req, res)
    }

}


function handleCreateJersey(res, content) {
    jerseysModel.createJersey(content); 

    // Redirect to the home page
    res.redirect("/");  
}





function getAllJerseys(req, res){
    const jerseys = jerseysModel.getAllJerseys()

    // by default ejs engine search inside vies directory, so we dont have to specify this.
    res.render("getAllJerseys.ejs", { jerseys } )
}    

function getJersey(req, res){
    // we need to get the id of the jersey, for displaying the specified jersey in the request.
    const jerseyId = req.query.id
    if (jerseyId == undefined)
        res.status(400).send()
    else{
        const jersey = jerseysModel.getJersey(jerseyId)
        if (jersey == undefined)
            res.status(404).send()
        else
            res.render("getJersey.ejs", { jersey } )
    }
}

function deleteJersey(req, res){
    const jerseyId = req.query.id
    if (jerseyId == undefined)
        res.status(400).send()
    else{
        const code = jerseysModel.deleteJersey(jerseyId)
        if (code == -1)
            res.status(400).send()
        else{
            // now we need to update the view of the user to be without that jersey
            // getAllJerseys(req, res)
            res.redirect("/getAllJerseys")
        }
    }
}

// function updateJersey

// function createJersey


module.exports = {
    getHomePage,
    handleFormSubmission,
    handleCreateJersey,
    getAllJerseys,
    getJersey,
    deleteJersey
}