// Importing Mongoose
const mongoose = require('mongoose');
// Importing Validator Message
const validator = require('validator')
// Importing the bcryptjs package for password hashing
const bcrypt = require('bcryptjs');


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


// Hash the password before saving it to the database
UserSchema.pre('save', async function (next) {
    // Check if user's password change
    if (!this.isModified('password')) return
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    // Call the next middleware
    next();
});


// Compare the provided password with the hashed password stored in the database
UserSchema.methods.comparePassword = async function (candidatePassword) {
    // Compare the candidate password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    // Return the result of the comparison
    return isMatch;
}


// Creating a model named 'User' based on the defined schema
const User = mongoose.model('User', UserSchema);
// Creating and exporting the 'User' model using the defined schema
module.exports = User