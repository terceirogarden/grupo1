document.addEventListener('DOMContentLoaded', () => {
  // Recupera os dados do estoque do localStorage
  let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

  // Função para atualizar o estoque na tela
  function atualizarEstoque() {
    // Lógica para atualizar a exibição do estoque
    // ...
  }

  // Função para salvar os dados do estoque no localStorage
  function salvarEstoque() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }

  // Evento de submit do formulário
  formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const categoria = document.getElementById('categoria').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const tipo = document.getElementById('tipo').value;

    if (!nome || !marca || !categoria || quantidade <= 0 || isNaN(quantidade)) return;

    const chave = nome.toLowerCase() + '-' + categoria.toLowerCase();
    let existente = produtos.find(p => p.chave === chave);

    if (!existente) {
      existente = {
        chave,
        nome,
        marca,
        categoria,
        quantidade: 0
      };
      produtos.push(existente);
    }

    if (tipo === 'entrada') {
      existente.quantidade += quantidade;
    } else {
      existente.quantidade = Math.max(0, existente.quantidade - quantidade);
    }

    atualizarEstoque();
    salvarEstoque(); // Salva os dados no localStorage
    formulario.reset();
  });

  // Chama a função para atualizar o estoque ao carregar a página
  atualizarEstoque();
});

fetch('/bd.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Aqui você pode manipular os dados conforme necessário
  })
  .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));

  document.getElementById('togglePassword').addEventListener('click', function() {
  const passwordInput = document.getElementById('password');
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');

  if (email === 'sorveteria@gmail.com' && password === '2025') {
    window.location.href = 'index2.html';
  } else {
    errorMessage.textContent = 'E-mail ou senha incorretos. Tente novamente.';
  }
});