import { useEffect, useState } from "react";

// Correct API URL (Important!)
const API_URI = "https://todoapp-backend-8yyp.onrender.com/api"; 

const Todos = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`${API_URI}/todos`);
        if (!response.ok) { // Check for HTTP errors (404, 500, etc.)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (task.trim() === "") return;
    try {
      const response = await fetch(API_URI + "/todos", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: task }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setTask("");
    } catch (error) {
      console.error("Error adding tasks:", error);
    }
  };

  const toggleTaskStatus = async (id, done) => {
    try {
      const response = await fetch(`${API_URI}/todos/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !done }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URI}/todos/${id}`, { method: "DELETE" }); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <h1 className="text-4xl font-bold text-center text-blue-500 mb-5">
        To-Do App
      </h1>
      <div className="max-w-lg mx-auto">
        {/* Input Section */}
        <form
          onSubmit={handleAddTask}
          className="flex gap-2 mb-5"
        >
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </form>

        {/* Tasks List */}

        <ul>
          {tasks.map((t) => (
            <li
              key={t.id}
              className={`flex flex-wrap justify-between items-center p-3 border mb-2 rounded ${
                t.done ? "bg-green-100 line-through" : "bg-white"
              }`}
            >
              <span className="break-words flex-1 mr-4 overflow-hidden text-ellipsis">
                {t.text}
              </span>

              <div className="flex flex-col ">

              {/* Toggle button */}
              <button
                onClick={() => toggleTaskStatus(t._id, t.done)}
                className=" text-sm text-blue-500 flex-shrink-0 pb-2"
              >
                {t.done ? "Undo" : "Done"}
              </button>
                
              {/* Delete Button */}

              <button
                  onClick={() => deleteTodo(t._id)}
                  className="text-sm text-red-500 flex-shrink-0 flex"
                >
                  Delete
                </button>
              </div>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todos;
