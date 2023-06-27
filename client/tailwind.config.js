const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      translate: {
      'full': '100%',
      }
    },
    variants: {
      translate: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
    },
  },
  plugins: [],
});