from flask import Flask, render_template, request

app = Flask(__name__)

default_username = "Create Account"

@app.route('/static/index')
def home():
    return render_template("index.html", page_title=default_username)


if __name__ == '__main__':
    app.run(debug=True)