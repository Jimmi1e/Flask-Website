from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from database_manager import user_infor_manager
login_blueprint = Blueprint('login_blueprint', __name__)
'login'
@login_blueprint.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        login_user = user_infor_manager.find_user_info('username')
        if login_user:
            if request.form['password'] == login_user['password']:
                session['username'] = request.form['username']
                return redirect(url_for("home"))
        flash('.username or password is incorrect！')
    return render_template('login.html')
'logout'
@login_blueprint.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login_blueprint.index'))
'show_state'
@login_blueprint.route('/')
def index():
    is_logged_in = 'username' in session
    return render_template('index.html', is_logged_in=is_logged_in, username=session.get('username'))
'register'
@login_blueprint.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        existing_user = user_infor_manager.find_user_info('username')
        if existing_user is None:
            user_infor_manager.insert_one_user({
                'username': request.form['username'],
                'name': request.form['name'],
                'password': request.form['password'],
                'sex': request.form['sex'],
                'age': request.form['age'],
                'phone': request.form['phone'],
                'email': request.form['email'],
                'secret': request.form['secret']
            })
            session['username'] = request.form['username']
            return redirect(url_for('login_blueprint.login'))
        flash('Username is existed！PlZ change another one!')
        return redirect(url_for('login_blueprint.register'))
    return render_template('register.html')
from database_manager import user_infor_manager
from flask import  render_template, request, redirect, url_for, flash, Blueprint
reset_password_blueprint = Blueprint('login_blueprint', __name__)
'reset_password'
@login_blueprint.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'POST':
        username = request.form['username']
        secret_answer = request.form['secret']
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']
        if new_password != confirm_password:
            flash('Inconsistency between the two input passwords！')
            return render_template('reset_password.html')
        user_info = user_infor_manager.find_user_by_username(username)
        if not user_info:
            flash(f'Cannot find username：{username}！')
            return render_template('reset_password.html')
        if user_info.get('secret') != secret_answer:
            flash('Security Question is not correct ！')
            return render_template('reset_password.html')
        user_infor_manager.update_password(username, new_password)
        flash('Password updated successfully！')
        return redirect(url_for('login_blueprint.login'))
    return render_template('reset_password.html')
'edit'
@login_blueprint.route('/edit_profile', methods=['GET', 'POST'])
def edit_profile():
    print("DEBUG: session contents:", session)
    print("DEBUG: request.form contents:", request.form)
    if 'username' not in session:
        flash('Please Login!')
        return redirect(url_for('login'))
    username = session['username']
    if request.method == 'POST':
        new_name = request.form['name']
        new_phone = request.form['phone']
        new_email = request.form['email']
        new_sex = request.form.get('sex')
        new_age = int(request.form['age'])
        new_secret = request.form['secret']
        user_infor_manager.update_user_info(username, new_name, new_phone, new_email, new_sex, new_age, new_secret)
        flash('Update Successfully！')
        return redirect(url_for('home'))
    user_data = user_infor_manager.get_user_info(username)
    return render_template('edit_profile.html', user_data=user_data)