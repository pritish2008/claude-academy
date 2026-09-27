/* ==========================================================================
   Agency branding. Change the name here. To show the logo, put the file in
   assets/brand/ and set `logo` to its path (PNG, JPG or SVG). The build
   script embeds it into the single-file versions automatically.
   ========================================================================== */
(function () {
  'use strict';
  window.PU.brand = {
    name: 'Brij Design Studio',
    short: 'BDS',
    logo: 'assets/brand/bds-logo.png',
    /* Progress reports. Paste the Google Sheet's web app link into `url`
       (see tools/google-sheet/README.md). Leave it empty to send nothing.
       `key` must match KEY in tools/google-sheet/Code.gs. */
    sheet: {
      url: 'https://script.google.com/macros/s/AKfycbwej8lXy97M_giB33ZAmYQA73NFITM1yTBGAnERS5HHNRq3fdzi1AaxzmZEkhq-waj8Jg/exec',
      key: 'bds-pu-7k3q9x2m'
    }
  };
})();
