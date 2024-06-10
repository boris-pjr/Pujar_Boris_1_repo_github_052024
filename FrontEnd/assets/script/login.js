const loginAccess = document.getElementById('contact'); 
const messageErreur = document.getElementById('message-d-erreur'); 

loginAccess.addEventListener('submit', (event) => {
  event.preventDefault(); 
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify({ email, password }), 
  })

  .then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      if (response.status === 401) {
        throw new Error('Vos identifiants sont incorrects');
      } else {
        throw new Error('Vos identifiants sont incorrects');
      }
    }
  })

  .then(({ token, userId }) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    window.location.href = './index.html';
  })

  .catch((erreur) => {
    messageErreur.textContent = erreur.message;
    console.error('Erreur authentification:', erreur);
  });
});


