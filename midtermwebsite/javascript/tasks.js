$(document).ready(function () {
    const taskForm = $('#task-form');
    const taskList = $('#task-list tbody');

    // Load tasks from localStorage on page load
    loadTasks();

    // Form submission event to add a new task
    taskForm.on('submit', function (e) {
        e.preventDefault();
        addTask();
    });

    // Function to add a task
    function addTask() {
        const taskName = $('#task-name').val().trim();
        const taskDesc = $('#task-desc').val().trim();
        const taskDate = $('#task-date').val();

        if (taskName && taskDesc && taskDate) {
            const task = { name: taskName, desc: taskDesc, date: taskDate, completed: false };
            saveTask(task);
            renderTask(task);
            taskForm[0].reset(); // Clear form fields
        }
    }

    // Save a task to localStorage
    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(renderTask);
    }

    // Render a task to the table
    function renderTask(task) {
        const taskRow = $(`
            <tr>
                <td>${task.name}</td>
                <td>${task.desc}</td>
                <td>${task.date}</td>
                <td>
                    <span class="status">${task.completed ? 'Completed' : 'Pending'}</span>
                </td>
                <td>
                    <button class="btn btn-success btn-sm complete-task">Complete</button>
                    <button class="btn btn-danger btn-sm delete-task">Delete</button>
                </td>
            </tr>
        `);

        // Mark task as completed
        taskRow.find('.complete-task').on('click', function () {
            task.completed = !task.completed;
            taskRow.find('.status').text(task.completed ? 'Completed' : 'Pending');
            updateTasks();
        });

        // Delete task
        taskRow.find('.delete-task').on('click', function () {
            taskRow.remove();
            deleteTask(task);
        });

        taskList.append(taskRow);
    }

    // Update tasks in localStorage
    function updateTasks() {
        const updatedTasks = [];
        taskList.find('tr').each(function () {
            const $row = $(this);
            const task = {
                name: $row.find('td').eq(0).text(),
                desc: $row.find('td').eq(1).text(),
                date: $row.find('td').eq(2).text(),
                completed: $row.find('.status').text() === 'Completed'
            };
            updatedTasks.push(task);
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    // Delete a task from localStorage
    function deleteTask(taskToDelete) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => !(task.name === taskToDelete.name && task.date === taskToDelete.date));
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
});
