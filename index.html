<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prépa IA - Maîtrisez votre Grand Oral</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2563eb; /* Bleu moderne */
            --primary-hover: #1d4ed8;
            --background: #f9fafb;
            --text: #111827;
            --text-secondary: #6b7280;
            --card-bg: #ffffff;
            --border: #e5e7eb;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background);
            color: var(--text);
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
        }

        header {
            text-align: center;
            padding: 60px 20px;
            max-width: 800px;
        }

        h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 10px;
            color: var(--text);
        }

        .subtitle {
            font-size: 1.25rem;
            color: var(--text-secondary);
            margin-bottom: 40px;
        }

        .auth-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-bottom: 50px;
        }

        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            border: none;
            text-decoration: none;
        }

        .btn-primary {
            background-color: var(--primary);
            color: white;
        }

        .btn-primary:hover {
            background-color: var(--primary-hover);
        }

        .btn-secondary {
            background-color: white;
            color: var(--primary);
            border: 2px solid var(--primary);
        }

        .btn-secondary:hover {
            background-color: #eff6ff;
        }

        .chat-container {
            background-color: var(--card-bg);
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            width: 90%;
            max-width: 600px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            margin-bottom: 40px;
        }

        .chat-header {
            padding: 15px 20px;
            background-color: var(--card-bg);
            border-bottom: 1px solid var(--border);
            font-weight: 700;
            font-size: 1.1rem;
        }

        #chat {
            height: 300px;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .message {
            padding: 10px 15px;
            border-radius: 8px;
            max-width: 80%;
            font-size: 0.95rem;
        }

        .message.user {
            background-color: #dbeafe; /* Bleu très clair */
            align-self: flex-end;
            color: #1e3a8a;
        }

        .message.ia {
            background-color: #f3f4f6;
            align-self: flex-start;
            color: var(--text);
        }

        .chat-input-area {
            display: flex;
            padding: 15px;
            background-color: var(--card-bg);
            border-top: 1px solid var(--border);
        }

        #messageInput {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid var(--border);
            border-radius: 6px;
            outline: none;
        }

        #sendButton {
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 10px 20px;
            margin-left: 10px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }

        #sendButton:hover {
            background-color: var(--primary-hover);
        }

        footer {
            margin-top: auto;
            padding: 20px;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <header>
        <h1>Prépa IA</h1>
        <p class="subtitle">Simulez votre Grand Oral du CRFPA avec l'intelligence artificielle la plus performante</p>
    </header>

    <div class="auth-buttons">
        <button class="btn btn-primary">S'inscrire gratuitement</button>
        <button class="btn btn-secondary">Ouvrir une session</button>
    </div>

    <div class="chat-container">
        <div class="chat-header">Entretien Blanc</div>
        <div id="chat">
            <div class="message ia">Bonjour ! Collez votre parcours ci-dessous, et nous commencerons la simulation.</div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="messageInput" placeholder="Tapez votre parcours ou votre réponse ici...">
            <button id="sendButton">Envoyer</button>
        </div>
    </div>

    <footer>
        © 2026 Prépa IA - Plateforme de préparation aux concours juridiques.
    </footer>

    <script>
        const chat = document.getElementById('chat');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');

        async function sendMessage() {
            const message = messageInput.value;
            if (!message) return;

            // Ajouter le message de l'utilisateur
            const userDiv = document.createElement('div');
            userDiv.className = 'message user';
            userDiv.innerText = message;
            chat.appendChild(userDiv);
            messageInput.value = '';
            chat.scrollTop = chat.scrollHeight;

            try {
                // Appeler l'API de l'IA (votre backend Vercel)
                const response = await fetch('/api/claude', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message, context: "CV du candidat CRFPA" })
                });
                
                const data = await response.json();
                
                // Ajouter la réponse de l'IA
                const iaDiv = document.createElement('div');
                iaDiv.className = 'message ia';
                iaDiv.innerText = data.reply;
                chat.appendChild(iaDiv);
                chat.scrollTop = chat.scrollHeight;

            } catch (error) {
                // Gérer les erreurs techniques de base
                const errorDiv = document.createElement('div');
                errorDiv.className = 'message ia';
                errorDiv.innerText = "⚠️ Oups, une erreur technique est survenue. Veuillez réessayer.";
                chat.appendChild(errorDiv);
                chat.scrollTop = chat.scrollHeight;
            }
        }

        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    </script>
</body>
</html>
