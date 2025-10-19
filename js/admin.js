
let usuarioAtual = null;

auth.onAuthStateChanged(user => {
  if (!user) return window.location.href = "index.html";
  usuarioAtual = user;
  db.collection("usuarios").doc(user.uid).get().then(doc => {
    if (!doc.exists || doc.data().perfil !== "admin") {
      alert("Acesso negado.");
      window.location.href = "index.html";
    } else {
      carregarProdutos();
    }
  });
});

function carregarProdutos() {
  db.collection("produtos").get().then(snapshot => {
    let html = "";
    snapshot.forEach(doc => {
      const p = doc.data();
      html += `
        <div class="col-md-4 mb-3">
          <div class="card">
            <img src="${p.imagem}" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">${p.nome}</h5>
              <p class="card-text">Preço: R$ ${p.preco.toFixed(2)}</p>
              <p class="card-text">Estoque: ${p.estoque}</p>
              <button class="btn btn-sm btn-warning me-2" onclick="editarProduto('${doc.id}', '${p.nome}', ${p.preco}, ${p.estoque}, '${p.imagem}')">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="excluirProduto('${doc.id}')">Excluir</button>
            </div>
          </div>
        </div>
      `;
    });
    document.getElementById("lista-produtos").innerHTML = html;
    if (!snapshot.empty) {
      mostrarMensagem("Produtos carregados com sucesso.", "info");
    }
  });
}

function mostrarFormulario() {
  document.getElementById("form-produto").classList.remove("d-none");
  document.getElementById("id-produto").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("estoque").value = "";
  document.getElementById("imagem").value = "";
}

function cancelarFormulario() {
  document.getElementById("form-produto").classList.add("d-none");
}

function salvarProduto() {
  const id = document.getElementById("id-produto").value;
  const nome = document.getElementById("nome").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const estoque = parseInt(document.getElementById("estoque").value);
  const imagem = document.getElementById("imagem").value;

  const dados = { nome, preco, estoque, imagem };

  if (id) {
    db.collection("produtos").doc(id).update(dados).then(() => {
      mostrarMensagem("Produto atualizado com sucesso!", "success");
      cancelarFormulario();
      carregarProdutos();
    });
  } else {
    db.collection("produtos").add(dados).then(() => {
      mostrarMensagem("Produto adicionado com sucesso!", "success");
      cancelarFormulario();
      carregarProdutos();
    });
  }
}

function editarProduto(id, nome, preco, estoque, imagem) {
  document.getElementById("form-produto").classList.remove("d-none");
  document.getElementById("id-produto").value = id;
  document.getElementById("nome").value = nome;
  document.getElementById("preco").value = preco;
  document.getElementById("estoque").value = estoque;
  document.getElementById("imagem").value = imagem;
}

function excluirProduto(id) {
  if (confirm("Deseja excluir este produto?")) {
    db.collection("produtos").doc(id).delete().then(() => {
      mostrarMensagem("Produto excluído com sucesso!", "danger");
      carregarProdutos();
    });
  }
}

function mostrarMensagem(texto, tipo) {
  const el = document.getElementById("mensagem");
  el.className = "alert alert-" + tipo;
  el.textContent = texto;
  el.classList.remove("d-none");
  setTimeout(() => el.classList.add("d-none"), 3000);
}

function forcarProdutoExemplo() {
  db.collection("produtos").add({
    nome: "Produto Exemplo",
    preco: 99.9,
    estoque: 10,
    imagem: "https://via.placeholder.com/300"
  }).then(() => {
    mostrarMensagem("Produto de exemplo adicionado!", "primary");
    carregarProdutos();
  });
}
