# Transaction Backend API

This is an Express.js backend for managing credit/debit transactions with MySQL and Sequelize.

## Features

- REST API for creating and listing transactions
- Balance calculation and validation
- Error handling and validation
- CORS enabled for frontend integration

## Setup

1. **Install dependencies**
   ```sh
   npm install
   ```

2. **Configure MySQL**
   - Create a database (e.g. `transaction`)
   - Update credentials in `/server/db/client.js` if needed

3. **Run migrations/models**
   - Ensure your Sequelize models are synced with the database

4. **Start the server**
   ```sh
   node server/server.js
   ```
   The server runs on [http://localhost:8001](http://localhost:8001)

## API Endpoints

### Health Check
- `GET /api/health`  
  Returns API and DB status.

### List Transactions
- `GET /api/transactions`  
  Returns all transactions, newest first.

### Create Transaction
- `POST /api/transactions`  
  Body:
  ```json
  {
    "description": "string",
    "amount": "number",
    "transactionType": "credit | debit"
  }
  ```
  Returns error if insufficient balance for debit.

## Project Structure

```
server/
  db/
    client.js
    models/
      transactions.js
  server.js