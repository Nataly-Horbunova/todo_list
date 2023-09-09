const clock = new RealTimeClock();
const todoList = new TodoListsView(new TodoListsModel(new Storage));

todoList.init();

