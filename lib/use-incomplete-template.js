
import {
	html, useMemo
} from 'haunted';

import '@polymer/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';

import '@neovici/cosmoz-bottom-bar/cosmoz-bottom-bar-view';
import { _ } from '@neovici/cosmoz-i18next';

const viewStyle = `
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
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

	return useMemo(() => html`
		<cosmoz-bottom-bar-view active incomplete style="${ viewStyle }">
			<div slot="scroller-content" style="${ scrollerContentStyle }">
				<paper-spinner-lite active></paper-spinner-lite>
				<div style="margin-left: 10px">
					<h3><span>${ _('Data is updating') }</span></h3>
				</div>
			</div>
			<paper-icon-button ?disabled="${ atStart }" icon="chevron-left" cosmoz-data-nav-select="-1" slot="extra"></paper-icon-button>
			<paper-icon-button ?disabled="${ atEnd }" icon="chevron-right" cosmoz-data-nav-select="+1" slot="extra"></paper-icon-button>
		</cosmoz-bottom-bar-view>
	`, [atStart, atEnd]);
};
