describe('Task Management Dashboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should load the dashboard with all columns', () => {
    // Проверяем загрузку всех колонок
    cy.get('[data-cy="kanban-column"]').should('have.length', 4);
    
    // Проверяем конкретные колонки по статусу
    cy.get('[data-column-status="todo"]').should('be.visible');
    cy.get('[data-column-status="in_progress"]').should('be.visible');
    cy.get('[data-column-status="review"]').should('be.visible');
    cy.get('[data-column-status="done"]').should('be.visible');
    
    // Проверяем заголовки колонок
    cy.get('[data-cy="kanban-column-title"]').contains('К выполнению');
    cy.get('[data-cy="kanban-column-title"]').contains('В работе');
    cy.get('[data-cy="kanban-column-title"]').contains('На проверке');
    cy.get('[data-cy="kanban-column-title"]').contains('Выполнено');
  });

  it('should create a new task', () => {
    // Нажимаем кнопку добавления задачи
    cy.contains('Добавить задачу').click();
    
    // Заполняем форму
    cy.get('input[placeholder="Введите название задачи"]').type('New Test Task');
    cy.get('textarea[placeholder="Введите описание задачи"]').type('Test Description for new task');
    
    // Выбираем приоритет
    cy.get('.ant-select-selector').eq(2).click(); // Приоритет
    cy.contains('Высокий').click();
    
    // Нажимаем создать
    cy.contains('Создать задачу').click();
    
    // Проверяем, что задача появилась в колонке "К выполнению"
    cy.get('[data-column-status="todo"]')
      .find('[data-cy="task-title"]')
      .contains('New Test Task')
      .should('be.visible');
  });

  it('should filter tasks by status', () => {
    // Сначала создаем тестовую задачу
    cy.contains('Добавить задачу').click();
    cy.get('input[placeholder="Введите название задачи"]').type('Filter Test Task');
    cy.get('textarea[placeholder="Введите описание задачи"]').type('Task for filter testing');
    cy.contains('Создать задачу').click();
    
    // Фильтруем по статусу "К выполнению"
    cy.get('.ant-select-selector').first().click();
    cy.contains('К выполнению').click();
    
    // Проверяем, что в колонке "К выполнению" есть задачи
    cy.get('[data-column-status="todo"]')
      .should('have.attr', 'data-tasks-count')
      .and('not.equal', '0');
      
    // Проверяем, что задача отображается
    cy.get('[data-column-status="todo"]')
      .find('[data-cy="task-title"]')
      .contains('Filter Test Task')
      .should('be.visible');
  });

  it('should edit an existing task', () => {
    // Находим задачу и открываем меню
    cy.get('[data-cy="task-menu-button"]').first().click();
    
    // Нажимаем "Редактировать"
    cy.contains('Редактировать').click();
    
    // Меняем название
    cy.get('input[placeholder="Введите название задачи"]')
      .clear()
      .type('Updated Task Title');
    
    // Сохраняем изменения
    cy.contains('Редактировать задачу').click();
    
    // Проверяем обновление
    cy.get('[data-cy="task-title"]')
      .contains('Updated Task Title')
      .should('be.visible');
  });

  it('should delete a task', () => {
    // Сначала проверяем количество задач
    cy.get('[data-cy="task-card"]').then(($tasks) => {
      const initialCount = $tasks.length;
      
      // Открываем меню первой задачи
      cy.get('[data-cy="task-menu-button"]').first().click();
      
      // Нажимаем удалить
      cy.contains('Удалить').click();
      
      // Проверяем, что количество задач уменьшилось
      cy.get('[data-cy="task-card"]').should('have.length', initialCount - 1);
    });
  });

  it('should drag and drop task between columns', () => {
    // Создаем тестовую задачу
    cy.contains('Добавить задачу').click();
    cy.get('input[placeholder="Введите название задачи"]').type('Drag Test Task');
    cy.contains('Создать задачу').click();
    
    // Находим задачу в колонке "К выполнению"
    cy.get('[data-column-status="todo"]')
      .find('[data-cy="task-card"]')
      .contains('Drag Test Task')
      .should('be.visible');
    
    // Перетаскиваем задачу в колонку "В работе"
    cy.get('[data-task-title="Drag Test Task"]')
      .trigger('mousedown', { which: 1 })
      .trigger('dragstart');
    
    cy.get('[data-column-status="in_progress"]')
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');
    
    // Проверяем, что задача переместилась
    cy.get('[data-column-status="in_progress"]')
      .find('[data-cy="task-title"]')
      .contains('Drag Test Task')
      .should('be.visible');
      
    // Проверяем, что в исходной колонке задачи нет
    cy.get('[data-column-status="todo"]')
      .find('[data-cy="task-title"]')
      .contains('Drag Test Task')
      .should('not.exist');
  });

  it('should display task details correctly', () => {
    // Создаем задачу с полными данными
    cy.contains('Добавить задачу').click();
    cy.get('input[placeholder="Введите название задачи"]').type('Detailed Test Task');
    cy.get('textarea[placeholder="Введите описание задачи"]').type('This is a detailed description');
    cy.get('input[placeholder="Введите имя исполнителя"]').type('Test User');
    cy.contains('Создать задачу').click();
    
    // Проверяем отображение всех деталей задачи
    cy.get('[data-cy="task-title"]').contains('Detailed Test Task').should('be.visible');
    cy.get('[data-cy="task-description"]').contains('This is a detailed description').should('be.visible');
    cy.get('[data-cy="task-assignee"]').contains('Test User').should('be.visible');
    cy.get('[data-cy="task-priority-tag"]').should('be.visible');
    cy.get('[data-cy="task-status-tag"]').should('be.visible');
    cy.get('[data-cy="task-due-date"]').should('be.visible');
  });

  it('should handle empty columns', () => {
    // Проверяем, что пустые колонки показывают правильное сообщение
    cy.get('[data-cy="kanban-column-empty"]')
      .contains('Нет задач')
      .should('be.visible');
  });

  it('should clear all filters', () => {
    // Применяем фильтр
    cy.get('.ant-select-selector').first().click();
    cy.contains('К выполнению').click();
    
    // Проверяем, что фильтр применен
    cy.get('.ant-select-selector').first().should('contain', 'К выполнению');
    
    // Очищаем фильтры
    cy.contains('Сбросить фильтры').click();
    
    // Проверяем, что фильтры сброшены
    cy.get('.ant-select-selector').first().should('not.contain', 'К выполнению');
  });

  it('should show drag indicator when dragging over column', () => {
    // Начинаем перетаскивание
    cy.get('[data-cy="task-card"]').first()
      .trigger('mousedown', { which: 1 })
      .trigger('dragstart');
    
    // Перетаскиваем над колонкой
    cy.get('[data-column-status="in_progress"]')
      .trigger('dragover');
    
    // Проверяем, что индикатор отображается
    cy.get('[data-cy="kanban-column-drop-indicator"]')
      .should('be.visible');
    
    // Завершаем перетаскивание
    cy.get('[data-cy="task-card"]').first()
      .trigger('dragend');
  });

  it('should validate task form', () => {
    cy.contains('Добавить задачу').click();
    
    // Пытаемся сохранить без названия
    cy.contains('Создать задачу').click();
    
    // Проверяем сообщение об ошибке
    cy.contains('Название обязательно').should('be.visible');
    
    // Заполняем только название
    cy.get('input[placeholder="Введите название задачи"]').type('Test Task');
    
    // Снова пытаемся сохранить
    cy.contains('Создать задачу').click();
    
    // Проверяем, что задача создана (остальные поля не обязательны)
    cy.get('[data-cy="task-title"]').contains('Test Task').should('be.visible');
  });

  it('should display task counts in badges', () => {
    // Создаем несколько задач
    cy.contains('Добавить задачу').click();
    cy.get('input[placeholder="Введите название задачи"]').type('Task 1');
    cy.contains('Создать задачу').click();
    
    cy.contains('Добавить задачу').click();
    cy.get('input[placeholder="Введите название задачи"]').type('Task 2');
    cy.contains('Создать задачу').click();
    
    // Проверяем, что бейджи обновились
    cy.get('[data-column-status="todo"]')
      .find('[data-cy="kanban-column-badge"]')
      .should('contain', '2');
  });
});