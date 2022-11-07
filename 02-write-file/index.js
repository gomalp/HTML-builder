const fs = require('fs');
const path = require('path');
const process = require('process');
const writeStream = fs.createWriteStream(path.join(__dirname,"text.txt"),'utf8');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: writeStream
});

console.log('Введите текст:');
rl.on('line', (line) => {
    console.log('Введите текст:');
    if(line=='exit') exit();
    writeStream.write(line);
});
  
process.on('SIGINT', () => {
    exit();
});

function exit(){
    console.log('До свидания!');
    rl.close();
    process.stdin.unref();
    process.exit(0);
}