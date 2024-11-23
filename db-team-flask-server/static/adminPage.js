// 데이터를 가져와 각 테이블에 표시하는 함수
async function fetchData(url, tableSelector) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const tableBody = document.querySelector(`${tableSelector} tbody`);
        tableBody.innerHTML = ''; // 기존 데이터 초기화

        data.forEach(item => {
            const row = document.createElement('tr');

            // null 값을 공백으로 처리
            row.innerHTML = Object.values(item)
                .map(value => `<td>${value === null ? '' : value}</td>`)
                .join('');

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
    }
}

// 테이블 데이터를 동적으로 호출하도록 매핑
const tableConfigs = [
    { url: '/admin-bikes', tableSelector: '#bikeTable' },
    { url: '/admin-bikeTypes', tableSelector: '#bikeTypeTable' },
    { url: '/admin-bikeSubTypes', tableSelector: '#bikeSubTypeTable' },
    { url: '/admin-brands', tableSelector: '#brandTable' },
    { url: '/admin-materials', tableSelector: '#materialTable' }
];

// 각 테이블에 대해 fetchData 함수 호출
tableConfigs.forEach(config => fetchData(config.url, config.tableSelector));
