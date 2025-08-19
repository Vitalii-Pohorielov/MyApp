// Копирование кода
function copyCode(code, button) {
  navigator.clipboard.writeText(code).then(() => {
    let original = button.innerText;
    button.innerText = "Скопировано!";
    button.disabled = true;
    setTimeout(() => {
      button.innerText = original;
      button.disabled = false;
    }, 2000);
  });
}

// Переход по ссылке
function openLink(url) {
  window.open(url, "_blank");
}

// Google авторизация
function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);

  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("user-info").classList.remove("hidden");
  document.getElementById("cards-section").classList.remove("hidden");

  document.getElementById("user-name").innerText = data.name;
  document.getElementById("user-pic").src = data.picture;
}

// Расшифровка JWT токена
function parseJwt(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(
    atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')
  );
  return JSON.parse(jsonPayload);
}
