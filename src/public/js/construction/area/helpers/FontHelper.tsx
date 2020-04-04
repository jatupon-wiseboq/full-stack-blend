let setupFont = {};

var FontHelper = {
  load: function(name: string) {
    if (!name || setupFont[name]) return;
    
    let token = name.split(' ').join('+');
    
    let link1 = document.createElement('link');
    link1.setAttribute('href', 'https://fonts.googleapis.com/css2?family=' + token + ':wght@100;200;300;400;500;600;700;800;900&display=swap');
    link1.setAttribute('rel', 'stylesheet');
    
    let link2 = document.createElement('link');
    link2.setAttribute('href', 'https://fonts.googleapis.com/css2?family=' + token + ':ital,wght@1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    link2.setAttribute('rel', 'stylesheet');
    
    document.head.appendChild(link1);
    document.head.appendChild(link2);
    
    setupFont[name] = true;
  }
};

export {FontHelper};