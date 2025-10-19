
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

function carregarProdutos() {
    db.collection("produtos").get().then(snapshot => {
        let html = "";
        snapshot.forEach(doc => {
            const produto = doc.data();

            const nome = produto.nome || "Sem nome";
            const preco = typeof produto.preco === 'number' ? produto.preco.toFixed(2) : "0.00";
            const estoque = produto.estoque ?? "N/A";
            const imagem = produto.imagem || "https://via.placeholder.com/150";

            html += `
                <div style="border:1px solid #ccc; padding:10px; margin:10px;">
                    <img src="${imagem}" width="150"><br>
                    <strong>${nome}</strong><br>
                    R$ ${preco}<br>
                    Estoque: ${estoque}
                </div>
            `;
        });
        document.getElementById("produtos").innerHTML = html;
    });
}


auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById("areaLogin").style.display = "none";
        document.getElementById("loja").style.display = "block";
        carregarProdutos();
    } else {
        document.getElementById("areaLogin").style.display = "block";
        document.getElementById("loja").style.display = "none";
    }
});
