var StorageHelper = {
	/* credit: https://stackoverflow.com/questions/28654595/how-do-you-create-a-cookie-in-javascript-without-jquery */
  getCookie: (name: string, value: string, days: number=365) => {
  	if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  },
  setCookie: (name: string) => {
  	var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  },
  deleteCookie: (name: string) => {
  	StorageHelper.createCookie(name,"",-1);
  }
};

export {StorageHelper};