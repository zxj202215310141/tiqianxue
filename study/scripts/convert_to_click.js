// Convert drag-drop games to click-based selection
const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..', 'public', 'knowledge');

// Files to convert
const files = [
  '10以内加减法.html', '20以内加减法.html', '100以内加减法.html',
  '万以内加减法.html', '除数是一位数的除法.html', '除数是两位数的除法.html',
  '三位数乘两位数.html', '小数加减法.html', '小数乘法.html', '小数除法.html',
  '分数加减法.html', '分数乘法.html', '分数除法.html',
  '百分数的运算.html', '有余数的除法.html',
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log('SKIP (not found):', file);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // === Pattern 1: Tiles/chips with dragstart/dragend → click ===
  // Replace dragstart/dragend on tiles with click handler
  // Match: tile.addEventListener('dragstart', ...) and tile.addEventListener('dragend', ...)
  html = html.replace(
    /(\w+)\.addEventListener\('dragstart',\s*e\s*=>\s*\{\s*e\.dataTransfer\.setData\(['"](\w+)['"],\s*(\w+)(?:\.toString\(\))?\);\s*\1\.style\.opacity\s*=\s*'0\.5'\s*\}\);?\s*\1\.addEventListener\('dragend',\s*\(\)\s*=>\s*\{\s*\1\.style\.opacity\s*=\s*'1'\s*\}\);?/g,
    (match, elVar, dataKey, valVar) => {
      return `${elVar}.addEventListener('click', () => { selectAnswer(${valVar}); });`;
    }
  );

  // === Pattern 2: Answer box dragover/drop → just click on tile ===
  // Remove the answerBox dragover/drop listener and replace with selectAnswer function
  html = html.replace(
    /(\w+)\.addEventListener\('dragover',\s*e\s*=>\s*e\.preventDefault\(\)\);\s*\1\.addEventListener\('drop',\s*e\s*=>\s*\{[\s\S]*?\}\);?/g,
    (match, boxVar) => {
      return `// Answer selected via click on tiles`;
    }
  );

  // Keep the shuffle function, add selectAnswer if not present
  if (!html.includes('function selectAnswer')) {
    // Find shuffle function location and insert before it
    html = html.replace(
      /function shuffle\(array\)/,
      `function selectAnswer(num) {
      const answerBox = document.getElementById('answer') || document.querySelector('.answer-box');
      if (!answerBox) return;
      answerBox.textContent = num;
      answerBox.classList.add('filled');
      if (num === currentAnswer) {
        messageEl.textContent = '✅ 正确！太棒了！';
        messageEl.style.color = 'var(--correct)';
        messageEl.style.display = 'block';
        setScore(score + 10);
        setTimeout(() => { nextQuestion ? nextQuestion() : generateQuestion(); }, 1000);
      } else {
        answerBox.style.borderColor = 'var(--wrong)';
        messageEl.textContent = '❌ 不对哦，再试试！';
        messageEl.style.color = 'var(--wrong)';
        messageEl.style.display = 'block';
        setTimeout(() => {
          answerBox.textContent = '';
          answerBox.classList.remove('filled');
          answerBox.style.borderColor = 'var(--accent)';
          messageEl.style.display = 'none';
        }, 1000);
      }
    }

    function shuffle(array)`
    );
  }

  // Remove draggable from tiles
  html = html.replace(/\.draggable\s*=\s*true;?\s*/g, '.style.cursor = "pointer"; ');

  // Remove unused dragover/drop on answerBoxEl
  html = html.replace(/answerBox\.addEventListener\('dragover'.*?\n\s*\n/g, '');

  // Fix any .toString() calls in dataTransfer (not needed for click)
  html = html.replace(/e\.dataTransfer\.setData\([^)]+\);\s*\w+\.style\.opacity[^;]*;?\s*/g, '');
  html = html.replace(/\w+\.addEventListener\('dragend'[^}]*\}\);?\s*/g, '');

  // Add nextQuestion helper if generateQuestion exists
  if (html.includes('generateQuestion') && !html.includes('function nextQuestion')) {
    html = html.replace(
      /function init\(\)/,
      `function nextQuestion() { generateQuestion(); }\n\n    function init()`
    );
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('CONVERTED:', file);
});

console.log('\nDone! Converted', files.length, 'files.');
