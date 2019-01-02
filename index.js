//Website clock:
function startClock() {
    displayTime();
    setInterval(displayTime, 1000);
}

function displayTime() {
    var timeParagraph = document.getElementById("theTime");
    var d = new Date();
    timeParagraph.innerText = d.toLocaleTimeString('it-IT');
}
//Validating input information
function validateTask() {
    var task = {
        info: document.getElementById("taskInfoBox").value,
        date: document.getElementById("dateDueBox").value,
        time: document.getElementById("timeDueBox").value
    }

    if (task.info == "") {
        document.getElementById("taskInfoBox").style.border = "1px solid red";
        alert("Please enter a task");
        return false;
    }
    if (task.date == "") {
        document.getElementById("dateDueBox").style.border = "1px solid red";
        alert("Please set task date due (Future/current date only)");
        return false;
    }
    var d = new Date();
    var yyy = d.getFullYear();
    var mmm = d.getMonth() + 1;
    var ddd = d.getDate();

    var n = new Date(task.date);
    var yy = n.getFullYear();
    var mm = n.getMonth() + 1;
    var dd = n.getDate();
    task.date = dd + "." + mm + "." + yy;

    //Validating input date as future or current :)
    if (yy < yyy) {
        alert("Enter a valid future date!");
        return false;
    }
    if (yy == yyy) {
        if (mm < mmm) {
            alert("Enter a valid future date!");
            return false;
        }
        if (mm == mmm) {
            if (dd < ddd) {
                alert("Enter a valid future date!");
                return false;
            }
        }
    }

    document.getElementById("taskInfoBox").style.border = "none";
    document.getElementById("dateDueBox").style.border = "1px solid lightgrey";
    createTaskPage(task);
    document.getElementById("myForm").reset();
}

function createTaskPage(task, loaded) {
    var newPage = document.createElement("div");
    newPage.setAttribute('class', 'taskPage');
    var pagesCount = document.getElementsByClassName('taskPage').length;
    var x = pagesCount + 1;
    newPage.setAttribute('id', 'page' + x);
    newPage.setAttribute("onmouseover", "showX(this.children[0].id)");
    newPage.setAttribute("onmouseout", "hideX(this.children[0].id)");

    var newButton = document.createElement("button");
    newButton.setAttribute("id", +x);
    newButton.setAttribute("class", "delete");
    newButton.setAttribute("onclick", "deletePage(this.id)");

    var newTaskContent = document.createElement("div");
    newTaskContent.setAttribute("class", "taskContent");

    var newTaskSpan = document.createElement("span");
    newTaskSpan.setAttribute("id", "taskContent" + x);

    document.getElementById("taskPages").appendChild(newPage);
    document.getElementById("page" + x).appendChild(newButton);
    document.getElementById(x).innerHTML = "<span class='glyphicon glyphicon-remove'></span>"
    document.getElementById("page" + x).appendChild(newTaskContent);
    document.getElementById("page" + x).getElementsByTagName("div")[0].appendChild(newTaskSpan);
    document.getElementById("taskContent" + x).innerHTML = task.info;

    var newTimeContent = document.createElement("div");
    newTimeContent.setAttribute("class", "timeContent");

    var newTimeSpan = document.createElement("span");
    newTimeSpan.setAttribute("id", "taskTime" + x);

    document.getElementById("page" + x).appendChild(newTimeContent);
    document.getElementById("page" + x).getElementsByTagName("div")[1].appendChild(newTimeSpan);
    document.getElementById(["taskTime" + x]).innerHTML = (task.date + "<br>" + task.time);

//Check if this task page was loaded after refresh or was just created by user and needs to be saved. See "loadtasks()" function.
    if (loaded != 1) {
        saveTask(x, task);
    }
}

function saveTask(x, task) {

    var jsonTask = JSON.stringify(task);
    while (localStorage.getItem("activeTask" + x) != null) {
        x++;
    }
    localStorage.setItem("activeTask" + x, jsonTask);
}

function deletePage(x) {
    var page = document.getElementById("page"+x);
 // Find the index of current task on the page
    var i = Array.from(page.parentNode.children).indexOf(page);

    page.parentNode.removeChild(page);
    localStorage.removeItem(localStorage.key(i));
    
}

function loadTasks() {
    var numOfKeys = window.localStorage.length;
    if (numOfKeys > 0) {
        for (i = 0; i < numOfKeys; i++) {
            var jsonTask = localStorage.key(i);
            var jsonString = localStorage.getItem(jsonTask);
            var task = JSON.parse(jsonString);
            var loaded = 1;
            createTaskPage(task, loaded);
        }
    }
}

function showX(x) {
    document.getElementById(x).style = "opacity: 1";
}
function hideX(x) {
    document.getElementById(x).style = "opacity: 0";
}