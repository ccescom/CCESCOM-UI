from flask import Flask
from flask_assets import Environment



app = Flask(__name__)
webassets = Environment(app)


from . import assets
