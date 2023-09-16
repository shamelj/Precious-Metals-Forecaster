from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text

from auth.endpoints import auth
from auth.middleware import AuthenticateMiddleware

app = Flask(__name__)

db_name = 'gsg_project_database'
db_user = 'gsg_project_user'
db_pass = 'root'

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{db_user}:{db_pass}@localhost/{db_name}'
db = SQLAlchemy(app)

app.register_blueprint(auth, url_prefix='/auth')
app.wsgi_app = AuthenticateMiddleware(app.wsgi_app, ['/auth/login'])


@app.route('/health')
def health_backend():
    return 'Up and running :)'

@app.route('/health/database')
def health_database():
    # try:
        db.session.query(text('1')).from_statement(text('SELECT 1')).all()
        return 'It works.'
    # except:
        # return 'Database connection failed'

if __name__ == '__main__':
    app.run(debug=True, port=5000)