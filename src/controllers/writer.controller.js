const prisma = require('../libs/prisma');
const imagekit = require('../libs/imagekit');

exports.create = async (req, res) => {
    try {
        const { name, about } = req.body;

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

        const writer = await prisma.writer.create({
            data: {
                name,
                image: uploadResponse.url,
                about,
            },
        });

        res.status(201).json(writer);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
};
