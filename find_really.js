const fs = require('fs');
const content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

function extract(section) {
    const start = content.indexOf(section + ': {');
    let braceCount = 1;
    let i = content.indexOf('{', start) + 1;
    while (braceCount > 0 && i < content.length) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') braceCount--;
        i++;
    }
    return content.substring(start, i);
}

const en = extract('en');
const th = extract('th');

function find(text, label) {
    const lines = text.split('\n');
    const seen = {};
    lines.forEach((l, idx) => {
        const m = l.match(/^\s*([a-zA-Z0-9_]+):/);
        if (m) {
            const k = m[1];
            if (seen[k]) console.log(`${label} Duplicate: ${k} at line ${idx+1}`);
            seen[k] = true;
        }
    });
}

find(en, 'EN');
find(th, 'TH');
console.log('Finished');
