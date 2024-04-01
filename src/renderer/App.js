// App.js
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider
import { createStore } from 'redux'; // Import createStore
import rootReducer from './reducers/reducers'; // Import your root reducer
// import { AuthProvider } from './contexts/AuthContext';
import LayoutWithOutlet from './components/LayoutWithOutlet';
import LoginPage from './pages/LoginPage';
import LucentPage from './pages/LucentPage';
import SyncSettingPage from './pages/SyncSettingPage';
import SyncPage from './pages/SyncPage';
import MessageViewer from './components/MessageViewer';

import './App.css';
import "tailwindcss/tailwind.css";
;


// Create the Redux store
const store = createStore(rootReducer);

const App = () => {
  return (
    <Provider store={store}> {/* Wrap the entire Router with the Redux Provider */}
      {/* <AuthProvider> */}
        <Router>
          <Routes>
            <Route path="/" element={<LayoutWithOutlet />}>
              <Route index element={<LucentPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="syncsetting" element={<SyncSettingPage />} />
              <Route path="sync" element={<SyncPage />} />
            </Route>
          </Routes>
        </Router>
      {/* </AuthProvider> */}
    </Provider>
  );
};

export default App;
