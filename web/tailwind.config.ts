import { Config } from 'tailwindcss'

const config: Config = {
	content: ['./index.html', './src/**/*.{html,js,jsx,tx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#3490dc',
				danger: '#e3342f',
				secondary: '#ffed4a',
				disabled: '#a0aec0',
				sucess: '#38a169',
				pageBg: '#e5e7eb',
				labelColor: '#111827',

				linkVisited: '#9333ea',
				linkUnvisited: '#2563eb',
				linkActive: '#db2777',
			},
		},
	},
	plugins: [],
}

export default config
