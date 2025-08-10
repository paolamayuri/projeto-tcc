// controllers/appointment.controller.js
const db = require('../config/database');

exports.getAvailability = (req, res) => {
    const { date, serviceId, professionalId } = req.query;
    if (!date || !serviceId || !professionalId) {
        return res.status(400).json({ message: 'Data, ID do serviço e ID do profissional são obrigatórios.' });
    }

    // --- CÓDIGO CORRIGIDO ---
    // Adicionamos 'T12:00:00' para que a data seja interpretada ao meio-dia,
    // evitando problemas de fuso horário que mudam o dia.
    const dataAgendamento = new Date(`${date}T12:00:00`); 
    const diaDaSemana = dataAgendamento.getDay(); // Voltamos a usar getDay()
    
    if (diaDaSemana === 0 || diaDaSemana === 1) { // 0 = Domingo, 1 = Segunda
        return res.json([]); // Retorna lista vazia para dias fechados
    }
    // --- FIM DA CORREÇÃO ---

    db.get(`SELECT duracao FROM servicos WHERE id = ?`, [serviceId], (err, service) => {
        // ...o resto da função continua igual...
    });
};

exports.createAppointment = (req, res) => {
    const { id_servico, id_profissional, data_hora_inicio, observacao } = req.body;
    const id_usuario = req.user.id; 

    if (!id_servico || !id_profissional || !data_hora_inicio) {
        return res.status(400).json({ message: 'Serviço, profissional e data/hora são obrigatórios.' });
    }

    // --- CÓDIGO CORRIGIDO ---
    const dataDoAgendamento = new Date(data_hora_inicio);
    const diaDaSemana = dataDoAgendamento.getDay(); // Usar getDay() aqui também
    
    if (diaDaSemana === 0 || diaDaSemana === 1) { // 0 = Domingo, 1 = Segunda
        return res.status(400).json({ message: 'Não é possível agendar neste dia, pois o salão está fechado.' });
    }
    // --- FIM DA CORREÇÃO ---

    db.get(`SELECT duracao FROM servicos WHERE id = ?`, [id_servico], (err, service) => {
        // ...o resto da função continua igual...
    });
};

exports.deleteAppointment = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const sql = userRole === 'admin' ? `DELETE FROM agendamentos WHERE id = ?` : `DELETE FROM agendamentos WHERE id = ? AND id_usuario = ?`;
    const params = userRole === 'admin' ? [id] : [id, userId];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ message: 'Erro ao deletar agendamento.' });
        if (this.changes === 0) return res.status(404).json({ message: 'Agendamento não encontrado ou sem permissão.' });
        res.json({ message: 'Agendamento deletado com sucesso.' });
    });
};

exports.getUserAppointments = (req, res) => {
    let sql = `
        SELECT a.id, a.data_hora_inicio, a.data_hora_fim, s.nome as servico_nome, s.preco as servico_preco, u.nome as cliente_nome, u.sobrenome as cliente_sobrenome, u.telefone as cliente_telefone, p.nome as profissional_nome, p.foto as profissional_foto
        FROM agendamentos a 
        JOIN servicos s ON a.id_servico = s.id 
        JOIN usuarios u ON a.id_usuario = u.id
        JOIN profissionais p ON a.id_profissional = p.id`;
    const params = [];
    if (req.user.role !== 'admin') {
        sql += ` WHERE a.id_usuario = ?`;
        params.push(req.user.id);
    }
    sql += ` ORDER BY a.data_hora_inicio DESC`;
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ message: "Erro ao buscar agendamentos." });
        res.json(rows);
    });
};

exports.getAllAppointmentsAdmin = (req, res) => {
    const sql = `
        SELECT a.id, a.data_hora_inicio, a.data_hora_fim, s.nome as servico_nome, u.nome as cliente_nome, u.sobrenome as cliente_sobrenome, u.telefone as cliente_telefone, p.nome as profissional_nome, p.foto as profissional_foto
        FROM agendamentos a 
        JOIN servicos s ON a.id_servico = s.id 
        JOIN usuarios u ON a.id_usuario = u.id
        JOIN profissionais p ON a.id_profissional = p.id
        ORDER BY a.data_hora_inicio DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ message: "Erro ao buscar todos os agendamentos." });
        res.json(rows);
    });
};

exports.getAllClientsAdmin = (req, res) => {
     db.all("SELECT id, nome, sobrenome, email, telefone FROM usuarios WHERE role = 'cliente' ORDER BY nome", [], (err, rows) => {
        if (err) return res.status(500).json({ "error": err.message });
        res.json(rows);
    });
}