# "Fast F1 Python APP"

This is a [Python Flask](https://flask.palletsprojects.com/en/stable/) integrated with HTML, CSS and JS. It generates race results from the [FastF1 Python API](https://docs.fastf1.dev/) based on user inputs.

## Live Demo:

- Live demo will be inserted with future updates

## Tech Stack

### Frontend:

- HTML
- CSS
- JavaScript
- JSON

### Backend:

- Flask (Python)
- FastF1 API (Python)

## How To Use

1. Clone the Git Repository to a folder
2. Install the following:

```bash
pip install flask
pip install python-dotenv
pip install requests
```

3. Run the following command:

```bash
python3 run app.py #for MacOS/Linux
# or
python run app.py #for Java
# or run the python script in some form to open a local server
```

Note: local server should open on port 5000

## Features

- Given a year, the script will get all the Grand Prixs that happened and prompt the user to select a Grand Prix
- Given the Grand Prix, the user will be prompted to select a Session Type
- Given the Session Type, the results will be displayed on the page

Example:

<img alt="Example Image" src="https://github.com/yuvanadarsh/fastf1-api-project/blob/main/src/static/assets/example.png">

## Bugs/Known Issues

- The Lap Times listed are accurate if given. If it is not given or listed as +1, it is not always accurate. +2 laps and DNFs are possible but not accounted for.
  - Work in Progress to fix this issue
  - Suggestions: Understand the [FastF1 API](https://docs.fastf1.dev/) and modify the js file to accurately show +1, +2 or DNF for the Lap Times.

## Credits

- Inspiration for the UI taken from [Colin Chambachan's F1 Project](https://github.com/colinchambachan/f1-archive)
