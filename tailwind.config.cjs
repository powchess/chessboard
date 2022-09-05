/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				center: '1fr auto 1fr'
			}
		}
	},
	plugins: []
};
