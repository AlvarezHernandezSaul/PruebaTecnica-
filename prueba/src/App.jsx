import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/tasks"; 

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
      setError("No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        title: newTask.trim(),
      });


      setTasks([...tasks, response.data]);
      setNewTask("");
      setError(null);
    } catch (err) {
      console.error("Error al crear tarea:", err);
      setError("No se pudo crear la tarea");
    }
  };

  const toggleComplete = async (task) => {
    try {
      const updatedCompleted = !task.completed;

      const response = await axios.put(`${API_URL}/${task.id}`, {
        completed: updatedCompleted,
      });

      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, completed: response.data.completed } : t
        )
      );
      setError(null);
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
      setError("No se pudo actualizar la tarea");
    }
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
            disabled={loading}
          />
          <button
            className="add-btn"
            onClick={createTask}
            disabled={loading || !newTask.trim()}
          >
            +
          </button>
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {loading ? (
          <p className="empty">Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">sin tareas pendientes</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${task.completed ? "done" : ""}`}
              >
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

        {tasks.length > 0 && !loading && (
          <p className="counter">
            {tasks.filter((t) => !t.completed).length} pendientes ·{" "}
            {tasks.length} total
          </p>
        )}
      </div>
    </>
  );
}