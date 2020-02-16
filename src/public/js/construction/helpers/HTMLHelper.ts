var HTMLHelper = {
  sanitizingPug: (code: string) => {
    return code.replace(/classname=/gi, 'class=');
  }
};

export {HTMLHelper};