import json
with open('farmers.json') as file:
    data = json.loads(file.read())['farmers']
    pus_data = []
    for idx, d in enumerate(data):
        c = { 'region': d.get('region'), 'farmername': d.get('farmername'), 'feederline': d.get('feederline'), 'mobilenumber': d.get('mobilenumber'), 'currentcrop': d.get('currentcrop'), 'landsize': d.get('landsize'), 'pump': d.get('pump'), 'farmerid': idx+ 1}
        pus_data.append(c)

    new_data = {
        'farmers': pus_data
    }
    

with open('farmers.json', 'w') as file:
    json.dump(new_data, file)
    

    