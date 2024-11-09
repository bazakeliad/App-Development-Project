const teamServices = require('../services/teamServices');
const userServices = require('../services/userServices');

// Get user's favorite team
const getTeamSelection = async (req, res) => {
    try {
        // Check if the user is logged in and get its details
        if (req.session && req.session.username) {
            const user = await userServices.getUserByUsername(req.session.username);

            // Check if user has favorite team and redirect accordingly
            if (user && user.team) {
                return res.redirect(`/myteam/${user.team}`);
            } else {
                return res.redirect('/personalArea/profile');
            }
        } else {

            // If the user is not logged in redirect to the login page
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

// Render my team page
const getmyteam = async (req, res) => {
    try {
        const twitterHandle = req.params.twitterHandle;
        
        // Fetch all teams
        const teams = await teamServices.fetchRawTeams();

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