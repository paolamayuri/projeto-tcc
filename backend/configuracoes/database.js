// config/database.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./salao.db', (err) => {
    if (err) {
        return console.error("Erro FATAL ao conectar ao banco de dados:", err.message);
    }
    console.log('Conectado ao banco de dados SQLite.');

    db.serialize(() => {
        // Tabela de Usuários
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY, 
            nome TEXT NOT NULL, 
            sobrenome TEXT, 
            email TEXT NOT NULL UNIQUE, 
            telefone TEXT, 
            senha TEXT NOT NULL, 
            role TEXT NOT NULL DEFAULT 'cliente'
        )`);

        // Tabela de Serviços
        db.run(`CREATE TABLE IF NOT EXISTS servicos (
            id INTEGER PRIMARY KEY, 
            nome TEXT NOT NULL, 
            duracao INTEGER NOT NULL, 
            preco REAL
        )`);

        // Tabela de Profissionais
        db.run(`CREATE TABLE IF NOT EXISTS profissionais (
            id INTEGER PRIMARY KEY, 
            nome TEXT NOT NULL, 
            foto TEXT DEFAULT 'https://placehold.co/150x150/cccccc/ffffff?text=Pro'
        )`);

        // Tabela para relacionar Profissionais e Serviços (muitos para muitos)
        db.run(`CREATE TABLE IF NOT EXISTS profissional_servicos (
            id_profissional INTEGER,
            id_servico INTEGER,
            PRIMARY KEY (id_profissional, id_servico),
            FOREIGN KEY (id_profissional) REFERENCES profissionais(id) ON DELETE CASCADE,
            FOREIGN KEY (id_servico) REFERENCES servicos(id) ON DELETE CASCADE
        )`, (err) => {
            if (err) console.error("Erro ao criar tabela profissional_servicos:", err.message);
        });

        // Tabela de Agendamentos
        db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY, 
            id_usuario INTEGER, 
            id_servico INTEGER, 
            id_profissional INTEGER, 
            data_hora_inicio TEXT NOT NULL, 
            data_hora_fim TEXT NOT NULL, 
            observacao TEXT, 
            FOREIGN KEY(id_usuario) REFERENCES usuarios(id), 
            FOREIGN KEY(id_servico) REFERENCES servicos(id), 
            FOREIGN KEY(id_profissional) REFERENCES profissionais(id)
        )`, (err) => {
            if (err) return console.error("Erro ao criar tabela de agendamentos:", err.message);
            seedInitialData(); // Chama a função de popular dados iniciais
        });
    });
});

// Função para popular dados iniciais (adicionei foto e serviços aos profissionais)
function seedInitialData() {
    // Adicionar um usuário admin se não existir
    db.get(`SELECT COUNT(*) as count FROM usuarios WHERE email = 'admin@salao.com'`, (err, row) => {
        if (row.count === 0) {
            bcrypt.hash('admin123', 10, (err, hash) => {
                if (err) return console.error("Erro ao gerar hash da senha do admin:", err.message);
                db.run(`INSERT INTO usuarios (nome, sobrenome, email, telefone, senha, role) VALUES (?, ?, ?, ?, ?, ?)`,
                    ['Admin', 'Geral', 'admin@salao.com', 'XXYYYYZZZZZ', hash, 'admin'],
                    function (err) {
                        if (err) return console.error("Erro ao inserir admin:", err.message);
                        console.log('Usuário admin inserido.');
                    });
            });
        }
    });

    // Inserir serviços se a tabela estiver vazia
    db.get(`SELECT COUNT(*) as count FROM servicos`, (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare(`INSERT INTO servicos (nome, duracao, preco) VALUES (?, ?, ?)`);
            stmt.run('Corte Masculino', 30, 40.00);
            stmt.run('Corte Feminino', 60, 80.00);
            stmt.run('Manicure', 45, 30.00);
            stmt.run('Pedicure', 45, 35.00);
            stmt.run('Coloração', 90, 120.00);
            stmt.run('Escova', 40, 50.00);
            stmt.finalize(() => {
                console.log('Serviços iniciais inseridos.');
                // Após inserir serviços, inserir profissionais e associar serviços
                seedProfessionalsAndServices();
            });
        } else {
            // Se já houver serviços, apenas garante que profissionais e serviços estejam linkados
            seedProfessionalsAndServices();
        }
    });
}

function seedProfessionalsAndServices() {
    // Inserir profissionais se a tabela estiver vazia (MODIFICADO: com foto)
    db.get(`SELECT COUNT(*) as count FROM profissionais`, (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare(`INSERT INTO profissionais (nome, foto) VALUES (?, ?)`);
            stmt.run('Ana Silva', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80');
            stmt.run('Bruno Costa', 'https://images.unsplash.com/photo-1507003211169-e69adba4c2d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80');
            stmt.run('Carla Souza', 'https://images.unsplash.com/photo-1596815065099-ef8a17d092d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80');
            stmt.finalize(() => {
                console.log('Profissionais iniciais inseridos.');
                // Associar serviços aos profissionais
                associateProfessionalServices();
            });
        } else {
            // Se já houver profissionais, apenas garante que os serviços estejam linkados
            associateProfessionalServices();
        }
    });
}

function associateProfessionalServices() {
    // Exemplo de associações: Ana (Corte Fem, Coloração, Escova), Bruno (Corte Masc), Carla (Manicure, Pedicure)
    // Primeiro, limpamos as associações existentes para evitar duplicatas em reinícios
    db.run(`DELETE FROM profissional_servicos`, (err) => {
        if (err) console.error("Erro ao limpar profissional_servicos:", err.message);

        // Buscar IDs de serviços e profissionais para associar
        db.all(`SELECT id, nome FROM servicos`, (err, services) => {
            if (err) return console.error("Erro ao buscar serviços para associação:", err.message);
            db.all(`SELECT id, nome FROM profissionais`, (err, professionals) => {
                if (err) return console.error("Erro ao buscar profissionais para associação:", err.message);

                const getServiceId = (name) => services.find(s => s.nome === name)?.id;
                const getProfessionalId = (name) => professionals.find(p => p.nome === name)?.id;

                const stmt = db.prepare(`INSERT INTO profissional_servicos (id_profissional, id_servico) VALUES (?, ?)`);

                // Ana Silva: Corte Feminino, Coloração, Escova
                const anaId = getProfessionalId('Ana Silva');
                if (anaId) {
                    const corteFemId = getServiceId('Corte Feminino');
                    const coloracaoId = getServiceId('Coloração');
                    const escovaId = getServiceId('Escova');
                    if (corteFemId) stmt.run(anaId, corteFemId);
                    if (coloracaoId) stmt.run(anaId, coloracaoId);
                    if (escovaId) stmt.run(anaId, escovaId);
                }

                // Bruno Costa: Corte Masculino
                const brunoId = getProfessionalId('Bruno Costa');
                if (brunoId) {
                    const corteMascId = getServiceId('Corte Masculino');
                    if (corteMascId) stmt.run(brunoId, corteMascId);
                }

                // Carla Souza: Manicure, Pedicure
                const carlaId = getProfessionalId('Carla Souza');
                if (carlaId) {
                    const manicureId = getServiceId('Manicure');
                    const pedicureId = getServiceId('Pedicure');
                    if (manicureId) stmt.run(carlaId, manicureId);
                    if (pedicureId) stmt.run(carlaId, pedicureId);
                }
                
                stmt.finalize(() => console.log('Associações de serviços a profissionais concluídas.'));
            });
        });
    });
}

// Exporta a conexão para ser usada em outros arquivos
module.exports = db;