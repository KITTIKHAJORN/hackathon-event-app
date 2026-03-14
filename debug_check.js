const fs = require('fs');
const content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

const enStart = content.indexOf('en: {');
const thStart = content.indexOf('th: {');
const end = content.lastIndexOf('};');

console.log('EN start:', enStart);
console.log('TH start:', thStart);
console.log('End:', end);

const enSection = content.substring(enStart, thStart);
const thSection = content.substring(thStart, end);

function getKeys(section) {
    const keys = [];
    const lines = section.split('\n');
    lines.forEach((line, i) => {
        const match = line.match(/^\s*([a-zA-Z0-9_]+):/);
        if (match) {
            keys.push({ name: match[1], line: i + 1 });
        }
    });
    return keys;
}

const enKeys = getKeys(enSection);
const thKeys = getKeys(thSection);

console.log('EN keys count:', enKeys.length);
console.log('TH keys count:', thKeys.length);

function check(keys, name) {
    const counts = {};
    keys.forEach(k => {
        counts[k.name] = (counts[k.name] || 0) + 1;
        if (counts[k.name] > 1) {
            console.log(`Duplicate in ${name}: ${k.name} at relative line ${k.line}`);
        }
    });
}

check(enKeys, 'English');
check(thKeys, 'Thai');
console.log('Finished');
