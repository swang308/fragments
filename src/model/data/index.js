// This file will allow us to switch between different backend strategies (memory, AWS, etc.)
let dataStrategy;

// We can use an environment variable or other logic to determine which strategy to use.
// For now, we're using the 'memory' strategy by default.
if (process.env.DATA_BACKEND === 'aws') {
  // In the future, we can require the AWS backend here.
  // dataStrategy = require('./aws'); // Placeholder for future AWS strategy
  throw new Error('AWS backend is not implemented yet.');
} else {
  // Default to in-memory strategy
  dataStrategy = require('./memory');
}

// Re-export the selected data strategy
module.exports = dataStrategy;
