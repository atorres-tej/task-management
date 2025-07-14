## � Authentication Setup

This application uses Microsoft OAuth 2.0 for authentication. Follow these steps to configure it:

### 1. Microsoft App Registration

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: Your app name
   - **Supported account types**: Choose appropriate option
   - **Redirect URI**: `http://localhost:3000/auth/callback`
5. After registration, note down:
   - **Application (client) ID**
   - **Directory (tenant) ID**
6. Go to **Certificates & secrets** and create a new client secret
7. Note down the **Client secret value**

### 2. Environment Variables in the Frontend

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure with your Microsoft app details:
```bash
# OAuth Configuration - Microsoft
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
NEXT_PUBLIC_MICROSOFT_TENANT_ID=common
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback

# Server-side credentials (for secure token exchange)
MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret_here
MICROSOFT_TENANT_ID=common
REDIRECT_URI=http://localhost:3000/auth/callback
```

### 3. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 4. Run the Application

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## � Important Notes

- Users must sign in with their Microsoft credentials to access the application
- Make sure your Microsoft app registration is configured correctly
- The redirect URI in Azure AD must match the one in your environment variables
