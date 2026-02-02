import { Plugin } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	AlternateNameSettings,
	AlternateNameSettingTab
} from "./settings";
import {
	CanvasReplacer,
	FilesReplacer,
	Replacer,
	TabsReplacer
} from 'replacers';

enum Replacers {
	Canvases = "replaceInCanvases",
	Files = "replaceInFiles",
	Tabs = "replaceInTabs"
}

/**
 * {@inheritdoc}
 */
export default class AlternateName extends Plugin {
	/**
	 * The replacers.
	 */
	replacers: Record<Replacers, Replacer> = {
		[Replacers.Canvases]: new CanvasReplacer(this, false),
		[Replacers.Files]: new FilesReplacer(this, false),
		[Replacers.Tabs]: new TabsReplacer(this, false)
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

		this.replacers[Replacers.Canvases].setActivated(this.settings.replaceInCanvases);
		this.replacers[Replacers.Files].setActivated(this.settings.replaceInFiles);
		this.replacers[Replacers.Tabs].setActivated(this.settings.replaceInTabs);
	}

	/**
	 * {@inheritdoc}
	 */
	onunload() {
		Object.values(this.replacers).forEach((replacer) => {
			replacer.setActivated(false);
		});
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
			this.replacers[setting].setActivated(this.settings[setting]);
		});
	}
}
