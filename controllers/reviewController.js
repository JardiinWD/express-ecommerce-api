// Importing the Status Codes package for HTTP status code constants
const { StatusCodes } = require('http-status-codes');
// Importing catchAsync utilities
const catchAsync = require("../utilities/catchAsync");
// Importing Review Model
const Review = require('./../models/Review');
// Importing Product Model
const Product = require('./../models/Product');
// Importing the createJWT function created on utilities folder
const { checkPermission } = require('../utilities/index')
// Importing the BadRequest error handler
const { BadRequestError, UnauthenticatedError, CustomAPIError, NotFoundError } = require('./../errors/index');
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: '../config.env' })



/** Controller function to create a review
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const createReview = catchAsync(async (req, res) => {
    // Retrieve the productId from the request body
    const { product: productId } = req.body
    // Check if the Product ID actually exists
    const isValidProduct = await Product.findOne({
        _id: productId
    })

    // Condition where there's no product with requested id
    if (!isValidProduct)
        throw new NotFoundError(`There's no product with such id: ${productId}`)

    // Check if the user already create a review for a specific product
    const alreadySubmitted = await Review.findOne({
        product: productId, // Product ID
        user: req.user.userId // User ID
    })

    // Condition where the user already submitted a review for the product
    if (alreadySubmitted)
        throw new BadRequestError(`You already submitted a review for this product`)

    // Set the user ID for the review
    req.body.user = req.user.userId;
    // Create the review using the request body
    const review = await Review.create(req.body)
    // Send a success response with the created review
    res.status(StatusCodes.CREATED).json({
        status: 'success',
        review
    })
})


/** Controller function to retrieve all reviews
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const getAllReviews = catchAsync(async (req, res) => {
    // Retrieve all reviews from the database
    const reviews = await Review
        .find({})
        .select('-__v')
        .populate({
            path: 'product', // Select the nested data path that you need
            select: 'name company price' // Select the Scheme properties that you need
        })
        .populate({
            path: 'user', // Select the nested data path that you need
            select: 'name' // Select the Scheme properties that you need
        })
    // Send a success response with the retrieved reviews
    res.status(StatusCodes.OK).json({
        status: 'success',
        count: reviews.length,
        reviews
    })
})


/** Controller function to retrieve a single review
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const getSingleReview = catchAsync(async (req, res) => {
    // Retrieve the reviewId from the request.params
    const { id: reviewId } = req.params
    // Find the review on MongoDB where the ID matches with reviewId
    const review = await Review.findOne({
        _id: reviewId
    })
    // If there's no review with such ID then launch a custom error
    if (!review)
        throw new NotFoundError(`No review with id : ${reviewId}`)
    // Send a success response with the created review
    res.status(StatusCodes.CREATED).json({
        status: 'success',
        review
    })
})


/** Controller function to update a single review
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const updateReview = catchAsync(async (req, res) => {
    // Retrieve the reviewId from the request.params
    const { id: reviewId } = req.params
    // Retrieve from the req.body rating, title and comment
    const { rating, title, comment } = req.body
    // Find the review on MongoDB where the ID matches with reviewId
    const review = await Review.findOne({
        _id: reviewId
    })
    // If there's no review with such ID then launch a custom error
    if (!review)
        throw new NotFoundError(`No review with id : ${reviewId}`)
    // Check if this user have the capability for deleting this review
    checkPermission(req.user, review.user)
    // now we can set all Model properties
    review.rating = rating
    review.title = title
    review.comment = comment
    // Now we can delete this review with Model.update
    await review.save()
    // Send a message to Postman
    res.status(StatusCodes.OK).json({
        status: 'success',
        review
    })
})


/** Controller function to delete a single review
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const deleteReview = catchAsync(async (req, res) => {
    // Retrieve the reviewId from the request.params
    const { id: reviewId } = req.params
    // Find the review on MongoDB where the ID matches with reviewId
    const review = await Review.findOne({
        _id: reviewId
    })
    // If there's no review with such ID then launch a custom error
    if (!review)
        throw new NotFoundError(`No review with id : ${reviewId}`)
    // Check if this user have the capability for deleting this review
    checkPermission(req.user, review.user)
    // Now we can delete this review with Model.remove
    await review.remove()
    // Send a message to Postman
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Review successfully deleted'
    })
})


module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
}