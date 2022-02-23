// for debugging in the current page's console
/*************************************************** */

function debug(cmdName){
    chrome.storage.sync.set({msg: cmdName}) 
    
    // You can not get the context on the function, so using the Storage API to help you. 
    // https://developer.chrome.com/docs/extensions/reference/storage/ 

    chrome.tabs.query({active: true, currentWindow: true}).then(([tab])=>{ 
        chrome.scripting.executeScript({ 
            target: {tabId: tab.id}, 
            function: () => { 
                chrome.storage.sync.get(['msg'], ({msg})=> { 
                    console.log(`${msg}`) 
                }) 
            } 
        }) 
    }) 
}

let myLeads = []

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const tabBtn = document.getElementById("tab-btn")
const arrowUp = document.getElementById("arrow-up")
const arrowDown = document.getElementById("arrow-down")
const allTabsSection = document.getElementById("all-tabs")

const editTabPopup = document.getElementById("edit-tab-popup")
const closePopup = document.getElementsByClassName("close-popup")[0]
const titleEdit = document.getElementById("title-edit")
const urlEdit = document.getElementById("url-edit")
const editSaveBtn = document.getElementById("edit-save-btn")
let editIndex = null

let deleteIconSet = []
let editIconSet = []

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))

if(leadsFromLocalStorage){
    myLeads = leadsFromLocalStorage
}

// save the chosen order type of the tabs list in the local storage
// render == 1
// render_Last_at_first == 2
const tabsOrder = localStorage.getItem("tabsOrder")
let orderType = 0 

if(!tabsOrder){
    localStorage.setItem("tabsOrder", 1)
    render(myLeads)
}else {
    if(tabsOrder == 1){
        render(myLeads)
    }else if(tabsOrder == 2){
        render_Last_at_first(myLeads)
    }
}

// Listen for double clicks on the delete button
// When clicked, clear localStorage, myLeads, and the DOM
deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
    displayMsg("All the tabs have been deleted", 0)
})

// change the order of the tabs displaying
arrowUp.addEventListener("click", function() {
    ulEl.innerHTML = ""
    render_Last_at_first(myLeads)
    localStorage.setItem("tabsOrder", 2)
})

arrowDown.addEventListener("click", function() {
    ulEl.innerHTML = ""
    render(myLeads)
    localStorage.setItem("tabsOrder", 1)
})


// generate separate eventListeners for each tab deleting icon
// this function is called everytime when the list is loaded
// otherwise after changing the list order, tabs cannot be deleted
// because the id name of each delete icon was changed when the order changed
function tabDeletingEvents()
{
    for(let i =0; i<deleteIconSet.length; i++){
        let iconName = deleteIconSet[i]
        let icon = document.getElementById(iconName)

        icon.addEventListener("click", function() {
            
            debug(deleteIconSet[i])

            // get the substring of the iconName after the '-' symbol
            let index = parseInt(iconName.substring(iconName.indexOf('-') + 1))

            // remove the selected tab from myLeads array & update it in the local storage
            myLeads.splice(index, 1)
            localStorage.setItem("myLeads", JSON.stringify(myLeads))

            // check the last selected order type of the tabs list & render the list again according to that type
            checkTabsOrder()
        })
    }
}

// generate separate eventListeners for each tab editing icon
function tabEditingEvents() {
    for(let i=0; i<editIconSet.length; i++) {
        let iconName = editIconSet[i]
        let icon = document.getElementById(iconName)

        icon.addEventListener('click', function() {
            editTabPopup.style.display = 'block'
            editIndex = parseInt(iconName.substring(iconName.indexOf('-') + 1))
            
            let title = myLeads[editIndex].title
            let url = myLeads[editIndex].url
            
            titleEdit.value = title
            urlEdit.value = url
        })
    }
}

// tab data editing popup
closePopup.addEventListener('click', function() {
    editTabPopup.style.display = 'none'
})

editSaveBtn.addEventListener('click', function() {
    myLeads[editIndex].title = titleEdit.value
    myLeads[editIndex].url = urlEdit.value

    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    editTabPopup.style.display = 'none'
    checkTabsOrder()
})

// delete only one tab
function deleteTab(icon) {
    let index = parseInt(icon.charAt(icon.length - 1))
    myLeads.splice(index, 1)
    checkTabsOrder()
}

// show all the tabs in the saved order
function render(leads)
{
    let listItems = ""
    deleteIconSet = []
    editIconSet = []

    for(let i=0; i< leads.length; i++){

        editIconId = "edit-" + i
        deleteIconId = "delete-" + i

        listItems += `
            <li>
                <div class="tab-item">
                    <a href= "${leads[i].url}" target= "_blank">
                        ${leads[i].title}
                    </a>

                    <img class="edit" id="${editIconId}" alt="edit icon" src="images/edit.svg">
                    <img class="icon" id="${deleteIconId}" alt="trash bin icon" src="images/trash-alt-solid.svg">

                </div>
            </li>`
        
        deleteIconSet.push(deleteIconId)
        editIconSet.push(editIconId)
    }
    ulEl.innerHTML = listItems

    // debug(editIconSet)
    tabDeletingEvents()
    tabEditingEvents()
}

// show all the tabs in a way that the last saved tab is on the top
function render_Last_at_first(leads)
{
    let listItems = ""
    deleteIconSet = []
    editIconSet = []

    for(let i = leads.length-1; i>= 0; i--){

        editIconId = "edit-" + i
        deleteIconId = "delete-" + i

        listItems += `
            <li>
                <div class="tab-item">
                    <a href= "${leads[i].url}" target= "_blank">
                        ${leads[i].title}
                    </a>

                    <img class="edit" id="${editIconId}" alt="edit icon" src="images/edit.svg">
                    <img class="icon" id="${deleteIconId}" alt="trash bin icon" src="images/trash-alt-solid.svg">

                </div>
            </li>`
        
        deleteIconSet.push(deleteIconId)
        editIconSet.push(editIconId)
    }
    ulEl.innerHTML = listItems

    // debug(deleteIconSet)
    tabDeletingEvents()
    tabEditingEvents()
}

// check the order of the tabs list later on
function checkTabsOrder() {
    let order = localStorage.getItem("tabsOrder")

    if(order == 1){
        render(myLeads)
    }else if(order == 2){
        render_Last_at_first(myLeads)
    }else {
        displayMsg("Something went wrong", 0)
    }
}

//display the message
function displayMsg(msg, type)
{
    var alertmsg = document.getElementById('alert-msg')
    alertmsg.innerHTML = msg

    if(type == 0){
        alertmsg.style.backgroundColor = "rgb(235, 140, 140)"
        alertmsg.style.color = "white"
    }else{
        alertmsg.style.backgroundColor = "#c6f0ad"
    }
    alertmsg.style.visibility = 'visible'
    setTimeout(hideMsg, 2000, msg)
}

//hide the message
function hideMsg(msg)
{
    var alertmsg = document.getElementById('alert-msg')
    alertmsg.innerHTML = msg
    alertmsg.style.visibility = 'hidden'
}
