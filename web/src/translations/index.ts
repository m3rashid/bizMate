import english from './english.json';
import hindi from './hindi.json';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next.use(initReactI18next).init({
	lng: 'hi',
	resources: {
		en: { translation: english },
		hi: { translation: hindi },
	},
});

export default i18next;
