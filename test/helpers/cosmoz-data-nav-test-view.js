import '@polymer/paper-icon-button/paper-icon-button';

import { PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag';

import { dataNavUserMixin } from './utils.js';

class CosmozDataNavTestView extends dataNavUserMixin(PolymerElement) {
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
				<paper-icon-button
					slot="actions"
					disabled$="[[ prevDisabled ]]"
					icon="chevron-left"
					cosmoz-data-nav-select="-1"
				></paper-icon-button>
				<span>[[ index ]]</span>
				<paper-icon-button
					slot="actions"
					disabled$="[[ nextDisabled ]]"
					icon="chevron-right"
					cosmoz-data-nav-select="+1"
				></paper-icon-button>
			</div>
		`;
	}
}
customElements.define('cosmoz-data-nav-test-view', CosmozDataNavTestView);

export { CosmozDataNavTestView };
