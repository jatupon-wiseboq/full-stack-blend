var RandomHelper = {
  generateGUID: () => {
    var result = "";
    for (var i=0; i<32; i++) {
      result += Math.floor(Math.random() * 0xF).toString(0xF);
    }
    return result;
  }
};

export {RandomHelper};