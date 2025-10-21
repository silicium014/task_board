import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(100, 'Слишком длинное название'),
  description: z.string().max(500, 'Описание слишком длинное'),
  status: z.enum(['todo', 'in_progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().min(1, 'Дата обязательна'),
  assignee: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type TaskFormData = z.infer<typeof taskSchema>;