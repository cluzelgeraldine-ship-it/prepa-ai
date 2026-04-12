import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
import openai

app = FastAPI()

# 1. TA CLÉ API
openai.api_key = "TON_API_KEY_ICI"

# 2. MODÈLE DE DONNÉES
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    subject: str

# 3. SERVIR LE HTML (qui est à la racine)
@app.get("/")
async def read_index():
    return FileResponse('index.html')

# 4. L'API POUR LE JURY
@app.post("/api/claude")
async def chat_with_ai(request: ChatRequest):
    try:
        system_prompt = {
            "role": "system",
            "content": f"Tu es un jury de concours d'élite sur le sujet : {request.subject}. Sois formel (Vouvoiement), exigeant, et pose une question à la fois pour tester l'étudiant en 3 minutes."
        }
        
        full_messages = [system_prompt] + [m.dict() for m in request.messages]

        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=full_messages,
            temperature=0.7
        )

        return {"reply": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Le port 8000 est le standard
    uvicorn.run(app, host="127.0.0.1", port=8000)
