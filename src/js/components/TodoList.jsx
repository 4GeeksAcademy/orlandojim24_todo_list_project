import React, { useState, useEffect } from "react";

function TodoList() {
  // Load todos from localStorage or start with empty array
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [inputValue, setInputValue] = useState("");

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add new todo
  const addTodo = () => {
    if (inputValue.trim() === "") return; // don't add empty

    const newTodo = {
      id: Date.now(), // unique id based on timestamp
      text: inputValue.trim(),
    };

    setTodos([...todos, newTodo]);
    setInputValue(""); // clear input
  };

  // Delete todo by id
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ color:'gray',maxWidth: 400,height: '550px', margin: "auto", padding: 20,backgroundColor: 'rgb(248, 248, 248)' }}>
      <h1 style={{ textAlign: 'center' ,  fontWeight: '10px', fontSize: '50px'}}>todos</h1>

      <input
        style={{
        padding: '0px',
        margin: '0px',
        border: '1px solid gray',
        borderRadius: '4px',
        height: '40px',
        width: '250px',
        backgroundColor: 'rgb(255, 255, 255)',
        marginBottom: '5px',
        paddingLeft: '5px',
      }}
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTodo}  style={{ height: '40px' }}>Add</button>

      <ul style={{ listStyle: "none", borderRadius: '4px', width: '257px',  paddingLeft: 0 ,marginTop: '0px' }}>
        {todos.map(todo => (
          <li key={todo.id} style={{  borderRadius: '4px',paddingLeft: '5px', color: 'gray',height: '40px',border: '1px solid gray',backgroundColor: 'rgb(255, 255, 255)',marginBottom: 8 }}>
            {todo.text}
            <button
              onClick={() => deleteTodo(todo.id)}
              
              style={{ borderLeft: '10px', height: '40px', border: 'none', backgroundColor: 'rgb(255, 255, 255)' }}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;