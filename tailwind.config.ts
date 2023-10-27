import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'color-change': {
          '0%': { borderColor: '#19dcea' },
          '25%':{ borderColor: '#b22cff'},
          '50%': { borderColor: '#ea2222' },
          '75%': { borderColor: '#f5be10' },
          '100%': { borderColor: '#3bd80d' },
        },
      
      },
      animation: {
        'colorChange': 'color-change 5s linear infinite alternate both',        
      },
    },
  },
  plugins: [],
}
export default config
