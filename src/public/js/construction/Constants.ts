import {FontHelper} from './helpers/FontHelper';

export const RESPONSIVE_SIZE_REGEX = [/col\-([0-9]+)/, /col\-sm\-([0-9]+)/, /col\-md\-([0-9]+)/, /col\-lg\-([0-9]+)/, /col\-xl\-([0-9]+)/];
export const RESPONSIVE_OFFSET_REGEX = [/offset\-([0-9]+)/, /offset\-sm\-([0-9]+)/, /offset\-md\-([0-9]+)/, /offset\-lg\-([0-9]+)/, /offset\-xl\-([0-9]+)/];
export const ALL_RESPONSIVE_SIZE_REGEX = /col\-((sm|md|lg|xl)\-)?[0-9]+/g;
export const ALL_RESPONSIVE_OFFSET_REGEX = /offset\-((sm|md|lg|xl)\-)?[0-9]+/g;
export const SIZES_IN_DESCRIPTION = ["px: pixels", "pt: points", "em: scale of font-size", "rem: scale of font-size at root", "vw: % of viewport width", "vh: % of viewport height", "%: % of parent size", "auto", "coding"];
export const SIZES_IN_UNIT = ["px", "pt", "em", "rem", "vw", "vh", "%", "auto", "coding"];
export const BORDER_STYLES_IN_DESCRIPTION = ['default', 'none', '<div style="margin: 5px 0; padding: 3px; border: 4px dotted #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px dashed #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px solid #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px double #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px groove #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px ridge #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px inset #999;" />', '<div style="margin: 5px 0; padding: 3px; border: 4px outset #999;" />', 'coding'];
export const BORDER_STYLES_IN_VALUE = [null, "none", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "coding"];
export const BORDER_STYLES_IN_REPRESENTING = [null, "none", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "ICON:fa fa-code"];
export const OBJECT_FIT_OPTIONS = [null, "fill", "contain", "cover", "none", "scale-down"];
export const OBJECT_POSITION_OPTIONS = [null, "{SIZE}", "top", "right", "bottom", "left"];
export const OVERFLOW_OPTIONS = [null, "visible", "hidden", "scroll", "auto"];
export const POSITION_OPTIONS = [null, "static", "absolute", "fixed", "relative", "sticky"];
export const CLEAR_OPTIONS = [null, "none", "left", "right", "both"];
export const FLOAT_OPTIONS = [null, "none", "left", "right"];
export const CURSOR_OPTIONS = [null, "alias", "all-scroll", "auto", "cell", "context-menu", "col-resize", "copy", "crosshair", "default", "e-resize", "ew-resize", "grab", "grabbing", "help", "move", "n-resize", "ne-resize", "nesw-resize", "ns-resize", "nw-resize", "nwse-resize", "no-drop", "none", "not-allowed", "pointer", "progress", "row-resize", "s-resize", "se-resize", "sw-resize", "text", "vertical-text", "w-resize", "wait", "zoom-in", "zoom-out"];
export const DISPLAY_OPTIONS = [null, "inline", "block", "contents", "flex", "grid", "inline-block", "inline-flex", "inline-grid", "inline-table", "list-item", "run-in", "table", "table-caption", "table-column-group", "table-header-group", "table-footer-group", "table-row-group", "table-cell", "table-column", "table-row", "none"];
export const DISPLAY_FOR_FLEXBOX_OPTIONS = [null, "block", "contents", "flex", "grid", "inline-block", "inline-flex", "inline-grid", "inline-table", "list-item", "run-in", "table", "table-caption", "table-column-group", "table-header-group", "table-footer-group", "table-row-group", "table-cell", "table-column", "table-row", "none"];
export const RATIO_OPTIONS = [null, "{TEXT}", "1:1", "3:2", "4:1", "4:3", "5:4", "16:9", "16:10", "17:9", "21:9", "32:9"];
export const FLEX_ORDER_OPTIONS = [null, "{NUMBER}", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const FLEX_DIRECTION_OPTIONS = [null, "row", "row-reverse", "column", "column-reverse"];
export const FLEX_GROW_OPTIONS = [null, "{NUMBER}", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const FLEX_WRAP_OPTIONS = [null, "nowrap", "wrap", "wrap-reverse"];
export const FLEX_SHRINK_OPTIONS = [null, "{NUMBER}", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
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
export const BACKGROUND_CONTAINING_SIZE_OPTIONS = [null, "auto", "cover", "contain"];
export const BACKGROUND_POSITION_OPTIONS = [null, "{SIZE}", "top", "right", "bottom", "left", "center"];
export const MIX_BLEND_MODE_OPTIONS = [null, "normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
export const OPACITY_OPTIONS = [null, "{FLOAT}", 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0];
export const VISIBILITY_OPTIONS = [null, "visible", "hidden", "collapse"];
export const BORDER_COLLAPSE_OPTIONS = [null, "separate", "collapse"];
export const BORDER_SPACING_OPTIONS = [null, "{SIZE}"];
export const CAPTION_SIDE_OPTIONS = [null, "top", "bottom"];
export const EMPTY_CELL_OPTIONS = [null, "show", "hide"];
export const TABLE_LAYOUT_OPTIONS = [null, "auto", "fixed"];
export const LIST_STYLE_TYPE_OPTIONS = [null, "disc", "armenian", "circle", "cjk-ideographic", "decimal", "decimal-leading-zero", "georgian", "hebrew", "hiragana", "hiragana-iroha", "katakana", "katakana-iroha", "lower-alpha", "lower-greek", "lower-latin", "lower-roman", "none", "square", "upper-alpha", "upper-greek", "upper-latin", "upper-roman"];
export const LIST_STYLE_IMAGE_OPTIONS = [null, "{TEXT}", "{BROWSE}"];
export const LIST_STYLE_POSITION_OPTIONS = [null, "inside", "outside"];
export const TEXT_INDENT_OPTIONS = [null, "{SIZE}", "0em", "1em", "2em", "3em", "4em", "5em"];
export const LETTER_SPACING_OPTIONS = [null, "{SIZE}", "0em", "0.025em", "0.05em", "0.075em", "0.1em", "0.125em"];
export const WORD_SPACING_OPTIONS = [null, "{SIZE}", "0em", "0.1em", "0.2em", "0.3em", "0.4em", "0.5em"];
export const TAB_SIZE_OPTIONS = [null, "{NUMBER}"];
export const LINE_HEIGHT_OPTIONS = [null, "{SIZE}", "1em", "1.15em", "1.25em", "1.5em", "1.75em", "2em"];
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
export const FONT_SIZE_OPTIONS = [null, "{SIZE}", "9px", "10px", "11px", "12px", "13px", "14px", "16px", "18px", "20px", "22px", "24px", "26px", "28px", "36px", "48px", "64px", "72px", "96px"];
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
export const FONT_FAMILY_OPTIONS = [null, ...FontHelper.listAllFonts()];
export const _FONT_STYLE_OPTIONS = [null, "italic"];
export const _TEXT_ALIGN_OPTIONS = [null, "left", "center", "right", "justify"];
export const _FONT_COLOR_OPTIONS = [null, "{TEXT}"];
export const _TEXT_DECORATION_COLOR_OPTIONS = [null, "{TEXT}"];
export const REACT_MODE_OPTIONS = [["internal-fsb-react-mode", "Document", ["fa-thumb-tack", "Document"]], ["internal-fsb-react-mode", "Site", ["fa-puzzle-piece", "Site"]], ["internal-fsb-react-mode", "Global", ["fa-globe", "Global"]]];
export const CAMEL_OF_EVENTS_DICTIONARY = {
  'onfsbclick': 'onClick', 'onfsbdblclick': 'onDblClick', 'onfsbmousedown': 'onMouseDown', 'onfsbmousemove': 'onMouseMove', 'onfsbmouseout': 'onMouseOut', 'onfsbmouseover': 'onMouseOver', 'onfsbmouseup': 'onMouseUp', 'onfsbmousewheel': 'onMouseWheel', 'onfsbwheel': 'onWheel', 'onfsbkeydown': 'onKeyDown', 'onfsbkeypress': 'onKeyPress', 'onfsbkeyup': 'onKeyUp', 'onfsbtouchstart': 'onTouchStart', 'onfsbtouchmove': 'onTouchMove', 'onfsbtouchend': 'onTouchEnd', 'onfsbtouchcancel': 'onTouchCancel', 'onfsbdocumentclick': 'onDocumentClick', 'onfsbdocumentdblclick': 'onDocumentDblClick', 'onfsbdocumentmousedown': 'onDocumentMouseDown', 'onfsbdocumentmousemove': 'onDocumentMouseMove', 'onfsbdocumentmouseout': 'onDocumentMouseOut', 'onfsbdocumentmouseover': 'onDocumentMouseOver', 'onfsbdocumentmouseup': 'onDocumentMouseUp', 'onfsbdocumentmousewheel': 'onDocumentMouseWheel', 'onfsbdocumentwheel': 'onDocumentWheel', 'onfsbdocumentkeydown': 'onDocumentKeyDown', 'onfsbdocumentkeypress': 'onDocumentKeyPress', 'onfsbdocumentkeyup': 'onDocumentKeyUp', 'onfsbdocumenttouchstart': 'onDocumentTouchStart', 'onfsbdocumenttouchmove': 'onDocumentTouchMove', 'onfsbdocumenttouchend': 'onDocumentTouchEnd', 'onfsbdocumenttouchcancel': 'onDocumentTouchCancel', 'onfsbdocumentdrag': 'onDocumentDrag', 'onfsbdocumentdragend': 'onDocumentDragend', 'onfsbdocumentdragenter': 'onDocumentDragEnter', 'onfsbdocumentdragleave': 'onDocumentDragLeave', 'onfsbdocumentdragover': 'onDocumentDragOver', 'onfsbdocumentdragstart': 'onDocumentDragStart', 'onfsbdocumentdrop': 'onDocumentDrop', 'onfsbdocumentscroll': 'onDocumentScroll', 'onfsbdrag': 'onDrag', 'onfsbdragend': 'onDragend', 'onfsbdragenter': 'onDragEnter', 'onfsbdragleave': 'onDragLeave', 'onfsbdragover': 'onDragOver', 'onfsbdragstart': 'onDragStart', 'onfsbdrop': 'onDrop', 'onfsbscroll': 'onScroll', 'onfsbblur': 'onBlur', 'onfsbchange': 'onChange', 'onfsbcontextmenu': 'onContextMenu', 'onfsbfocus': 'onFocus', 'onfsbinput': 'onInput', 'onfsbinvalid': 'onInvalid', 'onfsbreset': 'onReset', 'onfsbsearch': 'onSearch', 'onfsbselect': 'onSelect', 'onfsbsubmit': 'onSubmit', 'onfsbafterprint': 'onAfterPrint', 'onfsbbeforeprint': 'onBeforePrint', 'onfsbbeforeunload': 'onBeforeUnload', 'onfsberror': 'onError', 'onfsbhashchange': 'onHashChange', 'onfsbload': 'onLoad', 'onfsbmessage': 'onMessage', 'onfsboffline': 'onOffline', 'onfsbonline': 'onOnline', 'onfsbpagehide': 'onPageHide', 'onfsbpageshow': 'onPageShow', 'onfsbpopstate': 'onPopState', 'onfsbready': 'onReady', 'onfsbresize': 'onResize', 'onfsbstorage': 'onStorage', 'onfsbunload': 'onUnload', 'onfsbcopy': 'onCopy', 'onfsbcut': 'onCut', 'onfsbpaste': 'onPaste', 'onfsbabort': 'onAbort', 'onfsbcanplay': 'onCanplay', 'onfsbcanplaythrough': 'onCanplayThrough', 'onfsbcuechange': 'onCueChange', 'onfsbdurationchange': 'onDurationChange', 'onfsbemptied': 'onEmptied', 'onfsbended': 'onEnded', 'onfsberror': 'onError', 'onfsbloadeddata': 'onLoadedData', 'onfsbloadedmetadata': 'onLoadedMetadata', 'onfsbloadstart': 'onLoadStart', 'onfsbpause': 'onPause', 'onfsbplay': 'onPlay', 'onfsbplaying': 'onPlaying', 'onfsbprogress': 'onProgress', 'onfsbratechange': 'onRateChange', 'onfsbseeked': 'onSeeked', 'onfsbseeking': 'onSeeking', 'onfsbstalled': 'onStalled', 'onfsbsuspend': 'onSuspend', 'onfsbtimeupdate': 'onTimeUpdate', 'onfsbvolumechange': 'onVolumeChange', 'onfsbwaiting': 'onWaiting', 'onfsbsubmitting': 'onSubmitting', 'onfsbsubmitted': 'onSubmitted', 'onfsbfailed': 'onFailed', 'onfsbsuccess': 'onSuccess', 'onfsbsourceinsert': 'onSourceInsert', 'onfsbsourceupsert': 'onSourceUpsert', 'onfsbsourceupdate': 'onSourceUpdate', 'onfsbsourcedelete': 'onSourceDelete', 'onfsbsourceretrieve': 'onSourceRetrieve', 'onfsbtargetinsert': 'onTargetInsert', 'onfsbtargetupsert': 'onTargetUpsert', 'onfsbtargetupdate': 'onTargetUpdate', 'onfsbtargetdelete': 'onTargetDelete', 'onfsbtargetretrieve': 'onTargetRetrieve'};
export const CUSTOM_EVENT_TYPE_OF_CAMEL_OF_EVENTS = ['onfsbsubmitting', 'onfsbsubmitted', 'onfsbfailed', 'onfsbsuccess'];
export const NONE_NATIVE_SUPPORT_OF_CAMEL_OF_EVENTS = ['onfsbsubmitting', 'onfsbsubmitted', 'onfsbfailed', 'onfsbsuccess'];
export const ALL_DOCUMENT_SUPPORT_OF_CAMEL_OF_EVENTS = ['onfsbafterprint', 'onfsbbeforeprint', 'onfsbbeforeunload', 'onfsberror', 'onfsbhashchange', 'onfsbload', 'onfsbmessage', 'onfsboffline', 'onfsbonline', 'onfsbpagehide', 'onfsbpageshow', 'onfsbpopstate', 'onfsbready', 'onfsbresize', 'onfsbstorage', 'onfsbunload', 'onfsbdocumentclick', 'onfsbdocumentdblclick', 'onfsbdocumentmousedown', 'onfsbdocumentmousemove', 'onfsbdocumentmouseout', 'onfsbdocumentmouseover', 'onfsbdocumentmouseup', 'onfsbdocumentmousewheel', 'onfsbdocumentwheel', 'onfsbdocumentkeydown', 'onfsbdocumentkeypress', 'onfsbdocumentkeyup', 'onfsbdocumenttouchstart', 'onfsbdocumenttouchmove', 'onfsbdocumenttouchend', 'onfsbdocumenttouchcancel', 'onfsbdocumentdrag', 'onfsbdocumentdragend', 'onfsbdocumentdragenter', 'onfsbdocumentdragleave', 'onfsbdocumentdragover', 'onfsbdocumentdragstart', 'onfsbdocumentdrop', 'onfsbdocumentscroll'];
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
      "/js/libraries/react@16/react.production.min.js",
      "/js/libraries/react@16/react-dom.production.min.js",
      "/js/libraries/socket.io@2/socket.io-2.3.0.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "/js/libraries/react@16/react.development.js",
      "/js/libraries/react@16/react-dom.development.js",
      "/js/libraries/socket.io@2/socket.io-2.3.0.js"
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
      "/js/libraries/jquery@3/jquery-3.5.1.min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "/js/libraries/jquery@3/jquery-3.5.1.js"
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
      "/js/libraries/jquery@2/jquery-2.2.4.min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "/js/libraries/jquery@2/jquery-2.2.4.js"
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
      "/js/libraries/jquery@1/jquery-1.12.4.min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "/js/libraries/jquery@1/jquery-1.12.4.js"
    ]
  }
},{
  id: 'bootstrap@4',
  name: 'Bootstrap',
  prerequisite: false,
  version: '4.x',
  production: {
    stylesheets: [
      "/js/libraries/bootstrap@4/bootstrap-4.4.1.min.css"
    ],
    scripts: [
      "/js/libraries/bootstrap@4/bootstrap-4.4.1.min.js"
    ]
  },
  development: {
    stylesheets: [
      "/js/libraries/bootstrap@4/bootstrap-4.4.1.min.css"
    ],
    scripts: [
      "/js/libraries/bootstrap@4/bootstrap-4.4.1.min.js"
    ]
  }
},{
  id: 'bootstrap@3',
  name: 'Bootstrap',
  prerequisite: false,
  version: '3.x',
  production: {
    stylesheets: [
      "/js/libraries/bootstrap@3/bootstrap-3.4.1.min.css"
    ],
    scripts: [
      "/js/libraries/bootstrap@3/bootstrap-3.4.1.min.js"
    ]
  },
  development: {
    stylesheets: [
      "/js/libraries/bootstrap@3/bootstrap-3.4.1.min.css"
    ],
    scripts: [
      "/js/libraries/bootstrap@3/bootstrap-3.4.1.min.js"
    ]
  }
},{
  id: 'bootstrap@2',
  name: 'Bootstrap',
  prerequisite: false,
  version: '2.x',
  production: {
    stylesheets: [
      "/js/libraries/bootstrap@2/bootstrap-2.3.2.min.css"
    ],
    scripts: [
      "/js/libraries/bootstrap@2/bootstrap-2.3.2.min.js"
    ]
  },
  development: {
    stylesheets: [
      "/js/libraries/bootstrap@2/bootstrap-2.3.2.min.css"
    ],
    scripts: [
      "/js/libraries/bootstrap@2/bootstrap-2.3.2.min.js"
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
      "/js/libraries/underscore@1/underscore-1.9.1.min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "/js/libraries/underscore@1/underscore-1.9.1.js"
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
      "/js/libraries/underscore@0/underscore-0.6.0.min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "/js/libraries/underscore@0/underscore-0.6.0.js"
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
      "/js/libraries/backbone@1/backbone-1.4.0.min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "/js/libraries/backbone@1/backbone-1.4.0.js"
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
      "/js/libraries/backbone@0/backbone-0.9.10.min.js"
    ]
  },
  development: {
    stylesheets: null,
    scripts: [
      "/js/libraries/backbone@0/backbone-0.9.10.min.js"
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
export const DATA_SOURCE_TYPE_OPTIONS_3 = [["internal-fsb-data-source-type", "RESTful", ["fa-globe", "RESTful"]], ["internal-fsb-data-source-type", "Collection", ["font-weight-bold", "[..., ...]"]], ["internal-fsb-data-source-type", "Dictionary", ["font-weight-bold", "{...}"]]];
export const DATA_WIZARD_TYPE_OPTIONS_1 = [["internal-fsb-data-wizard-type", "insert", ["fa-save", "Insert"]], ["internal-fsb-data-wizard-type", "update", ["fa-save", "Update"]], ["internal-fsb-data-wizard-type", "upsert", ["fa-save", "Upsert"]]];
export const DATA_WIZARD_TYPE_OPTIONS_2 = [["internal-fsb-data-wizard-type", "delete", ["fa-save", "Delete"]], ["internal-fsb-data-wizard-type", "retrieve", ["fa-database", "Retrieve"]], ["internal-fsb-data-wizard-type", "popup", ["fa-list-alt", "Popup"]]];
export const DATA_WIZARD_TYPE_OPTIONS_3 = [["internal-fsb-data-wizard-type", "navigate", ["fa-link", "Navigate"]]];
export const DATA_WIZARD_REAL_TIME_UPDATE = [["internal-fsb-data-wizard-real-time-update", "true", ["fa-circle", "Enable"]], ["internal-fsb-data-wizard-real-time-update", null, ["fa-circle-o", "Disable"]]];
export const DATA_VALUE_SOURCE_OPTIONS = [["internal-fsb-data-value-source", null, ["fa-pencil-square-o", "Front-End"]], ["internal-fsb-data-value-source", "session", ["fa-cog", "Back-End"]]];
export const DATA_VALUE_FORMAT_OPTIONS_1 = [["internal-fsb-data-validation-format", null, ["d-none", "Automatic"]], ["internal-fsb-data-validation-format", "string", ["d-none", "String"]], ["internal-fsb-data-validation-format", "integer", ["d-none", "Integer"]], ["internal-fsb-data-validation-format", "float", ["d-none", "Float"]]];
export const DATA_VALUE_FORMAT_OPTIONS_2 = [["internal-fsb-data-validation-format", "boolean", ["d-none", "Boolean"]], ["internal-fsb-data-validation-format", "title", ["d-none", "Title"]], ["internal-fsb-data-validation-format", "email", ["d-none", "Email"]], ["internal-fsb-data-validation-format", "password", ["d-none", "Password"]]];
export const DATA_VALUE_FORMAT_OPTIONS_3 = [["internal-fsb-data-validation-format", "phone", ["d-none", "Phone"]], ["internal-fsb-data-validation-format", "zipcode", ["d-none", "Zipcode"]], ["internal-fsb-data-validation-format", "custom", ["d-none", "Custom"]]];
export const REACT_FIELD_DIVISION_OPTIONS = [["internal-fsb-react-division", "flatten", ["fa-angle-double-right", "Flatten"]], ["internal-fsb-react-division", "statement", ["fa-code", "Code"]], ["internal-fsb-react-division", null, ["fa-minus fa-rotate-90", "Automatic"]]];
export const REACT_ACCUMULATE_OPTIONS = [["internal-fsb-react-accumulate", "reset", ["fa-eraser", "Reset"]], ["internal-fsb-react-accumulate", null, ["fa-dot-circle-o", "Automatic"]]];
export const REACT_DISPLAY_LOGIC_OPTIONS = [["internal-fsb-react-display-logic", "always", ["fa-edit", "Always"]], ["internal-fsb-react-display-logic", "statement", ["fa-code", "Code"]], ["internal-fsb-react-display-logic", null, ["fa-database", "Automatic"]]];
export const CROSS_OPERATION_OPTIONS = [["internal-fsb-data-wizard-cross-operation", null, ["fa-save", "Same as Action"]], ["internal-fsb-data-wizard-cross-operation", "upsert", ["fa-save", "Upsert"]]];
export const TEXTBOX_MODE_OPTIONS = [["internal-fsb-textbox-mode", null, ["fa-minus", "Single"]], ["internal-fsb-textbox-mode", "multiple", ["fa-reorder", "Multiple"]]];
export const REQUIRE_FULL_CLOSING_TAGS = ["select", "textarea", "div"];
export const CONTAIN_TEXT_CONTENT_TAGS = ["textarea"];
export const INPUT_ELEMENT_TAGS = ["SELECT", "TEXTAREA", "INPUT"];
export const BACKGROUND_TYPE_OPTIONS = [["-fsb-background-type", null, ["d-none", "Solid"]], ["-fsb-background-type", "linear", ["d-none", "Linear Gradient"]], ["-fsb-background-type", "radial", ["d-none", "Radial Gradient"]], ["-fsb-background-type", "coding", ["d-none", "Coding"]]];
export const TEXT_INPUT_TYPE_OPTIONS = [["type", "text", ["fa-font", "Text"]], ["type", "password", ["fa-ellipsis-h", "Password"]]];
export const CELL_STYLE_ATTRIBUTE_REGEX_GLOBAL = /-fsb-cell-([0-9]+)-([0-9]+)-(top|right|left|bottom)\: ([^;]+)/g;
export const CELL_STYLE_ATTRIBUTE_REGEX_LOCAL = /-fsb-cell-([0-9]+)-([0-9]+)-(top|right|left|bottom)\: ([^;]+)/;
export const FORWARD_STYLE_TO_CHILDREN_CLASS_LIST = ['Iframe', 'Textbox', 'Select', 'Radio', 'Checkbox', 'File', 'Image', 'Video', 'Flash'];
export const FORWARD_PROPS_AND_EVENTS_TO_CHILDREN_CLASS_LIST = ['Iframe', 'Textbox', 'Select', 'Radio', 'Checkbox', 'File', 'Image', 'Video', 'Flash'];
export const FORM_CONTROL_CLASS_LIST = ['Textbox', 'Select', 'Radio', 'Checkbox', 'File', 'Hidden'];
export const DOT_NOTATION_CONSUMABLE_TAG_LIST = [['iframe', 'src', '{', '}'], ['a', 'dangerouslySetInnerHTML', '{{__html: CodeHelper.toSecuredDataString(', ')}}'], ['svg', 'dangerouslySetInnerHTML', '{{__html: CodeHelper.toSecuredDataString(', ')}}'], ['input', 'defaultValue', '{', '}'], ['textarea', 'defaultValue', '{', '}'], ['select', 'defaultValue', '{', '}'], ['img', 'src', '{', '}'], ['video', 'src', '{', '}']];
export const DOT_NOTATION_CONSUMABLE_CLASS_LIST = [['HTML', 'dangerouslySetInnerHTML', '{{__html: CodeHelper.toSecuredDataString(', ')}}'], ['TextElement', 'dangerouslySetInnerHTML', '{{__html: CodeHelper.escape(CodeHelper.toSecuredDataString(', '))}}']];
export const INHERITING_COMPONENT_RESERVED_ATTRIBUTE_NAMES = ['internal-fsb-inheriting', 'internal-fsb-guid', 'class', 'style', 'internal-fsb-name', 'internal-fsb-react-id', 'internal-fsb-react-data', 'internal-fsb-react-mode', 'internal-fsb-react-division'];
export const INHERITING_COMPONENT_RESERVED_STYLE_NAMES = ['top', 'right', 'bottom', 'left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'position'];
export const INHERITING_COMPONENT_RESERVED_STYLE_NAMES_IN_CAMEL = ['top', 'right', 'bottom', 'left', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'position'];
export const ANIMATABLE_CSS_PROPERTIES = ['-moz-outline-radius', '-moz-outline-radius-bottomleft', '-moz-outline-radius-bottomright', '-moz-outline-radius-topleft', '-moz-outline-radius-topright', '-ms-grid-columns', '-ms-grid-rows', '-webkit-line-clamp', '-webkit-text-fill-color', '-webkit-text-stroke', '-webkit-text-stroke-color', 'all', 'backdrop-filter', 'background', 'background-color', 'background-position', 'background-size', 'block-size', 'border', 'border-block-end', 'border-block-end-color', 'border-block-end-width', 'border-block-start', 'border-block-start-color', 'border-block-start-width', 'border-bottom', 'border-bottom-color', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-bottom-width', 'border-color', 'border-end-end-radius', 'border-end-start-radius', 'border-image-outset', 'border-image-slice', 'border-image-width', 'border-inline-end', 'border-inline-end-color', 'border-inline-end-width', 'border-inline-start', 'border-inline-start-color', 'border-inline-start-width', 'border-left', 'border-left-color', 'border-left-width', 'border-radius', 'border-right', 'border-right-color', 'border-right-width', 'border-start-end-radius', 'border-start-start-radius', 'border-top', 'border-top-color', 'border-top-left-radius', 'border-top-right-radius', 'border-top-width', 'border-width', 'bottom', 'box-shadow', 'caret-color', 'clip', 'clip-path', 'color', 'column-count', 'column-gap', 'column-rule', 'column-rule-color', 'column-rule-width', 'column-width', 'columns', 'filter', 'flex', 'flex-basis', 'flex-grow', 'flex-shrink', 'font', 'font-size', 'font-size-adjust', 'font-stretch', 'font-variation-settings', 'font-weight', 'gap', 'grid-column-gap', 'grid-gap', 'grid-row-gap', 'grid-template-columns', 'grid-template-rows', 'height', 'inline-size', 'inset', 'inset-block', 'inset-block-end', 'inset-block-start', 'inset-inline', 'inset-inline-end', 'inset-inline-start', 'left', 'letter-spacing', 'line-clamp', 'line-height', 'margin', 'margin-block-end', 'margin-block-start', 'margin-bottom', 'margin-inline-end', 'margin-inline-start', 'margin-left', 'margin-right', 'margin-top', 'mask', 'mask-border', 'mask-position', 'mask-size', 'max-block-size', 'max-height', 'max-inline-size', 'max-lines', 'max-width', 'min-block-size', 'min-height', 'min-inline-size', 'min-width', 'object-position', 'offset', 'offset-anchor', 'offset-distance', 'offset-path', 'offset-position', 'offset-rotate', 'opacity', 'order', 'outline', 'outline-color', 'outline-offset', 'outline-width', 'padding', 'padding-block-end', 'padding-block-start', 'padding-bottom', 'padding-inline-end', 'padding-inline-start', 'padding-left', 'padding-right', 'padding-top', 'perspective', 'perspective-origin', 'right', 'rotate', 'row-gap', 'scale', 'scroll-margin', 'scroll-margin-block', 'scroll-margin-block-end', 'scroll-margin-block-start', 'scroll-margin-bottom', 'scroll-margin-inline', 'scroll-margin-inline-end', 'scroll-margin-inline-start', 'scroll-margin-left', 'scroll-margin-right', 'scroll-margin-top', 'scroll-padding', 'scroll-padding-block', 'scroll-padding-block-end', 'scroll-padding-block-start', 'scroll-padding-bottom', 'scroll-padding-inline', 'scroll-padding-inline-end', 'scroll-padding-inline-start', 'scroll-padding-left', 'scroll-padding-right', 'scroll-padding-top', 'scroll-snap-coordinate', 'scroll-snap-destination', 'scrollbar-color', 'shape-image-threshold', 'shape-margin', 'shape-outside', 'tab-size', 'text-decoration', 'text-decoration-color', 'text-decoration-thickness', 'text-emphasis', 'text-emphasis-color', 'text-indent', 'text-shadow', 'text-underline-offset', 'top', 'transform', 'transform-origin', 'translate', 'vertical-align', 'visibility', 'width', 'word-spacing', 'z-index', 'zoom'];

export const IS_DEVELOPMENT_ENVIRONMENT = (['localhost', 'develop.stackblend.com'].indexOf(window.location.hostname) != -1);
export const DEBUG_MANIPULATION_HELPER = IS_DEVELOPMENT_ENVIRONMENT;
export const DEBUG_GITHUB_UPLOADER = IS_DEVELOPMENT_ENVIRONMENT;
export const DEBUG_SITE_PREVIEW = IS_DEVELOPMENT_ENVIRONMENT;
export const USER_CODE_REGEX_GLOBAL = /\/\/ \<---Auto\[([a-zA-Z0-9_:]+)\]([\s\S]+?)(\/\/ \Auto\[([a-zA-Z0-9_:]+)\]--->|$)/g;
export const USER_CODE_REGEX_GROUP = /\/\/ \<---Auto\[([a-zA-Z0-9_:]+)\]([\s\S]+?)(\/\/ \Auto\[([a-zA-Z0-9_:]+)\]--->|$)/;
export const SYSTEM_CODE_REGEX_BEGIN_GLOBAL = /(\n[ ]*\/\/ \<---Auto\[([a-zA-Z0-9_:]+)\]|[ ]*\/\/ \<---Auto\[([a-zA-Z0-9_:]+)\]\n)/g;
export const SYSTEM_CODE_REGEX_END_GLOBAL = /(\n[ ]*\/\/ \Auto\[([a-zA-Z0-9_:]+)\]--->|[ ]*\/\/ \Auto\[([a-zA-Z0-9_:]+)\]--->\n)/g;

export const BACKEND_DATA_COLUMN_TYPE = [["data-column-type", "primary", ["fa-circle", "Primary"]], ["data-column-type", null, ["fa-circle-o", "General"]]];
export const BACKEND_DATA_FIELD_TYPE_1 = [["data-field-type", "auto", ["d-none", "Increase"]], ["data-field-type", null, ["d-none", "String"]], ["data-field-type", "number", ["d-none", "Number"]]];
export const BACKEND_DATA_FIELD_TYPE_2 = [["data-field-type", "boolean", ["d-none", "Boolean"]], ["data-field-type", "datetime", ["d-none", "DateTime"]]];
export const BACKEND_DATA_FIELD_TYPE_3 = [["data-field-type", null, ["d-none", "String"]], ["data-field-type", "number", ["d-none", "Number"]], ["data-field-type", "boolean", ["d-none", "Boolean"]]];
export const BACKEND_DATA_FIELD_TYPE_4 = [["data-field-type", "datetime", ["d-none", "DateTime"]]];
export const BACKEND_DATA_REQUIRED = [["data-required", "true", ["fa-circle", "Necessary"]], ["data-required", null, ["fa-circle-o", "Additional"]]];
export const BACKEND_DATA_UNIQUE = [["data-unique", "true", ["fa-circle", "Unique"]], ["data-unique", null, ["fa-circle-o", "Common"]]];
export const BACKEND_DATA_FORCE_CONSTRAINT = [["data-force-constraint", "true", ["fa-circle", "Always Have"]], ["data-force-constraint", null, ["fa-circle-o", "None"]]];
export const BACKEND_DATA_EXTENSIONS = ["internal-fsb-data-code-import", "internal-fsb-data-code-declare", "internal-fsb-data-code-interface", "internal-fsb-data-code-body", "internal-fsb-data-code-footer"];
export const BACKEND_DATA_LOCK_MODE = [["data-lock-mode", "always", ["fa-circle", "Always"]], ["data-lock-mode", "relation", ["fa-circle-o", "Relation"]], ["data-lock-mode", "session", ["fa-circle-o", "Session"]]];
export const BACKEND_DATA_LOCK_MODE_1 = [["data-lock-mode", "always", ["fa-circle", "Always"]], ["data-lock-mode", "session", ["fa-circle-o", "Session"]]];
export const BACKEND_DATA_LOCK_MATCHING_MODE = [["data-lock-matching-mode", null, ["fa-circle", "Static Value"]], ["data-lock-matching-mode", "session", ["fa-circle-o", "Dynamic Value"]]];
export const BACKEND_DATA_RENDERING_CONDITION_MODE = [["data-rendering-condition-mode", "block", ["fa-circle", "Block"]], ["data-rendering-condition-mode", "relation", ["fa-circle-o", "Relation"]], ["data-rendering-condition-mode", "session", ["fa-circle-o", "Session"]]];
export const BACKEND_DATA_RENDERING_CONDITION_MODE_1 = [["data-rendering-condition-mode", "block", ["fa-circle", "Block"]], ["data-rendering-condition-mode", "session", ["fa-circle-o", "Session"]]];
export const BACKEND_DATA_RENDERING_CONDITION_MATCHING_MODE = [["data-rendering-condition-matching-mode", null, ["fa-circle", "Static Value"]], ["data-rendering-condition-matching-mode", "session", ["fa-circle-o", "Dynamic Value"]]];
export const BACKEND_VERB = [["data-verb", null, ["d-none", "GET"]], ["data-verb", "POST", ["d-none", "POST"]], ["data-verb", "PUT", ["d-none", "PUT"]], ["data-verb", "DELETE", ["d-none", "DELETE"]]];
export const BACKEND_FORWARD_OPTIONS = [["data-forward-option", null, ["d-none", "Disable"]], ["data-forward-option", "single", ["d-none", "Single"]], ["data-forward-option", "multiple", ["d-none", "Multiple"]]];
export const BACKEND_FORWARD_MODE_OPTIONS = [["data-forward-mode", null, ["d-none", "Collection"]], ["data-forward-mode", "prefix", ["d-none", "Prefixed Columns"]]];
export const BACKEND_FORWARD_RECURSIVE_OPTIONS = [["data-forward-recursive", "true", ["fa-circle", "Enable"]], ["data-forward-recursive", null, ["fa-circle-o", "Disable"]]];
export const BACKEND_CONNECTION_GROUPS = ['RelationalTable', 'DocumentTable', 'VolatileMemory', 'RESTful', 'Queue'];
export const BACKEND_CONNECTION_ENTITIES = ['RelationalColumn', 'DocumentNotation', 'VolatilePrefix', 'Verb', 'Parameter'];
export const BACKEND_SCHEMA_MISSING_ENABLE_OPTIONS = [["data-missing-enable", "true", ["fa-circle", "Enable"]], ["data-missing-enable", null, ["fa-circle-o", "Disable"]]];
export const BACKEND_SCHEMA_MISSING_DEFAULT_OPTIONS = [["data-missing-default", "custom", ["d-none", "Custom"]], ["data-missing-default", "copy", ["d-none", "Copy"]], ["data-missing-default", "empty", ["d-none", "EMPTY"]], ["data-missing-default", null, ["d-none", "NULL"]]];
export const BACKEND_SCHEMA_MISSING_ACTION_DEVELOPMENT_OPTIONS = [["data-missing-action-development", "true", ["d-none", "Migration Script"]], ["data-missing-action-development", null, ["d-none", "Direct Modifying"]]];
export const BACKEND_SCHEMA_MISSING_ACTION_PRODUCTION_OPTIONS = [["data-missing-action-production", "true", ["d-none", "Migration Script"]], ["data-missing-action-production", null, ["d-none", "Direct Modifying"]]];
export const BACKEND_SCHEMA_MISMATCH_ENABLE_OPTIONS = [["data-mismatch-enable", "true", ["fa-circle", "Enable"]], ["data-mismatch-enable", null, ["fa-circle-o", "Disable"]]];
export const BACKEND_SCHEMA_MISMATCH_DEFAULT_OPTIONS = [["data-mismatch-default", "custom", ["d-none", "Custom"]], ["data-mismatch-default", "copy", ["d-none", "Copy"]], ["data-mismatch-default", "empty", ["d-none", "EMPTY"]], ["data-mismatch-default", null, ["d-none", "NULL"]]];
export const BACKEND_SCHEMA_MISMATCH_ACTION_DEVELOPMENT_OPTIONS = [["data-mismatch-action-development", "true", ["d-none", "Migration Script"]], ["data-mismatch-action-development", null, ["d-none", "Direct Modifying"]]];
export const BACKEND_SCHEMA_MISMATCH_ACTION_PRODUCTION_OPTIONS = [["data-mismatch-action-production", "true", ["d-none", "Migration Script"]], ["data-mismatch-action-production", null, ["d-none", "Direct Modifying"]]];
export const BACKEND_SCHEMA_MISMATCH_ACTION_OPTIONS = [["data-mismatch-action", "new", ["d-none", "Always New"]], ["data-mismatch-action", "fallback", ["d-none", "Fallback"]], ["data-mismatch-action", null, ["d-none", "Exception"]]];
export const BACKEND_TIMING_DAYS_OPTIONS = [["data-timing-day-sunday", "true", ["d-none", "S"]], ["data-timing-day-monday", "true", ["d-none", "M"]], ["data-timing-day-tuesday", "true", ["d-none", "T"]], ["data-timing-day-wednesday", "true", ["d-none", "W"]], ["data-timing-day-thursday", "true", ["d-none", "T"]], ["data-timing-day-friday", "true", ["d-none", "F"]], ["data-timing-day-saturday", "true", ["d-none", "S"]]];
export const BACKEND_TIMING_MINUTES_OPTIONS_1 = [["data-timing-minutes", "1", ["d-none", "1m"]], ["data-timing-minutes", "15", ["d-none", "15m"]], ["data-timing-minutes", "30", ["d-none", "30m"]], ["data-timing-minutes", "45", ["d-none", "45m"]]];
export const BACKEND_TIMING_MINUTES_OPTIONS_2 = [["data-timing-minutes", "60", ["d-none", "1h"]], ["data-timing-minutes", "120", ["d-none", "2h"]], ["data-timing-minutes", "180", ["d-none", "3h"]], ["data-timing-minutes", "240", ["d-none", "4h"]], ["data-timing-minutes", "360", ["d-none", "6h"]], ["data-timing-minutes", "480", ["d-none", "8h"]], ["data-timing-minutes", "720", ["d-none", "12h"]]];
export const BACKEND_AUDIT_COLLECTING_OPTIONS = [["data-audit-collecting-option", null, ["fa-circle", "Include"]], ["data-audit-collecting-option", "exclude", ["fa-circle-o", "Exclude"]]];
export const SINGLE_DOM_CONTAINER_ELEMENTS = ['Rectangle', 'Button', 'Link', 'FlowLayout'];
export const ANIMATION_TIMING_MODE = [["animationGroupMode", null, ["fa-hourglass-2", "Time"]], ["animationGroupMode", "scrolling", ["fa-arrows-v", "Scrolling"]]];
export const ANIMATION_SCROLLING_TRIGGERING = [["-fsb-animation-scrolling-triggering", "top", ["fa-level-down", "Top"]], ["-fsb-animation-scrolling-triggering", null, ["fa-arrows-v", "Center"]], ["-fsb-animation-scrolling-triggering", "bottom", ["fa-level-up", "Bottom"]]];
export const ANIMATION_EASING_MODE = [["-fsb-animation-easing-mode", "in", ["fa-sign-in", "In"]], ["-fsb-animation-easing-mode", null, ["fa-arrows-h", "In-Out"]], ["-fsb-animation-easing-mode", "out", ["fa-sign-out", "Out"]]];
export const ANIMATION_EASING_FN_1 = [["-fsb-animation-easing-fn", null, ["d-none", "Linear"]], ["-fsb-animation-easing-fn", "ease", ["d-none", "Ease"]]];
export const EASING_COEFFICIENT = {
	ease: 0.42
};
export const ANIMATION_REPEATING_MODE = [["animationRepeatMode", null, ["fa-hourglass", "Infinite"]], ["animationRepeatMode", "time", ["fa-hourglass-1", "Time"]], ["animationRepeatMode", "disabled", ["fa-hourglass-o", "Disabled"]]];
export const ANIMATION_DEFAULT_STATE = [["animationGroupState", null, ["fa-circle", "Add"]], ["animationGroupState", "off", ["fa-circle-o", "Remove"]]];
export const ANIMATION_DEFAULT_TEST_STATE = [["animationGroupTestState", "on", ["fa-circle", "Add"]], ["animationGroupTestState", "off", ["fa-circle-o", "Remove"]], ["animationGroupTestState", null, ["d-none", "Default"]]];
export const ANIMATION_SYNCHRONIZE_MODE = [["animationSynchronizeMode", null, ["fa-circle", "Synchronize"]], ["animationSynchronizeMode", "off", ["fa-circle-o", "Off"]]];
export const SECOND_SPAN_SIZE = 40;
export const MAXIMUM_OF_SECONDS = 500;
export const TEXT_SHADOW_0_OPTIONS = [null, "{SIZE}", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px"];
export const TEXT_SHADOW_1_OPTIONS = [null, "{SIZE}", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px"];
export const TEXT_SHADOW_2_OPTIONS = [null, "{SIZE}", "0px", "1px", "2px", "3px", "4px", "5px", "10px", "15px", "20px"];
export const TEXT_SHADOW_3_OPTIONS = [null, "{COLOR}"];
export const BOX_SHADOW_0_OPTIONS = [null, "{SIZE}", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px"];
export const BOX_SHADOW_1_OPTIONS = [null, "{SIZE}", "0px", "1px", "2px", "3px", "4px", "5px", "6px", "7px", "8px"];
export const BOX_SHADOW_2_OPTIONS = [null, "{SIZE}", "0px", "1px", "2px", "3px", "4px", "5px", "10px", "15px", "20px"];
export const BOX_SHADOW_3_OPTIONS = [null, "{COLOR}"];
export const SCREEN_SIZE = [320, 576, 768, 992, 1200, 1920];