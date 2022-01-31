const ulEl = document.getElementById("ul-el")
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))

if(leadsFromLocalStorage){
    myLeads = leadsFromLocalStorage
    render_Last_at_first(myLeads)
}

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

