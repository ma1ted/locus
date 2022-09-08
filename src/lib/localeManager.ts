export default class LocaleManager {
	public defaultLocaleCode: string;
	private currentLocaleCode: string;
	private localeList: any;

	/**
	 * Create a new localiser object.
	 * @param {string} defaultLocaleCode - The default locale code.
	 * @param {object} defaultLocale - The default locale.
	 */
	constructor(defaultLocaleCode: string, defaultLocale: object) {
		this.defaultLocaleCode = this.currentLocaleCode = defaultLocaleCode;
		this.localeList[defaultLocaleCode] = defaultLocale;
	}

	/**
	 * Change the currently active locale.
	 * @param {string} newLocaleCode - The name of the registered locale to set as active.
	 */
	public set(newLocaleCode: string) {
		if (!Object.keys(this.localeList).includes(newLocaleCode))
			throw new Error(`Locale ${newLocaleCode} has not been loaded.`);

		this.currentLocaleCode = newLocaleCode;
	}

	/**
	 * Gets an array of the currently loaded locale names.
	 * @returns {string[]} An array of strings corresponding to the locale names specified when the they were registered.
	 */
	public locales(): string[] {
		return Object.keys(this.localeList);
	}

	/**
	 * Add a locale object to the localiser
	 * @param {string} code - The two-letter locale code to be used when changing the current locale to this.
	 * @param {object} locale - An object
	 */
	public register(code: string, locale: object) {
		if (Object.keys(this.localeList).includes(code))
			console.warn(`Locale ${code} already exists, and was overwritten by this call to register.`);
		this.localeList[code] = locale;
	}

	public _(string: string): string {
		/* We have the value in the default language,
        but need the value in the current locale language.
		Search the default locale values for the supplied string.
        Get the default locale key corresponding to this string.
        Look up the value in the current locale with this key. */
		const key = Object.keys(this.localeList[this.defaultLocaleCode]).find(
			(key) => this.localeList[this.defaultLocaleCode][key] === string
		);
		if (!key)
			throw new Error(`Value ${string} does not exist in the ${this.currentLocaleCode} locale.`);
		return this.localeList[this.currentLocaleCode][key];
	}
}

// Usage

const en = {
	hello: "Hello World!",
	subtitle: "This is a subtitle!"
};

const es = {
	hello: "Hola Mundo!",
	subtitle: "¡Este es un subtítulo!"
};

const localiser = new LocaleManager("en", en);

localiser.register("en", en);
localiser.register("es", es);

console.log(localiser._("Hello World!")); //=> Hello World!

localiser.set("es");

console.log(localiser._("Hello World!")); //=> Hola Mundo!
