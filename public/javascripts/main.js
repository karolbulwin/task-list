(function main() {
  function createHtmlElement(task) {
    const li = document.createElement('li');
    const p = document.createElement('p');
    const bttn = document.createElement('button');
    const span = document.createElement('span');

    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'new-task');
    p.innerText = task;
    bttn.type = 'button';
    bttn.classList.add('close');
    bttn.setAttribute('aria-label', 'Close');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '&times;';

    bttn.append(span);
    li.append(p);
    li.append(bttn);

    return li;
  }
  function checkProgress() {
    const tasks = document.querySelectorAll('#tasks-list li').length;
    const tasksDone = document.querySelectorAll('#tasks-list li.checked-bg');
    const progressMax = 100; // 8
    let progressNow = 0;
    if (tasksDone !== null) {
      progressNow = tasksDone.length * progressMax / tasks;
    }
    return progressNow;
  }
  function setProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const progress = checkProgress();
    progressBar.style.width = `${progress}%`;
  }
  function getTasksToSave() {
    const tasks = document.querySelectorAll('#tasks-list li');
    const tasksToSave = [];
    let task;
    let taskIsDone;
    for (let i = 0; i < tasks.length; i += 1) {
      task = tasks[i].firstElementChild.innerText;
      taskIsDone = false;
      if (tasks[i].firstElementChild.classList.value === 'checked') {
        taskIsDone = true;
      }
      tasksToSave.push({ task, taskIsDone });
    }
    return tasksToSave;
  }
  function saveTaskList() {
    const tasksToSave = getTasksToSave();
    localStorage.setItem('task-list', JSON.stringify(tasksToSave));
  }
  function addTaskToList(task) {
    const taskList = document.querySelector('#tasks-list');
    const li = createHtmlElement(task);
    taskList.append(li);
    setTimeout(() => {
      li.classList.remove('new-task');
      setProgress();
      saveTaskList();
    }, 600);
  }
  function clearAddedTask() {
    document.querySelector('#task').value = '';
  }
  function checkTask() {
    let isTask = true;
    let task = document.querySelector('#task').value;
    task = task.trim();
    if (task === '') {
      isTask = false;
    }
    return { isTask, task };
  }
  function addTask() {
    const { isTask, task } = checkTask();
    if (isTask === true) {
      addTaskToList(task);
      clearAddedTask();
    }
  }
  document.querySelector('#button-add-task').addEventListener('click', addTask);

  function checkTheKey(e) {
    if (e.key === 'Enter') {
      addTask();
    }
  }
  document.addEventListener('keydown', checkTheKey);

  function removeTaskFromList(task) {
    const li = task;
    li.classList.add('to-remove');
    setTimeout(() => {
      li.remove();
      setProgress();
      saveTaskList();
    }, 600);
  }
  function addEventListenerForTasks() {
    const taskList = document.querySelector('#tasks-list');
    taskList.addEventListener('click', (ev) => {
      if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked-bg');
        ev.target.firstElementChild.classList.toggle('checked');
      }
      if (ev.target.tagName === 'P') {
        ev.target.classList.toggle('checked');
        ev.target.parentElement.classList.toggle('checked-bg');
      }
      if (ev.target.tagName === 'SPAN') {
        const task = ev.target.parentElement.parentElement;
        removeTaskFromList(task);
      }
      if (ev.target.tagName === 'BUTTON') {
        const task = ev.target.parentElement;
        removeTaskFromList(task);
      }
      setProgress();
      saveTaskList();
    }, false);
  }
  addEventListenerForTasks();

  function removeAllTasks() {
    document.querySelectorAll('#tasks-list li').forEach((li) => {
      removeTaskFromList(li);
    });
  }
  document.querySelector('#remove-all').addEventListener('click', removeAllTasks);

  function removeDoneTasks() {
    document.querySelectorAll('#tasks-list li').forEach((li) => {
      if (li.firstElementChild.classList.value === 'checked') {
        removeTaskFromList(li);
      }
    });
  }
  document.querySelector('#remove-done').addEventListener('click', removeDoneTasks);

  function getTaskListTitleToSave() {
    const taskListTitle = document.querySelector('#task-list-title').innerText;
    return taskListTitle;
  }
  function saveTitleToLocalStorage() {
    let taskListTitle = getTaskListTitleToSave();
    taskListTitle = { title: taskListTitle };
    localStorage.setItem('task-list-title', JSON.stringify(taskListTitle));
  }
  function retrieveTitleFromLocalStorage() {
    const taskListTitle = JSON.parse(localStorage.getItem('task-list-title'));
    return taskListTitle;
  }
  function setTitleFromLocalStorage() {
    const taskListTitle = retrieveTitleFromLocalStorage();
    document.querySelector('#task-list-title').innerText = taskListTitle.title;
  }
  function getNewTitle() {
    let newTitle = document.querySelector('#new-title').value;
    newTitle = newTitle.trim();
    return newTitle;
  }
  function renameTaksList() {
    const newTitle = getNewTitle();
    if (newTitle !== '') {
      document.querySelector('#task-list-title').innerText = newTitle;
      saveTitleToLocalStorage();
    }
  }
  document.querySelector('#bttn-change-title').addEventListener('click', renameTaksList);

  function getLastAddedTask() {
    const tasks = document.querySelectorAll('li');
    const task = tasks[tasks.length - 1];
    return task;
  }
  function retrieveTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem('task-list'));
    return savedTasks;
  }
  function updateTaksFromLocalStorage() {
    const savedTasks = retrieveTasksFromLocalStorage();
    for (let i = 0; i < savedTasks.length; i += 1) {
      addTaskToList(savedTasks[i].task);
      if (savedTasks[i].taskIsDone === true) {
        getLastAddedTask().click();
      }
    }
  }
  function addExampleTasks() {
    const exampleTasks = [
      'task 1',
      'task 2',
      'task 3'
    ];
    exampleTasks.forEach((task) => {
      addTaskToList(task);
    });
  }
  function addExampleTaskListTitle() {
    const exampleTitle = 'Task list';
    document.querySelector('#task-list-title').innerText = exampleTitle;
  }
  function taskListIsOpen() {
    if (localStorage.length === 0 || localStorage['task-list'].length === 2) {
      addExampleTasks();
    } else {
      updateTaksFromLocalStorage();
    }
    if (localStorage['task-list-title']) {
      setTitleFromLocalStorage();
    } else {
      addExampleTaskListTitle();
      saveTitleToLocalStorage();
    }
  }
  taskListIsOpen();

  function loadTasksFromFile() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      const oFReader = new FileReader();
      const rFilter = 'application/json';

      oFReader.onload = (oFREvent) => {
        const taskList = oFREvent.target.result;
        const splitedTaskList = taskList.split(']');
        splitedTaskList[0] += ']';

        (async function setLocalSotrage() {
          await localStorage.clear();
          await localStorage.setItem('task-list', splitedTaskList[0]);
          await localStorage.setItem('task-list-title', splitedTaskList[1]);
          // location.reload()
          await removeAllTasks();
          await taskListIsOpen();
        }());
      };
      const load = function loadTaskListFromFile() {
        const oFile = document.getElementById('files').files[0];
        if (oFile.type === rFilter) {
          oFReader.readAsText(oFile);
        } else {
          document.querySelector('.error').innerText = 'Error: Incorrect file!';
          document.querySelector('.error').classList.add('show');
          setTimeout(() => {
            document.querySelector('.error').classList.remove('show');
          }, 3000);
        }
      };
      document.querySelector('#upload-tasks').addEventListener('click', load);
    } else {
      document.querySelector('.error').innerText = 'Error: The browser doesn\'t support the FileReader Object!';
      document.querySelector('.error').classList.add('show');
      setTimeout(() => {
        document.querySelector('.error').classList.remove('show');
      }, 3000);
    }
  }
  loadTasksFromFile();

  function saveTaskListToFile() {
    const a = document.createElement('a');
    const blob = new Blob([localStorage.getItem('task-list'), localStorage.getItem('task-list-title')], { type: 'application/json' });
    a.href = URL.createObjectURL(blob);
    a.download = 'task-list.json';
    a.click();
  }
  document.querySelector('#save-tasks').addEventListener('click', saveTaskListToFile);

  function resetAll() {
    removeAllTasks();
    addExampleTaskListTitle();
    localStorage.clear();
    taskListIsOpen();
  }
  document.querySelector('#reset-all').addEventListener('click', resetAll);
  // window.visualViewport.height
}());
