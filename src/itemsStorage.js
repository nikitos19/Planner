import { createLi } from './crudTasks.js';

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'interactive') {
    loadAllTaskItems();
    loadSortingParameters();
  }
});

//Load all tasks when page is opened
function loadAllTaskItems() {
  const openItems = document.getElementById('openItems');
  const doneItems = document.getElementById('doneItems');

  const items = JSON.parse(localStorage.getItem('taskItems'));
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
  document.getElementById('openItemsSort').value = localStorage.getItem(
    'openItemsSortBy',
  );
  document.getElementById('doneItemsSort').value = localStorage.getItem(
    'doneItemsSortBy',
  );
}

export function Item(done, text, date) {
  this.done = done;
  this.text = text;
  this.date = date;
}

//Update local storage after add/edit/remove tasks and after sorting tasks
export function updateStorage() {
  const items = document.querySelectorAll('ul');
  const taskItems = [];
  for (let i = 0; i < items.length; i++) {
    const nodes = items[i].children;
    for (let j = 0; j < nodes.length; j++) {
      const li = nodes[j];
      const done = li.querySelector('.chBx').checked;
      const text = li.querySelector('.taskText').textContent;
      const taskDate = li.querySelector('.taskDate');
      const date = Array.from(taskDate.childNodes).map(el => el.textContent);
      const taskItem = new Item(done, text, date);
      taskItems.push(taskItem);
    }
  }
  localStorage.setItem('taskItems', JSON.stringify(taskItems));
}
