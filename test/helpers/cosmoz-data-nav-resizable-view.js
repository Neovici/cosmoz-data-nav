import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior';

import { CosmozDataNavTestView } from './cosmoz-data-nav-test-view.js';

class CosmozDataNavResizableView extends mixinBehaviors([IronResizableBehavior], CosmozDataNavTestView) {
	ready() {
		this.addEventListener('iron-resize', this._onIronResize);
		super.ready();
	}
	_onIronResize() {
		// eslint-disable-next-line no-console
		console.log('resize called on resizable view.');
	}
}
customElements.define('cosmoz-data-nav-resizable-view', CosmozDataNavResizableView);
