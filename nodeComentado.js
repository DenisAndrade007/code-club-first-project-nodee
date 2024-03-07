// Importa o módulo express, que é um framework para aplicações web em Node.js
const express = require('express');
// Importa o módulo uuid para geração de identificadores únicos
const uuid = require('uuid'); 

// Define a porta na qual o servidor irá escutar
const port = 3000;
// Cria uma instância do express
const app = express();

// Middleware do Express para parsear o corpo das requisições em JSON automaticamente
app.use(express.json());

// Array para armazenar os usuários criados
const users = [];

// Middleware para checar a existência de um usuário pelo ID
const checkUserId = (request, response, next) => {
    // Extrai o ID do usuário dos parâmetros da rota
    const { id } = request.params;
    // Procura o índice do usuário no array users pelo ID
    const index = users.findIndex(user => user.id === id);

    // Se o usuário não for encontrado, retorna um erro 404
    if (index < 0) {
        return response.status(404).json({ error: "User not found" });
    }

    // Se o usuário for encontrado, anexa o índice do usuário e o ID ao objeto request
    request.userIndex = index;
    request.userId = id;
    // Chama o próximo middleware ou rota
    next();
};

// Rota para listar todos os usuários
app.get('/users', (request, response) => {
    // Retorna o array de usuários em formato JSON
    return response.json(users);
});

// Rota para criar um novo usuário
app.post('/users', (request, response) => {
    // Extrai nome e idade do corpo da requisição
    const { name, age } = request.body;
    // Cria um novo usuário com um ID único, nome e idade
    const user = { id: uuid.v4(), name, age };

    // Adiciona o novo usuário ao array de usuários
    users.push(user);

    // Retorna o usuário criado com status 201 (Criado)
    return response.status(201).json(user);
});

// Rota para atualizar um usuário existente
app.put('/users/:id', checkUserId, (request, response) => {
    // Extrai nome e idade do corpo da requisição
    const { name, age } = request.body;
    // Recupera o índice e o ID do usuário do objeto request
    const index = request.userIndex;
    const id = request.userId;

    // Cria um objeto de usuário atualizado
    const updatedUser = { id, name, age };

    // Atualiza o usuário no array pelo índice encontrado
    users[index] = updatedUser;

    // Retorna o usuário atualizado
    return response.json(updatedUser);
});

// Rota para deletar um usuário
app.delete('/users/:id', checkUserId, (request, response) => {
    // Recupera o índice do usuário do objeto request
    const index = request.userIndex;

    // Remove o usuário do array pelo índice
    users.splice(index, 1);

    // Retorna uma resposta sem conteúdo, mas com status 204 (No Content)
    return response.status(204).send();
});

// Inicia o servidor na porta definida, exibindo uma mensagem no console
app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
});