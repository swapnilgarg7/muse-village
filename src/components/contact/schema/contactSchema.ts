import * as Yup from "yup";

export const contactSchema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().required("Message is required"),
});
