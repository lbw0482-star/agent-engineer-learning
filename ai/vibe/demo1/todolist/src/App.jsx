import { useState } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'

export default function App() {
  const [tasks, setTasks] = useState([])

  const handleAdd = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, completed: false },
    ])
  }

  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const handleReorder = (newTasks) => {
    setTasks(newTasks)
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
        Todo List
      </h1>
      <TodoInput onAdd={handleAdd} />
      <TodoList
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
    </div>
  )
}
