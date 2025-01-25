import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'; {/* for paging and routing*/}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* to allow the application to use the react router component */}
    <App />
    </BrowserRouter> 
  </StrictMode>,
)

//  createRoot(document.getElementById('root')).render(
//   <StrictMode>
//   <BrowserRouter> 
//   <App />
//   </BrowserRouter> 
//   <App />  //this is the reason hello world was printed twice
// </StrictMode>,
// )

