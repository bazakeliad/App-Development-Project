const jerseysModel = require("../models/jerseys")

function getAllJerseys(req, res){
    const jerseys = jerseysModel.getAllJerseys()

    // by default ejs engine search inside vies directory, so we dont have to specify this.
    res.render("jerseys.ejs", { jerseys } )
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
            res.render("jersey.ejs", { jersey } )
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
            getAllJerseys(req, res)
        }
    }
}

// function updateJersey

// function createJersey


module.exports = {
    getAllJerseys,
    getJersey,
    deleteJersey
}