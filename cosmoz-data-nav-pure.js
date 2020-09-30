import {
	component, useState, useCallback
} from 'haunted';

import { useNotifyProperty } from '@neovici/cosmoz-utils/lib/hooks/use-notify-property';
import { useMaintainSelection } from './lib/use-maintain-selection';
import { useTriggerPreload } from './lib/use-trigger-preload';

const
	useCosmozDataNav = host => {
		const
			{
				items,
				renderItem,
				maintainSelection
			} = host,
			[selected, setSelected] = useState(0);

		useTriggerPreload(host, items, selected);
		useMaintainSelection(items, selected, maintainSelection, setSelected);
		useNotifyProperty('selected', selected);

		return {
			items,
			renderItem,
			selected,
			advance: useCallback(n => setSelected(selected => selected + n), [])
		};
	},

	renderCosmozDataNav = ({
		items,
		renderItem,
		selected,
		advance
	}) => items[selected] && renderItem(items[selected], selected, items, advance),

	CosmozDataNavPure = host => renderCosmozDataNav(useCosmozDataNav(host));

customElements.define('cosmoz-data-nav-pure', component(CosmozDataNavPure, { useShadowDOM: false }));
