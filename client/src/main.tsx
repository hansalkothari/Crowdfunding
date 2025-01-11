import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <ThirdwebProvider activeChain="ethereum" clientId="74cb0a3b114fded21955c1d7d61c79eb"> 
    <Router>
      <StateContextProvider>
        <App/>  
      </StateContextProvider>
    </Router>
  </ThirdwebProvider> 
)