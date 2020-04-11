import { html } from '@open-wc/testing';

export const
	flushRenderQueue = nav => {
		while (nav._indexRenderQueue.length) {
			nav._renderQueue();
		}
	},
	selectedSlide = nav => nav.querySelector('div.selected .slide'),
	isVisible = el => Boolean(el.offsetHeight || el.offsetWidth),
	customStyle = html`
		<custom-style>
			<style include="iron-flex iron-positioning">
				cosmoz-data-nav {
					display: block;
					width: 455px;
					height: 400px;
					position: relative;
				}
			</style>
		</custom-style>
	`;
