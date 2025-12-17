const treeEl = document.getElementById("tree");
const valueInput = document.getElementById("value-input");
const searchInput = document.getElementById("search-input");
const feedback = document.getElementById("feedback-msg");
const traversalOutput = document.getElementById("traversal-output");

const metaCount = document.getElementById("meta-count");
const metaHeight = document.getElementById("meta-height");
const metaRoot = document.getElementById("meta-root");

class Node {
  constructor(v) {
    this.v = v;
    this.left = null;
    this.right = null;
  }
}

const values = [];

function setFeedback(msg) {
  feedback.innerText = msg || "";
}

function uniqSorted(arr) {
  const s = Array.from(new Set(arr));
  s.sort((a, b) => a - b);
  return s;
}

function buildBalanced(sorted, l = 0, r = sorted.length - 1) {
  if (l > r) return null;
  const m = Math.floor((l + r) / 2);
  const root = new Node(sorted[m]);
  root.left = buildBalanced(sorted, l, m - 1);
  root.right = buildBalanced(sorted, m + 1, r);
  return root;
}

function height(root) {
  if (!root) return 0;
  return 1 + Math.max(height(root.left), height(root.right));
}

function countNodes(root) {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}

function inorder(root, out = []) {
  if (!root) return out;
  inorder(root.left, out);
  out.push(root.v);
  inorder(root.right, out);
  return out;
}

function preorder(root, out = []) {
  if (!root) return out;
  out.push(root.v);
  preorder(root.left, out);
  preorder(root.right, out);
  return out;
}

function postorder(root, out = []) {
  if (!root) return out;
  postorder(root.left, out);
  postorder(root.right, out);
  out.push(root.v);
  return out;
}

function findPath(root, target) {
  const path = [];
  let cur = root;
  while (cur) {
    path.push(cur.v);
    if (target === cur.v) return { found: true, path };
    cur = target < cur.v ? cur.left : cur.right;
  }
  return { found: false, path };
}

function renderTree(root, highlightSet = new Set()) {
  treeEl.innerHTML = "";

  if (!root) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `Empty tree <span class="null-tag">null</span>`;
    treeEl.appendChild(empty);
    return;
  }

  const makeNode = (node) => {
    if (!node) {
      const nullBox = document.createElement("div");
      nullBox.className = "null-box";
      nullBox.innerText = "null";
      return nullBox;
    }

    const wrap = document.createElement("div");
    wrap.className = "t-node";

    const bubble = document.createElement("div");
    bubble.className = "t-bubble";
    bubble.innerText = node.v;

    if (highlightSet.has(node.v)) bubble.classList.add("is-highlight");

    wrap.appendChild(bubble);

    const children = document.createElement("div");
    children.className = "t-children";

    if (node.left || node.right) {
      const leftWrap = document.createElement("div");
      leftWrap.className = "t-child";
      leftWrap.appendChild(makeNode(node.left));

      const rightWrap = document.createElement("div");
      rightWrap.className = "t-child";
      rightWrap.appendChild(makeNode(node.right));

      children.appendChild(leftWrap);
      children.appendChild(rightWrap);
      wrap.appendChild(children);
    }

    return wrap;
  };

  treeEl.appendChild(makeNode(root));
}

function updateMeta(root) {
  const c = countNodes(root);
  const h = height(root);
  metaCount.innerText = `Nodes: ${c}`;
  metaHeight.innerText = `Height: ${h}`;
  metaRoot.innerText = `Root: ${root ? root.v : "null"}`;
}

function rebuildAndRender(msg = "", highlightPath = []) {
  const sorted = uniqSorted(values);
  const root = buildBalanced(sorted);
  updateMeta(root);

  const highlightSet = new Set(highlightPath);
  renderTree(root, highlightSet);

  if (msg) setFeedback(msg);
  return root;
}

function parseNum(val) {
  if (val === "" || val === null || val === undefined) return null;
  const n = Number(val);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

document.getElementById("insert-btn").addEventListener("click", () => {
  const n = parseNum(valueInput.value);
  if (n === null) return setFeedback("Enter a valid number.");

  if (values.includes(n)) {
    return setFeedback(`"${n}" already exists (BST has no duplicates here).`);
  }

  values.push(n);
  valueInput.value = "";
  rebuildAndRender(`Inserted ${n}. Rebalanced tree.`, []);
});

document.getElementById("remove-btn").addEventListener("click", () => {
  const n = parseNum(valueInput.value);
  if (n === null) return setFeedback("Type the number you want to remove in the first box.");

  const idx = values.indexOf(n);
  if (idx === -1) return setFeedback(`"${n}" is not in the tree.`);

  values.splice(idx, 1);
  valueInput.value = "";
  rebuildAndRender(`Removed ${n}. Rebalanced tree.`, []);
});

document.getElementById("search-btn").addEventListener("click", () => {
  const n = parseNum(searchInput.value);
  if (n === null) return setFeedback("Enter a valid number to search.");

  const root = rebuildAndRender("", []);
  const res = findPath(root, n);

  if (!root) return setFeedback("Tree is empty.");

  if (res.found) {
    rebuildAndRender(`Found ${n}. Search path highlighted (O(log n) when balanced).`, res.path);
  } else {
    rebuildAndRender(`"${n}" not found. Search path highlighted (O(log n) when balanced).`, res.path);
  }
});

document.getElementById("inorder-btn").addEventListener("click", () => {
  const root = rebuildAndRender("", []);
  const out = inorder(root, []);
  traversalOutput.innerText = `Traversal: [${out.join(", ")}]`;
  setFeedback("Inorder = Left, Root, Right (sorted output for BST).");
});

document.getElementById("preorder-btn").addEventListener("click", () => {
  const root = rebuildAndRender("", []);
  const out = preorder(root, []);
  traversalOutput.innerText = `Traversal: [${out.join(", ")}]`;
  setFeedback("Preorder = Root, Left, Right.");
});

document.getElementById("postorder-btn").addEventListener("click", () => {
  const root = rebuildAndRender("", []);
  const out = postorder(root, []);
  traversalOutput.innerText = `Traversal: [${out.join(", ")}]`;
  setFeedback("Postorder = Left, Right, Root.");
});

document.getElementById("clear-btn").addEventListener("click", () => {
  values.length = 0;
  traversalOutput.innerText = "Traversal: []";
  rebuildAndRender("Cleared the tree.", []);
});

values.push(10, 5, 15, 3, 7, 12, 18);
traversalOutput.innerText = "Traversal: []";
rebuildAndRender("Balanced BST loaded. Try searching 7 or inserting 6.", []);
