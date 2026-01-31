import {App, PluginSettingTab, Setting} from "obsidian";
import AlternateName from "./main";

export interface AlternateNameSettings {
	property: string;
}

export const DEFAULT_SETTINGS: AlternateNameSettings = {
	property: 'aliases[0]'
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
	}
}
