import { TaskStatus, TaskPriority } from '../constants/task';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  tags: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignee?: string;
  tags?: string[];
}

// Re-export
export { TaskStatus, TaskPriority };