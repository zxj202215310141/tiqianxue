const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..', 'public', 'knowledge');

function safeTitle(name){
  try{ return decodeURIComponent(name.replace(/\.html$/,'')); }catch(e){ return name; }
}

function makeHTML(title){
  const themeColor = '#BEE7D6'; // 淡绿
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <style>
    :root{ --bg:${themeColor}; --card:#EAF7F0; --accent:#9FD6E0; --text:#145B4A }
    body{font-family: "Helvetica Neue", Arial, sans-serif; background: linear-gradient(180deg,#F6FFFB,var(--bg)); color:var(--text); margin:0; padding:24px}
    .container{max-width:820px;margin:0 auto}
    header{display:flex;align-items:center;justify-content:space-between}
    h1{font-size:1.6rem;margin:12px 0}
    .card{background:var(--card);border-radius:16px;padding:18px;box-shadow:0 6px 14px rgba(0,0,0,0.06);margin-bottom:16px}
    .btn{background:var(--accent);padding:8px 12px;border-radius:12px;color:#00323a;text-decoration:none;font-weight:700}
    .exercise{margin-top:12px}
    .choices button{margin:6px 6px 6px 0;padding:8px 12px;border-radius:10px;border:none;background:#fff}
    input[type="number"], input[type="text"]{padding:8px;border-radius:8px;border:1px solid #cfeee7}
    .result{margin-top:8px;font-weight:700}
    .emoji-row{font-size:28px}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div></div>
      <a class="btn" href="/index.html">返回主页</a>
    </header>

    <section class="card">
      <h1>${title}</h1>
      <p>这是关于《${title}》的简单讲解：<strong>用小学生能听懂的语言</strong>来说明核心概念。</p>
      <p>要点：本页用简单例子、图示和练习帮助你理解。遇到不懂的可以多做几遍练习。</p>
    </section>

    <section class="card">
      <h2>练习 1（选择题）</h2>
      <div class="exercise">
        <p id="q1">下面哪个是关于「${title}」的正确说法？</p>
        <div class="choices">
          <button data-correct="true">A：这是正确的简单描述</button>
          <button data-correct="false">B：这是一个不太对的描述</button>
          <button data-correct="false">C：这是错误的描述</button>
        </div>
        <div class="result" id="r1"></div>
      </div>
    </section>

    <section class="card">
      <h2>练习 2（填空）</h2>
      <div class="exercise">
        <p>请把正确的数字填进空格：</p>
        <p>1 + 2 = <input id="num2" type="number" style="width:80px"> <button id="check2">提交</button></p>
        <div class="result" id="r2"></div>
      </div>
    </section>

    <section class="card">
      <h2>练习 3（看图数数）</h2>
      <div class="exercise">
        <p>请数一数下面有几个苹果：</p>
        <div class="emoji-row" id="apples">🍎🍎🍎</div>
        <p>我数到： <input id="num3" type="number" style="width:80px"> <button id="check3">提交</button></p>
        <div class="result" id="r3"></div>
      </div>
    </section>

  </div>

  <script>
    document.querySelectorAll('.choices button').forEach(b=>b.addEventListener('click',e=>{
      const ok = e.currentTarget.dataset.correct === 'true';
      document.getElementById('r1').textContent = ok? '回答正确！太棒了！':'回答不对，再想想哦~';
      document.getElementById('r1').style.color = ok? 'green':'#d9534f';
    }));

    document.getElementById('check2').addEventListener('click',()=>{
      const val = Number(document.getElementById('num2').value);
      const ok = val === 3;
      document.getElementById('r2').textContent = ok? '正确：1+2=3' : '不对哦，想一想再试试';
      document.getElementById('r2').style.color = ok? 'green':'#d9534f';
    });

    // 练习3 随机生成苹果数量并校验
    (function(){
      const applesEl = document.getElementById('apples');
      const n = Math.floor(Math.random()*3)+2; // 2-4 个
      applesEl.textContent = '🍎'.repeat(n);
      window.__apples_n = n;
      document.getElementById('check3').addEventListener('click',()=>{
        const val = Number(document.getElementById('num3').value);
        const ok = val === window.__apples_n;
        document.getElementById('r3').textContent = ok? '回答正确！':'不对，再数一数~';
        document.getElementById('r3').style.color = ok? 'green':'#d9534f';
      });
    })();
  </script>
</body>
</html>`;
}

fs.readdir(dir, (err, files)=>{
  if(err) throw err;
  files.filter(f=>f.endsWith('.html')).forEach(f=>{
    const title = safeTitle(f);
    const content = makeHTML(title);
    fs.writeFileSync(path.join(dir,f), content, 'utf8');
    console.log('Wrote', f);
  });
});
