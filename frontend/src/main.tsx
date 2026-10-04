import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { ManagerSessionProvider } from './context/ManagerSessionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ManagerSessionProvider>
      <App />
    </ManagerSessionProvider>
  </BrowserRouter>,
)
