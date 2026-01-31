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

export default class AlternateName extends Plugin {
	replacers: Replacer[];
	settings: AlternateNameSettings;

	async onload() {
		this.replacers = [];

		await this.loadSettings();

		this.addSettingTab(new AlternateNameSettingTab(this.app, this));

		const addReplacer = (setting: keyof AlternateNameSettings, replacer: () => Replacer) => {
			if (setting) {
				const instance = replacer();

				this.replacers.push(instance);

				instance.register();
			}
		};

		addReplacer("replaceInCanvases", () => new CanvasReplacer(this));
		addReplacer("replaceInFiles", () => new FilesReplacer(this));
		addReplacer("replaceInGraph", () => new GraphReplacer(this));
		addReplacer("replaceInTabs", () => new TabsReplacer(this));
	}

	onunload() {
		for (const replacer of this.replacers) {
			replacer.unregister();
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData() as Partial<AlternateNameSettings>
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
