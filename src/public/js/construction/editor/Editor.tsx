import { FullStackBlend } from '../helpers/DeclarationHelper';
import { EventHelper } from '../helpers/EventHelper';
import { HTMLHelper } from '../helpers/HTMLHelper';
import { RequestHelper } from '../helpers/RequestHelper';
import { WORKSPACE_TOGGLING_ATTRIBUTES, WORKSPACE_TOGGLING_STYLES, WORKSPACE_TOGGLING_EXTENSIONS } from '../Constants';

import './components/layout/GridPicker';
import './components/layout/OffsetPicker';
import './components/layout/DisplayPicker';
import './components/layout/PreservePicker';
import './components/layout/LayerManager';
import './components/layout/LayerToolManager';
import './components/layout/PreviewSizePicker';

import './components/css/CSSPresets';
import './components/css/CSSStyles';
import './components/css/CSSPresetName';
import './components/css/CSSCustomClasses';
import './components/css/ComputedStyleManager';

import './components/shape/DimensionPicker';
import './components/shape/AppearancePicker';
import './components/shape/BoundaryPicker';
import './components/shape/Transformer';
import './components/shape/SizePicker';
import './components/shape/SwatchPicker';
import './components/shape/GradientPicker';
import './components/shape/SVGEditor';

import './components/generic/DropDownPicker';
import './components/generic/RadioButtonPicker';
import './components/generic/NumberPicker';
import './components/generic/TextPicker';

import './components/code/FrontEndScriptEditor';
import './components/code/ReactEventBinder';
import './components/code/BackEndEventBinder';
import './components/code/ExternalLibrariesChooser';
import './components/code/AttributeManager';
import './components/code/OptionManager';
import './components/code/WizardInputManager';
import './components/code/BackEndScriptEditor';
import './components/code/DebuggingConsole';
import './components/code/ExternalLibrariesManager';
import './components/code/CustomProjectSettingsManager';
import './components/code/LocalizedStringsManager';

import './components/content/SitePreview';
import './components/content/PageManager';
import './components/content/ProjectManager';
import './components/content/ComponentMenu';
import './components/content/ComponentManager';
import './components/content/PopupManager';
import './components/content/EndpointManager';
import './components/content/SchemaManager';
import './components/content/PropertyManager';

import './components/animation/AnimationPicker';
import './components/animation/TimelineManager';
import './components/animation/KeyframeManager';
import './components/animation/Keyframe';

//import GitHub from 'github-api';

declare let React : any;
declare let ReactDOM : any;

let Accessories = {
  preview: null
};

let recentExtraPanelSelector : string = null;
let cachedUpdateEditorProperties = {};

