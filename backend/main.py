from flask import Flask
from auth.endpoints import auth
from auth.middleware import AuthenticateMiddleware

app = Flask(__name__)
app.register_blueprint(auth, url_prefix='/auth')
app.wsgi_app = AuthenticateMiddleware(app.wsgi_app, ['/auth/login'])


@app.route('/health')
def health():
    return 'Up and running :)'

if __name__ == '__main__':
    app.run(debug=True, port=5000)