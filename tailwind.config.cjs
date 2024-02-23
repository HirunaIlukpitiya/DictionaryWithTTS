{import('tailwindcss').Config}
//const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  darkMode: 'class',
  content: ['./index.html',
  './src/**/*.{vue,js,ts,jsx,tsx}',
  "./node_modules/flowbite/**/*.{js,jsx,ts,tsx,vue}",
  'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}',

],
  theme: {
    extend: {
      fontFamily: {
        'Bar': ['Barbariska'],
      }
    },
  },
  plugins: [require('daisyui'),
            require('flowbite/plugin'),
            require('@tailwindcss/aspect-ratio'),
            require('tailwindcss-animated'),
          ],
}
