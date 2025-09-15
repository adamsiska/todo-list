import React, { useState } from 'react'
import './add-todo.css'

interface AddTodoProps {
  onAddTodo: (text: string) => void
}

const AddTodo: React.FC<AddTodoProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAddTodo(text.trim())
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Co je třeba?"
        className="add-todo-input"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="add-todo-button"
      >
        Přidat
      </button>
    </form>
  )
}

export default AddTodo
