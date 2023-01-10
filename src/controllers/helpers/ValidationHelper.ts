// Auto[Generating:V1]--->
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.

import {Input} from "./DatabaseHelper";

interface ValidationInfo {
  name: string;
  required: boolean;
  customMessage: string;
  format?: string;
  regex?: string;
}

const validationDict: any = {};

const ValidationHelper = {
  registerInput: (guid: string, name: string, required: boolean, customMessage: string, format: string = null, regex: string = null) => {
    if (!guid || !name) throw new Error("There was an error trying to register validation info (guid or name is empty).");

    validationDict[guid] = {
      name: name,
      required: required,
      customMessage: customMessage,
      format: format,
      regex: regex
    };
  },
  attachInfo: (input: Input) => {
    input.validation = validationDict[input.guid.split("[")[0]];
  },
  validate: (data: Input[]) => {
    if (!data) return;
    for (const item of data) {
      if (item.validation.required &&
        (item.value === null || item.value === undefined || item.value === "")) {
        throw new Error(item.validation.customMessage || `${item.validation.name} is required.`);
      } else if (item.validation.format != null && item.value !== null && item.value.trim() !== '') {
        const value = item.value.toString().trim();

        switch (item.validation.format) {
          case 'integer':
            if (!value.match(/^\d+$/)) {
              throw new Error(item.validation.customMessage || `${item.validation.name} isn\'t an integer.`);
            }
            break;
          case 'float':
            if (!value.match(/^\d+(\.\d{1,})?$/)) {
              throw new Error(item.validation.customMessage || `${item.validation.name} isn\'t a decimal.`);
            }
            break;
          case 'boolean':
            if (["true", "false", "1", "0"].indexOf(value.toLowerCase()) == -1) {
              throw new Error(item.validation.customMessage || `${item.validation.name} isn\'t a boolean.`);
            }
            break;
          case 'title':
            if (!value.match(/^[A-Za-z0-9_-]+$/)) {
              throw new Error(item.validation.customMessage || `${item.validation.name} is an incorrect title.`);
            }
            break;
          case 'email':
            if (!value.match(/^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
              throw new Error(item.validation.customMessage || `${item.validation.name} is an incorrect email address.`);
            }
            break;
          case 'password':
            if (value.length < 8 || value.length > 32) {
              throw new Error(item.validation.customMessage || `Please enter a password having the length from 8 to 32 characters.`);
            }
            else if (!value.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&\(\){}\[\]:;<>,\.?\/~_+\-=|\\]).{8,32}$/)) {
              throw new Error(item.validation.customMessage || `Please enter a password containing at least one digit, one lowercase, one uppercase, and one special character.`);
            }
            break;
          case 'phone':
            if (!value.match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)) {
              throw new Error(item.validation.customMessage || `${item.validation.name} is an incorrect phone number.`);
            }
            break;
          case 'zipcode':
            if (!value.match(/^(\d{5}(?:\-\d{4})?)$/)) {
              throw new Error(item.validation.customMessage || `${item.validation.name} is an incorrect zip code.`);
            }
            break;
          case 'custom':
            if (item.validation.regex && !value.match(new RegExp(item.validation.regex))) {
              throw new Error(item.validation.customMessage || `${item.validation.name} is in a wrong format.`);
            }
            break;
        }
      }
    }
  }
};

export {ValidationInfo, ValidationHelper};

// <--- Auto[Generating:V1]
// PLEASE DO NOT MODIFY BECUASE YOUR CHANGES MAY BE LOST.