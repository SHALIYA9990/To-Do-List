
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const progressBar = document.querySelector('.progress');
const numbersEl = document.getElementById('numbers');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'taskItem';

    li.innerHTML = `
      <div class="task ${task.completed ? 'completed' : ''}">
        <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} />
        <p>${task.text}</p>
      </div>
      <div class="icons">
        <img src="edit.jpg" alt="Edit" class="editBtn" data-index="${index}" />
        <img src="delete.jpg" alt="Delete" class="deleteBtn" data-index="${index}" />
      </div>
    `;
    taskList.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  numbersEl.textContent = `${completed} / ${total}`;
  const percent = total > 0 ? (completed / total) * 100 : 0;
  progressBar.style.width = percent + '%';
}

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  taskInput.value = '';
  saveTasks();
  renderTasks();
});

taskList.addEventListener('change', e => {
  if (e.target.classList.contains('checkbox')) {
    const index = [...taskList.children].indexOf(e.target.closest('li'));
    tasks[index].completed = e.target.checked;
    saveTasks();
    renderTasks();
  }
});

taskList.addEventListener('click', e => {
  const target = e.target;
  const index = target.dataset.index;
  if (target.classList.contains('editBtn')) {
    const newText = prompt('Edit task:', tasks[index].text);
    if (newText !== null) {
      tasks[index].text = newText.trim();
      saveTasks();
      renderTasks();
    }
  } else if (target.classList.contains('deleteBtn')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
});

renderTasks();
