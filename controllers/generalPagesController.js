const jerseysServices = require("../services/jerseysServices")
const userServices = require("../services/userServices");
const reviewService = require('../services/reviewServices');
const storeServices = require('../services/storeServices');


// Fetch sport news from newsapi.org web service
const getAllNews = async (req, res) => {
    require('dotenv').config();
    const apiKey = process.env.API_KEY;
    const answer = await fetch(`https://newsapi.org/v2/everything?q=(Messi+AND+Ronaldo)+-porn+-beach+-Ohtani+-null+-died+-JKS+-Rolex+-Naismith+-celebrities+-Distasteful+-kingdom+-capitalizing+-Fossil+-Lacchesi=&language=en&apiKey=${apiKey}`);
    const jsonResponse = await answer.json();
    const articles = jsonResponse.articles;

    // Remove articles with null fields
    const filteredArticles = articles.filter(article => {
        
        // Check if any field in the article is null
        return Object.values(article).every(value => value !== null) && article.author !== "Al Jazeera";
    });

    const randomArticles = [];
    const maxArticles = Math.min(3, filteredArticles.length);

    while (randomArticles.length < maxArticles) {
        const randomIndex = Math.floor(Math.random() * filteredArticles.length);
        const randomArticle = filteredArticles[randomIndex];
        if (!randomArticles.includes(randomArticle)) {
            randomArticles.push(randomArticle);
        }
    }

    // Send only the random articles
    res.send(randomArticles);
};

// Return home page to the user
const getHomePage = async (req, res) => {
    try {

        // Fetch featured jerseys from the database
        const allFeaturedJerseys = await jerseysServices.getFeaturedJerseys();

        // Limit the number of jerseys to display
        const featuredJerseys = allFeaturedJerseys.slice(0, 4);

        // Fetch all reviews from the database
        const testimonials = await reviewService.getAllReviews();

        // Get the best six reviews with the highest rating
        const bestTestimonials = testimonials
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);

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
        res.render('getHomePage.ejs', { featuredJerseys, bestTestimonials, isAdmin });
    } 
    catch (error) {
        console.error('Error fetching data for homepage:', error);
        res.status(500).send('An error occurred while loading the homepage.');
    }
};

const getAboutUs = async (req, res) => {
    try {
        const stores = await storeServices.getAllStores();
        const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
        res.render('getAboutUs', { googleMapsApiKey, stores });
    } catch (error) {
        console.error('Error loading About Us page:', error);
        res.status(500).send('Error loading About Us page.');
    }
};

const login = async(req, res) => {
    res.render("login.ejs")
}    

// Return home page to the user
const getPageNotFound = async (req, res) => {
    try {

        // Fetch featured jerseys from the database
        const allFeaturedJerseys = await jerseysServices.getFeaturedJerseys();

        // Limit the number of jerseys to display
        const featuredJerseys = allFeaturedJerseys.slice(0, 4);

        res.render('pageNotFound', {
            featuredJerseys,
            title: 'Page Not Found',
            message: 'It looks like the page you are looking for does not exist.',
            actionUrl: '/jerseys/browse',
            actionText: 'Browse All Jerseys'
        });
    } 
    catch (error) {
        console.error('Error fetching data for page:', error);
        res.status(500).send('An error occurred while loading the page.');
    }
};

module.exports = {
    getAllNews,
    getHomePage,
    getAboutUs,
    getPageNotFound,
    login
}