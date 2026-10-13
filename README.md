<div align="center">

# Nest Realtor API

**A real-estate listing API modeled on Realtor, built with NestJS, Prisma, and PostgreSQL.**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## Overview

Nest Realtor API is a backend for a real-estate marketplace. Buyers browse and filter home listings and send inquiries to realtors. Realtors publish and manage their listings, and realtor sign-up is gated by a product key that an admin issues.

## Features

- **Role-based authentication:** sign-up and sign-in for buyers, realtors, and admins, with bcrypt hashing and JWTs.
- **Product-key flow:** an admin generates a key that a realtor must provide to register.
- **Home listings:** create, read, update, and delete, with filtering and multiple images per home.
- **Ownership and role guards** so only the realtor who owns a listing can change it.
- **Buyer inquiries:** buyers message a realtor about a home, and realtors read the messages for their listings.
- **Current-user decorator and interceptor** for JWT-authenticated requests.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Authentication | JSON Web Tokens, bcryptjs |
| Validation | class-validator, class-transformer |
| Infrastructure | Docker |

## Getting Started

### Prerequisites

- Node.js and npm
- A PostgreSQL database

### Installation

```bash
git clone https://github.com/RithyBondeth/Nest-Realtor-Api.git
cd Nest-Realtor-Api
npm install
npx prisma migrate dev
npm run start:dev
```

### Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JSON_TOKEN_KEY` | JWT signing secret |
| `PRODUCT_KEY_SECRET` | Secret used to generate realtor product keys |

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/signup/:userType` | Register a buyer, realtor, or admin |
| `POST` | `/auth/signin` | Sign in and receive a JWT |
| `POST` | `/auth/key` | Generate a realtor product key |
| `GET` | `/auth/me` | Get the current user |
| `GET` | `/home` | List homes, with filters |
| `GET` | `/home/:id` | Get a home |
| `POST` | `/home` | Create a home (realtor) |
| `PUT` | `/home/:id` | Update a home (owner) |
| `DELETE` | `/home/:id` | Delete a home (owner) |
| `POST` | `/home/inquire/:id` | Send an inquiry to the realtor (buyer) |
| `GET` | `/home/:id/messages` | Read the inquiries for a home (owner) |

## Project Structure

```text
Nest-Realtor-Api/
├── prisma/schema.prisma   # User, Home, Image, Message models
└── src/
    ├── user/              # Auth controller and service, user decorator, interceptor
    ├── home/              # Home listing controller, service, DTOs
    ├── guards/            # Role-based auth guard
    ├── decorators/        # Roles decorator
    └── prisma/            # Prisma service
```

## Author

**Rithy Bondeth** — Full Stack Developer & AI Engineer

[![Portfolio](https://img.shields.io/badge/Portfolio-0A0A0A?style=for-the-badge&logo=vercel&logoColor=white)](https://bondeth.dev)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RithyBondeth)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rithy-bondeth-484073282/)
