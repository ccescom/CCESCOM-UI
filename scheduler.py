
def schedule_shifts(requests, config):
    peaktime = config['peaktime']
    nonpeaktime = config['nonpeaktime']
    unique_lineid = set([feeder['level'] for feeder in requests])
    for lineid in unique_lineid:
        unique_lineid = set([feeder['level'] for feeder in requests])
        max_farmers = {}
        for lineid in unique_lineid:
            line_data = list(filter(lambda x: x['level'] == lineid, requests))
            no_of_farmers = len(line_data)
            max_requested = max(list(map(lambda x: x['value'], line_data)))
            max_farmers[lineid] = {'totalhours' : no_of_farmers * max_requested , 'max_requested': max_requested}

        sorter = sorted(max_farmers.items(), key=lambda kv: kv[1]['totalhours'], reverse=True)
        shift_num = 0
        shift = {}
        order = 0
        for idx, line in enumerate(sorter):
            if str(shift_num + 1) not in shift:
                shift[str(shift_num + 1)] = [{
                    'feeder_line': line[0],
                    'peek_hours': line[1]['maxrequested'] * peaktime
                }]
            else:
                shift[str(shift_num + 1)].append({
                    'feeder_line': line[0],
                    'peek_hours': line[1]['maxrequested'] * peaktime
                })
                
            if (idx + 1) % 3 == 0:
                shift_num = 2 if order == 0 else 0
                order = 1 - order
            
            else:
                if order == 0:
                    shift_num += 1
                else:
                    shift_num -= 1

        return shift




