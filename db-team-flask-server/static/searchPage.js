// URL의 쿼리 파라미터에서 값을 가져오는 함수
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 브랜드 이름에 따라 제목 업데이트
function updateHeaderTitle() {
    const brand = getQueryParam('brand');
    const headerTitle = document.getElementById('header-title');
    if (brand) {
        headerTitle.innerHTML = `&lt; ${brand} 자전거 검색 페이지 &gt;`;
    }
}

// 페이지 로드 시 제목 업데이트 실행
document.addEventListener('DOMContentLoaded', updateHeaderTitle);
