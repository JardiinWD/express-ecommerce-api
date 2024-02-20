// Importing Mongoose
const mongoose = require('mongoose');
// Importing Validator Message
const validator = require('validator')

// Defining the schema for the 'Product' model
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please provide product name'],
        maxLength: [100, 'Name cannot be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'A product must have its price'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
        maxLength: [1000, 'Description cannot be more than 1000 characters']
    },
    image: {
        type: String,
        default: '/uploads/example.jpeg'
    },
    category: {
        type: String,
        required: [true, 'Please provide product category'],
        enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: '{VALUE} is not supported'
        },
    },
    colors: {
        type: [String],
        default: ['#222'],
        required: true,
    },
    featured: {
        type: Boolean,
        required: false
    },
    freeShipping: {
        type: Boolean,
        default: false
    },
    inventory: {
        type: Number,
        default: 15,
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
    // This is where we set virtuals to true (In order to create the same populate logic but without storing on db)
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})


// Create Virtual for reviews WITHOUT ReviewSchema
ProductSchema.virtual('reviews', {
    ref: 'Review', // Reference to the 'Review' model
    localField: '_id', // Field in the current model
    foreignField: 'product', // Field in the referenced model
    justOne: false, // Allow multiple reviews for a product
})

// Middleware to delete associated reviews when a product is removed
ProductSchema.pre('remove', async function (next) {
    // Find and delete all reviews associated with the product
    await this.model('Review').deleteMany({
        product: this._id
    })
})



// Creating a model named 'User' based on the defined schema
const Product = mongoose.model('Product', ProductSchema);
// Creating and exporting the 'User' model using the defined schema
module.exports = Product