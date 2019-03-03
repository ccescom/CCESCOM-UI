import math

def schedule_shifts(requests, config):
    peaktime = config['peaktime']
    nonpeaktime = config['nonpeaktime']
    no_of_shifts = 3
    unique_lineid = set([feeder['feeder_id'] for feeder in requests])
    max_farmers = {}
    for lineid in unique_lineid:
        line_data = list(filter(lambda x: x['feeder_id'] == lineid, requests))
        no_of_farmers = len(line_data)
        max_requested = max(list(map(lambda x: x['requested_hours'], line_data)))
        phone_numbers = [8088837275, 9481024190]
        max_farmers[lineid] = {
            'no_of_farmers':no_of_farmers, 
            'total_hours' : no_of_farmers * max_requested ,
             'max_requested': max_requested,
             'phone_numbers': phone_numbers
        }
    
    sorter = sorted(max_farmers.items(), key=lambda kv: kv[1]['total_hours'])
    shift_num = 0
    shift = []
    order = 0
    shift_counter = {}
    for idx, line in enumerate(sorter):
        if str(shift_num + 1) not in shift:
            shift_counter[(shift_num + 1)] = shift_counter.get((shift_num + 1), 0) + 1
            shift.append({
                'feeder_line': line[0],
                'peek_hours': math.ceil(line[1]['max_requested'] * peaktime),
                'total_hours': line[1]['max_requested'],
                'no_of_farmers': line[1]['no_of_farmers'],
                'shift': shift_num + 1,
                'shift_counter': shift_counter[shift_num + 1],
                'phone_numbers': line[1]['phone_numbers']

            })
     
        if (idx + 1) % no_of_shifts  == 0:
            shift_num = 2 if order == 0 else 0
            order = 1 - order
        
        else:
            if order == 0:
                shift_num += 1
            else:
                shift_num -= 1
    return shift




