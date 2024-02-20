// Importing Mongoose
const mongoose = require('mongoose');

// Schema for a single item in the cart
const SingleCartItemSchema = mongoose.Schema({
    // Name of the item
    name: {
        type: String,
        required: true
    },
    // Image URL of the item
    image: {
        type: String,
        required: true
    },
    // Price of the item
    price: {
        type: Number,
        required: true
    },
    // Amount of the item
    amount: {
        type: Number,
        required: true
    },
    // Reference to the product associated with the item
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    }
})

// Schema for the Order model
const OrderSchema = new mongoose.Schema({
    // Tax for the order
    tax: {
        type: Number,
        required: true
    },
    // Shipping fee for the order
    shippingFee: {
        type: Number,
        required: true
    },
    // Subtotal of the order
    subtotal: {
        type: Number,
        required: true
    },
    // Total amount of the order
    total: {
        type: Number,
        required: true
    },
    // Array of cart items in the order
    cartItems: [SingleCartItemSchema],
    // Status of the order
    status: {
        type: String,
        enum: ['pending', 'failed', 'paid', 'delivered', 'cancelled'],
        default: 'pending'
    },
    // Reference to the user who placed the order
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    // Secret key for the payment intent
    clientSecret: {
        type: String,
        required: true
    },
    // Payment intent ID
    paymentIntentId: {
        type: String,
    }
}, {
    timestamps: true
})

// Creating a model named 'Order' based on the defined schema
const Order = mongoose.model('Order', OrderSchema);
// Exporting the 'Order' model
module.exports = Order
