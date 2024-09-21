
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













const Jersey = require("../models/jersey");


const getJerseyById = async (id) => {
    return await Jersey.findOne({ _id: id });
};



// we need to expose the data, we will achieve that using functions
const getAllJerseys = async (id) => {
    // return all jerseys
    return Jersey.find({});
}


const createJersey = async (team) => {

    // create new document
    const jersey = new Jersey({
        team: team,
        price: "$80",
        kitType: "2000 Home Kit",
        _id: 6
    });

    // example of update or adding him values
    jersey.price = "$84.99"; 
    jersey.kitType = "2024 Home Kit"; 
    
    // actually add this document inside our Jerseys collection
    return await jersey.save();
};


const deleteJerseyById = async (id) => {
    const jersey = await getJerseyById(id);

    if (!jersey)
        return null;
    
    console.log(id)

    await jersey.deleteOne({_id: id});
    
    // also return the deleted jersey if you wanna use it
    return jersey;
};
    

// const updateJersey = async (id, team) => {
//     const jersey = await getJerseyById(id); 
//     if (!jersey) 
//         return null; 

//     jersey.team = team; 
//     await jersey.save(); 
//     return jersey;
// };
    

module.exports = {
    getJerseyById,
    getAllJerseys,
    createJersey,
    deleteJerseyById
    // updateJersey
}