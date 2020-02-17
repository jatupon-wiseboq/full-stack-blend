var EventHelper = {
  cancel: (event: HTMLEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    return false;
  }
};

export {EventHelper};

          
          