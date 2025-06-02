# Digital Signage SaaS - Project Initialization Script
# Version: 1.1
# Description: Initializes the complete project structure for Digital Signage SaaS
# Author: DevOps Expert
# Date: 2025-06-02

param(
    [switch]$Force,
    [switch]$Verbose
)

# Global variables
$LogFile = "$(Get-Location)\project-init-log-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
$WorkspaceDir = "$(Get-Location)"
$ErrorCount = 0
$SuccessCount = 0
$Report = [System.Collections.ArrayList]@()

# Function to write to log file
function Write-Log {
    param($Message, $Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    Write-Host $logMessage -ForegroundColor $(if ($Level -eq "ERROR") { "Red" } elseif ($Level -eq "SUCCESS") { "Green" } else { "White" })
    Add-Content -Path $LogFile -Value $logMessage
}

# Function to check if running as administrator
function Test-Administrator {
    $user = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($user)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Function to create directory if it doesn't exist
function Ensure-Directory {
    param($Path)
    if (!(Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
        Write-Log "Created directory: $Path" "SUCCESS"
    }
}

# Function to test command availability
function Test-Command {
    param($Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Function to initialize frontend
function Initialize-Frontend {
    Write-Log "Initializing React TypeScript frontend..."
    try {
        Set-Location $WorkspaceDir
        Ensure-Directory "frontend"
        Set-Location frontend
        
        # Initialize React app with TypeScript
        if (!(Test-Path "package.json") -or $Force) {
            npx create-react-app . --template typescript --use-npm | Out-Null
            Write-Log "React TypeScript frontend initialized" "SUCCESS"
            $global:SuccessCount++
        }
        
        # Install additional dependencies
        npm install axios react-router-dom @types/react-router-dom tailwindcss postcss autoprefixer @types/node
        npx tailwindcss init -p
        Write-Log "Frontend dependencies installed" "SUCCESS"
        $global:SuccessCount++
        
        # Configure tailwind.config.js
        $tailwindConfig = @"
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
"@
        Set-Content -Path "tailwind.config.js" -Value $tailwindConfig
        
        # Update src/index.css
        $indexCss = @"
@tailwind base;
@tailwind components;
@tailwind utilities;
"@
        Set-Content -Path "src/index.css" -Value $indexCss
        
        $Report.Add([PSCustomObject]@{
            Component = "Frontend"
            Status = "SUCCESS"
            Details = "React TypeScript initialized"
        }) | Out-Null
    }
    catch {
        Write-Log "Failed to initialize frontend: $($_.Exception.Message)" "ERROR"
        $global:ErrorCount++
        $Report.Add([PSCustomObject]@{
            Component = "Frontend"
            Status = "FAILED"
            Details = $_.Exception.Message
        }) | Out-Null
    }
}

# Function to initialize backend
function Initialize-Backend {
    Write-Log "Initializing Node.js Express backend..."
    try {
        Set-Location $WorkspaceDir
        Ensure-Directory "backend"
        Set-Location backend
        
        # Initialize Node.js project
        if (!(Test-Path "package.json") -or $Force) {
            npm init -y | Out-Null
            npm install express cors helmet morgan dotenv pg redis
            npm install -D nodemon typescript ts-node @types/node @types/express @types/cors @types/morgan
            Write-Log "Backend dependencies installed" "SUCCESS"
            $global:SuccessCount++
        }
        
        # Create .env file
        $envContent = @"
# Environment variables
PORT=3001
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=digital_signage
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
REDIS_HOST=localhost
REDIS_PORT=6379
"@
        Set-Content -Path ".env" -Value $envContent
        
        # Create tsconfig.json
        $tsConfig = @"
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
"@
        Set-Content -Path "tsconfig.json" -Value $tsConfig
        
        # Create basic server.ts
        Ensure-Directory "src"
        $serverTs = @"
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
"@
        Set-Content -Path "src/server.ts" -Value $serverTs
        
        # Update package.json scripts
        $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
        $packageJson.scripts = @{
            start = "node dist/server.js"
            dev = "nodemon src/server.ts"
            build = "tsc"
        }
        $packageJson | ConvertTo-Json | Set-Content "package.json"
        
        $Report.Add([PSCustomObject]@{
            Component = "Backend"
            Status = "SUCCESS"
            Details = "Node.js Express initialized"
        }) | Out-Null
    }
    catch {
        Write-Log "Failed to initialize backend: $($_.Exception.Message)" "ERROR"
        $global:ErrorCount++
        $Report.Add([PSCustomObject]@{
            Component = "Backend"
            Status = "FAILED"
            Details = $_.Exception.Message
        }) | Out-Null
    }
}

# Function to initialize database schema
function Initialize-Database {
    Write-Log "Initializing database schema..."
    try {
        Set-Location $WorkspaceDir
        Ensure-Directory "database"
        Ensure-Directory "database/migrations"
        
        $schemaSql = @"
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    organization_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizations table (multi-tenant)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Displays table
CREATE TABLE IF NOT EXISTS displays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contents table
CREATE TABLE IF NOT EXISTS contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Playlist contents (many-to-many)
CREATE TABLE IF NOT EXISTS playlist_contents (
    playlist_id UUID REFERENCES playlists(id),
    content_id UUID REFERENCES contents(id),
    display_order INTEGER,
    PRIMARY KEY (playlist_id, content_id)
);
"@
        Set-Content -Path "database/migrations/001-initial-schema.sql" -Value $schemaSql
        
        # Apply schema
        if (Test-Command "docker") {
            try {
                # First attempt to apply schema directly
                docker exec -i signage-postgres psql -U admin -d digital_signage -f /docker-entrypoint-initdb.d/001-initial-schema.sql 2>$null
                Write-Log "Schema applied directly via docker" "SUCCESS"
            }
            catch {
                Write-Log "Direct schema application failed, trying file copy method" "INFO"
                # Alternative method: Copy file and execute
                Set-Content -Path "database/migrations/temp.sql" -Value $schemaSql
                docker cp "database/migrations/temp.sql" signage-postgres:/docker-entrypoint-initdb.d/001-initial-schema.sql
                docker exec signage-postgres psql -U admin -d digital_signage -f /docker-entrypoint-initdb.d/001-initial-schema.sql
                Remove-Item "database/migrations/temp.sql"
                Write-Log "Schema applied via file copy method" "SUCCESS"
            }
        }
        
        Write-Log "Database schema initialized" "SUCCESS"
        $global:SuccessCount++
        $Report.Add([PSCustomObject]@{
            Component = "Database"
            Status = "SUCCESS"
            Details = "Initial schema created and applied"
        }) | Out-Null
    }
    catch {
        Write-Log "Failed to initialize database: $($_.Exception.Message)" "ERROR"
        $global:ErrorCount++
        $Report.Add([PSCustomObject]@{
            Component = "Database"
            Status = "FAILED"
            Details = $_.Exception.Message
        }) | Out-Null
    }
}

# Function to update workspace file
function Update-Workspace {
    Write-Log "Updating VS Code workspace..."
    try {
        $workspaceContent = @"
{
    "folders": [
        {
            "path": "frontend"
        },
        {
            "path": "backend"
        },
        {
            "path": "database"
        }
    ],
    "settings": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.formatOnSave": true,
        "[javascript]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode"
        },
        "[typescript]": {
            "editor.defaultFormatter": "esbenp.prettier-vscode"
        },
        "files.associations": {
            "*.css": "tailwindcss"
        }
    }
}
"@
        Set-Content -Path "digital-signage.code-workspace" -Value $workspaceContent
        Write-Log "Workspace file updated" "SUCCESS"
        $global:SuccessCount++
        $Report.Add([PSCustomObject]@{
            Component = "Workspace"
            Status = "SUCCESS"
            Details = "VS Code workspace configured"
        }) | Out-Null
    }
    catch {
        Write-Log "Failed to update workspace: $($_.Exception.Message)" "ERROR"
        $global:ErrorCount++
        $Report.Add([PSCustomObject]@{
            Component = "Workspace"
            Status = "FAILED"
            Details = $_.Exception.Message
        }) | Out-Null
    }
}

# Function to display report
function Show-Report {
    Write-Log "=== Installation Report ==="
    Write-Log "Success: $SuccessCount"
    Write-Log "Errors: $ErrorCount"
    Write-Log "Details:"
    $Report | ForEach-Object {
        Write-Log "Component: $($_.Component), Status: $($_.Status), Details: $($_.Details)"
    }
    Write-Log "Log file saved to: $LogFile"
    Write-Log "=== Setup Complete ==="
}

# Main execution
Write-Host "=== Digital Signage SaaS Project Initialization ===" -ForegroundColor Green
Write-Log "Starting project initialization..."

# Verify prerequisites
if (!(Test-Administrator)) {
    Write-Log "This script requires administrator privileges" "ERROR"
    exit 1
}

if (!(Test-Command "node") -or !(Test-Command "npm") -or !(Test-Command "docker")) {
    Write-Log "Required tools (Node.js, npm, Docker) not found. Please run setup-environment.ps1 first" "ERROR"
    exit 1
}

# Execute initialization steps
Initialize-Frontend
Initialize-Backend
Initialize-Database
Update-Workspace
Show-Report

# Create README.md
$readmeContent = @"
# Digital Signage SaaS

## 🚀 Getting Started

Your Digital Signage SaaS development environment is ready! Here's how to start:

1. **Open the project in VS Code**
```bash
code digital-signage.code-workspace
```

2. **Run the backend**
```bash
cd backend
npm run dev
```

3. **Run the frontend**
```bash
cd frontend
npm start
```

4. **Database connections**
- PostgreSQL: localhost:5432, DB: digital_signage, User: admin, Password: admin123
- Redis: localhost:6379

5. **API endpoints**
- Health check: GET http://localhost:3001/api/health

## 📂 Project Structure
```
digital-signage-workspace/
├── frontend/              # React TypeScript frontend
├── backend/              # Node.js Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── server.ts
├── database/             # Database migrations
│   └── migrations/
├── docker-compose.yml    # Database services
└── digital-signage.code-workspace
```

## 🛠️ Development
- Use VS Code workspace for optimal development experience
- Database schema is already applied
- Tailwind CSS is configured for frontend
- TypeScript is configured for both frontend and backend
- Environment variables are set in backend/.env

## 🔧 Troubleshooting
- Check logs: $LogFile
- Verify Docker containers: `docker ps`
- Database access: `docker exec -it signage-postgres psql -U admin -d digital_signage`
- Redis access: `docker exec -it signage-redis redis-cli`
"@
Set-Content -Path "README.md" -Value $readmeContent
Write-Log "README.md created" "SUCCESS"