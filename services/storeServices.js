const Store = require('../models/store');

const getAllStores = async () => {
    return await Store.find();
};

const getStoreById = async (id) => {
    return await Store.findById(id);
};

const createStore = async (storeData) => {
    const store = new Store(storeData);
    return await store.save();
};

const updateStore = async (id, storeData) => {
    return await Store.findByIdAndUpdate(id, storeData, { new: true, runValidators: true });
};

const deleteStore = async (id) => {
    return await Store.findByIdAndDelete(id);
};

const findStoreByCoordinates = async (lat, lng) => {
    try {
    
      // Find a store with the same coordinates in the database
      return await Store.findOne({ 'coordinates.lat': lat, 'coordinates.lng': lng });
    } catch (error) {
      console.error('Error checking store coordinates:', error);
      throw error;
    }
  };
module.exports = {
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore,
    findStoreByCoordinates
};