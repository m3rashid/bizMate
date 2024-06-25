import { Config } from 'tailwindcss'

const config: Config = {
	content: ['./index.html', './src/**/*.{html,js,jsx,tx,tsx}'],
	theme: {
		extend: {
			borderRadius: {
				sm: '2px',
				md: '4px',
				lg: '6px',
				xl: '8px',
			},
			colors: {
				primary: '#a78bfa', // violet-400
				primaryLight: '#ddd6fe', // violet-200

				danger: '#fb7185', // rose-400
				dangerLight: '#fecdd3', // rose-200

				secondary: '#22d3ee', // cyan-400
				secondaryLight: '#a5f3fc', // cyan-200

				disabled: '#9ca3af', // gray-400
				disabledLight: '#e5e7eb', // gray-200

				success: '#4ade80', // green-400
				successLight: '#bbf7d0', // green-200

				pageBg: '#e5e7eb', // gray-200
				borderColor: '#d1d5db', // gray-300

				textColor: '#111827', // gray-900

				linkVisited: '#9333ea', // purple-600
				linkUnvisited: '#2563eb', // blue-600
				linkActive: '#db2777', // pink-600

				skeletonLight: '#e5e7eb', // gray-200
				skeletonDark: '#d1d5db', // gray-300
			},
		},
	},
	plugins: [],
}

export default config
