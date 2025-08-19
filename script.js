document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) showApp(user);
  loadActiveStackSelect();

  // Темная тема
  const themeBtn = document.getElementById("themeToggle");
  const html = document.documentElement;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    html.classList.add("dark");
    themeBtn.innerText = "Светлая тема";
  } else {
    html.classList.remove("dark");
    themeBtn.innerText = "Тёмная тема";
  }

  themeBtn.addEventListener("click", () => {
    html.classList.toggle("dark");
    if (html.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      themeBtn.innerText = "Светлая тема";
    } else {
      localStorage.setItem("theme", "light");
      themeBtn.innerText = "Тёмная тема";
    }
  });
});

// Google Sign-In
function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  localStorage.setItem("user", JSON.stringify(data));
  showApp(data);
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
    atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
  );
  return JSON.parse(jsonPayload);
}

// Копирование кодов с анимацией
function copyCode(button, code) {
  navigator.clipboard.writeText(code).then(() => {
    const originalText = button.innerText;
    button.innerText = "Скопировано!";
    button.classList.add("bg-green-500", "animate-pulse");
    button.disabled = true;
    setTimeout(() => {
      button.innerText = originalText;
      button.classList.remove("bg-green-500", "animate-pulse");
      button.disabled = false;
    }, 2000);
  });
}

function goToSite(url) {
  window.open(url, "_blank");
}

// Стек коды
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

function loadStack() {
  const select = document.getElementById('stackSelect');
  const name = select.value;
  if (!name) return;
  const stacks = JSON.parse(localStorage.getItem('stacks')) || {};
  const stack = stacks[name];
  if (!stack) return;
  document.getElementById('stackName').value = name;
  document.getElementById('codeElectricity').value = stack.electricity;
  document.getElementById('codeGas').value = stack.gas;
  document.getElementById('codeLift').value = stack.lift;
}

function saveStack() {
  const nameInput = document.getElementById('stackName').value.trim();
  if (!nameInput) return;
  const stacks = JSON.parse(localStorage.getItem('stacks')) || {};
  stacks[nameInput] = {
    electricity: document.getElementById('codeElectricity').value,
    gas: document.getElementById('codeGas').value,
    lift: document.getElementById('codeLift').value
  };
  localStorage.setItem('stacks', JSON.stringify(stacks));
  loadStacks();
  loadActiveStackSelect();

  const btn = document.querySelector('#editModal button[onclick="saveStack()"]');
  const originalText = btn.innerText;
  btn.innerText = "Сохранено";
  btn.classList.add("bg-green-500", "animate-pulse");
  btn.disabled = true;
  setTimeout(() => {
    btn.innerText = originalText;
    btn.classList.remove("bg-green-500", "animate-pulse");
    btn.disabled = false;
  }, 2000);
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

// Модальное окно с анимацией
function openEditModal() {
  const modal = document.getElementById('editModal');
  const content = modal.firstElementChild;
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.add('opacity-100');
    content.classList.remove('scale-90', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
  }, 10);
  document.body.classList.add('overflow-hidden');
  loadStacks();
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  const content = modal.firstElementChild;
  content.classList.remove('scale-100', 'opacity-100');
  content.classList.add('scale-90', 'opacity-0');
  modal.classList.remove('opacity-100');
  setTimeout(() => modal.classList.add('hidden'), 300);
  document.body.classList.remove('overflow-hidden');
}

window.onclick = function(event) {
  const modal = document.getElementById('editModal');
  if (event.target === modal) closeEditModal();
}

// Главный селект
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
  if (select.options.length > 0) selectActiveStack();
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
