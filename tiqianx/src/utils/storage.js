const STORAGE_KEY = 'math_knowledge_progress';

export function getProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.error('Failed to save progress');
  }
}

export function isCompleted(id) {
  const progress = getProgress();
  return progress[id] === true;
}

export function toggleKnowledgePoint(id) {
  const progress = getProgress();
  progress[id] = !progress[id];
  saveProgress(progress);
  return progress[id];
}

export function getCategoryProgress(data, category) {
  const progress = getProgress();
  const categoryItems = data.filter(item => item['分类'] === category);
  const completed = categoryItems.filter((_, index) => progress[index] === true).length;
  return { completed, total: categoryItems.length };
}

export function getTotalProgress(data) {
  const progress = getProgress();
  const completed = data.filter((_, index) => progress[index] === true).length;
  return { completed, total: data.length };
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
