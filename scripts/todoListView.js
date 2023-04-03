class TodoListView {
    constructor(priority, listModel) {
        this.listModel = listModel;
        this.priority = priority;
        this.tag = document.querySelector(`.${priority}-priority-wrapper`);
        this.listTitleText = `${priority.charAt(0).toUpperCase() + priority.slice(1)} priority`;
    }

    renderList() {
        this.tag.innerHTML = '';

        const priorityLists = this.listModel.priorityLists;
        const tasks = priorityLists[this.priority];

        if (!tasks.length) return;

        const fragment = new DocumentFragment;
        const wrapper = this.createElem('div', fragment, ['priority-list', `${this.priority}-priority`]);
        this.createElem('h2', wrapper, ['priority-list-title'], '', this.listTitleText);
        const ul = this.createElem('ul', wrapper, ['todo-list']);

        tasks.forEach(todo => {
            const li = this.createElem('li', ul, ['todo-list-item'], [{type: 'data-id', value: todo.uuid}]);
            const checkbox = this.createElem('input', li, ['todo-state'], [{type: 'type', value: 'checkbox'}]);
            const task = this.createElem('div', li, ['list-item-info']);
            this.createElem('p', task, ['todo-text'], '', todo.text);
            this.createElem('p', task, ['todo-date'], '', todo.date);
            li.insertAdjacentHTML('beforeend', `<button class="todo-edit-btn"><i class="fa-solid fa-pen"></i></button>`)
            li.insertAdjacentHTML('beforeend', `<button class="todo-remove-btn"><i class="fa-solid fa-trash"></i></button>`);

            if (todo.state) {
                li.classList.add('completed');
                checkbox.setAttribute('checked', '');
            }
        });

        const filters = this.createElem('div', wrapper, ['filters']);
        this.createElem('button', filters, ['btn', 'completed-filter'], '', 'Completed');
        this.createElem('button', filters, ['btn', 'active-filter'], '', 'Active');
        this.createElem('button', filters, ['btn', 'all-filter'], '', 'All');

        this.tag.append(fragment);
    }

    initRemove() {
        this.tag.addEventListener('click', ({target}) => {
            if (!target.classList.contains('fa-trash')) return;

            const deleteItem = target.closest('[data-id]');
            const id = deleteItem.getAttribute('data-id');

            if (id) {
                this.listModel.removeTodo(id);
                this.renderList();
            }

        })
    }

    initToggle() {
        this.tag.addEventListener('change', ({target}) => {
            if (!target.classList.contains('todo-state')) return;

            const toggleItem = target.closest('[data-id]');
            const id = toggleItem.getAttribute('data-id');

            if (id) {
                this.listModel.toggleTodo(id);
                toggleItem.classList.toggle('completed');
            }
        });
    }

    initEdit() {
        this.tag.addEventListener('click', ({target}) => {

            if (!target.classList.contains('fa-pen')) return;
            target.style.display = 'none';

            const editItem = target.closest('[data-id]');
            const id = editItem.getAttribute('data-id');

            if (!id) return;

            const task = document.querySelector(`li[data-id="${id}"]`);
            const taskText = document.querySelector(`li[data-id="${id}"] .todo-text`);
            const taskTextInnerText = taskText.innerText;
            const taskDate = document.querySelector(`li[data-id="${id}"] .todo-date`);
            const taskDateInnerText = taskDate.innerText;
            const taskState = document.querySelector(`li[data-id="${id}"] .todo-state`);
            const taskInfo = document.querySelector(`li[data-id="${id}"] .list-item-info`);
            const taskEditBtn = document.querySelector(`li[data-id="${id}"] .todo-edit-btn`);
            const fragment = new DocumentFragment;

            const editForm = this.createElem('form', fragment, ['edit-form'], [{type: 'name', value: 'editForm'}]);
            const editText = this.createElem('input', editForm, ['edit-form-text'],
                [{type: 'type', value: 'text'}, {type: 'name', value: 'text'},
                    {type: 'value', value: `${taskTextInnerText}`}]);
            const editDate = this.createElem('input', editForm, ['edit-form-date'],
                [{type: 'type', value: 'date'}, {type: 'name', value: 'date'},
                    {type: 'value', value: `${taskDateInnerText}`}]);
            const editFormBtns = this.createElem('div', editForm, ['edit-btns']);
            this.createElem('button', editFormBtns, ['btn', 'save-btn'], '', 'Save');
            this.createElem('button', editFormBtns, ['btn', 'cancel-btn'], '', 'Cancel');

            taskInfo.setAttribute('hidden', '');
            taskState.setAttribute('hidden', '');
            taskEditBtn.setAttribute('hidden', '');

            document.querySelector('.todo-list-item:hover').style.transform = 'scale(1)';
            task.prepend(fragment);

            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const data = new FormData(e.target);
                const textNew = data.get('text').trim();
                const dateNew = data.get('date');
                const isUnique = this.listModel.checkUnique(textNew);

                if (!textNew || !isUnique && textNew !== taskText.innerText) {
                    this.toggleIncompleteClass(editText, true);
                }

                if (!dateNew || dateNew < this.listModel.currentDate) {
                    this.toggleIncompleteClass(editDate, true);
                }

                if (e.submitter.classList.contains('save-btn')
                    && textNew
                    && (isUnique || !isUnique && textNew === taskText.innerText)
                    && dateNew
                    && dateNew >= this.listModel.currentDate) {
                    this.toggleIncompleteClass(editText, false);
                    this.toggleIncompleteClass(editDate, false);

                        this.listModel.editTodo(id, textNew, dateNew);
                        this.renderList();
                } else if (e.submitter.classList.contains('cancel-btn') || (e.submitter.classList.contains('save-btn') && textNew === taskText.innerText)) {
                    this.renderList();
                }
            });
        })

    }

    toggleIncompleteClass(tag, flag) {
        const isIncomplete = tag.classList.contains('incomplete');
        if (flag && !isIncomplete) {
            tag.classList.add('incomplete');
        }
        if (!flag && isIncomplete) {
            tag.classList.remove('incomplete');
        }
    }

    showCompleted() {
    }

    showActive() {
    }

    showAll() {
    }

    createElem(tag, parent, classLists, attrs = null, text = null) {
        const el = document.createElement(tag);
        parent && parent.appendChild(el);

        if (classLists) {
            for (const classList of classLists) {
                el.classList.add(classList);
            }
        }

        if (attrs) {
            for (const attr of attrs) {
                el.setAttribute(attr.type, attr.value);
            }
        }

        if (text) {
            el.innerText = text;
        }

        return el;
    }

    init() {
        this.initToggle();
        this.initRemove();
        this.initEdit();
        // renderList();
    }
}