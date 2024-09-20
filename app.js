const express = require("express")
const server = express()

server.use(express.urlencoded({ extended: true }));

const jerseysController = require("./controllers/jerseysController")
const generalPagesController = require("./controllers/generalPagesController")

server.use(express.static("public"))

server.get("/", generalPagesController.getHomePage)
server.post('/submit', generalPagesController.handleFormSubmission)

server.get("/getAllJerseys", jerseysController.getAllJerseys)
server.get("/getJersey", jerseysController.getJersey)
server.get("/deleteJersey", jerseysController.deleteJersey)


server.listen(81) 