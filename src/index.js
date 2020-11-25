import './wdyr'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App10'

ReactDOM.unstable_createRoot(
  document.getElementById('root')
).render(<App />)
/*
ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
)
*/
