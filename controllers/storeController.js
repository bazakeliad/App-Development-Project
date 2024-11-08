const storeServices = require('../services/storeServices');

// Get all stores (for admin)
const getAllStores = async (req, res) => {
    try {
        const stores = await storeServices.getAllStores();
        res.render('adminStores', { stores });
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).send('Internal server error');
    }
};

// Render the Add Store page
const renderAddStorePage = (req, res) => {
    res.render('addStore');
};

// Create a new store
const createStore = async (req, res) => {
  try {
      const storeData = {
          name: req.body.name,
          address: req.body.address,
          coordinates: {
              lat: req.body.lat,
              lng: req.body.lng
          }
      };
      await storeServices.createStore(storeData);
      res.redirect('/admin/stores?message=Store added successfully&type=success');
    } catch (error) {
        console.error('Error adding store:', error);

        // Redirect with error message
        res.redirect('/admin/stores?message=Error adding store&type=error');
    }
};

// Render the Edit Store page
const renderEditStorePage = async (req, res) => {
    try {
        const store = await storeServices.getStoreById(req.params.id);
        if (!store) return res.status(404).send('Store not found');
        res.render('editStore', { store });
    } catch (error) {
        console.error('Error fetching store:', error);
        res.status(500).redirect('/pageNotFound');
    }
};

// Update a store
const updateStore = async (req, res) => {
  try {
      const storeData = {
          name: req.body.name,
          address: req.body.address,
          coordinates: {
              lat: req.body.lat,
              lng: req.body.lng
          }
      };

      await storeServices.updateStore(req.params.id, storeData);

        // Redirect with success message
        res.redirect('/admin/stores?message=Store updated successfully&type=success');
    } catch (error) {
        console.error('Error updating store:', error);
        
        // Redirect with error message
        res.redirect('/admin/stores?message=Error updating store&type=error');
    }
};

// Delete a store
const deleteStore = async (req, res) => {
    try {
        await storeServices.deleteStore(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting store:', error);
        res.status(500).send('Error deleting store');
    }
};

module.exports = {
    getAllStores,
    renderAddStorePage,
    createStore,
    renderEditStorePage,
    updateStore,
    deleteStore
};