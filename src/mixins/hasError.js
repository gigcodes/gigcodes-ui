import { ref } from "vue";

const errors = ref({});
const checkError = (field) => {
    if (errors.value[field]) {
        return errors.value[field][0];
    } else {
        return false;
    }
};
export default {
    errors,
    checkError,
};
