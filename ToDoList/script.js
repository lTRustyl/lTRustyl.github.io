class Task {
    constructor(title) {
        this.title = title;
        this.status = "todo";
        this.startDate = this._getCurrentFormattedDate();
        this.endDate = null;
    }

    complete() {
        this.status = "done";
        this.endDate = this._getCurrentFormattedDate();
    }

    _getCurrentFormattedDate() {
        const now = new Date();
        const pad = (num) => String(num).padStart(2, '0');
        
        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const day = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}

class TaskManager {
    constructor() {
        this.taskList = [];
        this.inputElement = document.getElementById("taskInput");
        this.addButton = document.getElementById("addBtn");
        this.listContainer = document.getElementById("taskListContainer");

        this.addButton.addEventListener("click", () => this.addNewTask());
        this.inputElement.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.addNewTask();
        });
    }

    addNewTask() {
        const title = this.inputElement.value.trim();
        if (title === "") return;

        const newTask = new Task(title);
        this.taskList.push(newTask);
        
        this.inputElement.value = "";
        this.render();
    }

    completeTask(index) {
        this.taskList[index].complete();
        this.render();
    }

    render() {
        this.listContainer.innerHTML = "";

        if (this.taskList.length === 0) {
            this.listContainer.innerHTML = `<div class="text-center text-muted py-3">Трюм порожній, капітане! Немає жодної справи.</div>`;
            return;
        }

        this.taskList.forEach((task, index) => {
            const item = document.createElement("div");
            item.className = "list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center py-3";
            
            const textSpan = document.createElement("span");
            textSpan.textContent = `⚓ ${task.title}`;

            const dateSpan = document.createElement("span");
            dateSpan.className = "task-date text-secondary ms-2 text-end";

            if (task.status === "done") {
                textSpan.className = "text-decoration-line-through text-muted";
                dateSpan.innerHTML = `Початок: ${task.startDate}<br>Виконано: ${task.endDate}`;
            } else {
                dateSpan.innerHTML = `Початок: ${task.startDate}`;
                item.addEventListener("click", () => this.completeTask(index));
            }

            item.appendChild(textSpan);
            item.appendChild(dateSpan);
            this.listContainer.appendChild(item);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TaskManager();
});