import Alpine from 'alpinejs';
const API_URL = "https://localhost:7050";

async function singupAsync(email: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Signup failed:", errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Signup error:", error);
    return false;
  }
}

async function loginAsync(email: string, password: string) : Promise<boolean> {
try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        twoFactorCode: '',
        twoFactorRecoveryCode: ''
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Login failed:", errorText);
      return false;
    }

    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    Alpine.store('auth').token = data.accessToken;
    Alpine.store('auth').refreshToken = data.refreshToken;
    Alpine.store('auth').isAuthenticated = true;
    await Alpine.store('auth').fetchUser();

    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

const AuthService = {
  singupAsync,
  loginAsync
};
export default AuthService;
