// URL의 쿼리 파라미터에서 값을 가져오는 함수
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 브랜드 이름에 따라 제목과 문구 업데이트
function updateHeaderAndMessage() {
    const brand = getQueryParam('brand');
    const headerTitle = document.getElementById('header-title');
    const brandMessage = document.getElementById('brand-message');

    if (brand) {
        headerTitle.innerHTML = `&lt; ${brand} 자전거 검색 페이지 &gt;`;
        brandMessage.textContent = `${brand} 브랜드의 자전거를 조회합니다. 아래에서 원하는 검색 조건을 선택하세요😁`;
        brandMessage.style.textAlign = 'center';
        brandMessage.style.marginTop = 0;
        brandMessage.style.fontWeight = 'bold';
        brandMessage.style.fontSize = '20px';
    }
}

// API로부터 데이터를 가져와 멀티 셀렉트 박스를 채우는 함수
function populateSelect(url, selectId) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById(selectId);
            selectElement.innerHTML = ''; // 기존 옵션 초기화
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.type_name ?? item.subtype_name ?? item.material_name ?? item.brand_name ?? item.name ?? 'Unknown';
                option.textContent = item.type_name ?? item.subtype_name ?? item.material_name ?? item.brand_name ?? item.name ?? '알 수 없음';
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error(`Error fetching data for ${selectId}:`, error));
}

// 검색 버튼 클릭 시 API로 선택된 조건에 맞는 데이터를 조회하고 결과를 표시
function searchBikes() {
    const form = document.getElementById('search-form');
    const formData = new FormData(form);
    const selectedValues = {};

    // 폼 데이터 추출
    for (const [key, value] of formData.entries()) {
        if (!selectedValues[key]) selectedValues[key] = [];
        selectedValues[key].push(value);
    }

    // 브랜드 ID 추가
    const brandId = getQueryParam('brand_id');
    if (brandId) {
        selectedValues['brand_id'] = brandId;
    } else {
        console.warn('브랜드 ID가 없습니다. 모든 브랜드를 대상으로 검색합니다.');
    }

    // 서버에 데이터 전송
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '<p style="text-align: center;">검색 중입니다... ⏳</p>';

    fetch('/searchBikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedValues)
    })
        .then(response => response.json())
        .then(data => {
            resultsContainer.innerHTML = ''; // 기존 결과 초기화

            if (data.length > 0) {
                const table = document.createElement('table');
                table.className = 'results-table';
                table.style.border = '1px solid black';
                table.style.width = '100%';
                table.style.textAlign = 'center';

                const headerRow = document.createElement('tr');
                headerRow.innerHTML = `
                    <th>자전거 이름</th>
                    <th>가격</th>
                `;
                table.appendChild(headerRow);

                data.forEach(bike => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${bike.bike_name}</td>
                        <td>${bike.price.toLocaleString()} 원</td>
                    `;
                    table.appendChild(row);
                });

                resultsContainer.appendChild(table);
            } else {
                const noResultMessage = document.createElement('p');
                noResultMessage.textContent = '조건에 맞는 자전거 정보가 없습니다 😢';
                noResultMessage.style.color = 'red';
                noResultMessage.style.textAlign = 'center';
                resultsContainer.appendChild(noResultMessage);
            }
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            resultsContainer.innerHTML = '<p style="color: red; text-align: center;">오류가 발생했습니다. 다시 시도해주세요.</p>';
        });
}

// 페이지 로드 시 각 셀렉트 박스에 데이터 추가
document.addEventListener('DOMContentLoaded', () => {
    populateSelect('/bikeTypes', 'type-name'); // 카테고리
    populateSelect('/bikeSubTypes', 'subtype-name'); // 서브 카테고리
    populateSelect('/materials', 'frame-material'); // 프레임 재질
    populateSelect('/materials', 'wheel-material'); // 휠 재질
    updateHeaderAndMessage(); // 제목과 문구 업데이트
});
