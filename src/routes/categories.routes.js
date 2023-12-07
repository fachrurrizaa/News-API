module.exports = function (app) {
    const express = require('express');
    const router = express.Router();
    const categories = require('../controllers/categories.controller');


    router.get('/', categories.getAllCategories);
    router.get('/:id', categories.getCategoryById);
    router.post('/', categories.createCategory);
    router.put('/:id', categories.updateCategoryById);
    router.delete('/:id', categories.deleteCategoryById);

    app.use('/api/categories', router);
}