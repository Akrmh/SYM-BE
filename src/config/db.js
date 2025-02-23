const mongoose = require('mongoose');

// Event listener for successful connection
mongoose.connection.on('connected', () => {
  console.log('DB connected successfully...');
});

// Event listener for connection errors
mongoose.connection.on('error', (err) => {
  console.error('DB connection failed:', err.message);
});

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error('DB connection failed:', error.message);
}
};

module.exports = dbConnection;