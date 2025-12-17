const stackWrapper = document.getElementById("stack-wrapper");
const valueInput = document.getElementById("value-input");
const searchInput = document.getElementById("search-input");
const feedback = document.getElementById("feedback-msg");

const metaSize = document.getElementById("meta-size");
const metaTop = document.getElementById("meta-top");

class Stack {
  constructor() {
    this.items = [];
  }
  push(val) {
    this.items.push(val);
  }
  pop() {
    return this.items.pop();
  }
  peek() {
    if (this.items.length === 0) return null;
    return this.items[this.items.length - 1];
  }
  size() {
    return this.items.length;
  }
  clear() {
    this.items = [];
  }
  search(val) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (String(this.items[i]) === String(val)) {
        return i; 
      }
    }
    return -1;
  }
}

const stack = new Stack();

stack.push("A");
stack.push("B");
stack.push("C");

function setFeedback(msg) {
  feedback.innerText = msg || "";
}

function updateMeta() {
  metaSize.innerText = `Size: ${stack.size()}`;
  metaTop.innerText = `Top: ${stack.peek() === null ? "null" : stack.peek()}`;
}

function render(highlightIndex = null) {
  stackWrapper.innerHTML = "";
  updateMeta();

  if (stack.size() === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `Empty stack <span class="null-tag">null</span>`;
    stackWrapper.appendChild(empty);
    return;
  }

  for (let i = stack.items.length - 1; i >= 0; i--) {
    const item = stack.items[i];

    const card = document.createElement("div");
    card.className = "stack-item";

    if (i === stack.items.length - 1) card.classList.add("is-top");
    if (highlightIndex !== null && i === highlightIndex) card.classList.add("is-highlight");

    card.innerHTML = `
      <div class="item-left">
        <span class="item-val">${item}</span>
      </div>
      <div class="item-right">
        <span class="item-index">idx ${i}</span>
      </div>
    `;

    stackWrapper.appendChild(card);
  }
}


document.getElementById("push-btn").addEventListener("click", () => {
  const v = valueInput.value.trim();
  if (!v) return setFeedback("Enter a value first.");

  stack.push(v);
  valueInput.value = "";
  setFeedback(`Pushed "${v}" onto the stack. O(1).`);
  render();
});

document.getElementById("pop-btn").addEventListener("click", () => {
  if (stack.size() === 0) return setFeedback("Pop: stack is empty.");

  const removed = stack.pop();
  setFeedback(`Popped "${removed}" from the stack. O(1).`);
  render();
});

document.getElementById("peek-btn").addEventListener("click", () => {
  const top = stack.peek();
  if (top === null) return setFeedback("Peek: stack is empty.");

  setFeedback(`Peek: top is "${top}". O(1).`);
  render(stack.items.length - 1);
});

document.getElementById("search-btn").addEventListener("click", () => {
  const v = searchInput.value.trim();
  if (!v) return setFeedback("Type a value to search for.");

  const idx = stack.search(v);
  if (idx === -1) {
    setFeedback(`"${v}" not found. Search is O(n).`);
    render(null);
  } else {
    setFeedback(`Found "${v}" (stored at idx ${idx}). Search is O(n).`);
    render(idx);
  }
});

document.getElementById("clear-btn").addEventListener("click", () => {
  stack.clear();
  setFeedback("Cleared the stack.");
  render();
});

setFeedback('Stack loaded: "A" (base) → "B" → "C" (top)');
render();
