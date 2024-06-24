import type { AfterChangeHook } from 'payload/dist/collections/config/types';
import payload from 'payload';
import generateEmailHTML from './generateEmailHTML';

const contactSubmission: AfterChangeHook = async ({ doc, operation }) => {
    console.log("doc", doc)
    if (operation === 'create') {
        try {
            await payload.sendEmail({
                to: 'info@techheavens.com', 
                from: doc.email, 
                subject: `New Contact Submission: ${doc.subject}`,
                html: await generateEmailHTML({
                    headline: ' New contact form submission',
                    content:`
                    <p>Name:${doc.name} </p>
                    <p>Email:${doc.email} </p>
                    <p>Name:${doc.PhoneNumber} </p>
                    <p>Name:${doc.message} </p>
                    `

                })
            });
            console.log(`Email sent successfully for contact submission: ${doc._id}`);
        } catch (error) {
            console.error(`Failed to send email for contact submission: ${doc._id}`, error);
        }
    }
}

export default contactSubmission;
