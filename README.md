# Investment-Portfolio-Tracker

> Track investment portfolios with a React frontend and Java Maven backend.

![GitHub stars](https://img.shields.io/github/stars/dido1043/Investment-Portfolio-Tracker?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/dido1043/Investment-Portfolio-Tracker?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/dido1043/Investment-Portfolio-Tracker?style=for-the-badge&logo=github) ![Last commit](https://img.shields.io/github/last-commit/dido1043/Investment-Portfolio-Tracker?style=for-the-badge&logo=github) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Java (Maven)](https://img.shields.io/badge/Java%20(Maven)-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📑 Table of Contents

- [Description](#description)
- [Key Features](#key-features)
- [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Key Dependencies](#key-dependencies)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 📝 Description

Investment-Portfolio-Tracker is a containerized web application designed to help users monitor and manage their investment assets. The project provides a structured interface to keep track of financial holdings, centralizing portfolio data in one accessible platform.

At an architectural level, the application separates concerns into a dedicated Java Maven backend API and a React frontend client. The frontend is built using Vite and Tailwind CSS for streamlined styling and fast rendering, and uses react-hot-toast for interactive UI feedback. A Dockerfile and docker-compose.yml are provided in the root directory to orchestrate and run both services together seamlessly.

## ✨ Key Features

- **⚛️ React and Vite Frontend** — A responsive client-side interface built with React, styled with Tailwind CSS, and bundled using Vite.
- **☕ Java Maven API Backend** — A robust backend service built with Java and Maven to handle portfolio business logic and data.
- **🐳 Docker Compose Orchestration** — Multi-container configuration files to easily build and run the API and frontend services in isolated environments.
- **🔔 Rich Status Notifications** — User feedback messages powered by react-hot-toast and configured with a dark slate theme.

## 🎯 Use Cases

- Deploying a self-hosted, private investment dashboard using Docker Compose.
- Using the codebase as a template for building full-stack applications with a Java API and a React client.
- Prototyping responsive financial monitoring tools with pre-integrated toast notifications and modern styling.

## 🛠️ Tech Stack

- 🐳 **Docker**
- ☕ **Java (Maven)**
- 🟨 **JavaScript**
- ⚛️ **React**
- 🌬️ **Tailwind CSS**
- ⚡ **Vite**

## ⚡ Quick Start

```bash

# 1. Clone the repository
git clone https://github.com/dido1043/Investment-Portfolio-Tracker.git

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

## 📦 Key Dependencies

```
@tailwindcss/vite: ^4.3.0
axios: ^1.16.1
lucide-react: ^1.17.0
react: ^19.2.6
react-dom: ^19.2.6
react-hot-toast: ^2.6.0
react-router-dom: ^7.15.1
recharts: ^3.8.1
tailwindcss: ^4.3.0
spring-boot-starter-web: managed
spring-boot-starter-data-jpa: managed
spring-boot-starter-jdbc: managed
modelmapper: managed
postgresql: managed
lombok: managed
```

## 🚀 Available Scripts

- **dev** — `npm run dev`
- **build** — `npm run build`
- **lint** — `npm run lint`
- **preview** — `npm run preview`

## 📁 Project Structure

```
.
├── CLAUDE.md
├── Dockerfile
├── InvestmentPortfolioTrackerAPI
│   ├── .mvn
│   │   └── wrapper
│   │       └── maven-wrapper.properties
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java
│       │   │   └── org
│       │   │       └── ...
│       │   └── resources
│       │       └── application.properties
│       └── test
│           └── java
│               └── org
│                   └── ...
├── client
│   └── investment_portfolio
│       ├── eslint.config.js
│       ├── index.html
│       ├── package.json
│       ├── public
│       │   ├── favicon.svg
│       │   └── icons.svg
│       ├── src
│       │   ├── App.jsx
│       │   ├── api
│       │   │   ├── accountApi.js
│       │   │   ├── authApi.js
│       │   │   ├── axios.js
│       │   │   ├── companyApi.js
│       │   │   ├── transactionApi.js
│       │   │   └── userApi.js
│       │   ├── assets
│       │   │   ├── hero.png
│       │   │   ├── react.svg
│       │   │   └── vite.svg
│       │   ├── components
│       │   │   ├── forms
│       │   │   │   └── ...
│       │   │   ├── layout
│       │   │   │   └── ...
│       │   │   └── ui
│       │   │       └── ...
│       │   ├── contexts
│       │   │   └── AuthContext.jsx
│       │   ├── index.css
│       │   ├── main.jsx
│       │   └── pages
│       │       ├── AccountDetail.jsx
│       │       ├── Accounts.jsx
│       │       ├── Companies.jsx
│       │       ├── Dashboard.jsx
│       │       ├── HomePage.jsx
│       │       ├── Landing.jsx
│       │       ├── Profile.jsx
│       │       ├── Transactions.jsx
│       │       ├── auth
│       │       │   └── ...
│       │       └── user
│       │           └── ...
│       └── vite.config.js
└── docker-compose.yml
```

## 🛠️ Development Setup

### Node.js / JavaScript
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` (or `yarn` / `pnpm install` / `bun install`)
3. Start the dev server: see the **Quick Start** above

### Docker
1. `docker build -t my-app .`
2. `docker run -p 3000:3000 my-app`

## 🚢 Deployment

### Docker
```bash
docker build -t investment-portfolio-tracker .
docker run -p 3000:3000 investment-portfolio-tracker
```

### Docker Compose
```bash
docker compose up -d
```

## 👥 Contributing

Contributions are welcome! Here's the standard flow:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/dido1043/Investment-Portfolio-Tracker.git`
3. **Branch**: `git checkout -b feature/your-feature`
4. **Commit**: `git commit -m 'feat: add some feature'`
5. **Push**: `git push origin feature/your-feature`
6. **Open** a pull request
