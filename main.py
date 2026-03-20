from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str
    email: str
    subject: Optional[str] = ""
    message: str

class ChatMessage(BaseModel):
    message: str

portfolio_data = {}

def parse_portfolio():
    global portfolio_data
    try:
        with open("portfolio.html", "r", encoding="utf-8") as f:
            content = f.read()
        
        data = {}
        
        hero_match = re.search(r'<h1 class="hero-name">.*?<br>\s*<span class="accent-line">([^<]+)</span>', content, re.DOTALL)
        data["name"] = hero_match.group(1).strip() if hero_match else "Akshay H"
        
        desc_match = re.search(r'<p class="hero-desc">(.*?)</p>', content, re.DOTALL)
        data["description"] = re.sub(r'<[^>]+>', '', desc_match.group(1)).strip() if desc_match else ""
        
        skills = []
        skill_groups = re.findall(r'<div class="skill-group-title">([^<]+)</div>.*?<div class="skill-tags">(.*?)</div>', content, re.DOTALL)
        for group_name, tags in skill_groups:
            tags_list = re.findall(r'<span class="skill-tag">([^<]+)</span>', tags)
            skills.append({"category": group_name.strip(), "skills": [t.strip() for t in tags_list]})
        data["skills"] = skills
        
        projects = []
        project_cards = re.findall(r'<h3 class="project-title">([^<]+)</h3>.*?<p class="project-desc">(.*?)</p>.*?<div class="project-stack">(.*?)</div>', content, re.DOTALL)
        for title, desc, stack in project_cards:
            stack_items = re.findall(r'<span class="stack-item">([^<]+)</span>', stack)
            projects.append({
                "title": title.strip(),
                "description": re.sub(r'<[^>]+>', '', desc).strip(),
                "tech": [s.strip() for s in stack_items]
            })
        data["projects"] = projects
        
        edu_items = re.findall(r'<div class="edu-degree">([^<]+)</div>.*?<div class="edu-school">([^<]+)</div>', content, re.DOTALL)
        data["education"] = [{"degree": d.strip(), "school": s.strip()} for d, s in edu_items]
        
        cert_match = re.search(r'<div class="cert-title">([^<]+)</div>.*?<div class="cert-meta">(.*?)</div>', content, re.DOTALL)
        if cert_match:
            data["certification"] = {
                "title": cert_match.group(1).strip(),
                "details": re.sub(r'<[^>]+>', '', cert_match.group(2)).strip().replace('<br>', ', ')
            }
        
        links = {}
        email_match = re.search(r'href="mailto:([^"]+)"', content)
        if email_match:
            links["email"] = email_match.group(1)
        phone_match = re.search(r'href="tel:([^"]+)"', content)
        if phone_match:
            links["phone"] = phone_match.group(1)
        github_match = re.search(r'href="(https://github\.com[^"]+)"', content)
        if github_match:
            links["github"] = github_match.group(1)
        data["contact"] = links
        
        portfolio_data = data
        print("Portfolio parsed successfully")
    except Exception as e:
        print(f"Error parsing portfolio: {e}")

@app.on_event("startup")
async def startup():
    parse_portfolio()

@app.get("/")
async def root():
    return FileResponse("portfolio.html")

@app.post("/api/contact")
async def submit_contact(form: ContactForm):
    print("\n" + "="*50)
    print("NEW CONTACT FORM SUBMISSION")
    print("="*50)
    print(f"Name:    {form.name}")
    print(f"Email:   {form.email}")
    print(f"Subject: {form.subject}")
    print(f"Message: {form.message}")
    print("="*50 + "\n")
    return {"status": "success", "message": "Message received successfully"}

@app.post("/api/chat")
async def chat(message: ChatMessage):
    q = message.message.lower()
    
    if any(w in q for w in ['name', 'who are you', 'who is']):
        return {"response": f"His name is <strong>{portfolio_data.get('name', 'Akshay H')}</strong>.", "type": "text"}
    
    if any(w in q for w in ['about', 'description', 'intro', 'tell me about']):
        return {"response": portfolio_data.get('description', "He's an ML Engineer & AI Developer."), "type": "text"}
    
    if any(w in q for w in ['skill', 'know', 'tech', 'language', 'framework', 'tool', 'technology']):
        if portfolio_data.get('skills'):
            lines = []
            for group in portfolio_data['skills']:
                skills_str = ", ".join(group['skills'])
                lines.append(f"<strong>{group['category']}:</strong> {skills_str}")
            return {"response": "<br>".join(lines), "type": "html"}
        return {"response": "Python, SQL, Machine Learning, Data Science tools.", "type": "text"}
    
    if any(w in q for w in ['project', 'projects', 'work', 'build', 'model']):
        if portfolio_data.get('projects'):
            lines = []
            for p in portfolio_data['projects']:
                lines.append(f"<strong>{p['title']}</strong><br>{p['description'][:150]}...<br>Tech: {', '.join(p['tech'][:3])}<br>")
            return {"response": "<br>".join(lines), "type": "html"}
        return {"response": "He has built Customer Segmentation and Medical Insurance Cost Prediction models.", "type": "text"}
    
    if any(w in q for w in ['education', 'degree', 'college', 'school', 'study']):
        if portfolio_data.get('education'):
            lines = [f"<strong>{e['degree']}</strong> at {e['school']}" for e in portfolio_data['education']]
            return {"response": "<br>".join(lines), "type": "html"}
        return {"response": "Pursuing B.E. in Computer Science (AI & ML) at SVIT Bangalore.", "type": "text"}
    
    if any(w in q for w in ['certification', 'certified', 'certificate', 'ibm']):
        if portfolio_data.get('certification'):
            cert = portfolio_data['certification']
            return {"response": f"<strong>{cert['title']}</strong><br>{cert['details']}", "type": "html"}
        return {"response": "IBM Certified in Applied Artificial Intelligence (Dec 2025).", "type": "text"}
    
    if any(w in q for w in ['contact', 'email', 'phone', 'reach', 'hire', 'github']):
        links = portfolio_data.get('contact', {})
        parts = []
        if links.get('email'):
            parts.append(f"Email: {links['email']}")
        if links.get('phone'):
            parts.append(f"Phone: {links['phone']}")
        if links.get('github'):
            parts.append(f"GitHub: {links['github']}")
        return {"response": "<br>".join(parts), "type": "html"} if parts else {"response": "Contact info not available.", "type": "text"}
    
    if any(w in q for w in ['experience', 'role', 'what do you do']):
        return {"response": "ML Engineer & AI Developer with expertise in Python, machine learning, and data science.", "type": "text"}
    
    if any(w in q for w in ['hackathon', 'aignition', 'finalist', 'competition']):
        return {"response": "Finalist at AIGNITION 2025 - built an AI-based Code Plagiarism Detector in 48 hours.", "type": "text"}
    
    if any(w in q for w in ['hi', 'hello', 'hey', 'help']):
        return {"response": "Hello! I can answer questions about Akshay's skills, projects, education, certifications, or contact info. What would you like to know?", "type": "text"}
    
    return {"response": "I can help with questions about his skills, projects, education, certifications, or contact info. Try asking specifically!", "type": "text"}

@app.get("/api/portfolio-data")
async def get_portfolio_data():
    return portfolio_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
