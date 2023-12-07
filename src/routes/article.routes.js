module.exports = function (app) {
    const articles = require('../controllers/article.controller');
    const router = require('express').Router();
    const multer = require('multer');
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    router.get('/', articles.getAllArticles);
    router.get('/search', articles.searchArticleByTitle);
    router.get('/categories/search', articles.searchArticleByCategory);
    router.get('/:id', articles.getArticleById);
    router.post('/', upload.single('image'), articles.createArticle);
    router.put('/:id', articles.updateArticleById);
    router.delete('/:id', articles.deleteArticleById);

    app.use('/api/articles', router);
}