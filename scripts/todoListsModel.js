class TodoListsModel {
    constructor() {
        this.tasks = [];
    }

    addTask(text, date, priority) {
            const newTask = new TodoModel(text, date, priority);
            this.tasks.push(newTask);
    }

    removeTodo(id) {
        this.tasks = this.tasks.filter(({uuid}) => uuid !== Number(id));
    }

    toggleTodo(id) {
        const index = this.findTodoIndex(id);
        this.tasks[index].toggle();
    }

    editTodo(id, textNew, dateNew) {
        const editIndex = this.findTodoIndex(id);

        if (editIndex === -1) return;

        const tasksWithoutEdited = this.filterTodos('id', Number(id));
        const isUnique = this.checkUnique(textNew, tasksWithoutEdited);
        const isDateValid = dateNew >= this.currentDate;

        if (textNew && isUnique && isDateValid) {
            this.tasks[editIndex].edit(textNew, dateNew);
        }
    }

    findTodoIndex(id) {
        return this.tasks.findIndex(item => item.uuid === Number(id));
    }

    checkUnique(text, tasks = this.tasks) {
        return !tasks.find(item => item.text === text);
    }

    filterTodos(filter, filterValue) {
        return this.tasks.filter(task => task[filter] === filterValue);

    }

    get priorityLists() {
        return {
            high: this.filterTodos('priority', 'high'),
            medium: this.filterTodos('priority', 'medium'),
            low: this.filterTodos('priority', 'low'),
        }
    }

    get currentDate() {
        const date = new Date;
        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

    }
}

