select * from brand;

-- -- 자전거 상위 종류 테이블 (예: 로드 자전거, 산악 자전거)
-- CREATE TABLE BikeType (
--     type_id INT PRIMARY KEY,                    -- 자전거 상위 종류 ID (기본 키)
--     type_name VARCHAR(50)                       -- 자전거 상위 종류 이름 (예: 로드, 산악)
-- );

-- -- 자전거 하위 세부 종류 테이블 (예: 로드 자전거 -> 에어로, 엔듀런스 등)
-- CREATE TABLE BikeSubType (
--     subtype_id INT PRIMARY KEY,                 -- 자전거 하위 세부 종류 ID (기본 키)
--     type_id INT,                                -- 자전거 상위 종류 ID (외래 키, BikeType 테이블 참조)
--     subtype_name VARCHAR(50),                   -- 자전거 하위 세부 종류 이름 (예: 에어로, 다운힐 등)
--     FOREIGN KEY (type_id) REFERENCES BikeType(type_id) -- 상위 종류와 연관
-- );

-- -- 자전거 브랜드 테이블 (예: 브랜드 이름)
-- CREATE TABLE Brand (
--     brand_id INT PRIMARY KEY,                   -- 브랜드 ID (기본 키)
--     brand_name VARCHAR(50)                      -- 브랜드 이름
-- );

-- -- 소재 정보 테이블 (프레임과 휠 소재를 통합 관리, 예: 알루미늄, 탄소섬유 등)
-- CREATE TABLE Material (
--     material_id INT PRIMARY KEY,                -- 소재 ID (기본 키)
--     material_name VARCHAR(50)                   -- 소재 이름 (예: 알루미늄, 탄소섬유 등)
-- );

-- -- 자전거 정보 테이블
-- CREATE TABLE Bike (
--     bike_id INT PRIMARY KEY,                    -- 자전거 고유 ID (기본 키)
--     subtype_id INT,                             -- 자전거 하위 세부 종류 ID (외래 키, BikeSubType 테이블 참조)
--     brand_id INT,                               -- 브랜드 ID (외래 키, Brand 테이블 참조)
--     price int,                       -- 자전거 가격 (정수 8자리, 소수 2자리)
--     frame_material_id INT,                      -- 프레임 소재 ID (외래 키, Material 테이블 참조)
--     wheel_material_id INT,                      -- 휠 소재 ID (외래 키, Material 테이블 참조)
--     bike_name varchar(50),                      -- 자전거의 이름
--     FOREIGN KEY (subtype_id) REFERENCES BikeSubType(subtype_id),  -- 하위 세부 종류와 연관
--     FOREIGN KEY (brand_id) REFERENCES Brand(brand_id),            -- 브랜드와 연관
--     FOREIGN KEY (frame_material_id) REFERENCES Material(material_id), -- 프레임 소재와 연관
--     FOREIGN KEY (wheel_material_id) REFERENCES Material(material_id)  -- 휠 소재와 연관
-- );

-- BASSO
-- INSERT INTO Bike (bike_id, subtype_id, brand_id, price, frame_material_id, wheel_material_id, bike_name) VALUES
-- -- 기함급 로드 자전거
-- (1, 1, 1, 15000000, 1, 1, 'Basso Diamante SV'),  -- Basso 브랜드, 로드 자전거 - 에어로, 가격 1,500만원
-- (2, 3, 1, 14000000, 1, 1, 'Basso Diamante'),      -- Basso 브랜드, 로드 자전거 - 올라운드, 가격 1,400만원

-- -- 미드레인지 로드 자전거
-- (3, 3, 1, 8500000, 1, 2, 'Basso Astra'),         -- Basso 브랜드, 로드 자전거 - 올라운드, 가격 850만원
-- (4, 4, 1, 6500000, 2, 2, 'Basso Venta'),         -- Basso 브랜드, 로드 자전거 - 타임트라이얼, 가격 650만원

-- -- 엔트리급 로드 자전거
-- (5, 1, 1, 4000000, 2, 2, 'Basso Laguna'),        -- Basso 브랜드, 로드 자전거 - 에어로, 가격 400만원
-- (6, 2, 1, 3000000, 2, 2, 'Basso Kona'),          -- Basso 브랜드, 로드 자전거 - 엔듀런스, 가격 300만원

-- -- 산악 자전거 라인업
-- (7, 5, 1, 5500000, 2, 3, 'Basso Palta'),         -- Basso 브랜드, 산악 자전거 - 올마운틴, 가격 550만원
-- (8, 6, 1, 4500000, 2, 3, 'Basso Terreno'),       -- Basso 브랜드, 산악 자전거 - 하드테일, 가격 450만원
-- (9, 4, 1, 7000000, 1, 2, 'Basso Terra'),         -- Basso 브랜드, 산악 자전거 - 다운힐, 가격 700만원

-- -- 하이브리드 자전거
-- (10, 7, 1, 2500000, 2, 2, 'Basso Volta'),        -- Basso 브랜드, 하이브리드 자전거, 가격 250만원
-- (11, 7, 1, 1500000, 2, 2, 'Basso Hybrid 1.0');   -- Basso 브랜드, 하이브리드 자전거, 가격 150만원