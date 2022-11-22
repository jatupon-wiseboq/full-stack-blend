import {HTMLHelper} from '../../helpers/HTMLHelper';
import {InternalProjectSettings} from './WorkspaceHelper';

var LocalizationHelper = {
	collect: function(container: HTMLElement=document.body): boolean {
		const elements = Array.from(HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'TextElement', container));
		let found = false;
		
		for (const element of elements) {
			const text = element.innerText;
			const value = HTMLHelper.getAttribute(element, 'internal-fsb-translation');
			const guid = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
			
			if (value) {
				LocalizationHelper.add(text, value, guid);
			} else {
				LocalizationHelper.remove(text);
			}
			
			found = true;
		}
		
		return found;
	},
	add: function(text: string, value: string, guid: string=null) {
		let values: string[] = (InternalProjectSettings.customLocalizedStrings || '').split('`');
    values = values.filter(value => (guid) ? (value.indexOf('#' + guid) == -1) : (value.indexOf(text + '~') == -1));
    
    values.push(text + (guid ? '#' + guid : '') + '~' + value);
    
    InternalProjectSettings.customLocalizedStrings = values.join('`');
	},
	remove: function(text: string, guid: string=null) {
		let values: string[] = (InternalProjectSettings.customLocalizedStrings || '').split('`');
    values = values.filter(value => (guid) ? (value.indexOf('#' + guid) == -1) : (value.indexOf(text + '~') == -1));
    
    InternalProjectSettings.customLocalizedStrings = values.join('`');
	}
};

export {LocalizationHelper};