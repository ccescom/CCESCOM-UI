from math import ceil
import json
from .scheduler import schedule_shifts 


def week_of_month(dt):
    first_day = dt.replace(day=1)
    dom = dt.day
    adjusted_dom = dom + first_day.weekday()

    return int(ceil(adjusted_dom/7.0))


def month_num_mapping(month_num):
    month_mapping = {1 :'January', 2 : 'Febraury', 3 : 'March', 4 :'April', 5 : 'May', 6 :'June',
    7 :'July', 8 :'August', 9 : 'September', 10 : 'October', 11 : 'November', 12 : 'December'}

    return month_mapping[month_num]


def get_requests(week, month, year):
    with open('requests.json') as file:
        requests = json.loads(file.read())['requests']
    
    config = {
        'peaktime': 0.3,
        'nonpeaktime': 0.7
    } 

    with open('feeder.json') as feeder:
        feeder = json.loads(feeder.read())['feeder']
    
    with open('farmers.json') as farmers:
        farmers = json.loads(farmers.read())['farmers']
    
    mapped_requests = []
    for req in requests:
        farmerid = req['farmerid']
        feederline = list(filter(lambda k: k['farmerid'] == farmerid, farmers))
        if len(feederline) > 0:
            feederline = feederline[0]['feederline']
            mapped_requests.append({
                'feeder_id': feederline,
                'farmer_id': farmerid,
                'week': req['Week'],
                'month': req['Month'],
                'year': req['Year'],
                'requested_hours': req['Hours']
            })
    print(mapped_requests, month)
    requests = filter(lambda d: d['week'] == week, mapped_requests)
    requests = filter(lambda d: month_num_mapping(d['month']) == month, requests)
    requests = filter(lambda d: d['year'] == year, requests)
    requests = list(requests)
    print(requests)
    scheduler_data = []
    if len(requests) != 0:
        scheduler_data  =  schedule_shifts(requests, config)

    print(scheduler_data)
    
    return scheduler_data

def shift_mapping(shift):
    mapper = {
        1: '^AM - 11AM',
        2: '11AM - 4PM',
        3: '4PM - 9PM'
    }

    return mapper[shift]


def get_crop_hours():
    with open('crophours.json') as file:
        crop_hours = json.loads(file.read())['crophours']

    return crop_hours


