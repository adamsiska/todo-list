import React, { useState } from 'react'
import './todo-item.css'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdDate: number
  completedDate?: number
}

interface TodoItemProps {
  todo: Todo
  onUpdateTodo: (id: string, text: string) => void
  onDeleteTodo: (id: string) => void
  onToggleTodo: (id: string) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdateTodo,
  onDeleteTodo,
  onToggleTodo
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleEdit = () => {
    if (!todo.completed) {
      setIsEditing(true)
      setEditText(todo.text)
    }
  }

  const handleSave = () => {
    if (editText.trim() && editText.trim() !== todo.text) {
      onUpdateTodo(todo.id, editText.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleDelete = () => {
    onDeleteTodo(todo.id)
  }

  const handleToggleComplete = () => {
    onToggleTodo(todo.id)
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <button onClick={handleDelete} className="delete-icon">
        🗑️
      </button>

      {isEditing ? (
        <div className="todo-edit">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            className="todo-edit-input"
            autoFocus
          />
        </div>
      ) : (
        <span
          className={`todo-text ${todo.completed ? 'completed-text' : ''}`}
          onClick={handleEdit}
        >
          {todo.text}
        </span>
      )}

      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggleComplete}
        className="todo-checkbox"
      />
    </div>
  )
}
