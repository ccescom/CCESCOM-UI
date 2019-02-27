from flask import Flask
from flask_assets import Bundle
from . import app, webassets



js_all = Bundle("node_modules/jquery/dist/jquery.min.js",
                "js/popper.min.js",
                 "node_modules/bootstrap/dist/js/bootstrap.min.js",
                 "js/d3.v4.min.js",
                 "js/allocation.js",
                 "js/materialize.min.js",
                "js/cc.js",
                 filters="jsmin",
                 output="js/libs.js")


css_all = Bundle(
                  Bundle("node_modules/bootstrap/dist/css/bootstrap.css"),
                  Bundle("css/materialize.min.css"),
                  Bundle("css/cc.css"),
                  filters="cssmin",
                  output="css/main.css")


webassets.register('js_all', js_all)
webassets.register('css_all', css_all)
