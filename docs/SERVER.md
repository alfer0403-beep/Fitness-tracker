# Temple server setup (Cloudflare Workers, free)

Needed for the meal scanner and Google Health sign-in. Keys live here, never in the app.

1. Create a free account at cloudflare.com. Go to Workers & Pages > Create > Start with Hello World. Name it `temple`, deploy, then choose Edit code, paste all of `worker/worker.js`, and Deploy.
2. Copy the worker address (looks like https://temple.YOURNAME.workers.dev).
3. In the worker: Settings > Variables and Secrets. Add:
   - CLIENT_ID (text): your Google client ID
   - CLIENT_SECRET (secret): your Google client secret
   - GEMINI_API_KEY (secret): key from aistudio.google.com
   - APP_SECRET (secret): any long random password you invent
   - GEMINI_MODEL (text, optional): current Gemini Flash model name from AI Studio
4. In Google Cloud > Credentials > your web client, add this redirect URI: `https://temple.YOURNAME.workers.dev/auth/callback`
5. In GitHub > Settings > Secrets and variables > Actions, add:
   - WORKER_URL: the worker address (no trailing slash)
   - APP_SECRET: the same password as step 3
6. Push any change to rebuild the APK.
