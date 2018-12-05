# todo

## v1.10.0
    - use popup for password generation instead of overlay
        + probably have to split up overlay.js a bit more
        * pro:
            * more design possibilities and proof to work UI (no issues)
            * more secure
            * less issues on sending form because overlay won't be part of the form to be send
            * user can decide if he wants to use the generator or not without having to close the overlay
            * works more reliably on not marked as password password fields
        * con:
            * less convenient (when working as expected) because you have to open the popup
            * popup has to be opened manually
        - use translations
        - use image url resolving for popup as well (js)
        - remove code duplications/resolve duplications and todos
        - make overwrite extension work (or always show it?)
        - remove obsolete code
        - make sure we're using either popup or overlay!
        - make sure options can set the overly/popup settings correctly
