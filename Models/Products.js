`sketch do banco de dados de produtos`

const mongoose = require("mongoose");

const { Schema } = mongoose;
const { categoriesSchema } = require("./Categories");

const titleSchema = new Schema({
    title_pt: {
        type: String,
    },
    title_en: {
        type: String,
    },
    title_es: {
        type: String,
    }
}, { versionKey: false }
);

const descriptionSchema = new Schema({
    description_pt: {
        type: String,
    },
    description_en: {
        type: String,
    },
    description_es: {
        type: String,
    }
}, { versionKey: false }
);

const ratingSchema = new Schema({
    rate: {
        type: Number,
    },
    count: {
        type: Number,
    }
}, { versionKey: false }
);

const productSchema = new Schema({
    title: titleSchema,
    price: {
        type: Number,
    },
    description: descriptionSchema,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    imagem: {
        type: String,
    },
    rating: ratingSchema,
    id_stripe: { type: String },
    id_stripe_prod: { type: String }
}, { versionKey: false }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;