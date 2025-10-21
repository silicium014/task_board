import React from 'react';
import { Card, Tag, Button, Dropdown, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined, UserOutlined, CalendarOutlined, TagOutlined } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { Task, TaskPriority, TaskStatus } from '../../types';
import type { MenuProps } from 'antd';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  ['low']: 'blue',
  ['medium']: 'orange',
  ['high']: 'red',
  ['urgent']: 'purple',
};

const priorityLabels: Record<TaskPriority, string> = {
  ['low']: 'Низкий',
  ['medium']: 'Средний',
  ['high']: 'Высокий',
  ['urgent']: 'Срочный',
};

const statusLabels: Record<TaskStatus, string> = {
  ['todo']: 'К выполнению',
  ['in_progress']: 'В работе',
  ['review']: 'На проверке',
  ['done']: 'Выполнено',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  const items: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Редактировать',
      icon: <EditOutlined />,
      onClick: handleEdit,
    },
    {
      key: 'delete',
      label: 'Удалить',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDelete,
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div 
      ref={drag} 
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-cy="task-card"
      data-task-id={task.id}
      data-task-status={task.status}
      data-task-priority={task.priority}
    >
      <Card
        size="small"
        title={
          <div data-cy="task-title">
            {task.title}
          </div>
        }
        extra={
          <Dropdown 
            menu={{ items }} 
            trigger={['click']}
            placement="bottomRight"
          >
            <Button 
              type="text" 
              icon={<MoreOutlined />} 
              data-cy="task-menu-button"
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        }
        style={{ 
          marginBottom: 8, 
          cursor: 'move',
          border: `1px solid ${priorityColors[task.priority]}20`,
        }}
        data-cy="task-card-content"
      >
        {task.description && (
          <p 
            style={{ 
              marginBottom: 12, 
              color: '#666',
              fontSize: '12px',
              lineHeight: '1.4'
            }}
            data-cy="task-description"
          >
            {task.description}
          </p>
        )}
        
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip title={priorityLabels[task.priority]}>
              <Tag 
                color={priorityColors[task.priority]}
                data-cy="task-priority-tag"
              >
                {task.priority.toUpperCase()}
              </Tag>
            </Tooltip>
            
            <Tag 
              color="default"
              data-cy="task-status-tag"
            >
              {statusLabels[task.status]}
            </Tag>
          </div>
          
          <Space direction="vertical" style={{ width: '100%' }} size={4}>
            {task.assignee && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontSize: '12px',
                  color: '#555'
                }}
                data-cy="task-assignee"
              >
                <UserOutlined style={{ marginRight: 4 }} />
                <strong>Исполнитель:</strong> 
                <span style={{ marginLeft: 4 }}>{task.assignee}</span>
              </div>
            )}
            
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontSize: '12px',
                color: '#555'
              }}
              data-cy="task-due-date"
            >
              <CalendarOutlined style={{ marginRight: 4 }} />
              <strong>Срок:</strong> 
              <span style={{ marginLeft: 4 }}>{formatDate(task.dueDate)}</span>
            </div>
            
            {task.tags.length > 0 && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  fontSize: '12px',
                  color: '#555'
                }}
                data-cy="task-tags"
              >
                <TagOutlined style={{ marginRight: 4, marginTop: 2 }} />
                <strong>Теги:</strong>
                <Space size={[2, 2]} wrap style={{ marginLeft: 4 }}>
                  {task.tags.map(tag => (
                    <Tag 
                     key={tag} 
                     color="default" 
                     data-cy="task-tag"
                    >
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </Space>

          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '10px',
              color: '#999',
              marginTop: 8,
              paddingTop: 8,
              borderTop: '1px solid #f0f0f0'
            }}
          >
            <span data-cy="task-created-at">
              Создано: {formatDate(task.createdAt)}
            </span>
            <span data-cy="task-updated-at">
              Обновлено: {formatDate(task.updatedAt)}
            </span>
          </div>
        </Space>
      </Card>
    </div>
  );
};