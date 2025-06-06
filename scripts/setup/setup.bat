@ECHO OFF
ECHO Setting up Digital Signage SaaS...
SET "PROJECT_ROOT=%~dp0..\.."

ECHO Installing backend dependencies...
CD /D "%PROJECT_ROOT%\backend"
IF NOT EXIST package.json (
    ECHO Error: package.json not found in backend
    EXIT /B 1
)
npm install
IF %ERRORLEVEL% NEQ 0 (
    ECHO Failed to install backend dependencies
    EXIT /B 1
)

ECHO Installing frontend dependencies...
CD /D "%PROJECT_ROOT%\frontend"
IF NOT EXIST package.json (
    ECHO Error: package.json not found in frontend
    EXIT /B 1
)
npm install
IF %ERRORLEVEL% NEQ 0 (
    ECHO Failed to install frontend dependencies
    EXIT /B 1
)

ECHO Installing player-web dependencies...
CD /D "%PROJECT_ROOT%\player-web"
IF NOT EXIST package.json (
    ECHO Error: package.json not found in player-web
    EXIT /B 1
)
npm install
IF %ERRORLEVEL% NEQ 0 (
    ECHO Failed to install player-web dependencies
    EXIT /B 1
)

ECHO Setup complete!
CD /D "%PROJECT_ROOT%"