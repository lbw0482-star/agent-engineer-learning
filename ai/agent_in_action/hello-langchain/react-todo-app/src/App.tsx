import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
}

type FilterType = 'all' | 'active' | 'completed'

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [isAdding, setIsAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextId = useRef(Date.now())

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  }

  const addTodo = useCallback(() => {
    const text = input.trim()
    if (!text) return
    setIsAdding(true)
    const newTodo: Todo = {
      id: nextId.current++,
      text,
      completed: false,
      createdAt: Date.now(),
    }
    setTodos((prev) => [newTodo, ...prev])
    setInput('')
    setTimeout(() => setIsAdding(false), 50)
    inputRef.current?.focus()
  }, [input])

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTodo()
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">
            <span className="title-icon">📝</span>
            TodoList
          </h1>
          <p className="subtitle">高效管理你的每一天</p>
        </header>

        <div className="input-section">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="todo-input"
              placeholder="添加新任务..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="add-btn" onClick={addTodo} disabled={!input.trim()}>
              <span className="add-icon">+</span>
              添加
            </button>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-buttons">
            {([
              { key: 'all', label: '全部' },
              { key: 'active', label: '进行中' },
              { key: 'completed', label: '已完成' },
            ] as { key: FilterType; label: string }[]).map((f) => (
              <button
                key={f.key}
                className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className="filter-count">
                  {f.key === 'all'
                    ? stats.total
                    : f.key === 'active'
                    ? stats.active
                    : stats.completed}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-num">{stats.total}</span>
            <span className="stat-label">总计</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num active-num">{stats.active}</span>
            <span className="stat-label">进行中</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num completed-num">{stats.completed}</span>
            <span className="stat-label">已完成</span>
          </div>
        </div>

        <ul className="todo-list">
          {filteredTodos.map((todo, index) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''} ${isAdding && index === 0 ? 'slide-in' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                className={`check-btn ${todo.completed ? 'checked' : ''}`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.completed && (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span className="todo-text">{todo.text}</span>
              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                title="删除"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">
              {filter === 'completed' ? '🎉' : filter === 'active' ? '✨' : '📋'}
            </span>
            <p className="empty-text">
              {filter === 'completed'
                ? '还没有已完成的任务'
                : filter === 'active'
                ? '所有任务都已完成！'
                : '还没有任务，快来添加吧！'}
            </p>
          </div>
        )}

        {stats.completed > 0 && (
          <div className="footer">
            <button className="clear-btn" onClick={clearCompleted}>
              清除已完成 ({stats.completed})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
