//used as global state for theming (instad of usestate or context api)

import {create} from 'zustand';
export const useThemeStore = create((set) => ({
    // Read previously saved theme. Accept legacy key 'streamify-theme' if present.
    theme: localStorage.getItem("theme") || localStorage.getItem("streamify-theme") || "coffee",
    setTheme: (theme) => {
        // Persist to a single canonical key so reads/writes are consistent
        localStorage.setItem("theme", theme);
        set({ theme });
    },
}));