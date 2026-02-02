import { MarkdownView, TFile, WorkspaceLeaf } from "obsidian";
import { Replacer } from "./replacer";

/**
 * Represents the internal state of a leaf.
 */
interface InternalLeafState {

    /**
     * The tab header inner title element.
     */
    tabHeaderInnerTitleEl?: HTMLElement;
}

/**
 * Replaces note names in tabs.
 */
export class TabsReplacer extends Replacer {

    /**
     * Finds all Markdown leaves in the workspace.
     *
     * @return An array of workspace leaves.
     */
    findAllMarkdownLeaves(): WorkspaceLeaf[] {
        return this
            .plugin
            .app
            .workspace
            .getLeavesOfType("markdown");
    }

    /**
     * Finds a leaf for a given file.
     *
     * @param file The note file.
     *
     * @return The workspace leaf.
     */
    findLeafForFile(file: TFile): WorkspaceLeaf | undefined {
        return this
            .plugin
            .app
            .workspace
            .getLeavesOfType("markdown")
            .find((leaf) => {
                const view = leaf.view as MarkdownView;

                return view.file?.path === file.path;
            });
    }

    /**
     * Gets the file for a given Markdown view.
     *
     * @param view The Markdown view.
     *
     * @returns The note file, or null if not found.
     */
    getFileForView(view: MarkdownView): TFile | null {
        return view.file || this.getFile(view.getState().file as string);
    }

    /**
     * Reacts to layout changes in the workspace.
     *
     * When the event is triggered, each leaf in the workspace is iterated to find ones with
     * markdown views. For each markdown leaf, it attempts to keep the title of the tab updated
     * with the alternate name of the corresponding file.
     */
    onLayoutChange(): void {
        this
            .findAllMarkdownLeaves()
            .forEach((leaf) => {
                const view = leaf.view as MarkdownView;
                const file = this.getFileForView(view);

                if (!file) {
                    return;
                }

                const name = this.getAlternateName(file) || file.basename;

                this.replaceTabTitle(leaf, name);
            });
    }

    /**
     * Reacts to modified file metadata.
     *
     * When the event is triggered, it checks if the modified file is a markdown file and then
     * attempts to find the corresponding workspace leaf. If a leaf is found, it retrieves the
     * alternate name for the file and updates the tab title.
     *
     * @param file The modified file.
     */
    onModifiedMetadata(file: TFile): void {
        if (file.extension !== "md") {
            return;
        }

        const leaf = this.findLeafForFile(file);

        if (!leaf) {
            return;
        }

        const name = this.getAlternateName(file) || file.basename;

        this.replaceTabTitle(leaf, name);
    }

    /**
     * Replaces the titles in all tabs for Markdown leaves.
     *
     * @param alt Use the alternate name?
     */
    replaceAllTabTitles(alt: boolean) {
        this
            .findAllMarkdownLeaves()
            .forEach((leaf) => {
                const view = leaf.view as MarkdownView;
                const file = this.getFileForView(view);

                if (!file) {
                    return;
                }

                const name = alt
                    ? (this.getAlternateName(file) || file.basename)
                    : file.basename;

                this.replaceTabTitle(leaf, name);
            });
    }

    /**
     * Replaces the title in a tab for a leaf.
     *
     * @param leaf The workspace leaf.
     * @param title The new title.
     */
    replaceTabTitle(leaf: WorkspaceLeaf, title: string) {
        const tab = (leaf as InternalLeafState).tabHeaderInnerTitleEl;

        if (!tab) {
            console.debug(`no tab element found`);
            return;
        }

        tab.innerText = title;
    }

    /**
     * {@inheritdoc}
     */
    register(): void {
        this.replaceAllTabTitles(true);

        this.plugin.registerEvent(
            this.plugin.app.metadataCache.on(
                "changed",
                (file) => this.onModifiedMetadata(file)
            )
        );

        this.plugin.registerEvent(
            this.plugin.app.workspace.on(
                "layout-change",
                () => this.onLayoutChange()
            )
        );
    }

    /**
     * {@inheritdoc}
     */
    unregister(): void {
        this.replaceAllTabTitles(false);
    }
}
