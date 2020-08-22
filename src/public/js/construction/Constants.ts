import {FontHelper} from './helpers/FontHelper.js';

export const RESPONSIVE_SIZE_REGEX = [/col\-([0-9]+)/, /col\-sm\-([0-9]+)/, /col\-md\-([0-9]+)/, /col\-lg\-([0-9]+)/, /col\-xl\-([0-9]+)/];
export const RESPONSIVE_OFFSET_REGEX = [/offset\-([0-9]+)/, /offset\-sm\-([0-9]+)/, /offset\-md\-([0-9]+)/, /offset\-lg\-([0-9]+)/, /offset\-xl\-([0-9]+)/];
export const ALL_RESPONSIVE_SIZE_REGEX = /col\-((sm|md|lg|xl)\-)?[0-9]+/g;
export const ALL_RESPONSIVE_OFFSET_REGEX = /offset\-((sm|md|lg|xl)\-)?[0-9]+/g;
export const SIZES_IN_DESCRIPTION = ["pixels", "points", "relative to font-size", "relative to font-size of root", "relative to viewport width", "relative to viewport height", "relative to parent"];
export const SIZES_IN_UNIT = ["px", "pt", "em", "rem", "vw", "vh", "%"];
export const BORDER_STYLES_IN_DESCRIPTION = ['default', 'none', '<div style="margin: 5px 0; padding: 3px; border: 4px dotted #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px dashed #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px solid #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px double #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px groove #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px ridge #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px inset #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px outset #999;" />'];
export const BORDER_STYLES_IN_VALUE = [null, "none", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"];
export const OBJECT_FIT_OPTIONS = [null, "fill", "contain", "cover", "none", "scale-down"];
export const OBJECT_POSITION_OPTIONS = [null, "{SIZE}", "top", "right", "bottom", "left"];
export const OVERFLOW_OPTIONS = [null, "visible", "hidden", "scroll", "auto"];
export const POSITION_OPTIONS = [null, "static", "absolute", "fixed", "relative", "sticky"];
export const CLEAR_OPTIONS = [null, "left", "right", "both"];
export const FLOAT_OPTIONS = [null, "left", "right"];
export const CURSOR_OPTIONS = [null, "alias", "all-scroll", "auto", "cell", "context-menu", "col-resize", "copy", "crosshair", "default", "e-resize", "ew-resize", "grab", "grabbing", "help", "move", "n-resize", "ne-resize", "nesw-resize", "ns-resize", "nw-resize", "nwse-resize", "no-drop", "none", "not-allowed", "pointer", "progress", "row-resize", "s-resize", "se-resize", "sw-resize", "text", "vertical-text", "w-resize", "wait", "zoom-in", "zoom-out"];
export const DISPLAY_OPTIONS = [null, "inline", "block", "contents", "flex", "grid", "inline-block", "inline-flex", "inline-grid", "inline-table", "list-item", "run-in", "table", "table-caption", "table-column-group", "table-header-group", "table-footer-group", "table-row-group", "table-cell", "table-column", "table-row", "none"];
export const FLEX_ORDER_OPTIONS = [null, "{NUMBER}"];
export const FLEX_DIRECTION_OPTIONS = [null, "row", "row-reverse", "column", "column-reverse"];
export const FLEX_GROW_OPTIONS = [null, "{NUMBER}"];
export const FLEX_WRAP_OPTIONS = [null, "nowrap", "wrap", "wrap-reverse"];
export const FLEX_SHRINK_OPTIONS = [null, "{NUMBER}"];
export const FLEX_BASIS_OPTIONS = [null, "{SIZE}"];
export const FLEX_JUSTIFY_CONTENT_OPTIONS = [null, "flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly", "start", "end", "left", "right"];
export const FLEX_JUSTIFY_ALIGN_SELF_OPTIONS = [null, "auto", "flex-start", "flex-end", "center", "baseline", "stretch"];
export const FLEX_JUSTIFY_ALIGN_ITEMS_OPTIONS = [null, "stretch", "flex-start", "flex-end", "center", "baseline", "first baseline", "last baseline", "start", "end", "self-start", "self-end"];
export const FLEX_JUSTIFY_ALIGN_CONTENT_OPTIONS = [null, "flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly", "stretch", "start", "end", "baseline", "first baseline", "last baseline"];
export const IMAGE_RENDERING_OPTIONS = [null, "auto", "smooth", "high-quality", "crisp-edges", "pixelated"];
export const POINTER_EVENTS_OPTIONS = [null, "auto", "none"];
export const Z_INDEX_OPTIONS = [null, "{NUMBER}"];
export const BACKGROUND_IMAGE_OPTIONS = [null, "{TEXT}", "{BROWSE}"];
export const BACKGROUND_ATTACHMENT_OPTIONS = [null, "scroll", "fixed", "local"];
export const BACKGROUND_BLEND_MODE_OPTIONS = [null, "normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "saturation", "color", "luminosity"];
export const BACKGROUND_CLIP_OPTIONS = [null, "padding-box", "border-box", "content-box"];
export const BACKGROUND_ORIGIN_OPTIONS = [null, "padding-box", "border-box", "content-box"];
export const BACKGROUND_REPEAT_OPTIONS = [null, "repeat", "repeat-x", "repeat-y", "no-repeat", "space", "round"];
export const BACKGROUND_SIZE_OPTIONS = [null, "{SIZE}"];
export const BACKGROUND_POSITION_OPTIONS = [null, "{SIZE}", "top", "right", "bottom", "left", "center"];
export const MIX_BLEND_MODE_OPTIONS = [null, "normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
export const OPACITY_OPTIONS = [null, "{FLOAT}"];
export const VISIBILITY_OPTIONS = [null, "visible", "hidden", "collapse"];
export const BORDER_COLLAPSE_OPTIONS = [null, "separate", "collapse"];
export const BORDER_SPACING_OPTIONS = [null, "{SIZE}"];
export const CAPTION_SIDE_OPTIONS = [null, "top", "bottom"];
export const EMPTY_CELL_OPTIONS = [null, "show", "hide"];
export const TABLE_LAYOUT_OPTIONS = [null, "auto", "fixed"];
export const LIST_STYLE_TYPE_OPTIONS = [null, "disc", "armenian", "circle", "cjk-ideographic", "decimal", "decimal-leading-zero", "georgian", "hebrew", "hiragana", "hiragana-iroha", "katakana", "katakana-iroha", "lower-alpha", "lower-greek", "lower-latin", "lower-roman", "none", "square", "upper-alpha", "upper-greek", "upper-latin", "upper-roman"];
export const LIST_STYLE_IMAGE_OPTIONS = [null, "{TEXT}", "{BROWSE}"];
export const LIST_STYLE_POSITION_OPTIONS = [null, "inside", "outside"];
export const TEXT_INDENT_OPTIONS = [null, "{SIZE}"];
export const LETTER_SPACING_OPTIONS = [null, "{SIZE}"];
export const WORD_SPACING_OPTIONS = [null, "{SIZE}"];
export const TAB_SIZE_OPTIONS = [null, "{NUMBER}"];
export const LINE_HEIGHT_OPTIONS = [null, "{SIZE}"];
export const WHITE_SPACE_OPTIONS = [null, "normal", "nowrap", "pre", "pre-line", "pre-wrap"];
export const WORD_BREAK_OPTIONS = [null, "normal", "break-all", "keep-all", "break-word"];
export const WORD_WRAP_OPTIONS = [null, "normal", "break-word"];
export const HYPHENS_OPTIONS = [null, "none", "manual", "auto"];
export const TEXT_OVERFLOW_OPTIONS = [null, "clip", "ellipsis", "{TEXT}"];
export const TEXT_DECORATION_COLOR_OPTIONS = [null, "{COLOR}"];
export const TEXT_DECORATION_LINE_OPTIONS = [null, "none", "underline", "overline", "line-through"];
export const TEXT_DECORATION_STYLE_OPTIONS = [null, "solid", "double", "dotted", "dashed", "wavy"];
export const WRITING_MODE_OPTIONS = [null, "horizontal-tb", "vertical-rl", "vertical-lr"];
export const QUOTES_OPTIONS = [null, "{TEXT}"];
export const DIRECTION_OPTIONS = [null, "ltr", "rtl"];
export const UNICODE_BIDI_OPTIONS = [null, "normal", "embed", "bidi-override", "isolate", "isolate-override", "plaintext"];
export const TEXT_TRANSFORM_OPTIONS = [null, "none", "capitalize", "uppercase", "lowercase"];
export const TEXT_JUSTIFY_OPTIONS = [null, "auto", "inter-word", "inter-character"];
export const VERTICAL_ALIGN_OPTIONS = [null, "baseline", "{SIZE}", "sub", "super", "top", "text-top", "middle", "bottom", "text-bottom"];
export const FONT_SIZE_OPTIONS = [null, "{SIZE}", "9px", "10px", "11px", "12px", "13px", "14px", "18px", "24px", "36px", "48px", "64px", "72px", "96px"];
export const FONT_WEIGHT_OPTIONS = [null, "normal", "bold", "bolder", "lighter", 100, 200, 300, 400, 500, 600, 700, 800, 900];
export const FONT_STRETCH_OPTIONS = [null, "ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"];
export const TEXT_ALIGN_OPTIONS = [["text-align", "left", "fa-align-left"], ["text-align", "center", "fa-align-center"], ["text-align", "right", "fa-align-right"], ["text-align", "justify", "fa-align-justify"]];
export const FONT_STYLE_OPTIONS = [["font-weight", "bold", "fa-bold"], ["font-style", "italic", "fa-italic"], ["text-decoration-line", "underline", "fa-underline"], ["text-decoration-line", "overline", "fa-strikethrough"]];
export const CELL_BORDER_OPTIONS = [null, "{SIZE}", "1px", "2px", "3px", "4px", "5px"];
export const BACKGROUND_COLOR_OPTIONS = [null, "{COLOR}"];
let table_cell_applying_style_function = function() { return this.state.extensionValues['-fsb-cell-style']; };
let table_cell_top = /^-fsb-cell-([0-9]+)-([0-9]+)-top/;
let table_cell_right = /^-fsb-cell-([0-9]+)-([0-9]+)-right/;
let table_cell_bottom = /^-fsb-cell-([0-9]+)-([0-9]+)-bottom/;
let table_cell_left = /^-fsb-cell-([0-9]+)-([0-9]+)-left/;
let table_cell_vertical = /^-fsb-cell-([0-9]+)-([0-9]+)-vertical/;
let table_cell_horizontal = /^-fsb-cell-([0-9]+)-([0-9]+)-horizontal/;
export const TABLE_CELL_0_OPTIONS = [
	[[table_cell_top], table_cell_applying_style_function, "custom-icon-table-top"],
	[[table_cell_right], table_cell_applying_style_function, "custom-icon-table-right"],
	[[table_cell_bottom], table_cell_applying_style_function, "custom-icon-table-bottom"],
	[[table_cell_left], table_cell_applying_style_function, "custom-icon-table-left"]
];
export const TABLE_CELL_1_OPTIONS = [
	[[table_cell_vertical], table_cell_applying_style_function, "custom-icon-table-vertical"],
	[[table_cell_horizontal], table_cell_applying_style_function, "custom-icon-table-horizontal"],
	[[table_cell_vertical, table_cell_horizontal], table_cell_applying_style_function, "custom-icon-table-center"],
	[[table_cell_top, table_cell_right, table_cell_bottom, table_cell_left], table_cell_applying_style_function, "custom-icon-table-outline"]
];
export const FONT_FAMILY_OPTIONS = FontHelper.listAllFonts();
export const _FONT_STYLE_OPTIONS = [null, "italic"];
export const _TEXT_ALIGN_OPTIONS = [null, "left", "center", "right", "justify"];
export const _FONT_COLOR_OPTIONS = [null, "{TEXT}"];
export const _TEXT_DECORATION_COLOR_OPTIONS = [null, "{TEXT}"];
export const REACT_MODE_OPTIONS = [["internal-fsb-react-mode", "Document", ["fa-thumb-tack", "Document"]], ["internal-fsb-react-mode", "Site", ["fa-puzzle-piece", "Site"]], ["internal-fsb-react-mode", "Global", ["fa-globe", "Global"]]];
export const CAMEL_OF_EVENTS_DICTIONARY = {
  'onfsbclick': 'onClick', 'onfsbdblclick': 'onDblClick', 'onfsbmousedown': 'onMouseDown', 'onfsbmousemove': 'onMouseMove', 'onfsbmouseout': 'onMouseOut', 'onfsbmouseover': 'onMouseOver', 'onfsbmouseup': 'onMouseUp', 'onfsbmousewheel': 'onMouseWheel', 'onfsbwheel': 'onWheel', 'onfsbkeydown': 'onKeyDown', 'onfsbkeypress': 'onKeyPress', 'onfsbkeyup': 'onKeyUp', 'onfsbtouchstart': 'onTouchStart', 'onfsbtouchmove': 'onTouchMove', 'onfsbtouchend': 'onTouchEnd', 'onfsbtouchcancel': 'onTouchCancel', 'onfsbdrag': 'onDrag', 'onfsbdragend': 'onDragend', 'onfsbdragenter': 'onDragEnter', 'onfsbdragleave': 'onDragLeave', 'onfsbdragover': 'onDragOver', 'onfsbdragstart': 'onDragStart', 'onfsbdrop': 'onDrop', 'onfsbscroll': 'onScroll', 'onfsbblur': 'onBlur', 'onfsbchange': 'onChange', 'onfsbcontextmenu': 'onContextMenu', 'onfsbfocus': 'onFocus', 'onfsbinput': 'onInput', 'onfsbinvalid': 'onInvalid', 'onfsbreset': 'onReset', 'onfsbsearch': 'onSearch', 'onfsbselect': 'onSelect', 'onfsbsubmit': 'onSubmit', 'onfsbafterprint': 'onAfterPrint', 'onfsbbeforeprint': 'onBeforePrint', 'onfsbbeforeunload': 'onBeforeUnload', 'onfsberror': 'onError', 'onfsbhashchange': 'onHashChange', 'onfsbload': 'onLoad', 'onfsbmessage': 'onMessage', 'onfsboffline': 'onOffline', 'onfsbonline': 'onOnline', 'onfsbpagehide': 'onPageHide', 'onfsbpageshow': 'onPageShow', 'onfsbpopstate': 'onPopState', 'onfsbresize': 'onResize', 'onfsbstorage': 'onStorage', 'onfsbunload': 'onUnload', 'onfsbcopy': 'onCopy', 'onfsbcut': 'onCut', 'onfsbpaste': 'onPaste', 'onfsbabort': 'onAbort', 'onfsbcanplay': 'onCanplay', 'onfsbcanplaythrough': 'onCanplayThrough', 'onfsbcuechange': 'onCueChange', 'onfsbdurationchange': 'onDurationChange', 'onfsbemptied': 'onEmptied', 'onfsbended': 'onEnded', 'onfsberror': 'onError', 'onfsbloadeddata': 'onLoadedData', 'onfsbloadedmetadata': 'onLoadedMetadata', 'onfsbloadstart': 'onLoadStart', 'onfsbpause': 'onPause', 'onfsbplay': 'onPlay', 'onfsbplaying': 'onPlaying', 'onfsbprogress': 'onProgress', 'onfsbratechange': 'onRateChange', 'onfsbseeked': 'onSeeked', 'onfsbseeking': 'onSeeking', 'onfsbstalled': 'onStalled', 'onfsbsuspend': 'onSuspend', 'onfsbtimeupdate': 'onTimeUpdate', 'onfsbvolumechange': 'onVolumeChange', 'onfsbwaiting': 'onWaiting', 'onfsbsubmitting': 'onSubmitting', 'onfsbsubmitted': 'onSubmitted', 'onfsbfailed': 'onFailed', 'onfsbsuccess': 'onSuccess'};
export const NONE_NATIVE_SUPPORT_OF_CAMEL_OF_EVENTS = ['onfsbsubmitting', 'onfsbsubmitted', 'onfsbfailed', 'onfsbsuccess'];
export const MOUSE_EVENT_HANDLING_OPTIONS = [];
export const KEYBOARD_EVENT_HANDLING_OPTIONS = [];
export const TOUCH_EVENT_HANDLING_OPTIONS = [];
export const DRAG_EVENT_HANDLING_OPTIONS = [];
export const FORM_EVENT_HANDLING_OPTIONS = [];
export const DOCUMENT_EVENT_HANDLING_OPTIONS = [];
export const CLIPBOARD_EVENT_HANDLING_OPTIONS = [];
export const MEDIA_EVENT_HANDLING_OPTIONS = [];
export const REACT_EVENT_HANDLING_OPTIONS = [];
export const INTERNAL_CLASSES_GLOBAL_REGEX = /(internal-fsb|-fsb|col|offset|d)-[a-zA-Z0-9\-]+/g;
export const NON_SINGLE_CONSECUTIVE_SPACE_GLOBAL_REGEX = /[ ]+/g;
export const LIBRARIES = [{
  id: 'react@16',
  name: 'React',
  prerequisite: true,
  version: '16',
  production: {
    stylesheets: null,
    scripts: [
      "https://unpkg.com/react@16/umd/react.production.min.js",
      "https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "https://unpkg.com/react@16/umd/react.development.js",
      "https://unpkg.com/react-dom@16/umd/react-dom.development.js"
    ]
  }
},{
  id: 'jquery-core@3',
  name: 'Jquery',
  prerequisite: false,
  version: '3.x',
  production: {
    stylesheets: null,
    scripts: [
      "https://code.jquery.com/jquery-3.5.1.min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "https://code.jquery.com/jquery-3.5.1.js"
    ]
  }
},{
  id: 'jquery-core@2',
  name: 'Jquery',
  prerequisite: false,
  version: '2.x',
  production: {
    stylesheets: null,
    scripts: [
      "https://code.jquery.com/jquery-2.2.4.min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "https://code.jquery.com/jquery-2.2.4.js"
    ]
  }
},{
  id: 'jquery-core@1',
  name: 'Jquery',
  prerequisite: false,
  version: '1.x',
  production: {
    stylesheets: null,
    scripts: [
      "https://code.jquery.com/jquery-1.12.4.min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "https://code.jquery.com/jquery-1.12.4.js"
    ]
  }
},{
  id: 'bootstrap@4',
  name: 'Bootstrap',
  prerequisite: false,
  version: '4.x',
  production: {
    stylesheets: [
      "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
    ],
    scripts: [
      "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
    ]
  },
  development: {
    stylesheets: [
      "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
    ],
    scripts: [
      "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
    ]
  }
},{
  id: 'bootstrap@3',
  name: 'Bootstrap',
  prerequisite: false,
  version: '3.x',
  production: {
    stylesheets: [
      "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
    ],
    scripts: [
      "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
    ]
  },
  development: {
    stylesheets: [
      "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"
    ],
    scripts: [
      "https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
    ]
  }
},{
  id: 'bootstrap@2',
  name: 'Bootstrap',
  prerequisite: false,
  version: '2.x',
  production: {
    stylesheets: [
      "https://stackpath.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css"
    ],
    scripts: [
      "https://stackpath.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js"
    ]
  },
  development: {
    stylesheets: [
      "https://stackpath.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css"
    ],
    scripts: [
      "https://stackpath.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js"
    ]
  }
},{
  id: 'underscore@1',
  name: 'Underscore',
  prerequisite: false,
  version: '1.x',
  production: {
    stylesheets: null,
    scripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore.js"
    ]
  }
},{
  id: 'underscore',
  name: 'Underscore',
  prerequisite: false,
  version: '0.x',
  production: {
    stylesheets: null,
    scripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/0.6.0/underscore-min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/0.6.0/underscore.js"
    ]
  }
},{
  id: 'backbone@1',
  name: 'Backbone',
  prerequisite: false,
  version: '1.x',
  production: {
    stylesheets: null,
    scripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.4.0/backbone-min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.4.0/backbone.js"
    ]
  }
},{
  id: 'backbone',
  name: 'Backbone',
  prerequisite: false,
  version: '0.x',
  production: {
    stylesheets: null,
    scripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min.js"
    ]
  }
}];
export const FORWARED_ATTRIBUTES_FOR_CHILDREN = ['placeholder', 'value', 'checked', 'disabled', 'readonly', 'required', 'tabIndex', 'size', 'type', 'internal-fsb-data-source-type', 'internal-fsb-data-source-name', 'internal-fsb-data-source-column', 'multiple', 'rows', 'src', 'name', 'value'];
export const ENABLED_OPTIONS = [["disabled", null, ["fa-circle", "Enable"]], ["disabled", "true", ["fa-circle-o", "Disable"]]];
export const CHECKED_OPTIONS = [["checked", "true", ["fa-circle", "Yes"]], ["checked", null, ["fa-circle-o", "No"]]];
export const READONLY_OPTIONS = [["readonly", null, ["fa-circle", "Allow"]], ["readonly", "true", ["fa-circle-o", "Disallow"]]];
export const REQUIRE_OPTIONS = [["required", "true", ["fa-circle", "Necessary"]], ["required", null, ["fa-circle-o", "Additional"]]];
export const MULTIPLE_OPTIONS = [["multiple", null, ["fa-minus", "Single"]], ["multiple", "true", ["fa-reorder", "Multiple"]]];
export const DATA_SOURCE_TYPE_OPTIONS_1 = [["internal-fsb-data-source-type", "relational", ["fa-share-alt", "Relational"]], ["internal-fsb-data-source-type", "worker", ["fa-sort-numeric-asc", "Prioritized Worker"]]];
export const DATA_SOURCE_TYPE_OPTIONS_2 = [["internal-fsb-data-source-type", "document", ["fa-file-o", "Document"]], ["internal-fsb-data-source-type", "volatile-memory", ["fa-thumb-tack", "Volatile Memory"]]];
export const DATA_WIZARD_TYPE_OPTIONS_1 = [["internal-fsb-data-wizard-type", "insert", ["fa-save", "Insert"]], ["internal-fsb-data-wizard-type", "update", ["fa-save", "Update"]], ["internal-fsb-data-wizard-type", "upsert", ["fa-save", "Upsert"]]];
export const DATA_WIZARD_TYPE_OPTIONS_2 = [["internal-fsb-data-wizard-type", "delete", ["fa-save", "Delete"]], ["internal-fsb-data-wizard-type", "retrieve", ["fa-database", "Retrieve"]], ["internal-fsb-data-wizard-type", "popup", ["fa-list-alt", "Popup"]]];
export const DATA_WIZARD_TYPE_OPTIONS_3 = [["internal-fsb-data-wizard-type", "navigate", ["fa-link", "Navigate"]]];
export const DATA_WIZARD_REAL_TIME_UPDATE = [["internal-fsb-data-wizard-real-time-update", "true", ["fa-circle", "Enable"]], ["internal-fsb-data-wizard-real-time-update", null, ["fa-circle-o", "Disable"]]];
export const DATA_VALUE_SOURCE_OPTIONS = [["internal-fsb-data-value-source", null, ["fa-pencil-square-o", "Front-End"]], ["internal-fsb-data-value-source", "session", ["fa-cog", "Back-End"]]];
export const CROSS_OPERATION_OPTIONS = [["internal-fsb-data-wizard-cross-operation", null, ["fa-save", "Same as Action"]], ["internal-fsb-data-wizard-cross-operation", "upsert", ["fa-save", "Upsert"]]];
export const TEXTBOX_MODE_OPTIONS = [["internal-fsb-textbox-mode", null, ["fa-minus", "Single"]], ["internal-fsb-textbox-mode", "multiple", ["fa-reorder", "Multiple"]]];
export const REQUIRE_FULL_CLOSING_TAGS = ["select", "textarea", "div"];
export const CONTAIN_TEXT_CONTENT_TAGS = ["textarea"];
export const BACKGROUND_TYPE_OPTIONS = [["-fsb-background-type", null, ["d-none", "Solid"]], ["-fsb-background-type", "linear", ["d-none", "Linear Gradient"]], ["-fsb-background-type", "radial", ["d-none", "Radial Gradient"]]];
export const TEXT_INPUT_TYPE_OPTIONS = [["type", "text", ["fa-font", "Text"]], ["type", "password", ["fa-ellipsis-h", "Password"]]];
export const CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL = /-fsb-cell-([0-9]+)-([0-9]+)-(top|right|left|bottom)\: ([^;]+)/g;
export const CELL_STYLE_ATTRIBUTE_REGEX_LOCAL = /-fsb-cell-([0-9]+)-([0-9]+)-(top|right|left|bottom)\: ([^;]+)/;
export const FORWARD_STYLE_TO_CHILDREN_CLASS_LIST = ['Iframe', 'Textbox', 'Select', 'Radio', 'Checkbox', 'File', 'Image', 'Video'];
export const FORM_CONTROL_CLASS_LIST = ['Textbox', 'Select', 'Radio', 'Checkbox', 'File', 'Hidden'];
export const DOT_NOTATION_CONSUMABLE_TAG_LIST = [['iframe', 'src', '{', '}'], ['a', 'dangerouslySetInnerHTML', '{{__html: ', '}}'], ['svg', 'dangerouslySetInnerHTML', '{{__html: ', '}}'], ['input', 'defaultValue', '{', '}'], ['textarea', 'defaultValue', '{', '}'], ['select', 'defaultValue', '{', '}'], ['img', 'src', '{', '}'], ['video', 'src', '{', '}']];
export const DOT_NOTATION_CONSUMABLE_CLASS_LIST = [['HTML', 'dangerouslySetInnerHTML', '{{__html: ', '}}'], ['TextElement', 'dangerouslySetInnerHTML', '{{__html: CodeHelper.escape(', ')}}']];
export const INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES = ['internal-fsb-inheriting', 'internal-fsb-guid', 'class', 'style', 'internal-fsb-name', 'internal-fsb-react-id', 'internal-fsb-react-data', 'internal-fsb-react-mode'];
export const INHERITING_COMPONENT_RESERVED_STYLE_NAMES = ['top', 'right', 'bottom', 'left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'position'];
export const INHERITING_COMPONENT_RESERVED_STYLE_NAMES_IN_CAMEL = ['top', 'right', 'bottom', 'left', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'position'];

export const IS_DEVELOPMENT_ENVIRONMENT = (['localhost', 'develop.stackblend.com'].indexOf(window.location.hostname) != -1);
export const DEBUG_MANIPULATION_HELPER = IS_DEVELOPMENT_ENVIRONMENT;
export const DEBUG_GITHUB_UPLOADER = IS_DEVELOPMENT_ENVIRONMENT;
export const DEBUG_SITE_PREVIEW = IS_DEVELOPMENT_ENVIRONMENT;
export const USER_CODE_REGEX_GLOBAL = /\/\/ \<---Auto\[([a-zA-Z0-9_:]+)\]([\s\S]+?)(\/\/ \Auto\[([a-zA-Z0-9_:]+)\]--->|$)/g;
export const USER_CODE_REGEX_GROUP = /\/\/ \<---Auto\[([a-zA-Z0-9_:]+)\]([\s\S]+?)(\/\/ \Auto\[([a-zA-Z0-9_:]+)\]--->|$)/;
export const SYSTEM_CODE_REGEX_BEGIN_GLOBAL = /(\n[ ]*\/\/ \<---Auto\[([a-zA-Z0-9_:]+)\]|[ ]*\/\/ \<---Auto\[([a-zA-Z0-9_:]+)\]\n)/g;
export const SYSTEM_CODE_REGEX_END_GLOBAL = /(\n[ ]*\/\/ \Auto\[([a-zA-Z0-9_:]+)\]--->|[ ]*\/\/ \Auto\[([a-zA-Z0-9_:]+)\]--->\n)/g;

export const BACKEND_DATA_COLUMN_TYPE = [["data-column-type", "primary", ["fa-circle", "Primary"]], ["data-column-type", null, ["fa-circle-o", "General"]]];
export const BACKEND_DATA_FIELD_TYPE = [["data-field-type", "auto", ["d-none", "Increase"]], ["data-field-type", null, ["d-none", "String"]], ["data-field-type", "number", ["d-none", "Number"]], ["data-field-type", "boolean", ["d-none", "Boolean"]]];
export const BACKEND_DATA_REQUIRED = [["data-required", "true", ["fa-circle", "Necessary"]], ["data-required", null, ["fa-circle-o", "Additional"]]];
export const BACKEND_DATA_UNIQUE = [["data-unique", "true", ["fa-circle", "Unique"]], ["data-unique", null, ["fa-circle-o", "Common"]]];
export const BACKEND_DATA_FORCE_CONSTRAINT = [["data-force-constraint", "true", ["fa-circle", "Always Have"]], ["data-force-constraint", null, ["fa-circle-o", "None"]]];
export const BACKEND_DATA_EXTENSIONS = ["internal-fsb-data-code-import", "internal-fsb-data-code-declare", "internal-fsb-data-code-interface", "internal-fsb-data-code-body", "internal-fsb-data-code-footer"];
export const BACKEND_DATA_LOCK_MODE = [["data-lock-mode", "always", ["fa-circle", "Always"]], ["data-lock-mode", "relation", ["fa-circle-o", "Relation"]], ["data-lock-mode", "session", ["fa-circle-o", "Session"]]];
export const BACKEND_DATA_LOCK_MATCHING_MODE = [["data-lock-matching-mode", null, ["fa-circle", "Static Value"]], ["data-lock-matching-mode", "session", ["fa-circle-o", "Dynamic Value"]]];
export const BACKEND_DATA_RENDERING_CONDITION_MODE = [["data-rendering-condition-mode", "block", ["fa-circle", "Block"]], ["data-rendering-condition-mode", "relation", ["fa-circle-o", "Relation"]], ["data-rendering-condition-mode", "session", ["fa-circle-o", "Session"]]];
export const BACKEND_DATA_RENDERING_CONDITION_MATCHING_MODE = [["data-rendering-condition-matching-mode", null, ["fa-circle", "Static Value"]], ["data-rendering-condition-matching-mode", "session", ["fa-circle-o", "Dynamic Value"]]];