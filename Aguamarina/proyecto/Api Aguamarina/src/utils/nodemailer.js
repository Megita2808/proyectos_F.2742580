import nodemailer from 'nodemailer';
import '../config.js';


const transporter = nodemailer.createTransport({
    service : "gmail",
    host : "smtp.gmail.com",
    port : 587,
    auth : {
        user : process.env.USER_GMAIL,
        pass : process.env.PASS_APP_GMAIL
    }
});



const enviarMail = (options) => {
    let sended = false;
    transporter.sendMail(options, (error, info) => {
        if (error){
            console.log(error, "No se ha podido enviar el Correo");
            sended = false;
        } else {
            console.log("Correo Enviado Exitosamente")
            sended = true;
        }
    })
    return sended;
};



export const sendMailOptions = async(toMail, subject, title, info) => {
    const options = {
        from : process.env.USER_GMAIL,
        to : toMail,
        subject,
        html : `<!DOCTYPE html>
                <html lang="es">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Correo Electrónico</title>
                <style>
                    body {
                        background-color: #f2f2f2;
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                    }
                    .all {
                        background-color: #00747C;
                        text-align: center;
                        justify-content: center;
                        margin: 0 auto;
                        min-width: 400px;
                        max-width: 500px;
                        min-height: 500px;
                        padding: 10px;
                        border-radius: 8px;
                    }
                    .container {
                        background-color: #202022;
                        margin: 0 auto;
                        min-width: 400px;
                        max-width: 500px;
                        min-height: 500px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;

                    }
                    .header {
                        background-color: #00747C;
                        color: white;
                        padding: 20px;
                        border-radius: 8px 8px 0 0;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 30px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content p {
                        font-size: 18px;
                        color: #f2f2f2;
                        line-height: 1.5;
                        margin: 20px 0;
                    }
                    .verification-code {
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 2px;
                        color: #000000;
                        background-color: #00747C;
                        padding: 10px 20px;
                        border-radius: 5px;
                        display: inline-block;
                        margin: 20px 0;
                    }
                    .btn {
                        display: inline-block;
                        padding: 12px 25px;
                        font-size: 16px;
                        color: white;
                        background-color: #00747C;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    .footer {
                        margin-top: 50px;
                        font-size: 12px;
                        color: #777;
                    }
                    .btn-link {
                        display: inline-block;
                        padding: 12px 25px;
                        font-size: 16px;
                        color: #fff !important;
                        background-color: #00747C;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                        transition: background-color 0.3s ease;
                    }
                    .btn-link:hover {
                        transition: background-color 0.3s ease;
                        background-color: #005960;
                    }
                        
                </style>
                </head>
                <body>
                <div class="all">
                    <div class="header">
                        <h1>${title}</h1>
                    </div>
                    <div class="container">
                    
                    <div class="content">
                        ${info}
                    </div>

                    <div class="footer">
                        <p>Si no solicitaste este correo, por favor ignóralo.</p>
                        <p>&copy; 2024 AguaMarina. Todos los derechos reservados.</p>
                    </div>
                </div>
                </div>
                </body>
                </html>
                `
    }
    const result = enviarMail(options);
    return result;
};