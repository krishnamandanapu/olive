# Olive - Interview Assessment

A full-stack application to view dog breeds and images, built with FastAPI (backend) and React (frontend).

## Project Structure

```
olive/
├── backend/          # FastAPI backend
├── frontend/         # React + Vite frontend
```

## Prerequisites

- **Python 3.12+** (for backend)
- **Node.js 18+** (for frontend)


## Backend Setup

### Installing uv

#### macOS / Linux (Unix)
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### Windows (PowerShell)
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

#### Alternative: Using pip
```bash
pip install uv
```

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create Python 3.12 virtual environment using uv:**
   ```bash
   uv venv --python 3.12
   ```

3. **Install dependencies:**
   ```bash
   uv sync
   ```

4. **Start the backend server:**
   ```bash
   uv run uvicorn main:app --reload
   ```

   The API will be available at: `http://localhost:8000`
   
   API Documentation: `http://localhost:8000/docs`

## Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at: `http://localhost:5173`