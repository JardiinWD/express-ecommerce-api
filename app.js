// ===== IMPORT PACKAGES ====== //
const express = require('express')
// Creating an Express application
const app = express();
const dotenv = require('dotenv');
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: './config.env' })
const morgan = require('morgan');
const connectDB = require(`${__dirname}/db/connect`);
// ===== EXTRA PACKAGES ====== //
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss')
const cookieParser = require('cookie-parser')
// ===== IMPORT ROUTES ====== //
const authRoutes = require('./routes/authRoutes')
// ===== IMPORT MIDDLEWARES ====== //
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticationMiddleware = require('./middleware/authentication')

// ==== SECURITY AND DATA SANITIZATION ===== //

// Middleware for Set Security HTTP Headers
app.use(helmet());

// ===== SECURITY MIDDLEWARES ====== //
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
})

// Middleware to Limit access to resources after 100 requests (Preventing DDos attack)
app.use('/api', limiter);


// ===== FUNCTIONALITY ====== //

// Apply logging middleware using Morgan in 'dev' mode
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


// ===== ROUTES ====== //
app.use('/api/v1/express-ecommerce-api/auth', authRoutes)


// ===== OTHER MIDDLEWARES ====== //
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Setting the MongoDB URI
const mongoDbUri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
// Setting the server to listen on process.env.SERVER_PORT
const port = process.env.SERVER_PORT || 3375

// Function to start the server after connecting to the database
const start = async () => {
    try {
        // Connecting to the database
        await connectDB(mongoDbUri);
        // Starting the Express app and listening on the specified port
        app.listen(port, () => {
            console.log(`App is currently running on port: ${port}`);
        });
    } catch (error) {
        // Handling errors during the startup process
        console.error(error.message);
    }
}

// Calling the 'start' function to initiate the server startup process
start();









