import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import '@polymer/iron-icons/iron-icons.js';

import { PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag';

import {
	dataNavUserMixin
} from '../../test/helpers/utils.js';

class CosmozDemoView extends dataNavUserMixin(PolymerElement) {
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
				<paper-icon-button icon="refresh" on-tap="onReplace">Replace</paper-icon-button>
			</div>
		`;
	}
	onReplace() {
		this.item = { id: '--' };
	}
}
customElements.define('cosmoz-demo-view', CosmozDemoView);
