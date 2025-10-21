import React from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Task } from '../../types';
import { taskSchema, TaskFormData } from '../../utils/validation';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData ? {
      ...initialData,
      dueDate: initialData.dueDate,
    } : {
      status: 'todo',
      priority: 'medium',
      tags: [],
    },
  });

  React.useEffect(() => {
    if (visible && initialData) {
      reset(initialData);
    } else if (visible) {
      reset({
        status: 'todo',
        priority: 'medium',
        tags: [],
      });
    }
  }, [visible, initialData, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal
      title={initialData ? 'Редактировать задачу' : 'Создать задачу'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit(handleFormSubmit)}
      confirmLoading={loading}
      width={600}
    >
      <Form layout="vertical">
        <Form.Item
          label="Название"
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Введите название задачи" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Описание"
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                rows={4}
                placeholder="Введите описание задачи"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Статус"
          validateStatus={errors.status ? 'error' : ''}
          help={errors.status?.message}
        >
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Выберите статус">
                <Option value={'todo'}>К выполнению</Option>
                <Option value={'in_progress'}>В работе</Option>
                <Option value={'review'}>На проверке</Option>
                <Option value={'done'}>Выполнено</Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Приоритет"
          validateStatus={errors.priority ? 'error' : ''}
          help={errors.priority?.message}
        >
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Выберите приоритет">
                <Option value={'low'}>Низкий</Option>
                <Option value={'medium'}>Средний</Option>
                <Option value={'high'}>Высокий</Option>
                <Option value={'urgent'}>Срочный</Option>
              </Select>
            )}
          />
        </Form.Item>

        <Form.Item
          label="Срок выполнения"
          validateStatus={errors.dueDate ? 'error' : ''}
          help={errors.dueDate?.message}
        >
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
                style={{ width: '100%' }}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Исполнитель"
          validateStatus={errors.assignee ? 'error' : ''}
          help={errors.assignee?.message}
        >
          <Controller
            name="assignee"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Введите имя исполнителя" />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};