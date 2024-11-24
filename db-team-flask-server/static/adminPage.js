async function fetchData(url, tableSelector, columns) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const tableBody = document.querySelector(`${tableSelector} tbody`);
        tableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = columns
                .map(col => `<td>${item[col] === null ? '' : item[col]}</td>`)
                .join('');

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
    }
}

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

tableConfigs.forEach(config => fetchData(config.url, config.tableSelector, config.columns));
