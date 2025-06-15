import React, { useState, useEffect } from "react";

const USERNAME = "OrlandoJim24";
const API_BASE_URL = "https://playground.4geeks.com/todo";

const TodoList = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

  // Fetch todos on mount and create user if not exist
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Try fetching existing todos
        let response = await fetch(`${API_BASE_URL}/users/${USERNAME}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setTodos(data.todos || []);
        } else if (response.status === 404) {
          // If user doesn't exist, create user
          response = await fetch(`${API_BASE_URL}/users/${USERNAME}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: USERNAME, todos: [] }),
          });
          if (!response.ok) throw new Error("Failed to create user");
          setTodos([]);
        } else {
          throw new Error("Failed to fetch todos");
        }
      } catch (error) {
        console.error("Error initializing user:", error);
      }
    };

    initializeUser();
  }, []);

  // Add new todo
  const addTodo = async () => {
    if (inputValue.trim() === "") return;

    const newTask = {
      label: inputValue.trim(),
      done: false,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/todos/${USERNAME}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add todo: ${JSON.stringify(errorData)}`);
      }

      const addedTodo = await response.json();
      setTodos([addedTodo, ...todos]);
      setInputValue("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Delete todo by id
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete todo");

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Clear all todos
  const clearAll = async () => {
    try {
      // Delete todos one by one because API deletes by id
      await Promise.all(todos.map((todo) =>
        fetch(`${API_BASE_URL}/todos/${todo.id}`, { method: "DELETE" })
      ));
      setTodos([]);
    } catch (error) {
      console.error("Error clearing todos:", error);
    }
  };

  return (
    <div
      style={{
        color: "gray",
        maxWidth: 400,
        height: "550px",
        margin: "auto",
        padding: 20,
        backgroundColor: "rgb(248, 248, 248)",
      }}
    >
      <h1 style={{ textAlign: "center", fontWeight: "10px", fontSize: "50px" }}>
        todos
      </h1>

      <input
        style={{
          padding: "0px",
          margin: "0px",
          border: "1px solid gray",
          borderRadius: "4px",
          height: "40px",
          width: "250px",
          backgroundColor: "rgb(255, 255, 255)",
          marginBottom: "5px",
          paddingLeft: "5px",
        }}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new task"
        onKeyDown={(e) => e.key === "Enter" && addTodo()}
      />
      <button onClick={addTodo} style={{ height: "40px" }}>
        Add
      </button>

      <ul
        style={{
          listStyle: "none",
          borderRadius: "4px",
          width: "257px",
          paddingLeft: 0,
          marginTop: "0px",
        }}
      >
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              borderRadius: "4px",
              paddingLeft: "5px",
              color: "gray",
              height: "40px",
              border: "1px solid gray",
              backgroundColor: "rgb(255, 255, 255)",
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {todo.label}
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                borderLeft: "10px",
                height: "40px",
                border: "none",
                backgroundColor: "rgb(255, 255, 255)",
                cursor: "pointer",
              }}
            >
              x
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <button onClick={clearAll} style={{ marginTop: "10px" }}>
          🧹 Clear All Tasks
        </button>
      )}
    </div>
  );
};

export default TodoList;
