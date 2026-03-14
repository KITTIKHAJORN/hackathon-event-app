const fs = require('fs');
const content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

function findDuplicates(objStr, sectionName) {
    const lines = objStr.split('\n');
    const keys = {};
    const duplicates = [];
    
    lines.forEach((line, index) => {
        const match = line.match(/^\s*([a-zA-Z0-9_]+):/);
        if (match) {
            const key = match[1];
            if (keys[key]) {
                duplicates.push({ key, line: index + 1, prevLine: keys[key] });
            }
            keys[key] = index + 1;
        }
    });
    
    if (duplicates.length > 0) {
        console.log(`Duplicates in ${sectionName}:`);
        duplicates.forEach(d => console.log(`  - ${d.key} at line ${d.line} (previously at ${d.prevLine})`));
    } else {
        console.log(`No duplicates in ${sectionName}`);
    }
}

// Extract objects
const enStart = content.indexOf('en: {');
const thStart = content.indexOf('th: {');
const end = content.lastIndexOf('};');

const enObj = content.substring(enStart, thStart);
const thObj = content.substring(thStart, end);

findDuplicates(enObj, 'English');
findDuplicates(thObj, 'Thai');
