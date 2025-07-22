import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

// 공통 헤더 동적 생성 및 인증 상태 관리
window.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');

  // 헤더 기본 구조
  header.innerHTML = `
    <div class="header-container" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;">
      <a href="index.html" class="logo" style="font-weight:bold;text-decoration:none;color:#000;">다운공동체교회 G20</a>
      <div id="auth-area" style="display:flex;align-items:center;gap:0.5rem;"></div>
    </div>
  `;

  const authArea = document.getElementById('auth-area');

  // 로그인 폼 렌더링
  function renderLogin() {
    authArea.innerHTML = `
      <input id="login-id" type="text" placeholder="ID" />
      <input id="login-pw" type="password" placeholder="Password" />
      <button id="btn-login">로그인</button>
      <button id="btn-signup">회원가입</button>
    `;

    document.getElementById('btn-login').onclick = async () => {
      const id = document.getElementById('login-id').value;
      const pw = document.getElementById('login-pw').value;
      try {
        const userCred = await signInWithEmailAndPassword(auth, id, pw);
        // 로그인 성공 시 Firestore에서 사용자 정보 가져오기
        const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
        const data = userDoc.data();
        renderUser(data);
      } catch (err) {
        alert('ID 또는 비밀번호가 잘못되었습니다.');
      }
    };

    document.getElementById('btn-signup').onclick = () => {
      window.location.href = 'signup.html';
    };
  }

  // 로그인된 사용자 정보 렌더링
  function renderUser(userData) {
    const { name, group, chapter, isAdmin } = userData;
    let html = `<span>${name} / ${group} / ${chapter}</span>`;
    html += `<button id="btn-logout">로그아웃</button>`;
    if (isAdmin === 1) {
      html = `<button id="btn-admin" style="background:red;color:#fff;">관리자</button>` + html;
    }
    authArea.innerHTML = html;

    // 이벤트
    if (isAdmin === 1) {
      document.getElementById('btn-admin').onclick = () => {
        window.location.href = 'admin.html';
      };
    }
    document.getElementById('btn-logout').onclick = async () => {
      await signOut(auth);
      renderLogin();
    };
  }

  // 초기: 인증 상태 확인 후 렌더
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      renderUser(userDoc.data());
    } else {
      renderLogin();
    }
  });
});
