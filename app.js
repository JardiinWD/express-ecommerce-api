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
const mongoSanitize = require('express-mongo-sanitize')
const cookieParser = require('cookie-parser')
// ===== IMPORT ROUTES ====== //
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const orderRoutes = require('./routes/orderRoutes')
// ===== IMPORT MIDDLEWARES ====== //
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// ==== SECURITY AND DATA SANITIZATION ===== //

// Setting trust proxy to 1 to trust the first hop
app.set('trust proxy', 1)

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
})

// Middleware to Limit access to resources after 100 requests (Preventing DDos attack)
app.use('/api', limiter);

// Middleware for Set Security HTTP Headers
app.use(helmet());
// Middleware for Set Security CORS
app.use(cors())
// Middleware for Set Security XSS Protector
app.use(xss())
// Middleware for MongoDB Sanitizer
app.use(mongoSanitize())


// ===== FUNCTIONALITY ====== //

// Apply logging middleware using Morgan in 'dev' mode
app.use(morgan('dev'));
// Middleware to parse JSON bodies of incoming requests
app.use(express.json());
// Middleware to parse cookies attached to the request
app.use(cookieParser(process.env.JWT_SECRET));


// ===== ROUTES ====== //

app.use('/api/v1/express-ecommerce-api/auth', authRoutes)
app.use('/api/v1/express-ecommerce-api/users', userRoutes)
app.use('/api/v1/express-ecommerce-api/products', productRoutes)
app.use('/api/v1/express-ecommerce-api/reviews', reviewRoutes)
app.use('/api/v1/express-ecommerce-api/orders', orderRoutes)


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









