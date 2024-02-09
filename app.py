from flask import Flask, render_template, request

app = Flask(__name__)

default_username = "Create Account"

@app.route('/')
def home():
    return render_template("homepage.html")

@app.route('/game')
def game():
    return render_template("index.html")

@app.route('/about')
def about():
    return render_template("about.html")

if __name__ == '__main__':
    app.run(debug=True,port=3000)