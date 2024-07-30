import nodemailer from "nodemailer";
import {SETTINGS} from "../../settings";
import {emailExamplesTemplates} from "../templates/email-examples-templates";

export const nodemailerAdapter = {
    sendEmail: async function (email: string, code: string, templateType: 'registration' | 'passwordRecovery') {
        let transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: SETTINGS.EMAIL,
                pass: SETTINGS.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false,
            }
        })
        let htmlContent;
        if (templateType === 'registration') {
            htmlContent = emailExamplesTemplates.registrationEmail(code);
        } else if (templateType === 'passwordRecovery') {
            htmlContent = emailExamplesTemplates.passwordRecoveryEmail(code);
        }
        return await transport.sendMail({
            from: 'Sender<code Sender>',
            to: email,
            subject: "Your code is here",
            html: htmlContent
        })
    },

    // sendRecoveryEmail: async function (email: string, code: string) {
    //     let transport = nodemailer.createTransport({
    //         service: "gmail",
    //         auth: {
    //             user: SETTINGS.EMAIL,
    //             pass: SETTINGS.EMAIL_PASS
    //         },
    //         tls: {
    //             rejectUnauthorized: false,
    //         }
    //     })
    //     return await transport.sendMail({
    //         from: 'Sender<code Sender>',
    //         to: email,
    //         subject: "Your code is here",
    //         html: emailExamplesTemplates.passwordRecoveryEmail(code)
    //     })
    // }
}