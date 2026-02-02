import { TFile } from "obsidian";
import { Replacer } from "./replacer";

/**
 * Replaces note names in file browser.
 */
export class FilesReplacer extends Replacer {

    /**
     * Finds a file explorer item by its path.
     *
     * @param path The file path.
     *
     * @returns The file explorer item element, or null if not found.
     */
    findItemByPath(path: string): HTMLElement | null {
        return document.querySelector(
            `div[data-type="file-explorer"] .tree-item.nav-file > .tree-item-self[data-path="${path}"]`
        );
    }

    /**
     * Finds all file explorer items.
     *
     * @returns The file explorer items.
     */
    findItems(): HTMLElement[] {
        return Array.from(document.querySelectorAll(
            'div[data-type="file-explorer"] .tree-item.nav-file > .tree-item-self'
        ));
    }

    /**
     * Reacts to layout changes in the workspace.
     */
    onLayoutChange() {
        this.replaceNames(
            this.findItems(),
            true
        );
    }

    /**
     * Reacts to modified metadata of a file.
     *
     * @param file The modified file.
     */
    onModifiedMetadata(file: TFile) {
        const item = this.findItemByPath(file.path);

        if (item) {
            this.replaceName(item, this.getAlternateName(file) || file.basename);
        }
    }

    /**
     * Replaces all names in the file explorer.
     */
    replaceAllNames() {
        this.replaceNames(this.findItems(), true);
    }

    /**
     * Replaces the name of a file explorer item.
     *
     * @param item The file explorer item.
     * @param name The new name.
     */
    replaceName(item: HTMLElement, name: string): void {
        item
            .querySelector('.tree-item-inner.nav-file-title-content')!
            .textContent = name;
    }

    /**
     * Replaces names in file explorer items.
     *
     * @param items The file explorer items.
     * @param alt Use alternate names?
     */
    replaceNames(items: HTMLElement[], alt: boolean): void {
        items.forEach(item => {
            const file = this.getFile(item.dataset.path!)!;

            this.replaceName(
                item,
                alt ? (this.getAlternateName(file) || file.basename)
                    : file.basename
            );
        });
    }

    /**
     * {@iheritdoc}
     */
    register(): void {
        setTimeout(() => this.replaceAllNames(), 1000);

        this.plugin.registerEvent(
            this.plugin.app.metadataCache.on(
                "changed",
                (file) => this.ifActivated(() => this.onModifiedMetadata(file))
            )
        );

        this.plugin.registerEvent(
            this.plugin.app.workspace.on(
                "layout-change",
                () => this.ifActivated(() => this.replaceAllNames())
            )
        );
    }

    /**
     * {@iheritdoc}
     */
    unregister(): void {
        this.replaceNames(this.findItems(), false);
    }
}
