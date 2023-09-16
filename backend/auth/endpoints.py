from flask import Blueprint

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():

    return "you're logged in now :) yay"

# register endpoint

# refresh token endpoint