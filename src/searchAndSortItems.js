import { updateStorage } from './itemsStorage.js';

document.getElementById('searchIpt').addEventListener('keyup', filterItems);

document
  .getElementById('openItemsSort')
  .addEventListener('change', sortOpenItems);

document
  .getElementById('doneItemsSort')
  .addEventListener('change', sortDoneItems);

//Filter tasks by entered search text
function filterItems(event) {
  const searchValue = this.value;
  const lists = document.querySelectorAll('ul');
  for (let i = 0; i < lists.length; i++) {
    const list = lists[i].querySelectorAll('li');
    for (let j = 0; j < list.length; j++) {
      const currentLi = list[j];
      const taskText = currentLi.querySelector('.taskText').textContent;
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
  const sortBy = event.currentTarget.value;
  sortItems(openItems, sortBy);
  localStorage.setItem('openItemsSortBy', sortBy);
}

//Sort done items
function sortDoneItems(event) {
  const doneItems = document.getElementById('doneItems');
  const sortBy = event.currentTarget.value;
  sortItems(doneItems, sortBy);
  localStorage.setItem('doneItemsSortBy', sortBy);
}

//Sort items by text or creation date
export const sortItems = (itemList, sortBy) => {
  const newUl = itemList.cloneNode(false);
  const items = Array.from(itemList.children);
  switch (sortBy) {
    case 'textAsc':
      items.sort((li1, li2) =>
        li1
          .querySelector('.taskText')
          .textContent.localeCompare(
            li2.querySelector('.taskText').textContent,
          ),
      );
      break;
    case 'textDesc':
      items.sort((li1, li2) =>
        li2
          .querySelector('.taskText')
          .textContent.localeCompare(
            li1.querySelector('.taskText').textContent,
          ),
      );
      break;
    case 'dateAsc':
      items.sort((li1, li2) =>
        li1
          .querySelector('.taskDate')
          .childNodes[0].textContent.localeCompare(
            li2.querySelector('.taskDate').childNodes[0].textContent,
          ),
      );
      break;
    case 'dateDesc':
      items.sort((li1, li2) =>
        li2
          .querySelector('.taskDate')
          .childNodes[0].textContent.localeCompare(
            li1.querySelector('.taskDate').childNodes[0].textContent,
          ),
      );
  }
  items.forEach(li => newUl.appendChild(li));
  itemList.replaceWith(newUl);

  new Promise(resolve => resolve(updateStorage())).catch(error =>
    console.error(error),
  );
};
