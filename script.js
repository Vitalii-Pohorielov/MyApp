function handleCredentialResponse(response) {
  // Расшифровка JWT токена
  const data = parseJwt(response.credential);
  console.log("Пользователь:", data);

  document.querySelector("h1").innerText = "Добро пожаловать, " + data.name;
  document.querySelector(".container").style.display = "flex";

  // Скрываем кнопку входа
  document.querySelector("#g_id_onload").style.display = "none";
  document.querySelector(".g_id_signin").style.display = "none";
}

function parseJwt(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
}

function copyCode(button, code) {
  navigator.clipboard.writeText(code).then(() => {
    const originalText = button.innerText;
    button.innerText = "Скопировано!";
    button.disabled = true;
    setTimeout(() => {
      button.innerText = originalText;
      button.disabled = false;
    }, 2000);
  });
}

function goToSite(url) {
  window.open(url, "_blank");
}
