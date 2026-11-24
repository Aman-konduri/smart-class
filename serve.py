#!/usr/bin/env python3
"""
Lightweight SPA HTTP Server for Smart Classroom Dashboard.
Serves dist/ and routes all client-side React Router paths (/login, /attendance, etc.)
to dist/index.html.
"""
import http.server
import os
import socketserver

PORT = 8090
DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        requested = os.path.join(DIST_DIR, self.path.lstrip("/").split("?")[0])
        if not os.path.isfile(requested):
            self.path = "/index.html"
        return super().do_GET()


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), SPAHandler) as httpd:
        print(f"Smart Classroom Dashboard live at http://localhost:{PORT}", flush=True)
        httpd.serve_forever()
