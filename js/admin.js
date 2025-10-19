
function adicionarProduto() {
    const nome = document.getElementById("nome").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const estoque = parseInt(document.getElementById("estoque").value);
    const imagem = document.getElementById("imagem").value;

    db.collection("produtos").add({ nome, preco, estoque, imagem })
        .then(() => {
            alert("Produto adicionado com sucesso!");
            document.getElementById("nome").value = "";
            document.getElementById("preco").value = "";
            document.getElementById("estoque").value = "";
            document.getElementById("imagem").value = "";
        })
        .catch(err => alert("Erro ao adicionar produto: " + err.message));
}

function logout() {
    auth.signOut().then(() => {
        window.location.href = "index.html";
    });
}
