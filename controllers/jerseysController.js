const jerseysServices = require("../services/jerseysServices")
const reviewServices = require("../services/reviewServices")

// For making HTTP requests to the API (Facebook API)
const axios = require('axios');


const getAllJerseys = async (req, res) => {
    // Extract filters and sorting options from the query parameters
    const team = req.query.team || [];
    const kitType = req.query.kitType || [];
    const minPrice = req.query.minPrice || '';
    const maxPrice = req.query.maxPrice || '';
    const orderBy = req.query.orderBy || 'featured';

    // Ensure team and kitType are arrays
    const teamArray = Array.isArray(team) ? team : [team];
    const kitTypeArray = Array.isArray(kitType) ? kitType : [kitType];

    // Initialize the query object
    let query = {};

    // Add filters to the query object if they exist
    if (teamArray.length > 0 && teamArray[0] !== '') {
        query.team = { $in: teamArray };
    }

    if (kitTypeArray.length > 0 && kitTypeArray[0] !== '') {
        query.kitType = { $in: kitTypeArray };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Initialize the sort object
    let sort = {};

    // Add sorting options
    if (orderBy === 'priceAsc') {
        sort.price = 1; // Ascending order
    } else if (orderBy === 'priceDesc') {
        sort.price = -1; // Descending order
    } else if (orderBy === 'featured') {
        // Define your own sorting logic for 'featured' if needed
    }

    try {
        // Fetch the jerseys from the database with filters and sorting applied
        const jerseys = await jerseysServices.getAllJerseys(query, sort);
        const { teams, kitTypes } = await jerseysServices.getDistinctTeamsAndKitTypes();

        res.render("getAllJerseys.ejs", {
            jerseys,
            teams,
            kitTypes,
            team: teamArray,
            kitType: kitTypeArray,
            minPrice,
            maxPrice,
            orderBy
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Display all jerseys in admin panel
const getAllJerseysAdmin = async (req, res) => {
    try {
        const jerseys = await jerseysServices.getAllJerseys();
        res.render('adminJerseys.ejs', { jerseys, title: 'Manage Jerseys' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


// Return specific jersey page
const getJerseyById = async (req, res) => {
    try {
        const jerseyId = req.params.id;

        if (!jerseyId) {
            return res.status(400).redirect('/pageNotFound');
        }

        // Get the jersey details
        const jersey = await jerseysServices.getJerseyById(jerseyId);

        if (!jersey) {
            return res.status(404).redirect('/pageNotFound');
        }

        // Fetch reviews for this specific jersey
        const reviews = await reviewServices.getReviewsByJerseyId(jerseyId);

        // Pass jersey data and reviews to the view
        const userId = req.session.username;
        return res.render("getJersey.ejs", { jersey, reviews, userId });
    } catch (error) {
        console.error('Error fetching jersey or reviews:', error);
        return res.status(500).redirect('/pageNotFound');
    }
};



const createJersey = async (team) => {

    // create new document using team parameter provided by the user
    const jersey = new Jersey({
        team: team,
        price: 84.99, // Store as Number, not String
        kitType: "2024 Home Kit"
    });

    // You can set additional fields if necessary
    // jersey.price = 84.99; 
    // jersey.kitType = "2024 Home Kit"; 

    // Actually add this document inside our Jerseys collection
    return await jersey.save();
};


const deleteJerseyById = async (req, res) => {
    const jerseyId = req.params.id
    if (jerseyId == undefined)
        res.status(404).send()
    else{
        const code = await jerseysServices.deleteJerseyById(jerseyId)

        // the model always will return undefined if did not find or did not done the operation, as our standard.
        if (code == undefined)
            res.status(404).send()
        else{
            // we could do this line instead:
            // getAllJerseys(req, res)
            // but the user would be staying in this url - /jerseys/2 , and a refresh would do this operation again. so we want redirect him to another url,
            // so after refresh we will get the same page he is  again and not the operation

            // Send a success response instead of redirecting, for ajax
            res.status(200).json({ message: 'Item deleted successfully' });
        }
    }
}

// functions with api prefix related to apis route
const apiGetJerseysByPrefix = async (req, res) => {
    const jerseys = await jerseysServices.getJerseysByTeamPrefix(req.params.teamPrefix);
    res.json(jerseys);

}

const apiGetAllJerseys = async (req, res) => {
    const jerseys = await jerseysServices.getAllJerseys();
    res.json(jerseys);
}


// Function to serve jersey images
const getJerseyImage = async (req, res) => {
    const id = req.params.id;
    try {
        const jersey = await jerseysServices.getJerseyById(id);
        if (!jersey || !jersey.image || !jersey.image.data) {
            return res.status(404).send('Image not found');
        }
        res.contentType(jersey.image.contentType);
        res.send(jersey.image.data);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500)
    }
};

// Display form to add a new jersey
const getAddJerseyForm = (req, res) => {
    res.render('addJersey.ejs', { title: 'Add New Jersey' });
};

const addJersey = async (req, res) => {
    const { team, teamTwitterHandle, kitType, price, allSizes, description } = req.body;
    const imageFile = req.file;

    // Check if allSizes is undefined or empty
    if (!allSizes || (Array.isArray(allSizes) && allSizes.length === 0)) {
        return res.redirect('/admin/jerseys/add?error=1');
    }

    const sizesArray = Array.isArray(allSizes) ? allSizes : [allSizes];
    const jerseyData = {
        team,
        teamTwitterHandle,
        kitType,
        price: parseFloat(price),
        sizes: sizesArray,
        image: {
            data: imageFile.buffer,
            contentType: imageFile.mimetype
        },
        description
    };

    try {
        // Save the jersey to the database
        await jerseysServices.createJersey(jerseyData);
        require('dotenv').config(); // Load environment variables
        // Facebook API Post
        const pageAccessToken = process.env.FACEBOOK_TOKEN;  // Add your Facebook Page Access Token here
        const facebookPageId = process.env.FACEBOOK_PAGE_ID;  // Add your Facebook Page ID here
        
        const message = `New Jersey Added: ${team} (${kitType} Kit) now available for $${price}. Sizes: ${sizesArray.join(', ')}.`;
        // const message = 'Hi, test project API' 
        const fbResponse = await axios.post(`https://graph.facebook.com/${facebookPageId}/feed`, {
            message,
            access_token: pageAccessToken
        });

        console.log('Facebook Post ID:', fbResponse.data.id);

        res.redirect('/admin/jerseys');
    } catch (error) {
        console.error('Error adding jersey or posting to Facebook:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Display form to edit a jersey
const getEditJerseyForm = async (req, res) => {
    const id = req.params.id;
    try {
        const jersey = await jerseysServices.getJerseyById(id);
        if (!jersey) {
            return res.status(404).redirect('/pageNotFound');
        }
        res.render('editJersey.ejs', { jersey, title: 'Edit Jersey' });
    } catch (error) {
        console.error(error);
        res.status(500).redirect('/pageNotFound');
    }
};

const editJersey = async (req, res) => {
    const id = req.params.id;
    const { team, teamTwitterHandle, kitType, price, category, description } = req.body;
    const sizesArray = req.body.allSizes || [];  // If no sizes are selected, default to an empty array
    const imageFile = req.file;  // Check if an image was uploaded

    const updateData = {
        team,
        teamTwitterHandle,
        kitType,
        price: parseFloat(price),
        sizes: sizesArray,
        category,
        description
    };

    // Only update the image if a new one was uploaded
    if (imageFile) {
        updateData.image = {
            data: imageFile.buffer,
            contentType: imageFile.mimetype
        };
    }

    try {
        const jersey = await jerseysServices.updateJerseyById(id, updateData);
        if (!jersey) return res.status(404).send('Jersey not found');
        res.redirect('/admin/jerseys');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    getAllJerseys,
    getAllJerseysAdmin,
    getJerseyById,
    createJersey,
    getJerseyImage,
    deleteJerseyById,
    apiGetJerseysByPrefix,
    apiGetAllJerseys,
    getAddJerseyForm,
    addJersey,
    getEditJerseyForm,
    editJersey
}