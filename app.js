const resetFields = () => {
  inputTask.value = "";
  inputID.value = "";

  btnSave.removeAttribute("disabled");
  btnSaveEdit.setAttribute("disabled", true);
};

const saveData = (data) => {
  localStorage.setItem("todo-app", JSON.stringify(data));
  loadData();
  resetFields();
};

const editTask = (id) => {
  let findTask = data.tasks.find((task) => task.id_task === id);
  inputTask.value = findTask.name;
  inputID.value = findTask.id_task;
  btnSave.setAttribute("disabled", true);
  btnSaveEdit.removeAttribute("disabled");
};

const deleteTask = (id) => {
  data.tasks = data.tasks.filter((task) => task.id_task !== id);
  saveData(data);
};

const markedTask = (id_task, bool) => {
  data.tasks = data.tasks.map((task) => {
    if (task.id_task === id_task) {
      task.completed = bool;
    }
    return task;
  });
  saveData(data);
};

const printData = (data) => {
  let { tasks } = data;
  let { length } = tasks;
  tasksContainer.innerHTML = "";

  if (length > 0) {
    emptyTasksContainer.classList.add("hide");
    for (const task of tasks) {
      tasksContainer.innerHTML += `
      <div class="task">
        <input type="checkbox" class="input-check" onchange="markedTask(${
          task.id_task
        },this.checked)" ${task.completed ? "checked" : ""} />
        <span>${task.name}</span>
        <div class="buttons">
            <button class="btn btn-edit" id="btn-edit" onclick="editTask(${
              task.id_task
            })">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-delete" id="btn-delete" onclick="deleteTask(${
              task.id_task
            })">
                <i class="fas fa-trash"></i>
            </button>
        </div>
      </div>`;
    }
  } else {
    emptyTasksContainer.classList.remove("hide");
  }
};

const loadData = () => {
  data = localStorage.getItem("todo-app");
  if (data) {
    data = JSON.parse(data);
    printData(data);
  } else {
    saveData({
      tasks: [],
    });
  }
};

const taskNotExist = (nameTask) => {
  nameTask = nameTask.replaceAll(" ", "").trim().toLowerCase();
  return (
    data.tasks.find((task) => {
      const thisNameTask = task.name.replaceAll(" ", "").trim().toLowerCase();
      if (thisNameTask === nameTask) {
        return task;
      }
    }) === undefined
  );
};

const filterTaskBy = (value) => {
  let auxData = { ...data };
  switch (value) {
    case "completed":
      auxData.tasks = auxData.tasks.filter((task) => task.completed);
      printData(auxData);
      break;

    case "noCompleted":
      auxData.tasks = auxData.tasks.filter((task) => !task.completed);
      printData(auxData);
      break;

    default:
      printData(data);
      break;
  }
};

const loadListeners = () => {
  btnSave.addEventListener("click", () => {
    let { value } = inputTask;
    if (value) {
      if (taskNotExist(value)) {
        data.tasks.push({
          id_task: new Date().getTime(),
          name: value,
          createdAt: new Date().getTime(),
          completed: false,
        });

        saveData(data);
      }
    } else {
      alert("Ingresa una tarea");
    }
  });

  btnSaveEdit.addEventListener("click", () => {
    let nameTask = inputTask.value;
    let idTask = Number(inputID.value);

    if (nameTask) {
      nameTask = nameTask.replaceAll(" ", "").trim().toLowerCase();
      const findTask = data.tasks.find((task) => {
        const nameCurrentTask = task.name
          .replaceAll(" ", "")
          .trim()
          .toLowerCase();

        if (nameCurrentTask === nameTask && task.id_task !== idTask) {
          return task;
        }
      });

      if (findTask) {
        alert(
          "No puedes agregar esta tarea, esta tarea ya existe. Por favor intenta con otra"
        );
      } else {
        data.tasks = data.tasks.map((task) => {
          if (task.id_task === idTask) {
            task.name = inputTask.value;
          }
          return task;
        });
        saveData(data);
      }
    } else {
      alert("Necesitas ingresar una tarea válida");
    }
  });

  filterTask.addEventListener("change", (e) => {
    let { value } = e.target;
    filterTaskBy(value);
  });
};

const loadResources = () => {
  // Cargar campos
  inputTask = document.querySelector("#input-task");
  inputID = document.querySelector("#input-id");
  btnSave = document.querySelector("#btn-save");

  btnSaveEdit = document.querySelector("#btn-saveEdit");
  btnSaveEdit.setAttribute("disabled", true);

  filterTask = document.querySelector("#filter-task");
  tasksContainer = document.querySelector("#tasks");
  emptyTasksContainer = document.querySelector("#empty");
  loadData();
  loadListeners();
};

addEventListener("DOMContentLoaded", () => {
  loadResources();
});
