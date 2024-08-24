const express = require("express")

const jerseysController = require("./controllers/jerseys")

const server = express()

server.use(express.static("public"))



server.get("/", jerseysController.getAllJerseys)
server.get("/jersey", jerseysController.getJersey)
server.get("/deleteJersey", jerseysController.deleteJersey)




server.listen(80) 