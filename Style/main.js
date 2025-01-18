// 태그 데이터 구조
const tags = {
    work: { tasks: [] },
    personal: { tasks: [] },
};

// 태그 추가 버튼 클릭 이벤트
document.getElementById("add-tag-button").addEventListener("click", function () {
    const tagName = prompt("새로운 태그 이름을 입력하세요:");
    if (tagName && tagName.trim() !== "") {
        addTag(tagName.trim());
    }
});

// 태그 추가 함수
function addTag(tagName) {
    if (tags[tagName]) {
        alert("이미 존재하는 태그입니다.");
        return;
    }

    // 태그 데이터 생성
    tags[tagName] = { tasks: [] };

    // 태그 목록에 추가
    const tagList = document.querySelector(".sidebar-menu");
    const newTagItem = document.createElement("li");
    newTagItem.textContent = tagName;

    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-bar-container";

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.style.width = "0%";

    progressContainer.appendChild(progressBar);
    newTagItem.appendChild(progressContainer);

    tagList.appendChild(newTagItem);

    // 태그 선택 옵션 추가
    const tagSelect = document.getElementById("task-tag");
    const newOption = document.createElement("option");
    newOption.value = tagName;
    newOption.textContent = tagName;
    tagSelect.appendChild(newOption);
}

// 태스크 추가 이벤트 처리
document.getElementById("add-task-form").addEventListener("submit", function (e) {
    e.preventDefault(); // 기본 폼 제출 방지

    const title = document.getElementById("task-title").value;
    const deadline = document.getElementById("task-deadline").value;
    const tag = document.getElementById("task-tag").value;
    const priority = document.getElementById("task-priority").value;

    if (!tags[tag]) {
        alert("존재하지 않는 태그입니다.");
        return;
    }

    // 태스크 추가
    addTask(tag, title, deadline, priority);

    // 폼 초기화
    this.reset();
});

// 태스크 추가 함수
function addTask(tagName, taskTitle, taskDate, taskPriority) {
    tags[tagName].tasks.push({ title: taskTitle, date: taskDate, priority: taskPriority, completed: false });

    const taskList = document.getElementById("todo-list");

    const taskRow = document.createElement("tr");

    taskRow.innerHTML = `
        <td><input type="checkbox" class="todo-checkbox"></td>
        <td>${tagName}</td>
        <td>${taskTitle}</td>
        <td>${taskDate}</td>
        <td>${taskPriority}</td>
        <td><button class="delete-button">삭제</button></td>
    `;

    taskRow.querySelector(".delete-button").addEventListener("click", function () {
        taskRow.remove();
        removeTask(tagName, taskTitle);
    });

    taskRow.querySelector(".todo-checkbox").addEventListener("change", function (e) {
        updateTaskStatus(tagName, taskTitle, e.target.checked);
    });

    taskList.appendChild(taskRow);

    updateProgressBar(tagName);
}

// 태스크 삭제 함수
function removeTask(tagName, taskTitle) {
    const taskIndex = tags[tagName].tasks.findIndex(task => task.title === taskTitle);
    if (taskIndex > -1) {
        tags[tagName].tasks.splice(taskIndex, 1);
    }
    updateProgressBar(tagName);
}

// 태스크 상태 업데이트 함수
function updateTaskStatus(tagName, taskTitle, completed) {
    const task = tags[tagName].tasks.find(task => task.title === taskTitle);
    if (task) {
        task.completed = completed;
    }
    updateProgressBar(tagName);
}

// 진행도 업데이트 함수
function updateProgressBar(tagName) {
    const tagData = tags[tagName];
    const totalTasks = tagData.tasks.length;
    const completedTasks = tagData.tasks.filter(task => task.completed).length;

    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const sidebarItems = document.querySelectorAll(".sidebar-menu li");
    sidebarItems.forEach(item => {
        if (item.textContent.includes(tagName)) {
            const progressBar = item.querySelector(".progress-bar");
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }
    });
}
