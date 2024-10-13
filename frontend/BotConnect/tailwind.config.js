/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		keyframes: {
  			'fade-in-down': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(-10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'fade-in-up': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			}
  		},
  		animation: {
  			'fade-in-down': 'fade-in-down 0.5s ease-out',
  			'fade-in-up': 'fade-in-up 0.5s ease-out'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  variants: {
    extend: {
      scale: ['hover', 'focus'],
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("tailwindcss-animate")],
}

