ReincarnationApp
================

A Social Web course application, which discovers the reincarnation chain for a Facebook user.Uses Fecebook and DBPedia as data sources. Python, HTML, Javascript, CSS, Google Maps API, D3.js and Apache 2 web servers are also used.

Directories:

/css -> CSS styling of the app
/csvs -> CSV files stored for drawing by D3.js
/design -> design template to be used in the next version
/html -> the HTML files currently used in the application
/images -> logo and favicon
/src -> Javascript files
/server.py -> The Python script which starts the backend server, and connects the various external sources.

Setup:

1. Install needed Python packages (SPARQLWrapper, flask, requests, json, datetime, dateutil, unidecode, csv)
2. Start the python server on default port (5000). To do this, type:
        python server.py
in the terminal.
* To be able to make requests to local server, some browser security settings may need to be disabled. For Chrome, install the extension:
        Allow-Control-Alow-Origin: *
3. Since the application is not running publicly, a new Facebook application needs to be created, which supports your domain. Go to: https://developers.facebook.com/ to create new application for this project and obtain the corresponding app key.
4. Install Apache2 server and start it (default port is 80). The "ReincarnationApp" folder needs to be located inside Apache's root directory. On Ubuntu, that is: /var/www/. 
5. Open the application in browser. If the ReincarnationApp is stored directly in the Apache root directory, it can be accessed with http://localhost/ReincarnationApp/html/app.html from the browser.
