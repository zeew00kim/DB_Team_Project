function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

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

function populateSelect(url, selectId) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById(selectId);
            selectElement.innerHTML = '';
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.type_name ?? item.subtype_name ?? item.material_name ?? item.brand_name ?? item.name ?? 'Unknown';
                option.textContent = item.type_name ?? item.subtype_name ?? item.material_name ?? item.brand_name ?? item.name ?? '알 수 없음';
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error(`Error fetching data for ${selectId}:`, error));
}

function searchBikes() {
    const form = document.getElementById('search-form');
    const formData = new FormData(form);
    const selectedValues = {};

    for (const [key, value] of formData.entries()) {
        if (!selectedValues[key]) selectedValues[key] = [];
        selectedValues[key].push(value);
    }

    const brandId = getQueryParam('brand_id');
    if (brandId) {
        selectedValues['brand_id'] = brandId;
    } else {
        console.warn('브랜드 ID가 없습니다. 모든 브랜드를 대상으로 검색합니다.');
    }

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '<p style="text-align: center;">검색 중입니다... ⏳</p>';

    fetch('/searchBikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedValues)
    })
        .then(response => response.json())
        .then(data => {
            resultsContainer.innerHTML = '';

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

document.addEventListener('DOMContentLoaded', () => {
    populateSelect('/bikeTypes', 'type-name'); 
    populateSelect('/bikeSubTypes', 'subtype-name'); 
    populateSelect('/materials', 'frame-material'); 
    populateSelect('/materials', 'wheel-material'); 
    updateHeaderAndMessage();
});