/**
 * Species Data
 * ============
 * Single source of truth for all species displayed on the website.
 *
 * To add a new species:
 *   1. Choose a unique camelCase key (e.g. 'turtle').
 *   2. Add an entry to speciesData below following the schema.
 *   3. Add a <li data-species="turtle"> to the correct list in index.html.
 *   4. Optionally add a .spot on the map with data-species="turtle".
 *
 * Schema (all fields required unless marked optional):
 * ┌─────────────────┬──────────────────────────────────────────────────────┐
 * │ key             │ string  — unique identifier, matches data-species    │
 * │ name            │ string  — Chinese common name                        │
 * │ category        │ 'animal' | 'plant'                                   │
 * │ avatar          │ string  — path to thumbnail image (images/*.jpg)     │
 * │ scientific      │ string  — Latin scientific name                      │
 * │ classification  │ string  — full taxonomic hierarchy, zh + Latin       │
 * │ dist            │ string  — HTML <ul> for distribution info            │
 * │ threats         │ string  — HTML <ul> for threat factors               │
 * │ conservation    │ string  — HTML <ul> for conservation actions         │
 * └─────────────────┴──────────────────────────────────────────────────────┘
 */

// ---------------------------------------------------------------------------
// Animals
// ---------------------------------------------------------------------------

