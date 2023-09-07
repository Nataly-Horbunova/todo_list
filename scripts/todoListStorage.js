class Storage  {
    getFromLocalStorage(key) {
        return localStorage.getItem(key);
    }

    setToLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }
}