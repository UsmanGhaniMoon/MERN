const nodemailer = require('nodemailer')

//SMTP Setting

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    auth:{
        user:'enter user email',
        pass:'enter pass',
    },
})

const sendEmail = async(to, subject, text)=>{
    const mailOption = {
        from:'noreply@admin.com',
        to,
        subject,
        text
    }

    try{
        const info = await transporter.sendMail(mailOption)
    } catch(error){
        console.error(error) 
    }
}

module.exports = { sendEmail }

