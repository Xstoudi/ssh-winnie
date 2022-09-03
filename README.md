<h1 align="center">SSH-Winnie</h1>
<p align="center">
  a Node.js SSH honeypot to register data about connections attempts
</p>
<p align="center">
  <a href="https://github.com/Xstoudi/ssh-winnie/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/workflow/status/Xstoudi/ssh-winnie/ci?style=flat-square" alt="GitHub workflow status" />
  </a>
  <a href="https://hub.docker.com/repository/docker/xstoudi/winnie">
    <img src="https://img.shields.io/docker/image-size/xstoudi/winnie?sort=date&style=flat-square" alt="Docker image size" />
  </a>
  <a href="https://github.com/Xstoudi/ssh-winnie/issues">
    <img src="https://img.shields.io/github/issues-raw/Xstoudi/ssh-winnie?style=flat-square" alt="GitHub issues" />
  </a>
  <a href="https://github.com/Xstoudi/ssh-winnie/pulls">
    <img src="https://img.shields.io/github/issues-pr-raw/Xstoudi/ssh-winnie?style=flat-square" alt="GitHub pull requests" />
  </a>
  <a href="https://github.com/Xstoudi/ssh-winnie/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Xstoudi/ssh-winnie?style=flat-square" alt="License" />
  </a>
</p>

## 📜 Features

- Record login attempts on PostgreSQL database
- Dashboard to display basic informations about collected samples, including username, password, autonomous system name, country
- Report remote IP to AbuseIPDB

## 🚧 Requirements

- [Node.js](https://nodejs.org/en/) LTS 16.x or higher
- [PostgreSQL](https://www.postgresql.org/) 14.x

## Configuration

Winnie must be configured using environment variables:

```env
SSH_HOST=0.0.0.0
SSH_PORT=3555
HOST=0.0.0.0
PORT=3333
NODE_ENV=production
APP_KEY=
DRIVE_DISK=local
DB_CONNECTION=pg
PG_HOST=localhost
PG_PORT=5432
PG_USER=lucid
PG_PASSWORD=
PG_DB_NAME=lucid
CACHE_VIEWS=false
WINNIE_NAME=winnie-dev
ENABLE_DASHBOARD=           # don't set if you want to setup ssh honeypot only
ABUSEIP_API_KEY=            # remove if you don't want to report the attempts
```

## ✨ Contributors

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://stouder.io"><img src="https://avatars.githubusercontent.com/u/2575182?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Xavier Stouder</b></sub></a><br /><a href="https://github.com/Xstoudi/ssh-winnie/commits?author=Xstoudi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Ad6riel"><img src="https://avatars.githubusercontent.com/u/111901461?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adriel</b></sub></a><br /><a href="#design-Ad6riel" title="Design">🎨</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
