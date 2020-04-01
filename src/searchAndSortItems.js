import { updateStorage } from './itemsStorage.js';

document.getElementById('searchIpt').addEventListener('keyup', filterItems);

document
  .getElementById('openItemsSort')
  .addEventListener('change', sortOpenItems);

document
  .getElementById('doneItemsSort')
  .addEventListener('change', sortDoneItems);

//Filter tasks by entered search text
function filterItems() {
  const searchValue = this.value.toLowerCase();
  const lists = document.querySelectorAll('.openItems, .doneItems');
  for (let i = 0; i < lists.length; i++) {
    const list = lists[i].querySelectorAll('li');
    for (let j = 0; j < list.length; j++) {
      const currentLi = list[j];
      const taskText = currentLi
        .querySelector('.taskText')
        .textContent.toLowerCase();
      if (taskText.indexOf(searchValue) > -1) {
        currentLi.style.display = '';
      } else {
        currentLi.style.display = 'none';
      }
    }
  }
}

//Sort open items
function sortOpenItems(event) {
  const openItems = document.getElementById('openItems');
  const sortBy = event.target.value;
  sortItems(openItems, sortBy);
  localStorage.setItem('openItemsSortBy', sortBy);
}

//Sort done items
function sortDoneItems(event) {
  const doneItems = document.getElementById('doneItems');
  const sortBy = event.target.value;
  sortItems(doneItems, sortBy);
  localStorage.setItem('doneItemsSortBy', sortBy);
}

//Sort items by text or creation date
export const sortItems = (itemList, sortBy) => {
  const newUl = itemList.cloneNode(false);
  const items = Array.from(itemList.children);
  switch (sortBy) {
    case 'textAsc':
      items.sort((li1, li2) => sortItemsByText(li1, li2));
      break;
    case 'textDesc':
      items.sort((li1, li2) => sortItemsByText(li2, li1));
      break;
    case 'dateAsc':
      items.sort((li1, li2) => sortItemsByDate(li1, li2));
      break;
    case 'dateDesc':
      items.sort((li1, li2) => sortItemsByDate(li2, li1));
      break;
  }
  items.forEach(li => newUl.appendChild(li));
  itemList.replaceWith(newUl);

  new Promise(resolve => resolve(updateStorage())).catch(error =>
    console.error(error),
  );
};

const sortItemsByText = (li1, li2) => {
  const taskText1 = li1.querySelector('.taskText');
  const taskText2 = li2.querySelector('.taskText');
  return (
    taskText1 &&
    taskText2 &&
    taskText1.textContent.localeCompare(taskText2.textContent)
  );
};

const sortItemsByDate = (li1, li2) => {
  const taskDate1 = li1.querySelector('.taskDate');
  const taskDate2 = li2.querySelector('.taskDate');
  return (
    taskDate1 &&
    taskDate2 &&
    parseInt(
      taskDate1
        .querySelector('.creationDate')
        .getAttribute('data-creation-date'),
    ) -
      parseInt(
        taskDate2
          .querySelector('.creationDate')
          .getAttribute('data-creation-date'),
      )
  );
};
