// API로부터 데이터를 가져와 멀티 셀렉트 박스를 채우는 함수
function populateSelect(url, selectId) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById(selectId);
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.name || item.type_name || item.subtype_name || item.material_name;
                option.textContent = item.name || item.type_name || item.subtype_name || item.material_name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error(`Error fetching data for ${selectId}:`, error));
}

// 페이지 로드 시 각 셀렉트 박스에 데이터 추가
document.addEventListener('DOMContentLoaded', () => {
    populateSelect('/brands', 'bike-name'); // 자전거 이름 (Brand Name)
    populateSelect('/bikeTypes', 'type-name'); // 카테고리 (BikeType 테이블)
    populateSelect('/bikeSubTypes', 'subtype-name'); // 서브 카테고리 (BikeSubType 테이블)
    populateSelect('/materials', 'frame-material'); // 프레임 재질 (Material 테이블)
    populateSelect('/materials', 'wheel-material'); // 휠 재질 (Material 테이블)
});

// 검색 버튼 클릭 시 선택한 옵션 출력
function searchBikes() {
    const form = document.getElementById('search-form');
    const formData = new FormData(form);

    const selectedValues = {};
    for (const pair of formData.entries()) {
        if (!selectedValues[pair[0]]) selectedValues[pair[0]] = [];
        selectedValues[pair[0]].push(pair[1]);
    }

    console.log('선택된 값:', selectedValues);
    // 검색 API 호출 가능
}
