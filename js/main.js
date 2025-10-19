
function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    auth.signInWithEmailAndPassword(email, senha)
        .then(user => alert("Login realizado"))
        .catch(err => alert(err.message));
}

function cadastrar() {
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("senhaCadastro").value;
    auth.createUserWithEmailAndPassword(email, senha)
        .then(user => alert("Usuário criado"))
        .catch(err => alert(err.message));
}

function logout() {
    auth.signOut().then(() => alert("Deslogado"));
}

function carregarProdutos() {
    db.collection("produtos").get().then(snapshot => {
        let html = "";
        snapshot.forEach(doc => {
            const produto = doc.data();
            html += `
                <div style="border:1px solid #ccc; padding:10px; margin:10px;">
                    <img src="${produto.imagem}" width="150"><br>
                    <strong>${produto.nome}</strong><br>
                    R$ ${produto.preco.toFixed(2)}<br>
                    Estoque: ${produto.estoque}
                </div>
            `;
        });
        document.getElementById("produtos").innerHTML = html;
    });
}

auth.onAuthStateChanged(user => {
    if (user) {
        carregarProdutos();
    }
});
