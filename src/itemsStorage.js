import { createLi } from './crudTasks.js';

document.addEventListener('DOMContentLoaded', event => {
  loadAllTaskItems();
  loadSortingParameters();
});

//Load all tasks when page is opened
function loadAllTaskItems() {
  const openItems = document.getElementById('openItems');
  const doneItems = document.getElementById('doneItems');

  const items = JSON.parse(localStorage.getItem('taskItems'));
  items &&
    items.forEach(taskItem => {
      const task = createLi(taskItem);
      if (taskItem.done) {
        doneItems.appendChild(task);
      } else {
        openItems.appendChild(task);
      }
    });
}

//Load sorting value parameters when page is opened
function loadSortingParameters() {
  const openItemsSortBy = localStorage.getItem('openItemsSortBy');
  if (openItemsSortBy) {
    document.getElementById('openItemsSort').value = openItemsSortBy;
  }
  const doneItemsSortBy = localStorage.getItem('doneItemsSortBy');
  if (doneItemsSortBy) {
    document.getElementById('doneItemsSort').value = doneItemsSortBy;
  }
}

export function Item(done = false, text, taskDate = null) {
  this.done = done;
  this.text = text;
  this.taskDate = taskDate;
}

function TaskDate(
  creationTime,
  creationDate,
  doneTime = null,
  doneDate = null,
) {
  this.creationTime = creationTime;
  this.creationDate = creationDate;
  this.doneTime = doneTime;
  this.doneDate = doneDate;
}

//Update local storage after add/edit/remove tasks and after sorting tasks
export function updateStorage() {
  const items = document.querySelectorAll('.openItems, .doneItems');
  const taskItems = [];
  for (let i = 0; i < items.length; i++) {
    const nodes = items[i].children;
    for (let j = 0; j < nodes.length; j++) {
      const li = nodes[j];
      const done = li.querySelector('.chBx').checked;
      const text = li.querySelector('.taskText').textContent;
      const taskDateDiv = li.querySelector('.taskDate');
      const taskDate = createTaskDateObj(taskDateDiv);
      const taskItem = new Item(done, text, taskDate);
      taskItems.push(taskItem);
    }
  }
  localStorage.setItem('taskItems', JSON.stringify(taskItems));
}

const createTaskDateObj = taskDateDiv => {
  const creationDateSpan = taskDateDiv.querySelector('.creationDate');
  const creationDate = creationDateSpan.getAttribute('data-creation-date');
  const doneDateSpan = taskDateDiv.querySelector('.doneDate');

  if (doneDateSpan) {
    const doneDate = doneDateSpan.getAttribute('data-done-date');
    return new TaskDate(
      creationDateSpan.textContent,
      creationDate,
      doneDateSpan.textContent,
      doneDate,
    );
  } else {
    return new TaskDate(creationDateSpan.textContent, creationDate);
  }
};
