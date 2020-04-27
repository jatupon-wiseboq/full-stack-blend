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
export const IMAGE_RENDERING_OPTIONS = [null, "auto", "smooth", "high-quality", "crisp-edges", "pixelated"];
export const POINTER_EVENTS_OPTIONS = [null, "auto", "none"];
export const Z_INDEX_OPTIONS = [null, "{NUMBER}"];
export const BACKGROUND_IMAGE_OPTIONS = [null, "{BROWSE}"];
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
export const LIST_STYLE_IMAGE_OPTIONS = [null, "{BROWSE}"];
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
export const REACT_MODE_OPTIONS = [["internal-fsb-react-mode", "document", ["fa-thumb-tack", "Document"]], ["internal-fsb-react-mode", "site", ["fa-puzzle-piece", "Site"]], ["internal-fsb-react-mode", "global", ["fa-globe", "Global"]]];
export const MOUSE_EVENT_HANDLING_OPTIONS = [["x1", "y1", "z1"]];
export const KEYBOARD_EVENT_HANDLING_OPTIONS = [["x2", "y2", "z2"]];
export const TOUCH_EVENT_HANDLING_OPTIONS = [["x3", "y3", "z3"]];
export const DRAG_EVENT_HANDLING_OPTIONS = [["x4", "y4", "z4"]];
export const FORM_EVENT_HANDLING_OPTIONS = [["x5", "y5", "z5"]];
export const DOCUMENT_EVENT_HANDLING_OPTIONS = [["x6", "y6", "z6"]];
export const CLIPBOARD_EVENT_HANDLING_OPTIONS = [["x7", "y7", "z7"]];
export const MEDIA_EVENT_HANDLING_OPTIONS = [["x8", "y8", "z8"]];