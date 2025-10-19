
let usuarioAtual = null;
let carrinho = [];

function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    auth.signInWithEmailAndPassword(email, senha)
        .then(() => {})
        .catch(err => alert("Erro ao logar: " + err.message));
}

function cadastrar() {
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("senhaCadastro").value;
    auth.createUserWithEmailAndPassword(email, senha)
        .then(() => alert("Usuário criado com sucesso!"))
        .catch(err => alert("Erro ao cadastrar: " + err.message));
}

function logout() {
    auth.signOut().then(() => {
        alert("Usuário deslogado");
    });
}

function adicionarAoCarrinho(produto) {
    carrinho.push(produto);
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const ul = document.getElementById("carrinho");
    ul.innerHTML = "";
    carrinho.forEach((p, i) => {
        const li = document.createElement("li");
        li.textContent = `${p.nome} - R$ ${p.preco.toFixed(2)}`;
        ul.appendChild(li);
    });
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Carrinho vazio.");
        return;
    }

    db.collection("compras").add({
        uid: usuarioAtual.uid,
        itens: carrinho,
        data: new Date()
    }).then(() => {
        alert("Compra finalizada!");
        carrinho = [];
        renderizarCarrinho();
    }).catch(err => alert("Erro ao finalizar compra: " + err.message));
}

function carregarProdutos() {
    db.collection("produtos").get().then(snapshot => {
        let html = "";
        snapshot.forEach(doc => {
            const produto = doc.data();
            html += `
                <div style="border:1px solid #ccc; padding:10px; margin:10px;">
                    <img src="${produto.imagem || 'https://via.placeholder.com/150'}" width="150"><br>
                    <strong>${produto.nome}</strong><br>
                    R$ ${produto.preco.toFixed(2)}<br>
                    Estoque: ${produto.estoque}<br>
                    <button onclick='adicionarAoCarrinho(${JSON.stringify(produto)})'>Comprar</button>
                </div>
            `;
        });
        document.getElementById("produtos").innerHTML = html;
    });
}

auth.onAuthStateChanged(user => {
    if (user) {
        usuarioAtual = user;
        document.getElementById("areaLogin").style.display = "none";
        document.getElementById("loja").style.display = "block";
        carregarProdutos();
    } else {
        usuarioAtual = null;
        document.getElementById("areaLogin").style.display = "block";
        document.getElementById("loja").style.display = "none";
    }
});
