from app_instance import app
from account_manager import login_blueprint
from moments import moments_blueprint
from flask import render_template
#bind api
app.register_blueprint(moments_blueprint)
app.register_blueprint(login_blueprint)
app.secret_key = 'your_secret_key'
"“Homepage, redirect”"
app.config['MAX_CONTENT_PATH'] = '16 * 1024 * 1024'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
@app.route('/')
def home():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)