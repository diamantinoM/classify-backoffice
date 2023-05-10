import { showErrorMessage } from "./utils/message-box.js";

async function signIn(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    const response = await fetch("https://api.classify.pt/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (!response.ok) {
      return await showErrorMessage(
        `As suas credenciais estão incorretas. Tente novamente!`
      );
    }
    const { token } = await response.json();
    const tokenInfo = window.sessionStorage.setItem("token", token); // using sessionStorage to store the token
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error(err);
  }
}
function main() {
  const form = document.getElementById("sign_in");
  form.addEventListener("submit", signIn);
}

window.addEventListener("load", main);
