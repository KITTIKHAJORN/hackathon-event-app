const fs = require('fs');
const content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

function check(sectionName, startMarker, endMarker) {
    const start = content.indexOf(startMarker);
    const end = content.indexOf(endMarker, start);
    const sub = content.substring(start, end);
    const lines = sub.split('\n');
    const seen = {};
    lines.forEach((line, i) => {
        const m = line.match(/^\s*([a-zA-Z0-9_]+):/);
        if (m) {
            const key = m[1];
            if (seen[key]) {
                console.log(`Duplicate in ${sectionName}: "${key}" at segment line ${i+1}`);
            }
            seen[key] = true;
        }
    });
}

check('EN', 'en: {', '  },');
check('TH', 'th: {', '  },');
console.log('Done.');
