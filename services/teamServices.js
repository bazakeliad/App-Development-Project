// services/teamService.js
const Jersey = require("../models/jersey");

const getAllTeams = async () => {
  try {
      // Only select teams with a non-null and non-empty teamTwitterHandle
      const jerseys = await Jersey.find({ teamTwitterHandle: { $ne: null, $ne: '' } })
          .select('team teamTwitterHandle -_id');

      const teamsList = jerseys.map(jersey => ({
          name: jersey.team,
          twitterHandle: jersey.teamTwitterHandle
      }));

      return teamsList;
  } catch (error) {
      throw new Error('Error fetching teams');
  }
};

module.exports = {
    getAllTeams
};