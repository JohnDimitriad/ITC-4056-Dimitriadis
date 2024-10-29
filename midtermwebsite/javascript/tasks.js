$(document).ready(function () {
    const tasksKey = 'tasks';
    const addButton = $('#task-form button[type="submit"]'); // Reference the submit button

    // Fetch tasks from localStorage or initialize an empty array
    function getTasks() {
        return JSON.parse(localStorage.getItem(tasksKey)) || [];
    }

    // Save tasks to localStorage
    function saveTasks(tasks) {
        localStorage.setItem(tasksKey, JSON.stringify(tasks));
    }

    // Add or edit task
    $('#task-form').on('submit', function (e) {
        e.preventDefault();

        const newTask = {
            name: $('#task-name').val(),
            desc: $('#task-desc').val(),
            date: $('#task-date').val(),
            completed: false
        };

        let tasks = getTasks();
        const editIndex = $('#task-form').data('editIndex');

        if (editIndex !== undefined) {
            // Edit existing task
            tasks[editIndex] = newTask;
            $('#task-form').removeData('editIndex'); // Clear edit mode
            resetAddButton(); // Reset button after editing
        } else {
            // Add new task
            tasks.push(newTask);
        }

        saveTasks(tasks);
        renderTaskList(tasks);
        this.reset();
    });

    // Render the full task list (this is for the tasks page)
    function renderTaskList(tasks) {
        const taskList = $('#task-list tbody');
        taskList.empty();

        // Get filter and sort values
        const filterValue = $('#filter-status').val();
        const sortValue = $('#sort-tasks').val();

        // Filter tasks by status
        let filteredTasks = tasks.filter(task => {
            if (filterValue === 'completed') return task.completed;
            if (filterValue === 'pending') return !task.completed;
            return true; // show all tasks
        });

        // Sort tasks by name or due date
        filteredTasks = filteredTasks.sort((a, b) => {
            if (sortValue === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortValue === 'date') {
                return new Date(a.date) - new Date(b.date);
            }
            return 0;
        });

        filteredTasks.forEach((task, index) => {
            const taskRow = $(`
                <tr>
                    <td>${task.name}</td>
                    <td>${task.desc}</td>
                    <td>${task.date}</td>
                    <td>${task.completed ? 'Completed' : 'Pending'}</td>
                    <td>
                        <button class="btn btn-success complete-task" data-index="${index}">Mark Complete</button>
                        <button class="btn btn-warning edit-task" data-index="${index}">Edit</button>
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

    // Mark task as complete
    $(document).on('click', '.complete-task', function () {
        const index = $(this).data('index');
        const tasks = getTasks();
        tasks[index].completed = true;
        saveTasks(tasks);
        renderTaskList(tasks);
    });

    // Delete task
    $(document).on('click', '.delete-task', function () {
        const index = $(this).data('index');
        const tasks = getTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTaskList(tasks);
    });

    // Edit task
    $(document).on('click', '.edit-task', function () {
        const index = $(this).data('index');
        const tasks = getTasks();
        const task = tasks[index];

        $('#task-name').val(task.name);
        $('#task-desc').val(task.desc);
        $('#task-date').val(task.date);
        $('#task-form').data('editIndex', index); // Set edit mode with index

        setEditButtonStyle(); // Change button to edit mode
    });

    // Filter tasks by status
    $('#filter-status').on('change', function () {
        renderTaskList(getTasks());
    });

    // Sort tasks by name or due date
    $('#sort-tasks').on('change', function () {
        renderTaskList(getTasks());
    });

    // Change button to indicate edit mode
    function setEditButtonStyle() {
        addButton.removeClass('btn-primary').addClass('btn-warning');
        addButton.text('Change Task');
    }

    // Reset button after editing
    function resetAddButton() {
        addButton.removeClass('btn-warning').addClass('btn-primary');
        addButton.text('Add Task');
    }

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

        // If there are no tasks, display a message saying so
        if (recentTasks.length === 0) {
            activityList.append('<li>No recent tasks available.</li>');
        }
    }

    // Check if on index page and load recent tasks
    if ($('#activityList').length) {
        loadRecentTasks();
    }
});
