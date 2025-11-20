// app.js
const STORAGE_KEY = 'todoAppTasks';

function filterTasks(tasks = [], filters = {}) {
  const keyword = (filters.keyword || '').trim().toLowerCase();
  const status = filters.status || '';
  const category = (filters.category || '').trim().toLowerCase();
  const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

  return tasks.filter(task => {
    const title = (task.title || '').toLowerCase();
    const taskCategory = (task.category || '').toLowerCase();
    const due = task.dueDate ? new Date(task.dueDate) : null;

    if (keyword && !(title.includes(keyword) || taskCategory.includes(keyword))) {
      return false;
    }
    if (status === 'completed' && !task.completed) return false;
    if (status === 'pending' && task.completed) return false;
    if (category && taskCategory !== category) return false;
    if (dateFrom && due && due < dateFrom) return false;
    if (dateTo && due && due > dateTo) return false;

    return true;
  });
}

function reorderTasks(tasks = [], fromIndex, toIndex) {
  const arr = [...tasks];
  if (fromIndex === toIndex) return arr;
  const [moved] = arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, moved);
  return arr;
}

if (typeof document !== 'undefined') {
  (() => {
    let tasks = [];
    let activeTaskIndex = null;

    const taskListEl        = document.getElementById('task-list');
    const newTaskForm       = document.getElementById('new-task-form');
    const themeToggleBtn    = document.getElementById('theme-toggle');
    const filterKeywordEl   = document.getElementById('filter-keyword');
    const filterStatusEl    = document.getElementById('filter-status');
    const filterCategoryEl  = document.getElementById('filter-category');
    const filterDateFromEl  = document.getElementById('filter-date-from');
    const filterDateToEl    = document.getElementById('filter-date-to');
    const filterResetBtn    = document.getElementById('filter-reset');
    const dialogOverlay     = document.getElementById('dialog-overlay');
    const modalCloseBtn     = document.getElementById('modal-close');
    const editTaskForm      = document.getElementById('edit-task-form');
    const editTitleInput    = document.getElementById('edit-title');
    const editCategoryInput = document.getElementById('edit-category');
    const editDueInput      = document.getElementById('edit-due');
    const editPriorityInput = document.getElementById('edit-priority');
    const editCancelBtn     = document.getElementById('edit-cancel');
    const dialogTitle       = document.getElementById('modal-title');
    const deleteConfirmation = document.getElementById('delete-confirmation');
    const deleteMessage     = document.getElementById('delete-message');
    const deleteConfirmBtn  = document.getElementById('delete-confirm');
    const deleteCancelBtn   = document.getElementById('delete-cancel');

    function loadTasks() {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
    }

    function saveTasks() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function closeDialog() {
      dialogOverlay.classList.add('hidden');
      dialogOverlay.setAttribute('aria-hidden', 'true');
      activeTaskIndex = null;
      editTaskForm.reset();
    }

    function openEditDialog(index) {
      activeTaskIndex = index;
      const task = tasks[index];
      if (!task) return;
      dialogTitle.textContent = 'Edit Task';
      editTaskForm.classList.remove('hidden');
      deleteConfirmation.classList.add('hidden');
      editTitleInput.value    = task.title || '';
      editCategoryInput.value = task.category || '';
      editDueInput.value      = task.dueDate || '';
      editPriorityInput.value = task.priority || 'medium';
      dialogOverlay.classList.remove('hidden');
      dialogOverlay.setAttribute('aria-hidden', 'false');
      setTimeout(() => editTitleInput.focus(), 0);
    }

    function openDeleteDialog(index) {
      activeTaskIndex = index;
      const task = tasks[index];
      if (!task) return;
      dialogTitle.textContent = 'Delete Task';
      editTaskForm.classList.add('hidden');
      deleteConfirmation.classList.remove('hidden');
      deleteMessage.textContent = `Delete "${task.title}"?`;
      dialogOverlay.classList.remove('hidden');
      dialogOverlay.setAttribute('aria-hidden', 'false');
      deleteConfirmBtn.focus();
    }

    function renderTasks() {
      const filtered = filterTasks(tasks, {
        keyword: filterKeywordEl.value,
        status: filterStatusEl.value,
        category: filterCategoryEl.value,
        dateFrom: filterDateFromEl.value,
        dateTo: filterDateToEl.value,
      });

      taskListEl.innerHTML = '';

      filtered.forEach((task) => {
        const index = tasks.indexOf(task);
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.setAttribute('draggable', 'true');
        li.dataset.index = index;

        // Drag & Drop handlers
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('dragleave', handleDragLeave);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);

        const priorityDiv = document.createElement('div');
        priorityDiv.className = 'priority-indicator priority-' + task.priority;

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!task.completed;
        cb.className = 'checkbox';
        cb.addEventListener('change', () => {
          task.completed = cb.checked;
          saveTasks();
          renderTasks();
        });

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        const titleEl = document.createElement('p');
        titleEl.className = 'title';
        titleEl.textContent = task.title;

        const metaEl = document.createElement('p');
        metaEl.className = 'meta';
        metaEl.textContent = `Category: ${task.category || 'None'} | Due: ${task.dueDate} | Priority: ${task.priority}`;

        contentDiv.append(titleEl, metaEl);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.title = 'Edit';
        editBtn.addEventListener('click', () => openEditDialog(index));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.title = 'Delete';
        deleteBtn.addEventListener('click', () => openDeleteDialog(index));

        actionsDiv.append(editBtn, deleteBtn);

        li.append(priorityDiv, cb, contentDiv, actionsDiv);
        taskListEl.append(li);

        // Reminder check
        if (!task.completed) {
          const due = task.dueDate ? new Date(task.dueDate) : null;
          const now = new Date();
          if (due && due <= now) {
            if (window.Notification && Notification.permission === 'granted') {
              new Notification('Task due: ' + task.title);
            } else if (window.Notification && Notification.permission !== 'denied') {
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') new Notification('Task due: ' + task.title);
              });
            } else {
              console.warn('Reminder: task due:', task.title);
            }
          }
        }
      });
    }

    let dragSrcEl = null;
    function handleDragStart(e) {
      dragSrcEl = this;
      this.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    }
    function handleDragOver(e) {
      e.preventDefault();
      this.classList.add('drag-over');
      e.dataTransfer.dropEffect = 'move';
    }
    function handleDragLeave(e) {
      this.classList.remove('drag-over');
    }
    function handleDrop(e) {
      e.stopPropagation();
      this.classList.remove('drag-over');
      if (dragSrcEl !== this) {
        const fromIndex = parseInt(dragSrcEl.dataset.index, 10);
        const toIndex   = parseInt(this.dataset.index, 10);
        tasks = reorderTasks(tasks, fromIndex, toIndex);
        saveTasks();
        renderTasks();
      }
    }
    function handleDragEnd(e) {
      this.classList.remove('dragging');
      document.querySelectorAll('.task-item').forEach(i => i.classList.remove('drag-over'));
    }

    // Add new task handler
    newTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title    = document.getElementById('new-task-title').value.trim();
      const priority = document.getElementById('new-task-priority').value;
      const category = document.getElementById('new-task-category').value.trim();
      const dueDate  = document.getElementById('new-task-duedate').value;
      if (!title) return;
      const id = Date.now();
      tasks.push({ id, title, priority, category, dueDate, completed: false });
      saveTasks();
      newTaskForm.reset();
      renderTasks();
    });

    // Theme toggle
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'dark') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    });

    // Edit and delete dialog events
    editTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (activeTaskIndex === null) return;
      const task = tasks[activeTaskIndex];
      if (!task) return;
      const updatedTitle = editTitleInput.value.trim();
      if (!updatedTitle) {
        editTitleInput.focus();
        return;
      }
      task.title = updatedTitle;
      task.category = editCategoryInput.value.trim();
      task.dueDate = editDueInput.value;
      task.priority = editPriorityInput.value;
      saveTasks();
      renderTasks();
      closeDialog();
    });

    deleteConfirmBtn.addEventListener('click', () => {
      if (activeTaskIndex === null) return;
      tasks.splice(activeTaskIndex, 1);
      saveTasks();
      renderTasks();
      closeDialog();
    });

    [modalCloseBtn, editCancelBtn, deleteCancelBtn].forEach(btn => {
      btn.addEventListener('click', closeDialog);
    });

    dialogOverlay.addEventListener('click', (e) => {
      if (e.target === dialogOverlay) closeDialog();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !dialogOverlay.classList.contains('hidden')) {
        closeDialog();
      }
    });

    // Filter events
    filterKeywordEl.addEventListener ('input',   renderTasks);
    filterStatusEl.addEventListener  ('change',  renderTasks);
    filterCategoryEl.addEventListener('input',   renderTasks);
    filterDateFromEl.addEventListener('change',  renderTasks);
    filterDateToEl.addEventListener  ('change',  renderTasks);
    filterResetBtn.addEventListener  ('click',   () => {
      filterKeywordEl.value    = '';
      filterStatusEl.value     = '';
      filterCategoryEl.value   = '';
      filterDateFromEl.value   = '';
      filterDateToEl.value     = '';
      renderTasks();
    });

    // Initialization
    loadTasks();
    closeDialog();
    renderTasks();

    // Optional: you could set up a timer to periodically check for due-task reminders etc.
  })();
}

if (typeof module !== 'undefined') {
  module.exports = { filterTasks, reorderTasks };
}
