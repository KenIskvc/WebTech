import { router } from '../../router';
import AuthService from '../../services/auth-service';
import Alpine from 'alpinejs';

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

    const success = await AuthService.loginAsync(email, password);

    if (success) {
      await Alpine.store("weather").init();
      router.navigate("/home");
    } else {
      alert('Login failed. Please check your credentials.');
    }
  });
}

setupLogin(); 