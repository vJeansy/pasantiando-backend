import capitalize from "src/utils/selects/capitalize";

export function generateAccountDeactivationEmail({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const greeting = `Hola ${capitalize(firstName)},`;
  const fullName = `${capitalize(firstName)} ${capitalize(lastName)}`;

  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Desactivación de cuenta</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f9fafb;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .header {
          background-color: #2563eb;
          color: #ffffff;
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 20px;
        }
        .content {
          padding: 24px;
          font-size: 15px;
          line-height: 1.6;
        }
        .cta {
          margin-top: 24px;
          text-align: center;
        }
        .cta a {
          display: inline-block;
          background-color: #2563eb;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 16px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pasantiando</h1>
        </div>
        <div class="content">
          <p>${greeting}</p>
          <p>Queremos informarte que tu cuenta <strong>${fullName}</strong> ha sido desactivada exitosamente.</p>
          <p>Si en algún momento deseas reactivarla o necesitas asistencia, no dudes en contactarnos. Estamos aquí para ayudarte a seguir explorando oportunidades profesionales.</p>
          <p>Gracias por haber sido parte de nuestra comunidad.</p>
          <p>Atentamente,<br />El equipo de Pasantiando</p>
          <div class="cta">
            <a href="https://pasantiando.com">Volver a Pasantiando</a>
          </div>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Pasantiando. Todos los derechos reservados.
        </div>
      </div>
    </body>
  </html>
  `;
}