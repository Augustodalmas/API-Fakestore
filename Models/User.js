`Sketch do banco de dados de categorias`

const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
    },
    name: {
        type: String,
    },
    password1: {
        type: String,
    },
    password2: {
        type: String,
    },
    history: [{
        type: Schema.Types.ObjectId,
        ref: 'Cart',
    }],
    products_reviewed: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    }],
    role: {
        type: String,
        enum: ['admin', 'gerente', 'comprador', 'vendedor'],
        default: 'comprador'
    },
    address: [{
        type: Schema.Types.ObjectId,
        ref: 'Address',
    }],
    favorite_address: { type: String },
    data_nascimento: {
        type: Date
    },
    email: {
        type: String
    },
    telefone: {
        type: String
    },
    public: {
        type: String
    },
    block: {
        type: Boolean
    }
    , tentativas: {
        type: Number
    }
}, { versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;