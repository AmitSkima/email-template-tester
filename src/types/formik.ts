import { FieldInputProps, FieldMetaProps } from "formik";

export type FormiKInputFieldProps<Value> = {
  field: FieldInputProps<Value>;
  meta: FieldMetaProps<Value>;
};
