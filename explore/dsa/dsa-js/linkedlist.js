const listWrapper = document.getElementById("list-wrapper");
const valueInput = document.getElementById("value-input");
const indexInput = document.getElementById("index-input");
const feedback = document.getElementById("feedback-msg");

const metaLength = document.getElementById("meta-length");
const metaHead = document.getElementById("meta-head");
const metaTail = document.getElementById("meta-tail");

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.id = Math.random().toString(16).slice(2, 8); 
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const n = new Node(value);
    if (!this.head) {
      this.head = n;
      this.tail = n;
      this.length = 1;
      return { ok: true, msg: `Append: list was empty → head & tail now "${value}". O(1).` };
    }
    this.tail.next = n;
    this.tail = n;
    this.length++;
    return { ok: true, msg: `Append "${value}" at tail. O(1) (with tail).` };
  }

  prepend(value) {
    const n = new Node(value);
    if (!this.head) {
      this.head = n;
      this.tail = n;
      this.length = 1;
      return { ok: true, msg: `Prepend: list was empty → head & tail now "${value}". O(1).` };
    }
    n.next = this.head;
    this.head = n;
    this.length++;
    return { ok: true, msg: `Prepend "${value}" at head. O(1).` };
  }

  getNodeAt(index) {
    if (index < 0 || index >= this.length) return null;
    let cur = this.head;
    let i = 0;
    while (cur && i < index) {
      cur = cur.next;
      i++;
    }
    return cur;
  }

  insertAt(index, value) {
    if (index < 0 || index > this.length) {
      return { ok: false, msg: `Invalid index. Must be 0..${this.length}.` };
    }
    if (index === 0) return this.prepend(value);
    if (index === this.length) return this.append(value);

    const prev = this.getNodeAt(index - 1);
    const n = new Node(value);
    n.next = prev.next;
    prev.next = n;
    this.length++;
    return { ok: true, msg: `Insert "${value}" at index ${index}. O(n) (must traverse).` };
  }

  removeHead() {
    if (!this.head) return { ok: false, msg: "Remove head: list is empty." };
    const removed = this.head;
    this.head = this.head.next;
    this.length--;
    if (this.length === 0) this.tail = null;
    return { ok: true, msg: `Removed head "${removed.value}". O(1).`, removed };
  }

  removeTail() {
    if (!this.head) return { ok: false, msg: "Remove tail: list is empty." };
    if (this.length === 1) {
      const only = this.head;
      this.head = null;
      this.tail = null;
      this.length = 0;
      return { ok: true, msg: `Removed only node "${only.value}". O(1).`, removed: only };
    }

    let prev = this.head;
    while (prev.next !== this.tail) prev = prev.next; 
    const removed = this.tail;
    prev.next = null;
    this.tail = prev;
    this.length--;
    return { ok: true, msg: `Removed tail "${removed.value}". O(n) (need prev).`, removed };
  }

  removeAt(index) {
    if (index < 0 || index >= this.length) {
      return { ok: false, msg: `Invalid index. Must be 0..${this.length - 1}.` };
    }
    if (index === 0) return this.removeHead();
    if (index === this.length - 1) return this.removeTail();

    const prev = this.getNodeAt(index - 1);
    const removed = prev.next;
    prev.next = removed.next;
    this.length--;
    return { ok: true, msg: `Removed index ${index} ("${removed.value}"). O(n).`, removed };
  }

  search(value) {
    let cur = this.head;
    let idx = 0;
    while (cur) {
      if (String(cur.value) === String(value)) return { found: true, index: idx, node: cur };
      cur = cur.next;
      idx++;
    }
    return { found: false };
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  toArray() {
    const out = [];
    let cur = this.head;
    while (cur) {
      out.push(cur);
      cur = cur.next;
    }
    return out;
  }
}

const list = new SinglyLinkedList();

function setFeedback(msg) {
  feedback.innerText = msg || "";
}

