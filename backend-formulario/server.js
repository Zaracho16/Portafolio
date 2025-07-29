
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/enviar', async (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'adrianzaracho16@gmail.com',
      pass: 'zzgp mnqt xxap lbfs',
    },
  });

  const mailOptions = {
    from: correo,
    to: 'adrianzaracho16@gmail.com',
    subject: `Mensaje desde portafolio de ${nombre}`,
    text: `${mensaje}\n\nCorreo del remitente: ${correo}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error enviando el correo' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

