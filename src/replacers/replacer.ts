import AlternateName from "main";
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
     * The plugin.
     */
    readonly plugin: AlternateName;

    /**
     * Initializes the replacer.
     *
     * @param plugin The plugin instance.
     */
    constructor(plugin: AlternateName) {
        this.plugin = plugin;
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
