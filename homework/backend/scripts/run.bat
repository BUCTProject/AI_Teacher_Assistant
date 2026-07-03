@echo off
REM Run the development server (Windows)
cd /d "%~dp0.."
python -m uvicorn app.main:app --reload --port 9000

