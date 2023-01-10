import { HTMLHelper } from '../../helpers/HTMLHelper';
import { InternalProjectSettings } from './WorkspaceHelper';
import { LOCALIZATION_LIST_DELIMITER, LOCALIZATION_ITEM_DELIMITER, LOCALIZATION_HASH_DELIMITER } from '../../Constants';

var LocalizationHelper = {
  collectFromTexts: function(container : HTMLElement = document.body) {
    const elements = Array.from(HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'TextElement', container));
    let found = false;
    const deleting = {};

    for (const element of elements) {
      let text = element.innerText.trim();
      text = LocalizationHelper.cleanKeyForComposing(text);

      const translation = HTMLHelper.getAttribute(element, 'internal-fsb-translation');
      const guid = HTMLHelper.getAttribute(element, 'internal-fsb-guid');

      if (translation) {
        deleting[text] = false;
        LocalizationHelper.add(text, translation, guid);
      } else {
        if (!deleting.hasOwnProperty(text)) {
          deleting[text] = true;
        }
      }
    }

    for (const text in deleting) {
      if (deleting[text]) LocalizationHelper.remove(text);
    }
  },
  collectFromShortcuts: function(atEndInfo : string[]) {
    if (!atEndInfo) return;

    for (const sourceCode of atEndInfo) {
      if (!sourceCode) continue;

      const matches = sourceCode.toString().match(/(\@'\[)([^~#$^*_`\{\}\|\[\]\\:";'<>\n]+)(\]')/g) || [];
      for (const match of matches) {
        const text = match.replace(/^\@'/, '').replace(/'$/, '').trim();
        LocalizationHelper.add(text, text);
      }
    }
  },
  disperse: function(container : HTMLElement = document.body) : boolean {
    const elements = Array.from(HTMLHelper.getElementsByAttributeNameAndValue('internal-fsb-class', 'TextElement', container));
    let found = false;

    for (const element of elements) {
      let text = element.innerText.trim();
      text = LocalizationHelper.cleanKeyForComposing(text);
      const customLocalizedStrings = [LOCALIZATION_LIST_DELIMITER, InternalProjectSettings.customLocalizedStrings || ''].join('');

      const index = customLocalizedStrings.indexOf(LOCALIZATION_LIST_DELIMITER + text + LOCALIZATION_HASH_DELIMITER);
      const length = LOCALIZATION_LIST_DELIMITER.length + text.length + LOCALIZATION_HASH_DELIMITER.length;

      if (index == -1) continue;

      const translation = customLocalizedStrings.substring(index + length).split(LOCALIZATION_LIST_DELIMITER)[0];
      element.setAttribute('internal-fsb-translation', translation.split(LOCALIZATION_ITEM_DELIMITER)[1]);
    }
  },
  add: function(text : string, translation : string, guid : string = '') {
    text = LocalizationHelper.cleanKeyForComposing(text);
    LocalizationHelper.remove(text, guid);

    const item = LocalizationHelper.composeItemKeyValueToken(text, translation, guid);

    let values : string[] = InternalProjectSettings.customLocalizedStrings && InternalProjectSettings.customLocalizedStrings.split(LOCALIZATION_LIST_DELIMITER) || [];
    values.push(item);
    values = values.filter(value => !!value);

    InternalProjectSettings.customLocalizedStrings = values.join(LOCALIZATION_LIST_DELIMITER);
  },
  remove: function(text : string, guid : string) {
    text = LocalizationHelper.cleanKeyForComposing(text);
    const customLocalizedStrings = InternalProjectSettings.customLocalizedStrings;

    let values : string[] = customLocalizedStrings && customLocalizedStrings.split(LOCALIZATION_LIST_DELIMITER) || [];

    if (text) {
      values = values.filter(value => !value.startsWith(text + LOCALIZATION_HASH_DELIMITER));
    }
    if (guid) {
      values = values.filter(value => value.indexOf(LOCALIZATION_HASH_DELIMITER + guid + LOCALIZATION_ITEM_DELIMITER) == -1);
    }

    values.sort();

    InternalProjectSettings.customLocalizedStrings = values.join(LOCALIZATION_LIST_DELIMITER);
  },
  has: function(text : string) {
    text = LocalizationHelper.cleanKeyForComposing(text);
    const customLocalizedStrings = [LOCALIZATION_LIST_DELIMITER, InternalProjectSettings.customLocalizedStrings || ''].join('');
    return customLocalizedStrings.indexOf(LOCALIZATION_LIST_DELIMITER + text + LOCALIZATION_HASH_DELIMITER) != -1;
  },
  composeItemKeyValueToken: function(text : string, translation : string, guid : string = '') {
    text = LocalizationHelper.cleanKeyForComposing(text);
    if (guid == null) guid = '';

    return text + LOCALIZATION_HASH_DELIMITER + guid + LOCALIZATION_ITEM_DELIMITER + translation;
  },
  cleanKeyForComposing: function(text : string) {
    return text.replace(/\n+/g, ' ');
  }
};

export { LocalizationHelper };