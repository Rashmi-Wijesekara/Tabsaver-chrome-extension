let myLeads = []

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const tabBtn = document.getElementById("tab-btn")

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))

if(leadsFromLocalStorage){
    myLeads = leadsFromLocalStorage
    render_Last_at_first(myLeads)
}

// Listen for double clicks on the delete button
// When clicked, clear localStorage, myLeads, and the DOM
deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
    displayMsg("All the tabs have been deleted", 0)
})


// show all the tabs in the saved order
function render(leads)
{
    let listItems = ""

    for(let i=0; i< leads.length; i++){
        listItems += `
            <li>
                <a href= "${leads[i].url}" target= "_blank">
                    ${leads[i].title}
                </a>
            </li>`
    }
    ulEl.innerHTML = listItems
}

// show all the tabs in a way that the last saved tab is on the top
function render_Last_at_first(leads)
{
    let listItems = ""

    for(let i = leads.length-1; i>= 0; i--){
        listItems += `
            <li>
                <a href= "${leads[i].url}" target= "_blank">
                    ${leads[i].title}
                </a>
            </li>`
    }
    ulEl.innerHTML = listItems
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
