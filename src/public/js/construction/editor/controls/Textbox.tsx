import {EventHelper} from '../../helpers/EventHelper.js';
import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;

interface Props extends IProps {
    preRegEx: String;
    postRegEx: String;
    onUpdate(value: any);
    spellCheck: boolean;
    failedValidationMessage: String;
    multiline: String;
}

interface State extends IState {
}

class Textbox extends React.Component<Props, State> {
    static defaultProps: Props = {
        spellCheck: true
    }
    
    private previousValue: String = "";
    private previousPreRegExp: String = "";
    private preRegExp: RegExp = null;
    private previousPostRegExp: String = "";
    private postRegExp: RegExp = null;
    
    constructor() {
        super();
    }
    
    componentDidMount() {
        let input = ReactDOM.findDOMNode(this.refs.input);
        input.addEventListener('click', (event) => {
            return EventHelper.cancel(event);
        });
    }
    
    componentDidUpdate(prevProps) {
        let input = ReactDOM.findDOMNode(this.refs.input);
        if (document.activeElement == input) return;
        
        if (this.props.value != input.value) {
            input.value = this.props.value || '';
        }
    }
    
    inputOnKeyUp(event) {
        if (event.which >= 37 && event.which <= 40) return;
    
        let preRegMatch = false;
        if (this.props.preRegExp) {
            if (this.previousPreRegExp != this.props.preRegExp) {
                this.preRegExp = new RegExp('^' + this.props.preRegExp + '$', 'i');
                this.previousPreRegExp = this.props.preRegExp;
            }
            
            let input = ReactDOM.findDOMNode(this.refs.input);
            let completingValue = input.value;
            
            if (completingValue.match(this.preRegExp) != null) {
                this.previousValue = completingValue;
                preRegMatch = true;
            } else {
                input.value = this.previousValue;
            }
        }
        
        if (this.props.postRegExp) {
            if (this.previousPostRegExp != this.props.postRegExp) {
                this.postRegExp = new RegExp('^' + this.props.postRegExp + '$', 'i');
                this.previousPostRegExp = this.props.postRegExp;
            }
            
            let input = ReactDOM.findDOMNode(this.refs.input);
            let completingValue = input.value;
            
            if (completingValue.match(this.postRegExp) != null) {
                if (this.props.onUpdate) {
                    let result = this.props.onUpdate(completingValue);
                    
                    if (typeof result === 'string') {
                        input.value = result;
                    }
                }
            } else if (!completingValue) {
                if (this.props.onUpdate) {
                    let result = this.props.onUpdate(null);
                    
                    if (typeof result === 'string') {
                        input.value = result;
                    }
                }
            }
        } else {
            if (this.props.onUpdate) {
                let input = ReactDOM.findDOMNode(this.refs.input);
                let result = this.props.onUpdate(input.value);
                
                if (typeof result === 'string') {
                    input.value = result;
                }
            }
        }
    }
    
    render() {
      return (
        pug `
          div(style={width: '100%'})
            if !this.props.multiline
              input.form-control.form-control-sm(className=((!!this.props.failedValidationMessage) ? "is-invalid" : ""), ref="input", type="text", onKeyUp=this.inputOnKeyUp, spellCheck=this.props.spellCheck.toString())
              if this.props.failedValidationMessage
                span.invalid-feedback ${this.props.failedValidationMessage}
            else
              textarea.form-control.form-control-sm(className=((!!this.props.failedValidationMessage) ? "is-invalid" : ""), rows="10", ref="input", type="text", onKeyUp=this.inputOnKeyUp, spellCheck=this.props.spellCheck.toString())
              if this.props.failedValidationMessage
                span.invalid-feedback ${this.props.failedValidationMessage}
        `
      )
    }
}

DeclarationHelper.declare('Controls.Textbox', Textbox);

export {Props, State, Textbox};