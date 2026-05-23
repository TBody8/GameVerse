const config = {
    locales: ['es', 'en', 'fr', 'pt', 'zh', 'hi', 'ar'],
    sourceLocale: 'es',
    fallbackLocales: {
        default: 'es'
    },
    catalogs: [
        {
            path: '<rootDir>/src/i18n/locales/{locale}/messages',
            include: ['src'],
        },
    ],
    format: 'po',
};
export default config;