const animals = {

    squirrel: {
        name: '赤腹松鼠',
        category: 'animal',
        avatar: 'images/赤腹松鼠.jpg',
        scientific: 'Callosciurus erythraeus',
        classification: '哺乳綱 Mammalia／囓齒目 Rodentia／松鼠科 Sciuridae／麗松鼠屬 Callosciurus',
        dist: `<ul>
            <li><strong>原生分布：</strong>主要分布於東亞與東南亞</li>
            <li><strong>台灣地區：</strong>幾乎全島皆可見，從低海拔到中海拔山區都能生存</li>
            <li><strong>棲地類型：</strong>偏好樹木茂密的環境，如闊葉林、人工林，也能適應都市綠地</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地破壞：</strong>都市開發與森林砍伐，使其原本的樹林棲地減少</li>
            <li><strong>人為干擾：</strong>過度接近人類活動區域，可能改變其覓食與行為模式</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>維護森林、生態綠地與校園樹林</li>
            <li><strong>環境教育：</strong>宣導不要餵食野生動物，避免改變其自然習性</li>
        </ul>`
    },

    magpie: {
        name: '台灣藍鵲',
        category: 'animal',
        avatar: 'images/台灣藍鵲.jpg',
        scientific: 'Urocissa caerulea',
        classification: '鳥綱 Aves／雀形目 Passeriformes／鴉科 Corvidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>台灣特有種</li>
            <li><strong>台灣地區：</strong>低海拔至中海拔森林，中大校園內極常見</li>
            <li><strong>棲地類型：</strong>偏好闊葉林或人為開發程度低的次生林</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地破碎化：</strong>都市開發導致低海拔森林棲地減少，影響其築巢與覓食範圍</li>
            <li><strong>人為干擾：</strong>育雛期間因護巢行為較強，常與人類產生衝突導致巢位受破壞</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>維護校園森林與大型樹木的完整性，提供安全的築巢環境</li>
            <li><strong>環境教育：</strong>宣導「不餵食、不干擾」，並教育師生理解其護巢的天性</li>
        </ul>`
    },

    lizard: {
        name: '斯文豪氏攀蜥',
        category: 'animal',
        avatar: 'images/斯文豪氏攀蜥.jpg',
        scientific: 'Diploderma swinhonis',
        classification: '爬行綱 Reptilia／有鱗目 Squamata／飛蜥科 Agamidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>台灣特有種</li>
            <li><strong>台灣地區：</strong>全島低海拔至中海拔山區，分布廣泛</li>
            <li><strong>棲地類型：</strong>偏好有樹木的環境，常見於樹幹與草叢間</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地破碎化：</strong>校園建物過多或樹木間距過大，限制其在樹冠層間移動與避敵</li>
            <li><strong>人為干擾：</strong>行人過度驚擾或校園流浪貓狗的捕食壓力，影響其族群穩定</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>維護校園森林與綠帶的連結性，保留樹木作為其活動與日曬場所</li>
            <li><strong>環境教育：</strong>宣導「遠觀而不捕捉」，讓師生了解其生態功能</li>
        </ul>`
    },

    frog: {
        name: '澤蛙',
        category: 'animal',
        avatar: 'images/澤蛙.jpg',
        scientific: 'Fejervarya limnocharis',
        classification: '兩棲綱 Amphibia／無尾目 Anura／叉舌蛙科 Dicroglossidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>東亞、東南亞及南亞大部分地區</li>
            <li><strong>台灣地區：</strong>全島平地及低海拔山區最常見的蛙類</li>
            <li><strong>棲地類型：</strong>稻田、草地、水溝及校園潮濕綠地</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地破碎化：</strong>校園內過多的水泥地與排水溝，阻隔了澤蛙移動與繁殖的路徑</li>
            <li><strong>農藥與化學汙染：</strong>會直接透過皮膚傷害兩棲類</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>保留校園內的草澤與落葉堆，提供生存空間</li>
            <li><strong>環境教育：</strong>保護校園天然的「生物捕蚊器」</li>
        </ul>`
    },

    dragonfly: {
        name: '霜白蜻蜓',
        category: 'animal',
        avatar: 'images/霜白蜻蜓.jpg',
        scientific: 'Orthetrum pruinosum',
        classification: '昆蟲綱 Insecta／蜻蜓目 Odonata／蜻蜓科 Libellulidae',
        dist: `<ul>
            <li><strong>原生分布：</strong>廣泛分佈於東亞、南亞及東南亞</li>
            <li><strong>台灣地區：</strong>普遍分佈於全島低海拔山區與平地</li>
            <li><strong>棲地類型：</strong>水池、溝渠、沼澤等緩流或靜止水域</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地破壞：</strong>校園水池或溼地若過度水泥化，導致幼蟲失去生存空間</li>
            <li><strong>水質污染：</strong>生活廢水或化學藥劑流入水域</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>棲地保護：</strong>維護校園生態池的自然植被</li>
            <li><strong>環境教育：</strong>了解蜻蜓作為生物指標的重要性</li>
        </ul>`
    }

};

// ---------------------------------------------------------------------------
// Plants
// ---------------------------------------------------------------------------

const plants = {

    cedar: {
        name: '台灣肖楠',
        category: 'plant',
        avatar: 'images/台灣肖楠.jpg',
        scientific: 'Calocedrus formosana',
        classification: '松柏綱 Coniferopsida／松柏目 Pinales／柏科 Cupressaceae',
        dist: `<ul>
            <li><strong>原生分布：</strong>台灣特有種</li>
            <li><strong>台灣地區：</strong>北部及中部中低海拔山區，校園常有栽植</li>
            <li><strong>棲地類型：</strong>偏好濕潤的山谷或溪澗旁</li>
        </ul>`,
        threats: `<ul>
            <li><strong>病蟲害侵襲：</strong>易受蚜蟲或介殼蟲危害</li>
            <li><strong>環境適應力：</strong>若排水不良容易引發根部腐爛</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>專業維護：</strong>定期進行病蟲害防治與枯枝清理</li>
            <li><strong>棲地管理：</strong>維持樹穴土壤疏鬆與排水通暢</li>
        </ul>`
    },

    juniper: {
        name: '龍柏',
        category: 'plant',
        avatar: 'images/龍柏.jpg',
        scientific: "Juniperus chinensis 'Kaizuka'",
        classification: '松柏綱 Coniferopsida／松柏目 Pinales／柏科 Cupressaceae',
        dist: `<ul>
            <li><strong>原生分布：</strong>東亞地區，如台灣、中國、日本</li>
            <li><strong>台灣地區：</strong>普遍栽植於校園景觀樹</li>
        </ul>`,
        threats: `<ul>
            <li><strong>病蟲害侵襲：</strong>易受紅蜘蛛或介殼蟲危害</li>
            <li><strong>人為破壞：</strong>若修剪不當傷口極難復原</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>專業照護：</strong>定期進行病蟲害防治與專業修剪</li>
            <li><strong>棲地管理：</strong>維持樹穴土壤的排水性與通風</li>
        </ul>`
    },

    paperbark: {
        name: '白千層',
        category: 'plant',
        avatar: 'images/白千層.jpg',
        scientific: 'Melaleuca leucadendra',
        classification: '木蘭綱 Magnoliopsida／桃金孃目 Myrtales／桃金孃科 Myrtaceae',
        dist: `<ul>
            <li><strong>原生分布：</strong>澳洲、東南亞</li>
            <li><strong>台灣地區：</strong>全台各地廣泛栽種</li>
        </ul>`,
        threats: `<ul>
            <li><strong>人為破壞：</strong>海綿狀的樹皮容易被剝除，影響水分傳導</li>
            <li><strong>棲地退化：</strong>土壤過度板結導致根系無法呼吸</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>環境教育：</strong>宣導「不隨手剝樹皮」，守護校園樹木健康</li>
        </ul>`
    },

    acacia: {
        name: '相思樹',
        category: 'plant',
        avatar: 'images/相思樹.jpg',
        scientific: 'Acacia confusa',
        classification: '木蘭綱 Magnoliopsida／豆目 Fabales／豆科 Fabaceae',
        dist: `<ul>
            <li><strong>原生分布：</strong>台灣、菲律賓及越南北部</li>
            <li><strong>台灣地區：</strong>全島低海拔丘陵及平地</li>
        </ul>`,
        threats: `<ul>
            <li><strong>棲地開發：</strong>硬舖面增加限制其根系生長空間</li>
            <li><strong>病蟲害侵襲：</strong>易受褐根病危害</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>專業維護：</strong>定期進行安全巡檢與枯枝修剪</li>
            <li><strong>棲地管理：</strong>維持樹穴透氣性</li>
        </ul>`
    },

    cherry: {
        name: '櫻花',
        category: 'plant',
        avatar: 'images/山櫻花.jpg',
        scientific: 'Prunus spp.',
        classification: '木蘭綱 Magnoliopsida／薔薇目 Rosales／薔薇科 Rosaceae',
        dist: `<ul>
            <li><strong>原生分布：</strong>北半球溫帶地區</li>
            <li><strong>台灣地區：</strong>全台山區及校園栽植區</li>
        </ul>`,
        threats: `<ul>
            <li><strong>氣候變遷：</strong>暖冬與異常降雨導致花期紊亂</li>
            <li><strong>人為干擾：</strong>遊客攀折花木或踐踏根部</li>
        </ul>`,
        conservation: `<ul>
            <li><strong>環境教育：</strong>宣導「賞花不折花」，提升保護意識</li>
        </ul>`
    }

};

// ---------------------------------------------------------------------------
// Merged lookup table (used by modal.js: speciesData[key])
// ---------------------------------------------------------------------------

const speciesData = { ...animals, ...plants };

// ---------------------------------------------------------------------------
// Utility helpers (available globally for future use)
// ---------------------------------------------------------------------------

/**
 * Return all species entries matching a given category.
 * @param {'animal'|'plant'} category
 * @returns {Object.<string, Object>} Subset of speciesData
 */
function getSpeciesByCategory(category) {
    return Object.fromEntries(
        Object.entries(speciesData).filter(([, v]) => v.category === category)
    );
}

/**
 * Return all registered species keys.
 * @returns {string[]}
 */
function getAllSpeciesKeys() {
    return Object.keys(speciesData);
}

/**
 * Check whether a key exists in the dataset.
 * @param {string} key
 * @returns {boolean}
 */
function hasSpecies(key) {
    return Object.prototype.hasOwnProperty.call(speciesData, key);
}

// CommonJS export (no-op in browser; used if ever run in Node.js / tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { speciesData, getSpeciesByCategory, getAllSpeciesKeys, hasSpecies };
}
