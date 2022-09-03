import { createRoot } from 'react-dom/client'
import React, { createElement } from 'react'

import App from './App'
import '../css/core.css'

const root = createRoot(document.getElementById('app'))
root.render(createElement(App))
