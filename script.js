// ----------------- Авторизация -----------------
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) showApp(user);
  animateBlocks();
  loadActiveStackSelect(); // загрузка стека на главный экран
});

function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  localStorage.setItem("user", JSON.stringify(data));
  showApp(data);
  animateBlocks();
  loadActiveStackSelect();
}

function showApp(data) {
  document.getElementById("header").innerText = "Добро пожаловать, " + data.name;
  document.querySelector(".container").style.display = "flex";
  document.querySelector("#g_id_onload").style.display = "none";
  document.querySelector(".g_id_signin").style.display = "none";
}

function logout() {
  localStorage.removeItem("user");
  document.getElementById("header").innerText = "Авторизация";
  document.querySelector(".container").style.display = "none";
  document.querySelector("#g_id_onload").style.display = "block";
  document.querySelector(".g_id_signin").style.display = "block";
}

function parseJwt(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

// ----------------- Копирование кодов -----------------
function copyCode(button, code) {
  navigator.clipboard.writeText(code).then(() => {
    const originalText = button.innerText;
    button.innerText = "Скопировано!";
    button.style.backgroundColor = "#28a745";
    button.disabled = true;
    setTimeout(() => {
      button.innerText = originalText;
      button.style.backgroundColor = "#007bff";
      button.disabled = false;
    }, 2000);
  });
}

function goToSite(url) {
  window.open(url, "_blank");
}

// ----------------- Стек кодов -----------------
function loadStacks() {
  const stacks = JSON.parse(localStorage.getItem('stacks')) || {};
  const select = document.getElementById('stackSelect');
  select.innerHTML = '';
  for (let name in stacks) {
    const option = document.createElement('option');
    option.value = name;
    option.text = name;
    select.appendChild(option);
  }
  if (select.options.length > 0) loadStack();
}

function saveStack() {
  const name = document.getElementById('stackName').value.trim();
  if (!name) return alert('Введите имя стека');

  const stacks = JSON.parse(localStorage.getItem('stacks')) || {};
  stacks[name] = {
    electricity: document.getElementById('codeElectricity').value,
    gas: document.getElementById('codeGas').value,
    lift: document.getElementById('codeLift').value
  };
  localStorage.setItem('stacks', JSON.stringify(stacks));
  loadStacks();
  loadActiveStackSelect();
  document.getElementById('stackName').value = '';

  // Изменяем текст кнопки на "Сохранено" зелёным
  const btn = document.querySelector('#editModal button[onclick="saveStack()"]');
  const originalText = btn.innerText;
  btn.innerText = "Сохранено";
  btn.style.backgroundColor = "#28a745";
  btn.disabled = true;

  setTimeout(() => {
    btn.innerText = originalText;
    btn.style.backgroundColor = "#007bff";
    btn.disabled = false;
  }, 2000);
}

function loadStack() {
  const select = document.getElementById('stackSelect');
  const name = select.value;
  const stackInput = document.getElementById('stackName');

  if (!name) {
    stackInput.placeholder = '';
    return;
  }

  const stacks = JSON.parse(localStorage.getItem('stacks')) || {};
  const stack = stacks[name];
  if (!stack) return;

  stackInput.placeholder = name;

  document.getElementById('btnElectricity').setAttribute('onclick', `copyCode(this, '${stack.electricity}')`);
  document.getElementById('btnGas').setAttribute('onclick', `copyCode(this, '${stack.gas}')`);
  document.getElementById('btnLift').setAttribute('onclick', `copyCode(this, '${stack.lift}')`);

  document.getElementById('codeElectricity').value = stack.electricity;
  document.getElementById('codeGas').value = stack.gas;
  document.getElementById('codeLift').value = stack.lift;
}

function deleteStack() {
  const select = document.getElementById('stackSelect');
  const name = select.value;
  if (!name) return;
  const stacks = JSON.parse(localStorage.getItem('stacks')) || {};
  delete stacks[name];
  localStorage.setItem('stacks', JSON.stringify(stacks));
  loadStacks();
  loadActiveStackSelect();
}

// ----------------- Модальное окно -----------------
function openEditModal() {
  document.getElementById('editModal').style.display = 'block';
  loadStacks();
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('editModal');
  if (event.target === modal) closeEditModal();
}

// ----------------- Выпадающий список на главном экране -----------------
function loadActiveStackSelect() {
  const select = document.getElementById('activeStack');
  select.innerHTML = '';
  const stacks = JSON.parse(localStorage.getItem('stacks')) || {};
  for (let name in stacks) {
    const option = document.createElement('option');
    option.value = name;
    option.text = name;
    select.appendChild(option);
  }
  if (select.options.length > 0) {
    select.value = select.options[0].value;
    selectActiveStack();
  }
}

function selectActiveStack() {
  const select = document.getElementById('activeStack');
  const name = select.value;
  if (!name) return;

  const stacks = JSON.parse(localStorage.getItem('stacks')) || {};
  const stack = stacks[name];
  if (!stack) return;

  document.getElementById('btnElectricity').setAttribute('onclick', `copyCode(this, '${stack.electricity}')`);
  document.getElementById('btnGas').setAttribute('onclick', `copyCode(this, '${stack.gas}')`);
  document.getElementById('btnLift').setAttribute('onclick', `copyCode(this, '${stack.lift}')`);
}

// ----------------- Анимация карточек -----------------
function animateBlocks() {
  const blocks = document.querySelectorAll('.block');
  blocks.forEach((block, index) => {
    setTimeout(() => {
      block.style.opacity = 1;
      block.style.transform = 'translateY(0)';
    }, index * 150);
  });
}
