class TodoModel {
    uuid = Date.now();
    state = false;

    constructor(text, date, priority) {
        this.text = text;
        this.date = date;
        this.priority = priority;
    }

    edit(textNew, dateNew) {
        this.text = textNew;
        this.date = dateNew;
    }

    toggle() {
        this.state = !this.state;
    }
}

