/* ==========================================================================
   plants.js — Campus Plant Explorer Interactions
   Responsibilities:
     1. Spawn animated floating leaf particles
     2. Scroll-reveal cards as they enter the viewport
   Does NOT touch: routing, markdown loading, or backend logic.
   ========================================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       1.  Floating Leaf Particles
       ------------------------------------------------------------------ */

    /** SVG paths for several leaf silhouettes */
    var LEAF_PATHS = [
        // Simple oval leaf
        'M12 2 C12 2 2 8 4 16 C6 24 12 26 12 26 C12 26 18 24 20 16 C22 8 12 2 12 2Z',
        // Elongated maple-style
        'M12 1 C12 1 5 6 5 12 C5 18 8 22 12 23 C16 22 19 18 19 12 C19 6 12 1 12 1Z',
        // Wide tropical leaf
        'M2 12 C2 12 5 4 12 2 C19 4 22 12 22 12 C22 12 19 20 12 22 C5 20 2 12 2 12Z',
        // Narrow willow leaf
        'M12 0 C12 0 8 10 8 15 C8 20 10 24 12 24 C14 24 16 20 16 15 C16 10 12 0 12 0Z',
        // Three-lobe style
        'M12 22 C12 22 3 14 5 8 C6 4 10 3 12 5 C14 3 18 4 19 8 C21 14 12 22 12 22Z',
    ];

    /** Colour palette – warm greens & rose tints for variety */
    var LEAF_COLOURS = [
        '#4a7c59', // mid green
        '#6bab77', // light green
        '#2e7d32', // deep green
        '#a5d6a7', // pale green
        '#c0396c', // spring pink (cherry)
        '#81c784', // soft green
        '#00897b', // teal green
        '#aed581', // yellow-green
    ];

    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function spawnLeaf(canvas) {
        var el = document.createElement('div');
        el.className = 'pe-leaf';

        var size      = randomBetween(12, 32);          // px — slightly smaller
        var colour    = LEAF_COLOURS[Math.floor(Math.random() * LEAF_COLOURS.length)];
        var duration  = randomBetween(16, 32);          // seconds — slower fall
        var delay     = randomBetween(0, 24);           // seconds
        var startX    = randomBetween(2, 98);           // viewport %
        var drift     = randomBetween(-60, 60);         // gentler horizontal drift

        el.style.cssText = [
            'left:' + startX + 'vw',
            'width:' + size + 'px',
            'height:' + size + 'px',
            'animation-duration:' + duration + 's',
            'animation-delay:-' + delay + 's',
            '--leaf-drift:' + drift + 'px',
        ].join(';');

        // Pick a random leaf shape
        var pathD = LEAF_PATHS[Math.floor(Math.random() * LEAF_PATHS.length)];

        el.innerHTML =
            '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" ' +
            'fill="' + colour + '" opacity="0.55" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="' + pathD + '"/>' +
            '</svg>';

        canvas.appendChild(el);

        // Recycle: restart leaf after one cycle to avoid DOM bloat
        var totalMs = (duration + delay) * 1000;
        setTimeout(function () {
            if (el.parentNode) { el.parentNode.removeChild(el); }
            spawnLeaf(canvas);
        }, totalMs);
    }

    function initLeaves() {
        var canvas = document.getElementById('peLeafCanvas');
        if (!canvas) { return; }

        // Spawn an initial batch spread over time — fewer, gentler
        var INITIAL_COUNT = 12;
        for (var i = 0; i < INITIAL_COUNT; i++) {
            (function (idx) {
                setTimeout(function () { spawnLeaf(canvas); }, idx * 800);
            }(i));
        }
    }

    /* ------------------------------------------------------------------
       2.  Scroll-Reveal Cards
       ------------------------------------------------------------------ */

    function initScrollReveal() {
        var cards = document.querySelectorAll('.pe-card');
        if (!cards.length) { return; }

        // Use IntersectionObserver if available; fall-through shows all cards
        if (!('IntersectionObserver' in window)) {
            cards.forEach(function (c) { c.classList.add('pe-card--visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('pe-card--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px',
        });

        cards.forEach(function (card) { observer.observe(card); });
    }

    /* ------------------------------------------------------------------
       3.  Hover Leaf Particles — mini leaves burst from bottom of card
       ------------------------------------------------------------------ */

    /** Colour sets per collection, matching CSS palette */
    var HOVER_COLOURS = {
        spring:    ['#c0396c', '#e91e8c', '#f06292', '#f48fb1', '#ce93d8'],
        seasonal:  ['#b5470a', '#e65100', '#ff7043', '#ffa726', '#ffd54f'],
        landmarks: ['#2e7d32', '#388e3c', '#66bb6a', '#a5d6a7', '#4caf50'],
        evergreen: ['#00695c', '#00897b', '#26a69a', '#80cbc4', '#4db6ac'],
    };
    var DEFAULT_COLOURS = ['#4a7c59', '#6bab77', '#2e7d32', '#a5d6a7', '#81c784'];

    function getCardCollection(card) {
        var section = card.closest('[data-collection]');
        return section ? section.getAttribute('data-collection') : null;
    }

    function spawnHoverLeaf(container, colours) {
        var el = document.createElement('div');
        el.className = 'pe-card-micro-leaf';

        var size     = Math.random() * 10 + 7;   // 7–17 px
        var colour   = colours[Math.floor(Math.random() * colours.length)];
        var startX   = Math.random() * 80 + 10;  // 10–90 % width
        var rise     = -(Math.random() * 90 + 50); // -50 to -140px
        var drift    = (Math.random() - 0.5) * 80; // -40 to +40px
        var spin     = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 180 + 90); // ±90–270deg
        var duration = Math.random() * 0.7 + 0.6; // 0.6–1.3s
        var pathD    = LEAF_PATHS[Math.floor(Math.random() * LEAF_PATHS.length)];

        el.style.cssText = [
            'left:' + startX + '%',
            'width:' + size + 'px',
            'height:' + size + 'px',
            'animation-duration:' + duration + 's',
            '--micro-rise:' + rise + 'px',
            '--micro-drift:' + drift + 'px',
            '--micro-spin:' + spin + 'deg',
        ].join(';');

        el.innerHTML =
            '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" ' +
            'fill="' + colour + '" opacity="0.75" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="' + pathD + '"/>' +
            '</svg>';

        container.appendChild(el);

        // Clean up after animation
        setTimeout(function () {
            if (el.parentNode) { el.parentNode.removeChild(el); }
        }, (duration + 0.1) * 1000);
    }

    function initHoverParticles() {
        document.querySelectorAll('.pe-card').forEach(function (card) {
            var container = card.querySelector('.pe-card__hover-leaves');
            if (!container) { return; }

            var burstTimer = null;
            var isHovered  = false;

            card.addEventListener('mouseenter', function () {
                isHovered = true;
                var collection = getCardCollection(card);
                var colours    = HOVER_COLOURS[collection] || DEFAULT_COLOURS;

                // Initial burst of 5 leaves
                for (var i = 0; i < 5; i++) {
                    (function (delay) {
                        setTimeout(function () {
                            if (isHovered) { spawnHoverLeaf(container, colours); }
                        }, delay * 80);
                    }(i));
                }

                // Continuous trickle while hovered
                function trickle() {
                    if (!isHovered) { return; }
                    spawnHoverLeaf(container, colours);
                    burstTimer = setTimeout(trickle, 300 + Math.random() * 250);
                }
                burstTimer = setTimeout(trickle, 420);
            });

            card.addEventListener('mouseleave', function () {
                isHovered = false;
                clearTimeout(burstTimer);
            });
        });
    }

    /* ------------------------------------------------------------------
       4.  Keyboard accessibility for cards (Enter / Space → follow CTA)
       ------------------------------------------------------------------ */

    function initCardKeyboard() {
        document.querySelectorAll('.pe-card[tabindex]').forEach(function (card) {
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var cta = card.querySelector('.pe-card__cta');
                    if (cta) { cta.click(); }
                }
            });
        });
    }

    /* ------------------------------------------------------------------
       4.  Season Nav — highlight active pill on scroll
       ------------------------------------------------------------------ */
    function initSeasonNav() {
        var pills = document.querySelectorAll('.pe-season-nav__pill');
        if (!pills.length) return;

        // Extract section IDs from href="#section-*" attributes
        // and resolve them locally — avoids <base href="../"> misrouting fragments
        var sections = Array.from(pills).map(function (pill) {
            var href = pill.getAttribute('href') || '';
            var id = href.replace(/^.*#/, '');
            return id ? document.getElementById(id) : null;
        });

        // Intercept click: prevent default navigation, scroll to section instead
        pills.forEach(function (pill, i) {
            pill.addEventListener('click', function (e) {
                e.preventDefault();
                var target = sections[i];
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        function updateActive() {
            var scrollY = window.scrollY + window.innerHeight * 0.4;
            var activeIdx = -1;
            sections.forEach(function (sec, i) {
                if (sec && sec.offsetTop <= scrollY) activeIdx = i;
            });
            pills.forEach(function (pill, i) {
                pill.classList.toggle('active', i === activeIdx);
            });
        }

        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
    }

    /* ------------------------------------------------------------------
       5.  Bootstrap on DOMContentLoaded
       ------------------------------------------------------------------ */

    document.addEventListener('DOMContentLoaded', function () {
        initLeaves();
        initScrollReveal();
        initHoverParticles();
        initCardKeyboard();
        PlantImages.initAllCards();   // dynamic image loading via plant-images.js
        initSeasonNav();
    });

}());
