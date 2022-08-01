import getSlug from "speakingurl";

const slugify = (text, glue) => {
    return getSlug(text, {
        separator: glue || "-",
        custom: { "'": "" },
    });
};

export default slugify;