function updateMeta() {
  metaLength.innerText = `Length: ${list.length}`;
  metaHead.innerText = `Head: ${list.head ? list.head.value : "null"}`;
  metaTail.innerText = `Tail: ${list.tail ? list.tail.value : "null"}`;
}

function render(highlightIndex = null) {
  listWrapper.innerHTML = "";
  updateMeta();

  const nodes = list.toArray();

  if (nodes.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `Empty list <span class="null-tag">null</span>`;
    listWrapper.appendChild(empty);
    return;
  }

  nodes.forEach((node, index) => {
    const block = document.createElement("div");
    block.className = "ll-block";

    const nodeEl = document.createElement("div");
    nodeEl.className = "ll-node";
    if (index === 0) nodeEl.classList.add("is-head");
    if (index === nodes.length - 1) nodeEl.classList.add("is-tail");
    if (highlightIndex === index) nodeEl.classList.add("is-highlight");

    nodeEl.innerHTML = `
      <div class="node-top">
        <span class="node-val">${node.value}</span>
        <span class="node-id">0x${node.id}</span>
      </div>
      <div class="node-bottom">
        <span class="node-label">next</span>
        <span class="node-next">${node.next ? "→" : "null"}</span>
      </div>
      <div class="node-index">[${index}]</div>
    `;

    block.appendChild(nodeEl);

    if (index !== nodes.length - 1) {
      const arrow = document.createElement("div");
      arrow.className = "ll-arrow";
      arrow.innerHTML = `<span class="arrow-line"></span><span class="arrow-head">▶</span>`;
      block.appendChild(arrow);
    } else {
      const end = document.createElement("div");
      end.className = "ll-end";
      end.innerHTML = `<span class="null-tag">null</span>`;
      block.appendChild(end);
    }

    listWrapper.appendChild(block);
  });
}

document.getElementById("append-btn").addEventListener("click", () => {
  const v = valueInput.value.trim();
  if (!v) return setFeedback("Enter a value first.");
  const res = list.append(v);
  valueInput.value = "";
  setFeedback(res.msg);
  render();
});

document.getElementById("prepend-btn").addEventListener("click", () => {
  const v = valueInput.value.trim();
  if (!v) return setFeedback("Enter a value first.");
  const res = list.prepend(v);
  valueInput.value = "";
  setFeedback(res.msg);
  render();
});

document.getElementById("insert-btn").addEventListener("click", () => {
  const v = valueInput.value.trim();
  const idx = parseInt(indexInput.value, 10);
  if (!v) return setFeedback("Enter a value first.");
  if (Number.isNaN(idx)) return setFeedback("Enter an index (0, 1, 2...).");

  const res = list.insertAt(idx, v);
  if (res.ok) {
    valueInput.value = "";
    setFeedback(res.msg);
    render();
  } else {
    setFeedback(res.msg);
  }
});

document.getElementById("remove-btn").addEventListener("click", () => {
  const idx = parseInt(indexInput.value, 10);
  if (Number.isNaN(idx)) return setFeedback("Enter an index to remove.");
  const res = list.removeAt(idx);
  setFeedback(res.msg);
  render();
});

document.getElementById("pop-btn").addEventListener("click", () => {
  const res = list.removeTail();
  setFeedback(res.msg);
  render();
});

document.getElementById("shift-btn").addEventListener("click", () => {
  const res = list.removeHead();
  setFeedback(res.msg);
  render();
});

document.getElementById("search-btn").addEventListener("click", () => {
  const v = valueInput.value.trim();
  if (!v) return setFeedback("Type a value to search for.");
  const res = list.search(v);
  if (!res.found) {
    setFeedback(`"${v}" not found. Search is O(n).`);
    render(null);
  } else {
    setFeedback(`Found "${v}" at index ${res.index}. Search is O(n).`);
    render(res.index);
  }
});

document.getElementById("clear-btn").addEventListener("click", () => {
  list.clear();
  setFeedback("Cleared the list.");
  render();
});

list.append("A");
list.append("B");
list.append("C");
setFeedback('Linked list loaded. "A" → "B" → "C" → null');
render();
