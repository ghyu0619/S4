import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

function navigate(buttonId, url) {
  document.getElementById(buttonId).onclick = async () => {
    if (!auth.currentUser) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    window.location.href = url;
  };
}

async function setupBoardgame() {
  const btn = document.getElementById('btn-boardgame');
  btn.onclick = async () => {
    if (!auth.currentUser) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
    const userData = userSnap.data() || {};
    // 관리자 권한 여부 확인
    if (userData.isAdmin === 1) {
      window.location.href = 'boardgame.html';
      return;
    }
    // 일반 사용자인 경우 설정 문서 확인
    const settingSnap = await getDoc(doc(db, 'settings', 'boardGame'));
    const setting = settingSnap.exists() ? settingSnap.data().enabled : false;
    if (setting) {
      window.location.href = 'boardgame.html';
    } else {
      alert('현재 보드게임카페 기능이 열려 있지 않습니다.');
    }
  };
}

window.addEventListener('DOMContentLoaded', () => {
  navigate('btn-schedule', 'schedule.html');
  navigate('btn-grouping', 'grouping.html');
  navigate('btn-praise', 'praise.html');
  setupBoardgame();
});

// auth 상태 변화에도 버튼 클릭 로직은 auth.currentUser를 확인하므로 재설정 불필요
