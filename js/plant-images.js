/**
 * plant-images.js — Campus Plant Explorer · Image Loader Utility
 *
 * Convention (no hardcoded paths):
 *   assets/images/plants/{plantName}/{plantName}1.jpg
 *   assets/images/plants/{plantName}/{plantName}2.jpg
 *   assets/images/plants/{plantName}/{plantName}3.jpg
 *
 * API (attached to window.PlantImages):
 *   PlantImages.loadAll(name)     → Promise<string[]>   — all existing photo URLs
 *   PlantImages.loadPrimary(name) → Promise<string|null> — first existing photo URL
 *   PlantImages.getPaths(name)    → string[]             — candidate URLs (not probed)
 *   PlantImages.injectCard(photoDiv) → void              — auto-injects img into a
 *                                                          .pe-card__photo[data-plant]
 */
window.PlantImages = (function () {
    'use strict';

    /* ------------------------------------------------------------------ */
    var BASE      = 'assets/images/plants/';
    var MAX_COUNT = 3;

    /** In-memory cache: plantName → string[] (resolved paths, may be empty) */
    var _cache = Object.create(null);

    /* ------------------------------------------------------------------ */

    /**
     * Return all candidate paths for a plant — no network requests.
     * @param  {string} name  e.g. '樟樹'
     * @return {string[]}
     */
    function getPaths(name) {
        if (!name) return [];
        var paths = [];
        var folder = BASE + encodeURIComponent(name) + '/';
        for (var i = 1; i <= MAX_COUNT; i++) {
            paths.push(folder + encodeURIComponent(name) + i + '.jpg');
        }
        return paths;
    }

    /**
     * Probe a single URL by attempting to load it as an Image.
     * @param  {string} url
     * @return {Promise<string|null>}  — url on success, null on failure
     */
    function _probe(url) {
        return new Promise(function (resolve) {
            var img = new Image();
            img.onload  = function () { resolve(url); };
            img.onerror = function () { resolve(null); };
            img.src = url;
        });
    }

    /**
     * Load ALL existing photos for a plant.
     * Results are cached so repeat calls are free.
     * @param  {string} name
     * @return {Promise<string[]>}  — array of working URLs (may be empty)
     */
    function loadAll(name) {
        if (!name) return Promise.resolve([]);

        if (_cache[name] !== undefined) {
            return Promise.resolve(_cache[name]);
        }

        var paths = getPaths(name);
        return Promise.all(paths.map(_probe)).then(function (results) {
            var found = results.filter(Boolean);
            _cache[name] = found;
            return found;
        });
    }

    /**
     * Load just the primary (first) photo for a plant.
     * @param  {string} name
     * @return {Promise<string|null>}  — first working URL, or null
     */
    function loadPrimary(name) {
        return loadAll(name).then(function (images) {
            return images.length ? images[0] : null;
        });
    }

    /**
     * Inject a real <img> into a .pe-card__photo[data-plant] element, or
     * reveal its sibling placeholder if no photo exists.
     *
     * Expects this DOM structure inside the card photo div:
     *   <div class="pe-card__photo" data-plant="植物名">
     *     <div class="pe-card__photo-placeholder">...</div>
     *     ...overlays...
     *   </div>
     *
     * @param {HTMLElement} photoDiv
     */
    function injectCard(photoDiv) {
        var name = photoDiv.getAttribute('data-plant');
        if (!name) return;

        var placeholder = photoDiv.querySelector('.pe-card__photo-placeholder');

        loadPrimary(name).then(function (src) {
            if (!src) {
                // No photo found — placeholder is already visible, nothing to do.
                return;
            }

            // Build the <img> element
            var img = document.createElement('img');
            img.alt     = name;
            img.loading = 'lazy';
            img.className = 'pe-card__photo-img';

            // If the real image later breaks (e.g. file deleted), fall back gracefully
            img.onerror = function () {
                img.style.display = 'none';
                if (placeholder) placeholder.style.display = '';
            };

            // Hide the placeholder and insert the image before it
            if (placeholder) placeholder.style.display = 'none';
            photoDiv.insertBefore(img, photoDiv.firstChild);

            // Set src AFTER attaching onerror, then trigger load
            img.src = src;
        });
    }

    /**
     * Scan the page for all .pe-card__photo[data-plant] elements and wire them up.
     * Call once after the DOM is ready.
     */
    function initAllCards() {
        document.querySelectorAll('.pe-card__photo[data-plant]').forEach(injectCard);
    }

    /* ------------------------------------------------------------------ */
    return {
        getPaths:     getPaths,
        loadAll:      loadAll,
        loadPrimary:  loadPrimary,
        injectCard:   injectCard,
        initAllCards: initAllCards
    };

}());
