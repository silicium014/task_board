import React from 'react';
import { Card, Select, Button, DatePicker, Space } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { TaskStatus, TaskPriority, TaskFilters } from '../../types';
import dayjs from 'dayjs';

const { Option } = Select;

interface FilterPanelProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onClearFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleStatusChange = (status: TaskStatus | undefined) => {
    onFiltersChange({ ...filters, status });
  };

  const handlePriorityChange = (priority: TaskPriority | undefined) => {
    onFiltersChange({ ...filters, priority });
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    onFiltersChange({ ...filters, dueDate: date ? date.format('YYYY-MM-DD') : undefined });
  };

  return (
    <Card title="Фильтры" size="small">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <strong>Статус:</strong>
          <Select
            value={filters.status}
            onChange={handleStatusChange}
            placeholder="Все статусы"
            style={{ width: '100%', marginTop: 8 }}
            allowClear
          >
            <Option value={'todo'}>К выполнению</Option>
            <Option value={'in_progress'}>В работе</Option>
            <Option value={'review'}>На проверке</Option>
            <Option value={'done'}>Выполнено</Option>
          </Select>
        </div>

        <div>
          <strong>Приоритет:</strong>
          <Select
            value={filters.priority}
            onChange={handlePriorityChange}
            placeholder="Все приоритеты"
            style={{ width: '100%', marginTop: 8 }}
            allowClear
          >
            <Option value={'low'}>Низкий</Option>
            <Option value={'medium'}>Средний</Option>
            <Option value={'high'}>Высокий</Option>
            <Option value={'urgent'}>Срочный</Option>
          </Select>
        </div>

        <div>
          <strong>Срок выполнения:</strong>
          <DatePicker
            value={filters.dueDate ? dayjs(filters.dueDate) : null}
            onChange={handleDateChange}
            style={{ width: '100%', marginTop: 8 }}
            placeholder="Выберите дату"
          />
        </div>

        <Button
          type="dashed"
          icon={<ClearOutlined />}
          onClick={onClearFilters}
          style={{ width: '100%' }}
        >
          Сбросить фильтры
        </Button>
      </Space>
    </Card>
  );
};