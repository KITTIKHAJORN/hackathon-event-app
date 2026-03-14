const fs = require('fs');
const content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

function findDuplicates(sectionName, startStr, endStr) {
    const startIndex = content.indexOf(startStr);
    const endIndex = content.indexOf(endStr, startIndex);
    const section = content.substring(startIndex, endIndex);
    
    const lines = section.split('\n');
    const keys = [];
    const duplicates = [];
    
    lines.forEach((line, index) => {
        const match = line.match(/^\s*([a-zA-Z0-9_]+):/);
        if (match) {
            const key = match[1];
            if (keys.includes(key)) {
                duplicates.push({ key, line: index + 1, content: line.trim() });
            } else {
                keys.push(key);
            }
        }
    });
    
    console.log(`--- Duplicates in ${sectionName} ---`);
    if (duplicates.length === 0) {
        console.log('No duplicates found.');
    } else {
        duplicates.forEach(d => console.log(`Key: "${d.key}" at line segment line ${d.line}: ${d.content}`));
    }
}

findDuplicates('EN', 'en: {', '  },');
findDuplicates('TH', 'th: {', '  },');
