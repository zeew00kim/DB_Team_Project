import webbrowser
from threading import Timer
from flask import Flask, jsonify, render_template
import mysql.connector
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="madangdb"
)

@app.route('/')
def home():
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM bike")
    bikes = cursor.fetchall()

    cursor.execute("SELECT * FROM bikeType")
    bike_types = cursor.fetchall()

    cursor.execute("SELECT * FROM bikeSubType")
    bike_subtypes = cursor.fetchall()

    cursor.execute("SELECT * FROM brand")
    brands = cursor.fetchall()

    cursor.execute("SELECT * FROM material")
    materials = cursor.fetchall()

    cursor.close()

    return render_template(
        'index.html',
        bikes=bikes,
        bike_types=bike_types,
        bike_subtypes=bike_subtypes,
        brands=brands,
        materials=materials
    )

@app.route('/bikes', methods=['GET'])
def get_bikes():
    query = "SELECT * FROM bike"
    cursor = db.cursor(dictionary=True)
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    return jsonify(results)

@app.route('/bikeTypes', methods=['GET'])
def get_bike_types():
    query = "SELECT * FROM bikeType"
    cursor = db.cursor(dictionary=True)
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    return jsonify(results)

@app.route('/bikeSubTypes', methods=['GET'])
def get_bike_sub_types():
    query = "SELECT * FROM bikeSubType"
    cursor = db.cursor(dictionary=True)
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    return jsonify(results)

@app.route('/brands', methods=['GET'])
def get_brands():
    query = "SELECT * FROM brand"
    cursor = db.cursor(dictionary=True)
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    return jsonify(results)

@app.route('/materials', methods=['GET'])
def get_materials():
    query = "SELECT * FROM material"
    cursor = db.cursor(dictionary=True)
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    return jsonify(results)

def open_browser():
    webbrowser.open_new("http://127.0.0.1:5500")

if __name__ == '__main__':
    Timer(1, open_browser).start()
    app.run(debug=True, port=5500)