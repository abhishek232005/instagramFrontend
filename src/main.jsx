import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/Store.jsx'
import persistStore from 'redux-persist/es/persistStore'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

let persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
  <StrictMode>
<Provider store={store}>
  <PersistGate loading={null} persistor={persistor} >
  <App />
  <ToastContainer/>
  </PersistGate>

</Provider>
  </StrictMode>,
)
