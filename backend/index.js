import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/db.js';
import UserRoute from './routes/userRoutes.js';
import companyRoute  from './routes/companyRoutes.js';
import jobRoute from './routes/jobRoutes.js';
import applicationRoute from './routes/applicationRoutes.js';
dotenv.config({});
const app= express();
//import User from './models/userModel.js';


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
     origin:'http//localhost:5173',
     credentials:true
}
app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;
//api's
app.use("/api/v1/User", UserRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
//"http://localhost:8000/api/v1/User/register"
//"http://localhost:8000/api/v1/User/login"
//"http://localhost:8000/api/v1/User/profile/update"
app.listen(PORT,()=>{
    connectDB();
    console.log(`server running at port ${PORT}`);
});