# Portfolio Backend

## Setup

1. **Create virtual environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment:**
```bash
copy .env.example .env
```
Edit `.env` and add your API key (see options below).

4. **Run the server:**
```bash
python main.py
```

5. **Open browser:**
```
http://localhost:8000
```

## AI Chatbot Options

### Option 1: OpenAI (Recommended)
Add to `.env`:
```
OPENAI_API_KEY=sk-your_key_here
```

### Option 2: Ollama (Free, Local)
1. Install [Ollama](https://ollama.ai/)
2. Run: `ollama pull llama2`
3. Add to `.env`:
```
USE_OLLAMA=true
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=llama2
```

### Option 3: Fallback (No API needed)
Leave both API keys empty - uses keyword-based responses.

## API Endpoints

- `GET /` - Serve portfolio
- `POST /api/contact` - Submit contact form
- `POST /api/chat` - AI chatbot
