import express from 'express';
import cors from 'cors';
import "dotenv/config";
import sequelize from './db.js';
import authRouter from './routes/userRoutes.js'
import bodyParser from 'body-parser';

const app = express();

const port = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.json());
app.use( authRouter)

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        console.log(`Server is running on port ${port}`);
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

  (async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }

   
    app.listen(port, () => {
        connectToDatabase();
    });
})();


export default app;