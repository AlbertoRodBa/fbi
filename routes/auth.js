import express from 'express'
import jwt from 'jsonwebtoken'
import { results } from '../data/agentes.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()
const secretKey = process.env.JWT_SECRET

// Servir HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'))
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    // Verificar credenciales
    const agente = results.find(agent => agent.email === email && agent.password === password);

    if (!agente) {
        return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    // Token con tiempo de expiración de 2 minutos
    const token = jwt.sign({ email: agente.email }, secretKey, { expiresIn: 120 })

    res.redirect(`/welcome?token=${token}`);
});

router.get('/welcome', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(403).send('Acceso denegado. Token requerido')
    }

    try {
        const decoded = jwt.verify(token, secretKey)
        const email = decoded.email;
        res.send(`
            <html>
                <head>
                    <title>Bienvenida</title>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                </head>
                <body class="bg-dark text-white">
                    <div class="container">
                        <h1 class="mt-5">🕵️‍♂️ Bienvenido, ${email}</h1>
                        <p><a href="/restricted?token=${token}" class="btn btn-danger">Acceder a la zona restringida</a></p>
                    </div>
                </body>
            </html>
        `);
    } catch (err) {
        res.status(401).send('Token inválido o expirado')
    }
});

export default router;
