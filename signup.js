import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import { doc, setDoc, collection, getDocs, writeBatch } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';

const form = document.getElementById('signup-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id       = document.getElementById('signup-id').value;
  const password = document.getElementById('signup-password').value;
  const name     = document.getElementById('signup-name').value;
  const group    = document.getElementById('signup-group').value;
  const chapter  = document.getElementById('signup-chapter').value;

  try {
    // 1) Firebase Auth에 사용자 등록
    const userCred = await createUserWithEmailAndPassword(auth, id, password);
    const uid = userCred.user.uid;

    // 2) 기존 사용자 정보 조회 (가입 후 인증된 사용자로 수행)
    const usersSnap = await getDocs(collection(db, 'users'));
    const existingUsers = usersSnap.docs.map(docSnap => ({
      uid: docSnap.id,
      name: docSnap.data().name
    }));

    // 3) 새 사용자 문서 생성용 playCounts 맵 구성
    const newPlayCounts = {};
    existingUsers.forEach(({ name: otherName }) => {
      newPlayCounts[otherName] = 0;
    });

    // 4) Firestore에 새 사용자 정보 저장
    await setDoc(doc(db, 'users', uid), {
      id,
      name,
      group,
      chapter,
      points: 0,
      playCounts: newPlayCounts,
      isAdmin: 0
    });

    // 5) 기존 사용자들의 playCounts에 새 사용자 이름 추가
    if (existingUsers.length > 0) {
      const batch = writeBatch(db);
      existingUsers.forEach(({ uid: otherUid }) => {
        batch.update(doc(db, 'users', otherUid), {
          [`playCounts.${name}`]: 0
        });
      });
      await batch.commit();
    }

    alert('회원가입에 성공했습니다.');
    window.location.href = 'login.html';
  } catch (error) {
    console.error(error);
    alert('회원가입 실패: ' + error.message);
  }
});
