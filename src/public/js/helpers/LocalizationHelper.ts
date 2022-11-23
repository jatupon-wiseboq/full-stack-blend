// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

let cachedDictionary = null;

declare let window: any;

const LOCALIZATION_LIST_DELIMITER = '~;;;~';
const LOCALIZATION_ITEM_DELIMITER = '~:::~';
const LOCALIZATION_HASH_DELIMITER = '~###~';

const LocalizationHelper = {
	getLanguageSpecification: (): any => {
		const data = window.localizedData;
		
		if (cachedDictionary) return cachedDictionary;
		if (!data) return {};
	  
	  const items = data.split(LOCALIZATION_LIST_DELIMITER);
	  const dictionary = {};
	  
	  for (const item of items) {
	  	const tokens = item.split(LOCALIZATION_ITEM_DELIMITER);
	  	dictionary[tokens[0].split(LOCALIZATION_HASH_DELIMITER)[0]] = tokens[1];
	  }
	  
	  cachedDictionary = dictionary;
	  return dictionary;
	},
	localize: (text) => {
		const index = decodeURIComponent(document.cookie || '').indexOf('lang=');
		if (index == -1) return text;
		
		const lang = window.location.search.substring(index + 5).split(';')[0];
		if (!lang) return text;
		
		return LocalizationHelper.encode(LocalizationHelper.getLanguageSpecification()[text] || text).replace(/\n/g, '<br/>');
	},
	encode: (text) => {
		return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&#34;").replace(/\'/g, "&#39;");
	}
};

const loc = LocalizationHelper.localize;

export {loc};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.