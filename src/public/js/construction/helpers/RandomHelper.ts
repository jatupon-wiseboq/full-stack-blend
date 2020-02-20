var RandomHelper = {
  generateGUID: () => {
    var result = [];
    for (var i=0; i<4; i++) {
      var token = "";
      for (var j=0; j<8; j++) {
        token += Math.floor(Math.random() * 0xF).toString(0xF);
      }
      result.push(token);
    }
    return result.join("-");
  }
};

export {RandomHelper};