import * as yup from "yup";

export const signUpSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 6 characters")
    .required("Password is required")
    .max(24, "Password must be less than 24 characters")
    .matches(/[a-zA-Z]/, "Contain at least one letter.")
    .matches(/[0-9]/, "Contain at least one number.")
    .matches(/[^a-zA-Z0-9]/, "Contain at least one special character.")
    .trim(),

  confirmPassword: yup
    .string()
    .min(8, "Password must be at least 6 characters")
    .required("Password is required")
    .max(24, "Password must be less than 24 characters")
    .matches(/[a-zA-Z]/, "Contain at least one letter.")
    .matches(/[0-9]/, "Contain at least one number.")
    .matches(/[^a-zA-Z0-9]/, "Contain at least one special character.")
    .oneOf([yup.ref("password")], "Passwords must match")
    .trim(),
  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  userRole: yup.string().required("Role is required"),
  companyProfile: yup.object().shape({
    companyName: yup.string().notRequired(),
    companyAddress: yup.string().notRequired(),
  }),
});

export const signInSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 6 characters")
    .required("Password is required")
    .max(24, "Password must be less than 24 characters")
    .matches(/[a-zA-Z]/, "Contain at least one letter.")
    .matches(/[0-9]/, "Contain at least one number.")
    .matches(/[^a-zA-Z0-9]/, "Contain at least one special character.")
    .trim(),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export const resetPasswordSchema = yup.object().shape({
  code: yup.string().required("Code is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 6 characters")
    .required("Password is required")
    .max(24, "Password must be less than 24 characters")
    .matches(/[a-zA-Z]/, "Contain at least one letter.")
    .matches(/[0-9]/, "Contain at least one number.")
    .matches(/[^a-zA-Z0-9]/, "Contain at least one special character.")
    .trim(),

  confirmPassword: yup
    .string()
    .min(8, "Password must be at least 6 characters")
    .required("Password is required")
    .max(24, "Password must be less than 24 characters")
    .matches(/[a-zA-Z]/, "Contain at least one letter.")
    .matches(/[0-9]/, "Contain at least one number.")
    .matches(/[^a-zA-Z0-9]/, "Contain at least one special character.")
    .oneOf([yup.ref("password")], "Passwords must match")
    .trim(),
});

export const updateProfileSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 6 characters")
    .notRequired()
    .max(24, "Password must be less than 24 characters")
    .matches(/[a-zA-Z]/, "Contain at least one letter.")
    .matches(/[0-9]/, "Contain at least one number.")
    .matches(/[^a-zA-Z0-9]/, "Contain at least one special character.")
    .trim(),
});

export const createUsersSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 6 characters")
    .required("Password is required")
    .max(24, "Password must be less than 24 characters")
    .matches(/[a-zA-Z]/, "Contain at least one letter.")
    .matches(/[0-9]/, "Contain at least one number.")
    .matches(/[^a-zA-Z0-9]/, "Contain at least one special character.")
    .trim(),
  role: yup.string().required("Role is required"),
});

export const completeRegisterSchema = yup.object().shape({
  vatNumber: yup.string().required("VAT number is required"),
  eoriNumber: yup.string().required("EORI number is required"),
  kboNumber: yup.string().required("KBO number is required"),
  kboFile: yup.string().required("KBO file is required"),
});
