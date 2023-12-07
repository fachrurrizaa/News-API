module.exports = function (app) {
    const writer = require("../controllers/writer.controller.js");
    const router = require("express").Router();
    const multer = require('multer');
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    router.post("/", upload.single('image'), writer.create);

    app.use("/api/writers", router);
}