import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskFilters } from '../types';
import { TaskStatus, TaskPriority } from '../constants/task';

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  filters: {},
  loading: false,
  error: null,
};

// Асинхронные thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    // Имитация API вызова
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Разработать главную страницу',
        description: 'Создать адаптивный дизайн главной страницы',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: '2024-12-31',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        assignee: 'Иван Иванов',
        tags: ['frontend', 'ui']
      },
      {
        id: '2',
        title: 'Интеграция с API',
        description: 'Настроить взаимодействие с бэкенд API',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        dueDate: '2024-12-25',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        assignee: 'Петр Петров',
        tags: ['backend', 'api']
      },
      {
        id: '3',
        title: 'Code review компонентов',
        description: 'Провести ревью React компонентов',
        status: TaskStatus.REVIEW,
        priority: TaskPriority.HIGH,
        dueDate: '2024-12-20',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        assignee: 'Анна Смирнова',
        tags: ['code-review', 'frontend']
      },
      {
        id: '4',
        title: 'Написать документацию',
        description: 'Создать документацию для API',
        status: TaskStatus.DONE,
        priority: TaskPriority.LOW,
        dueDate: '2024-12-15',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        assignee: 'Сергей Козлов',
        tags: ['documentation', 'api']
      }
    ];
    
    return mockTasks;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
      state.filteredTasks = applyFilters(state.tasks, state.filters);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        state.filteredTasks = applyFilters(state.tasks, state.filters);
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      state.filteredTasks = applyFilters(state.tasks, state.filters);
    },
    updateTaskStatus: (state, action: PayloadAction<{ taskId: string; status: TaskStatus }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
        task.updatedAt = new Date().toISOString();
        state.filteredTasks = applyFilters(state.tasks, state.filters);
      }
    },
    setFilters: (state, action: PayloadAction<TaskFilters>) => {
      state.filters = action.payload;
      state.filteredTasks = applyFilters(state.tasks, action.payload);
    },
    clearFilters: (state) => {
      state.filters = {};
      state.filteredTasks = state.tasks;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.filteredTasks = applyFilters(action.payload, state.filters);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      });
  },
});

// Вспомогательная функция для фильтрации
function applyFilters(tasks: Task[], filters: TaskFilters): Task[] {
  if (!filters || Object.keys(filters).length === 0) {
    return tasks;
  }

  return tasks.filter(task => {
    if (filters.status && task.status !== filters.status) {
      return false;
    }
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }
    if (filters.dueDate && task.dueDate !== filters.dueDate) {
      return false;
    }
    if (filters.assignee && !task.assignee?.toLowerCase().includes(filters.assignee.toLowerCase())) {
      return false;
    }
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(filterTag =>
        task.tags.some(taskTag => 
          taskTag.toLowerCase().includes(filterTag.toLowerCase())
        )
      );
      if (!hasMatchingTag) {
        return false;
      }
    }
    return true;
  });
}

export const { 
  addTask, 
  updateTask, 
  deleteTask, 
  updateTaskStatus, 
  setFilters, 
  clearFilters 
} = taskSlice.actions;

export default taskSlice.reducer;