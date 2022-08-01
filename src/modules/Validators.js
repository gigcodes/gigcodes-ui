export default function useValidators() {
    const isEmpty = (fieldName, fieldValue) => {
        return !fieldValue ? "The " + fieldName + " field is required" : "";
    };
    const minLength = (fieldName, fieldValue, min) => {
        return fieldValue.length < min
            ? `The ${fieldName} field must be atleast ${min} characters long`
            : "";
    };
    return { isEmpty, minLength };
}
