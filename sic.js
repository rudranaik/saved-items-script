(function () {
  if (!window.location.pathname.includes("/cart")) return;

  const msg = document.createElement("div");
  msg.style.padding = "20px";
  msg.style.backgroundColor = "#f5f5f5";
  msg.innerHTML = `
    <h2>Saved for Later</h2>
    <p>This is where saved items will be shown.</p>
  `;
  document.body.appendChild(msg);
})();
