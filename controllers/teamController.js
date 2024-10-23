const teamServices = require('../services/teamServices');
const userServices = require('../services/userServices');

// Handle /myteam route
const getTeamSelection = async (req, res) => {
    try {
        // Check if the user is logged in
        if (req.session && req.session.username) {
            // Fetch the logged-in user's details
            const user = await userServices.getUserByUsername(req.session.username);

            // If the user has a favorite team (teamTwitterHandle)
            if (user && user.team) {
                // Redirect to the team's tweets page using the Twitter handle
                return res.redirect(`/myteam/${user.team}`);
            } else {
                // If the user doesn't have a favorite team, redirect to personalArea
                return res.redirect('/personalArea/profile');
            }
        } else {
            // If the user is not logged in, redirect to the login page
            return res.redirect('/login');
        }
    } catch (error) {
        console.error('Error fetching user or team:', error);
        res.status(500).send('Internal server error');
    }
};

const postTeamSelection = (req, res) => {
    const twitterHandle = req.body.team;
    res.redirect(`/myteam/${twitterHandle}`);
};

// Handle tweets for the selected team and display jerseys
const getmyteam = async (req, res) => {
    try {
        const twitterHandle = req.params.twitterHandle;
        
        // Fetch all teams
        const teams = await teamServices.getAllTeams();

        // Check if the provided twitterHandle exists in the teams list
        const teamExists = teams.some(team => team.twitterHandle === twitterHandle);
        
        if (!teamExists) {
            // Redirect to pageNotFound if the team doesn't exist
            return res.redirect('/pageNotFound');
        }

        // Fetch jerseys that match the twitterHandle's team
        const jerseys = await teamServices.getJerseysByTwitterHandle(twitterHandle);
        
        res.render('myteam', { twitterHandle, jerseys });
    } catch (error) {
        console.error('Error fetching jerseys or tweets:', error);
        res.status(500).send('Internal server error');
    }
};

module.exports = {
    getTeamSelection,
    postTeamSelection,
    getmyteam
};