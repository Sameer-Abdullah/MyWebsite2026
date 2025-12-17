const arrayWrapper = document.getElementById('array-wrapper');
const inputField = document.getElementById('value-input');
const feedback = document.getElementById('feedback-msg');

let data = ['A', 'B', 'C'];

function updateUI(message) {
    // Clear and Redraw
    arrayWrapper.innerHTML = '';
    
    data.forEach((item, index) => {
        const node = document.createElement('div');
        node.className = 'array-node';
        node.innerText = item;
        node.setAttribute('data-index', index);
        arrayWrapper.appendChild(node);
    });

    if (message) {
        feedback.innerText = message;
    }
}

// Event Listeners
document.getElementById('push-btn').addEventListener('click', () => {
    const val = inputField.value;
    if (!val) return;
    data.push(val);
    inputField.value = '';
    updateUI(`Pushing "${val}" to the end is O(1).`);
});

document.getElementById('pop-btn').addEventListener('click', () => {
    if (data.length === 0) return;
    const removed = data.pop();
    updateUI(`Popped "${removed}" from the end. This is O(1).`);
});

document.getElementById('unshift-btn').addEventListener('click', () => {
    const val = inputField.value;
    if (!val) return;
    data.unshift(val);
    inputField.value = '';
    updateUI(`Unshift: O(n). Every existing element had to move one spot to the right!`);
});

document.getElementById('shift-btn').addEventListener('click', () => {
    if (data.length === 0) return;
    const removed = data.shift();
    updateUI(`Shift: O(n). Element index 0 was removed, and everyone else moved left.`);
});

// Initial Render
updateUI();