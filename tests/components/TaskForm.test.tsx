import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '../../src/components/TaskForm/TaskForm';
import { Task, TaskStatus, TaskPriority } from '../../src/types';

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
};

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create task form correctly', () => {
    render(
      <TaskForm
        visible={true}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Создать задачу')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите название задачи')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите описание задачи')).toBeInTheDocument();
  });

  it('renders edit task form correctly', () => {
    render(
      <TaskForm
        visible={true}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
        initialData={mockTask}
      />
    );

    expect(screen.getByText('Редактировать задачу')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <TaskForm
        visible={true}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /создать задачу|редактировать задачу/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Название обязательно')).toBeInTheDocument();
    });
  });

  it('calls onSubmit with correct data', async () => {
    render(
      <TaskForm
        visible={true}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Введите название задачи'), {
      target: { value: 'New Task' },
    });

    fireEvent.change(screen.getByPlaceholderText('Введите описание задачи'), {
      target: { value: 'New Description' },
    });

    const submitButton = screen.getByRole('button', { name: /создать задачу|редактировать задачу/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        status: 'todo',
        priority: 'medium',
        dueDate: expect.any(String),
        assignee: '',
        tags: [],
      });
    });
  });
});