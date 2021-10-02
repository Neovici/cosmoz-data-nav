export const
	slideInRight = (inEl, outEl) => {
		const
			inAnimation = inEl.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(0%)' }], { duration: 250, fill: 'both', easing: 'ease-in-out' }),
			outAnimation = outEl.animate([{}, { transform: 'translateX(-100%)' }], { duration: 250, fill: 'both', easing: 'ease-in-out' });

		return Promise.all([inAnimation.finished, outAnimation.finished]);
	},
	slideInLeft = (inEl, outEl) => {
		const
			inAnimation = inEl.animate([{ transform: 'translateX(-100%)' }, { transform: 'translateX(0%)' }], { duration: 250, fill: 'both', easing: 'ease-in-out' }),
			outAnimation = outEl.animate([{}, { transform: 'translateX(100%)' }], { duration: 250, fill: 'both', easing: 'ease-in-out' });

		return Promise.all([inAnimation.finished, outAnimation.finished]);
	},
	dropTop = (inEl, outEl) => {
		const
			inAnimation = inEl.animate(
				[{ transform: 'translateY(-100%) scale(1.5)' }, { transform: 'translateY(0%) scale(1)' }],
				{ duration: 250, delay: 20, fill: 'both', easing: 'cubic-bezier(1,0,.48,1.06)' }
			),
			outAnimation = outEl.animate([{}, { opacity: 0 }], { duration: 250, fill: 'both', easing: 'linear' });

		return Promise.all([inAnimation.finished, outAnimation.finished]);
	};
