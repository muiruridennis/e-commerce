import { CollectionConfig } from 'payload/types';
import contactSubmission from './hooks/sendContactEmail';

const FormSubmissions: CollectionConfig = {
    slug: 'form-submissions',
    access: {
        read: () => true
    },
    hooks: {
        beforeChange: [],
        afterChange: [contactSubmission],
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'phoneNumber',
            type: 'text',
        },
        {
            name: 'subject',
            type: 'text',
            required: true,
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
        },
    ],
}
export default FormSubmissions