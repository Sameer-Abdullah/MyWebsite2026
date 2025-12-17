const bucketsEl = document.getElementById("buckets");
const keyInput = document.getElementById("key-input");
const valueInput = document.getElementById("value-input");
const resizeInput = document.getElementById("resize-input");

const feedback = document.getElementById("feedback-msg");
const resultOutput = document.getElementById("result-output");

const metaSize = document.getElementById("meta-size");
const metaCount = document.getElementById("meta-count");
const metaLoad = document.getElementById("meta-load");

function setFeedback(msg) {
  feedback.innerText = msg || "";
}

function setResult(msg) {
  resultOutput.innerText = `Result: ${msg}`;
}

function hashString(str, mod) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h % mod;
}

class HashTable {
  constructor(size = 8) {
    this.size = size;
    this.buckets = Array.from({ length: size }, () => []);
    this.count = 0;
  }

  set(key, value) {
    const idx = hashString(key, this.size);
    const bucket = this.buckets[idx];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].k === key) {
        bucket[i].v = value;
        return { idx, action: "updated" };
      }
    }

    bucket.push({ k: key, v: value });
    this.count++;
    return { idx, action: "inserted" };
  }

  get(key) {
    const idx = hashString(key, this.size);
    const bucket = this.buckets[idx];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].k === key) return { found: true, idx, value: bucket[i].v };
    }
    return { found: false, idx, value: null };
  }

  delete(key) {
    const idx = hashString(key, this.size);
    const bucket = this.buckets[idx];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].k === key) {
        bucket.splice(i, 1);
        this.count--;
        return { deleted: true, idx };
      }
    }
    return { deleted: false, idx };
  }

  clear() {
    this.buckets = Array.from({ length: this.size }, () => []);
    this.count = 0;
  }

  resize(newSize) {
    const old = this.buckets;
    this.size = newSize;
    this.buckets = Array.from({ length: newSize }, () => []);
    this.count = 0;

    for (const bucket of old) {
      for (const pair of bucket) {
        this.set(pair.k, pair.v);
      }
    }
  }

  loadFactor() {
    if (this.size === 0) return 0;
    return this.count / this.size;
  }
}

const table = new HashTable(8);

function updateMeta() {
  metaSize.innerText = `Buckets: ${table.size}`;
  metaCount.innerText = `Pairs: ${table.count}`;
  metaLoad.innerText = `Load: ${table.loadFactor().toFixed(2)}`;
}

function renderBuckets(highlightBucket = null, highlightKey = null) {
  bucketsEl.innerHTML = "";
  updateMeta();

  for (let i = 0; i < table.size; i++) {
    const bucket = table.buckets[i];

    const col = document.createElement("div");
    col.className = "bucket-col";
    if (highlightBucket === i) col.classList.add("is-highlight");

    const head = document.createElement("div");
    head.className = "bucket-head";
    head.innerHTML = `
      <span class="bucket-index">[${i}]</span>
      <span class="bucket-count">${bucket.length} item(s)</span>
    `;

    const list = document.createElement("div");
    list.className = "bucket-list";

    if (bucket.length === 0) {
      const empty = document.createElement("div");
      empty.className = "bucket-empty";
      empty.innerText = "empty";
      list.appendChild(empty);
    } else {
      bucket.forEach((pair) => {
        const pill = document.createElement("div");
        pill.className = "pair-pill";
        if (highlightKey && pair.k === highlightKey) pill.classList.add("is-key");
        pill.innerHTML = `
          <span class="pair-k">${pair.k}</span>
          <span class="pair-arrow">→</span>
          <span class="pair-v">${pair.v}</span>
        `;
        list.appendChild(pill);
      });
    }

    col.appendChild(head);
    col.appendChild(list);
    bucketsEl.appendChild(col);
  }
}

document.getElementById("set-btn").addEventListener("click", () => {
  const k = keyInput.value.trim();
  const v = valueInput.value.trim();
  if (!k) return setFeedback("Key is required.");
  if (!v) return setFeedback("Value is required.");

  const res = table.set(k, v);
  setResult(`${k} → ${v}`);
  setFeedback(
    res.action === "inserted"
      ? `Inserted "${k}" into bucket [${res.idx}]. Avg O(1).`
      : `Updated "${k}" in bucket [${res.idx}]. Avg O(1).`
  );

  keyInput.value = "";
  valueInput.value = "";
  renderBuckets(res.idx, k);
});

document.getElementById("get-btn").addEventListener("click", () => {
  const k = keyInput.value.trim();
  if (!k) return setFeedback("Enter a key to search.");

  const res = table.get(k);
  if (res.found) {
    setResult(`${k} → ${res.value}`);
    setFeedback(`Found "${k}" in bucket [${res.idx}]. Avg O(1).`);
    renderBuckets(res.idx, k);
  } else {
    setResult("not found");
    setFeedback(`"${k}" not found. Checked bucket [${res.idx}].`);
    renderBuckets(res.idx, null);
  }
});

document.getElementById("delete-btn").addEventListener("click", () => {
  const k = keyInput.value.trim();
  if (!k) return setFeedback("Enter a key to delete.");

  const res = table.delete(k);
  if (res.deleted) {
    setResult("deleted");
    setFeedback(`Deleted "${k}" from bucket [${res.idx}]. Avg O(1).`);
    renderBuckets(res.idx, null);
  } else {
    setResult("not found");
    setFeedback(`Can't delete "${k}" — not found (bucket [${res.idx}]).`);
    renderBuckets(res.idx, null);
  }
});

document.getElementById("resize-btn").addEventListener("click", () => {
  const n = Number(resizeInput.value);
  if (!Number.isFinite(n) || n < 4 || n > 32) {
    return setFeedback("Resize: enter a bucket size between 4 and 32.");
  }
  table.resize(Math.trunc(n));
  setResult(`resized to ${table.size}`);
  setFeedback(`Resized table to ${table.size} buckets. Rehashed all keys.`);
  renderBuckets(null, null);
});

document.getElementById("clear-btn").addEventListener("click", () => {
  table.clear();
  setResult("-");
  setFeedback("Cleared the hash table.");
  renderBuckets(null, null);
});

table.set("name", "Sameer");
table.set("city", "Waterloo");
table.set("school", "Laurier");
table.set("github", "Sameer-Abdullah");
renderBuckets(null, null);
setResult("-");
setFeedback("Hash table loaded. Try searching keys like 'name' or 'github'.");
