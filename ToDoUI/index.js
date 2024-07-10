document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const submitButton = document.getElementById('submit');
    const taskContainer = document.getElementById('task-container');

    // Load tasks from the API when the page loads
    loadTasks();

    submitButton.addEventListener('click', addTask);

    function addTask() {
        const taskText = input.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        // Check if task already exists
        if (isTaskDuplicate(taskText)) {
            alert('This task already exists.');
            return;
        }

        // POST request to add a new task
        fetch('https://localhost:7035/api/ToDo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: taskText,
                isComplete: false // Assuming default is incomplete
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add task.');
            }
            return response.json();
        })
        .then(data => {
            const taskElement = createTaskElement(data.id, data.name); // Assuming 'id' and 'name' are returned by the API
            taskContainer.appendChild(taskElement);
            input.value = '';
        })
        .catch(error => {
            console.error('Error adding task:', error);
            alert('Failed to add task. Please try again.');
        });
    }

    function isTaskDuplicate(taskText) {
        const tasks = document.querySelectorAll('.task .content input');
        for (let task of tasks) {
            if (task.value.trim().toLowerCase() === taskText.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    function createTaskElement(taskId, taskText) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        const contentElement = document.createElement('div');
        contentElement.classList.add('content');

        const taskInputElement = document.createElement('input');
        taskInputElement.type = 'text';
        taskInputElement.value = taskText;
        taskInputElement.setAttribute('readonly', 'readonly');
        contentElement.appendChild(taskInputElement);

        const actionsElement = document.createElement('div');
        actionsElement.classList.add('action');

        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.innerText = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.innerText = 'Delete';

        actionsElement.appendChild(editButton);
        actionsElement.appendChild(deleteButton);

        taskElement.appendChild(contentElement);
        taskElement.appendChild(actionsElement);

        editButton.addEventListener('click', () => {
            if (editButton.innerText.toLowerCase() === 'edit') {
                taskInputElement.removeAttribute('readonly');
                taskInputElement.focus();
                editButton.innerText = 'Save';
            } else {
                taskInputElement.setAttribute('readonly', 'readonly');
                editButton.innerText = 'Edit';
                updateTask(taskId, taskInputElement.value); // Update task on save
            }
        });

        deleteButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(taskId, taskElement); // Delete task
            }
        });

        return taskElement;
    }

    function updateTask(taskId, newTaskText) {
        // PUT request to update an existing task
        fetch(`https://localhost:7035/api/ToDo/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: taskId,
                name: newTaskText,
                isComplete: false // Assuming default is incomplete
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Task updated successfully:', data);
            alert('Task updated successfully.');
        })
        .catch(error => {
            console.error('Error updating task:', error);
            alert('Failed to update task. Please try again.');
        });
    }

    function deleteTask(taskId, taskElement) {
        // DELETE request to delete a task
        fetch(`https://localhost:7035/api/ToDo/${taskId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task.');
            }
            taskContainer.removeChild(taskElement);
        })
        .catch(error => {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again.');
        });
    }

    function loadTasks() {
        // GET request to load tasks from the API
        fetch('https://localhost:7035/api/ToDo')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks.');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(task => {
                const taskElement = createTaskElement(task.id, task.name); // Assuming 'id' and 'name' are returned by the API
                taskContainer.appendChild(taskElement);
            });
        })
        .catch(error => {
            console.error('Error loading tasks:', error);
            alert('Failed to load tasks. Please refresh the page.');
        });
    }
});
