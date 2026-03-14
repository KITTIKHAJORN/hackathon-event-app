const fs = require('fs');
try {
    const content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');
    console.log(`Content length: ${content.length}`);

    function findDuplicates(sectionName, startStr, endStr) {
        const startIndex = content.indexOf(startStr);
        console.log(`Searching for "${sectionName}" starting with "${startStr}" (index: ${startIndex})`);
        if (startIndex === -1) return;
        
        const endIndex = content.indexOf(endStr, startIndex);
        console.log(`Found end of "${sectionName}" at ${endIndex}`);
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
} catch (e) {
    console.error(e);
}
