import { html, useLayoutEffect, useMemo, useRef } from 'haunted';
import { directive } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { slideInRight } from './animations';


export const
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
			{ render, animation = slideInRight } = host,
			slides = useRef([]);

		slides.current = useMemo(() => typeof render !== 'function' ? slides.current : [...slides.current, { render }], [render]);

		useLayoutEffect(async () => {
			if (slides.current.length < 2) {
				return;
			}

			const
				inSlide = slides.current[slides.current.length - 1],
				outSlide = slides.current[slides.current.length - 2],
				inEl = inSlide.el,
				outEl = outSlide.el;

			await animation(inEl, outEl);

			slides.current.splice(slides.current.indexOf(outSlide), 1);
			outEl.remove();
		}, [render]);

		return { slides: slides.current };
	},
	slideRef = directive(slide => part => {slide.el = part?.committer?.element}),
	renderSlide = (slide) => html`<div ceva=${ slideRef(slide) }>${ slide.render() }</div>`,
	renderDataNav = ({ slides }) => [style, repeat(slides, ({ render }) => render, renderSlide)];
