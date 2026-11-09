/* Kontaktauswahl: Jeder Button mit data-contact öffnet ein Fenster mit "Anrufen" und "E-Mail schreiben".
   Ohne JavaScript (oder in sehr alten Browsern) funktioniert der Button als normaler E-Mail-Link. */
(function () {
  var PHONE = '+491712020208', PHONE_SHOW = '+49 171 2020208', MAIL = 'marlene.krinninger@freenet.de';
  if (typeof HTMLDialogElement !== 'function') return;
  var dlg, mailLink;

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'contact-dialog';
    dlg.setAttribute('aria-labelledby', 'cd-title');
    dlg.innerHTML =
      '<div class="cd-inner">' +
        '<button type="button" class="cd-close" aria-label="Schließen">&times;</button>' +
        '<span class="cd-label">Termin vereinbaren</span>' +
        '<h2 class="cd-title" id="cd-title">Wie möchtest du mich erreichen?</h2>' +
        '<p class="cd-text">Termine gibt es nur nach Vereinbarung, gerne auch am Wochenende.</p>' +
        '<div class="cd-actions">' +
          '<a class="cd-btn cd-call" href="tel:' + PHONE + '"><strong>Anrufen</strong><span>' + PHONE_SHOW + '</span></a>' +
          '<a class="cd-btn cd-mail" href="mailto:' + MAIL + '"><strong>E-Mail schreiben</strong><span>' + MAIL + '</span></a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(dlg);
    mailLink = dlg.querySelector('.cd-mail');
    dlg.querySelector('.cd-close').addEventListener('click', function () { dlg.close(); });
    // Klick auf den abgedunkelten Hintergrund schließt das Fenster
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    // Nach Klick auf eine Option Fenster schließen (das Telefon- bzw. Mailprogramm öffnet sich)
    dlg.querySelectorAll('.cd-btn').forEach(function (a) { a.addEventListener('click', function () { setTimeout(function () { dlg.close(); }, 150); }); });
  }

  function closeMobileMenu() {
    var menu = document.getElementById('mobileMenu'), ham = document.getElementById('hamburger');
    if (menu) menu.classList.remove('open');
    if (ham) ham.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-contact]') : null;
    if (!t) return;
    e.preventDefault();
    if (!dlg) build();
    var subject = t.getAttribute('data-subject') || 'Terminanfrage';
    var body = 'Hallo Marlene,\n\nich würde gern einen Termin vereinbaren.\n\nViele Grüße';
    mailLink.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    closeMobileMenu();
    dlg.showModal();
  });
})();
