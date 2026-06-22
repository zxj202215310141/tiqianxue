import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './components/HomePage';
import DetailPage from './components/DetailPage';
import { knowledgeData } from './data/knowledgePoints';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [progressKey, setProgressKey] = useState(0);

  const handleProgressChange = () => {
    setProgressKey(prev => prev + 1);
  };

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'home' ? (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <HomePage 
            onEnterDetail={() => setCurrentPage('detail')} 
          />
        </motion.div>
      ) : (
        <motion.div
          key="detail"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DetailPage 
            key={progressKey}
            onBack={() => setCurrentPage('home')}
            data={knowledgeData}
            onProgressChange={handleProgressChange}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
