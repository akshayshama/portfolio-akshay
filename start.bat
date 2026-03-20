@echo off
echo Setting up Portfolio Backend...
echo.

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt -q

echo.
echo Starting server at http://localhost:8000
echo Press Ctrl+C to stop
echo.

python main.py

pause
