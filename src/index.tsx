import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Dashboard from './components/Dashboard/Dashboard';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
