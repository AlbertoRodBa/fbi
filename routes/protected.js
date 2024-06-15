import express from 'express'
import jwt from 'jsonwebtoken'
import { results } from '../data/agentes.js'
import { crimenes } from '../data/crimenes.js'

const router = express.Router();
const secretKey = process.env.JWT_SECRET;

// Zona restringida por Token
router.get('/restricted', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(403).send('Restringido. Token requerido');
    }

    try {
        const decoded = jwt.verify(token, secretKey)
        const email = decoded.email;

        const agente = results.find(agent => agent.email === email)

        if (!agente) {
            return res.status(401).send('No autorizado')
        }

        const htmlResponse = `
            <html>
                <head>
                    <title>Página Restringida</title>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                </head>
                <body class="bg-dark text-white">
                    <div class="container">
                        <h1 class="mt-5">Información Secreta</h1>
                        <h6>🔐 Solo agentes autorizados pueden ver esto 🔐</h6>
                        
                        <table class="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Descripción del Crimen</th>
                                    <th scope="col">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${crimenes.map(cr => `
                                    <tr>
                                        <th scope="row">${cr.id}</th>
                                        <td>${cr.descripcion}</td>
                                        <td>${cr.fecha}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </body>
            </html>
        `;

        res.send(htmlResponse);
    } catch (err) {
        res.status(401).send('Token inválido o expirado');
    }
});

export default router;