(function() {
  window.perform = (name : string, content : any) => {
    if (['undo', 'redo'].indexOf(name) != -1) {
      document.body.click();
    }

    const element = document.getElementById('area') as HTMLFrameElement;
    const contentWindow = element.contentWindow;
    const stringifyIfNeed = contentWindow.messageFnArray ? (data : any) => data : JSON.stringify;
    contentWindow.postMessage(stringifyIfNeed({
      name: name,
      content: content
    }), '*');
  };

  window.toggle = (name : string, iconSelector : string) => {
    let icon = HTMLHelper.getElementBySelector(iconSelector);
    if (HTMLHelper.hasClass(icon, 'fa-toggle-on')) {
      HTMLHelper.removeClass(icon, 'fa-toggle-on');
      HTMLHelper.addClass(icon, 'fa-toggle-off');
    } else {
      HTMLHelper.removeClass(icon, 'fa-toggle-off');
      HTMLHelper.addClass(icon, 'fa-toggle-on');
    }

    switch (name) {
      case 'explorer':
        HTMLHelper.getElementById(name).style.display = HTMLHelper.hasClass(icon, 'fa-toggle-on') ? '' : 'none';
        break;
      case 'layering':
        HTMLHelper.getElementById(name).style.display = HTMLHelper.hasClass(icon, 'fa-toggle-on') ? '' : 'none';
        break;
    }

    perform('toggle', name);

    synchronize('click');
  };

  window.swap = (selector : string, toolsetSelector : string = null, extraPanelSelector : string = null, replacingIconSelector : string = null, iconClass : string = null, skipExtraPanel : boolean = false) => {
    const button = EventHelper.getCurrentElement(event);
    if (button.tagName != 'A') button = button.parentNode;

    const accessory = HTMLHelper.getAttribute(HTMLHelper.getElementBySelector('a.active', button.parentNode) || button, 'id');
    const isSwappingEditingMode = ['#design', '#animation', '#coding'].indexOf(selector) != -1;
    const isTogglingOff = isSwappingEditingMode && HTMLHelper.hasClass(button, 'active');

    HTMLHelper.getElementsBySelector('a.active', button.parentNode).forEach((value, index) => {
      if (value.parentNode != button.parentNode) return;
      HTMLHelper.removeClass(value, 'active');
    });

    if (isTogglingOff) {
      if (isSwappingEditingMode) {
        HTMLHelper.getElementBySelector('.workspace-panel-container.sidebar').style.display = 'none';
        HTMLHelper.getElementById('timeline').style.display = 'none';
        HTMLHelper.getElementById('codeEditor').style.display = 'none';
      }
    } else {
      if (isSwappingEditingMode) {
        HTMLHelper.getElementBySelector('.workspace-panel-container.sidebar').style.display = '';
        HTMLHelper.getElementById('timeline').style.display = '';
        HTMLHelper.getElementById('codeEditor').style.display = '';
      }

      HTMLHelper.addClass(button, 'active');
    }

    const panel = HTMLHelper.getElementsBySelector('.panel' + selector);

    panel.forEach((value, index) => {
      HTMLHelper.getElementsBySelector('.panel', value.parentNode).forEach((p, index) => {
        if (p.parentNode != value.parentNode) return;
        HTMLHelper.removeClass(p, 'active');
      });
      HTMLHelper.addClass(value, 'active');
    });

    if (replacingIconSelector != null) {
      HTMLHelper.getElementsBySelector(replacingIconSelector).forEach((replacingIconElement) => {
        if (!replacingIconElement.className || typeof replacingIconElement.className !== 'string') return;
        replacingIconElement.className = replacingIconElement.className.replace(/fa\-[a-z\-]+/g, iconClass);
      });
    }

    if (!skipExtraPanel) {
      if (recentExtraPanelSelector != null) {
        HTMLHelper.getElementsBySelector(recentExtraPanelSelector).forEach((recentExtraPanel) => {
          HTMLHelper.removeClass(recentExtraPanel, 'active');
        });
      }

      if (extraPanelSelector != null) {
        const extraPanel = HTMLHelper.getElementsBySelector(extraPanelSelector).forEach((extraPanel) => {
          HTMLHelper.addClass(extraPanel, 'active');
        });
      }

      recentExtraPanelSelector = extraPanelSelector;
    }

    if (toolsetSelector) {
      HTMLHelper.getElementsBySelector('.toolset').forEach((value, index) => {
        value.style.display = 'none';
      });
      HTMLHelper.getElementsBySelector(toolsetSelector).forEach((toolset) => {
        toolset.style.display = '';
      });
    }

    if (HTMLHelper.getAttribute(button, 'skip-perform') !== 'true') {
      perform('swap', {
        id: HTMLHelper.getAttribute(button, 'id'),
        accessory: accessory
      });
    }
    HTMLHelper.removeAttribute(button, 'skip-perform');

    synchronize('click');

    // Fix console's element sizing bug.
    // 
    window.setTimeout(() => {
      window.repl.output.focus();
    }, 10);
    window.setTimeout(() => {
      window.repl.input.focus();
      window.repl.resetInput();
    }, 20);

    if (event) return EventHelper.cancel(event);
  };

  window.FullStackBlend = FullStackBlend;

  window.controls = [];

  var synchronize = (name : string, content : any) => {
    switch (name) {
      case 'select':
        break;
      case 'updateEditorProperties':
        let recent = cachedUpdateEditorProperties;
        for (let key in content) {
          if (content.hasOwnProperty(key)) {
            if (content[key] === '~') {
              content[key] = recent[key];
            } else if (key === 'extensions') {
              let extensions = content[key] || {};
              let recentExtensions = recent[key] || {};
              for (let extensionKey in extensions) {
                if (extensions.hasOwnProperty(extensionKey)) {
                  if (extensions[extensionKey] === '~') {
                    extensions[extensionKey] = recentExtensions[extensionKey];
                  }
                }
              }
            }
          }
        }

        cachedUpdateEditorProperties = Object.assign({}, content);
        prepareUpdateOptionalVisibilities();

        if (content && content['attributes']) {
          for (let key of WORKSPACE_TOGGLING_ATTRIBUTES) {
            let value = content['attributes'][key];
            if (value) updateOptionalVisibilities(key, value);
          }
          let style = content['attributes']['style'];
          if (style) {
            let hashMap = HTMLHelper.getHashMapFromInlineStyle(style);
            for (let key of WORKSPACE_TOGGLING_STYLES) {
              let value = hashMap[key];
              if (value) updateOptionalVisibilities(key, value);
            }
          }
        }
        if (content && content['extensions']) {
          document.body.setAttribute('selector', (content['extensions']['editingAnimationID'] == 'selector') ? 'true' : 'false');
          if (content['extensions']['editorCurrentMode']) document.body.setAttribute('mode', content['extensions']['editorCurrentMode']);
          if (content['extensions']['editorCurrentExplore']) document.body.setAttribute('explore', content['extensions']['editorCurrentExplore']);

          for (let key of WORKSPACE_TOGGLING_EXTENSIONS) {
            let value = content['extensions'][key];
            if (value) updateOptionalVisibilities(key, value);
          }
        }

        window.controls.forEach((control) => {
          control.update(content);
        });

        HTMLHelper.removeClass(document.body, 'internal-fsb-selecting-off');
        HTMLHelper.removeClass(document.body, 'internal-fsb-selecting-on');
        HTMLHelper.removeClass(document.body, 'internal-fsb-workspace-coding-off');
        HTMLHelper.removeClass(document.body, 'internal-fsb-workspace-coding-on');
        HTMLHelper.addClass(document.body, content && content['extensions'] && content['extensions']['isSelectingElement'] ?
          'internal-fsb-selecting-on' : 'internal-fsb-selecting-off');
        HTMLHelper.addClass(document.body, content && content['extensions'] && ['designer', 'business'].indexOf(content['extensions']['workspaceMode']) == -1 ?
          'internal-fsb-workspace-coding-on' : 'internal-fsb-workspace-coding-off');
        break;
      case 'click':
        document.body.click();
        break;
      case 'swap':
        let element = document.getElementById(content);
        if (element) {
          element.setAttribute('skip-perform', 'true');
          element.click();
        }
        break;
    }
  };
  var prepareUpdateOptionalVisibilities = () => {
    HTMLHelper.getElementsBySelector('[internal-fsb-for]').forEach((value, index) => {
      value.style.display = 'none';
    });
    HTMLHelper.getElementsBySelector('[internal-fsb-not-for]').forEach((value, index) => {
      value.style.display = '';
    });
  };
  var updateOptionalVisibilities = (key, value) => {
    HTMLHelper.getElementsBySelector('[internal-fsb-for="' + key + '"]').forEach((value, index) => {
      const displayValue = HTMLHelper.getAttribute(value, 'internal-fsb-for-display-value');
      if (displayValue) value.style.display = displayValue;
      else value.style.display = '';
    });
    HTMLHelper.getElementsBySelector('[internal-fsb-for*="' + key + ':' + value + '"]').forEach((value, index) => {
      const displayValue = HTMLHelper.getAttribute(value, 'internal-fsb-for-display-value');
      if (displayValue) value.style.display = displayValue;
      else value.style.display = '';
    });
    HTMLHelper.getElementsBySelector('[internal-fsb-not-for="' + key + '"]').forEach((value, index) => {
      value.style.display = 'none';
    });
    HTMLHelper.getElementsBySelector('[internal-fsb-not-for*="' + key + ':' + value + '"]').forEach((value, index) => {
      value.style.display = 'none';
    });
  };

  window.addEventListener("keydown", (event : any) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;

    let element = EventHelper.getOriginalElement(event);
    if (element.tagName != "TEXTAREA" && (element.tagName != "INPUT" || element.getAttribute('type') != 'text')) {
      if (element.className && element.className.indexOf('ace_') == 0) return;
      if (HTMLHelper.hasClass(document.body, 'internal-fsb-preview-on')) return;
      if (HTMLHelper.hasClass(document.body, 'internal-fsb-external-on')) return;

      perform('keydown', event.keyCode);

      switch (event.keyCode) {
        case 67:
        case 86:
        case 88:
          return;
      }

      return EventHelper.cancel(event);
    }
  });
  window.addEventListener("keyup", (event : any) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;

    let element = EventHelper.getOriginalElement(event);
    if (element.tagName != "TEXTAREA" && (element.tagName != "INPUT" || element.getAttribute('type') != 'text')) {
      if (element.className && element.className.indexOf('ace_') == 0) return;

      perform('keyup', event.keyCode);

      return EventHelper.cancel(event);
    }
  });
  window.addEventListener("cut", (event : any) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;

    let element = EventHelper.getOriginalElement(event);
    if (element.tagName != "TEXTAREA" && (element.tagName != "INPUT" || element.getAttribute('type') != 'text')) {
      if (element.className && element.className.indexOf('ace_') == 0) return;

      const iframe = document.getElementById('area') as HTMLFrameElement;
      const contentWindow = iframe.contentWindow;

      contentWindow && contentWindow.performClipboardAction && contentWindow.performClipboardAction("cut", event);
    }
  });
  window.addEventListener("copy", (event : any) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;

    let element = EventHelper.getOriginalElement(event);
    if (element.tagName != "TEXTAREA" && (element.tagName != "INPUT" || element.getAttribute('type') != 'text')) {
      if (element.className && element.className.indexOf('ace_') == 0) return;

      const iframe = document.getElementById('area') as HTMLFrameElement;
      const contentWindow = iframe.contentWindow;

      contentWindow && contentWindow.performClipboardAction && contentWindow.performClipboardAction("copy", event);
    }
  });
  window.addEventListener("paste", (event : any) => {
    if (EventHelper.checkIfDenyForHandle(event)) return;

    let element = EventHelper.getOriginalElement(event);
    if (element.tagName != "TEXTAREA" && (element.tagName != "INPUT" || element.getAttribute('type') != 'text')) {
      if (element.className && element.className.indexOf('ace_') == 0) return;

      const iframe = document.getElementById('area') as HTMLFrameElement;
      const contentWindow = iframe.contentWindow;

      contentWindow && contentWindow.performClipboardAction && contentWindow.performClipboardAction("paste", event);
    }
  });
  window.addEventListener("scroll", (event : any) => {
    window.scrollTo(0, 0);
  });

  const messageFn = (event) => {
    try {
      let data = (typeof event.data === 'string') ? JSON.parse(event.data) : event.data;
      if (data.target == 'editor') {
        synchronize(data.name, data.content);
      }
    } catch (error) {
      /* void */
    }
  };
  window.addEventListener("message", messageFn);
  window.messageFnArray = window.messageFnArray || [];
  window.messageFnArray.push(messageFn);
  window.postMessage = (data : any) => {
    if (typeof data === 'string') data = JSON.parse(data);
    for (const messageFn of window.messageFnArray) {
      messageFn({
        data: data
      });
    }
  };

  window.addEventListener("beforeunload", (event : any) => {
    if (!window.overrideBeforeUnload) {
      event.preventDefault();
      event.returnValue = 'Your changes may be lost. Are you sure you want to exit the editor?';

      return 'Your changes may be lost. Are you sure you want to exit the editor?';
    }
  });

  window.addEventListener('contextmenu', (event : any) => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return;

    if (!top._contextMenuNotice) {
      alert("The system's context menu isn't supported. Please use ctrl+c, ctrl+x, and ctrl+v for copy-and-paste text and element instead.");
      top._contextMenuNotice = true;
    }

    return EventHelper.cancel(event);
  }, true);

  window.setup = (() => {
    HTMLHelper.getElementsBySelector('.workspace-panel-container.scrollable').forEach((value, index) => {
      value.addEventListener('scroll', (event) => {
        document.body.click();
      });
    });
    Accessories.projectManager.current.load();
  });
  window.update = (() => {
    HTMLHelper.addClass(HTMLHelper.getElementByClassName('update-button'), 'in-progress');

    Accessories.endpointManager.current.save(() => {
      HTMLHelper.removeClass(HTMLHelper.getElementByClassName('update-button'), 'in-progress');
    }, true);
  });
  window.save = (() => {
    Accessories.projectManager.current.save();
  });
  window.merge = (() => {
    Accessories.projectManager.current.merge();
  });
  window.deploy = (() => {
    Accessories.projectManager.current.deploy();
  });

  let latestRevision = 0;
  let currentRevision = null;
  let timerIncrementalUpdate = null;

  window.preview = ((incremental : boolean = false) => {
    if (incremental) {
      window.clearTimeout(timerIncrementalUpdate);
      timerIncrementalUpdate = window.setTimeout(() => {
        Accessories.endpointManager.current.save(() => { }, true);
      }, 2500);
    } else {
      latestRevision += 1;
      currentRevision = latestRevision;

      Accessories.preview.current.open();

      HTMLHelper.getElementBySelector('#siteButton').click();

      window.setTimeout(() => {
        Accessories.endpointManager.current.save((success) => {
          if (!Accessories.preview.current.isOpening()) return;
          if (success) {
            window.setTimeout(() => {
              Accessories.preview.current.start();

              let endpoint = window.ENDPOINT;
              if (endpoint.indexOf('https://localhost') == 0) {
                endpoint = 'https://localhost.stackblend.org';
              }

              RequestHelper.get(`${endpoint}/endpoint/recent/error?r=${Math.floor(Math.random() * 999999)}`).then((results) => {
                if (currentRevision == latestRevision) {
                  if (!results.success) {
                    console.error(`${results.error}`);
                    Accessories.preview.current.close();
                  }
                }
              }).catch(() => {
              });
            }, 3000);
          } else {
            console.error('There was an error trying to update content at endpoint.');
            Accessories.preview.current.close();
          }
        });
      }, 1000);
    }
  });

  let setup = (() => {
    let previewContainer = document.createElement('div');
    Accessories.preview = React.createRef();
    ReactDOM.render(<FullStackBlend.Components.SitePreview ref={Accessories.preview} />, previewContainer);
    document.body.appendChild(previewContainer);

    let projectManagerContainer = document.createElement('div');
    Accessories.projectManager = React.createRef();
    ReactDOM.render(<FullStackBlend.Components.ProjectManager ref={Accessories.projectManager} />, projectManagerContainer);
    document.body.appendChild(projectManagerContainer);

    let endpointManagerContainer = document.createElement('div');
    Accessories.endpointManager = React.createRef();
    ReactDOM.render(<FullStackBlend.Components.EndpointManager ref={Accessories.endpointManager} />, endpointManagerContainer);
    document.body.appendChild(endpointManagerContainer);
  });
  setup();
})();