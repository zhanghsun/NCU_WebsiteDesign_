/**
 * plant-detail.js
 * Campus Plant Explorer — Detail Page
 *
 * Fetches a plant's .md file, parses it, and populates the 10-section layout.
 * URL param: ?plant=樟樹  (or any plant name matching data/plants/*.md)
 */

(function () {
    'use strict';

    /* ===================================================================
       Plant Metadata Maps
       =================================================================== */

    /* Image paths are resolved dynamically by plant-images.js */

    var PLANT_COLLECTION = {
        '櫻花': 'spring', '白千層': 'spring',
        '木棉': 'seasonal', '小葉欖仁': 'seasonal',
        '榕樹': 'landmarks', '樟樹': 'landmarks', '黑板樹': 'landmarks',
        '台灣肖楠': 'evergreen', '龍柏': 'evergreen', '相思樹': 'evergreen'
    };

    var COLLECTION_LABELS = {
        spring:    '🌸 Spring Bloom',
        seasonal:  '🔥 Seasonal Signature',
        landmarks: '🌳 Campus Landmark',
        evergreen: '🌲 Evergreen Year-round'
    };

    var SECTION_DOTS = [
        { id: 'pd-s1',  label: 'Hero' },
        { id: 'pd-s2',  label: 'Snapshot' },
        { id: 'pd-s3',  label: 'Clues' },
        { id: 'pd-s4',  label: 'Story' },
        { id: 'pd-s5',  label: 'Calendar' },
        { id: 'pd-s6',  label: 'Spots' },
        { id: 'pd-s7',  label: 'Passport' },
        { id: 'pd-s8',  label: 'Challenges' },
        { id: 'pd-s9',  label: 'Help' },
        { id: 'pd-s10', label: 'Explore' }
    ];

    /* ===================================================================
       Markdown Parser Utilities
       =================================================================== */

    /**
     * Parse a markdown table into an array of row arrays (string[]).
     * Skips separator rows (|---|) and optional header rows.
     */
    function parseTable(content) {
        var rows = [];
        var headerSkipped = false;
        content.split('\n').forEach(function (line) {
            var trimmed = line.trim();
            if (!trimmed.startsWith('|')) return;
            // Separator rows
            if (/^\|[\s\-|:]+\|$/.test(trimmed)) return;
            var cells = trimmed.split('|').map(function (c) { return c.trim(); }).filter(Boolean);
            if (cells.length < 2) return;
            // Skip header row (first row that matches known header patterns)
            if (!headerSkipped && (cells[0] === '項目' || cells[0] === '月份')) {
                headerSkipped = true;
                return;
            }
            rows.push(cells);
        });
        return rows;
    }

    /**
     * Parse bullet list lines (lines starting with "- ") into an array of strings.
     */
    function parseBullets(content) {
        return content.split('\n')
            .filter(function (l) { return l.trimStart().startsWith('- '); })
            .map(function (l) { return l.replace(/^\s*-\s+/, '').trim(); });
    }

    /**
     * Parse H3 sub-sections from content.
     * Returns: [{ title, lines: string[] }]
     */
    function parseH3Sections(content) {
        var sections = [];
        // Split by lines beginning with ### (allow leading whitespace)
        var parts = content.split(/\n(?=###\s)/);
        parts.forEach(function (part) {
            var trimmed = part.trim();
            if (!trimmed) return;
            var firstNewline = trimmed.indexOf('\n');
            var rawTitle = (firstNewline === -1 ? trimmed : trimmed.slice(0, firstNewline)).replace(/^###\s+/, '').trim();
            var body = firstNewline === -1 ? '' : trimmed.slice(firstNewline + 1).trim();
            sections.push({ title: rawTitle, body: body });
        });
        return sections;
    }

    /**
     * Get first non-empty, non-list, non-table, non-heading line as intro.
     */
    function extractIntro(content) {
        var lines = content.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var l = lines[i].trim();
            if (l && !l.startsWith('-') && !l.startsWith('|') && !l.startsWith('#')) {
                return l;
            }
        }
        return '';
    }

    /**
     * Count filled star characters (★) in a string.
     */
    function countStars(str) {
        return (str.match(/★/g) || []).length;
    }

    /**
     * Render star string to HTML with styled spans.
     */
    function renderStars(str) {
        return str
            .replace(/★/g, '<span class="pd-star-filled" aria-hidden="true">★</span>')
            .replace(/☆/g, '<span class="pd-star-empty"  aria-hidden="true">☆</span>');
    }

    /**
     * Extract emoji prefix and remaining name text from a heading like "🌳 樟樹".
     */
    function splitEmojiName(str) {
        var m = str.match(/^(\S+)\s+(.+)$/);
        if (m) return { emoji: m[1], name: m[2] };
        return { emoji: '🌿', name: str };
    }

    /**
     * Convert paragraphs to <p> tags (double-newline splits).
     */
    function paragraphs(text) {
        return text.trim().split(/\n{2,}/)
            .map(function (p) { return p.trim(); })
            .filter(Boolean)
            .map(function (p) { return '<p class="pd-story-para">' + p.replace(/\n/g, ' ') + '</p>'; })
            .join('');
    }

    /* ===================================================================
       Main Parser
       =================================================================== */

    /**
     * Parse raw markdown text into a structured plant data object.
     */
    function parsePlantMarkdown(raw) {
        // Normalize Windows CRLF → LF so all regex/split logic works uniformly
        raw = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        var data = {};

        // ── Split sections by horizontal rule ─────────────────────────
        var blocks = raw.split(/\n---\n/);
        var header = (blocks[0] || '').trim();
        var sectionBlocks = blocks.slice(1);

        // ── Header block ──────────────────────────────────────────────
        var nameMatch = header.match(/^#\s+(.+)/m);
        if (nameMatch) {
            var split = splitEmojiName(nameMatch[1].trim());
            data.emoji = split.emoji;
            data.name  = split.name;
        } else {
            data.emoji = '🌿';
            data.name  = 'Unknown Plant';
        }

        var charMatch = header.match(/^###\s+(.+)/m);
        data.characterTitle = charMatch ? charMatch[1].trim() : '';

        var tagLine = header.split('\n').find(function (l) { return l.includes('🏷️'); });
        if (tagLine) {
            data.tags = tagLine
                .replace(/🏷️/g, '')
                .split('｜')
                .map(function (t) { return t.trim(); })
                .filter(Boolean);
        } else {
            data.tags = [];
        }

        // ── Section blocks ────────────────────────────────────────────
        sectionBlocks.forEach(function (block) {
            var trimmed = block.trim();
            if (!trimmed) return;

            var h2Match = trimmed.match(/^##\s+(.+)/m);
            if (!h2Match) return;

            var heading = h2Match[1].trim();
            // Content = everything after the h2 line
            var content = trimmed.slice(trimmed.indexOf('\n') + 1).trim();

            if (/Bloom Snapshot/i.test(heading)) {
                data.bloomSnapshot = parseTable(content);

            } else if (/Discovery Clues/i.test(heading)) {
                data.discoveryIntro  = extractIntro(content);
                data.discoveryClues  = parseBullets(content);

            } else if (/Story Behind|The Story/i.test(heading)) {
                data.storyHeading = heading;
                data.story        = content;

            } else if (/Calendar/i.test(heading)) {
                data.calHeading  = heading;
                data.calendarRows = parseTable(content);

            } else if (/Best Viewing Spots/i.test(heading)) {
                data.viewingSpots = parseViewingSpots(content);

            } else if (/Plant Passport/i.test(heading)) {
                data.passport = parseTable(content);

            } else if (/Challenges Facing|Challenge/i.test(heading)) {
                data.challenges = parseH3Sections(content);

            } else if (/How Can We Help|How Can/i.test(heading)) {
                data.actions = parseH3Sections(content);

            } else if (/Continue Exploring/i.test(heading)) {
                data.related = parseRelated(content);
            }
        });

        return data;
    }

    /**
     * Parse "Best Viewing Spots" H3 sections.
     * Extracts title, star rating (from 推薦指數 line), and description.
     */
    function parseViewingSpots(content) {
        var secs = parseH3Sections(content);
        return secs.map(function (sec) {
            var bodyLines = sec.body.split('\n');
            var ratingLine = bodyLines.find(function (l) { return l.includes('推薦指數'); });
            var rating = ratingLine ? countStars(ratingLine) : 3;
            var desc = bodyLines
                .filter(function (l) { return l.trim() && !l.includes('推薦指數'); })
                .join(' ').trim();
            return { title: sec.title, rating: rating, desc: desc };
        });
    }

    /**
     * Parse "Continue Exploring" into related-plant objects.
     * Format: ### 🌳 榕樹 \n **Character Title** \n description
     */
    function parseRelated(content) {
        var secs = parseH3Sections(content);
        return secs.map(function (sec) {
            var split = splitEmojiName(sec.title);
            var bodyLines = sec.body.split('\n');
            var charLine = '';
            var descLines = [];
            bodyLines.forEach(function (l) {
                var trimL = l.trim();
                if (/^\*\*.+\*\*$/.test(trimL)) {
                    charLine = trimL.replace(/\*\*/g, '').trim();
                } else if (trimL) {
                    descLines.push(trimL);
                }
            });
            return {
                emoji:     split.emoji,
                name:      split.name,
                character: charLine,
                desc:      descLines.join(' ')
            };
        });
    }

    /* ===================================================================
       Render Functions
       =================================================================== */

    function setText(id, val) {
        var el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    function setHtml(id, val) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = val;
    }

    /** S1 Hero */
    function renderHero(data, plantName, collection) {
        var heroBg = document.getElementById('pdHeroBg');
        var heroEl = document.querySelector('.pd-hero');

        // Step 1: Apply collection gradient immediately (zero layout shift)
        var gradients = {
            spring:    'linear-gradient(160deg, #4a0a24 0%, #8c1f48 32%, #c0396c 62%, #6a0a30 100%)',
            seasonal:  'linear-gradient(160deg, #3a1200 0%, #7a320a 32%, #c05e0a 62%, #4a1800 100%)',
            landmarks: 'linear-gradient(160deg, #062009 0%, #1a4d1a 32%, #2e7d32 62%, #0a2810 100%)',
            evergreen: 'linear-gradient(160deg, #002820 0%, #004d44 32%, #00695c 62%, #003230 100%)'
        };
        if (heroBg) heroBg.style.background = gradients[collection] || gradients.landmarks;

        // Step 2: Mark as no-photo initially; add bokeh ambient layer
        if (heroEl) {
            heroEl.classList.add('pd-hero--no-photo');
            var bokeh = document.createElement('div');
            bokeh.className = 'pd-hero__bokeh';
            bokeh.setAttribute('aria-hidden', 'true');
            var firstChild = heroEl.firstChild;
            heroEl.insertBefore(bokeh, firstChild ? firstChild.nextSibling : null);
        }

        // Step 3: Async — load real photo, cross-fade in on a separate layer
        PlantImages.loadPrimary(plantName).then(function (src) {
            if (!src || !heroBg) return;

            var photoBg = document.createElement('div');
            photoBg.className = 'pd-hero__bg-photo';
            photoBg.setAttribute('aria-hidden', 'true');
            photoBg.style.backgroundImage = 'url(' + src + ')';

            // Insert between gradient bg and the overlay (keeps overlay on top)
            heroBg.parentNode.insertBefore(photoBg, heroBg.nextSibling);

            // Trigger CSS fade-in after two frames (ensures transition fires)
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    photoBg.classList.add('revealed');
                });
            });

            // Remove no-photo state once photo is clearly visible (after transition)
            setTimeout(function () {
                if (heroEl) {
                    heroEl.classList.remove('pd-hero--no-photo');
                    var bokehEl = heroEl.querySelector('.pd-hero__bokeh');
                    if (bokehEl) bokehEl.parentNode.removeChild(bokehEl);
                }
            }, 1400);
        });

        // Collection badge
        var badge = COLLECTION_LABELS[collection] || '🌿 Campus Plant';
        setHtml('pdCollectionBadge', badge);

        // Character title, plant name
        setText('pdCharacter', data.characterTitle || '');
        setText('pdName', (data.emoji || '') + ' ' + (data.name || plantName));

        // Tags
        var tagsHtml = (data.tags || []).map(function (t) {
            return '<span class="pd-hero__tag" role="listitem">' + escHtml(t) + '</span>';
        }).join('');
        setHtml('pdHeroTags', tagsHtml);

        // Top nav
        setText('pdTopName', data.name || plantName);
        setHtml('pdTopCollection', COLLECTION_LABELS[collection] || '');

        // Trigger hero load animation
        if (heroEl) requestAnimationFrame(function () { heroEl.classList.add('loaded'); });
    }

    /** S2 Bloom Snapshot */
    function renderBloomSnapshot(rows) {
        if (!rows || !rows.length) return;
        var html = rows.map(function (row) {
            var label = row[0] || '';
            var value = row[1] || '';
            var starCount = countStars(value);
            var maxStars  = 5;
            var barWidth  = starCount / maxStars;
            var hasStars  = /★|☆/.test(value);

            return '<div class="pd-stat-card pd-reveal" role="listitem">' +
                '<div class="pd-stat-card__icon-row">' +
                    '<span class="pd-stat-card__icon" aria-hidden="true">' + extractEmoji(label) + '</span>' +
                    '<span class="pd-stat-card__label">' + escHtml(stripEmoji(label)) + '</span>' +
                '</div>' +
                (hasStars
                    ? '<div class="pd-stat-card__stars" aria-label="評分 ' + starCount + ' 顆星">' + renderStars(value) + '</div>' +
                      '<div class="pd-stat-card__bar"><div class="pd-stat-card__bar-fill" style="--bar-w:' + barWidth + '" aria-hidden="true"></div></div>'
                    : '<div class="pd-stat-card__value">' + escHtml(value) + '</div>') +
            '</div>';
        }).join('');
        setHtml('pdStatsGrid', html);
    }

    /** S3 Discovery Clues */
    function renderDiscoveryClues(intro, bullets) {
        if (intro) setText('pdCluesIntro', intro);
        if (!bullets || !bullets.length) return;
        var html = bullets.map(function (bullet, i) {
            var emoji = extractEmoji(bullet);
            var text  = emoji ? stripEmoji(bullet).trim() : bullet;
            return '<div class="pd-clue-card pd-reveal" role="listitem">' +
                '<span class="pd-clue-card__num" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' +
                (emoji ? '<span class="pd-clue-card__emoji" aria-hidden="true">' + emoji + '</span>' : '') +
                '<span class="pd-clue-card__text">' + escHtml(text) + '</span>' +
            '</div>';
        }).join('');
        setHtml('pdCluesGrid', html);
    }

    /** S4 Story */
    function renderStory(data) {
        if (!data.story) return;
        // Update chapter label
        if (data.storyHeading) {
            var raw = data.storyHeading;
            // Clean emoji prefix for label
            setHtml('pdStoryLabel', '📖 THE STORY · 植物的故事');
            var storyTitleEl = document.getElementById('pd-s4-title');
            if (storyTitleEl) storyTitleEl.textContent = stripEmoji(raw).trim() || '這株植物的故事';
        }
        setHtml('pdStoryBody', paragraphs(data.story));
    }

    /** S5 Viewing Calendar */
    function renderCalendar(rows, heading) {
        if (!rows || !rows.length) return;
        if (heading) {
            setHtml('pdCalLabel', '📅 ' + stripEmoji(heading).trim().toUpperCase() + ' · 觀賞時曆');
        }

        var currentMonth = new Date().getMonth() + 1; // 1-12
        var html = rows.map(function (row) {
            var monthLabel = row[0] || '';
            var ratingStr  = row[1] || '';
            var score      = countStars(ratingStr);
            var heightPct  = score * 20;
            var monthNum   = parseInt(monthLabel, 10);
            var isCurrent  = monthNum === currentMonth;
            var tooltip    = monthLabel + '：' + (ratingStr || '無資料');

            return '<div class="pd-cal-bar-wrap' + (isCurrent ? ' current-month' : '') + '" ' +
                   'data-tooltip="' + escAttr(tooltip) + '" ' +
                   'aria-label="' + escAttr(tooltip) + '">' +
                '<div class="pd-cal-bar-track">' +
                    '<div class="pd-cal-bar-fill pd-reveal" data-score="' + score + '" ' +
                         'style="height:' + heightPct + '%" aria-hidden="true"></div>' +
                '</div>' +
                '<span class="pd-cal-month">' + escHtml(monthLabel) + '</span>' +
            '</div>';
        }).join('');
        setHtml('pdCalChart', html);
    }

    /** S6 Viewing Spots */
    function renderViewingSpots(spots) {
        if (!spots || !spots.length) return;
        var html = spots.map(function (spot) {
            var emoji = extractEmoji(spot.title);
            var name  = emoji ? stripEmoji(spot.title).trim() : spot.title;
            var stars = '';
            for (var i = 0; i < 5; i++) {
                stars += i < spot.rating
                    ? '<span class="pd-star-filled">★</span>'
                    : '<span class="pd-star-empty">☆</span>';
            }
            return '<div class="pd-spot-card pd-reveal" role="listitem">' +
                '<div class="pd-spot-card__header">' +
                    '<div class="pd-spot-card__pin" aria-hidden="true">' + (emoji || '📍') + '</div>' +
                    '<div class="pd-spot-card__name">' + escHtml(name) + '</div>' +
                '</div>' +
                '<div class="pd-spot-card__stars" aria-label="推薦指數 ' + spot.rating + ' 顆星">' + stars + '</div>' +
                '<p class="pd-spot-card__desc">' + escHtml(spot.desc) + '</p>' +
            '</div>';
        }).join('');
        setHtml('pdSpotsGrid', html);
    }

    /** S7 Plant Passport */
    function renderPassport(rows) {
        if (!rows || !rows.length) return;
        var html = rows.map(function (row) {
            var label = row[0] || '';
            var value = row[1] || '';
            // Detect scientific name (usually all Latin letters + whitespace)
            var isLatin = /^[A-Za-z\s().]+$/.test(value.trim()) && value.trim().length > 3;
            var valueHtml = isLatin
                ? '<em>' + escHtml(value) + '</em>'
                : escHtml(value);
            return '<div class="pd-passport-row" role="row">' +
                '<div class="pd-passport-label" role="rowheader">' + escHtml(label) + '</div>' +
                '<div class="pd-passport-value" role="cell">' + valueHtml + '</div>' +
            '</div>';
        }).join('');
        setHtml('pdPassport', html);
    }

    /** S8 Challenges */
    function renderChallenges(challenges) {
        if (!challenges || !challenges.length) return;
        var html = challenges.map(function (ch) {
            var emoji = extractEmoji(ch.title);
            var title = emoji ? stripEmoji(ch.title).trim() : ch.title;
            return '<div class="pd-challenge-card pd-reveal" role="listitem">' +
                '<div class="pd-challenge-card__header">' +
                    '<span class="pd-challenge-card__icon" aria-hidden="true">' + (emoji || '⚠️') + '</span>' +
                    '<span class="pd-challenge-card__title">' + escHtml(title) + '</span>' +
                '</div>' +
                '<p class="pd-challenge-card__desc">' + escHtml(ch.body) + '</p>' +
            '</div>';
        }).join('');
        setHtml('pdChallengesGrid', html);
    }

    /** S9 Actions */
    function renderActions(actions) {
        if (!actions || !actions.length) return;
        var html = actions.map(function (act, i) {
            var emoji = extractEmoji(act.title);
            var title = emoji ? stripEmoji(act.title).trim() : act.title;
            return '<div class="pd-action-card pd-reveal" role="listitem">' +
                '<div class="pd-action-card__num" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</div>' +
                '<span class="pd-action-card__icon" aria-hidden="true">' + (emoji || '💚') + '</span>' +
                '<div class="pd-action-card__body">' +
                    '<div class="pd-action-card__title">' + escHtml(title) + '</div>' +
                    '<p class="pd-action-card__desc">' + escHtml(act.body) + '</p>' +
                '</div>' +
            '</div>';
        }).join('');
        setHtml('pdActionsGrid', html);
    }

    /** S10 Related Plants */
    function renderRelated(related) {
        if (!related || !related.length) return;
        var html = related.map(function (plant) {
            var href = 'pages/plant-detail.html?plant=' + encodeURIComponent(plant.name);
            // Always render placeholder first — real photo injected async below
            var phHtml =
                '<div class="pd-related-placeholder" aria-hidden="true">' +
                    '<span class="pd-related-placeholder__emoji">' + escHtml(plant.emoji) + '</span>' +
                    '<span class="pd-related-placeholder__name">'  + escHtml(plant.name)  + '</span>' +
                '</div>';

            return '<a class="pd-related-card pd-reveal" href="' + href + '" role="listitem"' +
                ' aria-label="前往 ' + escAttr(plant.name) + ' 詳情"' +
                ' data-related-plant="' + escAttr(plant.name) + '">' +
                '<div class="pd-related-card__photo">' + phHtml + '</div>' +
                '<div class="pd-related-card__body">' +
                    '<div class="pd-related-card__name">'  + escHtml(plant.name)      + '</div>' +
                    (plant.character ? '<div class="pd-related-card__char">' + escHtml(plant.character) + '</div>' : '') +
                    (plant.desc      ? '<p class="pd-related-card__desc">'   + escHtml(plant.desc)      + '</p>'   : '') +
                '</div>' +
            '</a>';
        }).join('');
        setHtml('pdRelatedGrid', html);

        // Async: inject real photos where available
        var grid = document.getElementById('pdRelatedGrid');
        related.forEach(function (plant) {
            PlantImages.loadPrimary(plant.name).then(function (src) {
                if (!src || !grid) return;
                var card = grid.querySelector('[data-related-plant="' + plant.name.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"]');
                if (!card) return;
                var photoDiv = card.querySelector('.pd-related-card__photo');
                if (!photoDiv) return;
                var img = document.createElement('img');
                img.alt     = plant.name;
                img.loading = 'lazy';
                img.onerror = function () {
                    if (img.parentNode) img.parentNode.removeChild(img);
                    var ph = photoDiv.querySelector('.pd-related-placeholder');
                    if (ph) ph.style.display = '';
                };
                var ph = photoDiv.querySelector('.pd-related-placeholder');
                if (ph) ph.style.display = 'none';
                photoDiv.insertBefore(img, photoDiv.firstChild);
                img.src = src;
            });
        });
    }

    /* ===================================================================
       PHOTO GALLERY + LIGHTBOX
       =================================================================== */

    var _galleryImages = [];   // [{src, alt}]  — populated by renderGallery
    var _lbIndex = 0;          // current lightbox index

    /**
     * Inject a single magazine-split photo slot.
     * @param {string} slotId   — element id, e.g. 'pdMagPhoto2'
     * @param {string} src      — image URL
     * @param {string} caption  — data-caption text (shown on hover)
     */
    function _injectMagPhoto(slotId, src, caption) {
        var slot = document.getElementById(slotId);
        if (!slot || !src) return;
        var img = document.createElement('img');
        img.src      = src;
        img.alt      = caption || '';
        img.loading  = 'lazy';
        img.decoding = 'async';
        slot.setAttribute('data-caption', caption || '');
        slot.appendChild(img);
        // Staggered entrance: reveal after a short delay so page content
        // has already painted before the image fades in.
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                slot.classList.add('has-photo');
            });
        });
    }

    /**
     * Inject photos 2 and 3 into the magazine split slots beside
     * Discovery Clues (S3) and Viewing Spots (S6).
     * Uses the cached PlantImages result — no extra network request.
     */
    function renderMagazinePhotos(plantName) {
        PlantImages.loadAll(plantName).then(function (urls) {
            if (urls[1]) _injectMagPhoto('pdMagPhoto2', urls[1], plantName + ' · Field Photo 2');
            if (urls[2]) _injectMagPhoto('pdMagPhoto3', urls[2], plantName + ' · Field Photo 3');
        });
    }

    /**
     * Load all images for plantName, then build the editorial layout and
     * mobile strip. Shows the gallery section only when images exist.
     */
    function renderGallery(plantName) {
        var section     = document.getElementById('pd-gallery');
        var primaryCell = document.getElementById('pdGalleryPrimary');
        var cell1       = document.getElementById('pdGalleryCell1');
        var cell2       = document.getElementById('pdGalleryCell2');
        var stripInner  = document.getElementById('pdGalleryStripInner');
        var dotsWrap    = document.getElementById('pdGalleryDots');
        if (!section) return;

        PlantImages.loadAll(plantName).then(function (urls) {
            if (!urls.length) return; // no photos — keep section hidden

            // Build internal image list with captions
            _galleryImages = urls.map(function (src, i) {
                return { src: src, alt: plantName + ' — 實地紀錄 ' + (i + 1) };
            });

            // ── Desktop editorial ──────────────────────────────────────
            function setCell(imgEl, capEl, index) {
                if (!imgEl || index >= urls.length) return;
                imgEl.src = urls[index];
                imgEl.alt = _galleryImages[index].alt;
                if (capEl) capEl.textContent = plantName + '   /   ' + (index + 1) + ' of ' + urls.length;
            }

            var img0 = document.getElementById('pdGalleryImg0');
            var img1 = document.getElementById('pdGalleryImg1');
            var img2 = document.getElementById('pdGalleryImg2');
            var cap0 = document.getElementById('pdGalleryCap0');

            setCell(img0, cap0, 0);
            setCell(img1, null, 1);
            setCell(img2, null, 2);

            // Hide supporting slots that have no image
            if (urls.length < 3 && cell2) cell2.style.display = 'none';
            if (urls.length < 2 && cell1) cell1.style.display = 'none';

            // ── Mobile strip ───────────────────────────────────────────
            if (stripInner) {
                stripInner.innerHTML = '';
                if (dotsWrap) dotsWrap.innerHTML = '';

                urls.forEach(function (src, i) {
                    // Strip item
                    var li = document.createElement('li');
                    li.className = 'pd-gallery__strip-item';
                    li.setAttribute('role', 'listitem');
                    li.setAttribute('aria-label', '查看第 ' + (i + 1) + ' 張照片');
                    li.dataset.index = i;
                    var img = document.createElement('img');
                    img.src     = src;
                    img.alt     = _galleryImages[i].alt;
                    img.loading = 'lazy';
                    img.decoding = 'async';
                    li.appendChild(img);
                    stripInner.appendChild(li);

                    // Dot
                    if (dotsWrap) {
                        var dot = document.createElement('button');
                        dot.className = 'pd-gallery__dot' + (i === 0 ? ' active' : '');
                        dot.setAttribute('aria-label', '第 ' + (i + 1) + ' 張');
                        dot.dataset.index = i;
                        dotsWrap.appendChild(dot);
                    }
                });

                // Sync dots on scroll
                initStripScroll(stripInner, dotsWrap, urls.length);
            }

            // ── Reveal section ─────────────────────────────────────────
            section.hidden = false;
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    section.classList.add('visible');
                });
            });

            // ── Wire click → lightbox ──────────────────────────────────
            [primaryCell, cell1, cell2].forEach(function (cell) {
                if (!cell) return;
                cell.addEventListener('click', function () {
                    openLightbox(parseInt(cell.dataset.index, 10) || 0);
                });
            });

            if (stripInner) {
                stripInner.addEventListener('click', function (e) {
                    var item = e.target.closest('.pd-gallery__strip-item');
                    if (item) openLightbox(parseInt(item.dataset.index, 10) || 0);
                });
            }
        });
    }

    /** Dot sync and touch-drag for mobile strip */
    function initStripScroll(strip, dotsWrap, count) {
        if (!strip) return;

        function updateDots(index) {
            if (!dotsWrap) return;
            dotsWrap.querySelectorAll('.pd-gallery__dot').forEach(function (d, i) {
                d.classList.toggle('active', i === index);
            });
        }

        // Scroll event → active dot
        strip.addEventListener('scroll', function () {
            var index = Math.round(strip.scrollLeft / strip.offsetWidth * (count / 0.82));
            updateDots(Math.min(Math.max(index, 0), count - 1));
        }, { passive: true });

        // Dot click → scroll to item
        if (dotsWrap) {
            dotsWrap.addEventListener('click', function (e) {
                var dot = e.target.closest('.pd-gallery__dot');
                if (!dot) return;
                var i = parseInt(dot.dataset.index, 10);
                var items = strip.querySelectorAll('.pd-gallery__strip-item');
                if (items[i]) {
                    items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        }

        // Mouse drag-to-scroll
        var startX, scrollStart, isDragging = false;
        strip.addEventListener('mousedown', function (e) {
            isDragging = true;
            startX = e.pageX - strip.offsetLeft;
            scrollStart = strip.scrollLeft;
            strip.classList.add('dragging');
        });
        document.addEventListener('mouseup', function () {
            isDragging = false;
            strip.classList.remove('dragging');
        });
        strip.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            e.preventDefault();
            strip.scrollLeft = scrollStart - (e.pageX - strip.offsetLeft - startX);
        });
    }

    /* ------------------------------------------------------------------
       Lightbox
       ------------------------------------------------------------------ */

    function openLightbox(index) {
        var lb = document.getElementById('pdLightbox');
        if (!lb || !_galleryImages.length) return;

        _lbIndex = Math.max(0, Math.min(index, _galleryImages.length - 1));

        if (_galleryImages.length === 1) lb.classList.add('single');
        else lb.classList.remove('single');

        lb.hidden = false;
        document.body.style.overflow = 'hidden';

        // Re-trigger entrance animation
        var stage = lb.querySelector('.pd-lightbox__stage');
        if (stage) {
            stage.style.animation = 'none';
            stage.offsetWidth; // reflow
            stage.style.animation = '';
        }

        setLightboxImage(_lbIndex);
        trapFocus(lb);
    }

    function closeLightbox() {
        var lb = document.getElementById('pdLightbox');
        if (!lb) return;
        lb.hidden = true;
        document.body.style.overflow = '';
        releaseFocus();
    }

    function setLightboxImage(index) {
        var img     = document.getElementById('pdLightboxImg');
        var caption = document.getElementById('pdLightboxCaption');
        var counter = document.getElementById('pdLightboxCounter');
        if (!img) return;

        var item = _galleryImages[index];
        if (!item) return;

        img.classList.add('swapping');
        setTimeout(function () {
            img.src = item.src;
            img.alt = item.alt;
            if (caption) caption.textContent = item.alt;
            if (counter) counter.textContent = (index + 1) + ' / ' + _galleryImages.length;
            img.classList.remove('swapping');
        }, 220);
    }

    function prevLightbox() {
        _lbIndex = (_lbIndex - 1 + _galleryImages.length) % _galleryImages.length;
        setLightboxImage(_lbIndex);
    }
    function nextLightbox() {
        _lbIndex = (_lbIndex + 1) % _galleryImages.length;
        setLightboxImage(_lbIndex);
    }

    function initLightboxControls() {
        var lb     = document.getElementById('pdLightbox');
        var close  = document.getElementById('pdLbClose');
        var prev   = document.getElementById('pdLbPrev');
        var next   = document.getElementById('pdLbNext');
        var backdrop = document.getElementById('pdLightboxBackdrop');
        if (!lb) return;

        if (close)    close.addEventListener('click', closeLightbox);
        if (backdrop) backdrop.addEventListener('click', closeLightbox);
        if (prev)     prev.addEventListener('click', prevLightbox);
        if (next)     next.addEventListener('click', nextLightbox);

        // Keyboard
        document.addEventListener('keydown', function (e) {
            if (lb.hidden) return;
            if (e.key === 'Escape')     closeLightbox();
            if (e.key === 'ArrowLeft')  prevLightbox();
            if (e.key === 'ArrowRight') nextLightbox();
        });

        // Touch swipe
        var touchStartX = 0;
        lb.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        lb.addEventListener('touchend', function (e) {
            var dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 50) {
                if (dx < 0) nextLightbox(); else prevLightbox();
            }
        }, { passive: true });
    }

    /* Focus trap helpers */
    var _prevFocused;
    function trapFocus(el) {
        _prevFocused = document.activeElement;
        var focusable = el.querySelectorAll('button, [tabindex="0"]');
        if (focusable.length) focusable[0].focus();
    }
    function releaseFocus() {
        if (_prevFocused) _prevFocused.focus();
    }

    /* ===================================================================
       UI Helpers
       =================================================================== */

    /** Build side nav dots and attach IntersectionObserver */
    function initSideNav() {
        var nav = document.getElementById('pdSideNav');
        if (!nav) return;

        SECTION_DOTS.forEach(function (sec) {
            var el = document.getElementById(sec.id);
            if (!el) return;
            var dot = document.createElement('button');
            dot.className = 'pd-sidenav-dot';
            dot.setAttribute('data-label', sec.label);
            dot.setAttribute('aria-label', '跳至 ' + sec.label + ' 章節');
            dot.addEventListener('click', function () {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            dot.dataset.target = sec.id;
            nav.appendChild(dot);
        });

        var dots = nav.querySelectorAll('.pd-sidenav-dot');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.id;
                    dots.forEach(function (d) {
                        d.classList.toggle('active', d.dataset.target === id);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

        SECTION_DOTS.forEach(function (sec) {
            var el = document.getElementById(sec.id);
            if (el) observer.observe(el);
        });
    }

    /** Attach scroll reveal via IntersectionObserver */
    function initScrollReveal() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger children
                    var children = entry.target.querySelectorAll('.pd-reveal');
                    if (children.length) {
                        children.forEach(function (child, i) {
                            setTimeout(function () { child.classList.add('revealed'); }, i * 80);
                        });
                    }
                    // Reveal the container itself if it has pd-reveal
                    if (entry.target.classList.contains('pd-reveal')) {
                        entry.target.classList.add('revealed');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

        document.querySelectorAll('.pd-s').forEach(function (s) {
            observer.observe(s);
        });
    }

    /** Top nav scroll behaviour */
    function initTopNav() {
        var nav = document.getElementById('pdTopNav');
        var nameEl = document.getElementById('pdTopName');
        if (!nav) return;
        var heroHeight = window.innerHeight * 0.6;

        window.addEventListener('scroll', function () {
            var scrolled = window.scrollY > heroHeight * 0.8;
            nav.classList.toggle('pd-topnav--scrolled', scrolled);
            if (nameEl) nameEl.classList.toggle('visible', scrolled);
        }, { passive: true });
    }

    /** Hero parallax */
    function initParallax() {
        var bg   = document.getElementById('pdHeroBg');
        var hero = document.querySelector('.pd-hero');
        if (!bg || !hero) return;

        // Honour reduced-motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var scrollY = window.scrollY || window.pageYOffset;
                var heroH   = hero.offsetHeight;
                if (scrollY <= heroH + 200) {
                    var shift = scrollY * 0.38;
                    var t     = 'translateY(' + shift + 'px)';
                    bg.style.transform = t;
                    // Apply same shift to photo layer if present
                    var photoBg = hero.querySelector('.pd-hero__bg-photo');
                    if (photoBg) photoBg.style.transform = t;
                }
                ticking = false;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /** Apply collection colour to body data attribute */
    function applyCollection(collection) {
        document.body.dataset.collection = collection || 'landmarks';
    }

    /** Show / hide loading overlay */
    function hideLoading() {
        var el = document.getElementById('pdLoading');
        if (el) {
            setTimeout(function () { el.classList.add('hidden'); }, 400);
        }
    }

    function showError(message) {
        var el = document.getElementById('pdLoading');
        if (el) {
            el.querySelector('.pd-loading__icon').textContent = '🍂';
            el.querySelector('.pd-loading__text').textContent = message || '找不到植物資料';
        }
    }

    /* ===================================================================
       Escape Helpers (security: prevent XSS)
       =================================================================== */

    function escHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    function escAttr(str) {
        return escHtml(str).replace(/\n/g, ' ');
    }

    /* ===================================================================
       Emoji Extraction Helpers
       =================================================================== */

    // Matches most common emoji ranges
    var EMOJI_RE = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{27FF}\u{2300}-\u{23FF}⭐📍🌿🌳🌲🍃🌸🌼🎄☂️🐛]/u;

    function extractEmoji(str) {
        if (!str) return '';
        // Try unicode emoji at the start
        var m = str.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\u{1F300}-\u{1FFFF}]|\S)/u);
        // A simpler approach: grab first character if it's not ASCII alphanumeric
        var chars = Array.from(str || '');
        if (!chars.length) return '';
        var first = chars[0];
        // If it looks emoji-ish (non-ASCII, non-CJK-pure-text)
        if (first.codePointAt(0) > 0x2000) return first;
        return '';
    }

    function stripEmoji(str) {
        if (!str) return '';
        var chars = Array.from(str);
        while (chars.length && chars[0].codePointAt(0) > 0x2000) {
            chars.shift();
        }
        return chars.join('').trim();
    }

    /* ===================================================================
       Bootstrap
       =================================================================== */

    function init() {
        // Get plant name from URL param
        var params   = new URLSearchParams(window.location.search);
        var plantName = params.get('plant');

        if (!plantName) {
            showError('請提供植物名稱（?plant=樟樹）');
            return;
        }

        // Set document title immediately
        document.title = plantName + ' — 校園植物探索';

        // Determine collection for colour theming
        var collection = PLANT_COLLECTION[plantName] || 'landmarks';
        applyCollection(collection);

        // Init UI behaviours
        initTopNav();
        initParallax();

        // Fetch and parse markdown
        fetch('data/plants/' + encodeURIComponent(plantName) + '.md')
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(function (rawMd) {
                var data = parsePlantMarkdown(rawMd);

                renderHero(data, plantName, collection);
                renderBloomSnapshot(data.bloomSnapshot);
                renderDiscoveryClues(data.discoveryIntro, data.discoveryClues);
                renderStory(data);
                renderCalendar(data.calendarRows, data.calHeading);
                renderViewingSpots(data.viewingSpots);
                renderPassport(data.passport);
                renderChallenges(data.challenges);
                renderActions(data.actions);
                renderRelated(data.related);
                renderGallery(plantName);
                renderMagazinePhotos(plantName);

                // Initialise after DOM is populated
                initSideNav();
                initScrollReveal();
                initLightboxControls();
                hideLoading();
            })
            .catch(function (err) {
                console.error('[plant-detail] Failed to load plant data:', err);
                showError('找不到「' + plantName + '」的資料，請確認植物名稱是否正確。');
            });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}());
