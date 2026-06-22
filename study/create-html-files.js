import { parseCSV, csvData } from './src/data/knowledgePoints.js';
import fs from 'fs';
import path from 'path';

const data = parseCSV(csvData);
const targetCategory = '数与代数';
const knowledgeDir = './public/knowledge';

const filteredData = data.filter(item => item['分类'] === targetCategory);

filteredData.forEach(item => {
    const name = item['知识点名称'];
    const fileName = `${encodeURIComponent(name)}.html`;
    const filePath = path.join(knowledgeDir, fileName);
    
    const content = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #fef9c3 0%, #dcfce7 50%, #e0f2fe 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }
        .icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 28px;
            color: #f59e0b;
            margin-bottom: 10px;
        }
        .subcategory {
            font-size: 16px;
            color: #94a3b8;
            margin-bottom: 20px;
        }
        .grade {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
        }
        .placeholder {
            margin-top: 30px;
            padding: 30px;
            background: #f8fafc;
            border-radius: 15px;
            border: 2px dashed #cbd5e1;
        }
        .placeholder p {
            color: #64748b;
            font-size: 16px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">📝</div>
        <h1>${name}</h1>
        <div class="subcategory">${item['子分类']}</div>
        <div class="grade">${item['对应年级']}</div>
        <div class="placeholder">
            <p>这里是"${name}"的学习内容区域。</p>
            <p>请在这里添加知识点讲解和互动游戏。</p>
        </div>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Created: ${fileName}`);
});

console.log(`\nTotal created: ${filteredData.length} files`);
