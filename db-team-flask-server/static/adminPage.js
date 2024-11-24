async function fetchData(url, tableSelector, columns) {
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
            
            // 열 순서를 강제
            row.innerHTML = columns
                .map(col => `<td>${item[col] === null ? '' : item[col]}</td>`)
                .join('');

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
    }
}

// 테이블 데이터를 동적으로 호출하도록 매핑
const tableConfigs = [
    {
        url: '/admin-bikes',
        tableSelector: '#bikeTable',
        columns: ['bike_id', 'subtype_id', 'brand_id', 'price', 'frame_material_id', 'wheel_material_id', 'bike_name']
    },
    {
        url: '/admin-bikeTypes',
        tableSelector: '#bikeTypeTable',
        columns: ['type_id', 'type_name']
    },
    {
        url: '/admin-bikeSubTypes',
        tableSelector: '#bikeSubTypeTable',
        columns: ['subtype_id', 'type_id', 'subtype_name']
    },
    {
        url: '/admin-brands',
        tableSelector: '#brandTable',
        columns: ['brand_id', 'brand_name']
    },
    {
        url: '/admin-materials',
        tableSelector: '#materialTable',
        columns: ['material_id', 'material_name']
    }
];

// 각 테이블에 대해 fetchData 함수 호출
tableConfigs.forEach(config => fetchData(config.url, config.tableSelector, config.columns));
