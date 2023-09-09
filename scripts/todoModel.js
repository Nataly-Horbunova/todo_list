class TodoModel {
    constructor(text, date, priority, uuid, state = false) {
        this.text = text;
        this.date = date;
        this.priority = priority;
        this.uuid = uuid;
        this.state = state;
    }

    edit(textNew, dateNew) {
        this.text = textNew;
        this.date = dateNew;
    }

    toggle() {
        this.state = !this.state;
    }
}