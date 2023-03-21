class TodoListsModel {
    constructor() {
        this.tasks = [];
    }

    addTask(text, date, priority) {
        const isUnique = this.checkUnique(text);
        if (isUnique) {
            const newTask = new TodoModel(text, date, priority);
            this.tasks.push(newTask);
        }
    }

    removeTodo(id) {
        this.tasks = this.tasks.filter(({uuid}) => uuid !== Number(id));
    }

    findTodoIndex(id) {
        return this.tasks.findIndex(item => item.uuid === Number(id));
    }

    checkUnique(text) {
        return !this.tasks.find(item => item.text === text);
    }

    filterByPriority(priority) {
        return this.tasks.filter(task => task.priority === priority);
    }

    get priorityLists() {
        return {
            high: this.filterByPriority('high'),
            medium: this.filterByPriority('medium'),
            low: this.filterByPriority('low')
        }
    }

    filterByState(state) {
        return this.tasks.filter(task => task.state === state);
    }

}
