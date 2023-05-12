let myLinks = [];
let myNotes = [];
const linkEl = document.getElementById("link-el");
const noteEl = document.getElementById("note-el");
const pageBtn = document.getElementById("page-btn");
const deleteBtn = document.getElementById("delete-btn");
const ulEl = document.getElementById("ul-el");

pageBtn.addEventListener("click", function () {
    myLinks.push(linkEl.value);
    myNotes.push(noteEl.value);
    linkEl.value = "";
    noteEl.value = "";
    renderLeads();
})


function renderLeads() {
    let listItems = "";
    for (let i = 0; i < myLinks.length; i++) {
        listItems += `
        <li>
            <i class="fa fa-bars bars"></i>
            <a href="${myLinks[i]}" target = '_blank' style="width: 50%;">${myLinks[i]}</a>
            <div class="note__li" style="width: 50%;"><span>|</span> ${myNotes[i]}</div>
            <div class="icon__fix">
                <label for="myCheckboxId" class="checkbox">
                    <input type="checkbox" name="myCheckboxName" class="checkbox__input" id="myCheckboxId">
                    <div class="checkbox__box"></div>
                </label>
                <i class="fa fa-trash trash" style="padding: 0 10px;"></i>
                <i class="fa fa-edit edit"></i>
            </div>
        </li>`;
    }
    ulEl.innerHTML = listItems;
}    
