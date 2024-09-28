document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('profile-btn');
  const mainscreenBtn = document.getElementById('mainscreen-btn');

  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.href = '../screen/profile.html';
    });
  }

  if (mainscreenBtn) {
    mainscreenBtn.addEventListener('click', () => {
      window.location.href = '../screen/index.html';
    });
  }
});
