// Importing Mongoose
const mongoose = require('mongoose');
// Importing Validator Message
const validator = require('validator')

// Defining the schema for the 'User' model
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minLength: 3,
        trim: true,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        trim: true,
        unique: true,
        validate: {
            message: 'Please provide a valid email',
            validator: validator.isEmail
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [8, 'Your password cannot be less than 8 characters'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'tester'],
        default: 'user'
    }
})

// Creating a model named 'User' based on the defined schema
const User = mongoose.model('User', UserSchema);
// Creating and exporting the 'User' model using the defined schema
module.exports = User