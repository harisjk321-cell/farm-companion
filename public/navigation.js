// Navigation component
function initNavigation() {
  const nav = document.getElementById('navigation');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  const user = JSON.parse(localStorage.getItem('groot_user') || 'null');
  
  nav.innerHTML = `
    <div class="nav-container">
      <a href="index.html" class="nav-brand">
        🌱 GROOT
      </a>
      <ul class="nav-links">
        <li><a href="dashboard.html" class="${currentPath === 'dashboard.html' ? 'active' : ''}">Dashboard</a></li>
        <li><a href="bot-health.html" class="${currentPath === 'bot-health.html' ? 'active' : ''}">Robots</a></li>
        <li><a href="plant-health.html" class="${currentPath === 'plant-health.html' ? 'active' : ''}">Plants</a></li>
        <li><a href="sensor-data.html" class="${currentPath === 'sensor-data.html' ? 'active' : ''}">Sensors</a></li>
        <li><a href="learn.html" class="${currentPath === 'learn.html' ? 'active' : ''}">Learn</a></li>
        <li><a href="forum.html" class="${currentPath === 'forum.html' ? 'active' : ''}">Forum</a></li>
        <li><a href="chatbot.html" class="${currentPath === 'chatbot.html' ? 'active' : ''}">AI Chat</a></li>
      </ul>
      <div class="nav-auth">
        ${user ? `
          <span style="color: hsl(var(--muted-foreground));">${user.email}</span>
          <button class="btn btn-secondary" onclick="handleLogout()">Logout</button>
        ` : `
          <a href="auth.html" class="btn btn-primary">Sign In</a>
        `}
      </div>
    </div>
  `;
}

function handleLogout() {
  localStorage.removeItem('groot_user');
  localStorage.removeItem('groot_session');
  window.location.href = 'auth.html';
}

// Initialize navigation when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}
