import Alpine from 'alpinejs';
import { router } from '../../router';

console.log("login.ts");
function setupLogin() {
  console.log("✅ login.ts loaded");
  const form = document.getElementById('login-form') as HTMLFormElement;

  console.log(form);
  form?.addEventListener('submit', async (e) => {
    console.log('submitted.');
    e.preventDefault();

    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const res = await fetch('https://localhost:7050/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: email, 
        password: password,
        twoFactorCode: '',
        twoFactorRecoveryCode: ''
      })
    });

    console.log(res);

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      Alpine.store('auth').token = data.accessToken;
      Alpine.store('auth').refreshToken = data.refreshToken;
      Alpine.store('auth').isAuthenticated = true;
      await Alpine.store('auth').fetchUser();
      router.navigate("/home");
    } else {
      alert('Login failed');
    }
  });
}

setupLogin(); 