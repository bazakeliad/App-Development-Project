const jerseysServices = require("../services/jerseysServices")
const jerseysController = require("../controllers/jerseysController")
const userServices = require("../services/userServices");

// Updated controller to select 2 random articles on the server side
const getAllNews = async (req, res) => {
    require('dotenv').config();
    const apiKey = process.env.API_KEY;
    const answer = await fetch(`https://newsapi.org/v2/everything?q=(Messi+AND+Ronaldo)+-porn+-beach+-Ohtani+-null+-died+-JKS+-Rolex+-Naismith+-celebrities+-Distasteful+-kingdom+-capitalizing+-Fossil+-Lacchesi=&language=en&apiKey=${apiKey}`);
    const jsonResponse = await answer.json();

    // Select 2 random articles on the server
    const articles = jsonResponse.articles;

    // Remove articles with null fields
    const filteredArticles = articles.filter(article => {
        // Check if any field in the article is null
        return Object.values(article).every(value => value !== null) && article.author !== "Al Jazeera";
    });

    const randomArticles = [];
    const maxArticles = Math.min(3, filteredArticles.length); // Adjust to select 3 random articles


    while (randomArticles.length < maxArticles) {
        const randomIndex = Math.floor(Math.random() * filteredArticles.length);
        const randomArticle = filteredArticles[randomIndex];
        if (!randomArticles.includes(randomArticle)) {
            randomArticles.push(randomArticle);
        }
    }

    res.send(randomArticles); // Send only the random articles
};


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

// exporting functions
module.exports = {
    getAllNews,
    getHomePage,
    handleFormSubmission,
    getAboutUs,
    login
}