process.stdin.setEncoding('utf-8');
process.stdout.write('Enter your name:\n');
process.stdin.on('data', name => {
    process.stdout.write(`Your name is ${name}\n`);
    process.exit();
  },
);
