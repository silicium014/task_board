import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Button, Spin, Alert, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '../../types';
import { TaskStatus, TaskPriority } from '../../constants/task';
import { KanbanColumn } from '../../components/KanbanColumn/KanbanColumn';
import { TaskForm } from '../../components/TaskForm/TaskForm';
import { FilterPanel } from '../../components/FilterPanel/FilterPanel';
import { 
  fetchTasks, 
  addTask, 
  updateTask, 
  deleteTask, 
  updateTaskStatus,
  setFilters,
  clearFilters 
} from '../../store/taskSlice';
import { RootState, AppDispatch } from '../../store';
import { TaskFormData } from '../../utils/validation';

const { Content, Sider } = Layout;

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, filteredTasks, filters, loading, error } = useSelector(
    (state: RootState) => state.tasks
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    dispatch(updateTaskStatus({ taskId, status: newStatus }));
  };

  const handleFormSubmit = (data: TaskFormData) => {
    // Преобразуем данные формы в правильные типы
    const taskData = {
      ...data,
      status: data.status as TaskStatus,
      priority: data.priority as TaskPriority // Исправлено: TaskPriority вместо TaskStatus
    };

    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        ...taskData
      };
      dispatch(updateTask(updatedTask));
    } else {
      dispatch(addTask(taskData));
    }
    setIsModalVisible(false);
  };

  const handleFiltersChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter(task => task.status === status);
  };

  if (loading && tasks.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={300} style={{ background: '#fff', padding: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddTask}
              style={{ width: '100%' }}
              data-cy="add-task-button"
            >
              Добавить задачу
            </Button>

            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </Space>
        </Sider>

        <Layout>
          <Content style={{ padding: '24px', background: '#f0f2f5' }}>
            {error && (
              <Alert
                message="Ошибка"
                description={error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
                data-cy="error-alert"
              />
            )}

            <Row gutter={16}>
              {Object.values(TaskStatus).map((status) => (
                <Col key={status} xs={24} sm={12} lg={6}>
                  <KanbanColumn
                    status={status}
                    tasks={getTasksByStatus(status)}
                    onTaskEdit={handleEditTask}
                    onTaskDelete={handleDeleteTask}
                    onTaskMove={handleTaskMove}
                  />
                </Col>
              ))}
            </Row>
          </Content>
        </Layout>
      </Layout>

      <TaskForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
        loading={loading}
      />
    </DndProvider>
  );
};