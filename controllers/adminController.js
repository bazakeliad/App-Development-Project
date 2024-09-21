// controllers/adminController.js

const jerseysServices = require('../services/jerseysServices');

// Display all jerseys in admin panel
const getAllJerseysAdmin = async (req, res) => {
    try {
        const jerseys = await jerseysServices.getAllJerseys();
        res.render('adminJerseys.ejs', { jerseys });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Display form to add a new jersey
const getAddJerseyForm = (req, res) => {
    res.render('addJersey.ejs');
};

// Handle adding a new jersey
const addJersey = async (req, res) => {
    const { team, kitType, price, image } = req.body;
    const jerseyData = { team, kitType, price: parseFloat(price), image };
    try {
        await jerseysServices.createJersey(jerseyData);
        res.redirect('/admin/jerseys');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Display form to edit a jersey
const getEditJerseyForm = async (req, res) => {
    const id = req.params.id;
    try {
        const jersey = await jerseysServices.getJerseyById(id);
        if (!jersey) {
            return res.status(404).send('Jersey not found');
        }
        res.render('editJersey.ejs', { jersey });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Handle editing a jersey
const editJersey = async (req, res) => {
    const id = req.params.id;
    const { team, kitType, price, image } = req.body;
    try {
        const jersey = await jerseysServices.updateJerseyById(id, {
            team,
            kitType,
            price: parseFloat(price),
            image
        });
        if (!jersey) {
            return res.status(404).send('Jersey not found');
        }
        res.redirect('/admin/jerseys');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

// Handle deleting a jersey
const deleteJersey = async (req, res) => {
    const id = req.params.id;
    try {
        const jersey = await jerseysServices.deleteJerseyById(id);
        if (!jersey) {
            return res.status(404).send('Jersey not found');
        }
        res.redirect('/admin/jerseys');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getAllJerseysAdmin,
    getAddJerseyForm,
    addJersey,
    getEditJerseyForm,
    editJersey,
    deleteJersey
};
