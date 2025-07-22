import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { doc, setDoc, collection, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

const form = document.getElementById('signup-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id       = document.getElementById('signup-id').value;
  const password = document.getElementById('signup-password').value;
  const name     = document.getElementById('signup-name').value;
  const group    = document.getElementById('signup-group').value;
  const chapter  = document.getElementById('signup-chapter').value;

  try {
    // Firebase Auth 등록
    const userCred = await createUserWithEmailAndPassword(auth, id, password);
    const uid = userCred.user.uid;

    // Firestore에 사용자 정보 초기 저장
    await setDoc(doc(db, 'users', uid), {
      id,
      name,
      group,
      chapter,
      points: 0,
      playCounts: {}
    });

    // 이미 등록된 다른 사용자들에 대해 playCounts 업데이트
    const usersSnap = await getDocs(collection(db, 'users'));
    const newPlayCounts = {};
    usersSnap.forEach(docSnap => {
      const otherId = docSnap.id;
      const data    = docSnap.data();
      if (otherId !== uid) {
        // 새 사용자 이름을 기존 사용자들의 playCounts에 추가
        updateDoc(doc(db, 'users', otherId), {
          [`playCounts.${name}`]: 0
        });
        // 기존 사용자 이름을 새 사용자의 playCounts에 추가
        newPlayCounts[data.name] = 0;
      }
    });

    // 새 사용자 playCounts 필드 업데이트
    await updateDoc(doc(db, 'users', uid), {
      playCounts: newPlayCounts
    });

    alert('회원가입에 성공했습니다.');
    window.location.href = 'login.html';
  } catch (error) {
    console.error(error);
    alert('회원가입 실패: ' + error.message);
  }
});
