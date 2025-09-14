
import React from 'react';
import { createRoot } from 'react-dom/client'
import {WagmiConfig} from './context/WagmiContext'
import App from './App.tsx'
import './index.css'
import { Buffer } from 'buffer';
window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(  <React.StrictMode>
    <WagmiConfig>
        <App/>
    </WagmiConfig>
</React.StrictMode>,);
