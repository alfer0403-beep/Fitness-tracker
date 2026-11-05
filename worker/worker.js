// Temple server for Cloudflare Workers. Holds your secrets so the phone app never does.
const SCOPES = 'https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly https://www.googleapis.com/auth/googlehealth.sleep.readonly';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type,X-Temple-Key', 'Access-Control-Allow-Methods': 'POST,GET,OPTIONS' };
const PROMPT = 'You are a registered dietitian. Identify each food in this photo and estimate portion size in grams and nutrition. Return ONLY JSON: {"items":[{"name":string,"grams":number,"kcal":number,"protein":number,"carbs":number,"fat":number}],"confidence":"low|medium|high","note":string}. Be conservative and mention uncertainty in note.';

function page(m) {
  return new Response('<meta name="viewport" content="width=device-width"><body style="font-family:sans-serif;padding:32px;font-size:20px;line-height:1.4">' + m + '</body>', { headers: { 'Content-Type': 'text/html' } });
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (u.pathname === '/auth/start') {
      const q = new URLSearchParams({ client_id: env.CLIENT_ID, redirect_uri: u.origin + '/auth/callback', response_type: 'code', access_type: 'offline', prompt: 'consent', scope: SCOPES, state: u.searchParams.get('u') === '1' ? '1' : '0' });
      return Response.redirect('https://accounts.google.com/o/oauth2/v2/auth?' + q, 302);
    }

    if (u.pathname === '/auth/callback') {
      const code = u.searchParams.get('code');
      if (!code) return page('Sign-in was cancelled.');
      const t = await (await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ code, client_id: env.CLIENT_ID, client_secret: env.CLIENT_SECRET, redirect_uri: u.origin + '/auth/callback', grant_type: 'authorization_code' })
      })).json();
      if (!t.access_token) return page('Google did not accept the sign-in. Please try again.');
      if (t.refresh_token && env.TOKENS) await env.TOKENS.put('rt:' + (u.searchParams.get('state') === '1' ? '1' : '0'), t.refresh_token);
      const r = await fetch('https://health.googleapis.com/v4/users/me/identity', { headers: { Authorization: 'Bearer ' + t.access_token } });
      return page(r.ok ? 'Connected. You can return to Temple.' : 'Signed in, but no Google Health profile is linked yet. Finish setting up the watch in the Google Health app, then try again.');
    }

    if (u.pathname === '/scan' && req.method === 'POST') {
      if (req.headers.get('X-Temple-Key') !== env.APP_SECRET) return new Response('Unauthorized', { status: 401, headers: CORS });
      const { image } = await req.json();
      const body = { contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: 'image/jpeg', data: image } }] }], generationConfig: { responseMimeType: 'application/json' } };
      const g = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + (env.GEMINI_MODEL || 'gemini-flash-latest') + ':generateContent', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY }, body: JSON.stringify(body)
      });
      if (!g.ok) return new Response('Gemini error ' + g.status + ': ' + (await g.text()).slice(0, 200), { status: 502, headers: CORS });
      const j = await g.json();
      const txt = (j.candidates && j.candidates[0] && j.candidates[0].content.parts[0].text) || '{}';
      return new Response(txt, { headers: { ...CORS, 'Content-Type': 'application/json' } });
    }
    return new Response('Temple server is running.');
  }
};
