import * as Yup from 'yup';

export const patientSchema = Yup.object({
  givenName: Yup.string().required('Given name is required'),
  familyName: Yup.string().required('Family name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .required('Phone is required')
    .matches(/^\+?\d[\d\s\-()]{7,18}\d$/, 'Invalid phone number'),
});