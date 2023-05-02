import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./todo.css";

function Todo() {
  const [todoList, setTodoList] = useState([]);
  const [todoText, setTodoText] = useState('');

  const handleAddTodo = async (event) => {
    event.preventDefault();
    if (todoText.trim() !== '') {
      const response = await axios.post('https://mern-to-do-back-end.onrender.com/todos', {
        text: todoText,
      });
      setTodoList([...todoList, response.data]);
      setTodoText('');
      await fetchTodos(); // Fetch todos again after adding a new one
    }
  };
  

  const handleRemoveTodo = async (id) => {
    await axios.delete(`https://mern-to-do-back-end.onrender.com/todos/${id}`);
    const newTodoList = todoList.filter((todo) => todo._id !== id);
    setTodoList(newTodoList);
  };

  const handleToggleCompleted = async (id) => {
    const todo = todoList.find((todo) => todo._id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };
    await axios.put(`https://mern-to-do-back-end.onrender.com/todos/${id}`, updatedTodo);
    const newTodoList = todoList.map((todo) => (todo._id === id ? updatedTodo : todo));
    setTodoList(newTodoList);
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  
  async function fetchTodos() {
    const response = await axios.get('https://mern-to-do-back-end.onrender.com/todos');
    setTodoList(response.data);
  }
  

  return (
   <div className="todo-container">
  <form className="todo-form" onSubmit={handleAddTodo}>
    <input
      className="todo-input"
      type="text"
      value={todoText}
      onChange={(event) => setTodoText(event.target.value)}
      placeholder="Enter a todo..."
    />
    <button className="todo-button" type="submit">
      Add Todo
    </button>
  </form>
  <ul className="todo-list">
    {todoList.map((todo) => (
      <li key={todo._id} className={`todo-item ${todo.completed ? "completed" : ""}`}>
        <span className="todo-text" onClick={() => handleToggleCompleted(todo._id)}>
          {todo.text}
        </span>
        <button className="remove-todo-button" onClick={() => handleRemoveTodo(todo._id)}>X</button>
      </li>
    ))}
  </ul>
</div>

);
}

export default Todo;
