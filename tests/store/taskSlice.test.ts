import { configureStore } from '@reduxjs/toolkit'
import taskReducer, { 
  addTask, 
  updateTask, 
  deleteTask, 
  updateTaskStatus,
  setFilters,
  clearFilters,
  fetchTasks 
} from '../../src/store/taskSlice'
import { Task, TaskStatus, TaskPriority } from '../../src/types'
import type { RootState } from '../../src/store'

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'medium',
  dueDate: '2024-12-31',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  assignee: 'John Doe',
  tags: ['test'],
}

describe('task slice', () => {
 let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        tasks: taskReducer,
      },
    })
  })

  it('should handle initial state', () => {
    const state = store.getState() as RootState
    expect(state.tasks.tasks).toEqual([])
    expect(state.tasks.loading).toBe(false)
    expect(state.tasks.error).toBe(null)
  })

  it('should handle addTask', () => {
    store.dispatch(addTask({
      title: 'New Task',
      description: 'New Description',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-12-31',
      assignee: 'Test User',
      tags: ['new'],
    }))

    const state = store.getState() as RootState
    expect(state.tasks).toHaveLength(1)
    expect(state.tasks.tasks[0].title).toBe('New Task')
    expect(state.tasks.tasks[0].id).toBeDefined()
  })

  it('should handle updateTask', () => {
    store.dispatch(addTask({
      title: 'Original Task',
      description: 'Original Description',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-12-31',
      tags: [],
    }))

    const task = store.getState() as RootState
    const updatedTask = { ...task.tasks.tasks[0], title: 'Updated Task' }

    store.dispatch(updateTask(updatedTask))

    const state = store.getState() as RootState
    expect(state.tasks.tasks[0].title).toBe('Updated Task')
  })

  it('should handle deleteTask', () => {
    store.dispatch(addTask({
      title: 'Task to delete',
      description: 'Description',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-12-31',
      tags: [],
    }))

    const task = store.getState() as RootState
    const taskId = task.tasks.tasks[0].id
    store.dispatch(deleteTask(taskId))

    const state = store.getState()as RootState
    expect(state.tasks).toHaveLength(0)
  })
})