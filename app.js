const express = require("express")
const server = express()

server.use(express.urlencoded({ extended: true }));

const jerseysController = require("./controllers/jerseys")


server.use(express.static("public"))

server.get("/", jerseysController.getHomePage)
server.get("/getAllJerseys", jerseysController.getAllJerseys)
server.get("/getJersey", jerseysController.getJersey)
server.get("/deleteJersey", jerseysController.deleteJersey)


server.post('/submit', jerseysController.handleFormSubmission)



server.listen(81) 