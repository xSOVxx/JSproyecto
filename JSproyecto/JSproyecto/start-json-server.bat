@echo off
SETLOCAL

REM Define la ruta actual
SET CURRENT_DIR=%~dp0

REM Define la ubicación de Node.js portable
SET NODE_PATH=%CURRENT_DIR%nodejs

REM Configura el PATH para incluir Node.js
SET PATH=%NODE_PATH%;%PATH%

REM Muestra información de inicio del servidor
echo ======================================
echo Starting Basic JSON Server...
echo ======================================
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo ======================================
echo.

REM Navega a la carpeta del proyecto
cd %CURRENT_DIR%

REM Inicia JSON Server con configuración mínima
IF EXIST "%NODE_PATH%\node_modules\.bin\json-server.cmd" (
    call "%NODE_PATH%\node_modules\.bin\json-server.cmd" --watch server/db.json --port 3000
) ELSE (
    node "%NODE_PATH%\node_modules\json-server\lib\cli\bin.js" --watch server/db.json --port 3000
)

pause