import {EventHelper} from '../../helpers/EventHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
    onUpdate(value: any);
}

interface State extends IState {
}

class FileBrowser extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    constructor() {
        super();
    }
    
    fileOnChange(event) {
        let original = EventHelper.getOriginalElement(event);
        let file = original.files[0];
        
        if (this.props.onUpdate) {
            this.props.onUpdate(file);
        }
        
        original.value = null;
    }
    
    render() {
      return (
        pug `
          .custom-file
            label.custom-file-label
              input.custom-file-input(type="file", onChange=this.fileOnChange.bind(this), internal-fsb-event-no-propagate="click")
        `
      )
    }
}

DeclarationHelper.declare('Controls.FileBrowser', FileBrowser);

export {Props, State, FileBrowser};