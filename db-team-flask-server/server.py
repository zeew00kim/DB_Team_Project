import os
import webbrowser
from threading import Timer
from flask import Flask, jsonify, render_template, request
import mysql.connector
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# 데이터베이스 연결
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="madangdb"
)

# 기본 홈 페이지
@app.route('/')
def home():
    cursor = db.cursor(dictionary=True)

    # 브랜드 정보 가져오기
    cursor.execute("SELECT * FROM brand")
    brands = cursor.fetchall()
    cursor.close()

    # 각 브랜드에 대해 이미지 경로 확인
    for brand in brands:
        image_base_path = f"static/images/{brand['brand_name']}"
        if os.path.exists(f"{image_base_path}.png"):
            brand['image_path'] = f"{image_base_path}.png"
        elif os.path.exists(f"{image_base_path}.jpeg"):
            brand['image_path'] = f"{image_base_path}.jpeg"
        else:
            brand['image_path'] = None  # 이미지가 없는 경우

    return render_template('index.html', brands=brands)

# 특정 테이블 데이터를 JSON으로 반환
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

# 브랜드 클릭 시 검색 페이지로 이동
@app.route('/search', methods=['GET'])
def search():
    brand_id = request.args.get('brand_id')
    return render_template('searchPage.html', brand_id=brand_id)

# 검색 결과 반환
@app.route('/search-results', methods=['GET'])
def search_results():
    try:
        categories = request.args.get('categories').split(',')
        brand_id = request.args.get('brand_id')

        # 선택된 카테고리에 따라 동적으로 SQL 생성
        columns = {
            "Bike Name": "bike.bike_name",
            "Price": "bike.price",
            "Type Name": "bikeType.type_name",
            "Subtype Name": "bikeSubType.subtype_name",
            "Frame Material": "material.material_name",
            "Wheel Material": "material.material_name"
        }

        selected_columns = [columns[category] for category in categories if category in columns]

        if not selected_columns:
            return jsonify([])

        query = f"""
            SELECT {', '.join(selected_columns)}
            FROM bike
            INNER JOIN bikeType ON bike.type_id = bikeType.type_id
            INNER JOIN bikeSubType ON bike.subtype_id = bikeSubType.subtype_id
            INNER JOIN brand ON bike.brand_id = brand.brand_id
            INNER JOIN material ON bike.frame_material_id = material.material_id
            WHERE bike.brand_id = %s
            ORDER BY bike.price DESC
        """

        cursor = db.cursor(dictionary=True)
        cursor.execute(query, (brand_id,))
        results = cursor.fetchall()
        cursor.close()

        return jsonify(results)

    except Exception as e:
        print(f"Error in /search-results: {e}")
        return jsonify({"error": "An error occurred while fetching search results"}), 500

# 브라우저 자동 열기
def open_browser():
    webbrowser.open_new("http://127.0.0.1:5500")

# Flask 실행
if __name__ == '__main__':
    Timer(1, open_browser).start()
    app.run(debug=True, port=5500)
