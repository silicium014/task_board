import React from 'react';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from './store';
import { Dashboard } from './pages/Dashboard/Dashboard';
import ruRU from 'antd/locale/ru_RU';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={ruRU}>
        <div className="App">
          <Dashboard />
        </div>
      </ConfigProvider>
    </Provider>
  );
};

export default App;