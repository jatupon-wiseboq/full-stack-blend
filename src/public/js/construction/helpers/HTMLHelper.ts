var HTMLHelper = {
  sanitizing_pug: (code) => {
    return code.replace(/classname=/gi, 'class=');
  }
};

export {HTMLHelper};