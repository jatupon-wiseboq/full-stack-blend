var RandomHelper = {
  generateGUID: (groupCount: number=1) => {
    var result = [];
    for (var i=0; i<groupCount; i++) {
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