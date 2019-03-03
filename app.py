from flask import Flask, Response, jsonify
from flask import render_template, request, session, url_for, redirect
from flask_assets import Environment, Bundle
from . import app
from math import ceil
from datetime import datetime
from .utils import week_of_month, month_num_mapping, get_requests, shift_mapping, get_crop_hours
import json
from .scheduler import schedule_shifts 
import requests


@app.route('/')
def index():
	return render_template('index.html')

@app.route('/summary/<region>')
def summary(region):
    with open('farmers.json') as farmers:
        farmers_data = json.loads(farmers.read())['farmers']

    with open('feeder.json') as feeder:
        feeder_data = json.loads(feeder.read())['feeder']
    
    region = 'Jaipur' if not region else region
    feeder_data = list(filter(lambda x: x['region'] == region, feeder_data))
    farmers_data = list(filter(lambda x: x['region'] == region, farmers_data))
    number_of_farmers = len(farmers_data)
    number_of_feeders = len(feeder_data)
    
   
    return render_template('summary.html', 
            farmers_data=farmers_data, 
            feeder_data=feeder_data, 
            region=region, 
            number_of_farmers=number_of_farmers,
            number_of_feeders=number_of_feeders
            )


@app.route('/scheduler')
def scheduler():
    return render_template('scheduler.html')

@app.route('/scheduleforweek')
def scheduleforweek():
    if 'week' not in request.args: 
        week = week_of_month(datetime.now())
        month = datetime.now().month
        year = datetime.now().year
    else:
        week = int(request.args.get('week'))
        month = request.args.get('month')
        year = int(request.args.get('year'))

   
    scheduler_data = get_requests(week, month, year)
    return jsonify(scheduler_data)


@app.route('/notifyfarmers')
def notifyfarmers():
    if 'week' not in request.args: 
        week = week_of_month(datetime.now())
        month = datetime.now().month
        year = datetime.now().year
    else:
        week = int(request.args.get('week'))
        month = request.args.get('month')
        year = int(request.args.get('year'))
    
    config = {
        'week': week,
        'month': month,
        'year': year
    }
    scheduler_data = get_requests(week, month, year)
    notifications = []
    no_of_shifts = 3
    for i in range(no_of_shifts):
        current_shifts = filter(lambda x: x['shift'] == (i + 1), scheduler_data) 
        text = ""
        text += shift_mapping((i + 1)) 
        phone_numbers = current_shifts.get('phone_numbers') 
        notifications.append({
            'to': phone_numbers,
            'payload': text, 
            'lang': 'hi'
        })

    request.get(url='', data=notifications)
    return 'data'

@app.route('/crophours')
def crophours():
    crop_hours = get_crop_hours()
    return jsonify(crop_hours)


@app.route('/cropmonthhours')
def cropmonthhours():
    return []



@app.route('/configuration')
def configuration():
    return render_template('configuration.html')

@app.route('/analysis')
def analysis():
    return render_template('analysis.html')


@app.route('/login')
def login():
    with open('login.json') as file:
        login_data = json.loads(file.read())['login']

    username = request.args.get('username', '')
    password = request.args.get('password', '')

    check = list(filter(lambda k: k['username'] == username and k['password'] == password, login_data))
    if len(check) > 0:
        region = check[0]['region']

    if username in map(lambda k: k['username'], login_data):
        if password in map(lambda k: k['password'], login_data):
            return json.dumps({'success':True, 'region': region}), 200, {'ContentType':'application/json'} 

    return json.dumps({'success':False}), 403, {'ContentType':'application/json'} 


@app.route('/addfeeders')
def addfeeders():
    with open('feeder.json' ,'r') as feeder:
        feeder_data = json.loads(feeder.read())['feeder']
        feeder_line = request.args.get('feeder_line')
        region = request.args.get('region')
        feeder_type = request.args.get('type')

        new_feeder = {
            'feederline': feeder_line,
            'region': region,
            'type': feeder_type
        }
        feeder_data.append(new_feeder)
        output_json = {
            "feeder": feeder_data
        }
    
    with open('feeder.json' ,'w') as feeder:
        json.dump(output_json, feeder)

    
    return json.dumps({'success':True, 'region': region}), 200, {'ContentType':'application/json'} 


@app.route('/viewscheduler')
def viewscheduler():
    with open('feeder.json') as feeder:
        feeder_data = json.loads(feeder.read())['feeder']

    # feeder_data = list(filter(lambda x: x['region'] == region, feeder_data))
    

    return render_template('/viewscheduler.html', feeder_data=feeder_data)


@app.route('/showfeederline')
def showfeederline():
    with open('farmers.json') as farmers:
        farmers_data = json.loads(farmers.read())['farmers']
    with open('feeder.json') as feeders:
        feeder_data = json.loads(feeders.read())['feeder']

    
    feederline = request.args.get('feederline', feeder_data[0]['feederline'])
    feederline = feederline.lstrip().rstrip()
  
    # farmers_data = list(filter(lambda x: x['region'] == region, farmers_data))
    farmers_data = list(filter(lambda x: x['feederline'] == str(feederline), farmers_data))
    return jsonify(farmers_data)


@app.route('/checkaudino')
def checkaudino():
    with open('farmers.json') as farmers:
        farmers_data = json.loads(farmers.read())['farmers']

    # aurdino_farmers = list(filter(lambda x: 'aurdinotopic' in x, farmers_data))
    return jsonify(farmers_data)



     