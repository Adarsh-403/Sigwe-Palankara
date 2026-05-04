const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('frontend/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Regex to match any class starting with dark:
  const newContent = content.replace(/dark:[^\s"'\`]+/g, '').replace(/ +/g, ' ');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Cleaned:', file);
  }
});
