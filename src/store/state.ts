import type {Todo} from 'src/store/todoSlice.ts';

export interface TodoState {
    todos: Todo[]
    isLoading: boolean
    error: string | null
    rollbackData: {
        deletedTodo?: Todo
        deletedCompletedTodos?: Todo[]
    } | null
}

export const initialState: TodoState = {
    todos: [],
    isLoading: false,
    error: null,
    rollbackData: null,
}
