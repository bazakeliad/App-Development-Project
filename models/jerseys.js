const jerseys = [
    { id: 1, team: "Manchester City", kitType: "2024 Home Kit", price: "$79.99"},
    { id: 2, team: "Real Madrid", kitType: "2024 Home Kit", price: "$89.99"},
    { id: 3, team: "Paris Saint Germain", kitType: "2024 Home Kit", price: "$74.99"},
    { id: 4, team: "Chelsea", kitType: "2024 Home Kit", price: "$74.99"},
    { id: 5, team: "Liverpool ", kitType: "2024 Home Kit", price: "$84.99"},
    { id: 6, team: "Barcelona", kitType: "2024 Home Kit", price: "$89.99"}
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

function deleteJersey(id){
    const indexToDelete = jerseys.findIndex(jersey => jersey.id == id)
    if (indexToDelete == -1)
        return -1
    else
        jerseys.splice(indexToDelete, 1)
}

module.exports = {
    getAllJerseys,
    getJersey,
    deleteJersey
}