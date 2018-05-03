# NMT Web Application

This is a web application for our English to Chinese NMT(basically designed by tensorflow nmt tutorial). This website does not contain any training process of the NMT. You must have you own checkpoint(NMT model) before this website start running.

## How to run
  
To run this web appliation you generally need these tools or pacakges:

 * Tensorflow
 * Django
 * Django REST Framework
 * django-cors-headers
 * React

To build the backend envrionment you could use pip and requirments.txt:
```bash
# nmt_webapp/

virtualenv env
source env/bin/active
pip install -r requirements.txt
```
If everything goes well, then you could run the backend server:
```bash
# nmt_webapp/

python backend/manage.py runserver
```

To start the frontend server, you just need to install reat:
```bash
# nmt_webapp/

npm install -g create-react-app
```

Then start the frontend server:
```bash
# nmt_webapp/frontend/

npm start
```

If you don't have the assist tools:
 
 * virtualenv
 * pip
 * npm

You have to google how to install these tools at first.
