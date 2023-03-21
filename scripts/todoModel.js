class TodoModel {
    uuid = Date.now();
    state = false;

    constructor(text, date, priority) {
        this.text = text;
        this.date = date;
        this.priority = priority;
    }

    edit(text, date) {
        this.text = text;
        this.date = date;
    }

    toggle() {
        this.state = !this.state;
    }
}

