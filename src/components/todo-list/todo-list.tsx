import React, {useState, useMemo, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../../store/store'
import {
  fetchTodos,
  addTodoAsync,
  updateTodoAsync,
  deleteTodoAsync,
  toggleTodoAsync,
  completeAllTodosAsync,
  deleteCompletedTodosAsync,
} from '../../store/todoSlice'

import {TodoItem} from '../todo-items/todo-iItem.tsx'
import AddTodo from '../add-todo/add-todo.tsx'
import FilterButtons from '../filter-buttons/filter-buttons.tsx'
import './todo-list.css'

type FilterType = 'all' | 'active' | 'completed'

const TodoList: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all')
  const dispatch = useDispatch<AppDispatch>()
  const { todos, isLoading, error } = useSelector((state: RootState) => state.todos)

  useEffect(() => {
    dispatch(fetchTodos())
  }, [])

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed)
      case 'completed':
        return todos.filter(todo => todo.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const completedCount = useMemo(() => todos.filter(todo => todo.completed).length, [todos])
  const activeCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos])

  const handleAddTodo = async (text: string) => {
    dispatch(addTodoAsync(text))
  }

  const handleUpdateTodo = async (id: string, text: string) => {
    dispatch(updateTodoAsync({ id, text }))
  }

  const handleDeleteTodo = async (id: string) => {
    dispatch(deleteTodoAsync(id))
  }

  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodoAsync(id))
  }

  const handleCompleteAll = async () => {
    dispatch(completeAllTodosAsync())
  }

  const handleDeleteCompleted = async () => {
    dispatch(deleteCompletedTodosAsync())
  }

  const getContent = () => {
      if (isLoading && todos.length === 0) return (<div className="loading">Načítání...</div>)
      if (error) return (<div className="error">{error}</div>)

      return (
          <>
              <AddTodo onAddTodo={handleAddTodo} />

              <FilterButtons
                  currentFilter={filter}
                  onFilterChange={setFilter}
                  completedCount={completedCount}
                  activeCount={activeCount}
                  onCompleteAll={handleCompleteAll}
                  onDeleteCompleted={handleDeleteCompleted}
              />

              <div className="tasks">
                  {filteredTodos.length === 0 ? (
                      <div className="no-todos">
                          {filter === 'all' && 'Žádné úkoly'}
                          {filter === 'active' && 'Žádné aktivní úkoly'}
                          {filter === 'completed' && 'Žádné dokončené úkoly'}
                      </div>
                  ) : (
                      filteredTodos.map(todo => (
                          <TodoItem
                              key={todo.id}
                              todo={todo}
                              onUpdateTodo={handleUpdateTodo}
                              onDeleteTodo={handleDeleteTodo}
                              onToggleTodo={handleToggleTodo}
                          />
                      ))
                  )}
              </div>
          </>
      )
  }

  return (
    <div className="container">
      <div className="todo-list-container">
        <h1>Seznam úkolů</h1>
          {getContent()}
      </div>
    </div>
  )
}

export default TodoList
