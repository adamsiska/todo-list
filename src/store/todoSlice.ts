import {createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {apiService, type Task} from '../services/api'
import {initialState, type TodoState} from './state.ts';

export type Todo = Task

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
      return await apiService.getTasks()
  }
)

export const addTodoAsync = createAsyncThunk(
  'todos/addTodo',
  async (text: string) => {
      return await apiService.createTask({ text })
  }
)

export const updateTodoAsync = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, text }: { id: string; text: string }) => {
      return await apiService.updateTask(id, { text })
  }
)

export const deleteTodoAsync = createAsyncThunk(
  'todos/deleteTodo',
  async (id: string) => {
      await apiService.deleteTask(id)
      return id
  }
)

export const toggleTodoAsync = createAsyncThunk(
  'todos/toggleTodo',
  async (id: string, { getState, rejectWithValue }) => {
      const state = getState() as { todos: TodoState }
      const todo = state.todos.todos.find(t => t.id === id)
      if (!todo) {
        return rejectWithValue('Úkol nenalezen')
      }

      if (todo.completed) {
        return await apiService.incompleteTask(id)
      } else {
        return await apiService.completeTask(id)
      }
  }
)

export const completeAllTodosAsync = createAsyncThunk(
  'todos/completeAllTodos',
  async (_, { getState }) => {
      const state = getState() as { todos: TodoState }
      const activeTodos = state.todos.todos.filter(todo => !todo.completed)

      return await Promise.all(
          activeTodos.map(todo => apiService.completeTask(todo.id))
      )
  }
)

export const deleteCompletedTodosAsync = createAsyncThunk(
  'todos/deleteCompletedTodos',
  async (_, { getState }) => {
      const state = getState() as { todos: TodoState }
      const completedTodos = state.todos.todos.filter(todo => todo.completed)

      await Promise.all(
        completedTodos.map(todo => apiService.deleteTask(todo.id))
      )

      return completedTodos.map(todo => todo.id)
  }
)

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.isLoading = false
        state.todos = action.payload
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Chyba při načítání úkolů'
      })
      // Add todo
      .addCase(addTodoAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addTodoAsync.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.isLoading = false
        state.todos.push(action.payload)
      })
      .addCase(addTodoAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Chyba při přidávání úkolu'
      })
      // Update todo
      .addCase(updateTodoAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateTodoAsync.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.isLoading = false
        const index = state.todos.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.todos[index] = action.payload
        }
      })
      .addCase(updateTodoAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Chyba při aktualizaci úkolu'
      })
      // Delete todo
      .addCase(deleteTodoAsync.pending, (state, action) => {
        state.isLoading = true
        state.error = null
        // Store the todo being deleted for potential rollback
        const todoToDelete = state.todos.find(t => t.id === action.meta.arg)
        if (todoToDelete) {
          state.rollbackData = { deletedTodo: todoToDelete }
        }
        // Optimistic update
        state.todos = state.todos.filter(t => t.id !== action.meta.arg)
      })
      .addCase(deleteTodoAsync.fulfilled, (state) => {
        state.isLoading = false
        state.rollbackData = null
      })
      .addCase(deleteTodoAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Chyba při mazání úkolu'
        // Rollback
        if (state.rollbackData?.deletedTodo) {
          state.todos.push(state.rollbackData.deletedTodo)
          state.rollbackData = null
        }
      })
      // Toggle todo
      .addCase(toggleTodoAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(toggleTodoAsync.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.isLoading = false
        const index = state.todos.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.todos[index] = action.payload
        }
      })
      .addCase(toggleTodoAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Chyba při změně stavu úkolu'
      })
      // Complete all todos
      .addCase(completeAllTodosAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(completeAllTodosAsync.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.isLoading = false
        action.payload.forEach(completedTodo => {
          const index = state.todos.findIndex(t => t.id === completedTodo.id)
          if (index !== -1) {
            state.todos[index] = completedTodo
          }
        })
      })
      .addCase(completeAllTodosAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Chyba při označování všech úkolů jako dokončených'
      })
      // Delete completed todos
      .addCase(deleteCompletedTodosAsync.pending, (state) => {
        state.isLoading = true
        state.error = null
        // Store completed todos being deleted for potential rollback
        const completedTodos = state.todos.filter(todo => todo.completed)
        if (completedTodos.length > 0) {
          state.rollbackData = { deletedCompletedTodos: completedTodos }
        }
        // Optimistic update
        state.todos = state.todos.filter(todo => !todo.completed)
      })
      .addCase(deleteCompletedTodosAsync.fulfilled, (state) => {
        state.isLoading = false
        state.rollbackData = null
      })
      .addCase(deleteCompletedTodosAsync.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'Chyba při mazání dokončených úkolů'
        // Rollback
        if (state.rollbackData?.deletedCompletedTodos) {
          state.todos.push(...state.rollbackData.deletedCompletedTodos)
          state.rollbackData = null
        }
      })
  },
})

export default todoSlice.reducer
