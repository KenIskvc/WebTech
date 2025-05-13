import Alpine from 'alpinejs';

export function setupLogin() {
  const form = document.getElementById('login-form') as HTMLFormElement;

  form?.addEventListener('submit', async (e) => {
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

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      Alpine.store('auth').token = data.accessToken;
      Alpine.store('auth').refreshToken = data.refreshToken;
      Alpine.store('auth').isAuthenticated = true;
      await Alpine.store('auth').fetchUser();
      window.location.hash = '/home';
    } else {
      alert('Login failed');
    }
  });
}
