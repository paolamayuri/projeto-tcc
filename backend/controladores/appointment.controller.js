// controllers/appointment.controller.js
const db = require('../configuracoes/database');

function getBusinessHoursForDay(dayOfWeek) {
    // 0: Domingo, 1: Segunda, 2: Terça, 3: Quarta, 4: Quinta, 5: Sexta, 6: Sábado
    if (dayOfWeek === 0 || dayOfWeek === 1) return null; // Fechado
    if (dayOfWeek >= 2 && dayOfWeek <= 4) return { startHour: 9, endHour: 19 }; // Ter-Qua-Qui
    if (dayOfWeek === 5) return { startHour: 9, endHour: 20 }; // Sexta
    if (dayOfWeek === 6) return { startHour: 8, endHour: 17 }; // Sábado
    return null;
}

function addMinutes(date, minutes) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + minutes);
    return d;
}

function toISO(date) {
    return new Date(date).toISOString();
}

function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
}

exports.getAvailability = (req, res) => {
    const { date, serviceId, professionalId } = req.query;
    if (!date || !serviceId || !professionalId) {
        return res.status(400).json({ message: 'Data, ID do serviço e ID do profissional são obrigatórios.' });
    }

    const dataAgendamento = new Date(`${date}T12:00:00`);
    const diaDaSemana = dataAgendamento.getDay();

    const hours = getBusinessHoursForDay(diaDaSemana);
    if (!hours) {
        return res.json([]); // fechado
    }

    db.get(`SELECT duracao FROM servicos WHERE id = ?`, [serviceId], (err, service) => {
        if (err) return res.status(500).json({ message: 'Erro ao obter serviço.' });
        if (!service) return res.status(404).json({ message: 'Serviço não encontrado.' });

        const { duracao } = service; // em minutos

        // Busca agendamentos existentes do profissional no dia
        const startOfDay = new Date(`${date}T00:00:00`);
        const endOfDay = new Date(`${date}T23:59:59`);

        db.all(
            `SELECT data_hora_inicio, data_hora_fim FROM agendamentos WHERE id_profissional = ? AND data_hora_inicio BETWEEN ? AND ? ORDER BY data_hora_inicio`,
            [professionalId, toISO(startOfDay), toISO(endOfDay)],
            (err2, rows) => {
                if (err2) return res.status(500).json({ message: 'Erro ao buscar agendamentos existentes.' });

                // Monta a lista de intervalos ocupados
                const busy = rows.map(r => ({ start: new Date(r.data_hora_inicio), end: new Date(r.data_hora_fim) }));

                // Gera slots a cada 15 minutos dentro do horário comercial
                const open = new Date(`${date}T${String(hours.startHour).padStart(2, '0')}:00:00`);
                const close = new Date(`${date}T${String(hours.endHour).padStart(2, '0')}:00:00`);

                const slots = [];
                for (let cursor = new Date(open); addMinutes(cursor, duracao) <= close; cursor = addMinutes(cursor, 15)) {
                    const slotStart = new Date(cursor);
                    const slotEnd = addMinutes(slotStart, duracao);

                    // Verifica conflito com agendamentos existentes
                    const hasConflict = busy.some(b => overlaps(slotStart, slotEnd, b.start, b.end));
                    if (!hasConflict) {
                        slots.push(toISO(slotStart));
                    }
                }

                return res.json(slots);
            }
        );
    });
};

exports.createAppointment = (req, res) => {
    const { id_servico, id_profissional, data_hora_inicio, observacao } = req.body;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    if (!id_servico || !id_profissional || !data_hora_inicio) {
        return res.status(400).json({ message: 'Serviço, profissional e data/hora são obrigatórios.' });
    }

    const dataDoAgendamento = new Date(data_hora_inicio);
    const diaDaSemana = dataDoAgendamento.getDay();

    const hours = getBusinessHoursForDay(diaDaSemana);
    if (!hours) {
        return res.status(400).json({ message: 'Não é possível agendar neste dia, pois o salão está fechado.' });
    }

    db.get(`SELECT duracao FROM servicos WHERE id = ?`, [id_servico], (err, service) => {
        if (err) return res.status(500).json({ message: 'Erro ao obter serviço.' });
        if (!service) return res.status(404).json({ message: 'Serviço não encontrado.' });

        const { duracao } = service;
        const start = new Date(data_hora_inicio);
        const end = addMinutes(start, duracao);

        // valida dentro do horário
        const open = new Date(start);
        open.setHours(hours.startHour, 0, 0, 0);
        const close = new Date(start);
        close.setHours(hours.endHour, 0, 0, 0);
        if (start < open || end > close) {
            return res.status(400).json({ message: 'Horário fora do expediente.' });
        }

        // verifica conflito
        db.get(
            `SELECT COUNT(*) as count FROM agendamentos WHERE id_profissional = ? AND NOT (data_hora_fim <= ? OR data_hora_inicio >= ?)`,
            [id_profissional, toISO(start), toISO(end)],
            (err2, row) => {
                if (err2) return res.status(500).json({ message: 'Erro ao validar conflito de agenda.' });
                if (row.count > 0) return res.status(409).json({ message: 'Horário indisponível para este profissional.' });

                // define usuário alvo (admin pode agendar para outro usuário)
                const id_usuario = requesterRole === 'admin' && req.body.id_usuario ? req.body.id_usuario : requesterId;

                db.run(
                    `INSERT INTO agendamentos (id_usuario, id_servico, id_profissional, data_hora_inicio, data_hora_fim, observacao) VALUES (?, ?, ?, ?, ?, ?)`,
                    [id_usuario, id_servico, id_profissional, toISO(start), toISO(end), observacao || null],
                    function (err3) {
                        if (err3) return res.status(500).json({ message: 'Erro ao criar agendamento.' });
                        res.status(201).json({ id: this.lastID, id_usuario, id_servico, id_profissional, data_hora_inicio: toISO(start), data_hora_fim: toISO(end) });
                    }
                );
            }
        );
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