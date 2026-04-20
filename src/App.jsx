import { useEffect, useRef, useState } from 'react'
import './App.css'

const TODOS_STORAGE_KEY = 'todos'

function App() {
  const [task, setTask] = useState('')
  const skipInitialPersist = useRef(true)
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem(TODOS_STORAGE_KEY)
    if (!storedTodos) {
      return []
    }

    try {
      const parsedTodos = JSON.parse(storedTodos)
      return Array.isArray(parsedTodos) ? parsedTodos : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (skipInitialPersist.current) {
      skipInitialPersist.current = false
      return
    }

    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTask = (event) => {
    event.preventDefault()

    const trimmedTask = task.trim()
    if (!trimmedTask) {
      return
    }

    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: crypto.randomUUID(),
        text: trimmedTask,
        completed: false,
      },
    ])
    setTask('')
  }

  const toggleTask = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const deleteTask = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  return (
    <main className="todo-app">
      <h1>Todo List</h1>
      <form className="todo-form" onSubmit={addTask}>
        <label htmlFor="task-input" className="sr-only">
          New task
        </label>
        <input
          id="task-input"
          type="text"
          placeholder="Add a task"
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTask(todo.id)}
              />
              <span className={todo.completed ? 'completed' : ''}>{todo.text}</span>
            </label>
            <button type="button" onClick={() => deleteTask(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
