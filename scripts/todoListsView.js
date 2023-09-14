class TodoListsView {
    addForm = document.querySelector('.add-form');
    addFormText = document.querySelector('.add-form-text');
    addFormDate = document.querySelector('.add-form-date');
    addFormPriority = document.querySelector('.add-form-priority');

    constructor(listModel) {
        this.listModel = listModel;
        this.highPriorityList = new TodoListView('high', this.listModel);
        this.mediumPriorityList = new TodoListView('medium', this.listModel);
        this.lowPriorityList = new TodoListView('low', this.listModel);
    }

    renderByPriority(priority) {
        const lists = {
            'high': this.highPriorityList,
            'medium': this.mediumPriorityList,
            'low': this.lowPriorityList
        };
    
        const list = lists[priority];
        if (list) {
            list.renderList();
        }
    }

    initSubmit() {
        this.addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            const text = data.get('text').trim();
            const date = data.get('date');
            const priority = data.get('priority');
            const isUnique = this.listModel.checkUnique(text);


            if (!text || !isUnique) {
                this.toggleIncompleteClass(this.addFormText, true);
            }

            if (!date || date < this.listModel.currentDate) {
                this.toggleIncompleteClass(this.addFormDate, true);
            }

            if (!priority) {
                this.toggleIncompleteClass(this.addFormPriority, true);
            }

            if (text
                && isUnique
                && priority
                && date >= this.listModel.currentDate) {
                this.toggleIncompleteClass(this.addFormText, false);
                this.toggleIncompleteClass(this.addFormDate, false);
                this.toggleIncompleteClass(this.addFormPriority, false);

                this.listModel.addTask(text, date, priority);
                this.listModel.storage.setToLocalStorage('todos', JSON.stringify(this.listModel.tasks)); 
                this.renderByPriority(priority);
                e.target.reset();
            }
        });
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

    init() {
        const ref = this.listModel.storage.getFromLocalStorage('todos');

        if (ref) {
            const savedTasks = JSON.parse(ref);
            this.listModel.tasks = savedTasks.map(taskData => {
                return new TodoModel(taskData.text, taskData.date, taskData.priority, taskData.uuid, taskData.state);
            });

            this.highPriorityList.renderList();
            this.mediumPriorityList.renderList();
            this.lowPriorityList.renderList();
        }

        this.initSubmit();
        this.highPriorityList.init();
        this.mediumPriorityList.init();
        this.lowPriorityList.init();
    }

}