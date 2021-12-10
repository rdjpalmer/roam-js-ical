const topBar = document.querySelector(".rm-topbar");
const spacer = topBar.children[topBar.children.length - 2].cloneNode(true);
const item = topBar.children[topBar.children.length - 1].cloneNode(true);

function isSvg(node) {
  return node.tagName === "svg";
}

function setIcon(item) {
  while (!isSvg(item.children[0])) {
    item = item.children[0];
  }

  item.innerText = "Sync Cal";
}

export function setupTrigger(onClick) {
  const lastSpacer = topBar.children[topBar.children.length - 2];

  setIcon(item);
  topBar.insertBefore(item, lastSpacer);
  topBar.insertBefore(spacer, item);

  item.addEventListener("click", onClick);
}
