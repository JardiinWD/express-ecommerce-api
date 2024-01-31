// ===== IMPORT PACKAGES ====== //
const express = require('express')
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require(`${__dirname}/db/connect`);

// ===== EXTRA PACKAGES ====== //
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss')

// ===== IMPORT MIDDLEWARES ====== //
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticationMiddleware = require('./middleware/authentication')

// ===== FUNCTIONALITY ====== //

// Creating an Express application
const app = express();
// Configuring dotenv and specifying the path for the environment variables file
dotenv.config({ path: './config.env' })
// Use morgan
app.use(morgan('dev'))

// ===== SECURITY MIDDLEWARES ====== //
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
})

app.use(limiter);
app.use(helmet());
app.use(cors);
app.use(xss);


// ===== JSON AND STATIC MIDDLEWARES ====== //
app.use(express.json());
app.use(express.static('./public'))

// ===== ROUTES ====== //
// app.use('/api/v1/jobs-api/auth', authRouter)
// app.use('/api/v1/jobs-api/jobs', authenticationMiddleware, jobsRouter)
app.use('/api/v1/express-ecommerce-api', (req, res) => {
    console.log("Hello World");
})


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









