function handleSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  document.getElementById('response').textContent = `Thank you, ${name}! Your message has been received.`;
}

// Example scroll animation
window.addEventListener('scroll', () => {
  document.querySelectorAll('.service-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      card.classList.add('visible');
    }
  });
});// JavaScript Document