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

  // Сохраняем данные в localStorage
  localStorage.setItem("user", JSON.stringify(data));

  showApp(data);
}

// Показать приложение после авторизации
function showApp(data) {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("app-section").classList.remove("hidden");

  document.getElementById("user-name").innerText = data.name;
  document.getElementById("user-pic").src = data.picture;
}

// Выход
function logout() {
  localStorage.removeItem("user");
  document.getElementById("app-section").classList.add("hidden");
  document.getElementById("auth-section").classList.remove("hidden");
}

// Проверка, был ли пользователь уже авторизован
window.onload = function() {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    const data = JSON.parse(savedUser);
    showApp(data);
  }
};

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
