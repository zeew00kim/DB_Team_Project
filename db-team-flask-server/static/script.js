// 데이터를 가져와 각 테이블에 표시하는 함수
function fetchData(url, tableSelector) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector(`${tableSelector} tbody`);
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = Object.values(item).map(value => `<td>${value}</td>`).join('');
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error(`Error fetching data from ${url}:`, error));
}

// 각 테이블에 대해 fetchData 함수 호출
fetchData('http://localhost:5500/bikes', '#bikeTable');
fetchData('http://localhost:5500/bikeTypes', '#bikeTypeTable');
fetchData('http://localhost:5500/bikeSubTypes', '#bikeSubTypeTable');
fetchData('http://localhost:5500/brands', '#brandTable');
fetchData('http://localhost:5500/materials', '#materialTable');
