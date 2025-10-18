function setLanguage(lang) {
    document.querySelectorAll('[lang]').forEach(el => {
        el.style.display = el.getAttribute('lang') === lang ? '' : 'none';
    });
}
