
---

## Test Case Example (`tests/taskLogic.test.js`)  
```js
// Example using plain assertions or a minimal test harness
// You may integrate a simple test runner or use Jest etc.

function filterTasks(tasks, filters) {
  // reference your filter logic from app.js
  return tasks.filter(task => {
    const keyword = filters.keyword.trim().toLowerCase();
    const status  = filters.status;
    const category= filters.category.trim().toLowerCase();
    const dateFrom= filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dateTo  = filters.dateTo   ? new Date(filters.dateTo)   : null;

    if (keyword && !(task.title.toLowerCase().includes(keyword) ||
                     (task.category && task.category.toLowerCase().includes(keyword)))) {
      return false;
    }
    if (status) {
      if (status === 'completed' && !task.completed) return false;
      if (status === 'pending'   && task.completed)  return false;
    }
    if (category && (task.category || '').toLowerCase() !== category) {
      return false;
    }
    if (dateFrom && new Date(task.dueDate) < dateFrom) return false;
    if (dateTo   && new Date(task.dueDate) > dateTo)   return false;

    return true;
  });
}

// Sample test
const tasksSample = [
  { title: 'Task A', category: 'Work', dueDate: '2025-11-20', completed: false },
  { title: 'Task B', category: 'Personal', dueDate: '2025-11-22', completed: true },
];

console.assert(
  filterTasks(tasksSample, { keyword:'task', status:'pending', category:'work', dateFrom:'2025-11-19', dateTo:'2025-11-21' }).length === 1,
  'Filter logic should return only Task A'
);

// Add more tests for reorder logic:
function reorder(tasks, fromIndex, toIndex) {
  const arr = [...tasks];
  const moved = arr.splice(fromIndex,1)[0];
  arr.splice(toIndex,0,moved);
  return arr;
}
const orig = [1,2,3,4];
const result = reorder(orig, 1, 3); // move element at index1 to index3
console.assert(JSON.stringify(result) === JSON.stringify([1,3,4,2]), 'Reorder logic failed');

console.log('Tests completed');
