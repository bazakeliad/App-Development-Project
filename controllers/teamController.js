// controllers/teamController.js
const teamService = require('../services/teamServices');

const getTeamSelection = async (req, res) => {
    try {
        const teams = await teamService.getAllTeams();
        res.render('myteam', { teams });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading teams');
    }
};

const postTeamSelection = (req, res) => {
    const twitterHandle = req.body.team;
    res.redirect(`/myteam/${twitterHandle}`);
};

const getTeamTweets = (req, res) => {
    const twitterHandle = req.params.twitterHandle;
    res.render('teamTweets', { twitterHandle });
};

module.exports = {
    getTeamSelection,
    postTeamSelection,
    getTeamTweets
};

// exporting functions
module.exports = {
    getTeamSelection,
    postTeamSelection,
    getTeamTweets
}