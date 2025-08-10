// controllers/user.controller.js
const db = require('../configuracoes/database');

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, telefone } = req.body;

    if (parseInt(id) !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Acesso negado." });
    }
    if (!nome) {
        return res.status(400).json({ message: 'Nome é obrigatório.' });
    }
    db.run(`UPDATE usuarios SET nome = ?, sobrenome = ?, telefone = ? WHERE id = ?`,
        [nome, sobrenome, telefone, id],
        function (err) {
            if (err) return res.status(500).json({ message: 'Erro ao atualizar dados do usuário.' });
            if (this.changes === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });
            res.json({ message: 'Dados do usuário atualizados com sucesso.' });
        });
};