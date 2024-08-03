const window_title = document.getElementById('window_title');
const tab_title = document.getElementById('tab_title');

const window = document.getElementById('window');
const tab = document.getElementById('tab');

//윈도우 저장소 클릭했을 때
// 윈도우 저장소 글자 강조
// 윈도우 저장한것들 보여주기 -> not_now 클래스 옮긴다.
window_title.addEventListener('click', ()=>{
    // '윈도우 저장소'글자에 'now_title'클래스 붙이기
    // '탭 저장소' 글자에 'not_now_title'클래스 붙이기
    window_title.className = 'now_title';
    tab_title.className = 'not_now_title';

    // not_now클래스 'tab' 아이디로 옮기기
    window.className = '';
    tab.className = 'not_now';
});

//탭 저장소 클릭했을 때
// 탭 저장소 글자 강조
// 탭 저장한것들 보여주기 -> not_now 클래스 옮긴다.
tab_title.addEventListener('click', ()=>{
    // '탭 저장소'글자에 'now_title'클래스 붙이기
    // '윈도우 저장소' 글자에 'not_now_title'클래스 붙이기
    window_title.className = 'not_now_title';
    tab_title.className = 'now_title';

    // not_now클래스 'window' 아이디로 옮기기
    window.className = 'not_now';
    tab.className = '';
});