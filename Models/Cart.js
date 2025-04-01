const mongoose = require('mongoose');
const { Schema } = mongoose;


const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    }],
    data_fechamento: {
        type: Date,
    },
    status: {
        type: Boolean
    },
    totalprice: {
        type: Number
    }
}, { versionKey: false }
)
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;