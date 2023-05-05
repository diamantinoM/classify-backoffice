async function signIn(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    try {
        const response = await fetch('http://localhost:3000/token',{
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body:  JSON.stringify({
                email,
                password
            })
        });
        if (!response.ok) {
            const errorBox = await window.versions.dialog(
                {type: 'error',
                message: 'As suas credenciais estão incorretas. Tente novamente!',
                buttons: ['Continuar'],
                title: 'Classify',
                icon: './renderer/images/classify-logo.png',
                detail: 'Em caso de perda das suas credenciais, entre em contato com o administrador.'
            });
            return errorBox;
        }
        const { token } = await response.json();
        const tokenInfo = window.sessionStorage.setItem('token', token); // using sessionStorage to store the token
        window.location.href = 'dashboard.html';
    }catch (err) {
        console.error(err);
    }
}
function main() {
    const form = document.getElementById('sign_in');
    form.addEventListener('submit', signIn);
}

window.addEventListener('load', main);