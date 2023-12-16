from flask import Blueprint, render_template, request, redirect, url_for, session
from werkzeug.utils import secure_filename
from database_manager import Moments
import os
from datetime import datetime
moments_blueprint = Blueprint('moments_blueprint', __name__)
moments = Moments("mongodb://localhost:27017/Tripedia")
@moments_blueprint.route('/moments')
def show_moments():
    moments_data = moments.get_moments()
    return render_template('moments.html', moments=moments_data)
@moments_blueprint.route('/upload_moment', methods=['POST'])
def upload_moment():
    text = request.form['text']
    username = session.get('username', None)
    image_url = None
    if 'image' in request.files:
        image = request.files['image']
        if image and image.filename != '':
            filename = secure_filename(image.filename)
            image_path = os.path.join('static/uploads', filename)
            image.save(image_path)
            image_url = f'uploads/{filename}'
    create_at = datetime.now().strftime("%Y-%m-%d %I:%M %p")
    moment_data = {
        'text': text,
        'image_url': image_url,
        'create_at': create_at,
        'username': username
    }
    moments.insert_moment(moment_data)
    return redirect(url_for('moments_blueprint.show_moments'))
