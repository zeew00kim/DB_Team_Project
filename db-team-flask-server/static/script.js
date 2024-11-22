function searchBikes() {
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    const resultsDiv = document.getElementById('results');

    if (selectedCategories.length === 0) {
        resultsDiv.innerHTML = '<p style="color: red;">선택하신 조건의 자전거가 존재하지 않습니다😢</p>';
        return;
    }

    fetch(`/search-results?categories=${selectedCategories.join(',')}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                resultsDiv.innerHTML = '<p style="color: red;">선택하신 조건의 자전거가 존재하지 않습니다😢</p>';
            } else {
                const table = document.createElement('table');
                table.className = 'table';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Bike Name</th>
                            <th>Price</th>
                            <th>Type Name</th>
                            <th>Subtype Name</th>
                            <th>Frame Material</th>
                            <th>Wheel Material</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `
                            <tr>
                                <td>${row.bike_name}</td>
                                <td>${row.price}</td>
                                <td>${row.type_name}</td>
                                <td>${row.subtype_name}</td>
                                <td>${row.frame_material}</td>
                                <td>${row.wheel_material}</td>
                            </tr>`).join('')}
                    </tbody>`;
                resultsDiv.innerHTML = '';
                resultsDiv.appendChild(table);
            }
        });
}
