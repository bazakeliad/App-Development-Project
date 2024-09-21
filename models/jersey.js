// const jerseys = [
//     { 
//         id: 1, 
//         team: "Manchester City", 
//         kitType: "2024 Home Kit", 
//         price: "$79.99"
//     },
//     { 
//         id: 2,
//         team: "Real Madrid", 
//         kitType: "2024 Home Kit", 
//         price: "$89.99"
//     },
//     { 
//         id: 3, 
//         team: "Paris Saint Germain", 
//         kitType: "2024 Home Kit", 
//         price: "$74.99"
//     },
//     { 
//         id: 4, 
//         team: "Chelsea", 
//         kitType: "2024 Home Kit", 
//         price: "$74.99"
//     },
//     { 
//         id: 5, 
//         team: "Liverpool ", 
//         kitType: "2024 Home Kit", 
//         price: "$84.99"
//     },
//     { 
//         id: 6, 
//         team: "Barcelona", 
//         kitType: "2024 Home Kit", 
//         price: "$89.99"
//     }
// ]


// mongodb library example
// async function getAllArticles(){
//     const { MongoClient } = require('mongodb');  // just put it in the top of the file instead eriting it in every file.
//     const uri = 'mongodb://127.0.0.1:27017/';
//     const client = new MongoClient(uri);
//     await client.connect();

//     const articles = await client.db('MyNews').collection('Articles').find()    
//     return await articles.toArray()
    
// }








const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Jersey = new Schema ({
    team: {
        type: String,
        required: true
    },
    kitType: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    _id: {
        type: Number,
        required: true
    }
    // // not required(by default required field is false), but if the user doesnt put it, we will add it automatically
    // published: {
    //     type: Date,
    //     default: Date.now // current date
    // }
});

// export this model/schema. we will seperate schema from opretaions on the data. one role for each directory.
module.exports = mongoose.model('Jersey', Jersey);









// // we need to expose the data, we will achieve that using functions
// function getAllJerseys(){
//     return jerseys
// }

// function getJersey(id){
//     // we can do this:
//     // for(i = 0; i < jerseys.length; i++)
//     //     if (jerseys[i].id == id)
//     //         return jerseys[i]
//     // return undefined

//     // or more easily(it will also return undefined if not found, as we wanted to):
//     return jerseys.filter(jersey => jersey.id == id)[0]
// }


// // Function to create a new jersey with the given content
// function createJersey(team) {
//     // Generate a new ID
//     const newId = jerseys.length ? jerseys[jerseys.length - 1].id + 1 : 1; 

//     // create new jerseys with the user team parameter:
//     const newJersey = { id: newId, team: team, kitType: "2027 Home Kit", price: "$150.99"};

//     // update the jerseys
//     jerseys.push(newJersey);
// }


// function deleteJersey(id){
//     // this command return -1 if there is no id like that, and delete if it found one.
//     const indexToDelete = jerseys.findIndex(jersey => jersey.id == id)

//     // we want to return undefined if not found
//     if (indexToDelete == -1)
//         return undefined
//     else
//         jerseys.splice(indexToDelete, 1)
        
//         // return fidback about the operation, because if we will not it is the same as return undefined...
//         return "Done"
// }


// // function updateNote(id, content) {
// //     const noteToUpdate = notes.filter(note => note.id == id);
// //     if (noteToUpdate.length > 0) {
// //         noteToUpdate[0].content = content;
// //         return noteToUpdate[0];
// //     } 
// //     else {
// //         return undefined; // Return undefined if no note with the given id is found
// //     }
// // }

// module.exports = {
//     getAllJerseys,
//     getJersey,
//     createJersey,
//     deleteJersey
// }