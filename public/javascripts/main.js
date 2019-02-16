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
    const progressMax = 100;
    let progressNow = 0;
    if (tasksDone !== null) {
      progressNow = tasksDone.length * progressMax / tasks;
      if (Number.isNaN(progressNow) === true) {
        progressNow = 0;
      }
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
  function getTaskListsTitles() {
    let taskListsTitles = JSON.parse(localStorage.getItem('task-lists-titles'));
    if (taskListsTitles === null) {
      taskListsTitles = [];
      localStorage.setItem('task-lists-titles', JSON.stringify(taskListsTitles));
    }
    return taskListsTitles;
  }
  function noRepeatedTaskListTitle(taskListTitle) {
    const taskListsTitles = getTaskListsTitles();
    let noOnTheList = true;
    taskListsTitles.forEach((title) => {
      if (taskListTitle === title) {
        noOnTheList = false;
      }
    });
    return noOnTheList;
  }
  function getTaskListTitle() {
    const taskListTitle = document.querySelector('#task-list-title').innerText;
    return taskListTitle;
  }
  function saveCurrentTaskListToLocalStorage() {
    const taskListTitle = getTaskListTitle();
    localStorage.setItem('current-task-list', JSON.stringify(taskListTitle));
  }
  function saveNewTitleListToLocalStorage(newTitle = getTaskListTitle()) {
    const taskListsTitles = getTaskListsTitles();
    taskListsTitles.push(newTitle);
    localStorage.setItem('task-lists-titles', JSON.stringify(taskListsTitles));
  }
  function saveTaskList() {
    const tasksToSave = getTasksToSave();
    const taskListTitle = getTaskListTitle();
    localStorage.setItem(taskListTitle, JSON.stringify(tasksToSave));
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

  function closeMenuSettings() {
    document.querySelector('button').click();
  }

  function removeAllTasks() {
    document.querySelectorAll('#tasks-list li').forEach((li) => {
      removeTaskFromList(li);
    });
    closeMenuSettings();
  }
  document.querySelector('#remove-all').addEventListener('click', removeAllTasks);

  function removeDoneTasks() {
    document.querySelectorAll('#tasks-list li').forEach((li) => {
      if (li.firstElementChild.classList.value === 'checked') {
        removeTaskFromList(li);
      }
    });
    closeMenuSettings();
  }
  document.querySelector('#remove-done').addEventListener('click', removeDoneTasks);

  function retrieveTitleFromLocalStorage() {
    const taskListTitle = JSON.parse(localStorage.getItem('current-task-list'));
    return taskListTitle;
  }
  function setTitleFromLocalStorage() {
    const taskListTitle = retrieveTitleFromLocalStorage();
    document.querySelector('#task-list-title').innerText = taskListTitle;
  }
  function getChangedTitle() {
    let changedTitle = document.querySelector('#changed-title').value;
    changedTitle = changedTitle.trim();
    return changedTitle;
  }
  function getNewTitle() {
    let newTitle = document.querySelector('#new-title').value;
    newTitle = newTitle.trim();
    return newTitle;
  }

  function showError(err) {
    document.querySelector('.error').innerText = err;
    document.querySelector('.error').classList.add('show');
    setTimeout(() => {
      document.querySelector('.error').classList.remove('show');
    }, 3000);
  }

  function isTitleCorrect(title) {
    let isCorrect = false;
    if (title !== '') {
      if (noRepeatedTaskListTitle(title) === true) {
        isCorrect = true;
      } else {
        showError('There is a task list with such a title');
      }
    }
    return isCorrect;
  }
  function clearInput(id) {
    document.querySelector(id).value = '';
  }
  function createHtmlElementToSeparateAddNewTaskList() {
    const div = document.createElement('div');
    div.classList.add('dropdown-divider');
    return div;
  }
  function createHtmlElementForTaskListsTitles(task) {
    const li = document.createElement('li');
    li.innerText = task;
    li.classList.add('dropdown-item', 'task-list-title'); //
    return li;
  }
  function showTaskListsTitles() {
    const taskListsTitles = getTaskListsTitles();
    const taskList = document.querySelector('.dropdown-menu');

    taskListsTitles.forEach((title) => {
      const li = createHtmlElementForTaskListsTitles(title);
      taskList.append(li);
    });
    const div = createHtmlElementToSeparateAddNewTaskList();
    const createTaskList = createHtmlElementForTaskListsTitles('Create new Task List');
    const changeTitle = createHtmlElementForTaskListsTitles('Change task list title');
    createTaskList.setAttribute('data-toggle', 'modal');
    createTaskList.setAttribute('data-target', '#create-new-task-list');
    changeTitle.setAttribute('id', 'change-title');
    changeTitle.setAttribute('data-toggle', 'modal');
    changeTitle.setAttribute('data-target', '#change-task-list-title');

    taskList.append(div);
    taskList.append(changeTitle);
    taskList.append(createTaskList);
  }
  function updateShowTaskListTitles() {
    document.querySelectorAll('.dropdown-menu li').forEach((li) => { li.remove(); });
    document.querySelector('.dropdown-menu div').remove();
    showTaskListsTitles();
  }
  function createNewTaskList() {
    const newTitle = getNewTitle();
    if (isTitleCorrect(newTitle)) {
      document.querySelector('#task-list-title').innerText = newTitle;
      clearInput('#new-title');
      saveCurrentTaskListToLocalStorage();
      saveNewTitleListToLocalStorage();
      removeAllTasks();
      saveTaskList();
      updateShowTaskListTitles();
    }
  }
  document.querySelector('#create-new-task-list-bttn').addEventListener('click', createNewTaskList);

  function removeTaskListFromLocalStorage(taskListTitle) {
    localStorage.removeItem(taskListTitle);
  }


  function getLastAddedTask() {
    const tasks = document.querySelectorAll('li');
    const task = tasks[tasks.length - 1];
    return task;
  }
  function retrieveTasksFromLocalStorage() {
    const curretTaskListTitle = JSON.parse(localStorage.getItem('current-task-list'));
    const savedTasks = JSON.parse(localStorage.getItem(curretTaskListTitle));
    return savedTasks;
  }
  function updateTasksFromLocalStorage() {
    const savedTasks = retrieveTasksFromLocalStorage();
    for (let i = 0; i < savedTasks.length; i += 1) {
      addTaskToList(savedTasks[i].task);
      if (savedTasks[i].taskIsDone === true) {
        getLastAddedTask().click();
      }
    }
    setTimeout(() => {
      setProgress();// for empty tasks list
    }, 100);
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
  function addExampleTaskListTitle(title = 'Task list') {
    document.querySelector('#task-list-title').innerText = title;
  }
  function initializeTaskList() {
    addExampleTasks();
    addExampleTaskListTitle();
    saveCurrentTaskListToLocalStorage();
    saveNewTitleListToLocalStorage();
  }
  function clearTaskList() {
    document.querySelectorAll('#tasks-list li').forEach((li) => {
      li.classList.add('to-remove');
      setTimeout(() => {
        li.remove();
      }, 50);
    });
  }
  function setCurrentTaskListTite(title) {
    localStorage.setItem('current-task-list', JSON.stringify(title));
  }
  function taskListIsOpen() {
    if (localStorage['current-task-list']) {
      setTitleFromLocalStorage();
      updateTasksFromLocalStorage();
    } else {
      initializeTaskList();
    }
    updateShowTaskListTitles();
  }
  taskListIsOpen();

  function switchBetweenTaskLists(title) {
    clearTaskList();
    setCurrentTaskListTite(title);
    taskListIsOpen();
  }
  function changeCurrentTaskListTitle() {
    const taskListsTitles = document.querySelector('.dropdown-menu');
    taskListsTitles.addEventListener('click', (ev) => {
      if (ev.target.tagName === 'LI' && ev.target.innerText !== 'Create new Task List'
        && ev.target.innerText !== 'Change task list title') {
        switchBetweenTaskLists(ev.target.innerText);
      }
    }, false);
  }
  changeCurrentTaskListTitle();
  function changeCurrentTaskList() {
    const taskListsTitles = getTaskListsTitles();
    let titleToSet;
    if (taskListsTitles.length > 0) {
      titleToSet = taskListsTitles[taskListsTitles.length - 1];
      // setCurrentTaskListTite(titleToSet);
      switchBetweenTaskLists(titleToSet);
    } else {
      clearTaskList();
      initializeTaskList();
    }
  }

  function removeTaskListTitleFromLocalStorage(taskTitle) {
    const taskListsTitles = getTaskListsTitles();
    const newTaskListsTitles = [];
    taskListsTitles.forEach((title) => {
      if (taskTitle !== title) {
        newTaskListsTitles.push(title);
      }
    });
    localStorage.setItem('task-lists-titles', JSON.stringify(newTaskListsTitles));
  }
  function deleteCurrentTaskList() {
    const currentTaskList = getTaskListTitle();
    removeTaskListFromLocalStorage(currentTaskList);
    removeTaskListTitleFromLocalStorage(currentTaskList);
    changeCurrentTaskList();
    updateShowTaskListTitles();
  }
  document.querySelector('#delete-task-list').addEventListener('click', deleteCurrentTaskList);

  function renameTaksList() {
    const changedTitle = getChangedTitle();
    if (isTitleCorrect(changedTitle)) {
      const oldTaskListTitle = document.querySelector('#task-list-title').innerText;
      removeTaskListFromLocalStorage(oldTaskListTitle);
      removeTaskListTitleFromLocalStorage(oldTaskListTitle);

      document.querySelector('#task-list-title').innerText = changedTitle;
      clearInput('#changed-title');
      saveCurrentTaskListToLocalStorage();
      saveNewTitleListToLocalStorage();
      saveTaskList();
      updateShowTaskListTitles();
    }
    closeMenuSettings();
  }
  document.querySelector('#bttn-change-title').addEventListener('click', renameTaksList);

  function loadTasksFromFile() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      const oFReader = new FileReader();
      const rFilter = 'text/plain'; // with 'application/json' do not work on android webview, samsung internet, safari on iOS

      oFReader.onload = (oFREvent) => {
        const taskList = oFREvent.target.result;
        const splitedTaskList = taskList.split('[');
        const taskListTitle = splitedTaskList[0].slice(1, -1);
        const tasks = `[${splitedTaskList[1]}`;

        if (taskListTitle !== '') {
          if (noRepeatedTaskListTitle(taskListTitle) === true) {
            (async function setLocalSotrage() {
              await clearTaskList();
              await localStorage.setItem('current-task-list', JSON.stringify(taskListTitle));
              await localStorage.setItem(taskListTitle, tasks);
              await saveNewTitleListToLocalStorage(taskListTitle);
              await taskListIsOpen();
            }());
          } else {
            $('#overwrite-task-list').modal('show');
            $('#task-list-to-overwrite').text(taskListTitle);
            document.querySelector('#overwrite-task-list-bttn').addEventListener('click', () => {
              showError(`${taskListTitle} was overwritten!`);
              (async function removeOldAndAddNewTaskListToLocalSotrage() {
                await clearTaskList();
                await removeTaskListFromLocalStorage(taskListTitle);
                await removeTaskListTitleFromLocalStorage(taskListTitle);
                await localStorage.setItem('current-task-list', JSON.stringify(taskListTitle));
                await localStorage.setItem(taskListTitle, tasks);
                await saveNewTitleListToLocalStorage(taskListTitle);
                await taskListIsOpen();
              }());
            });
          }
        }
      };
      const load = function loadTaskListFromFile() {
        const oFile = document.getElementById('files').files[0];
        if (oFile.type === rFilter) {
          oFReader.readAsText(oFile);
        } else {
          showError('Error: Incorrect file!');
        }
        closeMenuSettings();
      };
      document.querySelector('#upload-tasks-from-file').addEventListener('click', load);
    } else {
      showError('Error: The browser doesn\'t support the FileReader Object!');
    }
  }
  loadTasksFromFile();

  function saveTaskListToFile() {
    const a = document.createElement('a');
    const blob = new Blob([localStorage.getItem('current-task-list'), localStorage.getItem(getTaskListTitle())], { type: 'text/plain' });
    a.href = URL.createObjectURL(blob);
    a.download = 'task-list.txt';
    a.click();
    closeMenuSettings();
  }
  document.querySelector('#save-tasks').addEventListener('click', saveTaskListToFile);
}());
