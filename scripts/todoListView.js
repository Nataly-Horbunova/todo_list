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
            li.insertAdjacentHTML('beforeend', `<button class="todo-remove-btn">
            <i class="fa-solid fa-trash"></i></button>`);

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
                const index = this.listModel.findTodoIndex(id);
                this.listModel.tasks[index].toggle();

                toggleItem.classList.toggle('completed');
            }
        });
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
        // renderList();
    }
}