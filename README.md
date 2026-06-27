# 🏥 MediConnect — Healthcare SaaS Platform

![Backend CI](https://github.com/babumatlori/mediconnect/actions/workflows/backend-ci.yml/badge.svg)
![Frontend CI](https://github.com/babumatlori/mediconnect/actions/workflows/frontend-ci.yml/badge.svg)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-green)
![React](https://img.shields.io/badge/React-18-blue)

## 🌐 Live Demo

| | Link |
|---|---|
| 🎥 Demo Video | [Watch on YouTube](https://youtu.be/Wavg-p3IE_A) |
| 🌐 Frontend | [mediconnect-blush-three.vercel.app](https://mediconnect-blush-three.vercel.app) |
| 🔌 API Gateway | [your-gateway-url.up.railway.app] |

> **Note:** Live deployment includes Auth Service, User Service,
> and API Gateway. Full system with AI features, Redis caching,
> and WebSocket notifications runs via Docker Compose locally
> — demonstrated in the demo video above.

> Click the thumbnail to watch the full demo

A production-grade Healthcare SaaS platform built with microservices architecture. Features AI-powered symptom checking, real-time notifications, and intelligent appointment booking.

---

## 🏗️ Architecture

```
                    ┌─────────────────┐
                    │   React Frontend │
                    │ (Vite + Tailwind)│
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │   Port: 8080    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
    ┌─────────▼──┐  ┌───────▼────┐  ┌─────▼──────┐
    │    Auth    │  │    User    │  │Appointment │
    │  Service  │  │  Service  │  │  Service  │
    │   :8081   │  │   :8082   │  │   :8083   │
    └─────────┬──┘  └───────────┘  └─────┬──────┘
              │                           │
         ┌────▼────┐              ┌───────▼──────┐
         │auth_db  │              │  Redis Cache │
         └─────────┘              └──────────────┘
                                         │
                              ┌──────────▼──────┐
                              │  Notification   │
                              │    Service      │
                              │     :8084       │
                              └─────────────────┘
```

---

## ✨ Features

### Patient Features
- 🔐 JWT Authentication with refresh tokens
- 📅 4-step appointment booking with real-time slot availability
- 🤖 AI Symptom Checker (Gemini API)
- 📄 Medical Report Summarizer (PDF upload)
- 💬 AI Chatbot with booking intent detection
- 🔔 Real-time notifications via WebSocket
- 👤 Profile management

### Doctor Features
- 📋 Today's schedule dashboard
- ✅ Complete appointments with consultation notes
- 🕐 Weekly availability management
- 👨‍⚕️ Professional profile management

### Admin Features
- 📊 Platform overview with statistics
- 👥 Doctor management table

---

## 🛠️ Tech Stack

### Backend
| Service | Tech | Port |
|---|---|---|
| Service Registry | Spring Cloud Eureka | 8761 |
| API Gateway | Spring Cloud Gateway | 8080 |
| Auth Service | Spring Boot + JWT + BCrypt | 8081 |
| User Service | Spring Boot + JPA | 8082 |
| Appointment Service | Spring Boot + Redis Cache | 8083 |
| Notification Service | Spring Boot + WebSocket + Redis Pub/Sub | 8084 |
| AI Service | Spring Boot + Gemini API | 8085 |

### Frontend
| Tech | Purpose |
|---|---|
| React 18 + Vite | UI Framework |
| TailwindCSS | Styling |
| React Hook Form + Zod | Form validation |
| Axios | HTTP client |
| SockJS + STOMP | WebSocket |
| React Router v6 | Routing |

### Infrastructure
| Tech | Purpose |
|---|---|
| MySQL 8 | Primary database (per service) |
| Redis 7 | Caching + Pub/Sub |
| Docker + Docker Compose | Containerization |
| GitHub Actions | CI/CD |

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 20+
- Docker + Docker Compose
- MySQL 8 (or use Docker)

### Option 1 — Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/babumatlori/mediconnect.git
cd mediconnect

# Create environment file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run everything
docker-compose up --build
```

Access the app at `http://localhost:5173`

### Option 2 — Run Locally

```bash
# 1. Start Redis
docker run -d -p 6379:6379 redis:7-alpine

# 2. Create MySQL databases
mysql -u root -p < scripts/init-databases.sql

# 3. Start each service (in separate terminals)
cd service-registry && mvn spring-boot:run
cd api-gateway      && mvn spring-boot:run
cd auth-service     && mvn spring-boot:run
cd user-service     && mvn spring-boot:run
cd appointment-service && mvn spring-boot:run
cd notification-service && mvn spring-boot:run
cd ai-service       && mvn spring-boot:run

# 4. Start frontend
cd frontend && npm install && npm run dev
```

---

## 📡 API Endpoints

### Auth Service (via Gateway)
```
POST /api/auth/register    Register patient or doctor
POST /api/auth/login       Login and get JWT tokens
POST /api/auth/refresh     Refresh access token
```

### Appointment Service (via Gateway)
```
GET  /api/appointments/slots/{doctorId}/{date}   Get available slots
POST /api/appointments/book                       Book appointment
GET  /api/appointments/patient/{id}              Patient appointments
GET  /api/appointments/doctor/{id}               Doctor appointments
PUT  /api/appointments/{id}/cancel               Cancel appointment
PUT  /api/appointments/{id}/complete             Complete appointment
```

### AI Service (via Gateway)
```
POST /api/ai/symptom-check       Analyze symptoms
POST /api/ai/report-summarize    Summarize PDF report
POST /api/ai/recommend-doctors   Recommend doctor type
POST /api/ai/chat                AI chatbot
```

---

## 🔑 Key Design Decisions

**Database-per-Service:** Each microservice owns its database. No cross-service DB queries. Services communicate via REST APIs only.

**Redis Dual Use:** Redis serves two purposes — slot caching (reduces DB load) and Pub/Sub messaging (loose coupling between appointment and notification services).

**JWT Stateless Auth:** No server-side sessions. JWT tokens validated by signature. Refresh token pattern for seamless UX.

**AI Integration:** Gemini API with structured JSON prompts ensures consistent, parseable responses for symptom checking and report summarization.

---

## 👨‍💻 Developer

**Babu Matlori**
- GitHub: [@babumatlori](https://github.com/babumatlori)
- LinkedIn: [babu-matlori](https://linkedin.com/in/babu-matlori-1b1991249)

---

## 📄 License

This project is built for portfolio and learning purposes.
