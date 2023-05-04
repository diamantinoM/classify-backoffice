function getToken() {
    const token = window.sessionStorage.getItem('token');
    console.log(token);
}


function main() {
    getToken();
}

window.addEventListener('load', main);