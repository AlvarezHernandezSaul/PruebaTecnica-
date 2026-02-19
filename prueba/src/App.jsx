import { useState } from "react";

const styles = `
  body {
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    padding-top: 60px;
  }

  .app {
    background: white;
    width: 400px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(235, 227, 227, 0.1);
  }

  h1 {
    font-size: 22px;
    margin-bottom: 16px;
    color: #333;
  }

  .input-row {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }

  .task-input {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
  }

  .task-input:focus {
    border-color: #4a90e2;
  }

  .add-btn {
    padding: 8px 14px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 18px;
  }

  .add-btn:hover {
    background-color: #357abd;
  }

  .empty {
    color: #aaa;
    font-size: 14px;
    text-align: center;
    margin-top: 20px;
  }

  .task-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .task-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  .task-item:last-child {
    border-bottom: none;
  }

  .task-check {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .task-title {
    font-size: 14px;
    color: #333;
  }

  .task-item.done .task-title {
    text-decoration: line-through;
    color: #aaa;
  }

  .counter {
    margin-top: 14px;
    font-size: 12px;
    color: #999;
    text-align: right;
  }
`;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const createTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTask.trim(), completed: false }]);
    setNewTask("");
  };

  const toggleComplete = (task) => {
    setTasks(tasks.map((t) => t.id === task.id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <h1>Mis tareas</h1>

        <div className="input-row">
          <input
            className="task-input"
            placeholder="nueva tarea..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createTask()}
          />
          <button className="add-btn" onClick={createTask}>+</button>
        </div>

        {tasks.length === 0 ? (
          <p className="empty">sin tareas pendientes</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={`task-item ${task.completed ? "done" : ""}`}>
                <input
                  type="checkbox"
                  className="task-check"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                />
                <span className="task-title">{task.title}</span>
              </li>
            ))}
          </ul>
        )}

        {tasks.length > 0 && (
          <p className="counter">
            {tasks.filter((t) => !t.completed).length} pendientes · {tasks.length} total
          </p>
        )}
      </div>
    </>
  );
}