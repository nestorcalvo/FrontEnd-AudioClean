import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './contexts/theme'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

render(
  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root')
)
