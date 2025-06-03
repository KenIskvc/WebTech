import AuthService from "../../services/auth-service";

console.log("✅ signup.ts module loaded");

export default function () {
  const app = document.getElementById("app");
  if (!app) return;

  const emailInput = app.querySelector("#email") as HTMLInputElement;
  const passwordInput = app.querySelector("#password") as HTMLInputElement;
  const confirmInput = app.querySelector(
    "#confirm_password"
  ) as HTMLInputElement;
  const form = app.querySelector("#signup-form") as HTMLFormElement;
  const signupCard = app.querySelector(".signup-card") as HTMLElement;
  const resultCard = app.querySelector(".signup-result-card") as HTMLElement;
  const resultBox = app.querySelector(".signup-result-box") as HTMLElement;
  const title = document.getElementById("signup-title")!;
  const message = document.getElementById("signup-message")!;
  const loginLink = document.getElementById("signup-login-link")!;
  const retryLink = document.getElementById("signup-retry-link")!;

  // Password match validation
  function validatePassword() {
    if (passwordInput.value !== confirmInput.value) {
      confirmInput.setCustomValidity("Passwords don't match");
    } else {
      confirmInput.setCustomValidity("");
    }
  }

  passwordInput.addEventListener("change", validatePassword);
  confirmInput.addEventListener("keyup", validatePassword);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const success : boolean = await AuthService.singupAsync(email, password);

    console.log(success);
    
    signupCard.style.display = "none";
    resultCard.style.display = "flex";

    if (success) {
      title.textContent = "Success";
      message.textContent =
        "You've signed up successfully. Please proceed to login.";
      loginLink.style.display = "inline";
      retryLink.style.display = "none";
      resultBox.classList.add("success");
    } else {
      title.textContent = "Error";
      message.textContent = `Signup failed.`;
      loginLink.style.display = "none";
      retryLink.style.display = "inline";
      resultBox.classList.add("error");
    }
  });
}
