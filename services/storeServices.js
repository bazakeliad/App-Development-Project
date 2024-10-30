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

module.exports = {
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore
};