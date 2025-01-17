// animação de fundo
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.01;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        if (particles[i].size <= 0.2) {
            particles.splice(i, 1);
            i--;
            particles.push(new Particle());
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();

async function hendleSetSolicitacao (body){
    try {
        const responseJson = await fetch('http://172.23.42.17:3333/solicitacaoUsuario/addSolicitacao',{
            method:'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(body)
        })

        let response = await responseJson.json()

        if(responseJson.status === 201){
            alert(response.message)
            return true
        }
        
        alert(response.message)

        return false
    } catch (error) {
        console.log(error)
        return false
    }
}

// Form handling
const form = document.getElementById('cadastroForm');
const nomeInput = document.querySelector('#nomeCompleto')
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const confirmarSenhaInput = document.getElementById('confirmarSenha');

// Email domain validation
emailInput.addEventListener('blur', function () {
    let regEx = new RegExp('@.*', 'i')
    if (this.value && !this.value.endsWith('@fsph.se.gov.br')) {
        this.value = this.value.replace(regEx,'@fsph.se.gov.br')
    }
})

// Form submission
form.addEventListener('submit',async function (e) {
    e.preventDefault();
    
    // Password validation
    if (senhaInput.value !== confirmarSenhaInput.value) {
        alert('As senhas não coincidem!');
        return;
    }

    let avatar = nomeInput.value.substring(0,2).toUpperCase()

    let body = {
        nome:nomeInput.value,
        email:emailInput.value,
        senha:senhaInput.value,
        confirmeSenha:confirmarSenhaInput.value,
        avatar
    }

    let verificacao = await hendleSetSolicitacao(body)

    const button = form.querySelector('button');
    button.textContent = 'Registrando...';
    button.disabled = true;
    
    
    if(verificacao){
        button.textContent = 'Registrar';
        button.disabled = false;
        form.reset();
    }else{
        button.textContent = 'Registrar';
        button.disabled = false;
    }
});


const voltarLogin = document.querySelector('.divisaoElementos h5 span')
voltarLogin.addEventListener('click', () => {
    window.location.href = 'index.html'
})
