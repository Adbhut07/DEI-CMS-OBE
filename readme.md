# Cognitia – Outcome-Based Education (OBE) Management System

Cognitia is a full-stack Outcome-Based Education (OBE) management system developed as a minor project under the guidance of Prof. D. Bhagwan Das during the DETD course. The application streamlines the process of tracking and evaluating academic outcomes, ensuring that educational objectives align with program goals.

Live Application: [Link](https://cognitia.asdevx.com)

ER Diagram: [Link](https://drive.google.com/file/d/1JA8HWX2vH1DCo4Ds_W8VzwuuscKpe9kU/view?usp=sharing)

## 🚀 Features

Course & Program Outcome Management: Define and manage Course Outcomes (COs) and Program Outcomes (POs).

CO-PO Mapping: Establish and visualize the relationship between COs and POs.

Attainment Calculations: Compute attainment levels for COs and POs based on student performance.

Role-Based Access Control: Differentiate access and functionalities for Admins, Faculty, and Students.

Automated CI/CD Pipeline: Seamless deployment using GitHub Actions, Docker, and NGINX.

## 🛠️ Tech Stack
Frontend -
1. Framework: Next.js with TypeScript
2. UI Library: ShadCN UI
3. Deployment: Vercel

Backend -
1. Runtime: Node.js with TypeScript
2. ORM: Prisma
3. Database: PostgreSQL
4. Deployment: AWS EC2 using Docker and NGINX
5. CI/CD: GitHub Actions

## 📁 Project Structure

```graphql
DEI-CMS-OBE/
├── backend/          # Node.js backend with Prisma ORM
├── client/           # Next.js frontend with ShadCN UI
├── .github/workflows # GitHub Actions for CI/CD
├── docker/           # Docker configurations
└── README.md         # Project documentation
```

## ⚙️ Setup Instructions
### Backend Setup
#### 1. Navigate to the backend directory:
```bash
cd backend
```

#### 2. Install dependencies:
```bash
npm install
```

#### 3. Configure environment variables:
Create a .env file and add your database URL:
```bash
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
```
#### 4. Run database migrations:
```bash
npx prisma migrate dev --name init
```
#### 5. Start the backend server:
```bash
npm run start
```

### Frontend Setup

#### 1. Navigate to the client directory:
```bash
cd client
```

#### 2. Install dependencies:
```bash
npm install
```

#### 3. Configure environment variables:
Create a .env file and add your backend API URL:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 4. Start the frontend server:
```bash
npm run dev
```

## Deployment

Docker & NGINX: The backend is containerized using Docker and served via NGINX on an AWS EC2 instance.

CI/CD Pipeline: GitHub Actions automate the build and deployment process, ensuring seamless updates on code changes.

Frontend Deployment: The Next.js frontend is deployed on Vercel for optimal performance and scalability.


## License

[MIT](https://choosealicense.com/licenses/mit/)
