const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../.env' });

const connectDB = require('./config/db');
connectDB();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:5173", // use 3000 if using CRA instead of Vite
  credentials: true,
}));

// Routes
const authRoutes = require('./routes/AuthRoutes')
const userRoutes = require('./routes/UserRoutes');
const transactionRoutes = require('./routes/TransactionRoutes');

app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
  });
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

const forecastRoutes = require('./routes/SavingsForecastRoute');
app.use('/api/forecast', forecastRoutes);


const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));