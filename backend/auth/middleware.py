from werkzeug.wrappers import Request, Response

class AuthenticateMiddleware:
    def __init__(self, app, unauthenticated_endpoints):
        self.app = app
        self.unauthenticated_endpoints = unauthenticated_endpoints
    
    def __call__(self, environ, start_response):

        print('you are in the AuthenticateMiddleware')
        
        response = self.app(environ, start_response)

        print('back inside the AuthenticationMiddleware after the request have been processed')

        return response
