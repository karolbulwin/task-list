(function main() {
  function createHtmlElement(task) {
    const li = document.createElement('li');
    const bttn = document.createElement('button');
    const span = document.createElement('span');

    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    li.innerText = task;
    bttn.type = 'button';
    bttn.classList.add('close');
    bttn.setAttribute('aria-label', 'Close');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '&times;';

    bttn.append(span);
    li.append(bttn);

    return li;
  }
  function addTaskToList(task) {
    const taskList = document.querySelector('ul');
    const li = createHtmlElement(task);
    taskList.append(li);
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
    }
  }
  document.querySelector('#button-add-task').addEventListener('click', addTask);
  function checkTheKey(e) {
    if (e.key === 'Enter') {
      addTask();
    }
  }
  document.addEventListener('keydown', checkTheKey);
}());
