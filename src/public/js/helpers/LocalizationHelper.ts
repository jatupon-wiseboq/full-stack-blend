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
    const cookie = decodeURIComponent(document.cookie || '');
    const index = cookie.indexOf('lang=');
    const lang = (index == -1) ? null : cookie.substring(index + 5).split(';')[0];
    const key = LocalizationHelper.cleanKeyForComposing(text);

    if (!lang || !LocalizationHelper.getLanguageSpecification()[key]) {
      return LocalizationHelper.encode(text).replace(/\n\n/g, '<br/>').replace(/\n/g, '<br/>');
    } else {
      return LocalizationHelper.encode(LocalizationHelper.getLanguageSpecification()[key] || text).replace(/\n/g, '<br/>');
    }
  },
  encode: (text) => {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&#34;").replace(/\'/g, "&#39;");
  },
  cleanKeyForComposing: function(text: string) {
    return text.replace(/[\t\r\n]/g, ' ').replace(/\s+/g, ' ').trim();
  }
};

const loc = LocalizationHelper.localize;

export {loc};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.