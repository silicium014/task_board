export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export const statusTitles: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'К выполнению',
  [TaskStatus.IN_PROGRESS]: 'В работе',
  [TaskStatus.REVIEW]: 'На проверке',
  [TaskStatus.DONE]: 'Выполнено',
};

export const statusColors: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'blue',
  [TaskStatus.IN_PROGRESS]: 'orange',
  [TaskStatus.REVIEW]: 'gold',
  [TaskStatus.DONE]: 'green',
};

export const statusDescriptions: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'Задачи, которые нужно выполнить',
  [TaskStatus.IN_PROGRESS]: 'Задачи в процессе выполнения',
  [TaskStatus.REVIEW]: 'Задачи на проверке',
  [TaskStatus.DONE]: 'Завершенные задачи',
};

export const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'blue',
  [TaskPriority.MEDIUM]: 'orange',
  [TaskPriority.HIGH]: 'red',
  [TaskPriority.URGENT]: 'purple',
};

export const priorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Низкий',
  [TaskPriority.MEDIUM]: 'Средний',
  [TaskPriority.HIGH]: 'Высокий',
  [TaskPriority.URGENT]: 'Срочный',
};