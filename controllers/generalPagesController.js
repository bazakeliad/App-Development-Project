const jerseysServices = require("../services/jerseysServices")
const jerseysController = require("../controllers/jerseysController")
const userServices = require("../services/userServices");


const testimonials = [
    { name: 'John Doe', message: 'Great service and amazing jerseys!' },
    { name: 'Jane Smith', message: 'Fast shipping and quality products. Highly recommend!' },
    { name: 'Alex Johnson', message: 'Excellent customer support and fantastic selection.' },
];

// Return home page to the user
const getHomePage = async (req, res) => {
    try {
        // Fetch featured jerseys from the database
        const allFeaturedJerseys = await jerseysServices.getFeaturedJerseys();

        // Limit the number of jerseys to display (e.g., 4 jerseys)
        const featuredJerseys = allFeaturedJerseys.slice(0, 4);

        // Check if the logged-in user is an admin
        let isAdmin = false
        if (req.session.username) {
            try {
                isAdmin = await userServices.isLoggedAsAdmin(req.session.username);
            } 
            catch (error) {
              console.error('Error checking admin status:', error);
            }
        }

        // Render the home.ejs template with the jerseys and testimonials
        res.render('getHomePage.ejs', { featuredJerseys, testimonials, isAdmin });
    } 
    catch (error) {
        console.error('Error fetching data for homepage:', error);
        res.status(500).send('An error occurred while loading the homepage.');
    }
};


const getAboutUs = async(req, res) => {
    res.render("getAboutUs.ejs")
}    

const login = async(req, res) => {
    res.render("login.ejs")
}    


// handle user input operation in home page
const handleFormSubmission = async(req, res) => {
    const { userInput, operation } = req.body;
    
    if (operation === 'create') {
        await jerseysController.createJersey(res, userInput)
        
        // Redirect to the home page, so the user would not stay at /submit path. 
        // the controller function who is responsible of a path of creating or deleting(get is ok of course, will give the same page again), 
        // we want it to call the function to give the page after by redirect and not calling a function,
        // because we dont want it to do the same operation again
        // by using that we make the user\explorer ask for the page, and dont give it to him while he staying on delete\create path
        res.redirect("/");  
    }

    else if (operation === 'read') {
        // we can do this:
        // jerseysController.getAllJerseys(req, res)
        // but the user will stay at /submit path

        // we want redirect the user to another url(where this page is given), so after refresh we will get the same page he is again and not the operation
        res.redirect("/jerseys")
    }
}


const teams = [
    { name: 'Manchester United', twitterHandle: 'ManUtd' },
    { name: 'Liverpool FC', twitterHandle: 'LFC' },
    { name: 'Chelsea FC', twitterHandle: 'ChelseaFC' },
    // Add more teams as needed
];

const getTeamSelection = (req, res) => {
    res.render('myteam', { teams });
};

const postTeamSelection = (req, res) => {
    const twitterHandle = req.body.team;
    res.redirect(`/myteam/${twitterHandle}`);
};

const getTeamTweets = (req, res) => {
    const twitterHandle = req.params.twitterHandle;
    res.render('teamTweets', { twitterHandle });
};

// Get Cart Page
const getCartPage = (req, res) => {
    try {
        res.render('cart.ejs');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// exporting functions
module.exports = {
    getCartPage,
    getHomePage,
    handleFormSubmission,
    getAboutUs,
    getTeamSelection,
    postTeamSelection,
    getTeamTweets,
    login
}