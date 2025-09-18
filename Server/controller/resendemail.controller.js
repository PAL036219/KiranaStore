import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();


const resend = new Resend(process.env.API_URL || 're_RTVWFoqN_Gp4jxe55y2zRJuiut361Yhmn');



const SendEmail = async ({Sendto , subject, html}) => {
    try {

        const { data, error } = await resend.emails.send({
    from: 'Gokatr <onboarding@resend.dev>',
    to: Sendto,
    subject: subject,
    html: html,
    });

        if (error) {
            console.error('Error sending email:', error);
            return { error };
        }

        console.log('Email sent successfully:', data);
        return { data };

    }
  
    
    catch (error) {
        console.error('Error sending email:', error);   
    }
}
export default SendEmail;




