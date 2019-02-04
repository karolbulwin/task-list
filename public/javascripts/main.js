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
  function addTaskToList(task) {
    const taskList = document.querySelector('ul');
    const li = createHtmlElement(task);
    taskList.append(li);
    setTimeout(() => {
      li.classList.remove('new-task');
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
  function checkProgress() {
    const tasks = document.querySelectorAll('li').length;
    const tasksDone = document.querySelectorAll('li.checked-bg');
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
    const tasks = document.querySelectorAll('li');
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
  function addTask() {
    const { isTask, task } = checkTask();
    if (isTask === true) {
      addTaskToList(task);
      clearAddedTask();
      setProgress();
      saveTaskList();
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
  const taskList = document.querySelector('ul');
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

  function removeExamplesTasks() {
    document.querySelectorAll('li').forEach((li) => {
      li.remove();
    });
  }
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
  function taskListIsOpen() {
    removeExamplesTasks();
    updateTaksFromLocalStorage();
  }
  taskListIsOpen();
  // window.visualViewport.height
}());
