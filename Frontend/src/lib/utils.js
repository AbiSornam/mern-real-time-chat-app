export const capitalize = (str = "") => String(str).charAt(0).toUpperCase() + String(str).slice(1);

// keep the old misspelled export for compatibility with existing imports
export const capitialize = capitalize;