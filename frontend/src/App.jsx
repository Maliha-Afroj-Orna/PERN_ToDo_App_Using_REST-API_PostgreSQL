import { useEffect, useState } from "react";
import axios from "axios";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function App() {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/todos");
      setTodos(res.data);
    } catch (error) {
      console.error(error.message);
      setError("Failed to fetch todos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      setError(null);
      const res = await axios.post("http://localhost:5000/todos", {
        description,
        completed: false,
      });
      setTodos([...todos, res.data]);
      setDescription("");
    } catch (error) {
      console.error(error.message);
      setError("Failed to add todo. Please try again later.");
    }
  };

  const saveEdit = async (id) => {
    try {
      setError(null);

      const currentTodo = todos.find((todo) => todo.todo_id === id);
      const trimmedText = editedText.trim();

      if (currentTodo.description === trimmedText) {
        setEditingTodo(null);
        setEditedText("");
        return;
      }

      await axios.put(`http://localhost:5000/todos/${id}`, {
        description: editedText,
      });
      setEditingTodo(null);
      setEditedText("");
      setTodos(
        todos.map((todo) =>
          todo.todo_id === id
            ? { ...todo, description: editedText, completed: false }
            : todo,
        ),
      );
    } catch (error) {
      console.error(error.message);
      setError("Failed to update todo. Please try again later.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError(null);
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (error) {
      console.error(error.message);
      setError("Failed to delete todo. Please try again later.");
    }
  };

  const toggleCompleted = async (id) => {
    try {
      setError(null);
      const todo = todos.find((todo) => todo.todo_id === id);
      await axios.put(`http://localhost:5000/todos/${id}`, {
        description: todo.description,
        completed: !todo.completed,
      });
      setTodos(
        todos.map((todo) =>
          todo.todo_id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    } catch (error) {
      console.error(error.message);
      setError("Failed to update todo. Please try again later.");
    }
  };

  return (
    <>
      <div className=" min-h-screen bg-gray-800 flex justify-center items-center p-4">
        <div className=" bg-gray-50 rounded-2xl shadow-xl w-full max-w-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            PERN TODO APP
          </h1>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          <form
            onSubmit={onSubmitForm}
            className="flex items-center gap-2 shadow-sm border p-2 rounded-lg mb-6"
          >
            <input
              className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
            <button className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-md font-medium cursor-pointer">
              Add Task
            </button>
          </form>
          <div>
            {loading ? (
              <div>
                <p className="text-gray-600">Loading tasks...</p>
              </div>
            ) : todos.length === 0 ? (
              <p className="text-gray-600">
                No tasks available. Add a new task!
              </p>
            ) : (
              <div className="flex flex-col gap-y-4">
                {todos.map((todo) => (
                  <div key={todo.todo_id} className="pb-4">
                    {editingTodo === todo.todo_id ? (
                      <div className="flex items-center gap-x-3">
                        <input
                          className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 shadow-inner"
                          type="text"
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                        />

                        <div>
                          <button
                            onClick={() => saveEdit(todo.todo_id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 mt-2 hover:bg-green-600 duration-200 cursor-pointer"
                          >
                            <MdOutlineDone />
                          </button>
                          <button
                            onClick={() => setEditingTodo(null)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg mt-2 hover:bg-gray-600 duration-200 cursor-pointer"
                          >
                            <IoClose />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-4 overflow-hidden">
                          <button
                            onClick={() => toggleCompleted(todo.todo_id)}
                            className={`flex-shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center ${todo.completed ? "bg-green-500 border-green-500 text-white cursor-pointer" : "border-gray-300 hover:border-blue-400 cursor-pointer"}`}
                          >
                            {todo.completed && <MdOutlineDone size={16} />}
                          </button>
                          <span>{todo.description}</span>
                        </div>
                        <div className="flex gap-x-2">
                          <button
                            onClick={() => {
                              setEditingTodo(todo.todo_id);
                              setEditedText(todo.description);
                            }}
                            className="p-2 text-gray-800 hover:text-gray-600 rounded-lg hover:bg-gray-100 duration-200 cursor-pointer"
                          >
                            <MdModeEditOutline />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.todo_id)}
                            className="p-2 text-pink-600 hover:text-pink-500 rounded-lg hover:bg-pink-100 duration-200 cursor-pointer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
