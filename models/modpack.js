const mongoose = require('mongoose');

const modpackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    modloader: { type: String, required: true },
    version: { type: String, required: true },
    image: { type: String },
    file: { type: String }
});

const Modpack = mongoose.model('Modpack', modpackSchema);
module.exports = Modpack;
