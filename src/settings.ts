import {App, PluginSettingTab, Setting} from "obsidian";
import AlternateName from "./main";

export interface AlternateNameSettings {
	property: string;
	replaceInCanvases: boolean;
	replaceInFiles: boolean;
	replaceInGraph: boolean;
	replaceInTabs: boolean;
}

export const DEFAULT_SETTINGS: AlternateNameSettings = {
	property: 'aliases[0]',
	replaceInCanvases: true,
	replaceInFiles: true,
	replaceInGraph: true,
	replaceInTabs: true,
}

export class AlternateNameSettingTab extends PluginSettingTab {
	plugin: AlternateName;

	constructor(app: App, plugin: AlternateName) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Property')
			.setDesc('The frontmatter property to use for alternate names.')
			.addText(text => text
				.setPlaceholder('A valid Lodash get() path')
				.setValue(this.plugin.settings.property)
				.onChange(async (value) => {
					this.plugin.settings.property = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Replace in Canvases')
			.setDesc('Whether to replace names in canvas views.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.replaceInCanvases)
				.onChange(async (value) => {
					this.plugin.settings.replaceInCanvases = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Replace in Files')
			.setDesc('Whether to replace names in the file browser.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.replaceInFiles)
				.onChange(async (value) => {
					this.plugin.settings.replaceInFiles = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Replace in Graph')
			.setDesc('Whether to replace names in graph views.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.replaceInGraph)
				.onChange(async (value) => {
					this.plugin.settings.replaceInGraph = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Replace in Tabs')
			.setDesc('Whether to replace names in tab views.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.replaceInTabs)
				.onChange(async (value) => {
					this.plugin.settings.replaceInTabs = value;
					await this.plugin.saveSettings();
				}));
	}
}
