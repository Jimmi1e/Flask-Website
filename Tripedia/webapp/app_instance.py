from flask import Flask

#this file is essential for decoupling the application logic
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/Tripedia"
app.secret_key = "mysecretkey"




