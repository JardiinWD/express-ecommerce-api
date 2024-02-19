// Importing Mongoose
const mongoose = require('mongoose');
// Importing Validator Message
const validator = require('validator')

// Defining the schema for the 'Product' model
const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, ' Please provide rating']
    },
    title: {
        type: String,
        trim: true,
        required: [true, ' Please provide review title'],
        maxlength: 100
    },
    comment: {
        type: String,
        required: [true, ' Please provide review description'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    }
}, {
    timestamps: true
})

// To prevent a single user to WRITE a ton of bad reviews on a single product
ReviewSchema.index({
    product: 1,
    user: 1
}, {
    unique: true
})

// Creating a model named 'Review' based on the defined schema
const Review = mongoose.model('Review', ReviewSchema);
// Creating and exporting the 'User' model using the defined schema
module.exports = Review