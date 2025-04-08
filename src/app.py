from flask import Flask, jsonify, render_template, request
import fastf1
import os
import json

app = Flask(__name__)

# initialize the cache folder and files to cache locally
cache_dir = "./cache_folder"
race_results_file = "./cache_folder/race_results.json"
session_results_file = "./cache_folder/session_results.json"

# if the cache directory doesn't exist, create one
if not os.path.exists(cache_dir):
    os.makedirs(cache_dir)

# if the race_results doesn't exist create one
if not os.path.exists(race_results_file):
    open(race_results_file, "x")

# if the session_results doesn't exist create one
if not os.path.exists(session_results_file):
    open(session_results_file, "x")

fastf1.Cache.enable_cache(cache_dir)

# Renders the main HTML Page
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search-by-year')
def get_started():
    return render_template('display.html')

# Renders the information for a given year
@app.route('/<year>', methods=['POST'])
def year_data(year):
    if request.method == 'POST':
        year = int(year)

        try:
            events = fastf1.get_event_schedule(year)
            events_json = events.to_json(orient='records')

            with open(f'{cache_dir}/session_results.json', 'w') as f:
                f.write(events_json)
        except Exception as e:
            print(f"Error: {e}")
    with open(f'{cache_dir}/session_results.json', 'r') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/<year>/<gp>/<session_type>', methods=['GET', 'POST'])
def get_data(year, gp, session_type):
    if request.method == 'POST':
        
        year = int(year)
        gp = gp
        session_type = session_type

        try:
            session = fastf1.get_session(year, gp, session_type)
            session.load()

            race_results = session.results
            results_json = race_results.to_json(orient='records')

            with open(f'{cache_dir}/race_results.json', 'w') as f:
                f.write(results_json)
        except Exception as e:
            print(f"Error: {e}")

    with open(f'{cache_dir}/race_results.json', 'r') as f:
        data = json.load(f)
    return jsonify(data)
if __name__ == '__main__':
    app.run(debug=True)