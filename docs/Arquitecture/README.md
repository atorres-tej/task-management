## 🏗️ Architecture Decisions & Patterns Used

### Frontend Architecture (React + TypeScript)

#### **Design Patterns Implemented:**

1. **Context Pattern with Hooks**
   - **AuthContext**: Centralized authentication state management
   - **TasksContext**: Global state for tasks, users, and task statuses
   - Custom hooks like `useTasksWithStatuses()` for component composition
   - Separation of concerns between authentication and business logic

2. **Service Layer Pattern**
   - `authService.ts`: Handles OAuth2/JWT token management and Microsoft authentication
   - `taskService.ts`: Manages all task-related API communications
   - Abstraction layer between UI components and external APIs

3. **Proxy Pattern for API Communication**
   - Next.js API routes as proxy endpoints (`/api/proxy/*`)
   - Avoids CORS issues and provides server-side security
   - Centralized API configuration through constants

4. **Component Composition**
   - Reusable UI components using shadcn/ui library
   - Form components with validation using React Hook Form + Zod
   - Separation between business logic and presentation components

5. **Error Boundary & State Management**
   - Global error handling through contexts
   - Loading states and optimistic updates
   - Centralized state reset and cleanup mechanisms

#### **Key Technical Decisions:**

- **Next.js 14**: App Router for modern React development
- **TypeScript**: Strong typing for better maintainability
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Hook Form + Zod**: Type-safe form validation
- **Context API**: Lightweight state management (avoiding Redux for simplicity)

### Backend Architecture (C# + Azure Functions)

#### **Design Patterns Implemented:**

1. **Repository Pattern**
   - Abstraction layer between business logic and data access
   - Interfaces for testability and dependency injection
   - Separation of concerns for database operations

2. **Dependency Injection (DI)**
   - Azure Functions with DI container
   - Service registration and lifetime management
   - Testable and maintainable code structure


#### **Key Technical Decisions:**

- **Azure Functions**: Serverless compute for scalability
- **Azure SQL Server**: Relational database with proper indexing
- **RESTful API Design**: Standard HTTP methods and status codes
- **Authentication**: Stateless token-based security
- **Postman Collection**: API documentation

### Security Architecture

1. **OAuth2/OpenID Connect**: Microsoft Identity Platform integration
2. **Token Management**: Secure token storage and refresh mechanisms
3. **Proxy Pattern**: Server-side API calls to prevent client-side exposure
4. **Authorization Headers**: Consistent token passing through proxy layer