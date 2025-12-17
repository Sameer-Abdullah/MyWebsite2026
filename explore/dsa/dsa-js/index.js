(function placeNodesOnRoad() {
  const road = document.getElementById("road");
  if (!road) return;

  const VIEW_W = 1200;
  const VIEW_H = 900;

  const nodes = Array.from(road.querySelectorAll(".node"));
  nodes.forEach((node) => {
    const x = Number(node.dataset.x);
    const y = Number(node.dataset.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    node.style.left = (x / VIEW_W) * 100 + "%";
    node.style.top = (y / VIEW_H) * 100 + "%";
    node.style.transform = "translate(-50%, -50%)";
  });
})();

const data = {
  arrays: {
    type: "Data Structure",
    title: "Arrays",
    what: "A collection stored in contiguous memory, accessed by index.",
    why: "Fast random access and the base for many optimizations.",
    next: ["Linked List", "Stacks", "Queues"],
    href: "arrays.html",
  },
  linkedList: {
    type: "Data Structure",
    title: "Linked List",
    what: "A chain of nodes where each node points to the next.",
    why: "Teaches pointers and memory-level thinking.",
    next: ["Stacks", "Queues", "Hash Tables"],
    href: "linked-list.html",
  },
  stacks: {
    type: "Data Structure",
    title: "Stacks",
    what: "LIFO: last in, first out.",
    why: "Used in recursion, parsing, undo systems.",
    next: ["Trees", "Sorting"],
    href: "stacks.html",
  },
  queues: {
    type: "Data Structure",
    title: "Queues",
    what: "FIFO: first in, first out.",
    why: "Used in scheduling, buffering, BFS.",
    next: ["Graphs", "Sorting"],
    href: "queues.html",
  },
  trees: {
    type: "Data Structure",
    title: "Trees",
    what: "Hierarchical parent-child structure.",
    why: "Foundation for searching, heaps, recursion.",
    next: ["Graphs", "Sorting"],
    href: "trees.html",
  },
  graphs: {
    type: "Data Structure",
    title: "Graphs",
    what: "Nodes connected by edges.",
    why: "Models networks, paths, relationships.",
    next: ["Hash Tables", "Sorting"],
    href: "graphs.html",
  },
  hashTables: {
    type: "Data Structure",
    title: "Hash Tables",
    what: "Key → value storage using hashing.",
    why: "Fast lookup, interview staple.",
    next: ["Sorting", "More Algorithms"],
    href: "hash-tables.html",
  },
  sorting: {
    type: "Algorithm",
    title: "Sorting",
    what: "Algorithms that arrange data into order.",
    why: "Core algorithmic thinking and complexity tradeoffs.",
    next: ["Bubble", "Selection", "Insertion", "Merge", "Quick"],
  },
};

const panel = document.getElementById("panel");
const panelKicker = document.getElementById("panelKicker");
const panelTitle = document.getElementById("panelTitle");
const panelWhat = document.getElementById("panelWhat");
const panelWhy = document.getElementById("panelWhy");
const panelNext = document.getElementById("panelNext");
const panelGo = document.getElementById("panelGo");
const panelClose = document.getElementById("panelClose");

const roadNodes = Array.from(document.querySelectorAll(".node"));
const steps = Array.from(document.querySelectorAll(".step"));

function clearActive() {
  roadNodes.forEach((n) => n.classList.remove("active"));
  steps.forEach((s) => s.classList.remove("active"));
}

function setPanel(item) {
  panelKicker.textContent = item.type;
  panelTitle.textContent = item.title;
  panelWhat.textContent = item.what;
  panelWhy.textContent = item.why;

  panelNext.innerHTML = "";
  item.next.forEach((t) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = t;
    panelNext.appendChild(chip);
  });

  panelGo.style.pointerEvents = "auto";
  panelGo.style.opacity = "1";
  panelGo.setAttribute("aria-disabled", "false");

  if (item.href) {
    panelGo.href = item.href;
  } else {
    panelGo.removeAttribute("href");
  }
}

function resetPanel() {
  panelKicker.textContent = "Pick a topic";
  panelTitle.textContent = "DSA Roadmap";
  panelWhat.textContent = "Tap a node (or a mobile step) to see details.";
  panelWhy.textContent = "";
  panelNext.innerHTML = "";

  panelGo.removeAttribute("href");
  panelGo.setAttribute("aria-disabled", "true");
  panelGo.style.pointerEvents = "none";
  panelGo.style.opacity = "0.5";
}

function onPick(id, el) {
  const item = data[id];
  if (!item) return;

  clearActive();
  if (el) el.classList.add("active");
  setPanel(item);

  if (id === "sorting") {
    panelGo.removeAttribute("href");
    panelGo.setAttribute("aria-disabled", "true");
    panelGo.style.pointerEvents = "none";
    panelGo.style.opacity = "0.5";
    return;
  }

  if (window.matchMedia("(max-width: 980px)").matches) {
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

roadNodes.forEach((node) => {
  node.addEventListener("click", () => onPick(node.dataset.id, node));
});

steps.forEach((step) => {
  step.addEventListener("click", () => onPick(step.dataset.id, step));
});

panelGo.addEventListener("click", (e) => {
  if (panelGo.getAttribute("aria-disabled") === "true") {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
});

panelClose.addEventListener("click", () => {
  clearActive();
  resetPanel();
});

resetPanel();
