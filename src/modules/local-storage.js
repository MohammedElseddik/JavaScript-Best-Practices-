export const setLocalStorage = (listTaskArray) => {
    localStorage.setItem('list', JSON.stringify(listTaskArray));
}