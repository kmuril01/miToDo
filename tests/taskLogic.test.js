const assert = require('assert');
const { filterTasks, reorderTasks } = require('../app.js');

const tasksSample = [
  { title: 'Task A', category: 'Work', dueDate: '2025-11-20', completed: false, priority: 'low' },
  { title: 'Task B', category: 'Personal', dueDate: '2025-11-22', completed: true, priority: 'high' },
  { title: 'Errand', category: 'Personal', dueDate: '2025-11-21', completed: false, priority: 'medium' },
];

const filteredByKeyword = filterTasks(tasksSample, {
  keyword: 'task',
  status: '',
  category: '',
  dateFrom: '',
  dateTo: '',
});
assert.strictEqual(filteredByKeyword.length, 2, 'Keyword filter should return two matching tasks');

const filteredByStatus = filterTasks(tasksSample, {
  keyword: '',
  status: 'pending',
  category: '',
  dateFrom: '',
  dateTo: '',
});
assert.strictEqual(filteredByStatus.length, 2, 'Pending filter should omit completed tasks');

const filteredByCategoryAndDate = filterTasks(tasksSample, {
  keyword: '',
  status: '',
  category: 'personal',
  dateFrom: '2025-11-21',
  dateTo: '2025-11-22',
});
assert.deepStrictEqual(
  filteredByCategoryAndDate.map(t => t.title),
  ['Task B', 'Errand'],
  'Category and date filters should honor both bounds inclusively'
);

const reordered = reorderTasks([1, 2, 3, 4], 1, 3);
assert.deepStrictEqual(reordered, [1, 3, 4, 2], 'Reorder logic should move an item to the target index');

const noOpReorder = reorderTasks(['a', 'b'], 0, 0);
assert.deepStrictEqual(noOpReorder, ['a', 'b'], 'Reorder should be a no-op when indices match');

console.log('All task logic tests passed.');
