// Simulação de banco de dados usando localStorage
class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    saveCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    clearCurrentUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    addUser(userData) {
        const user = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        this.users.push(user);
        this.saveUsers();
        return user;
    }

    updateLastLogin(email) {
        const user = this.findUserByEmail(email);
        if (user) {
            user.lastLogin = new Date().toISOString();
            this.saveUsers();
        }
    }
}

// Instância do banco de dados
const db = new Database();

// Elementos do DOM
const loginContainer = document.getElementById('loginContainer');
const registerContainer = document.getElementById('registerContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const notification = document.getElementById('notification');

// Funções de navegação
function showLogin() {
    loginContainer.classList.remove('hidden');
    registerContainer.classList.add('hidden');
}

function showRegister() {
    registerContainer.classList.remove('hidden');
    loginContainer.classList.add('hidden');
}

// Função para mostrar notificações
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Função para alternar visibilidade da senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Validação de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validação de senha
function isValidPassword(password) {
    return password.length >= 6;
}

// Função específica para redirecionar para loja.html
function redirecionarParaLoja() {
    // Adiciona animação de loading no botão
    const submitBtn = document.querySelector('#loginForm .btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span>Entrando na loja...';
    submitBtn.disabled = true;
    
    // Salvar dados do usuário para a sessão da loja
    const userData = db.currentUser;
    sessionStorage.setItem('lojaUserSession', JSON.stringify({
        userId: userData.id,
        userName: userData.name,
        userEmail: userData.email,
        loginTime: new Date().toISOString(),
        isLoggedIn: true
    }));
    
    // Redirecionar para loja.html após 1.5 segundos
    setTimeout(() => {
        window.location.href = 'svt.html';
    }, 1500);
}

// Event Listeners
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validações
    if (!email || !password) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Por favor, insira um email válido.', 'error');
        return;
    }
    
    // Verificar credenciais
    const user = db.findUserByEmail(email);
    
    if (!user) {
        showNotification('Email não encontrado.', 'error');
        return;
    }
    
    if (user.password !== password) {
        showNotification('Senha incorreta.', 'error');
        return;
    }
    
    // Login bem-sucedido
    db.updateLastLogin(email);
    db.saveCurrentUser(user);
    
    // Salvar preferência "Lembrar de mim"
    if (rememberMe) {
        localStorage.setItem('rememberUser', JSON.stringify({
            email: email,
            rememberMe: true
        }));
    }
    
    showNotification('Login realizado com sucesso! Redirecionando para a loja...', 'success');
    
    // Redirecionar para loja.html
    redirecionarParaLoja();
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    // Validações
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Por favor, insira um email válido.', 'error');
        return;
    }
    
    if (!isValidPassword(password)) {
        showNotification('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem.', 'error');
        return;
    }
    
    if (!acceptTerms) {
        showNotification('Você deve aceitar os termos de uso.', 'error');
        return;
    }
    
    // Verificar se email já existe
    if (db.findUserByEmail(email)) {
        showNotification('Este email já está cadastrado.', 'error');
        return;
    }
    
    // Criar usuário
    const newUser = db.addUser({ name, email, password });
    
    showNotification('Cadastro realizado com sucesso!', 'success');
    
    setTimeout(() => {
        showLogin();
        // Preencher email no formulário de login
        document.getElementById('loginEmail').value = email;
    }, 1500);
    
    // Limpar formulário
    registerForm.reset();
});

// Função para carregar dados salvos (lembrar usuário)
function carregarDadosSalvos() {
    const rememberedUser = JSON.parse(localStorage.getItem('rememberUser'));
    if (rememberedUser && rememberedUser.rememberMe) {
        document.getElementById('loginEmail').value = rememberedUser.email;
        document.getElementById('rememberMe').checked = true;
    }
}

// Verificar se usuário já está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    if (db.currentUser) {
        // Se já estiver logado, redirecionar automaticamente para loja.html
        showNotification('Você já está logado. Redirecionando para a loja...', 'success');
        setTimeout(() => {
            window.location.href = 'loja.html';
        }, 1000);
    } else {
        showLogin();
        carregarDadosSalvos();
    }
});

// Adicionar alguns usuários de exemplo (apenas para demonstração)
if (db.users.length === 0) {
    db.addUser({
        name: 'Cliente Exemplo',
        email: 'cliente@loja.com',
        password: '123456'
    });
    
    db.addUser({
        name: 'Admin da Loja',
        email: 'admin@loja.com',
        password: 'admin123'
    });
    
    db.addUser({
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'joao123'
    });
}

// Adicionar evento de tecla Enter nos formulários
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const activeForm = document.querySelector('.form-container:not(.hidden) form');
        if (activeForm) {
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
});

// Adicionar validação em tempo real
document.getElementById('registerEmail').addEventListener('input', function() {
    const email = this.value.trim();
    if (email && !isValidEmail(email)) {
        this.style.borderColor = '#f44336';
    } else {
        this.style.borderColor = '#e1e5e9';
    }
});

document.getElementById('registerPassword').addEventListener('input', function() {
    const password = this.value;
    if (password && !isValidPassword(password)) {
        this.style.borderColor = '#f44336';
    } else {
        this.style.borderColor = '#e1e5e9';
    }
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = this.value;
    
    if (confirmPassword && password !== confirmPassword) {
        this.style.borderColor = '#f44336';
    } else {
        this.style.borderColor = '#e1e5e9';
    }
});
