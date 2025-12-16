const splash = document.getElementById("splash");

splash.addEventListener("click", () => {
  splash.classList.add("splash-pop");

  setTimeout(() => {
    window.location.href = "select.html";
  }, 600);
});


