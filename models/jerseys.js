const jerseys = [
    { 
        id: 1, 
        team: "Manchester City", 
        kitType: "2024 Home Kit", 
        price: "$79.99"
    },
    { 
        id: 2,
        team: "Real Madrid", 
        kitType: "2024 Home Kit", 
        price: "$89.99"
    },
    { 
        id: 3, 
        team: "Paris Saint Germain", 
        kitType: "2024 Home Kit", 
        price: "$74.99"
    },
    { 
        id: 4, 
        team: "Chelsea", 
        kitType: "2024 Home Kit", 
        price: "$74.99"
    },
    { 
        id: 5, 
        team: "Liverpool ", 
        kitType: "2024 Home Kit", 
        price: "$84.99"
    },
    { 
        id: 6, 
        team: "Barcelona", 
        kitType: "2024 Home Kit", 
        price: "$89.99"
    }
]


// we need to expose the data, we will achieve that using functions
function getAllJerseys(){
    return jerseys
}

function getJersey(id){
    // for(i = 0; i < jerseys.length; i++)
    //     if (jerseys[i].id == id)
    //         return jerseys[i]

    // return undefined
    return jerseys.filter(jersey => jersey.id == id)[0]
}


// Function to create a new note with the given content
function createJersey(team) {
    const newId = jerseys.length ? jerseys[jerseys.length - 1].id + 1 : 1; // Generate a new ID
    const newJersey = { id: newId, team: team, kitType: "2027 Home Kit", price: "$150.99"};
    jerseys.push(newJersey);
}


function deleteJersey(id){
    const indexToDelete = jerseys.findIndex(jersey => jersey.id == id)
    if (indexToDelete == -1)
        return -1
    else
        jerseys.splice(indexToDelete, 1)
}


// function updateNote(id, content) {
//     const noteToUpdate = notes.filter(note => note.id == id);
//     if (noteToUpdate.length > 0) {
//         noteToUpdate[0].content = content;
//         return noteToUpdate[0];
//     } 
//     else {
//         return undefined; // Return undefined if no note with the given id is found
//     }
// }

module.exports = {
    getAllJerseys,
    getJersey,
    createJersey,
    deleteJersey
}