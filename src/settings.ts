import {App, PluginSettingTab, Setting} from "obsidian";
import AlternateName from "./main";

export interface AlternateNameSettings {
	property: string;
	replaceInFiles: boolean;
	replaceInTabs: boolean;
}

export const DEFAULT_SETTINGS: AlternateNameSettings = {
	property: 'aliases.0',
	replaceInFiles: true,
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
				.setPlaceholder('A valid delve() path')
				.setValue(this.plugin.settings.property)
				.onChange(async (value) => {
					this.plugin.settings.property = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Replace in files?')
			.setDesc('Whether to replace names in the file browser.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.replaceInFiles)
				.onChange(async (value) => {
					this.plugin.settings.replaceInFiles = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Replace in tabs?')
			.setDesc('Whether to replace names in tab views.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.replaceInTabs)
				.onChange(async (value) => {
					this.plugin.settings.replaceInTabs = value;
					await this.plugin.saveSettings();
				}));
	}
}
