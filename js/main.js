
let usuarioAtual = null;
let carrinho = [];

function abrirLogin() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    auth.signInWithEmailAndPassword(email, senha)
        .then(() => bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide())
        .catch(err => alert("Erro ao logar: " + err.message));
}

function cadastrar() {
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("senhaCadastro").value;
    auth.createUserWithEmailAndPassword(email, senha)
        .then(() => {
            const uid = auth.currentUser.uid;
            db.collection("usuarios").doc(uid).set({ perfil: "cliente" });
            alert("Usuário criado!");
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        })
        .catch(err => alert("Erro ao cadastrar: " + err.message));
}

function logout() {
    auth.signOut();
}

function adicionarAoCarrinho(produto) {
    if (!usuarioAtual) {
        abrirLogin();
        return;
    }
    carrinho.push(produto);
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const ul = document.getElementById("carrinho");
    ul.innerHTML = "";
    carrinho.forEach(p => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${p.nome} - R$ ${p.preco.toFixed(2)}`;
        ul.appendChild(li);
    });
}

function finalizarCompra() {
    if (!usuarioAtual) return abrirLogin();
    if (carrinho.length === 0) return alert("Carrinho vazio.");
    db.collection("compras").add({
        uid: usuarioAtual.uid,
        itens: carrinho,
        data: new Date()
    }).then(() => {
        alert("Compra registrada!");
        carrinho = [];
        renderizarCarrinho();
    });
}

function carregarProdutos() {
    db.collection("produtos").get().then(snapshot => {
        let html = "";
        snapshot.forEach(doc => {
            const p = doc.data();
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${p.imagem || 'https://via.placeholder.com/300x200'}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${p.nome}</h5>
                            <p class="card-text">Preço: R$ ${p.preco.toFixed(2)}</p>
                            <p class="card-text">Estoque: ${p.estoque}</p>
                            <button class="btn btn-primary w-100" onclick='adicionarAoCarrinho(${JSON.stringify(p)})'>Comprar</button>
                        </div>
                    </div>
                </div>
            `;
        });
        document.getElementById("produtos").innerHTML = html;
    }).catch(err => {
        document.getElementById("produtos").innerHTML = "<p class='text-danger'>Erro ao carregar produtos.</p>";
        console.error(err);
    });
}

auth.onAuthStateChanged(user => {
    usuarioAtual = user;
    document.getElementById("btn-login").classList.toggle("d-none", !!user);
    document.getElementById("btn-logout").classList.toggle("d-none", !user);
});

carregarProdutos();
