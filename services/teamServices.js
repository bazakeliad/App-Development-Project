const Jersey = require("../models/jersey");

const getAllTeams = async () => {
  try {
    // Only select teams with a non-null and non-empty teamTwitterHandle
    const jerseys = await Jersey.find({ teamTwitterHandle: { $ne: null, $ne: '' } })
    .select('team teamTwitterHandle -_id');
  
    // Create a map to store unique teams by name
    const uniqueTeamsMap = new Map();
    
    jerseys.forEach(jersey => {
        if (!uniqueTeamsMap.has(jersey.team)) {
            uniqueTeamsMap.set(jersey.team, {
                name: jersey.team,
                twitterHandle: jersey.teamTwitterHandle
            });
        }
    });
    
    // Convert the map back to an array
    const teamsList = Array.from(uniqueTeamsMap.values());
    
    return teamsList;
  } catch (error) {
      throw new Error('Error fetching teams');
  }
};

const fetchRawTeams = async () => {
    try {
        // Only select teams with a non-null and non-empty teamTwitterHandle
        const jerseys = await Jersey.find({ teamTwitterHandle: { $ne: null, $ne: '' } })
            .select('team teamTwitterHandle -_id');

        // Return the full list, including duplicates
        return jerseys.map(jersey => ({
            name: jersey.team,
            twitterHandle: jersey.teamTwitterHandle
        }));
    } catch (error) {
        throw new Error('Error fetching teams');
    }
};
  

// Fetch jerseys by the team's twitter handle
const getJerseysByTwitterHandle = async (teamTwitterHandle) => {
    return await Jersey.find({ teamTwitterHandle: teamTwitterHandle });
};

module.exports = {
    getAllTeams,
    fetchRawTeams,
    getJerseysByTwitterHandle
};