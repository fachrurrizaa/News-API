const prisma = require('../libs/prisma');

// GET all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// GET category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.categories.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// POST create category
exports.createCategory = async (req, res) => {
    try {
      const { categories } = req.body;
  
      const categoryExists = await prisma.categories.findUnique({
        where: {
            categories: categories,
        },
      });
  
      if (categoryExists) {
        return res.status(400).json({ message: 'Category already exists' });
      }
  
      const newCategory = await prisma.categories.create({
        data: {
          categories: categories,
        },
      });
  
      res.status(201).json({ message: 'Category created', data: newCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};  

// PUT update category by ID
exports.updateCategoryById = async (req, res) => {
  const { id } = req.params;
  const { categories } = req.body;
  try {
    const updatedCategory = await prisma.categories.update({
      where: {
        id: parseInt(id),
      },
      data: {
        categories,
      },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// DELETE category by ID
exports.deleteCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await prisma.categories.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json(deletedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};