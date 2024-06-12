import { Config } from 'tailwindcss'

const config: Config = {
	content: ['./index.html', './src/**/*.{html,js,jsx,tx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#8b5cf6', // violet-500
				primaryLight: '#a78bfa', // violet-400

				danger: '#f43f5e', // rose-500
				dangerLight: '#fb7185', // rose-400

				secondary: '#06b6d4', // cyan-500
				secondaryLight: '#22d3ee', // cyan-400

				disabled: '#6b7280', // gray-500
				disabledLight: '#9ca3af', // gray-400

				success: '#22c55e', // green-500
				successLight: '#4ade80', // green-400

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
