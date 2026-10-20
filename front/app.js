document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('pass').value.trim();

  if (!email || !password) {
    return alert('Введите email и пароль');
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    document.getElementById('page-dashboard').checked = true;

    document.querySelector('.user .u-name').textContent = data.user.name;
    document.querySelector('.user .u-role').textContent = data.user.role;
  } catch (err) {
    alert('Ошибка соединения с сервером');
  }
});

const modal = document.getElementById('register-modal');
const btnReg = document.getElementById('register-btn');
const btnCancel = document.getElementById('cancel-reg');
const btnSubmit = document.getElementById('submit-reg');

btnReg.addEventListener('click', () => {
  modal.classList.add('show');
  document.getElementById('reg-name').focus();
});

btnCancel.addEventListener('click', () => {
  modal.classList.remove('show');
});

btnSubmit.addEventListener('click', async () => {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-pass').value.trim();

  if (!name || !email || !password) {
    return alert('Заполните все поля!');
  }

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    alert('Аккаунт создан! Теперь войдите.');
    
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-pass').value = '';
    modal.classList.remove('show');
  } catch (err) {
    alert('Ошибка соединения с сервером');
  }
});

const eyeBtn = document.querySelector('.eye');
const passInput = document.getElementById('pass');

eyeBtn.addEventListener('click', () => {

  if (passInput.type === 'password') {
    passInput.type = 'text';
    eyeBtn.textContent = '🙈'; 
  } else {
    
    passInput.type = 'password';
    eyeBtn.textContent = '👁';
  }
});