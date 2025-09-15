export interface Task {
  id: string
  text: string
  completed: boolean
  createdDate: number
  completedDate?: number
}

export interface CreateTaskRequest {
  text: string
}

export interface UpdateTaskRequest {
  text: string
}

export class ApiException extends Error {
  public status: number
  public statusText: string
  public endpoint: string

  constructor(message: string, status: number, statusText: string, endpoint: string) {
    super(message)
    this.name = 'ApiException'
    this.status = status
    this.statusText = statusText
    this.endpoint = endpoint
  }
}

const API_BASE_URL = 'http://localhost:8080'

const request = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    return response.json()
}

const getTasks = async (): Promise<Task[]> => {
  return request<Task[]>('/tasks')
}

const getCompletedTasks = async (): Promise<Task[]> => {
  return request<Task[]>('/tasks/completed')
}

const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  return request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

const updateTask = async (id: string, data: UpdateTaskRequest): Promise<Task> => {
  return request<Task>(`/tasks/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

const deleteTask = async (id: string): Promise<string> => {
  return request<string>(`/tasks/${id}`, {
    method: 'DELETE',
  })
}

const completeTask = async (id: string): Promise<Task> => {
  return request<Task>(`/tasks/${id}/complete`, {
    method: 'POST',
  })
}

const incompleteTask = async (id: string): Promise<Task> => {
  return request<Task>(`/tasks/${id}/incomplete`, {
    method: 'POST',
  })
}

export const apiService = {
  getTasks,
  getCompletedTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  incompleteTask,
}
