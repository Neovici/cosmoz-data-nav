import '@neovici/cosmoz-button';
import { html, useMemo } from '@pionjs/pion';
import '@polymer/iron-icon/iron-icon';

import '@polymer/paper-spinner/paper-spinner-lite';

import '@neovici/cosmoz-bottom-bar';
import { t } from 'i18next';

const viewStyle = `
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	overflow: hidden;
	flex-direction: column;
`,
	scrollerContentStyle = `
	display: flex;
	flex: 1;
	flex-basis: 0.000000001px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

export const useIncompleteTemplate = (index, length) => {
	const atStart = index === 0,
		atEnd = index === length - 1;

	return useMemo(
		() => html`
			<div incomplete style="${viewStyle}">
				<div style="${scrollerContentStyle}">
					<paper-spinner-lite active></paper-spinner-lite>
					<div style="margin-left: 10px">
						<h3><span>${t('Data is updating')}</span></h3>
					</div>
				</div>
				<cosmoz-bottom-bar active>
					<cosmoz-button
						aria-label=${t('Previous item')}
						variant="primary"
						icon-only
						?disabled="${atStart}"
						cosmoz-data-nav-select="-1"
						slot="extra"
						><iron-icon icon="chevron-left"></iron-icon
					></cosmoz-button>
					<cosmoz-button
						aria-label=${t('Next item')}
						variant="primary"
						icon-only
						?disabled="${atEnd}"
						cosmoz-data-nav-select="+1"
						slot="extra"
						><iron-icon icon="chevron-right"></iron-icon
					></cosmoz-button>
				</cosmoz-bottom-bar>
			</div>
		`,
		[atStart, atEnd],
	);
};
