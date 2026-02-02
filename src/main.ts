import { Plugin } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	AlternateNameSettings,
	AlternateNameSettingTab
} from "./settings";
import {
	CanvasReplacer,
	FilesReplacer,
	GraphReplacer,
	Replacer,
	TabsReplacer
} from 'replacers';

enum Replacers {
	Canvases = "replaceInCanvases",
	Files = "replaceInFiles",
	Graph = "replaceInGraph",
	Tabs = "replaceInTabs"
}

/**
 * {@inheritdoc}
 */
export default class AlternateName extends Plugin {
	/**
	 * The activated replacers.
	 */
	activated: Record<string, Replacer> = {};

	/**
	 * The list of replacers available for use.
	 */
	available: Record<Replacers, Replacer> = {
		[Replacers.Canvases]: new CanvasReplacer(this),
		[Replacers.Files]: new FilesReplacer(this),
		[Replacers.Graph]: new GraphReplacer(this),
		[Replacers.Tabs]: new TabsReplacer(this)
	};

	/**
	 * The current plugin settings.
	 */
	settings: AlternateNameSettings;

	/**
	 * {@inheritdoc}
	 */
	async onload() {
		await this.loadSettings();

		this.addSettingTab(new AlternateNameSettingTab(this.app, this));

		const addReplacer = (setting: Replacers) => {
			if (this.settings[setting]) {
				this.activated[setting] = this.available[setting];
				this.activated[setting].register();
			}
		};

		addReplacer(Replacers.Canvases);
		addReplacer(Replacers.Files);
		addReplacer(Replacers.Graph);
		addReplacer(Replacers.Tabs);
	}

	/**
	 * {@inheritdoc}
	 */
	onunload() {
		Object.values(this.activated).forEach((replacer) => {
			replacer.unregister();
		});

		this.activated = {};
	}

	/**
	 * {@inheritdoc}
	 */
	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData() as Partial<AlternateNameSettings>
		);
	}

	/**
	 * {@inheritdoc}
	 */
	async saveSettings() {
		await this.saveData(this.settings);

		Object.values(Replacers).forEach((setting) => {
			if (this.settings[setting] && !this.activated[setting]) {
				this.activated[setting] = this.available[setting];
				this.activated[setting].register();
			}

			if (!this.settings[setting] && this.activated[setting]) {
				this.activated[setting].unregister();
				delete this.activated[setting];
			}
		});
	}
}
