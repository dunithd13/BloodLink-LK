# BloodLink LK 🩸

> **Find Blood. Connect People. Save Lives.**

BloodLink LK is a web-based platform designed to connect blood requesters with compatible blood donors in Sri Lanka. The system supports registered donor and requester accounts, blood request management, donor matching, direct contact information, and an emergency request flow that can be used without registration or login.

---

## ⚠️ The Problem

During urgent medical situations, finding a suitable blood donor quickly can be difficult. Blood requests may be shared through different communication channels, making it difficult for requesters to identify compatible donors in their area and obtain their contact information quickly.

This situation becomes even more critical during emergencies, where every minute can matter and registering for a new account may create additional delays.

BloodLink LK addresses this problem by providing a centralized platform where:

* Donors can register and provide their blood group and contact information.
* Requesters can register and submit blood requests with a deadline.
* Requesters can view compatible donors and their contact information.
* Donors can view current blood requests and requester contact details.
* Emergency requesters can submit urgent blood requests without registering or logging in.

---

# 💡 Proposed Solution

BloodLink LK provides a simple platform for connecting blood donors and blood requesters.

The system supports two registered user roles:

### 🩸 Donor

A donor can:

* Register for the platform.
* Log in to the system.
* Provide blood group and location details.
* Provide contact information.
* Set donor availability.
* View current blood requests.
* View requester contact information.
* Contact requesters manually.

### 🧑‍💼 Requester

A requester can:

* Register for the platform.
* Log in to the system.
* Create a blood request.
* Select the required blood group.
* Specify the request location.
* Set a deadline.
* Set the urgency level.
* View compatible donors.
* View donor contact information.
* Contact donors manually.

### 🚨 Emergency Requester

An emergency requester does not need to create an account.

The emergency workflow is:

```text
Emergency Blood Request
          ↓
Enter requester information
          ↓
Select blood group
          ↓
Select location
          ↓
Set deadline
          ↓
Submit request
          ↓
Find compatible donors
          ↓
View donor contact details
          ↓
Contact donor manually
```

This provides a faster path for urgent requests.

---

# ✨ Main Features

## 1. User Registration

Users can register as either:

* Donor
* Requester

The registration process collects the required personal and contact information.

Donor registration additionally captures:

* Blood group
* Location
* Donor information
* Availability

---

## 2. User Login

Registered users can log in using their email address and password.

The backend uses password hashing rather than storing plain-text passwords.

---

## 3. Donor Profile

Donors can maintain information including:

* Full name
* Blood group
* Location / district
* Contact number
* Description
* Availability status

---

## 4. Blood Request Creation

Registered requesters can create blood requests containing:

* Required blood group
* Location
* Deadline
* Urgency
* Contact number
* Additional description

Each blood request is assigned a unique request number.

Example:

```text
BL-202609040001
```

---

## 5. Emergency Blood Request

Users who need blood urgently can submit an emergency request without registration or login.

Emergency requests include:

* Requester name
* Contact number
* Blood group
* Location
* Deadline
* Description

Emergency requests are marked separately and can be highlighted in the application.

---

## 6. Compatible Donor Matching

The system determines compatible donor blood groups for a requested blood group.

For example:

```text
Requested Blood Group
        O+
        ↓
Compatible Donor Groups
        O-
        O+
```

The system can then display matching donor information.

Matching can also be filtered by location.

---

## 7. Donor Search

Users can search available donors by:

* Blood group
* Location / district

Only donors who are currently marked as available are returned.

---

## 8. Current Blood Requests

Donors can view current blood requests posted by requesters.

Request information can include:

* Blood group
* Requester name
* Location
* Deadline
* Urgency
* Contact number
* Request status

This allows donors to identify requests they may be able to help with and contact the requester manually.

---

## 9. Blood Request Status Management

Blood requests can be tracked using statuses such as:

```text
Active
Matched
Fulfilled
Cancelled
```

