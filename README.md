# 💇‍♀️ Beauty Salon - Sistema de Agendamento

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

Projeto de TCC (Trabalho de Conclusão de Curso) em Análise e Desenvolvimento de Sistemas. Consiste em um sistema web completo para o gerenciamento de um salão de beleza, permitindo o agendamento de horários, além do cadastro e gerenciamento de clientes e serviços.

## 📝 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Executar](#-como-executar)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Autora](#-autora)

## ✨ Sobre o Projeto

O **Beauty Salon** foi desenvolvido como uma solução para otimizar a gestão e o atendimento em salões de beleza. A plataforma permite que tanto os administradores do salão quanto os clientes possam interagir com o sistema de forma intuitiva, facilitando o processo de marcação, consulta e cancelamento de horários.

O sistema possui um painel administrativo para gerenciamento e uma interface dedicada para o cliente final realizar seus agendamentos.

## 🚀 Funcionalidades

- **Painel Administrativo:**
  - Login seguro para administradores.
  - CRUD (Criação, Leitura, Atualização e Deleção) de Serviços.
  - CRUD de Clientes.
  - Visualização e gerenciamento de todos os agendamentos.
- **Área do Cliente:**
  - Cadastro e Login de clientes.
  - Visualização dos serviços disponíveis.
  - Agendamento de horários de forma simples e rápida.
  - Visualização de seus próprios agendamentos.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias modernas e robustas do ecossistema JavaScript.

- **Front-end:**
  - [React](https://reactjs.org/)
  - [Vite](https://vitejs.dev/) como bundler
  - [Axios](https://axios-http.com/) para requisições HTTP
  - [React Router DOM](https://reactrouter.com/) para gerenciamento de rotas
  - Estilização com CSS Modules

- **Back-end:**
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/) para o servidor API REST
  - [MySQL2](https://github.com/sidorares/node-mysql2) como driver do banco de dados
  - [Nodemon](https://nodemon.io/) para desenvolvimento em tempo real
  - [CORS](https://expressjs.com/en/resources/middleware/cors.html) para habilitar requisições de diferentes origens

- **Banco de Dados:**
  - [MySQL](https://www.mysql.com/)

## ⚙️ Como Executar

Para executar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- Um servidor de banco de dados MySQL em execução.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/paolamayuri/projeto-tcc.git](https://github.com/paolamayuri/projeto-tcc.git)
    cd projeto-tcc
    ```

2.  **Configure o Banco de Dados:**
    - Crie um banco de dados no seu servidor MySQL.
    - É necessário ter as tabelas `agendamentos`, `clientes` e `servicos`. Se houver um arquivo `.sql` no projeto, importe-o para criar a estrutura inicial.

3.  **Instale e configure o Back-end (API):**
    ```bash
    cd api
    npm install
    ```
    > **Observação:** O back-end se conecta ao banco de dados através do arquivo `api/src/db.js`. Certifique-se de que as credenciais (host, user, password, database) estão corretas para o seu ambiente local.

4.  **Instale o Front-end:**
    ```bash
    cd ../frontend
    npm install
    ```

### Executando a Aplicação

1.  **Inicie o servidor Back-end:**
    - No terminal, navegue até a pasta `api/` e execute:
    ```bash
    npm start
    ```
    - O servidor estará em execução em `http://localhost:8800`.

2.  **Inicie o cliente Front-end:**
    - Em **outro terminal**, navegue até a pasta `frontend/` e execute:
    ```bash
    npm run dev
    ```
    - A aplicação estará acessível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## 📁 Estrutura de Pastas

O projeto está organizado em duas pastas principais:

-   **`/api`**: Contém todo o código do back-end (servidor Node.js/Express).
    -   `src/controllers`: Lógica de controle para cada rota (regras de negócio).
    -   `src/routes`: Definição das rotas da API.
    -   `src/db.js`: Configuração da conexão com o banco de dados.
-   **`/frontend`**: Contém todo o código do front-end (aplicação React).
    -   `src/components`: Componentes reutilizáveis do React.
    -   `src/pages`: Páginas da aplicação.
    -   `src/styles`: Arquivos de estilização CSS.


Projeto desenvolvido por **Paola Mayuri Oda**.

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/paolamayuri)
