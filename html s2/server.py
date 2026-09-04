import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlencode

PORT = int(os.environ.get("PORT", "4174"))
PUBLIC_URL = os.environ.get("PUBLIC_URL", f"http://localhost:{PORT}")


class PulseboardHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/status":
            return self.send_json({
                "meta": bool(os.environ.get("META_APP_ID") and os.environ.get("META_APP_SECRET")),
                "tiktok": bool(os.environ.get("TIKTOK_CLIENT_KEY") and os.environ.get("TIKTOK_CLIENT_SECRET")),
                "mode": "official-api",
            })

        if self.path == "/auth/meta":
            return self.start_oauth("meta")
        if self.path == "/auth/tiktok":
            return self.start_oauth("tiktok")

        if self.path.startswith("/auth/meta/callback") or self.path.startswith("/auth/tiktok/callback"):
            platform = "tiktok" if "tiktok" in self.path else "meta"
            return self.redirect(f"/project.html?connection=received&platform={platform}")

        return super().do_GET()

    def start_oauth(self, platform):
        if platform == "meta":
            client_id = os.environ.get("META_APP_ID")
            authorize_url = "https://www.facebook.com/v21.0/dialog/oauth"
            scope = "pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish"
        else:
            client_id = os.environ.get("TIKTOK_CLIENT_KEY")
            authorize_url = "https://www.tiktok.com/v2/auth/authorize/"
            scope = "user.info.basic,video.publish"

        if not client_id:
            return self.redirect(f"/project.html?connection=missing-config&platform={platform}")

        query = urlencode({
            "client_id": client_id,
            "redirect_uri": f"{PUBLIC_URL}/auth/{platform}/callback",
            "response_type": "code",
            "scope": scope,
        })
        return self.redirect(f"{authorize_url}?{query}")

    def redirect(self, location):
        self.send_response(302)
        self.send_header("Location", location)
        self.end_headers()

    def send_json(self, payload):
        import json
        body = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = ThreadingHTTPServer(("localhost", PORT), PulseboardHandler)
    print(f"Pulseboard running at {PUBLIC_URL}")
    server.serve_forever()