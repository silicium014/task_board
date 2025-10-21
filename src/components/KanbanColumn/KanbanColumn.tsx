import React from 'react';
import { Card, Typography, Empty, Badge } from 'antd';
import { useDrop } from 'react-dnd';
import { Task } from '../../types';
import { 
  TaskStatus, 
  statusTitles, 
  statusColors, 
  statusDescriptions 
} from '../../constants/task';
import { TaskCard } from '../TaskCard/TaskCard';

const { Title } = Typography;

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  onTaskEdit,
  onTaskDelete,
  onTaskMove,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; status: TaskStatus }) => {
      if (item.status !== status) {
        onTaskMove(item.id, status);
      }
    },
    canDrop: (item: { id: string; status: TaskStatus }) => {
      return item.status !== status;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;
  const backgroundColor = isActive ? '#e6f7ff' : canDrop ? '#f6ffed' : 'transparent';
  const borderColor = isActive ? '#1890ff' : canDrop ? '#52c41a' : 'transparent';

  return (
    <div
      ref={drop}
      data-cy="kanban-column"
      data-column-status={status}
      data-tasks-count={tasks.length}
      style={{
        backgroundColor,
        minHeight: 600,
        border: `2px dashed`,
        borderColor,
        borderRadius: 8,
        padding: 8,
        transition: 'all 0.3s ease',
      }}
    >
      <Card
        data-cy="kanban-column-card"
        styles={{
          body: {
            padding: '16px 12px'
          }
        }}
        style={{
          border: `1px solid #f0f0f0`,
          boxShadow: isActive ? '0 4px 12px rgba(24, 144, 255, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16 
          }}
          data-cy="kanban-column-header"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge 
              color={statusColors[status]} 
              text={
                <Title 
                  level={4} 
                  style={{ 
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 600
                  }}
                  data-cy="kanban-column-title"
                >
                  {statusTitles[status]}
                </Title>
              }
            />
          </div>
          
          <Badge 
            count={tasks.length} 
            showZero 
            color={statusColors[status]}
            style={{ 
              backgroundColor: statusColors[status],
              fontWeight: 600
            }}
            data-cy="kanban-column-badge"
          />
        </div>

        <div 
          style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginBottom: 16,
            lineHeight: '1.4'
          }}
          data-cy="kanban-column-description"
        >
          {statusDescriptions[status]}
        </div>
        
        <div 
          style={{ 
            minHeight: 500,
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            padding: '4px 2px'
          }}
          data-cy="kanban-column-content"
        >
          {tasks.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span data-cy="kanban-column-empty">
                  {isActive ? 'Отпустите чтобы переместить' : 'Нет задач'}
                </span>
              }
              style={{ 
                margin: '40px 0',
                padding: '20px'
              }}
            />
          ) : (
            <div data-cy="kanban-column-tasks-list">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  data-cy="kanban-column-task-item"
                  data-task-index={index}
                  style={{ marginBottom: 8 }}
                >
                  <TaskCard
                    task={task}
                    onEdit={onTaskEdit}
                    onDelete={onTaskDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {isActive && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(24, 144, 255, 0.04)',
              border: `2px solid #1890ff`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 1,
            }}
            data-cy="kanban-column-drop-indicator"
          >
            <div
              style={{
                color: '#1890ff',
                fontSize: '16px',
                fontWeight: 600,
                textAlign: 'center',
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 6,
                border: `2px dashed #1890ff`,
              }}
            >
              Переместить задачу сюда
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};