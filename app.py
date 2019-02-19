from flask import Flask, Response, jsonify
from flask import render_template, request, session, url_for, redirect
from flask_assets import Environment, Bundle
from . import app

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/summary')
def summary():
    return render_template('summary.html')


@app.route('/scheduler')
def scheduler():
    return render_template('scheduler.html')
