import json

with open ('./stock_data_2.json') as json_file:
    json_data = json.load(json_file)

    json_data_2 = json_data['stock']['dataValues']
    for i in json_data_2:
        print(i['stock_name'])
