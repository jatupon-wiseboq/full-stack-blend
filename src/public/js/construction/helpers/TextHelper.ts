var TextHelper = {
  removeExtraWhitespaces: (text: string) => {
    return text.replace(/[ ]+/g, ' ').trim();
  }
};

export {TextHelper};