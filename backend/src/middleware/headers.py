from starlette.middleware.base import BaseHTTPMiddleware


class CustomHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        # response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
        # response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        response.headers['Access-Control-Allow-Origin'] = "*"
        response.headers['Access-Control-Allow-Credentials'] = 'false'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS, DELETE'
        response.headers['Access-Control-Allow-Headers'] = "*"
        return response
