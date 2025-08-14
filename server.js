const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/bd.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'bd.json'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

fetch('./bd.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Aqui você pode manipular os dados conforme necessário
  })
  .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
