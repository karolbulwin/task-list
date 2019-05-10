(function main() {
  function createHtmlElement(task) {
    const li = document.createElement('li');
    const p = document.createElement('p');
    const bttn = document.createElement('button');
    const span = document.createElement('span');

    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-center',
      'new-task'
    );
    p.innerText = task;
    li.setAttribute('tabindex', '0');
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
      progressNow = (tasksDone.length * progressMax) / tasks;
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
  function sortIsOn() {
    const sortStatus = document.querySelector('#sortAlphabetically').checked;
    return sortStatus;
  }
  function saveSortOption() {
    const taskListTitle = getTaskListTitle();
    localStorage.setItem(`${taskListTitle}-sorted`, JSON.stringify(sortIsOn()));
  }
  function retrieveTasksFromLocalStorage() {
    const curretTaskListTitle = JSON.parse(localStorage.getItem('current-task-list'));
    const savedTasks = JSON.parse(localStorage.getItem(curretTaskListTitle));
    return savedTasks;
  }
  function retrieveSortOptionFromLocalStorage() {
    const curretTaskListTitle = JSON.parse(localStorage.getItem('current-task-list'));
    const sortStatus = JSON.parse(localStorage.getItem(`${curretTaskListTitle}-sorted`));
    return sortStatus;
  }

  function sortAlphabetically(taksList) {
    const tasks = taksList;
    tasks.sort((a, b) => {
      const x = a.task.toLowerCase();
      const y = b.task.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    return tasks;
  }

  function checkOrder(task) {
    const tasksList = retrieveTasksFromLocalStorage();
    tasksList.push({ task, taskIsDone: false });
    const sortedTaskList = sortAlphabetically(tasksList);
    const arrayOfTasks = sortedTaskList.map(t => t.task);
    const insertIndex = arrayOfTasks.indexOf(task);
    return insertIndex;
  }

  function addTaskToList(task, newTask = false) {
    const taskList = document.querySelector('#tasks-list');
    const li = createHtmlElement(task);

    if (newTask && retrieveSortOptionFromLocalStorage()) {
      taskList.insertBefore(li, taskList.childNodes[checkOrder(task)]);
    } else {
      taskList.appendChild(li);
    }

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
      addTaskToList(task, true);
      clearAddedTask();
    }
  }
  document.querySelector('#button-add-task').addEventListener('click', addTask);

  function checkTheKey(e) {
    if (e.key === 'Enter') {
      addTask();
    }
  }
  document.querySelector('#task').addEventListener('keydown', checkTheKey);

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
    taskList.addEventListener(
      'click',
      (ev) => {
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
      },
      false
    );
  }
  addEventListenerForTasks();

  class ClicksCounter {
    constructor() {
      this.counter = 0;
    }

    get clicks() {
      return this.counter;
    }

    increaseTheCounter() {
      this.counter = this.counter + 1;
    }

    resetCounter() {
      this.counter = 0;
    }

    autoResetCounter() {
      setTimeout(() => {
        this.resetCounter();
      }, 1000);
    }
  }
  const cCForRemoveAll = new ClicksCounter();
  const cCForRemoveDone = new ClicksCounter();
  const cCForDelete = new ClicksCounter();

  $(() => {
    $('[data-toggle="popover"]').popover();
  });

  function hidePopovers(time = 60) {
    setTimeout(() => {
      $('[data-toggle="popover"]').popover('hide');
    }, time);
  }

  $('[data-toggle="popover"]').on('shown.bs.popover', () => {
    hidePopovers(1500);
  });

  function closeMenuSettings() {
    document.querySelector('button').click();
  }

  function removeAllTasks(clicks = 0) {
    cCForRemoveAll.increaseTheCounter();
    cCForRemoveAll.autoResetCounter();
    if (cCForRemoveAll.clicks === 2 || clicks === 2) {
      document.querySelectorAll('#tasks-list li').forEach((li) => {
        removeTaskFromList(li);
      });
      closeMenuSettings();
      hidePopovers();
    }
  }
  document.querySelector('#remove-all').addEventListener('click', removeAllTasks);

  function removeDoneTasks() {
    cCForRemoveDone.increaseTheCounter();
    cCForRemoveDone.autoResetCounter();
    if (cCForRemoveDone.clicks === 2) {
      document.querySelectorAll('#tasks-list li').forEach((li) => {
        if (li.firstElementChild.classList.value === 'checked') {
          removeTaskFromList(li);
        }
      });
      closeMenuSettings();
      hidePopovers();
    }
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
    document.querySelector('#info-for-user').innerText = err;
    $('#info-bar').modal('show');
    setTimeout(() => {
      $('#info-bar').modal('hide');
    }, 3500);
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
    li.setAttribute('tabindex', '0');
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
    createTaskList.classList.add('py-2');
    changeTitle.setAttribute('id', 'change-title');
    changeTitle.setAttribute('data-toggle', 'modal');
    changeTitle.setAttribute('data-target', '#change-task-list-title');
    changeTitle.classList.add('py-2');

    taskList.append(div);
    taskList.append(changeTitle);
    taskList.append(createTaskList);
  }
  function updateShowTaskListTitles() {
    document.querySelectorAll('.dropdown-menu li').forEach((li) => {
      li.remove();
    });
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
      removeAllTasks(2);
      saveTaskList();
      updateShowTaskListTitles();
    }
  }
  document.querySelector('#create-new-task-list-bttn').addEventListener('click', createNewTaskList);

  function removeTaskListFromLocalStorage(taskListTitle) {
    localStorage.removeItem(taskListTitle);
    localStorage.removeItem(`${taskListTitle}-sorted`);
  }

  function getLastAddedTask() {
    const tasks = document.querySelectorAll('li');
    const task = tasks[tasks.length - 1];
    return task;
  }

  async function updateTasksFromLocalStorage() {
    let savedTasks = await retrieveTasksFromLocalStorage();
    if (retrieveSortOptionFromLocalStorage()) {
      savedTasks = sortAlphabetically(savedTasks);
    }

    for (let i = 0; i < savedTasks.length; i += 1) {
      addTaskToList(savedTasks[i].task);
      if (savedTasks[i].taskIsDone === true) {
        getLastAddedTask().click();
      }
    }
    setTimeout(() => {
      setProgress(); // for empty tasks list
    }, 100);
  }
  function addExampleTasks() {
    const exampleTasks = ['task 1', 'task 2', 'task 3'];
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

  document.querySelector('#sortAlphabetically').addEventListener('change', () => {
    if (sortIsOn) {
      clearTaskList();
      updateTasksFromLocalStorage();
    }
    saveSortOption();
  });

  function setCurrentTaskListTite(title) {
    localStorage.setItem('current-task-list', JSON.stringify(title));
  }
  function setSortOption() {
    const sortStatus = retrieveSortOptionFromLocalStorage();
    if (sortStatus === null) {
      saveSortOption();
    }
    console.log(sortStatus);
    document.querySelector('#sortAlphabetically').checked = sortStatus;
  }
  function taskListIsOpen() {
    if (localStorage['current-task-list']) {
      setTitleFromLocalStorage();
      updateTasksFromLocalStorage();
      setSortOption();
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
    taskListsTitles.addEventListener(
      'click',
      (ev) => {
        if (
          ev.target.tagName === 'LI'
          && ev.target.innerText !== 'Create new Task List'
          && ev.target.innerText !== 'Change task list title'
        ) {
          switchBetweenTaskLists(ev.target.innerText);
        }
      },
      false
    );
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
    cCForDelete.increaseTheCounter();
    cCForDelete.autoResetCounter();
    if (cCForDelete.clicks === 2) {
      cCForDelete.resetCounter();
      const currentTaskList = getTaskListTitle();
      removeTaskListFromLocalStorage(currentTaskList);
      removeTaskListTitleFromLocalStorage(currentTaskList);
      changeCurrentTaskList();
      updateShowTaskListTitles();
      closeMenuSettings();
      hidePopovers();
    }
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
      saveSortOption();
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
      showError("Error: The browser doesn't support the FileReader Object!");
    }
  }
  loadTasksFromFile();

  function saveTaskListToFile() {
    const a = document.createElement('a');
    const blob = new Blob(
      [localStorage.getItem('current-task-list'), localStorage.getItem(getTaskListTitle())],
      { type: 'text/plain' }
    );
    a.href = URL.createObjectURL(blob);
    a.download = `${getTaskListTitle()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    closeMenuSettings();
  }
  document.querySelector('#save-tasks').addEventListener('click', saveTaskListToFile);

  function keyboardNavTaskList(e) {
    switch (e.keyCode) {
      case 13:
        e.target.click();
        break;
      case 32:
        e.target.click();
        break;
      case 37:
        if (e.target.parentElement.tagName === 'LI') {
          e.target.parentElement.focus();
        }
        break;
      case 38:
        if (e.target.previousElementSibling !== null) {
          e.target.previousElementSibling.focus();
        }
        if (
          e.target.parentElement.previousElementSibling !== null
          && e.target.parentElement.previousElementSibling.tagName === 'LI'
        ) {
          e.target.parentElement.previousElementSibling.lastChild.focus();
        }
        break;
      case 39:
        if (e.target.lastChild.tagName === 'BUTTON') {
          e.target.lastChild.focus();
        }
        break;
      case 40:
        if (e.target.nextElementSibling !== null) {
          e.target.nextElementSibling.focus();
        }
        if (
          e.target.parentElement.nextElementSibling !== null
          && e.target.parentElement.nextElementSibling.tagName === 'LI'
        ) {
          e.target.parentElement.nextElementSibling.lastChild.focus();
        }
        break;

      default:
    }
  }
  document.querySelector('#tasks-list').addEventListener('keydown', keyboardNavTaskList);

  function keyboardNavMenu(e) {
    switch (e.keyCode) {
      case 13:
        e.target.click();
        break;
      case 32:
        e.target.click();
        break;
      case 38:
        if (e.target.previousElementSibling !== null) {
          e.target.previousElementSibling.focus();
        }
        if (
          e.target.previousElementSibling !== null
          && e.target.previousElementSibling.tagName === 'DIV'
        ) {
          e.target.previousElementSibling.previousElementSibling.focus();
        }
        break;
      case 40:
        if (e.target.nextElementSibling !== null) {
          e.target.nextElementSibling.focus();
        }
        if (e.target.nextElementSibling !== null && e.target.nextElementSibling.tagName === 'DIV') {
          e.target.nextElementSibling.nextElementSibling.focus();
        }
        break;

      default:
    }
  }
  document.querySelector('nav ul').addEventListener('keydown', keyboardNavMenu);

  function keyboardSupportForRenameTaskList(e) {
    if (e.keyCode === 13) {
      document.querySelector('#bttn-change-title').click();
    }
  }
  document
    .querySelector('#changed-title')
    .addEventListener('keydown', keyboardSupportForRenameTaskList);

  function keyboardSupportForCreateNewTaskList(e) {
    if (e.keyCode === 13) {
      document.querySelector('#create-new-task-list-bttn').click();
    }
  }
  document
    .querySelector('#new-title')
    .addEventListener('keydown', keyboardSupportForCreateNewTaskList);

  document.body.addEventListener('mousedown', () => {
    document.body.classList.add('using-mouse');
  });

  document.body.addEventListener('keydown', () => {
    document.body.classList.remove('using-mouse');
  });
}());
