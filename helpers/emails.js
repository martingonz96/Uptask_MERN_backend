import nodemailer from 'nodemailer'

export const emailRegistro = async (datos)=> {

     const { email, nombre, token } = datos

     var transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }

      });

      //Informacion del mail
      const info = await transport.sendMail({
        from: '"Uptask - Administrador de proyectos" <cuentas@uptask.com>',
        to: email,
        subject: 'Uptask - Confirma tu cuenta',
        text: 'Comprueba tu cuenta en Uptask',
        html: `<p>Hola: ${nombre}! Comprueba tu cuenta en Uptask</p>
        <p>Tu cuenta ya casi esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        </p>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        
        `
      })
};


export const emailOlvidePassword = async (datos)=> {

  const { email, nombre, token } = datos


//Mover hacia variables de entorno
  var transport = nodemailer.createTransport({
     host: process.env.EMAIL_HOST,
     port: process.env.EMAIL_PORT,
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS
     }

   });

   //Informacion del mail
   const info = await transport.sendMail({
     from: '"Uptask - Administrador de proyectos" <cuentas@uptask.com>',
     to: email,
     subject: 'Uptask - Reestablece tu Password',
     text: 'Reestablece tu Password',
     html: `<p>Hola: ${nombre}! has solicitado reestablecer tu password</p>
     <p>Sigue el siguiente enlace para generar una nueva password:
     <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
     </p>

     <p>Si tu no solicitaste este email, ignora este mensaje</p>
     
     `
   })
};

