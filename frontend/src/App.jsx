import { useState, useEffect } from 'react';
import axios from 'axios';

// Uses Localhost for now, but switches to your Cloud Backend on Netlify
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  // READ Tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // CREATE Task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await axios.post(`${API_URL}/tasks`, { title });
      setTitle('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // UPDATE Task
  const toggleTask = async (id, currentStatus) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`, { completed: !currentStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">My Task Manager</h1>
        
        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input 
            type="text" 
            className="border p-2 flex-1 rounded" 
            placeholder="Add a new task..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add</button>
        </form>

        <ul>
          {tasks.map(task => (
            <li key={task.id} className="flex justify-between items-center bg-gray-50 p-3 mb-2 rounded border">
              <span 
                onClick={() => toggleTask(task.id, task.completed)} 
                className={`cursor-pointer ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
              >
                {task.title}
              </span>
              <button 
                onClick={() => deleteTask(task.id)} 
                className="text-red-500 font-bold hover:text-red-700"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;