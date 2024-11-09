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
        // Validate input
        const { name, address, lat, lng } = req.body;
  
        if (!name || !address || !lat || !lng) {
            return res.redirect('/admin/stores?message=All fields are required&type=error');
        }
  
        // Parse lat and lng to ensure they are numbers
        const parsedLat = parseFloat(lat);
        const parsedLng = parseFloat(lng);
  
        // Check if the coordinates already exist in the database
        const existingStore = await storeServices.findStoreByCoordinates(parsedLat, parsedLng);
  
        if (existingStore) {
            
            // If a store with the same coordinates exists, return an error message
            return res.redirect('/admin/stores?message=Store with these coordinates already exists&type=error');
        }
  
        // Create store data object
        const storeData = {
            name,
            address,
            coordinates: {
                lat: parsedLat,
                lng: parsedLng
            }
        };
        await storeServices.createStore(storeData);
  
        // Redirect with success message
        res.redirect('/admin/stores?message=Store added successfully&type=success');
    } catch (error) {
        console.error('Error adding store:', error);
  
        // Send a generic error message
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