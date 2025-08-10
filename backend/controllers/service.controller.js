// controllers/service.controller.js
const db = require('../config/database');

// Lógica de GET /api/services
exports.getAllServices = (req, res) => {
    db.all("SELECT * FROM servicos ORDER BY nome", [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar serviços:", err.message);
            return res.status(500).json({ "error": err.message });
        }
        res.json(rows);
    });
};

// Lógica de POST /api/admin/services
exports.createService = (req, res) => {
    const { nome, duracao, preco } = req.body;
    if (!nome || !duracao || !preco) {
        return res.status(400).json({ message: 'Nome, duração e preço são obrigatórios.' });
    }
    db.run(`INSERT INTO servicos (nome, duracao, preco) VALUES (?, ?, ?)`,
        [nome, duracao, preco],
        function (err) {
            if (err) {
                console.error("Erro ao criar serviço:", err.message);
                return res.status(500).json({ message: 'Erro ao criar serviço.' });
            }
            res.status(201).json({ id: this.lastID, nome, duracao, preco });
        });
};

// Lógica de PUT /api/admin/services/:id
exports.updateService = (req, res) => {
    const { id } = req.params;
    const { nome, duracao, preco } = req.body;
    if (!nome || !duracao || !preco) {
        return res.status(400).json({ message: 'Nome, duração e preço são obrigatórios.' });
    }
    db.run(`UPDATE servicos SET nome = ?, duracao = ?, preco = ? WHERE id = ?`,
        [nome, duracao, preco, id],
        function (err) {
            if (err) {
                console.error("Erro ao atualizar serviço:", err.message);
                return res.status(500).json({ message: 'Erro ao atualizar serviço.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Serviço não encontrado.' });
            }
            res.json({ message: 'Serviço atualizado com sucesso.' });
        });
};

// Lógica de DELETE /api/admin/services/:id
exports.deleteService = (req, res) => {
    const { id } = req.params;
    const dataAtual = new Date().toISOString(); // Pega a data e hora atual no formato padrão (ISO)

    // Passo 1: SQL para verificar se existem agendamentos FUTUROS com este serviço
    const sqlVerificacao = `SELECT COUNT(*) as count FROM agendamentos WHERE id_servico = ? AND data_hora_inicio > ?`;

    // Executa a verificação no banco de dados
    db.get(sqlVerificacao, [id, dataAtual], (err, row) => {
        if (err) {
            console.error("Erro ao verificar agendamentos futuros:", err.message);
            return res.status(500).json({ message: "Erro interno ao verificar dependências." });
        }

        // Passo 2: Se a contagem for maior que zero, bloqueia a exclusão
        if (row.count > 0) {
            return res.status(400).json({ // 400 = Bad Request, uma requisição inválida
                message: `Este serviço não pode ser excluído, pois existem ${row.count} agendamento(s) futuro(s) associado(s) a ele.`
            });
        } else {
            // Passo 3: Se a contagem for zero, é seguro deletar o serviço
            const sqlDelete = `DELETE FROM servicos WHERE id = ?`;
            db.run(sqlDelete, id, function (err) {
                if (err) {
                    console.error("Erro ao deletar serviço:", err.message);
                    return res.status(500).json({ message: 'Erro ao deletar serviço.' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ message: 'Serviço não encontrado.' });
                }
                res.json({ message: 'Serviço deletado com sucesso.' });
            });
        }
    });
};