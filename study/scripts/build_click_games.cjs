// Generate click-based game pages for all arithmetic & fraction/decimal knowledge points
const fs = require('fs');
const path = require('path');
const dir = path.resolve(__dirname, '..', 'public', 'knowledge');

// ====== CLICK-BASED GAME TEMPLATES ======

// Template A: Simple arithmetic (click a number to answer)
function makeArithmeticPage(title, emoji, knowledgeHTML, gameType, theme) {
  const {bg, card, accent, accent2, text, correct, wrong} = theme;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <style>
    :root{--bg:${bg};--card:${card};--accent:${accent};--accent2:${accent2};--text:${text};--correct:${correct};--wrong:${wrong}}
    *{box-sizing:border-box}
    body{margin:0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;background:var(--bg);color:var(--text);padding:12px}
    .wrap{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .card{background:var(--card);border-radius:16px;padding:20px;box-shadow:0 8px 24px rgba(0,0,0,0.08)}
    h1{margin:0 0 12px 0;color:var(--accent2)}
    h2{margin:0 0 12px 0;color:var(--accent2)}
    .knowledge{min-height:260px}
    .game{min-height:400px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
    .equation{font-size:36px;font-weight:bold;color:var(--accent2);margin:20px 0;display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:center}
    .answer-box{width:100px;height:70px;border:3px dashed var(--accent);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;color:var(--accent2);background:var(--card);min-width:80px}
    .answer-box.correct{border-color:var(--correct);background:var(--correct);color:white}
    .answer-box.wrong{border-color:var(--wrong);background:var(--wrong);color:white}
    .number-tiles{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0;justify-content:center}
    .tile{width:65px;height:65px;background:linear-gradient(135deg,var(--accent),var(--accent2));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;color:white;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 8px rgba(0,0,0,0.15);border:none}
    .tile:hover{transform:translateY(-3px);box-shadow:0 8px 16px rgba(0,0,0,0.25)}
    .tile:active{transform:scale(0.95)}
    .tile.selected{outline:3px solid white;outline-offset:2px}
    .btn{background:linear-gradient(135deg,var(--accent2),var(--accent));color:white;padding:10px 20px;border-radius:12px;border:none;font-size:16px;cursor:pointer;transition:transform 0.2s;box-shadow:0 4px 8px rgba(0,0,0,0.15)}
    .btn:active{transform:scale(0.95)}
    .row{display:flex;gap:12px;margin-top:12px;align-items:center}
    .score{font-size:18px;font-weight:bold;color:var(--accent2)}
    .hint{font-size:14px;color:#636e72;margin-top:8px;text-align:center}
    @media(max-width:900px){.wrap{grid-template-columns:1fr}.equation{font-size:28px}.tile{width:55px;height:55px;font-size:24px}.answer-box{width:80px;height:60px;font-size:24px}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card knowledge">
      <h1>${emoji} ${title}</h1>
      ${knowledgeHTML}
    </div>
    <div class="card game">
      <h2>🎯 答题挑战</h2>
      <div class="hint">点击下方数字来选择答案</div>
      <div class="equation">
        <span id="num1">0</span>
        <span id="op">+</span>
        <span id="num2">0</span>
        <span>=</span>
        <div class="answer-box" id="answerBox">?</div>
      </div>
      <div class="number-tiles" id="tiles"></div>
      <div class="row">
        <button id="next" class="btn">➡️ 下一题</button>
        <div class="score">⭐ 得分：<span id="scoreVal">0</span></div>
      </div>
      <div id="msg" style="margin-top:12px;font-weight:bold;font-size:20px;display:none"></div>
    </div>
  </div>
  <script>
    const num1El=document.getElementById('num1'),num2El=document.getElementById('num2'),opEl=document.getElementById('op'),
      answerBox=document.getElementById('answerBox'),tilesEl=document.getElementById('tiles'),
      scoreEl=document.getElementById('scoreVal'),msgEl=document.getElementById('msg');
    let score=0,currentAnswer=null,locked=false;

    function setScore(v){score=v;scoreEl.textContent=score}
    const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
    ${gameType === 'addsub10' ? `
    function gen(){locked=false;const add=Math.random()>.5;let a,b;if(add){a=Math.floor(Math.random()*9)+1;b=Math.floor(Math.random()*(10-a))+1}else{a=Math.floor(Math.random()*9)+2;b=Math.floor(Math.random()*a)+1}num1El.textContent=a;num2El.textContent=b;opEl.textContent=add?'+':'-';currentAnswer=add?a+b:a-b;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];for(let i=0;i<=10;i++)if(i!==currentAnswer)pool.push(i);const tiles=shuffle(pool).slice(0,6);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'addsub20' ? `
    function gen(){locked=false;const add=Math.random()>.5;let a,b;if(add){a=Math.floor(Math.random()*19)+1;b=Math.floor(Math.random()*(20-a))+1}else{a=Math.floor(Math.random()*19)+2;b=Math.floor(Math.random()*a)+1}num1El.textContent=a;num2El.textContent=b;opEl.textContent=add?'+':'-';currentAnswer=add?a+b:a-b;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=Math.floor(Math.random()*21);if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'addsub100' ? `
    function gen(){locked=false;const add=Math.random()>.5;let a,b;if(add){a=Math.floor(Math.random()*90)+10;b=Math.floor(Math.random()*(100-a))+1}else{a=Math.floor(Math.random()*90)+10;b=Math.floor(Math.random()*a)+1}num1El.textContent=a;num2El.textContent=b;opEl.textContent=add?'+':'-';currentAnswer=add?a+b:a-b;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=Math.floor(Math.random()*200)+1;if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'addsub10000' ? `
    function gen(){locked=false;const add=Math.random()>.5;let a,b;if(add){a=Math.floor(Math.random()*8000)+1000;b=Math.floor(Math.random()*Math.min(9999-a,5000))+100}else{a=Math.floor(Math.random()*8000)+2000;b=Math.floor(Math.random()*(a-1000))+100}num1El.textContent=a;num2El.textContent=b;opEl.textContent=add?'+':'-';currentAnswer=add?a+b:a-b;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=Math.floor(Math.random()*20000);if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'multiply_single' ? `
    function gen(){locked=false;const a=Math.floor(Math.random()*9)+1;const b=Math.floor(Math.random()*90)+10;num1El.textContent=a;num2El.textContent=b;opEl.textContent='×';currentAnswer=a*b;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=Math.floor(Math.random()*1000);if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'multiply_double' ? `
    function gen(){locked=false;const a=Math.floor(Math.random()*90)+10;const b=Math.floor(Math.random()*90)+10;num1El.textContent=a;num2El.textContent=b;opEl.textContent='×';currentAnswer=a*b;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=Math.floor(Math.random()*10000);if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'division_single' ? `
    function gen(){locked=false;const b=Math.floor(Math.random()*8)+2;const q=Math.floor(Math.random()*90)+10;const a=b*q;num1El.textContent=a;num2El.textContent=b;opEl.textContent='÷';currentAnswer=q;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=Math.floor(Math.random()*200);if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'division_double' ? `
    function gen(){locked=false;const b=Math.floor(Math.random()*90)+10;const q=Math.floor(Math.random()*90)+10;const a=b*q;num1El.textContent=a;num2El.textContent=b;opEl.textContent='÷';currentAnswer=q;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=Math.floor(Math.random()*200);if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'division_remainder' ? `
    function gen(){locked=false;const b=Math.floor(Math.random()*8)+2;const q=Math.floor(Math.random()*9)+1;const r=Math.floor(Math.random()*(b-1))+1;const a=b*q+r;num1El.textContent=a;num2El.textContent=b;opEl.textContent='÷';currentAnswer=q+'余'+r;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const rq=Math.floor(Math.random()*10)+1;const rr=Math.floor(Math.random()*b);const d=rq+'余'+rr;if(!pool.includes(d))pool.push(d)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'multiply_table' ? `
    function gen(){locked=false;const a=Math.floor(Math.random()*9)+1;const b=Math.floor(Math.random()*9)+1;num1El.textContent=a;num2El.textContent=b;opEl.textContent='×';currentAnswer=a*b;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=Math.floor(Math.random()*81)+1;if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'division_table' ? `
    function gen(){locked=false;const b=Math.floor(Math.random()*8)+2;const q=Math.floor(Math.random()*9)+1;const a=b*q;num1El.textContent=a;num2El.textContent=b;opEl.textContent='÷';currentAnswer=q;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=Math.floor(Math.random()*81)+1;if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'mixed_ops' ? `
    function gen(){locked=false;const patterns=[()=>{const a=Math.floor(Math.random()*9)+1;const b=Math.floor(Math.random()*9)+1;const c=Math.floor(Math.random()*9)+1;const ans=a+b*c;return{str:a+'+'+b+'×'+c,ans}},()=>{const a=Math.floor(Math.random()*9)+1;const b=Math.floor(Math.random()*9)+1;const c=Math.floor(Math.random()*9)+1;const ans=a*b+c;return{str:a+'×'+b+'+'+c,ans}},()=>{const a=Math.floor(Math.random()*19)+10;const b=Math.floor(Math.random()*9)+1;const c=Math.floor(Math.random()*9)+1;const ans=a+b-c;return{str:a+'+'+b+'-'+c,ans}}];const p=patterns[Math.floor(Math.random()*patterns.length)]();document.getElementById('equation').innerHTML='<span style="font-size:28px">'+p.str.replace(/×/g,' × ').split('+').join(' + ').split('-').join(' - ')+'</span><span>=</span><div class="answer-box" id="answerBox2">?</div>';const ab=document.getElementById('answerBox2');currentAnswer=p.ans;msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=Math.floor(Math.random()*200);if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>{if(locked)return;ab.textContent=n;document.querySelectorAll('.tile').forEach(x=>x.classList.remove('selected'));t.classList.add('selected');if(String(n)===String(currentAnswer)){ab.className='answer-box correct';msgEl.textContent='✅ 正确！太棒了！';msgEl.style.color='var(--correct)';msgEl.style.display='block';locked=true;setScore(score+10);setTimeout(gen,1200)}else{ab.className='answer-box wrong';msgEl.textContent='❌ 不对哦，再试试！';msgEl.style.color='var(--wrong)';msgEl.style.display='block';setTimeout(()=>{ab.textContent='?';ab.className='answer-box';msgEl.style.display='none'},800)}};tilesEl.appendChild(t)})}
    ` : gameType === 'decimal_addsub' ? `
    function gen(){locked=false;const add=Math.random()>.5;const a=parseFloat((Math.random()*90+10).toFixed(1));let b;if(add){b=parseFloat((Math.random()*90+1).toFixed(1))}else{b=parseFloat((Math.random()*a).toFixed(1))}num1El.textContent=a;num2El.textContent=b;opEl.textContent=add?'+':'-';currentAnswer=parseFloat((add?a+b:a-b).toFixed(1));answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=parseFloat((Math.random()*200).toFixed(1));if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'decimal_multiply' ? `
    function gen(){locked=false;const a=parseFloat((Math.random()*9+1).toFixed(1));const b=parseFloat((Math.random()*9+1).toFixed(1));num1El.textContent=a;num2El.textContent=b;opEl.textContent='×';currentAnswer=parseFloat((a*b).toFixed(2));answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=parseFloat((Math.random()*100).toFixed(2));if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'decimal_divide' ? `
    function gen(){locked=false;const b=parseFloat((Math.random()*9+1).toFixed(1));const q=Math.floor(Math.random()*90)+10;const a=parseFloat((b*q).toFixed(1));num1El.textContent=a;num2El.textContent=b;opEl.textContent='÷';currentAnswer=q;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const r=Math.floor(Math.random()*200);if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'fraction_addsub' ? `
    function simplify(a,b){const g=(x,y)=>y===0?x:g(y,x%y);const d=g(Math.abs(a),Math.abs(b))||1;return[a/d,b/d]}
    function fracStr(n,d){if(n===0)return'0';if(n%d===0)return(n/d).toString();const[num,den]=simplify(n,d);if(Math.abs(num)>den){const w=Math.floor(Math.abs(num)/den);const r=Math.abs(num)%den;return(n<0?'-':'')+w+' '+r+'/'+den}return num+'/'+den}
    function gen(){locked=false;const den=Math.floor(Math.random()*5)+2;const n1=Math.floor(Math.random()*den)+1;const n2=Math.floor(Math.random()*den)+1;const add=Math.random()>.5;num1El.textContent=n1+'/'+den;num2El.textContent=n2+'/'+den;opEl.textContent=add?'+':'-';const rn=add?n1+n2:Math.max(0,n1-n2);currentAnswer=fracStr(rn,den);answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const rn2=Math.floor(Math.random()*den*2);const rd=den+Math.floor(Math.random()*3);const f=fracStr(rn2,rd);if(!pool.includes(f))pool.push(f)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.style.fontSize=n.length>3?'16px':'24px';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'fraction_multiply' ? `
    function simplify(a,b){const g=(x,y)=>y===0?x:g(y,x%y);const d=g(Math.abs(a),Math.abs(b))||1;return[a/d,b/d]}
    function fracStr(n,d){if(n===0)return'0';if(n%d===0)return(n/d).toString();const[num,den]=simplify(n,d);if(Math.abs(num)>den){const w=Math.floor(Math.abs(num)/den);const r=Math.abs(num)%den;return(n<0?'-':'')+w+' '+r+'/'+den}return num+'/'+den}
    function gen(){locked=false;const d1=Math.floor(Math.random()*5)+2,d2=Math.floor(Math.random()*5)+2;const n1=Math.floor(Math.random()*d1)+1,n2=Math.floor(Math.random()*d2)+1;num1El.textContent=n1+'/'+d1;num2El.textContent=n2+'/'+d2;opEl.textContent='×';currentAnswer=fracStr(n1*n2,d1*d2);answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const f=fracStr(Math.floor(Math.random()*20)+1,Math.floor(Math.random()*20)+2);if(!pool.includes(f))pool.push(f)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.style.fontSize=n.length>3?'16px':'24px';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'fraction_divide' ? `
    function simplify(a,b){const g=(x,y)=>y===0?x:g(y,x%y);const d=g(Math.abs(a),Math.abs(b))||1;return[a/d,b/d]}
    function fracStr(n,d){if(n===0)return'0';if(n%d===0)return(n/d).toString();const[num,den]=simplify(n,d);if(Math.abs(num)>den){const w=Math.floor(Math.abs(num)/den);const r=Math.abs(num)%den;return(n<0?'-':'')+w+' '+r+'/'+den}return num+'/'+den}
    function gen(){locked=false;const d1=Math.floor(Math.random()*5)+2,d2=Math.floor(Math.random()*5)+2;const n1=Math.floor(Math.random()*d1)+1,n2=Math.floor(Math.random()*d2)+1;num1El.textContent=n1+'/'+d1;num2El.textContent=n2+'/'+d2;opEl.textContent='÷';currentAnswer=fracStr(n1*d2,d1*n2);answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){const f=fracStr(Math.floor(Math.random()*20)+1,Math.floor(Math.random()*20)+2);if(!pool.includes(f))pool.push(f)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.style.fontSize=n.length>3?'16px':'24px';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : gameType === 'percent' ? `
    function gen(){locked=false;const types=['pn','pp','np'];const type=types[Math.floor(Math.random()*types.length)];let n1,n2,resStr;if(type==='pn'){n1=Math.floor(Math.random()*9)+1;n2=Math.floor(Math.random()*90)+10;let r=(n1/100)*n2;resStr=Number.isInteger(r)?r.toString():parseFloat(r.toFixed(2)).toString();num1El.textContent=n1+'%';num2El.textContent=n2}else if(type==='pp'){n1=Math.floor(Math.random()*40)+10;n2=Math.floor(Math.random()*40)+10;const add=Math.random()>.5;opEl.textContent=add?'+':'-';let r=add?n1+n2:Math.max(0,n1-n2);resStr=r+'%';num1El.textContent=n1+'%';num2El.textContent=n2+'%'}else{n1=Math.floor(Math.random()*90)+10;n2=Math.floor(Math.random()*9)+1;let r=(n2/100)*n1;resStr=Number.isInteger(r)?r.toString():parseFloat(r.toFixed(2)).toString();num1El.textContent=n1;num2El.textContent=n2+'%'}if(type!=='pp')opEl.textContent='×';currentAnswer=resStr;answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none';const pool=[currentAnswer];while(pool.length<6){let r;if(resStr.includes('%')){r=Math.floor(Math.random()*90)+10+'%'}else if(resStr.includes('.')){r=parseFloat((Math.random()*50+0.5).toFixed(2)).toString()}else{r=Math.floor(Math.random()*500)+10;r=r.toString()}if(!pool.includes(r))pool.push(r)}const tiles=shuffle(pool);tilesEl.innerHTML='';tiles.forEach(n=>{const t=document.createElement('button');t.className='tile';t.style.fontSize=n.length>3?'16px':'24px';t.textContent=n;t.onclick=()=>select(n,t);tilesEl.appendChild(t)})}
    ` : ''}
    function select(num,tile){
      if(locked)return;
      answerBox.textContent=num;
      document.querySelectorAll('.tile').forEach(t=>t.classList.remove('selected'));
      tile.classList.add('selected');
      if(String(num)===String(currentAnswer)){
        answerBox.className='answer-box correct';
        msgEl.textContent='✅ 正确！太棒了！';
        msgEl.style.color='var(--correct)';msgEl.style.display='block';
        locked=true;setScore(score+10);
        setTimeout(gen,1200);
      }else{
        answerBox.className='answer-box wrong';
        msgEl.textContent='❌ 不对哦，再试试！';
        msgEl.style.color='var(--wrong)';msgEl.style.display='block';
        setTimeout(()=>{answerBox.textContent='?';answerBox.className='answer-box';msgEl.style.display='none'},800);
      }
    }
    function init(){score=0;setScore(0);gen()}
    document.getElementById('next').onclick=gen;
    init();
  </script>
</body>
</html>`;
}

// Theme definitions
const themes = {
  addsub10:  {bg:'#f0f9ff',card:'#ffffff',accent:'#74b9ff',accent2:'#0984e3',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  addsub20:  {bg:'#e8f5e9',card:'#ffffff',accent:'#81c784',accent2:'#43a047',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  addsub100: {bg:'#e8f5e9',card:'#ffffff',accent:'#81c784',accent2:'#43a047',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  addsub10000:{bg:'#e8f5e9',card:'#ffffff',accent:'#81c784',accent2:'#43a047',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  multiply_single:{bg:'#fff3e0',card:'#ffffff',accent:'#ffcc80',accent2:'#ff9800',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  multiply_double:{bg:'#fff3e0',card:'#ffffff',accent:'#ffcc80',accent2:'#ff9800',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  division_single:{bg:'#fff3e0',card:'#ffffff',accent:'#ffcc80',accent2:'#ff9800',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  division_double:{bg:'#fff3e0',card:'#ffffff',accent:'#ffcc80',accent2:'#ff9800',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  division_remainder:{bg:'#fff3e0',card:'#ffffff',accent:'#ffcc80',accent2:'#ff9800',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  multiply_table:{bg:'#fff3e0',card:'#ffffff',accent:'#ffcc80',accent2:'#ff9800',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  division_table:{bg:'#fff3e0',card:'#ffffff',accent:'#ffcc80',accent2:'#ff9800',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  mixed_ops:{bg:'#e8f5e9',card:'#ffffff',accent:'#81c784',accent2:'#43a047',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  decimal_addsub:{bg:'#e8f5e9',card:'#ffffff',accent:'#81c784',accent2:'#43a047',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  decimal_multiply:{bg:'#f3e5f5',card:'#ffffff',accent:'#ce93d8',accent2:'#7b1fa2',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  decimal_divide:{bg:'#f3e5f5',card:'#ffffff',accent:'#ce93d8',accent2:'#7b1fa2',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  fraction_addsub:{bg:'#fffef5',card:'#ffffff',accent:'#ffeaa7',accent2:'#fdcb6e',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  fraction_multiply:{bg:'#fffef5',card:'#ffffff',accent:'#ffeaa7',accent2:'#fdcb6e',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  fraction_divide:{bg:'#fffef5',card:'#ffffff',accent:'#ffeaa7',accent2:'#fdcb6e',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  percent:{bg:'#f3e5f5',card:'#ffffff',accent:'#ce93d8',accent2:'#7b1fa2',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
  decimal_recog:{bg:'#f3e5f5',card:'#ffffff',accent:'#ce93d8',accent2:'#7b1fa2',text:'#2d3436',correct:'#00b894',wrong:'#e17055'},
};

// Knowledge content for each page
const knowledge = {
  '10以内加减法': {emoji:'🧮', html:'<p>10以内加减法是最基础的数学运算。加法是把两个数合起来，减法是从一个数里去掉一部分。</p><p style="margin-top:8px">💡 小技巧：计算加法时可以用数手指的方法，计算减法时可以想"几加几等于被减数"。</p><div style="margin-top:16px;padding:12px;background:#dfe6e9;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '20以内加减法': {emoji:'🧮', html:'<p>20以内加减法在10以内基础上，增加了进位和退位的概念。</p><p style="margin-top:8px">💡 进位加法：个位满10向十位进1。退位减法：个位不够减，从十位借1。</p><div style="margin-top:16px;padding:12px;background:#dfe6e9;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '100以内加减法': {emoji:'🧮', html:'<p>100以内的加减法需要注意进位和退位。</p><p style="margin-top:8px">💡 加法进位：个位满10向十位进1。减法退位：个位不够减，从十位借1当10。</p><div style="margin-top:16px;padding:12px;background:#dfe6e9;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '万以内加减法': {emoji:'🧮', html:'<p>万以内加减法需要掌握更大的数字计算。</p><p style="margin-top:8px">💡 对齐数位，从个位开始计算，注意进位和退位。</p><div style="margin-top:16px;padding:12px;background:#dfe6e9;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '除数是一位数的除法': {emoji:'➗', html:'<p>除数是一位数的除法是除法的基础。</p><p style="margin-top:8px">💡 从被除数的高位除起，每次用除数试除被除数的前一位或前两位。</p><div style="margin-top:16px;padding:12px;background:#ffcc80;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '除数是两位数的除法': {emoji:'➗', html:'<p>除数是两位数的除法需要用到试商的方法。</p><p style="margin-top:8px">💡 先把除数看作整十数来试商，然后调整。</p><div style="margin-top:16px;padding:12px;background:#ffcc80;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '三位数乘两位数': {emoji:'✖️', html:'<p>三位数乘两位数是多位数乘法的重要应用。</p><p style="margin-top:8px">💡 先用两位数的个位去乘，再用十位去乘，最后把两次的积相加。</p><div style="margin-top:16px;padding:12px;background:#ffcc80;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '小数加减法': {emoji:'🔢', html:'<p>小数加减法要注意小数点对齐。</p><p style="margin-top:8px">💡 小数点对齐后，按照整数加减法的方法计算，最后在结果中点上小数点。</p><div style="margin-top:16px;padding:12px;background:#dfe6e9;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '小数乘法': {emoji:'🔢', html:'<p>小数乘法先按整数乘法计算，再看因数中一共有几位小数，就从积的右边起数出几位点上小数点。</p><p style="margin-top:8px">💡 例如：2.5 × 0.4 = 1.00</p><div style="margin-top:16px;padding:12px;background:#ce93d8;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '小数除法': {emoji:'🔢', html:'<p>小数除法先把除数变成整数，被除数也扩大相同的倍数。</p><p style="margin-top:8px">💡 例如：4.8 ÷ 0.4 = 48 ÷ 4 = 12</p><div style="margin-top:16px;padding:12px;background:#ce93d8;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '分数加减法': {emoji:'🍕', html:'<p>同分母分数相加减，分母不变，分子相加减。</p><p style="margin-top:8px">💡 异分母分数要先通分，化成同分母分数再计算。</p><div style="margin-top:16px;padding:12px;background:#ffeaa7;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '分数乘法': {emoji:'🍕', html:'<p>分数乘法：分子相乘做分子，分母相乘做分母。</p><p style="margin-top:8px">💡 例如：2/3 × 3/4 = 6/12 = 1/2</p><div style="margin-top:16px;padding:12px;background:#ffeaa7;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '分数除法': {emoji:'🍕', html:'<p>分数除法：除以一个分数等于乘以这个分数的倒数。</p><p style="margin-top:8px">💡 例如：2/3 ÷ 3/4 = 2/3 × 4/3 = 8/9</p><div style="margin-top:16px;padding:12px;background:#ffeaa7;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '百分数的运算': {emoji:'💯', html:'<p>百分数表示一个数是另一个数的百分之几。</p><p style="margin-top:8px">💡 百分数可以转化为小数或分数进行计算。例如：20% × 50 = 10</p><div style="margin-top:16px;padding:12px;background:#ce93d8;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '有余数的除法': {emoji:'➗', html:'<p>在整数除法中，当被除数不能被除数整除时，就产生余数。</p><p style="margin-top:8px">💡 余数要比除数小。例如：17 ÷ 5 = 3 余 2</p><div style="margin-top:16px;padding:12px;background:#ffcc80;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '小数的认识': {emoji:'🔢', html:'<p>像0.5、1.23、3.14这样的数叫做小数。小数点左边是整数部分，右边是小数部分。</p><p style="margin-top:8px">💡 1/10 = 0.1，1/100 = 0.01，1/1000 = 0.001</p><div style="margin-top:16px;padding:12px;background:#ce93d8;border-radius:10px"><strong>🎮 游戏说明：</strong><br>读出小数并选择正确的读法！</div>'},
  '分数的认识': {emoji:'🍕', html:'<p>分数用来表示"几分之几"。例如1/2表示把一个东西平均分成2份，取其中的1份。上面的数字叫分子，下面的数字叫分母。</p><p style="margin-top:8px">📖 读法：先读分母，再读分子。如3/4读作"四分之三"。</p><div style="margin-top:16px;padding:12px;background:#ffeaa7;border-radius:10px"><strong>🎮 游戏说明：</strong><br>观察披萨图，选择正确的分数！</div>'},
  '表内乘法': {emoji:'✖️', html:'<p>表内乘法是乘法口诀表内的乘法（九九乘法表）。</p><p style="margin-top:8px">💡 乘法是加法的简便运算。例如：3×4 表示 3个4相加，即 4+4+4=12。</p><div style="margin-top:16px;padding:12px;background:#ffcc80;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '表内除法': {emoji:'➗', html:'<p>表内除法是乘法口诀表内的除法。</p><p style="margin-top:8px">💡 除法是乘法的逆运算。例如：12÷3=4，因为 3×4=12。</p><div style="margin-top:16px;padding:12px;background:#ffcc80;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '四则混合运算': {emoji:'🧮', html:'<p>四则混合运算包含加、减、乘、除四种运算。</p><p style="margin-top:8px">💡 运算顺序：先乘除，后加减；有括号的先算括号里面的。</p><div style="margin-top:16px;padding:12px;background:#dfe6e9;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，注意运算顺序！</div>'},
  '多位数乘一位数': {emoji:'✖️', html:'<p>多位数乘一位数是乘法的重要应用。</p><p style="margin-top:8px">💡 用一位数分别去乘多位数的每一位，注意进位。</p><div style="margin-top:16px;padding:12px;background:#ffcc80;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
  '两位数乘两位数': {emoji:'✖️', html:'<p>两位数乘两位数是乘法运算的进阶。</p><p style="margin-top:8px">💡 先用第二个因数的个位去乘，再用十位去乘，最后把两次的积相加。</p><div style="margin-top:16px;padding:12px;background:#ffcc80;border-radius:10px"><strong>🎮 游戏说明：</strong><br>点击下方数字来选择正确答案，答对得分！</div>'},
};

// Special pages: 小数的认识 (decimal recognition quiz) and 分数的认识 (fraction quiz)
function makeDecimalPage() {
  const k = knowledge['小数的认识'];
  const t = themes.decimal_recog;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>小数的认识</title>
  <style>
    :root{--bg:${t.bg};--card:${t.card};--accent:${t.accent};--accent2:${t.accent2};--text:${t.text};--correct:${t.correct};--wrong:${t.wrong}}
    *{box-sizing:border-box}
    body{margin:0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;background:var(--bg);color:var(--text);padding:12px}
    .wrap{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .card{background:var(--card);border-radius:16px;padding:20px;box-shadow:0 8px 24px rgba(0,0,0,0.08)}
    h1{margin:0 0 12px 0;color:var(--accent2)}h2{margin:0 0 12px 0;color:var(--accent2)}
    .knowledge{min-height:260px}
    .game{min-height:400px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
    .big-number{font-size:64px;font-weight:bold;color:var(--accent2);margin:20px 0}
    .question{font-size:22px;font-weight:bold;color:var(--accent2);margin:16px 0;text-align:center}
    .options{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin:16px 0}
    .opt-btn{background:linear-gradient(135deg,var(--accent),var(--accent2));color:white;padding:12px 20px;border-radius:12px;border:none;font-size:18px;cursor:pointer;transition:transform 0.2s;box-shadow:0 4px 8px rgba(0,0,0,0.15)}
    .opt-btn:hover{transform:translateY(-2px)}
    .opt-btn:active{transform:scale(0.95)}
    .opt-btn.correct{background:var(--correct)}
    .opt-btn.wrong{background:var(--wrong)}
    .btn{background:linear-gradient(135deg,var(--accent2),var(--accent));color:white;padding:10px 20px;border-radius:12px;border:none;font-size:16px;cursor:pointer}
    .btn:active{transform:scale(0.95)}
    .row{display:flex;gap:12px;margin-top:12px;align-items:center}
    .score{font-size:18px;font-weight:bold;color:var(--accent2)}
    .hint{font-size:14px;color:#636e72;margin-top:8px;text-align:center}
    @media(max-width:900px){.wrap{grid-template-columns:1fr}.big-number{font-size:48px}.opt-btn{font-size:16px;padding:10px 16px}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card knowledge"><h1>${k.emoji} 小数的认识</h1>${k.html}</div>
    <div class="card game">
      <h2>📖 读小数</h2>
      <div class="hint">选择正确的小数读法</div>
      <div class="big-number" id="bigNum">3.14</div>
      <div class="question" id="q">这个小数怎么读？</div>
      <div class="options" id="options"></div>
      <div class="row">
        <button id="next" class="btn">➡️ 下一题</button>
        <div class="score">⭐ 得分：<span id="scoreVal">0</span></div>
      </div>
      <div id="msg" style="margin-top:12px;font-weight:bold;font-size:20px;display:none"></div>
    </div>
  </div>
  <script>
    const bigNum=document.getElementById('bigNum'),qEl=document.getElementById('q'),
      opts=document.getElementById('options'),scoreEl=document.getElementById('scoreVal'),
      msgEl=document.getElementById('msg');
    let score=0,locked=false;
    const questions=[
      {num:'3.14',q:'这个小数怎么读？',options:['三点一四','三点十四','三一四','三十一点四'],answer:'三点一四'},
      {num:'0.5',q:'这个小数怎么读？',options:['零点五','零五','零点零五','五点零'],answer:'零点五'},
      {num:'1.23',q:'这个小数怎么读？',options:['一点二三','一点二十三','一二点三','十二点三'],answer:'一点二三'},
      {num:'10.05',q:'这个小数怎么读？',options:['十点零五','十点五','一零点零五','十点五零'],answer:'十点零五'},
      {num:'0.08',q:'这个小数怎么读？',options:['零点零八','零点八','零点零零八','八零点'],answer:'零点零八'},
      {num:'2.5',q:'1/2用小数表示是？',options:['2.5','0.5','1.2','5.2'],answer:'0.5'},
      {num:'0.25',q:'1/4用小数表示是？',options:['0.25','2.5','0.4','4.1'],answer:'0.25'},
      {num:'0.75',q:'3/4用小数表示是？',options:['0.75','7.5','0.34','3.4'],answer:'0.75'},
      {num:'0.1',q:'1/10用小数表示是？',options:['0.1','1.0','0.01','10.0'],answer:'0.1'},
      {num:'0.01',q:'1/100用小数表示是？',options:['0.01','0.1','1.0','100'],answer:'0.01'},
    ];
    function gen(){
      locked=false;const q=questions[Math.floor(Math.random()*questions.length)];
      bigNum.textContent=q.num;qEl.textContent=q.q;msgEl.style.display='none';
      opts.innerHTML='';q.options.forEach(o=>{
        const b=document.createElement('button');b.className='opt-btn';b.textContent=o;
        b.onclick=()=>{if(locked)return;locked=true;
          document.querySelectorAll('.opt-btn').forEach(x=>x.disabled=true);
          if(o===q.answer){b.classList.add('correct');msgEl.textContent='✅ 正确！';msgEl.style.color='var(--correct)';msgEl.style.display='block';setScore(score+10)}
          else{b.classList.add('wrong');msgEl.textContent='❌ 正确答案是：'+q.answer;msgEl.style.color='var(--wrong)';msgEl.style.display='block'}
          setTimeout(gen,1500);};opts.appendChild(b);
      });
    }
    function setScore(v){score=v;scoreEl.textContent=score}
    function init(){score=0;setScore(0);gen()}
    document.getElementById('next').onclick=gen;
    init();
  </script>
</body>
</html>`;
}

function makeFractionPage() {
  const k = knowledge['分数的认识'];
  const t = themes.fraction_addsub;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>分数的认识</title>
  <style>
    :root{--bg:${t.bg};--card:${t.card};--accent:${t.accent};--accent2:${t.accent2};--text:${t.text};--correct:${t.correct};--wrong:${t.wrong}}
    *{box-sizing:border-box}
    body{margin:0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;background:var(--bg);color:var(--text);padding:12px}
    .wrap{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .card{background:var(--card);border-radius:16px;padding:20px;box-shadow:0 8px 24px rgba(0,0,0,0.08)}
    h1{margin:0 0 12px 0;color:var(--accent2)}h2{margin:0 0 12px 0;color:var(--accent2)}
    .knowledge{min-height:260px}
    .game{min-height:400px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
    .pizza{width:160px;height:160px;border-radius:50%;margin:16px auto;border:3px solid var(--accent2)}
    .question{font-size:22px;font-weight:bold;color:var(--accent2);margin:12px 0;text-align:center}
    .options{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin:12px 0}
    .opt-btn{background:linear-gradient(135deg,var(--accent),var(--accent2));color:white;padding:12px 24px;border-radius:12px;border:none;font-size:20px;cursor:pointer;transition:transform 0.2s;box-shadow:0 4px 8px rgba(0,0,0,0.15)}
    .opt-btn:hover{transform:translateY(-2px)}
    .opt-btn:active{transform:scale(0.95)}
    .opt-btn.correct{background:var(--correct)}
    .opt-btn.wrong{background:var(--wrong)}
    .btn{background:linear-gradient(135deg,var(--accent2),var(--accent));color:white;padding:10px 20px;border-radius:12px;border:none;font-size:16px;cursor:pointer}
    .btn:active{transform:scale(0.95)}
    .row{display:flex;gap:12px;margin-top:12px;align-items:center}
    .score{font-size:18px;font-weight:bold;color:var(--accent2)}
    .hint{font-size:14px;color:#636e72;margin-top:8px;text-align:center}
    @media(max-width:900px){.wrap{grid-template-columns:1fr}.pizza{width:140px;height:140px}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card knowledge"><h1>${k.emoji} 分数的认识</h1>${k.html}</div>
    <div class="card game">
      <h2>🍕 识分数</h2>
      <div class="hint">观察披萨，选择正确的分数</div>
      <div class="pizza" id="pizza"></div>
      <div class="question" id="q">被吃掉的部分用哪个分数表示？</div>
      <div class="options" id="options"></div>
      <div class="row">
        <button id="next" class="btn">➡️ 下一题</button>
        <div class="score">⭐ 得分：<span id="scoreVal">0</span></div>
      </div>
      <div id="msg" style="margin-top:12px;font-weight:bold;font-size:20px;display:none"></div>
    </div>
  </div>
  <script>
    const pizza=document.getElementById('pizza'),qEl=document.getElementById('q'),
      opts=document.getElementById('options'),scoreEl=document.getElementById('scoreVal'),
      msgEl=document.getElementById('msg');
    let score=0,currentAnswer='',locked=false;
    function setScore(v){score=v;scoreEl.textContent=score}
    function gen(){
      locked=false;
      const den=Math.floor(Math.random()*4)+2;
      const num=Math.floor(Math.random()*den)+1;
      currentAnswer=num+'/'+den;
      // Draw pizza with conic-gradient
      const eatenDeg=(num/den)*360;
      pizza.style.background=\`conic-gradient(#e17055 0deg \${eatenDeg}deg, #ffeaa7 \${eatenDeg}deg 360deg)\`;
      qEl.textContent='被吃掉的部分用哪个分数表示？';
      msgEl.style.display='none';
      // Generate options
      const correct=num+'/'+den;
      const pool=[correct];
      while(pool.length<4){
        const rn=Math.floor(Math.random()*den)+1;
        const rd=den+Math.floor(Math.random()*3);
        const f=rn+'/'+rd;
        if(!pool.includes(f))pool.push(f);
      }
      const arr=pool.sort(()=>Math.random()-.5);
      opts.innerHTML='';arr.forEach(f=>{
        const b=document.createElement('button');b.className='opt-btn';b.textContent=f;
        b.onclick=()=>{if(locked)return;locked=true;
          document.querySelectorAll('.opt-btn').forEach(x=>x.disabled=true);
          if(f===correct){b.classList.add('correct');msgEl.textContent='✅ 答对了！';msgEl.style.color='var(--correct)';msgEl.style.display='block';setScore(score+10)}
          else{b.classList.add('wrong');msgEl.textContent='❌ 正确答案是：'+correct;msgEl.style.color='var(--wrong)';msgEl.style.display='block'}
          setTimeout(gen,1500);};opts.appendChild(b);
      });
    }
    function init(){score=0;setScore(0);gen()}
    document.getElementById('next').onclick=gen;
    init();
  </script>
</body>
</html>`;
}

// ===== GENERATE ALL FILES =====
const configs = [
  ['10以内加减法', 'addsub10'],
  ['20以内加减法', 'addsub20'],
  ['100以内加减法', 'addsub100'],
  ['万以内加减法', 'addsub10000'],
  ['除数是一位数的除法', 'division_single'],
  ['除数是两位数的除法', 'division_double'],
  ['三位数乘两位数', 'multiply_double'],
  ['小数加减法', 'decimal_addsub'],
  ['小数乘法', 'decimal_multiply'],
  ['小数除法', 'decimal_divide'],
  ['分数加减法', 'fraction_addsub'],
  ['分数乘法', 'fraction_multiply'],
  ['分数除法', 'fraction_divide'],
  ['百分数的运算', 'percent'],
  ['有余数的除法', 'division_remainder'],
  ['表内乘法', 'multiply_table'],
  ['表内除法', 'division_table'],
  ['四则混合运算', 'mixed_ops'],
  ['多位数乘一位数', 'multiply_single'],
  ['两位数乘两位数', 'multiply_double'],
];

configs.forEach(([title, gameType]) => {
  const k = knowledge[title];
  if (!k) { console.log('SKIP (no knowledge):', title); return; }
  const t = themes[gameType];
  if (!t) { console.log('SKIP (no theme):', gameType); return; }
  const html = makeArithmeticPage(title, k.emoji, k.html, gameType, t);
  const filePath = path.join(dir, title + '.html');
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('GENERATED:', title + '.html');
});

// Special pages
fs.writeFileSync(path.join(dir, '小数的认识.html'), makeDecimalPage(), 'utf8');
console.log('GENERATED: 小数的认识.html');
fs.writeFileSync(path.join(dir, '分数的认识.html'), makeFractionPage(), 'utf8');
console.log('GENERATED: 分数的认识.html');

console.log('\nAll done! Generated', configs.length + 2, 'files.');
