const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function checkMongoDB() {
  try {
    // Check if MongoDB is running
    const { stdout, stderr } = await execPromise('net start | findstr /i "MongoDB"');
    
    if (stdout.includes('MongoDB')) {
      console.log('✓ MongoDB is running');
      return true;
    } else {
      console.log('MongoDB is not running. Attempting to start it...');
      try {
        await execPromise('net start MongoDB');
        console.log('✓ MongoDB started successfully');
        return true;
      } catch (startError) {
        console.error('Failed to start MongoDB:', startError);
        console.log('\nPlease make sure MongoDB is installed and the MongoDB service is properly configured.');
        console.log('You can download MongoDB from: https://www.mongodb.com/try/download/community');
        return false;
      }
    }
  } catch (error) {
    console.error('Error checking MongoDB status:', error);
    console.log('\nMongoDB might not be installed or the service name is different.');
    console.log('Please install MongoDB from: https://www.mongodb.com/try/download/community');
    return false;
  }
}

checkMongoDB().then(success => {
  if (!success) {
    process.exit(1);
  }
});
