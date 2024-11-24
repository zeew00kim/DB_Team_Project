import os
import webbrowser
from threading import Timer
from flask import Flask, jsonify, render_template, request, redirect, url_for
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# 데이터베이스 연결 설정
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="madangdb"
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# 홈 페이지 라우트
@app.route('/')
def home():
    connection = get_db_connection()
    if connection is None:
        return "DB 연결 실패", 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM brand")
    brands = cursor.fetchall()
    cursor.close()
    connection.close()

    for brand in brands:
        image_base_path = f"static/images/{brand['brand_name']}"
        if os.path.exists(f"{image_base_path}.png"):
            brand['image_path'] = f"{image_base_path}.png"
        elif os.path.exists(f"{image_base_path}.jpeg"):
            brand['image_path'] = f"{image_base_path}.jpeg"
        else:
            brand['image_path'] = None

    return render_template('index.html', brands=brands)

# 관리자 페이지 라우트
@app.route('/admin-page')
def admin_page():
    return render_template('adminPage.html')

# 관리자 코드 검증
@app.route('/validate-admin', methods=['POST'])
def validate_admin():
    admin_code = request.form.get('admin-code')
    if admin_code == "2022158067":
        return redirect(url_for('admin_page'))
    else:
        return render_template('index.html', brands=[], error_message="잘못된 코드입니다. 다시 입력하세요. 🤔")

# 검색 페이지 라우트
@app.route('/search', methods=['GET'])
def search():
    brand_id = request.args.get('brand_id')
    return render_template('searchPage.html', brand_id=brand_id)

# 검색 결과 라우트
@app.route('/search-results', methods=['GET'])
def search_results():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    try:
        categories = request.args.get('categories', '').split(',')
        if not categories:
            return jsonify([])

        brand_id = request.args.get('brand_id', None)
        columns = {
            "Bike Name": "bike.bike_name",
            "Price": "bike.price",
            "Type Name": "bikeType.type_name",
            "Subtype Name": "bikeSubType.subtype_name",
            "Frame Material": "material.material_name",
            "Wheel Material": "material.material_name"
        }
        selected_columns = [columns[cat] for cat in categories if cat in columns]

        query = f"""
            SELECT {', '.join(selected_columns)}
            FROM bike
            INNER JOIN bikeType ON bike.type_id = bikeType.type_id
            INNER JOIN bikeSubType ON bike.subtype_id = bikeSubType.subtype_id
            INNER JOIN brand ON bike.brand_id = brand.brand_id
            INNER JOIN material ON bike.frame_material_id = material.material_id
            WHERE 1=1
        """
        params = []

        if brand_id:
            query += " AND bike.brand_id = %s"
            params.append(brand_id)

        query += " ORDER BY bike.price DESC"

        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, params)
        results = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify(results)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# 브랜드 정보 가져오기
@app.route('/brands', methods=['GET'])
def get_brands():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT brand_id, brand_name FROM brand")
    brands = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(brands)

# Bike 테이블 정보 가져오기
@app.route('/bikes', methods=['GET'])
def get_bikes():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM bike")
    bikes = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(bikes)

# BikeType 테이블 정보 가져오기
@app.route('/bikeTypes', methods=['GET'])
def get_bike_types():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT type_id, type_name FROM biketype")
    bike_types = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(bike_types)

# BikeSubType 테이블 정보 가져오기
@app.route('/bikeSubTypes', methods=['GET'])
def get_bike_sub_types():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT subtype_id, type_id, subtype_name FROM bikesubtype")
    bike_sub_types = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(bike_sub_types)

# Material 테이블 정보 가져오기
@app.route('/materials', methods=['GET'])
def get_materials():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT material_id, material_name FROM material")
    materials = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(materials)

# 관리자용 데이터 가져오기
@app.route('/admin-bikeTypes', methods=['GET'])
def get_admin_bike_types():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT type_id, type_name FROM biketype")
    bike_types = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(bike_types)

@app.route('/admin-bikeSubTypes', methods=['GET'])
def get_admin_bike_sub_types():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    cursor = connection.cursor(dictionary=True)
    query = """
        SELECT subtype_id, type_id, subtype_name
        FROM bikesubtype
        ORDER BY subtype_id ASC
    """
    cursor.execute(query)
    bike_sub_types = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(bike_sub_types)

@app.route('/admin-brands', methods=['GET'])
def get_admin_brands():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    cursor = connection.cursor(dictionary=True)
    query = """
        SELECT brand_id, brand_name
        FROM brand
        ORDER BY brand_id ASC
    """
    cursor.execute(query)
    brands = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(brands)

@app.route('/admin-materials', methods=['GET'])
def get_admin_materials():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    cursor = connection.cursor(dictionary=True)
    query = """
        SELECT material_id, material_name
        FROM material
        ORDER BY material_id ASC
    """
    cursor.execute(query)
    materials = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(materials)

@app.route('/admin-bikes', methods=['GET'])
def get_admin_bikes():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    cursor = connection.cursor(dictionary=True)
    # 수정된 SQL 쿼리: bikesubtype 테이블을 포함한 조인
    query = """
        SELECT 
            bike.bike_id,
            bike.subtype_id,
            bike.brand_id,
            bike.price,
            bike.frame_material_id,
            bike.wheel_material_id,
            bike.bike_name
        FROM bike
        INNER JOIN bikesubtype ON bike.subtype_id = bikesubtype.subtype_id
        ORDER BY bike.bike_id ASC
    """
    cursor.execute(query)
    bikes = cursor.fetchall()
    cursor.close()
    connection.close()

    return jsonify(bikes)

@app.route('/searchBikes', methods=['POST'])
def search_bikes():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "DB 연결 실패"}), 500

    try:
        data = request.json
        type_names = data.get("type-name", [])
        subtype_names = data.get("subtype-name", [])
        frame_materials = data.get("frame-material", [])
        wheel_materials = data.get("wheel-material", [])
        brand_id = data.get("brand_id")

        query = """
            SELECT bike.bike_name, bike.price
            FROM bike
            INNER JOIN bikesubtype ON bike.subtype_id = bikesubtype.subtype_id
            INNER JOIN biketype ON bikesubtype.type_id = biketype.type_id
            INNER JOIN material AS frame_material ON bike.frame_material_id = frame_material.material_id
            INNER JOIN material AS wheel_material ON bike.wheel_material_id = wheel_material.material_id
            WHERE 1=1
        """
        params = []

        if brand_id:
            query += " AND bike.brand_id = %s"
            params.append(brand_id)

        if type_names:
            query += " AND biketype.type_name IN (%s)" % ','.join(['%s'] * len(type_names))
            params.extend(type_names)

        if subtype_names:
            query += " AND bikesubtype.subtype_name IN (%s)" % ','.join(['%s'] * len(subtype_names))
            params.extend(subtype_names)

        if frame_materials:
            query += " AND frame_material.material_name IN (%s)" % ','.join(['%s'] * len(frame_materials))
            params.extend(frame_materials)

        if wheel_materials:
            query += " AND wheel_material.material_name IN (%s)" % ','.join(['%s'] * len(wheel_materials))
            params.extend(wheel_materials)

        query += " ORDER BY bike.price DESC"

        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, params)
        results = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify(results)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

# 브라우저 자동 실행
def open_browser():
    webbrowser.open_new("http://127.0.0.1:5500")

if __name__ == '__main__':
    Timer(1, open_browser).start()
    app.run(debug=True, port=5500)
