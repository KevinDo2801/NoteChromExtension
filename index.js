let myEmoji = [];
let titleLink = [];
let myLinks = [];
const linkEl = document.getElementById("link-el");
const pageBtn = document.getElementById("page-btn");
const deleteBtn = document.getElementById("delete-btn");
const ulEl = document.getElementById("ul-el");
const deleteItBtn = document.getElementById("deleteIt-btn");
const changeBtn = document.getElementById("change-btn");
const cancelBtn = document.getElementById("cancel-btn");
let editIndex = null;

const emojiFromLocalStorage = JSON.parse(localStorage.getItem("myEmoji"));
const linksFromLocalStorage = JSON.parse(localStorage.getItem("myLinks"));
const titleLinkFromLocalStorage = JSON.parse(localStorage.getItem("titleLink"));

function updateButtonsDisplay() {
  const checkedCheckboxes = document.querySelectorAll('.checkbox__input:checked');
  const hasCheckedCheckboxes = checkedCheckboxes.length > 0;
  deleteBtn.style.display = hasCheckedCheckboxes ? 'none' : 'inline-block';
  deleteItBtn.style.display = hasCheckedCheckboxes ? 'inline-block' : 'none';
}
updateButtonsDisplay();

function loadFromLocalStorage() {
  if (linksFromLocalStorage) {
    myEmoji = emojiFromLocalStorage;
    titleLink = titleLinkFromLocalStorage;
    myLinks = linksFromLocalStorage;
    renderLeads();
    updateButtonsDisplay();
  }
}

function saveToLocalStorage() {
  localStorage.setItem("myEmoji", JSON.stringify(myEmoji));
  localStorage.setItem("titleLink", JSON.stringify(titleLink));
  localStorage.setItem("myLinks", JSON.stringify(myLinks));
}

function renderLeads() {
  let listItems = "";
  for (let i = 0; i < myLinks.length; i++) {
    const checkboxId = `myCheckboxId_${i}`; 
    listItems += `
      <li draggable="true">
        <img class = "bars" src="${myEmoji[i]}" style = "width: 15px; height: 15px;">
        <a href="${myLinks[i]}" target="_blank" style="width: 100%;">${titleLink[i]}</a>
        <div class="icon__fix">
          <label for="${checkboxId}" class="checkbox">
            <input type="checkbox" name="myCheckboxName" class="checkbox__input" id="${checkboxId}">
            <div class="checkbox__box"></div>
          </label>
          <i class="fa fa-trash trash" style="padding: 0 10px;" data-index="${i}"></i>
          <i class="fa fa-edit edit"></i>
        </div>
      </li>`;
  }
  ulEl.innerHTML = listItems;
  updateButtonsDisplay();

  const checkboxes = document.querySelectorAll('.checkbox__input');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateButtonsDisplay);
  });

  const trashIcons = document.querySelectorAll('.trash');
  trashIcons.forEach(trashIcon => {
    trashIcon.addEventListener('click', (event) => {
      const index = parseInt(event.target.dataset.index);

      myEmoji.splice(index, 1);
      titleLink.splice(index, 1);
      myLinks.splice(index, 1);

      saveToLocalStorage();
      renderLeads();
    });
  });

  const editIcons = document.querySelectorAll('.edit');
  editIcons.forEach(editIcon => {
    editIcon.addEventListener('click', (event) => {
      editIndex = parseInt(event.target.closest('.icon__fix').querySelector('.trash').dataset.index);

      linkEl.disabled = false;

      linkEl.href = myLinks[editIndex];
      linkEl.value = titleLink[editIndex];

      pageBtn.style.display = 'none';
      deleteBtn.style.display = 'none';
      changeBtn.style.display = 'inline-block';
      cancelBtn.style.display = 'inline-block';
    });
  });
}

function getCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    linkEl.value = tabs[0].title;
    linkEl.href = tabs[0].url;
    linkEl.favIconUrl = tabs[0].favIconUrl;
  });
}

function addLead() {
  if (linkEl.value) {
    myEmoji.unshift(linkEl.favIconUrl);
    titleLink.unshift(linkEl.value);
    myLinks.unshift(linkEl.href);

    saveToLocalStorage();
    linkEl.favIconUrl = "";
    linkEl.href = "";
    linkEl.value = "";
    linkEl.disabled = true;
    renderLeads();
  }
}

function deleteAllLeads() {
  localStorage.clear();
  myEmoji = [];
  titleLink = [];
  myLinks = [];
  renderLeads();
}

function deleteSelectedLeads() {
  const checkedCheckboxes = document.querySelectorAll('.checkbox__input:checked');
  const indicesToRemove = Array.from(checkedCheckboxes)
    .map(checkbox => parseInt(checkbox.id.split('_')[1]))
    .sort((a, b) => b - a); // Sort indices in descending order

  indicesToRemove.forEach(index => {
    myEmoji.splice(index, 1);
    titleLink.splice(index, 1);
    myLinks.splice(index, 1);
  });

  saveToLocalStorage();
  renderLeads();
}


function handleDragStart(event) {
  const listItem = event.target.closest('li');
  dragIndex = Array.from(ulEl.children).indexOf(listItem);
  event.dataTransfer.setData('text/plain', dragIndex);
}

function handleDrop(event) {
  const dropIndex = Array.from(ulEl.children).indexOf(event.target.closest('li'));
  swapArrayElements(dragIndex, dropIndex, titleLink);
  swapArrayElements(dragIndex, dropIndex, myLinks);
  swapArrayElements(dragIndex, dropIndex, myEmoji);
  renderLeads();
  saveToLocalStorage();
}

function swapArrayElements(index1, index2, array) {
  if (index1 < 0 || index1 >= array.length || index2 < 0 || index2 >= array.length) {
    return; // Invalid indices
  }

  const temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
}

function changeLead() {
  if (editIndex !== null) {
    titleLink[editIndex] = linkEl.value;
    myLinks[editIndex] = linkEl.href;

    saveToLocalStorage();
    renderLeads();
    resetInputFields();

    linkEl.disabled = true;
  }
}

function resetInputFields() {
  linkEl.value = "";
  editIndex = null;

  pageBtn.style.display = 'inline-block';
  deleteBtn.style.display = myLinks.length === 0 ? 'none' : 'inline-block';
  changeBtn.style.display = 'none';
  cancelBtn.style.display = 'none';

  linkEl.disabled = true;
}

loadFromLocalStorage();
getCurrentTab();

pageBtn.addEventListener("click", addLead);
deleteBtn.addEventListener("dblclick", deleteAllLeads);
deleteItBtn.addEventListener("click", deleteSelectedLeads);
ulEl.addEventListener('dragstart', handleDragStart);
ulEl.addEventListener('dragover', event => event.preventDefault());
ulEl.addEventListener('drop', handleDrop);
changeBtn.addEventListener("click", changeLead);
cancelBtn.addEventListener("click", resetInputFields);