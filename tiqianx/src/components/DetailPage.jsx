import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, ChevronDown, ChevronRight, Check, BookOpen, Download } from 'lucide-react';
import { getKnowledgeTree, categories } from '../data/knowledgePoints';
import { toggleKnowledgePoint, isCompleted } from '../utils/storage';

export default function DetailPage({ onBack, data, onProgressChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set(categories));
  const [expandedSubCategories, setExpandedSubCategories] = useState(new Set());
  const [selectedKnowledge, setSelectedKnowledge] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tree = getKnowledgeTree(data);

  useEffect(() => {
    categories.forEach(cat => {
      if (!expandedCategories.has(cat)) {
        setExpandedCategories(prev => new Set([...prev, cat]));
      }
    });
  }, []);

  const handleCategoryToggle = category => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setExpandedCategories(newSet);
  };

  const handleSubCategoryToggle = (category, subCategory) => {
    const key = `${category}-${subCategory}`;
    const newSet = new Set(expandedSubCategories);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setExpandedSubCategories(newSet);
  };

  const handleKnowledgeClick = (id, name) => {
    setSelectedKnowledge({ id, name });
  };

  const handleCheckboxChange = (e, id, name) => {
    e.stopPropagation();
    toggleKnowledgePoint(id);
    onProgressChange();
    if (!isCompleted(id) && selectedKnowledge?.id === id) {
      setSelectedKnowledge(null);
    }
  };

  const filteredTree = {};
  Object.keys(tree).forEach(category => {
    const subCategories = {};
    Object.keys(tree[category]).forEach(subCategory => {
      const knowledgePoints = tree[category][subCategory].filter(kp =>
        kp.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (knowledgePoints.length > 0) {
        subCategories[subCategory] = knowledgePoints;
      }
    });
    if (Object.keys(subCategories).length > 0) {
      filteredTree[category] = subCategories;
    }
  });

  const handleExport = () => {
    const uncompleted = data.filter((_, index) => !isCompleted(index));
    let csv = '分类,子分类,知识点名称,对应年级\n';
    uncompleted.forEach(item => {
      csv += `${item['分类']},${item['子分类']},${item['知识点名称']},${item['对应年级']}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '未完成知识点课程表.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-primary-50 via-sky-50 to-white flex flex-col"
    >
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">返回主页</span>
          </button>
          <h1 className="text-lg font-bold text-gray-800">学习详情</h1>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-primary-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出课程表
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-64 md:w-72 bg-white shadow-lg flex-shrink-0 flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索知识点..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {Object.keys(filteredTree).length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>未找到匹配的知识点</p>
                  </div>
                ) : (
                  Object.keys(filteredTree).map(category => (
                    <div key={category} className="mb-2">
                      <button
                        onClick={() => handleCategoryToggle(category)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="font-semibold text-gray-700">{category}</span>
                        {expandedCategories.has(category) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedCategories.has(category) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {Object.keys(filteredTree[category]).map(subCategory => {
                              const key = `${category}-${subCategory}`;
                              return (
                                <div key={subCategory} className="ml-4">
                                  <button
                                    onClick={() => handleSubCategoryToggle(category, subCategory)}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                                  >
                                    <span className="text-sm text-gray-600">{subCategory}</span>
                                    {expandedSubCategories.has(key) ? (
                                      <ChevronDown className="w-3 h-3 text-gray-400" />
                                    ) : (
                                      <ChevronRight className="w-3 h-3 text-gray-400" />
                                    )}
                                  </button>

                                  <AnimatePresence>
                                    {expandedSubCategories.has(key) && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                      >
                                        {filteredTree[category][subCategory].map(kp => (
                                          <div
                                            key={kp.id}
                                            onClick={() => handleKnowledgeClick(kp.id, kp.name)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                                              selectedKnowledge?.id === kp.id
                                                ? 'bg-primary-50 border-l-2 border-primary-500'
                                                : 'hover:bg-gray-50'
                                            }`}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={isCompleted(kp.id)}
                                              onChange={e => handleCheckboxChange(e, kp.id, kp.name)}
                                              className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
                                            />
                                            <span className="text-sm text-gray-700 flex-1 truncate">
                                              {kp.name}
                                            </span>
                                            {isCompleted(kp.id) && (
                                              <Check className="w-3 h-3 text-primary-500" />
                                            )}
                                          </div>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute left-0 top-16 z-40 bg-white shadow-md p-2 rounded-r-lg"
        >
          <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {selectedKnowledge ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary-500 to-sky-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{selectedKnowledge.name}</h2>
                <p className="text-white/80 text-sm">学习内容详情</p>
              </div>
              <div className="p-4">
                <iframe
                  src={`./knowledge/${encodeURIComponent(selectedKnowledge.name)}.html`}
                  title={selectedKnowledge.name}
                  className="w-full h-[500px] md:h-[600px] border border-gray-200 rounded-xl"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-gray-400"
            >
              <BookOpen className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">请选择一个知识点开始学习</p>
              <p className="text-sm mt-2">点击左侧列表中的知识点查看详情</p>
            </motion.div>
          )}
        </main>
      </div>
    </motion.div>
  );
}
