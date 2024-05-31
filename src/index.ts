import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import connectDB from './database/connection';
import { userRoute } from './api/user/user.controller';
import { dashboardRoute } from './api/dashboard/dashboard.controller';
import auth from './globals/auth.service';
connectDB()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/user', userRoute)
//authenticated dashboard routes
app.use('/api/dashboard', auth, dashboardRoute)


const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log("Server is running on port:-", port)
})
