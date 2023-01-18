process.stdin.setEncoding('utf-8');
process.stdout.write('Start listening\n');
process.stdin.pipe(process.stdout);
