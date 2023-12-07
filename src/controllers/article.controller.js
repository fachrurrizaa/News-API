const prisma = require('../libs/prisma');
const imagekit = require('../libs/imagekit');

// GET all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        categories: true,
        writer: true,
      },
    });
    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// GET article by ID
exports.getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        categories: true,
        writer: true,
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// POST create article
exports.createArticle = async (req, res) => {
    const { title, source, article, preview, categoriesId, writerId } = req.body;
  
    try {
      // Upload image to ImageKit
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const file = req.file;
        if (!file.buffer) {
            return res.status(400).json({ error: 'Invalid file format.' });
        }

        const uploadResponse = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
        });
  
        // Create new article with ImageKit URL
        const newArticle = await prisma.article.create({
            data: {
            title,
            image: uploadResponse.url,
            source,
            article,
            preview,
            categoriesId: parseInt(categoriesId),
            writerId: parseInt(writerId),
            },
            include: {
            categories: true,
            writer: true,
            },
        });
  
      res.status(201).json(newArticle);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};

// PUT update article by ID
exports.updateArticleById = async (req, res) => {
  const { id } = req.params;
  const { title, image, source, article, preview, categoriesId, writerId } = req.body;
  try {
    const updatedArticle = await prisma.article.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        image,
        source,
        article,
        preview,
        categoriesId: parseInt(categoriesId),
        writerId: parseInt(writerId),
      },
      include: {
        categories: true,
        writer: true,
      },
    });

    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// DELETE article by ID
exports.deleteArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedArticle = await prisma.article.delete({
      where: {
        id: parseInt(id),
      },
      include: {
        categories: true,
        writer: true,
      },
    });

    res.status(200).json(deletedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.searchArticleByTitle = async (req, res) => {
  const { query } = req.query;
  try {
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const articles = await prisma.article.findMany({
      where: {
        title: {
          contains: query.toLowerCase() 
        },
      },
      include: {
        categories: true,
        writer: true,
      },
    });

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

exports.searchArticleByCategory = async (req, res) => {
  const { category } = req.query;
  try {
    if (!category) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const articles = await prisma.article.findMany({
      where: {
        categories: {
          categories: category.toLowerCase(),
        },
      },
      include: {
        categories: true,
        writer: true,
      },
    });

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
