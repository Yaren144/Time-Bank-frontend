# Time Bank Platform: Frontend

A time-banking platform where users offer services to each other and pay with **time credits** instead of money. This repository holds the React frontend. The platform is split into three services:

| Repository | Role | Stack |
|---|---|---|
| **Time-Bank-frontend** (this repo) | Web UI | React |
| [Time-Bank-main-backend](https://github.com/Yaren144/Time-Bank-main-backend) | Users, services, requests, reviews, credits, admin API | Ruby on Rails, MySQL |
| [Time-Bank-payment-backend](https://github.com/Yaren144/Time-Bank-payment-backend) | Buying time credits (simulated payment service) | Ruby on Rails, MySQL |

## Features

- Registration and login with **JWT authentication**
- Create, browse and manage services; list your own services under *My Services*
- Service request workflow: request → accept / reject / cancel → complete
- Credit transfers and transaction history
- Reviews and favorite services
- **Role-based access control:** an admin panel to manage users, roles and services and to view transactions and balances
- Buying time credits through the separate payment service

## Architecture

```
React frontend ──► main-backend    (REST API, :3000) ──► MySQL
               └─► payment-backend (REST API, :3001) ──► MySQL
```

## Running Locally

1. Start [Time-Bank-main-backend](https://github.com/Yaren144/Time-Bank-main-backend) on port 3000 and [Time-Bank-payment-backend](https://github.com/Yaren144/Time-Bank-payment-backend) on port 3001. Each backend reads its database password from the `DB_PASSWORD` environment variable (see `.env.example`).
2. Start the frontend:

```bash
npm install
npm start
```

## Notes and Next Steps

- The payment service is a simulation built for learning: it validates the input and adds credits, but it does not connect to a real payment provider.
- Planned: move the API URLs into environment variables, containerize all services with Docker Compose, and deploy them to AWS.
