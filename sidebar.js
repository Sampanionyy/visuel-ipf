(function () {
    'use strict';

    /* ── Injection HTML ── */
    const HTML = `
        <aside class="sidebar">
            <div class="sb-header">
                <a class="sb-brand" href="index.html">5s<span>chrono</span></a>
                <button class="sb-collapse-btn" aria-label="Réduire/agrandir">
                    <svg viewBox="0 0 24 24" fill="white">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                </button>
            </div>
            <nav class="sb-nav">
                <a class="sb-item" href="index.html" data-tooltip="Accueil">
                    <div class="sb-icon" style="background:rgba(195,209,185,0.2)">
                        <svg viewBox="0 0 24 24" fill="#fff"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                    </div>
                    <span class="sb-label">Accueil</span>
                </a>
                <a class="sb-item" href="01-intro.html" data-tooltip="Quiz">
                    <div class="sb-icon" style="background:rgba(88,204,2,0.15)">
                        <svg viewBox="0 0 24 24" fill="#58cc02"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
                    </div>
                    <span class="sb-label">Quiz</span>
                </a>
                <a class="sb-item" href="progression.html" data-tooltip="Progression">
                    <div class="sb-icon" style="background:rgba(210,122,45,0.2)">
                        <svg viewBox="0 0 24 24" fill="#D27A2D"><path d="M13 2.05V4.06c3.95.49 7 3.85 7 7.94 0 3.21-1.81 6-4.72 7.28L13 17v5l6-3.19C21.91 16.26 24 12.79 24 12c0-5.18-3.95-9.45-9.02-10.42zM11 2.06C5.95 3.03 2 7.3 2 12.01c0 3.79 2.09 7.26 5 9.04L11 17V2.06z"/></svg>
                    </div>
                    <span class="sb-label">Progression</span>
                </a>
                <a class="sb-item" href="profil.html" data-tooltip="Mon Profil">
                    <div class="sb-icon" style="background:rgba(206,130,255,0.15)">
                        <svg viewBox="0 0 24 24" fill="#ce82ff"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                    </div>
                    <span class="sb-label">Mon Profil</span>
                </a>
            </nav>
        </aside>`;

    const tmp = document.createElement('div');
    tmp.innerHTML = HTML;
    while (tmp.firstChild) {
        document.body.insertBefore(tmp.firstChild, document.body.firstChild);
    }

    const btn  = document.querySelector('.sb-collapse-btn');
    const body = document.body;

    /* ── Zones ── */
    function zone() {
        const w = window.innerWidth;
        if (w < 768)  return 'mobile';
        if (w < 1200) return 'tablet';
        return 'desktop';
    }

    /* ── Applique l'état selon la zone ── */
    function applyZone(z) {
        // Nettoie toutes les classes sidebar
        body.classList.remove('sb-closed', 'sb-open');
        btn.classList.remove('sb-rotated');

        if (z === 'mobile') {
            // Rien — le CSS gère tout via media query
            return;
        }

        if (z === 'tablet') {
            // Fermé par défaut, sauf si l'utilisateur avait ouvert
            const saved = localStorage.getItem('sb_tablet');
            if (saved === 'open') {
                body.classList.add('sb-open');
                // sb-open = ouvert sur tablette, pas de rotation
            } else {
                body.classList.add('sb-closed');
                btn.classList.add('sb-rotated');
            }
            return;
        }

        if (z === 'desktop') {
            // Ouvert par défaut, sauf si l'utilisateur avait fermé
            const saved = localStorage.getItem('sb_desktop');
            if (saved === 'closed') {
                body.classList.add('sb-closed');
                btn.classList.add('sb-rotated');
            }
            // sinon rien = ouvert
        }
    }

    /* ── Clic sur le bouton ── */
    btn?.addEventListener('click', () => {
        const z = zone();
        if (z === 'mobile') return;

        if (z === 'tablet') {
            if (body.classList.contains('sb-closed')) {
                // Ouvre
                body.classList.remove('sb-closed');
                body.classList.add('sb-open');
                btn.classList.remove('sb-rotated');
                localStorage.setItem('sb_tablet', 'open');
            } else {
                // Ferme
                body.classList.remove('sb-open');
                body.classList.add('sb-closed');
                btn.classList.add('sb-rotated');
                localStorage.setItem('sb_tablet', 'closed');
            }
            return;
        }

        if (z === 'desktop') {
            if (body.classList.contains('sb-closed')) {
                // Ouvre
                body.classList.remove('sb-closed');
                btn.classList.remove('sb-rotated');
                localStorage.setItem('sb_desktop', 'open');
            } else {
                // Ferme
                body.classList.add('sb-closed');
                btn.classList.add('sb-rotated');
                localStorage.setItem('sb_desktop', 'closed');
            }
        }
    });

    /* ── Resize ── */
    let t;
    window.addEventListener('resize', () => {
        clearTimeout(t);
        t = setTimeout(() => applyZone(zone()), 80);
    });

    /* ── Init ── */
    applyZone(zone());

    /* ── Lien actif ── */
    const cur = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sb-item[href]').forEach(a => {
        if (a.getAttribute('href').split('/').pop() === cur) a.classList.add('active');
    });

})();
