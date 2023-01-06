const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const cors = require('cors')

dotenv.config({"path": "./config/config.env"})

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser());

app.use('/api/v1/user', require('./routes/auth'))
app.use('/api/v1/product', require('./routes/product'))
app.use('/api/v1/review', require('./routes/review'))
app.use('/api/v1/order', require('./routes/order'))

app.all('*', (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Can't find ${req.originalUrl} on the server`
    })
})

// Error handhler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`)
})