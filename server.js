const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./db/client');
const Transactions = require('./db/models/transactions');

require('dotenv').config(); // Add this at the top

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON and urlencoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root endpoint for basic server check
app.get('/', (req, res) => {
    res.send('Express server is running!');
});

// Health check endpoint to verify DB connection
app.get('/api/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        res.json({ message: 'API endpoint is working!' });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

// Get all transactions, ordered by newest first
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transactions.findAll({
            order: [['id', 'DESC']],
        });
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new transaction (credit or debit)
app.post('/api/transactions', async (req, res) => {
    try {
        const { description, amount, transactionType } = req.body;

        // Validate required fields
        if (!description || !amount || !transactionType) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        if(amount < 1) {
            return res.status(400).json({ error: 'Amount must be greater than 1.' });
        }
        // Find the last transaction to get the current balance
        const findLastTransaction = await Transactions.findOne({
            order: [['id', 'DESC']]
        });

        const updatedAmount = parseFloat(amount);
        let credit = 0, debit = 0;

        // Set credit or debit based on transaction type
        if (transactionType === 'credit') {
            credit = updatedAmount;
        } else if (transactionType === 'debit') {
            debit = updatedAmount;
        }
        let newBalance = credit;
        // If no previous transaction, only allow credit

        const lastBalance = findLastTransaction?.balance || 0;
        newBalance = lastBalance + credit - debit;
        // Prevent negative balance for debit
        if (newBalance < 0 && debit > 0) {
            throw new Error('Insufficient balance for debit transaction.');
        }
        await Transactions.create({
            description: description,
            credit: credit || 0,
            debit: debit || 0,
            balance: newBalance,
            date: new Date()
        });
        res.json({ message: 'API endpoint is working!' });
    } catch (error) {
        // Send error message to client
        console.error('Unable to connect to the database:', error);
        res.status(400).json({ error: error.message });
    }
});

// Start the server on port 8001
const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Export the app for testing or further configuration
module.exports = app;