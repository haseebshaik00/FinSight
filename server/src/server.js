const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../.env' });

const connectDB = require('./config/db');
connectDB();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/UserRoutes');
const transactionRoutes = require('./routes/TransactionRoutes');
const savingRoutes = require('./routes/SavingRoutes');

app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    next();
  });

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/savings', savingRoutes);

const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));