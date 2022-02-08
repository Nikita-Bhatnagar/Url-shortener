const inputBox = document.querySelector(".url-input");
const shortenUrlBtn = document.querySelector(".shorten-url-btn");
const results = document.querySelector(".results");
const input = document.querySelector(".input div");
shortenUrlBtn.addEventListener("click", shortenLink);

if (document.querySelector(".toggle-btn")) {
  const toggleBtn = document.querySelector(".toggle-btn");
  toggleBtn.addEventListener("click", openNav);

  function openNav(e) {
    const verticalNav = document.querySelector(".vertical-nav");
    verticalNav.classList.toggle("hide-display");
  }
}

let urls;
if (!localStorage.getItem("urls")) {
  urls = [];
} else {
  urls = JSON.parse(localStorage.getItem("urls"));
}
document.addEventListener("click", removeErrorMsg);
function removeErrorMsg(e) {
  if (e.target !== shortenUrlBtn) {
    if (document.querySelector(".err")) {
      inputBox.classList.remove("error");
      input.classList.remove("err");
      inputBox.style.marginBottom = "15px";
    }
  }
}

function shortenLink(e) {
  if (inputBox.value.trim() === "") {
    inputBox.classList.add("error");
    input.classList.add("err");
    inputBox.style.marginBottom = "0";
    return;
  }
  const origUrl = inputBox.value;
  fetch(`https://api.shrtco.de/v2/shorten?url=${origUrl}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      renderShortenedUrl(data);
    });
  inputBox.value = "";
}

function renderShortenedUrl(data) {
  const markup = ` <div class="url-result">
    <div class="url-row">
      <div class="orig-url">${data.result.original_link}</div>
      <div class="hidden"></div>
    <div class="shortened-url">${data.result.full_short_link}</div>
    </div>
    <button class="copy-btn" type="button">Copy</button>
   </div>`;
  results.insertAdjacentHTML("beforeend", markup);
  updateLocalStorage(data);
  let resultRows = document.querySelectorAll(".url-result");
  resultRows.forEach((resultRow) =>
    resultRow
      .querySelector(".copy-btn")
      .addEventListener("click", copyToClipboard)
  );
}
function updateLocalStorage(data) {
  const urlObj = {
    orig_url: data.result.original_link,
    shortened_url: data.result.full_short_link,
  };
  urls.push(urlObj);
  if (urls.length > 10) urls.shift();
  localStorage.setItem("urls", JSON.stringify(urls));
}

function copyToClipboard(e) {
  const result = e.target.closest(".url-result");
  const url = result.querySelector(".shortened-url").textContent;
  const copyBtn = result.querySelector(".copy-btn");
  navigator.clipboard.writeText(url);
  copyBtn.style.backgroundColor = "hsl(257, 27%, 26%)";
  copyBtn.textContent = "Copied!";

  //localStorage.setItem("urls", JSON.stringify(urls));
  const timeOut = setTimeout(removeStyles, 2000);
  function removeStyles() {
    copyBtn.style.backgroundColor = "hsl(180, 66%, 49%)";
    copyBtn.textContent = "Copy";
  }
}

function renderUrlsFromLocalStorage() {
  if (!localStorage.getItem("urls")) return;
  const urls = JSON.parse(localStorage.getItem("urls"));

  urls.forEach((url) => {
    const markup = ` <div class="url-result">
        <div class="url-row">
          <div class="orig-url">${url.orig_url}</div>
          <div class="hidden"></div>
        <div class="shortened-url">${url.shortened_url}</div>
        </div>
        <button class="copy-btn type="button">Copy</button>
       </div>`;
    results.insertAdjacentHTML("beforeend", markup);
  });
  let resultRows = document.querySelectorAll(".url-result");
  resultRows.forEach((resultRow) =>
    resultRow.addEventListener("click", copyToClipboard)
  );
}

window.addEventListener("load", renderUrlsFromLocalStorage);
//localStorage.clear();
