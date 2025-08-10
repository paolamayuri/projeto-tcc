// controllers/professional.controller.js
const db = require('../config/database');

// FUNÇÃO QUE ESTAVA FALTANDO
exports.getAllProfessionals = (req, res) => {
    const sql = `
        SELECT 
            p.id, 
            p.nome, 
            p.foto,
            GROUP_CONCAT(s.id || ':' || s.nome) AS servicos_oferecidos
        FROM profissionais p
        LEFT JOIN profissional_servicos ps ON p.id = ps.id_profissional
        LEFT JOIN servicos s ON ps.id_servico = s.id
        GROUP BY p.id, p.nome, p.foto
        ORDER BY p.nome`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar profissionais:", err.message);
            return res.status(500).json({ "error": err.message });
        }
        const professionalsWithServices = rows.map(row => {
            const servicos = row.servicos_oferecidos ?
                row.servicos_oferecidos.split(',').map(item => {
                    const [id, nome] = item.split(':');
                    return { id: parseInt(id), nome };
                }) : [];
            return { ...row, servicos_oferecidos: servicos };
        });
        res.json(professionalsWithServices);
    });
};

// FUNÇÃO QUE ESTAVA FALTANDO
exports.createProfessional = (req, res) => {
    const { nome, foto, servicosAtendidos } = req.body;
    if (!nome) return res.status(400).json({ message: 'O nome é obrigatório.' });

    db.run(`INSERT INTO profissionais (nome, foto) VALUES (?, ?)`, [nome, foto], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Erro ao criar profissional.' });
        }
        const profissionalId = this.lastID;
        if (servicosAtendidos && servicosAtendidos.length > 0) {
            const stmt = db.prepare(`INSERT INTO profissional_servicos (id_profissional, id_servico) VALUES (?, ?)`);
            servicosAtendidos.forEach(serviceId => stmt.run(profissionalId, serviceId));
            stmt.finalize(() => res.status(201).json({ id: profissionalId, nome, foto, servicos_oferecidos: servicosAtendidos }));
        } else {
            res.status(201).json({ id: profissionalId, nome, foto, servicos_oferecidos: [] });
        }
    });
};

// FUNÇÃO QUE ESTAVA FALTANDO
exports.updateProfessional = (req, res) => {
    const { nome, foto, servicosAtendidos } = req.body;
    const { id } = req.params;
    if (!nome) return res.status(400).json({ message: 'O nome é obrigatório.' });

    db.run(`UPDATE profissionais SET nome = ?, foto = ? WHERE id = ?`, [nome, foto, id], function (err) {
        if (err) return res.status(500).json({ message: 'Erro ao atualizar profissional.' });

        db.run(`DELETE FROM profissional_servicos WHERE id_profissional = ?`, [id], (deleteServicesErr) => {
            if (deleteServicesErr) return res.status(500).json({ message: 'Erro ao atualizar associações de serviço.' });

            if (servicosAtendidos && servicosAtendidos.length > 0) {
                const stmt = db.prepare(`INSERT INTO profissional_servicos (id_profissional, id_servico) VALUES (?, ?)`);
                servicosAtendidos.forEach(serviceId => stmt.run(id, serviceId));
                stmt.finalize(() => res.json({ message: 'Profissional atualizado com sucesso.' }));
            } else {
                res.json({ message: 'Profissional atualizado com sucesso.' });
            }
        });
    });
};

// A SUA FUNÇÃO (CORRETA E ATUALIZADA)
exports.deleteProfessional = (req, res) => {
    const { id } = req.params;
    const dataAtual = new Date().toISOString();

    const sqlVerificacao = `SELECT COUNT(*) as count FROM agendamentos WHERE id_profissional = ? AND data_hora_inicio > ?`;

    db.get(sqlVerificacao, [id, dataAtual], (err, row) => {
        if (err) {
            console.error("Erro ao verificar agendamentos futuros:", err.message);
            return res.status(500).json({ message: "Erro interno ao verificar dependências." });
        }

        if (row.count > 0) {
            return res.status(400).json({
                message: `Este profissional não pode ser excluído, pois possui ${row.count} agendamento(s) futuro(s) associado(s) a ele.`
            });
        } else {
            db.run(`DELETE FROM profissional_servicos WHERE id_profissional = ?`, id, (deleteServicesErr) => {
                if (deleteServicesErr) {
                    console.error("Erro ao deletar associações de serviços do profissional:", deleteServicesErr.message);
                    return res.status(500).json({ message: 'Erro ao deletar associações de serviços do profissional.' });
                }
        
                db.run(`DELETE FROM profissionais WHERE id = ?`, id, function(err) {
                    if (err) {
                        console.error("Erro ao deletar profissional:", err.message);
                        return res.status(500).json({ message: 'Erro ao deletar profissional.' });
                    }
                    if (this.changes === 0) {
                        return res.status(404).json({ message: 'Profissional não encontrado.' });
                    }
                    res.json({ message: 'Profissional deletado com sucesso.' });
                });
            });
        }
    });
};