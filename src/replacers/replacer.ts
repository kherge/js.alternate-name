import { App } from "obsidian";
import { AlternateNameSettings } from "settings";

/**
 * An abstract implementation of a replacer.
 *
 * A replacer class is responsible for replacing the name of a note in a
 * specific area of the Obsidian interface. Each implementation must also
 * support the ability to register and unregister itself.
 */
export abstract class Replacer {

    /**
     * The Obsidian app.
     */
    readonly app: App;

    /**
     * The plugin settings.
     */
    readonly settings: AlternateNameSettings;

    /**
     * Accepts the Obsidian app and settings.
     *
     * @param app The Obsidian app.
     * @param settings The plugin settings.
     */
    constructor(app: App, settings: AlternateNameSettings) {
        this.app = app;
        this.settings = settings;
    }

    /**
     * Registers the replacer with Obsidian.
     */
    abstract register(): void;

    /**
     * Unregisters the replacer from Obsidian.
     */
    abstract unregister(): void;
}
