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


// Schema.statics -> A method that will be invoke on Review.js
// Schema.methods -> A method that can be invoked on the instances (like controllers)


// Method to calculate the average rating and number of reviews for a product
ReviewSchema.statics.calculateAverageRating = async function (productId) {
    // Perform an aggregation pipeline to calculate average rating and number of reviews
    const result = await this.aggregate([
        {
            // Match reviews for the specified product
            $match: {
                product: productId
            }
        }, {
            // Group reviews by product and calculate average rating and number of reviews
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' }, // Calculate average rating
                numOfReviews: { $sum: 1 } // Count the number of reviews
            }
        }
    ])

    // We MUST consider that when we delete all the reviews than we will have an empty array
    // So we MUST cover this operation with a try/catch block
    try {
        await this.model('Product').findOneAndUpdate({
            _id: productId // Find the product by its ID
        }, {
            averageRating: Math.ceil(result[0]?.averageRating || 0), // Set average rating (rounded to nearest integer)
            numOfReviews: result[0]?.numOfReviews || 0 // Set number of reviews
        })
    } catch (error) {
        // Handle any errors that occur during the update
    }
}


// Post middleware to recalculate average rating after saving a review
ReviewSchema.post('save', async function () {
    // Calculate average rating after saving a review
    await this.constructor.calculateAverageRating(this.product);
})

// Post middleware to recalculate average rating after removing a review
ReviewSchema.post('remove', async function () {
    // Calculate average rating after removing a review
    await this.constructor.calculateAverageRating(this.product);
})



// Creating a model named 'Review' based on the defined schema
const Review = mongoose.model('Review', ReviewSchema);
// Creating and exporting the 'User' model using the defined schema
module.exports = Review