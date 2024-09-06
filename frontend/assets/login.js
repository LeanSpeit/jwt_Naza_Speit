document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validación básica
    if (!username || !password) {
        document.getElementById('message').innerText = 'Por favor, completa todos los campos.';
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            credentials: 'include', // Importante para enviar las cookies de sesión
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        
        if(!response.ok) {
            divError.innerText = 'Credenciales inválidas';
            divError.classList.add('bg-danger', 'text-white', 'text-center', 'rounded', 'p-2', 'mt-3');
            
            setTimeout(() => {
                divError.hidden = true;
            }, 3500);
            
            return;
        }
        
        const data = await response.json();
        console.log(data);
        window.location.href = 'home.html';
        
    } catch (error) {

    }
});