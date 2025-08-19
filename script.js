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

// Открыть ссылку оплаты
function openLink(url) {
  window.open(url, "_blank");
}

// Google авторизация
function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);

  // Скрываем секцию авторизации
  document.getElementById("auth-section").classList.add("hidden");

  // Показываем приложение
  document.getElementById("app-section").classList.remove("hidden");

  // Показываем данные пользователя
  document.getElementById("user-name").innerText = data.name;
  document.getElementById("user-pic").src = data.picture;
}

// Парсим JWT
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
