import AlternateName from "main";
import { TFile } from "obsidian";
import delve from "dlv";

/**
 * An abstract implementation of a replacer.
 *
 * A replacer class is responsible for replacing the name of a note in a
 * specific area of the Obsidian interface. Each implementation must also
 * support the ability to register and unregister itself.
 */
export abstract class Replacer {

    /**
     * The current activation state.
     */
    private activated: boolean;

    /**
     * The plugin.
     */
    readonly plugin: AlternateName;

    /**
     * Initializes the replacer.
     *
     * @param plugin    The plugin instance.
     * @param activated The initial activation state.
     */
    constructor(plugin: AlternateName, activated: boolean) {
        this.activated = activated;
        this.plugin = plugin;
    }

    /**
     * Returns the alternate name for a note.
     *
     * @param file The note file.
     *
     * @return The alternate name, or null if none exists.
     */
    getAlternateName(file: TFile): string | undefined {
        const metadata = this.plugin.app.metadataCache.getFileCache(file);

        if (metadata?.frontmatter) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            return delve(
                metadata.frontmatter,
                this.plugin.settings.property
            ) as string | undefined;
        }

        return undefined;
    }

    /**
     * Retrieves a file by its path.
     *
     * @param path The file path.
     *
     * @return The note file, or null if not found.
     */
    getFile(path: string): TFile | null {
        return this.plugin.app.vault.getAbstractFileByPath(path) as TFile | null;
    }

    /**
     * Executes a function if the replacer is activated.
     *
     * @param fn The function to execute.
     */
    ifActivated(fn: () => void) {
        if (this.activated) {
            fn();
        }
    }

    /**
     * Checks if the replacer is activated.
     *
     * @return True if activated, false otherwise.
     */
    isActivated(): boolean {
        return this.activated;
    }

    /**
     * Sets the activation state of the replacer.
     *
     * @param activated The new activation state.
     */
    setActivated(activated: boolean): void {
        this.activated = activated;

        if (this.activated) {
            this.register();
        } else {
            this.unregister();
        }
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