This provides a simple way to track the current state of a request.

---

## 10. Donor Availability Management

Donors can update their availability:

```text
Available
Unavailable
```

Only available donors are considered when retrieving donor matching results.

---

## 11. Search and Filtering

The application supports searching and filtering blood-related information using:

* Blood group
* District / location
* Urgency
* Request status
* Search text

---

## 12. Sri Lankan Location Support

The frontend provides Sri Lankan district-based selection and filtering to support local donor and blood-request discovery.

---

## 13. Responsive User Interface

The application is designed to work across:

* Desktop
* Tablet
* Mobile

The major pages and workflows are designed with responsive layouts for different screen sizes.

---

# 🏗️ System Architecture

BloodLink LK uses a separate frontend and backend architecture.

```text
┌─────────────────────────────────┐
│          React Frontend         │
│                                 │
│  Home                           │
│  Find Blood                     │
│  Request Blood                  │
│  Blood Requests                 │
│  Login / Register               │
│  User Dashboard                 │
│  Management                     │
└───────────────┬─────────────────┘
                │
                │ REST API
                ▼
┌─────────────────────────────────┐
│         .NET 8 Web API          │
│                                 │
│  Authentication                 │
│  Blood Requests                 │
│  Donor Management               │
│  Compatibility Matching         │
└───────────────┬─────────────────┘
                │
                │ Entity Framework Core
                ▼
┌─────────────────────────────────┐
│           PostgreSQL            │
└─────────────────────────────────┘
```

---

# 🛠️ Technologies Used

## Frontend

* React 19
* Vite
* React DOM
* Lucide React
* JavaScript / JSX
* CSS

## Backend

* .NET 8 Web API
* Entity Framework Core
* PostgreSQL
* Npgsql Entity Framework Core Provider
* Swagger / OpenAPI
* BCrypt.Net
* DotNetEnv

## Development Tools

* Git
* GitHub
* Visual Studio Code / Visual Studio
* PostgreSQL

---

# 📂 Project Structure

```text
BloodLinkLK/
│
├── frontend/
│   └── frontend/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── Badges.jsx
│       │   │   ├── Footer.jsx
│       │   │   └── Navbar.jsx
│       │   │
│       │   ├── pages/
│       │   │   ├── Home.jsx
│       │   │   ├── FindBlood.jsx
│       │   │   ├── RequestBlood.jsx
│       │   │   ├── BloodRequests.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── UserDashboard.jsx
│       │   │   └── Management.jsx
│       │   │
│       │   ├── data/
│       │   │   └── mockData.js
│       │   │
│       │   ├── utils/
│       │   │   └── auth.js
│       │   │
│       │   ├── App.jsx
│       │   ├── App.css
│       │   ├── index.css
│       │   └── main.jsx
│       │
│       ├── package.json
│       ├── vite.config.js
│       └── .gitignore
│
└── backend/
    └── BloodLinkLK.API/
        ├── Controllers/
        │   ├── AuthController.cs
        │   ├── BloodRequestsController.cs
        │   └── DonorsController.cs
        │
        ├── Data/
        │   └── AppDbContext.cs
        │
        ├── DTOs/
        │   ├── AuthResponseDto.cs
        │   ├── CreateBloodRequestDto.cs
        │   ├── LoginDto.cs
        │   ├── RegisterDto.cs
        │   └── UpdateRequestStatusDto.cs
        │
        ├── Models/
        │   ├── User.cs
        │   ├── BloodRequest.cs
        │   └── DonorAvailability.cs
        │
        ├── Services/
        │   └── BloodCompatibilityService.cs
        │
        ├── Migrations/
        │
        ├── Program.cs
        ├── appsettings.json
        ├── .env
        ├── .env.example
        └── BloodLinkLK.API.csproj
```

---

# 👥 Team Members & Contributions

