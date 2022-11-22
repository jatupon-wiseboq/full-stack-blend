import {HTMLHelper} from '../../helpers/HTMLHelper';
import {InternalProjectSettings} from './WorkspaceHelper';
import {LOCALIZATION_LIST_DELIMITER, LOCALIZATION_ITEM_DELIMITER, LOCALIZATION_HASH_DELIMITER} from '../../Constants';

var LocalizationHelper = {
	collect: function(container: HTMLElement=document.body) {
		const elements = Array.from(HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'TextElement', container));
		let found = false;
		const deleting = {};
		
		for (const element of elements) {
			const text = element.innerText;
			const value = HTMLHelper.getAttribute(element, 'internal-fsb-translation');
			const guid = HTMLHelper.getAttribute(element, 'internal-fsb-guid');
			
			if (value) {
				deleting[text] = false;
				LocalizationHelper.add(text, value, guid);
			} else {
				if (!deleting.hasOwnProperty(text)) {
					deleting[text] = true;
				}
			}
		}
		
		for (const key in deleting) {
			if (deleting[key]) LocalizationHelper.remove(key);
		}
	},
	disperse: function(container: HTMLElement=document.body): boolean {
		const elements = Array.from(HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'TextElement', container));
		let found = false;
		
		for (const element of elements) {
			const text = element.innerText;
			const customLocalizedStrings = [LOCALIZATION_LIST_DELIMITER, InternalProjectSettings.customLocalizedStrings || ''].join('');
			
			const index = customLocalizedStrings.indexOf(LOCALIZATION_LIST_DELIMITER + text + LOCALIZATION_HASH_DELIMITER);
			const length = text.length + LOCALIZATION_HASH_DELIMITER.length;
			
			if (index == -1) continue;
			
			const value = customLocalizedStrings.substring(index + length).split(LOCALIZATION_LIST_DELIMITER)[0];
			element.setAttribute('internal-fsb-translation', value.split(LOCALIZATION_ITEM_DELIMITER)[1]);
		}
	},
	add: function(key: string, value: string, guid: string='') {
		LocalizationHelper.remove(key);
		
		const item = LocalizationHelper.compose(key, value, guid);
		
		let values: string[] = InternalProjectSettings.customLocalizedStrings && InternalProjectSettings.customLocalizedStrings.split(LOCALIZATION_LIST_DELIMITER) || [];
    values.push(item);
    values = values.filter(value => !!value);
    
    InternalProjectSettings.customLocalizedStrings = values.join(LOCALIZATION_LIST_DELIMITER);
	},
	remove: function(key: string, guid: string=null) {
		let values: string[] = InternalProjectSettings.customLocalizedStrings && InternalProjectSettings.customLocalizedStrings.split(LOCALIZATION_LIST_DELIMITER) || [];
  	values = values.filter(value => value.indexOf(key + LOCALIZATION_HASH_DELIMITER) != 0);
  	values = values.filter(value => value.indexOf(LOCALIZATION_HASH_DELIMITER + guid + LOCALIZATION_HASH_DELIMITER) == -1);
    
    InternalProjectSettings.customLocalizedStrings = values.join(LOCALIZATION_LIST_DELIMITER);
	},
	compose: function(key: string, value: string, guid: string='') {
		if (guid == null) guid = '';
		
		return key + LOCALIZATION_HASH_DELIMITER + guid + LOCALIZATION_ITEM_DELIMITER + value;
	}
};

export {LocalizationHelper};