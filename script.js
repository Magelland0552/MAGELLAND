
const REDIRECT_URL = "https://pay-zeta-five.vercel.app/";
// Replace with your actual hosted website URL.

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const heading = document.getElementById("heading");
const subtitle = document.getElementById("subtitle");
const message = document.getElementById("message");

function showMessage(text, type) {
  message.textContent = text;
  message.className = "message show " + type;
}

function switchMode(mode) {
  const isLogin = mode === "login";

  loginForm.classList.toggle("hidden", !isLogin);
  registerForm.classList.toggle("hidden", isLogin);

  loginTab.classList.toggle("active", isLogin);
  registerTab.classList.toggle("active", !isLogin);

  loginTab.setAttribute("aria-selected", String(isLogin));
  registerTab.setAttribute("aria-selected", String(!isLogin));

  heading.textContent = isLogin
    ? "Welcome back"
    : "Create your account";

  subtitle.textContent = isLogin
    ? "Enter your details below to sign in to your account."
    : "Create your account to get started.";

  message.className = "message";
}

loginTab.addEventListener("click", () => switchMode("login"));
registerTab.addEventListener("click", () => switchMode("register"));

document.querySelectorAll(".toggle-password").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";
    button.textContent = isPassword ? "Hide" : "Show";
  });
});

async function sendRequest(url, email, password, button) {
  const originalText = button.textContent;

  button.disabled = true;
  button.textContent = "Please wait...";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "The request failed.");
    }

    return data;
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

registerForm.addEventListener("submit", async event => {
  event.preventDefault();

  const button = registerForm.querySelector(
    "button[type='submit']"
  );

  try {
    const data = await sendRequest(
      "/register",
      document.getElementById("registerEmail").value,
      document.getElementById("registerPassword").value,
      button
    );

    console.log(data.message);

    registerForm.reset();
    switchMode("login");

    showMessage(
      "Account created successfully! You can now sign in.",
      "success"
    );
  } catch (error) {
    showMessage(
      error.message || "Could not create your account.",
      "error"
    );

    console.error(error);
  }
});

loginForm.addEventListener("submit", async event => {
  event.preventDefault();

  const button = loginForm.querySelector(
    "button[type='submit']"
  );

  try {
    const data = await sendRequest(
      "/login",
      document.getElementById("loginEmail").value,
      document.getElementById("loginPassword").value,
      button
    );

    console.log(data.message);

    showMessage("Login successful! Redirecting...", "success");

    window.location.assign(REDIRECT_URL);
  } catch (error) {
    showMessage(
      error.message || "Could not sign in.",
      "error"
    );

    console.error(error);
  }
});
