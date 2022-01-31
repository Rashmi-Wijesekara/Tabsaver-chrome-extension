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

/* 
debug(leadsFromLocalStorage) ==> will not work

because we cannot parse variables to console debug messages

debug(localStorage.getItem("myLeads")) ==> will work
*/

/*************************************************** */

let myLeads = []

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const tabBtn = document.getElementById("tab-btn")

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))

if(leadsFromLocalStorage){
    myLeads = leadsFromLocalStorage
    //render(myLeads)
}

// SAVE TAB button
tabBtn.addEventListener("click", function() {
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // since only one tab should be active and in the current window at once
        // the return variable should only have one entry
        let activeTab = tabs[0]
        //let activeTabId = activeTab.id // or do whatever you need

        if(checkUrl(activeTab.url) === 0){
            return
        }

        const tabData = {url:activeTab.url, title:activeTab.title}
        myLeads.push(tabData)
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        
        debug(localStorage.getItem("myLeads"))

        //render(myLeads)    
    })
    
    displayMsg("Tab is saved successfully", 1)
})

// SAVE INPUT button
inputBtn.addEventListener("click", function() {

    if(inputEl.value == "") {
        displayMsg("Please enter a URL to save", 0)
        return
    }

    if(checkUrl(inputEl.value) === 0){
        return
    }

    const tabData = {url:inputEl.value, title:inputEl.value}
    myLeads.push(tabData)
    
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    
    displayMsg("Input has saved successfully", 1)

    //render(myLeads)
    inputEl.value = ""
    debug(localStorage.getItem("myLeads"))
    
    /*
    const li = document.createElement("li")
    li.textContent = input
    ulEl.append(li)
    */
})

// render through the whole list
function render(leads)
{
    let listItems = ""
    for(let i=0; i< leads.length; i++){
        //listItems += "<li><a href= '"+ myLeads[i] +"' target= '_blank'>"+ myLeads[i]+ "</a></li>"
        //template string
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

// check whether the given URL is already saved before
function checkUrl(url)
{
    for(let i =0; i< myLeads.length; i++){
        if(myLeads[i].url == url){
            displayMsg("This URL is already saved before", 0)
            return 0
        }
    }
}