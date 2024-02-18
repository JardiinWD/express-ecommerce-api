// Importing the Status Codes package for HTTP status code constants
const { StatusCodes } = require('http-status-codes');
// Importing catchAsync utilities
const catchAsync = require("../utilities/catchAsync");
// Importing Product Model
const Product = require('./../models/Product');
// Importing the BadRequest error handler
const { BadRequestError, UnauthenticatedError, CustomAPIError, NotFoundError } = require('./../errors/index');
// Importing the dotenv package for environment variable configuration
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: '../config.env' })



/** Controller function to create a product
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const createProduct = catchAsync(async (req, res) => {
    // Set the user ID for the product
    req.body.user = req.user.userId;
    // Create the product using the request body
    const product = await Product.create(req.body)
    // Send a success response with the created product
    res.status(StatusCodes.CREATED).json({
        status: 'success',
        product
    })
})


/** Controller function to retrieve all products
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const getAllProducts = catchAsync(async (req, res) => {
    // Retrieve all products from the database
    const products = await Product.find({}).select('-__v')
    // Send a success response with the retrieved products
    res.status(StatusCodes.OK).json({
        status: 'success',
        count: products.length,
        products
    })
})


/** Controller function to retrieve a single product
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const getSingleProduct = catchAsync(async (req, res) => {
    // Extract the product ID from the request parameters
    const { id: productId } = req.params
    // Check if the product ID is provided
    if (!productId)
        throw new BadRequestError('You need an ID to perform this operation')
    // Find the product in the database
    const product = await Product.findOne({
        _id: productId
    })
    // Check if the product exists
    if (!product)
        throw new NotFoundError(`There's no product with this id: ${productId}`)

    // Send a success response with the retrieved product
    res.status(StatusCodes.OK).json({
        status: 'success',
        product
    })
})


/** Controller function to update a single product
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const updateProduct = catchAsync(async (req, res) => {
    // Extract the product ID from the request parameters
    const { id: productId } = req.params
    // Check if the product ID is provided
    if (!productId)
        throw new BadRequestError('You need an ID to perform this operation')
    // Update the product in the database
    const updatedProduct = await Product.findOneAndUpdate({
        _id: productId
    }, req.body, {
        new: true,
        runValidators: true
    })
    // Check if the updated product exists
    if (!updatedProduct)
        throw new NotFoundError(`There's no product with this id: ${productId}`)
    // Send a success response with the updated product
    res.status(StatusCodes.OK).json({
        status: 'success',
        updatedProduct
    })
})


/** Controller function to delete a single product
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const deleteProduct = catchAsync(async (req, res) => {
    // Extract the product ID from the request parameters
    const { id: productId } = req.params
    // Check if the product ID is provided
    if (!productId)
        throw new BadRequestError('You need an ID to perform this operation')
    // Find the product to delete
    const productToDelete = await Product.findOne({
        _id: productId
    })
    // Check if the product exists
    if (!productToDelete)
        throw new NotFoundError(`There's no product with this id: ${productId}`)
    // Delete the product
    await productToDelete.remove()
    // Send a success response
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Product was successfully deleted!'
    })
})


/** Controller function for upload image for single product
 * @param {Object} req - Express request object. Contains information about the client's request.
 * @param {Object} res - Express response object. Used to send a response to the client.
 */
const uploadImage = catchAsync(async (req, res) => {
    res.send('uploadImage')
})


module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}