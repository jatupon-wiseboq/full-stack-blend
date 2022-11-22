// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {ProjectConfigurationHelper} from "./ProjectConfigurationHelper";

let cachedData = null;
let cachedDictionary = null;

const LOCALIZATION_LIST_DELIMITER = '~;;;~';
const LOCALIZATION_ITEM_DELIMITER = '~:::~';
const LOCALIZATION_HASH_DELIMITER = '~###~';

const LocalizationHelper = {
	getLanguageSpecification: (): any => {
		const data = ProjectConfigurationHelper.getLanguageData();
		
		if (cachedData != data) {
			cachedData = data;
			cachedDictionary = null;
		}
		
		if (cachedDictionary) return cachedDictionary;
		if (!cachedData) return {};
	  
	  const items = data.split(LOCALIZATION_LIST_DELIMITER);
	  const dictionary = {};
	  
	  for (const item of items) {
	  	const tokens = item.split(LOCALIZATION_ITEM_DELIMITER);
	  	dictionary[tokens[0].split(LOCALIZATION_HASH_DELIMITER)[0]] = tokens[1];
	  }
	  
	  cachedDictionary = dictionary;
	  return dictionary;
	},
	localize: (text: string, country: string='en') => {
		if (!country) return text;
		if (ProjectConfigurationHelper.getSecondaryLanguage() != country.toLowerCase()) return text;
		
		return LocalizationHelper.getLanguageSpecification()[text] || text;
	}
};

const loc = LocalizationHelper.localize;

export {loc};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.