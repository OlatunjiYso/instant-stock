import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const dbUrl = process.env.DB_URL;
const env = process.env.NODE_ENV;


const connect = async() => {
    try {
        await mongoose.connect(dbUrl!, {});
    } 
    catch(err) {
        const errMessage = (err as Error).message;
        console.log(`Error connecting to db on ${env} environment`, errMessage)
    }
}
const disconnect = async() => { 
    try {
        await mongoose.connection.close();
    } 
    catch(err) {
        const errMessage = (err as Error).message;
        console.log(`Error Disonnecting from db on ${env} environment`, errMessage)
    }
}


export default { connect, disconnect }