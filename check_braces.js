import fs from 'fs';

const content = fs.readFileSync('App.tsx', 'utf8');

let braceCount = 0;
let parenCount = 0;
let bracketCount = 0;

let inString = false;
let stringChar = '';
let inComment = false;
let blockComment = false;

const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    const prevChar = j > 0 ? line[j - 1] : '';
    const nextChar = j < line.length - 1 ? line[j + 1] : '';

    if (inComment) {
      if (char === '\n') inComment = false;
      continue;
    }
    if (blockComment) {
      if (char === '*' && nextChar === '/') {
        blockComment = false;
        j++;
      }
      continue;
    }
    if (inString) {
      if (char === stringChar && prevChar !== '\\') {
        inString = false;
      }
      continue;
    }

    if (char === '/' && nextChar === '/') {
      inComment = true;
      j++;
      continue;
    }
    if (char === '/' && nextChar === '*') {
      blockComment = true;
      j++;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringChar = char;
      continue;
    }

    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (char === '[') bracketCount++;
    if (char === ']') bracketCount--;
  }
}

console.log('Final counts:');
console.log('Braces {} count:', braceCount);
console.log('Parentheses () count:', parenCount);
console.log('Brackets [] count:', bracketCount);
