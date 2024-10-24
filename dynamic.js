// dynamicObfuscation.js

const readline = require('readline');

// Create an interface for reading input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to obfuscate and generate code dynamically
function generateDynamicFunction() {
  // Array of operations to choose from
  const operations = [
    { name: 'add', code: 'return a + b;' },
    { name: 'subtract', code: 'return a - b;' },
    { name: 'multiply', code: 'return a * b;' },
    { name: 'divide', code: 'return a / b;' },
  ];

  // Select a random operation
  const randomOperation = operations[Math.floor(Math.random() * operations.length)];

  // Create a new function using the Function constructor
  return new Function('a', 'b', randomOperation.code);
}

// Main function to execute the program
async function main() {
  rl.question('Enter an operation (add, subtract, multiply, divide): ', (operation) => {
    const dynamicFunction = generateDynamicFunction();

    rl.question('Enter the first number: ', (num1) => {
      rl.question('Enter the second number: ', (num2) => {
        // Execute the dynamically created function
        const result = dynamicFunction(Number(num1), Number(num2));
        console.log(`Result of the operation: ${result}`);
        rl.close();
      });
    });
  });
}

// Run the main function
main();