| Member ID       | Contribution             |
| --------------- | ------------------------ |
| **IT24101861**  | Database + Features      |
| **IT241000802** | Integration + Deployment |
| **IT24102710**  | Frontend / UI            |
| **IT24101801**  | Backend                  |

---

# 🚀 Installation & Execution

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* .NET 8 SDK
* PostgreSQL
* Git
* Visual Studio Code or Visual Studio

Check the installed versions:

```bash
node --version
```

```bash
npm --version
```

```bash
dotnet --version
```

The backend requires **.NET 8**.

---

# 🎨 Frontend Setup

Navigate to the frontend:

```bash
cd frontend/frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The terminal will display the local development URL, for example:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

---

## Frontend Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run the frontend linter:

```bash
npm run lint
```

---

# ⚙️ Backend Setup

Navigate to the backend:

```bash
cd backend/BloodLinkLK.API
```

Restore .NET dependencies:

```bash
dotnet restore
```

---

## Entity Framework Core CLI

Install Entity Framework Core CLI:

```bash
dotnet tool install --global dotnet-ef
```

If already installed:

```bash
dotnet tool update --global dotnet-ef
```

Verify:

```bash
dotnet ef --version
```

---

# 📦 Backend Packages

The backend uses:

* `Npgsql.EntityFrameworkCore.PostgreSQL`
* `Microsoft.EntityFrameworkCore.Design`
* `DotNetEnv`
* `BCrypt.Net-Next`

Restore them with:

```bash
dotnet restore
```

---

# 🔐 Environment Configuration

Create a `.env` file inside:

```text
backend/BloodLinkLK.API/
```

Add the PostgreSQL connection string:

```env
ConnectionStrings__DefaultConnection=Host=localhost;Database=BloodLineLK;Username=postgres;Password=YOUR_PASSWORD
```

Example:

```env
ConnectionStrings__DefaultConnection=Host=localhost;Database=BloodLineLK;Username=postgres;Password=123
```

### ⚠️ Important

Do not commit the real `.env` file to GitHub.

The `.gitignore` file should contain:

```gitignore
.env
.env.*
!.env.example
```

Create `.env.example`:

```env
ConnectionStrings__DefaultConnection=Host=localhost;Database=BloodLineLK;Username=postgres;Password=YOUR_PASSWORD
```

---

# 🗄️ Database Setup

Make sure PostgreSQL is running.

Create a PostgreSQL database named:

```text
BloodLineLK
```

The database name must match the name configured in `.env`.

Create the Entity Framework migration:

```bash
dotnet ef migrations add InitialCreate
```

Apply the migration:

```bash
dotnet ef database update
```

---

# 🧪 Build the Backend

Run:

```bash
dotnet build
```

A successful build should show:

```text
Build succeeded.
```

---

# ▶️ Run the Backend

Start the API:

```bash
dotnet run
```

The terminal will display the local API URL.

For example:

```text
Now listening on: https://localhost:7001
```

Open Swagger:

```text
https://localhost:7001/swagger
```

Use the actual port displayed in the terminal if it is different.

---

# 🔄 Development Workflow

## Frontend

After frontend changes:

```bash
npm run lint
npm run build
npm run dev
```

## Backend

After backend changes:

```bash
dotnet build
dotnet run
```

## Database Model Changes

After modifying an Entity Framework model:

```bash
dotnet ef migrations add <MigrationName>
```

Then:

```bash
dotnet ef database update
```

Example:

```bash
dotnet ef migrations add AddBloodRequestChanges
dotnet ef database update
```

---

# 🔌 Main API Endpoints

## Authentication

### Register

```http
POST /api/Auth/register
```

Registers a donor or requester.

### Login

```http
POST /api/Auth/login
```

Authenticates a registered user.

---

## Blood Requests

### Get all blood requests

```http
GET /api/BloodRequests
```

### Get a blood request

```http
GET /api/BloodRequests/{id}
```

### Create a registered blood request

```http
POST /api/BloodRequests
```

### Create an emergency blood request

```http
POST /api/BloodRequests/emergency
```

This endpoint supports the emergency workflow without registration or login.

### Update blood request status

```http
PUT /api/BloodRequests/{id}/status
```

---

## Compatible Donors

### Find compatible donors near the request location

```http
GET /api/BloodRequests/{id}/compatible-donors
```

### Find compatible donors from all locations

```http
GET /api/BloodRequests/{id}/compatible-donors/all-locations
```

---

## Donors

### Get available donors

```http
GET /api/Donors
```

### Get donor by ID

```http
GET /api/Donors/{id}
```

### Update donor availability

```http
PUT /api/Donors/{id}/availability
```

### Delete donor

```http
DELETE /api/Donors/{id}
```

---

# 🔁 Application Workflow

## Registered Donor

```text
Register
   ↓
