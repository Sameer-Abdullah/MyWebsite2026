document.querySelectorAll('.glass-card').forEach(card => {
    const glow = document.createElement('div');
    glow.className = 'glass-glow';
    card.appendChild(glow);

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
    });
});