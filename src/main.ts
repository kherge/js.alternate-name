import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, AlternateNameSettings, AlternateNameSettingTab } from "./settings";

export default class AlternateName extends Plugin {
	settings: AlternateNameSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new AlternateNameSettingTab(this.app, this));
	}

	onunload() {
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
