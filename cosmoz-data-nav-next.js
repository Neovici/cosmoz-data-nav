import { component } from 'haunted';
import { renderDataNav, useDataNav } from './lib/next/use-data-nav';

const DataNav = host => renderDataNav(useDataNav(host));

customElements.define('cosmoz-data-nav-next', component(DataNav));
