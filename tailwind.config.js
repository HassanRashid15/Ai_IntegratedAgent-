/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			shimmer: {
  				'0%': { transform: 'translateX(-100%)' },
  				'100%': { transform: 'translateX(100%)' }
  			},
  			float: {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-20px)' }
  			},
  			'glow-pulse': {
  				'0%, 100%': { 
  					opacity: '1',
  					boxShadow: '0 0 20px rgba(var(--primary), 0.5)'
  				},
  				'50%': { 
  					opacity: '0.8',
  					boxShadow: '0 0 40px rgba(var(--primary), 0.8)'
  				}
  			},
  			'gradient-shift': {
  				'0%, 100%': { backgroundPosition: '0% 50%' },
  				'50%': { backgroundPosition: '100% 50%' }
  			},
  			ripple: {
  				'0%': { 
  					transform: 'scale(0)',
  					opacity: '1'
  				},
  				'100%': { 
  					transform: 'scale(4)',
  					opacity: '0'
  				}
  			},
  			'glitch-low': {
  				'0%, 100%': { 
  					transform: 'translate(0)',
  					filter: 'hue-rotate(0deg)'
  				},
  				'20%': { 
  					transform: 'translate(-1px, 1px)',
  					filter: 'hue-rotate(90deg)'
  				},
  				'40%': { 
  					transform: 'translate(-1px, -1px)',
  					filter: 'hue-rotate(180deg)'
  				},
  				'60%': { 
  					transform: 'translate(1px, 1px)',
  					filter: 'hue-rotate(270deg)'
  				},
  				'80%': { 
  					transform: 'translate(1px, -1px)',
  					filter: 'hue-rotate(360deg)'
  				}
  			},
  			'glitch-medium': {
  				'0%, 100%': { 
  					transform: 'translate(0)',
  					filter: 'hue-rotate(0deg)'
  				},
  				'20%': { 
  					transform: 'translate(-2px, 2px)',
  					filter: 'hue-rotate(90deg)'
  				},
  				'40%': { 
  					transform: 'translate(-2px, -2px)',
  					filter: 'hue-rotate(180deg)'
  				},
  				'60%': { 
  					transform: 'translate(2px, 2px)',
  					filter: 'hue-rotate(270deg)'
  				},
  				'80%': { 
  					transform: 'translate(2px, -2px)',
  					filter: 'hue-rotate(360deg)'
  				}
  			},
  			'glitch-high': {
  				'0%, 100%': { 
  					transform: 'translate(0)',
  					filter: 'hue-rotate(0deg)'
  				},
  				'20%': { 
  					transform: 'translate(-4px, 4px)',
  					filter: 'hue-rotate(90deg)'
  				},
  				'40%': { 
  					transform: 'translate(-4px, -4px)',
  					filter: 'hue-rotate(180deg)'
  				},
  				'60%': { 
  					transform: 'translate(4px, 4px)',
  					filter: 'hue-rotate(270deg)'
  				},
  				'80%': { 
  					transform: 'translate(4px, -4px)',
  					filter: 'hue-rotate(360deg)'
  				}
  			},
  			'splitTextIn': {
  				'0%': { 
  					transform: 'translateY(-20px) rotateX(90deg)',
  					opacity: '0'
  				},
  				'50%': { 
  					transform: 'translateY(-10px) rotateX(45deg)',
  					opacity: '0.5'
  				},
  				'100%': { 
  					transform: 'translateY(0) rotateX(0deg)',
  					opacity: '1'
  				}
  			},
  			'splitTextOut': {
  				'0%': { 
  					transform: 'translateY(0) rotateX(0deg)',
  					opacity: '1'
  				},
  				'100%': { 
  					transform: 'translateY(20px) rotateX(-90deg)',
  					opacity: '0'
  				}
  			}
  		},
  		animation: {
  			shimmer: 'shimmer 2s infinite',
  			float: 'float 3s ease-in-out infinite',
  			'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
  			'gradient-shift': 'gradient-shift 3s ease infinite',
  			ripple: 'ripple 0.6s ease-out',
  			'glitch-low': 'glitch-low 0.3s ease-in-out',
  			'glitch-medium': 'glitch-medium 0.3s ease-in-out',
  			'glitch-high': 'glitch-high 0.3s ease-in-out',
  			'splitTextIn': 'splitTextIn 0.6s ease-out',
  			'splitTextOut': 'splitTextOut 0.4s ease-in'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
