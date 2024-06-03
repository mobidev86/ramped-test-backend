const { MongoClient } = require('mongodb');
const fs = require('fs');

async function checkMongo() {
    const uri = 'mongodb://localhost:27017'; // Change this to your MongoDB URI if different
    const client = new MongoClient(uri, {});
    try {
        await client.connect();
    } catch (err) {
        console.error('MongoDB is not installed or not running.', err);
        process.exit(1); // Exit with a failure code
    } finally {
        await client.close();
    }
}

function checkEnvFile() {
    if (!fs.existsSync('.env')) {
        console.error('.env file does not exist.');
        process.exit(1); // Exit with a failure code
    }
}

async function runChecks() {
    checkEnvFile();
    await checkMongo();
}

runChecks();
