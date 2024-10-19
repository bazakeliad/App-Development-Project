const Jersey = require("../models/jersey");

const getJerseyById = async (id) => {
    return await Jersey.findById(id);
};

const getAllJerseys = async (query = {}, sort = {}) => {
    try {
        return await Jersey.find(query).sort(sort);
    } catch (error) {
        console.error("Error fetching jerseys:", error);
        throw error;
    }
};


const getJerseysByTeamPrefix = async (teamPrefix) => {
    try {
        // Using regex to match the start of the 'team' field with the 'teamprefix'
        const teams = await Jersey.find({
          team: { $regex: `${teamPrefix}`, $options: 'i' } // 'i' option for case-insensitive search
        });
        return teams;
    } 
    catch (error) {
        console.error('Error retrieving teams by prefix:', error);
        throw error;
    }
}


const createJersey = async (jerseyData) => {
    const jersey = new Jersey(jerseyData);
    return await jersey.save();
};

const getDistinctTeamsAndKitTypes = async () => {
    try {
        const teams = await Jersey.distinct('team');
        const kitTypes = await Jersey.distinct('kitType');
        return { teams, kitTypes };
    } catch (error) {
        console.error("Error fetching distinct teams and kit types:", error);
        throw error;
    }
};

// Update a jersey by ID
const updateJerseyById = async (id, updateData) => {
    try {
        const jersey = await Jersey.findByIdAndUpdate(id, updateData, { new: true });
        return jersey;
    } catch (error) {
        console.error('Error updating jersey:', error);
        throw error;
    }
};

// Delete a jersey by ID
const deleteJerseyById = async (id) => {
    try {
        const jersey = await Jersey.findByIdAndDelete(id);
        return jersey;
    } catch (error) {
        console.error('Error deleting jersey:', error);
        throw error;
    }
};

const getFeaturedJerseys = async () => {
    try {
        return await Jersey.find().limit(6);
    } catch (error) {
        console.error("Error fetching featured jerseys:", error);
        throw error;
    }
};

const getJerseyCount = async () => {
    return await Jersey.countDocuments();
};

module.exports = {
    getJerseyById,
    getAllJerseys,
    createJersey,
    getDistinctTeamsAndKitTypes,
    updateJerseyById,
    deleteJerseyById,
    getFeaturedJerseys,
    getJerseysByTeamPrefix,
    deleteJerseyById,
    getJerseyCount
};
