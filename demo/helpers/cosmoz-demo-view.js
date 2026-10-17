import '@neovici/cosmoz-button';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons.js';

import { html } from '@polymer/polymer/lib/utils/html-tag';
import { PolymerElement } from '@polymer/polymer/polymer-element';

import { dataNavUserMixin } from '../../test/helpers/utils.js';

class CosmozDemoView extends dataNavUserMixin(PolymerElement) {
	static get template() {
		return html`
			<style>
				.text {
					flex: 1;
					flex-basis: 0.000000001px;
					font-size: 300px;
					line-height: 360px;
					text-align: center;
				}
			</style>
			<div class="text">[[ item.id ]]</div>
			<div>
				<cosmoz-button
					variant="tertiary"
					icon-only
					aria-label="Previous item"
					slot="actions"
					disabled$="[[ prevDisabled ]]"
					cosmoz-data-nav-select="-1"
					><iron-icon icon="chevron-left"></iron-icon
				></cosmoz-button>
				<span>[[ index ]]</span>
				<cosmoz-button
					variant="tertiary"
					icon-only
					aria-label="Next item"
					slot="actions"
					disabled$="[[ nextDisabled ]]"
					cosmoz-data-nav-select="+1"
					><iron-icon icon="chevron-right"></iron-icon
				></cosmoz-button>
				<cosmoz-button
					variant="tertiary"
					icon-only
					aria-label="Replace"
					on-click="onReplace"
					><iron-icon icon="refresh"></iron-icon
				></cosmoz-button>
			</div>
		`;
	}
	onReplace() {
		this.item = { id: '--' };
	}
}
customElements.define('cosmoz-demo-view', CosmozDemoView);
