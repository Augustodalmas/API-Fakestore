`Sketch do banco de dados de categorias`

const mongoose = require("mongoose");

const { Schema } = mongoose;

const categoriesSchema = new mongoose.Schema({
    name_pt: {
        type: String,
    },
    name_en: {
        type: String,
    },
    name_es: {
        type: String,
    }
},{versionKey:false}
);

const Category = mongoose.model("Category", categoriesSchema);

module.exports = Category;