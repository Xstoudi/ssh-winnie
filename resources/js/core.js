import { createRoot } from 'react-dom/client'
import React, { createElement } from 'react'

import App from './App'
import '../css/core.css'

/*import axios from 'axios'
import { generateMap } from './map'

import { barplot } from './barplot'
import { select } from 'd3-selection'

document.addEventListener('DOMContentLoaded', function (event) {
  ;(async () => {
    await generateMap()
    
    const { data: usernamesData } = await axios('/usernames')
    barplot(
      '.usernames-container',
      usernamesData.map((body) => [body.username, body.population])
    )

    const { data: passwordsData } = await axios('/passwords')
    barplot(
      '.passwords-container',
      passwordsData.map((body) => [body.password, body.population])
    )

    const { data: asNamesData } = await axios('/autonomous-systems/names')
    barplot(
      '.asnames-container',
      asNamesData.map((body) => [body.asName, body.population])
    )

    const { data: remoteIdentitiesData } = await axios('/identities')
    barplot(
      '.identities-container',
      remoteIdentitiesData.map((body) => [body.remoteIdentity, body.population])
    )
  })()
})
*/
const root = createRoot(document.getElementById('app'))
root.render(createElement(App))
