import { expect, fixture, html, nextFrame } from '@open-wc/testing';
import { component } from '@pionjs/pion';
import { useIncompleteTemplate } from '../lib/use-incomplete-template';

customElements.define(
	'navigation-button-fixture',
	component(({ index = 0 }) => useIncompleteTemplate(index, 2), {
		observedAttributes: ['index'],
	}),
);

suite('loading slide navigation', () => {
	test('updates the enabled navigation direction as the index changes', async () => {
		const el = await fixture(
			html`<navigation-button-fixture></navigation-button-fixture>`,
		);
		const previous = el.shadowRoot.querySelector(
			'[cosmoz-data-nav-select="-1"]',
		);
		const next = el.shadowRoot.querySelector('[cosmoz-data-nav-select="+1"]');
		let clicks = 0;
		previous.addEventListener('click', () => clicks++);
		previous.click();
		expect(clicks).to.equal(0);
		el.index = 1;
		await nextFrame();
		previous.click();
		expect(clicks).to.equal(1);
		expect(next.hasAttribute('disabled')).to.be.true;
	});
});
