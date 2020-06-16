import { BaseScheduler } from 'haunted';
import { animationFrame } from '@polymer/polymer/lib/utils/async';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce';

class Scheduler extends BaseScheduler {
	constructor(renderer, host, commitCallback) {
		super(renderer, host);
		this._commit = commitCallback;
	}

	commit(result) {
		this._commit(result);
	}
}

/**
 * Creates a mixin that mixes a haunted hook with a polymer component.
 *
 * @param {String} outputPath The property where the result of the hook will be stored
 * @param {Function} hook A haunted hook
 * @returns {Function} The mixin
 */
export const hauntedPolymer = (outputPath, hook) => base => class extends base {
	constructor() {
		super();
		this._scheduler = new Scheduler( // whenever the state is updated
			() => hook(this), // run the hook with the element as input
			this, // using the element as state host
			result => this.set(outputPath, result) // and update the output path with the results
		);
	}

	connectedCallback() {
		super.connectedCallback();
		this._scheduler.update();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._scheduler.teardown();
	}

	_propertiesChanged(currentProps, changedProps, oldProps) {
		super._propertiesChanged(currentProps, changedProps, oldProps);

		// skip haunted state update if the only thing that has changed is the hook output path
		if (Object.keys(changedProps).length === 1 && changedProps[outputPath] != null) {
			return;
		}

		// trigger a haunted update loop
		// do it in the next animation frame, so the current loop finishes processing first
		this._debouncer = Debouncer.debounce(this._debouncer, animationFrame, () => this._scheduler.update());
	}
};
