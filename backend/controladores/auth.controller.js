// controllers/auth.controller.js
const db = require('../configuracoes/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Lógica que estava na rota POST /api/register
exports.register = (req, res) => {
    const { nome, sobrenome, email, telefone, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }
    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: "Erro ao criptografar senha." });
        db.run(`INSERT INTO usuarios (nome, sobrenome, email, telefone, senha, role) VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, sobrenome, email, telefone, hash, 'cliente'],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(409).json({ message: "Este email já está cadastrado." });
                    }
                    return res.status(500).json({ message: 'Erro ao registrar usuário.' });
                }
                res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: this.lastID });
            });
    });
};

// Lógica que estava na rota POST /api/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
        if (!user) {
            return res.status(400).json({ message: "Credenciais inválidas." });
        }

        const passwordMatch = await bcrypt.compare(password, user.senha);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Credenciais inválidas." });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const { senha, ...userWithoutPassword } = user;

        res.status(200).json({ message: "Login realizado com sucesso!", token, user: userWithoutPassword });
    });
};