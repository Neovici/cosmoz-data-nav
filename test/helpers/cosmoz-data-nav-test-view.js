import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';

import { PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag';

import {
	dataNavUserMixin
} from './utils.js';

class CosmozDataNavTestView extends dataNavUserMixin(PolymerElement) {
	static get template() {
		return html`
			<style>
				.text {
					font-size: 300px;
					line-height: 360px;
					text-align: center;
				}
			</style>
			<div class="flex text">[[ item.id ]]</div>
			<div>
				<paper-icon-button slot="actions" disabled$="[[ prevDisabled ]]" icon="chevron-left" cosmoz-data-nav-select="-1"></paper-icon-button>
				<span>[[ index ]]</span>
				<paper-icon-button slot="actions" disabled$="[[ nextDisabled ]]" icon="chevron-right" cosmoz-data-nav-select="+1"></paper-icon-button>
			</div>
		`;
	}
}
customElements.define('cosmoz-data-nav-test-view', CosmozDataNavTestView);

export {
	CosmozDataNavTestView
};
