// Check authentication status
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('groot_user') || 'null');
  const protectedPages = ['dashboard.html', 'forum.html', 'chatbot.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (!user && protectedPages.includes(currentPage)) {
    window.location.href = 'auth.html';
  }
}

// Run auth check
checkAuth();
