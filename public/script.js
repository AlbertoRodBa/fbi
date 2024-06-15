// Manejar evento de envío en Formulario
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Email:', email);
    console.log('Password:', password);

    try {
        const response = await fetch('/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Response not OK');
        }

        const html = await response.text()
        console.log('Response HTML:', html)

        document.open()
        document.write(html)
        document.close()

    } catch (error) {
        console.error('Error:', error)
        alert('Acceso inválido')
    }
});
