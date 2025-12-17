const queueWrapper = document.getElementById("queue-wrapper");
const valueInput = document.getElementById("value-input");
const searchInput = document.getElementById("search-input");
const feedback = document.getElementById("feedback-msg");

const metaSize = document.getElementById("meta-size");
const metaFront = document.getElementById("meta-front");
const metaRear = document.getElementById("meta-rear");

class Queue {
  constructor() {
    this.items = [];
    this.offset = 0;
  }

  size() {
    return this.items.length - this.offset;
  }

  enqueue(val) {
    this.items.push(val);
  }

  dequeue() {
    if (this.size() === 0) return null;
    const val = this.items[this.offset];
    this.offset++;

    if (this.offset > 50 && this.offset * 2 >= this.items.length) {
      this.items = this.items.slice(this.offset);
      this.offset = 0;
    }
    return val;
  }

  front() {
    if (this.size() === 0) return null;
    return this.items[this.offset];
  }

  rear() {
    if (this.size() === 0) return null;
    return this.items[this.items.length - 1];
  }

  clear() {
    this.items = [];
    this.offset = 0;
  }

  visibleArray() {
    return this.items.slice(this.offset);
  }

  search(val) {
    const arr = this.visibleArray();
    for (let i = 0; i < arr.length; i++) {
      if (String(arr[i]) === String(val)) return i;
    }
    return -1;
  }
}

const queue = new Queue();
queue.enqueue("A");
queue.enqueue("B");
queue.enqueue("C");

function setFeedback(msg) {
  feedback.innerText = msg || "";
}

function updateMeta() {
  metaSize.innerText = `Size: ${queue.size()}`;
  metaFront.innerText = `Front: ${queue.front() === null ? "null" : queue.front()}`;
  metaRear.innerText = `Rear: ${queue.rear() === null ? "null" : queue.rear()}`;
}

function render(highlightIndex = null) {
  queueWrapper.innerHTML = "";
  updateMeta();

  const arr = queue.visibleArray();

  if (arr.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `Empty queue <span class="null-tag">null</span>`;
    queueWrapper.appendChild(empty);
    return;
  }

  arr.forEach((val, i) => {
    const box = document.createElement("div");
    box.className = "queue-item";
    if (i === 0) box.classList.add("is-front");
    if (i === arr.length - 1) box.classList.add("is-rear");
    if (highlightIndex !== null && i === highlightIndex) box.classList.add("is-highlight");

    box.innerHTML = `
      <div class="q-val">${val}</div>
      <div class="q-idx">[${i}]</div>
    `;

    queueWrapper.appendChild(box);
  });
}

document.getElementById("enqueue-btn").addEventListener("click", () => {
  const v = valueInput.value.trim();
  if (!v) return setFeedback("Enter a value first.");
  queue.enqueue(v);
  valueInput.value = "";
  setFeedback(`Enqueued "${v}" at rear. O(1).`);
  render();
});

document.getElementById("dequeue-btn").addEventListener("click", () => {
  const removed = queue.dequeue();
  if (removed === null) {
    setFeedback("Dequeue: queue is empty.");
    return render();
  }
  setFeedback(`Dequeued "${removed}" from front. O(1).`);
  render();
});

document.getElementById("front-btn").addEventListener("click", () => {
  const f = queue.front();
  if (f === null) {
    setFeedback("Front: queue is empty.");
    return render();
  }
  setFeedback(`Front is "${f}". O(1).`);
  render(0);
});

document.getElementById("rear-btn").addEventListener("click", () => {
  const r = queue.rear();
  const arr = queue.visibleArray();
  if (r === null) {
    setFeedback("Rear: queue is empty.");
    return render();
  }
  setFeedback(`Rear is "${r}". O(1).`);
  render(arr.length - 1);
});

document.getElementById("search-btn").addEventListener("click", () => {
  const v = searchInput.value.trim();
  if (!v) return setFeedback("Type a value to search for.");
  const idx = queue.search(v);
  if (idx === -1) {
    setFeedback(`"${v}" not found. Search is O(n).`);
    render(null);
  } else {
    setFeedback(`Found "${v}" at visible index ${idx}. Search is O(n).`);
    render(idx);
  }
});

document.getElementById("clear-btn").addEventListener("click", () => {
  queue.clear();
  setFeedback("Cleared the queue.");
  render();
});

setFeedback('Queue loaded: FRONT "A" → "B" → "C" REAR');
render();
