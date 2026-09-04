const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const publicUrl = process.env.PUBLIC_URL || `http://localhost:${port}`;

function sendJson(response, status, data) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

function redirect(response, location) {
  response.writeHead(302, { Location: location });
  response.end();
}

function oauthConfig(platform) {
  if (platform === 'meta') {
    return {
      clientId: process.env.META_APP_ID,
      redirectUri: `${publicUrl}/auth/meta/callback`,
      authorizeUrl: 'https://www.facebook.com/v21.0/dialog/oauth',
      scope: 'pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish'
    };
  }
  return {
    clientId: process.env.TIKTOK_CLIENT_KEY,
    redirectUri: `${publicUrl}/auth/tiktok/callback`,
    authorizeUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    scope: 'user.info.basic,video.publish'
  };
}

function startOAuth(response, platform) {
  const config = oauthConfig(platform);
  if (!config.clientId) {
    return redirect(response, `/project.html?connection=missing-config&platform=${platform}`);
  }
  const query = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.redirectUri, response_type: 'code', scope: config.scope });
  if (platform === 'tiktok') query.set('state', 'pulseboard');
  redirect(response, `${config.authorizeUrl}?${query}`);
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, publicUrl);

  if (requestUrl.pathname === '/api/status') {
    return sendJson(response, 200, {
      meta: Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET),
      tiktok: Boolean(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET),
      mode: 'official-api'
    });
  }

  if (requestUrl.pathname === '/auth/meta') return startOAuth(response, 'meta');
  if (requestUrl.pathname === '/auth/tiktok') return startOAuth(response, 'tiktok');

  if (requestUrl.pathname.endsWith('/callback')) {
    const platform = requestUrl.pathname.includes('tiktok') ? 'tiktok' : 'meta';
    if (requestUrl.searchParams.get('error')) {
      return redirect(response, `/project.html?connection=cancelled&platform=${platform}`);
    }
    if (!requestUrl.searchParams.get('code')) {
      return redirect(response, `/project.html?connection=failed&platform=${platform}`);
    }
    return redirect(response, `/project.html?connection=received&platform=${platform}`);
  }

  const requestedFile = requestUrl.pathname === '/' ? '/project.html' : requestUrl.pathname;
  const filePath = path.resolve(root, `.${requestedFile}`);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath)) return sendJson(response, 404, { error: 'Not found' });
  const contentType = filePath.endsWith('.css') ? 'text/css' : filePath.endsWith('.js') ? 'text/javascript' : 'text/html';
  response.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, () => console.log(`Pulseboard running at ${publicUrl}`));