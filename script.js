$(document).ready(function () {

    let tasks = [];

    $("#addTask").click(function () {

        let topic = $("#taskTopic").val();
        let name = $("#taskName").val();

        if (topic === "" || name === "") {
            alert("Enter topic and task");
            return;
        }

        $("#displayTopic").text("📌 " + topic);

        tasks.push({ name: name, status: "" });

        renderTasks();
        $("#taskName").val("").focus();
    });

    function renderTasks() {

        $("#taskList").empty();

        let date = $("#customDate").val() || $("#taskDate").val();

        tasks.forEach(function (task, index) {

            let className = "";

            if (task.status === "Done") className = "done";
            if (task.status === "Not Done") className = "notdone";
            if (task.status === "Cancel") className = "cancel";

            let statusText = task.status
                ? "Status: " + task.status
                : "<span class='notselected'>Status: ⚪ Not Selected</span>";

            let html = `
            <div class="task ${className}">
                <b>${index + 1}. <i>${task.name}</i></b><br>
                📅 ${date}<br>
                ${statusText}<br><br>

                <button onclick="markDone(${index})">Done</button>
                <button onclick="markNotDone(${index})">Not Done</button>
                <button onclick="markCancel(${index})">Cancel</button>
            </div>
            `;

            $("#taskList").append(html);
        });
    }

    window.markDone = i => { tasks[i].status = "Done"; renderTasks(); };
    window.markNotDone = i => { tasks[i].status = "Not Done"; renderTasks(); };
    window.markCancel = i => { tasks[i].status = "Cancel"; renderTasks(); };

    $("#evaluateBtn").click(function () {

        let total = tasks.length;
        let done = tasks.filter(t => t.status === "Done").length;
        let percent = total === 0 ? 0 : Math.round((done / total) * 100);

        $("#progress").text(percent + "%");

        let msg = "🚀 Start working!";
        if (percent < 50) msg = "💪 Keep going!";
        else if (percent < 100) msg = "🎉 Well done!";
        else msg = "😎 Excellent!";

        $("#feedback").text(msg);

        // SAVE HISTORY
        let history = JSON.parse(localStorage.getItem("taskHistory")) || [];

        history.push({
            date: new Date().toLocaleString(),
            tasks: tasks,
            percentage: percent
        });

        localStorage.setItem("taskHistory", JSON.stringify(history));
    });

    // ENTER NAVIGATION
    $("#taskTopic").keypress(e => { if (e.which === 13) $("#taskName").focus(); });
    $("#taskName").keypress(e => { if (e.which === 13) $("#addTask").focus(); });
    $("#addTask").keypress(e => { if (e.which === 13) $("#addTask").click(); });

});