(function () {
  // Wait until the drawer is present in the DOM
  function waitForDrawerAndInject() {
    const drawer = document.querySelector("#CartDrawer .drawer__footer");
    if (!drawer) {
      return setTimeout(waitForDrawerAndInject, 200); // keep checking
    }

    // Avoid duplicate injection
    if (document.querySelector("#swym-sic-container")) return;

    const container = document.createElement("div");
    container.id = "swym-sic-container";
    container.style.padding = "16px";
    container.style.borderTop = "1px solid #ccc";
    container.innerHTML = `
      <h4 style="margin: 0 0 8px 0;">Saved for Later</h4>
      <p>This is where saved items will be shown.</p>
    `;

    drawer.parentNode.insertBefore(container, drawer);
  }

  waitForDrawerAndInject();
})();