Login
   ↓
Create / Update Donor Profile
   ↓
Set Blood Group
   ↓
Set Location
   ↓
Set Availability
   ↓
View Current Blood Requests
   ↓
View Requester Contact Details
   ↓
Contact Requester Manually
```

---

## Registered Requester

```text
Register
   ↓
Login
   ↓
Create Blood Request
   ↓
Select Blood Group
   ↓
Select Location
   ↓
Set Deadline
   ↓
Set Urgency
   ↓
Submit Request
   ↓
Find Compatible Donors
   ↓
View Donor Contact Details
   ↓
Contact Donor Manually
```

---

## Emergency Requester

```text
Emergency Request
       ↓
No Registration
       ↓
No Login
       ↓
Enter Requester Details
       ↓
Select Blood Group
       ↓
Select Location
       ↓
Set Deadline
       ↓
Submit Emergency Request
       ↓
Find Compatible Donors
       ↓
View Donor Contact Details
       ↓
Contact Donor Manually
```

---

# 🗃️ Database Models

## User

Stores registered donor and requester accounts.

```text
Id
FullName
Email
PasswordHash
ContactNumber
Role
CreatedAt
```

Roles:

```text
Donor
Requester
```

---

## DonorAvailability

Stores donor information.

```text
Id
UserId
Name
BloodGroup
Location
ContactNumber
Description
IsAvailable
CreatedAt
```

---

## BloodRequest

Stores blood-request information.

```text
Id
RequestNumber
RequesterId
RequesterName
ContactNumber
BloodGroup
Location
Deadline
Urgency
Description
Status
IsEmergency
CreatedAt
```

---

# ✅ Validation

The application validates important user input, including:

* Required fields
* Email format
* Password length
* Phone number format
* Blood group
* User role
* Request deadline
* Request urgency
* Request status
* Donor availability

---

# 🔒 Security Considerations

BloodLink LK uses BCrypt.Net for password hashing instead of storing plain-text passwords.

The PostgreSQL connection string is stored using environment variables.

For a production deployment, additional security measures would be required, including:

* Strong authentication and authorization
* Secure token/session management
* HTTPS
* Rate limiting
* Privacy protection
* Audit logging
* Secure database configuration
* Verification of donor information

---

# ⚠️ Project Scope

BloodLink LK is a software-engineering prototype developed for the SE3090 Mini Hackathon.

The application is designed to demonstrate a platform for connecting blood requesters and donors.

It is **not** intended to:

* Replace an official blood bank system
* Make medical decisions
* Determine medical eligibility for donation
* Guarantee actual blood availability
* Replace professional medical services

Donor compatibility is implemented as a software feature for this prototype. In a real-world deployment, blood compatibility and availability should be verified through appropriate authorized medical or blood-service channels.

---

# 🤖 AI Tools Used

The following AI tools were used during development:

* **ChatGPT**
* **Gemini**
* **Claude**


---

# 📝 AI Prompt Log

The following section will be completed with the actual prompts used during development.

# 🤖 AI Tools Used

The project team used the following AI tools during the development of BloodLink LK:

* **Gemini**
* **ChatGPT**
* **Claude**

The tools were used for project planning, database development, backend development, authentication, repository management, frontend planning, deployment, troubleshooting, and documentation.

---

# 📝 AI Prompt Log

The following table documents the AI tools, prompts, purposes, and outcomes used by the team during development.

| Team Member          | AI Tool     | Prompt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Purpose                                                                                                                                                                                              | Output / How It Was Used                                                                                                                                                                                                                                                               |
| -------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **IT24101861**       | **Gemini**  | **"ok, we divide our workload and my part is the database and its features. i plan to use posgresql... guide me through on what i can do independantly... lets start from if my sql is working properly or not"**                                                                                                                                                                                                                                                                                           | To independently develop the database and database-related features, starting with PostgreSQL setup and verification.                                                                                | Verified the local PostgreSQL server using `pg_isready`, manually created the database through the `psql` shell, and applied Entity Framework Core migrations.                                                                                                                         |
| **IT24101861**       | **Gemini**  | **"Create a repository on GitHub... Your README.md must include: project title; the selected problem; the proposed solution... heres the story, this is exact workflow... catch the technologies used from these two front and backend zips"**                                                                                                                                                                                                                                                              | To generate the project README.md, organize the documentation requirements, and align the project details with the actual frontend and backend implementation.                                       | Used to structure the GitHub README, document the project workflow, technologies, features, team responsibilities, and prepare the documentation for the project submission.                                                                                                           |
| **IT24100802**       | **ChatGPT** | **"I need to create the repository for our new project and organize the project properly so that each team member can work on their own student ID branch and later merge their work into the main branch. We use React front end and ASP.NET backend with PostgreSQL database. I need guidance for proper repo creating."**                                                                                                                                                                                | To create a properly organized and manageable GitHub repository that supports team-based development using student ID branches and a main branch.                                                    | Provided guidance for organizing and managing the GitHub repository and establishing a suitable collaborative branching workflow.                                                                                                                                                      |
| **IT24100802**       | **ChatGPT** | **"To host the database I am planning to use Supabase for hosting the PostgreSQL database. I also need to deploy the React frontend on Vercell and ASP.NET Core backend online. Can you explain the simplest way to connect my ASP.NET Core backend to a Supabase PostgreSQL database during development and deployment?"**                                                                                                                                                                                 | To determine how to connect the ASP.NET Core backend to a Supabase PostgreSQL database during development and deployment, while deploying the frontend and backend separately.                       | Provided guidance for connecting the backend to Supabase PostgreSQL and configuring the deployed backend environment.                                                                                                                                                                  |
| **IT24100802**       | **ChatGPT** | **"I want to know about the alternative hosting platform for our ASP.NET backend with Supabase PostgreSQL database"**                                                                                                                                                                                                                                                                                                                                                                                       | To identify an alternative hosting platform for the ASP.NET Core backend when the initially considered platform was not suitable.                                                                    | Identified **Railway** as an alternative platform for hosting the ASP.NET Core backend with Supabase PostgreSQL.                                                                                                                                                                       |
| **IT24102710**       | **ChatGPT** | **"Initialize this hackathon project. First, read: AGENTS.md, PROJECT.md, TASK.md. Then inspect the project structure and existing implementation. Do not modify any files yet. Give me a concise report containing: What the project does, Current technology stack, Current architecture, Existing features, Current task from TASK.md, Files relevant to the current task, Any obvious problems or risks, Your recommended implementation approach. Wait for my approval before making major changes."** | To understand the existing project instructions, architecture, technologies, implementation, current tasks, relevant files, risks, and recommended development approach before making major changes. | Produced a project initialization report covering the application's purpose, technology stack, architecture, existing features, current task, relevant files, potential risks, and recommended implementation approach without modifying project files.                                |
| **IT24102710**       | **ChatGPT** | **"i want to modify my task.md file for user login and registration, take these instructions and update the task.md file. create one admin and give me the credentials. for other users there should be a registration page and login too. followings are the input fields for registration page: name, email, password and confirm password (give instruction to create strong password), location, contact number, BloodGroup. followings are the input fields for login page: email and password."**     | To update the development task with user authentication and registration requirements for regular users and an administrator.                                                                        | Produced an updated `TASK.md` specification covering user registration, login, password requirements, user roles, administrator setup, and the required registration/login fields.                                                                                                     |
| **IT24101801**       | **ChatGPT** | **"Build a .NET 8 ASP.NET Core Web API backend for a BloodLink LK blood donation platform using PostgreSQL and Entity Framework Core. Create models, DTOs, controllers, validation, blood-request management, donor availability, and blood-group compatibility matching. The system should support registered donors and requesters, plus emergency blood requests without login. Do not include unnecessary features such as payments or complex user management."**                                      | To generate the initial backend architecture and core BloodLink LK API functionality.                                                                                                                | Generated the initial .NET 8 backend structure including models, DTOs, `AppDbContext`, authentication-related files, `BloodRequestsController`, `DonorsController`, and blood compatibility logic. The generated code was reviewed and modified to match the project's exact workflow. |
| **IT24101801**       | **ChatGPT** | **"Help me deploy my BloodLink LK .NET 8 ASP.NET Core backend with a PostgreSQL database hosted on Supabase. My GitHub repository contains separate backend and frontend folders. Explain how to configure the backend deployment, environment variables, database connection string, root directory, and deployment platform. Troubleshoot errors related to PostgreSQL connection strings, GitHub branch configuration, and hosting the .NET 8 API."**                                                    | To configure and troubleshoot deployment of the .NET 8 backend and securely connect it to the Supabase PostgreSQL database.                                                                          | Provided deployment configuration guidance and troubleshooting steps for the ASP.NET Core backend, PostgreSQL connection, environment variables, GitHub branch configuration, and hosting setup.                                                                                       |                                                                                                                                                                                                                                                  |

### AI Usage Note

AI-generated outputs were reviewed by the team and adapted to the project's actual requirements, architecture, codebase, and workflow. AI tools were used as development and documentation assistance rather than as a replacement for team implementation, testing, and verification.

---

# 🔗 Project Links

The following links will be added after deployment and repository setup.

### GitHub Repository

```text
https://github.com/dunithd13/BloodLink-LK.git
```

### Deployed Application

```text[
[ ADD DEPLOYED APPLICATION LINK HERE ]](https://blood-link-lk.vercel.app/)
```

### Demonstration Video

```text
[[ ADD DEMONSTRATION VIDEO LINK HERE ]](https://mysliit-my.sharepoint.com/:v:/g/personal/it24101861_my_sliit_lk/IQAMq3P2McUzRqqNrbRkbJjdAReTpFJRwnQARhcI8Wun88c?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=1BKkC1)
```

---

# 🚀 Quick Start

## Backend

```bash
cd backend/BloodLinkLK.API
dotnet restore
dotnet ef database update
dotnet build
dotnet run
```

## Frontend

```bash
cd frontend/frontend
npm install
npm run dev
```

Open the URLs displayed by the backend and frontend development servers.

---

# 📌 Project Summary

BloodLink LK provides a focused digital workflow for connecting people who need blood with people willing to donate.

The platform supports:

```text
Registered Donor
       ↕
Registered Requester
       ↕
Blood Compatibility
       ↕
Contact Information
       ↕
Manual Communication
```

It also provides a public emergency workflow:

```text
Emergency Requester
       ↓
No Registration
       ↓
No Login
       ↓
Blood Request
       ↓
Compatible Donors
       ↓
Contact Details
       ↓
Manual Communication
```

BloodLink LK combines a responsive React frontend, a .NET 8 Web API backend, and PostgreSQL to provide a practical Sri Lanka-focused blood request and donor availability platform.
