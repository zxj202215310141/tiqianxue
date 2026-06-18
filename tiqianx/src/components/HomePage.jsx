import { motion } from 'framer-motion';
import { BookOpen, Calculator, Shapes, PieChart, Puzzle, ArrowRight, CheckCircle } from 'lucide-react';
import { getTotalProgress, getCategoryProgress } from '../utils/storage';
import { knowledgeData, categories } from '../data/knowledgePoints';

export default function HomePage({ onEnterDetail }) {
  const totalProgress = getTotalProgress(knowledgeData);
  const progressPercent = totalProgress.total > 0 
    ? (totalProgress.completed / totalProgress.total) * 100 
    : 0;

  const categoryInfo = categories.map(category => ({
    name: category,
    ...getCategoryProgress(knowledgeData, category),
    icon: getIcon(category),
    color: getColor(category)
  }));

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-primary-50 via-sky-50 to-white p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-sky-400 rounded-2xl shadow-lg mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            小学生数学知识点提前学
          </h1>
          <p className="text-gray-500">快乐学习，轻松掌握</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-6">
            📚 全书学习进度
          </h2>
          
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-4xl font-bold text-gray-800">
                  {totalProgress.completed}
                </span>
                <span className="text-sm text-gray-500">/ {totalProgress.total} 个知识点</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {totalProgress.completed === totalProgress.total ? (
                <CheckCircle className="w-5 h-5 text-primary-500" />
              ) : (
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              )}
              <span className="text-gray-600">
                {totalProgress.completed === totalProgress.total 
                  ? '🎉 太棒了！已完成全部学习！' 
                  : `继续加油！已完成 ${Math.round(progressPercent)}%`}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnterDetail}
          className="w-full bg-gradient-to-r from-primary-500 to-sky-500 text-white py-4 px-6 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mb-8"
        >
          <span>进入提前学目录</span>
          <ArrowRight className="w-6 h-6" />
        </motion.button>

        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Puzzle className="w-6 h-6 text-primary-500" />
          四大核心模块
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryInfo.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={onEnterDetail}
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${cat.color}15` }}
                >
                  <cat.icon className="w-6 h-6" style={{ color: cat.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{cat.name}</h3>
                  <p className="text-sm text-gray-500">
                    {cat.completed} / {cat.total} 已学
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.total > 0 ? (cat.completed / cat.total) * 100 : 0}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                />
              </div>
              
              <p className="text-xs text-gray-400 mt-2 text-right">
                {cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0}% 完成
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-gray-400 text-sm"
        >
          <p>📖 坚持每天学习，数学成绩步步高！</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function getIcon(category) {
  const icons = {
    '数与代数': Calculator,
    '图形与几何': Shapes,
    '统计与概率': PieChart,
    '综合与实践': Puzzle
  };
  return icons[category] || Calculator;
}

function getColor(category) {
  const colors = {
    '数与代数': '#22c55e',
    '图形与几何': '#0ea5e9',
    '统计与概率': '#f59e0b',
    '综合与实践': '#8b5cf6'
  };
  return colors[category] || '#22c55e';
}
