import NewTask from './NewTask.js';
import ListItem from './List item.js';
import setLocalStorage from './local-storage.js';

export default class List {
  constructor() {
    this.ListObjects = localStorage.getItem('list') === null ? [] : JSON.parse(localStorage.getItem('list'));
  }

  addTask() {
    const addTaskInput = document.querySelector('.add-task');
    const listform = document.querySelector('.add__task');
    if (addTaskInput.value.trim().length === 0) return;
    this.ListObjects.push(new NewTask(addTaskInput.value, false));
    listform.reset();
    this.render();
    setLocalStorage(this.ListObjects);
    this.completedStausCheck();
  }

  selectTask(event, listLi, verticalDotsIcon, trashIcon) {
    if (event.target.classList.contains('list-description')) {
      listLi.classList.toggle('selected');
      trashIcon.classList.toggle('hidden');
      this.editTask(event.target);
    } else if (event.target.classList.contains('trash-icon')) {
      this.deleteTask(listLi, trashIcon);
    }
  }

  deleteTask(listLi, trashIcon) {
    listLi.remove();
    this.ListObjects.splice(trashIcon.id, 1);
    this.render();
    setLocalStorage(this.ListObjects);
    this.completedStausCheck();
  }

  editTask(editEventTarget) {
    editEventTarget.toggleAttribute('readonly');
    editEventTarget.addEventListener('keyup', () => {
      /* eslint-disable */
            for (const [i, item] of this.ListObjects.entries()) {
                if (parseInt(editEventTarget.parentElement.id) === i) {
                    item.description = editEventTarget.value;
                }
            }
            setLocalStorage(this.ListObjects);
        });
    }

    completedStausCheck() {
        const checkboxs = document.querySelectorAll('.checkbox');
        checkboxs.forEach((element, index) => {
            element.addEventListener('change', () => {
                /* eslint-disable */
                for (const listObject of this.ListObjects) {
                    if (element.checked) {
                        this.ListObjects[parseInt(element.id) - 1].completed = true;
                        element.parentElement.classList.add('line');
                    } else {
                        this.ListObjects[parseInt(element.id) - 1].completed = false;
                        element.parentElement.classList.remove('line');
                    }
                }
                setLocalStorage(this.ListObjects);
            });
        })
        this.checkboxsStatus(checkboxs);
        return checkboxs;
    }

    checkboxsStatus(checkboxs) {
        /* eslint-disable */
        for (const item of this.ListObjects) {
            if (item.completed === true) {
                checkboxs[item.index - 1].setAttribute('checked', '');
                checkboxs[item.index - 1].parentElement.classList.add('line');
            } else if (item.completed === false) {
                checkboxs[item.index - 1].removeAttribute('checked', '');
                checkboxs[item.index - 1].parentElement.classList.remove('line');
            }
        }
        this.clearCompletedTasks();
    }

    clearCompletedTasks() {
        const clearBtn = document.querySelector('.clear-btn');
        clearBtn.addEventListener('click', () => {
            this.ListObjects = this.ListObjects.filter((item) => {
                return item.completed === false;
            })
            setLocalStorage(this.ListObjects);
            this.render();
        })
    }

    deleteAllTasks() {
        const deleteAllBtn = document.querySelector('.refresh');
        deleteAllBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.ListObjects = [];
            setLocalStorage(this.ListObjects);
            this.render();
        })
    }

    render() {
        const listBody = document.querySelector('.tasks-body');
        listBody.innerHTML = '';
        /* eslint-disable */
        for (const [i, listObject] of this.ListObjects.entries()) {
            listObject.index = i + 1;
            const listItem = new ListItem(listObject);
            const listLi = listItem.render(i);
            listBody.appendChild(listLi);
            const verticalDotsIcon = listLi.querySelector('.vertical-dots-icon');
            const trashIcon = listLi.querySelector('.trash-icon');
            listLi.addEventListener('click', (event) => { this.selectTask(event, listLi, verticalDotsIcon, trashIcon) });
        }
    }
}