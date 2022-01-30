import { StrictMode } from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
)
