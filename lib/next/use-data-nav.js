import { html, useLayoutEffect, useMemo, useRef, useState } from 'haunted';
import { repeat } from 'lit-html/directives/repeat';
import { slideInRight } from './animations';

let gid = 0;

export const
	el = (host, { id }) => host.shadowRoot.querySelector(`[data-id="${ id }"]`),
	style = html`<style>
		:host {
			display: block;
			position: relative;
			overflow: hidden;
		}

		:host > div {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
		}
	</style>`,
	useDataNav = host => {
		const
			[, forceRender] = useState(),
			{ render, animation = slideInRight } = host,
			slides = useRef([]);

		slides.current = useMemo(() => typeof render !== 'function' ? slides.current : [...slides.current, { id: gid++, render }], [render]);

		useLayoutEffect(async () => {
			if (slides.current.length < 2) {
				return;
			}

			const
				inSlide = slides.current[slides.current.length - 1],
				outSlide = slides.current[slides.current.length - 2],
				inEl = el(host, inSlide),
				outEl = el(host, outSlide);

			await animation(inEl, outEl);

			slides.current.splice(slides.current.indexOf(outSlide), 1);
			forceRender();
		}, [render]);

		return { slides: slides.current };
	},
	renderSlide = ({ id, render }) => html`<div data-id=${ id }>${ render() }</div>`,
	renderDataNav = ({ slides }) => [style, repeat(slides, ({ id }) => id, renderSlide)];
