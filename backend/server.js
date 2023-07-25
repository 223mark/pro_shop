import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cookieParser from 'cookie-parser'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import ordrRoutes from './routes/orderRoutes.js';

dotenv.config()

connectDB()

// Init express
const app = express()


// For passing req body data -> body parser middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Cookie parser middleware -> it allows us to get access req.cookie
app.use(cookieParser())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', ordrRoutes)

app.get('/api/config/paypal', (req,res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}))



// error middlewore funcs
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in  ${PORT}`.yellow.bold
  )
)
