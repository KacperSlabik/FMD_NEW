const { error } = require('console');
const mongoose = require('mongoose');

const connect = mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on('connected', () => {
	console.log('MongoDB connection is successful');
});

connection.on('error', () => {
	console.log('Error in MongoDB connection', error);
});

module.exports = mongoose;
