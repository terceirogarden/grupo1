
let usuarioAtual = null;
let carrinho = [];

function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    auth.signInWithEmailAndPassword(email, senha)
        .catch(err => alert("Erro ao logar: " + err.message));
}

function cadastrar() {
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("senhaCadastro").value;
    auth.createUserWithEmailAndPassword(email, senha)
        .then(() => {
            const uid = auth.currentUser.uid;
            db.collection("usuarios").doc(uid).set({ perfil: "cliente" });
            alert("Usuário criado com sucesso!");
        })
        .catch(err => alert("Erro ao cadastrar: " + err.message));
}

function logout() {
    auth.signOut().then(() => {
        alert("Deslogado");
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
        li.className = "list-group-item";
        li.textContent = `${p.nome} - R$ ${p.preco.toFixed(2)}`;
        ul.appendChild(li);
    });
}

function finalizarCompra() {
    if (carrinho.length === 0) return alert("Carrinho vazio.");
    db.collection("compras").add({
        uid: usuarioAtual.uid,
        itens: carrinho,
        data: new Date()
    }).then(() => {
        alert("Compra finalizada!");
        carrinho = [];
        renderizarCarrinho();
    });
}

function carregarProdutos() {
    db.collection("produtos").get().then(snapshot => {
        let html = "";
        snapshot.forEach(doc => {
            const produto = doc.data();
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${produto.imagem || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${produto.nome}">
                        <div class="card-body">
                            <h5 class="card-title">${produto.nome}</h5>
                            <p class="card-text">Preço: R$ ${produto.preco.toFixed(2)}</p>
                            <p class="card-text">Estoque: ${produto.estoque}</p>
                            <button class="btn btn-primary" onclick='adicionarAoCarrinho(${JSON.stringify(produto)})'>Comprar</button>
                        </div>
                    </div>
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
        document.getElementById("areaLogin").style.display = "block";
        document.getElementById("loja").style.display = "none";
    }
});
