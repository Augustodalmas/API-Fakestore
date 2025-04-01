const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema({
    User: { type: Schema.Types.ObjectId, ref: 'User' },
    CEP: { type: String },
    Bairro: { type: String },
    UF: { type: String },
    Estado: { type: String },
    Complemento: { type: String },
    Logradouro: { type: String },
    Numero: { type: String },
}, { versionKey: false }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;