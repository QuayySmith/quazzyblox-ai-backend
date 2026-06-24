# QuazzyBlox.AI v3

One clean Vercel project for a Roblox Developer AI assistant.

## What is included

- ChatGPT-style frontend
- Roblox-specific modes
- Local chat saving
- Chat search
- Rename/delete/export chats
- Copy code buttons
- Mobile-friendly UI
- Vercel API backend
- OpenAI SDK integration

## Required Vercel environment variable

Add this in Vercel:

```text
OPENAI_API_KEY
```

Value: your OpenAI API key.

## Correct file structure

```text
index.html
package.json
README.md
api/
  chat.js
```

## Deploy

1. Upload these files to your GitHub repo.
2. Import or redeploy the repo on Vercel.
3. Add `OPENAI_API_KEY` in Vercel settings.
4. Redeploy.
5. Open your Vercel URL.

## Test backend

Open:

```text
https://YOUR-VERCEL-DOMAIN.vercel.app/api/chat
```

It should say:

```text
Use POST. QuazzyBlox.AI backend is online.
```

That means the route exists.

## Firebase chat saving later

Current version saves chats with browser `localStorage`.

To add cloud saving later:

1. Create Firebase project.
2. Enable Authentication.
3. Enable Google Sign-In.
4. Enable Firestore.
5. Store chats like:

```text
users/{uid}/chats/{chatId}
users/{uid}/chats/{chatId}/messages/{messageId}
```

6. Add Firestore security rules so users only read/write their own chats.
