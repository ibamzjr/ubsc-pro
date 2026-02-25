import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["BDO Grotesk", ...defaultTheme.fontFamily.sans],
                monument: ['"Monument Extended"', "sans-serif"],
                clash: ['"Clash Display"', "sans-serif"],
                bdo: ['"BDO Grotesk"', "sans-serif"],
            },
            colors: {
                navy: {
                    800: "#0E2444",
                    900: "#0B1E3B",
                    950: "#071530",
                },
                "accent-red": "#D50000",
            },
            maxWidth: {
                "8xl": "88rem", // 1408px
            },
        },
    },

    plugins: [forms],
};
