$(document).ready(function () {
    const tasksKey = 'tasks';

    // Fetch tasks from localStorage or initialize empty array
    function getTasks() {
        return JSON.parse(localStorage.getItem(tasksKey)) || [];
    }

    // Save tasks to localStorage
    function saveTasks(tasks) {
        localStorage.setItem(tasksKey, JSON.stringify(tasks));
    }

    // Add new task
    $('#task-form').on('submit', function (e) {
        e.preventDefault();

        const newTask = {
            name: $('#task-name').val(),
            desc: $('#task-desc').val(),
            date: $('#task-date').val(),
            completed: false
        };

        const tasks = getTasks();
        tasks.push(newTask);
        saveTasks(tasks);
        renderTaskList(tasks);
        this.reset();
    });

    // Render the full task list (on the tasks page)
    function renderTaskList(tasks) {
        const taskList = $('#task-list tbody');
        taskList.empty();

        tasks.forEach((task, index) => {
            const taskRow = $(`
                <tr>
                    <td>${task.name}</td>
                    <td>${task.desc}</td>
                    <td>${task.date}</td>
                    <td>${task.completed ? 'Completed' : 'Pending'}</td>
                    <td>
                        <button class="btn btn-success complete-task" data-index="${index}">Mark Complete</button>
                        <button class="btn btn-danger delete-task" data-index="${index}">Delete</button>
                    </td>
                </tr>
            `);
            taskList.append(taskRow);
        });
    }

    // Load tasks and display on the tasks page
    if ($('#task-list').length) {
        renderTaskList(getTasks());
    }

    // Event handler for marking tasks as complete
    $(document).on('click', '.complete-task', function () {
        const index = $(this).data('index');
        const tasks = getTasks();
        tasks[index].completed = true;
        saveTasks(tasks);
        renderTaskList(tasks);
    });

    // Event handler for deleting tasks
    $(document).on('click', '.delete-task', function () {
        const index = $(this).data('index');
        const tasks = getTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTaskList(tasks);
    });

    // Display recent tasks on the index page
    function loadRecentTasks() {
        const tasks = getTasks();
        const activityList = $('#activityList');

        // Clear current list in case of re-render
        activityList.empty();

        // Limit display to 5 most recent tasks
        const recentTasks = tasks.slice(-5);

        // Append each task to the activity list
        recentTasks.forEach((task) => {
            const taskItem = $(`
                <li>
                    <strong>${task.name}</strong> - ${task.desc} <br>
                    <small>Due Date: ${task.date}</small> 
                    <span class="status">(${task.completed ? 'Completed' : 'Pending'})</span>
                </li>
            `);
            activityList.append(taskItem);
        });

        // If there are no tasks, display a placeholder message
        if (recentTasks.length === 0) {
            activityList.append('<li>No recent tasks available.</li>');
        }
    }

    // Check if on index page and load recent tasks
    if ($('#activityList').length) {
        loadRecentTasks();
    }
});
