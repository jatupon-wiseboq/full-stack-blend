import {FullStackBlend, DeclarationHelper} from '../../helpers/DeclarationHelper';
import {HTMLHelper} from '../../helpers/HTMLHelper';
import {EventHelper} from '../../helpers/EventHelper';

declare let React: any;
declare let ReactDOM: any;

interface Props {
}

interface State {
}

class RedLine extends React.Component<Props, State> {
    static defaultProps: Props = {
    }
    
    private domElement: HTMLElement = null;
    private currentMeasuringToElement: HTMLElement = null;
    
    private redLineOnTop: HTMLElement = null;
    private redLineOnRight: HTMLElement = null;
    private redLineOnBottom: HTMLElement = null;
    private redLineOnLeft: HTMLElement = null;
    private redLineInfo: HTMLElement = null;
    
    constructor() {
        super();
        
        this.redLineOnTop = document.createElement('div');
        this.redLineOnTop.className = 'internal-fsb-accessory internal-fsb-top-red-line';
        this.redLineOnTop.innerHTML = '<span class="internal-fsb-red-line-value"></span>';
        
        this.redLineOnRight = document.createElement('div');
        this.redLineOnRight.className = 'internal-fsb-accessory internal-fsb-right-red-line';
        this.redLineOnRight.innerHTML = '<span class="internal-fsb-red-line-value"></span>';
        
        this.redLineOnBottom = document.createElement('div');
        this.redLineOnBottom.className = 'internal-fsb-accessory internal-fsb-bottom-red-line';
        this.redLineOnBottom.innerHTML = '<span class="internal-fsb-red-line-value"></span>';
        
        this.redLineOnLeft = document.createElement('div');
        this.redLineOnLeft.className = 'internal-fsb-accessory internal-fsb-left-red-line';
        this.redLineOnLeft.innerHTML = '<span class="internal-fsb-red-line-value"></span>';
        
        this.redLineInfo = document.createElement('div');
        this.redLineInfo.className = 'internal-fsb-accessory internal-fsb-info-red-line';
        this.redLineInfo.innerHTML = '<span class="internal-fsb-red-line-value"></span>';
        
        document.body.addEventListener('scroll', this.reset.bind(this));
    }
    
    public getDOMNode() {
        return this.domElement;
    }
    public setDOMNode(element: HTMLElement) {
        this.domElement = element;
    }
    
    public reset() {
    		this.currentMeasuringToElement && HTMLHelper.removeClass(this.currentMeasuringToElement, 'internal-fsb-measuring');
    		
				this.redLineOnTop.parentNode && this.redLineOnTop.parentNode.removeChild(this.redLineOnTop);
				this.redLineOnRight.parentNode && this.redLineOnRight.parentNode.removeChild(this.redLineOnRight);
				this.redLineOnBottom.parentNode && this.redLineOnBottom.parentNode.removeChild(this.redLineOnBottom);
				this.redLineOnLeft.parentNode && this.redLineOnLeft.parentNode.removeChild(this.redLineOnLeft);
				this.redLineInfo.parentNode && this.redLineInfo.parentNode.removeChild(this.redLineInfo);
				
				this.currentMeasuringToElement = null;
    }
    
    public detach() {
    		this.getDOMNode().parentNode && this.getDOMNode().parentNode.removeChild(this.getDOMNode());
    }
    
    public measure(event: Event) {
    		const container = document.body;
    		
    		if (this.currentMeasuringToElement) this.reset();    		
    		if (!event) return;
    		
    		const mouseEvent = event as MouseEvent;
    		const measureFrom = this.getDOMNode().parentNode;
    		const measureTo = EventHelper.getCurrentElement(event);
    		
    		if (measureFrom == measureTo) return;
    		if (!measureFrom) return;
    		if (!measureTo) return;
    		
    		this.currentMeasuringToElement = measureTo;
    		
    		const measureFromPosition = HTMLHelper.getPosition(measureFrom);
    		const measureFromSize = HTMLHelper.getSize(measureFrom);
    		const measureToPosition = HTMLHelper.getPosition(measureTo);
    		const measureToSize = HTMLHelper.getSize(measureTo);
    		
    		const FT = measureFromPosition[1];
    		const FB = measureFromPosition[1] + measureFromSize[1];
    		const FL = measureFromPosition[0];
    		const FR = measureFromPosition[0] + measureFromSize[0];
    		const TT = measureToPosition[1];
    		const TB = measureToPosition[1] + measureToSize[1];
    		const TL = measureToPosition[0];
    		const TR = measureToPosition[0] + measureToSize[0];
    		
    		let found = false;
    		let flag = false;
    		
    		if (FT >= TB || FT >= TT) {
    			const mid = (Math.max(FL, TL) + Math.min(FR, TR)) / 2;
	    		const min = Math.min(FT - TB, FT - TT);
    			
    			if (mid >= FL && mid <= FR && min >= 0) {
	    			this.redLineOnTop.style.left = mid + 'px';
	    			this.redLineOnTop.style.top = (FT - min) + 'px';
	    			this.redLineOnTop.style.height = min + 'px';
	    			
	    			container.appendChild(this.redLineOnTop);
	    			
	    			this.redLineOnTop.firstElementChild.innerText = min + ' px';
	    			this.redLineOnTop.firstElementChild.style.marginLeft = (this.redLineOnTop.firstElementChild.offsetWidth / -2) + 'px';
	    			
	    			found = true;
	    			flag = true;
    			}
    		}
    		if (!flag && FT >= TT && FT <= TB) {
    			const mid = (Math.max(FL, TL) + Math.min(FR, TR)) / 2;
	    		const min = FT - TT;
    			
    			if (mid >= FL && mid <= FR && min >= 0) {
	    			this.redLineOnTop.style.left = mid + 'px';
	    			this.redLineOnTop.style.top = (FT - min) + 'px';
	    			this.redLineOnTop.style.height = min + 'px';
	    			
	    			container.appendChild(this.redLineOnTop);
	    			
	    			this.redLineOnTop.firstElementChild.innerText = min + ' px';
	    			this.redLineOnTop.firstElementChild.style.marginLeft = (this.redLineOnTop.firstElementChild.offsetWidth / -2) + 'px';
	    			
	    			found = true;
    			}
    		}
    		
    		flag = false;
    		
    		if (FR <= TL || FR <= TR) {
    			const mid = (Math.max(FT, TT) + Math.min(FB, TB)) / 2;
	    		const min = Math.min(TL - FR, TR - FR);
	    		
    			if (mid >= FT && mid <= FB && min >= 0) {
	    			this.redLineOnRight.style.left = FR + 'px';
	    			this.redLineOnRight.style.top = mid + 'px';
	    			this.redLineOnRight.style.width = min + 'px';
	    			
	    			container.appendChild(this.redLineOnRight);
	    			
	    			this.redLineOnRight.firstElementChild.innerText = min + ' px';
	    			this.redLineOnRight.firstElementChild.style.marginLeft = (this.redLineOnRight.firstElementChild.offsetWidth / -2) + 'px';
	    			
	    			found = true;
	    			flag = true;
	    		}
    		}
    		if (!flag && FR >= TL && FR <= TR) {
    			const mid = (Math.max(FT, TT) + Math.min(FB, TB)) / 2;
	    		const min = TR - FR;
	    		
    			if (mid >= FT && mid <= FB && min >= 0) {
	    			this.redLineOnRight.style.left = FR + 'px';
	    			this.redLineOnRight.style.top = mid + 'px';
	    			this.redLineOnRight.style.width = min + 'px';
	    			
	    			container.appendChild(this.redLineOnRight);
	    			
	    			this.redLineOnRight.firstElementChild.innerText = min + ' px';
	    			this.redLineOnRight.firstElementChild.style.marginLeft = (this.redLineOnRight.firstElementChild.offsetWidth / -2) + 'px';
	    			
	    			found = true;
	    		}
    		}
    		
    		flag = false;
    		
    		if (FB <= TT || FB <= TB) {
    			const mid = (Math.max(FL, TL) + Math.min(FR, TR)) / 2;
	    		const min = Math.min(TT - FB, TB - FB);
    			
    			if (mid >= FL && mid <= FR && min >= 0) {
	    			this.redLineOnBottom.style.left = mid + 'px';
	    			this.redLineOnBottom.style.top = FB + 'px';
	    			this.redLineOnBottom.style.height = min + 'px';
	    			
	    			container.appendChild(this.redLineOnBottom);
	    			
	    			this.redLineOnBottom.firstElementChild.innerText = min + ' px';
	    			this.redLineOnBottom.firstElementChild.style.marginLeft = (this.redLineOnBottom.firstElementChild.offsetWidth / -2) + 'px';
	    			
	    			found = true;
	    			flag = true;
	    		}
    		}
    		if (!flag && FB >= TT && FB <= TB) {
    			const mid = (Math.max(FL, TL) + Math.min(FR, TR)) / 2;
	    		const min = TB - FB;
    			
    			if (mid >= FL && mid <= FR && min >= 0) {
	    			this.redLineOnBottom.style.left = mid + 'px';
	    			this.redLineOnBottom.style.top = FB + 'px';
	    			this.redLineOnBottom.style.height = min + 'px';
	    			
	    			container.appendChild(this.redLineOnBottom);
	    			
	    			this.redLineOnBottom.firstElementChild.innerText = min + ' px';
	    			this.redLineOnBottom.firstElementChild.style.marginLeft = (this.redLineOnBottom.firstElementChild.offsetWidth / -2) + 'px';
	    			
	    			found = true;
	    		}
    		}
    		
    		flag = false;
    		
    		if (FL >= TR || FL >= TL) {
    			const mid = (Math.max(FT, TT) + Math.min(FB, TB)) / 2;
	    		const min = Math.min(FL - TR, FL - TL);
    			
    			if (mid >= FT && mid <= FB && min >= 0) {
	    			this.redLineOnLeft.style.left = (FL - min) + 'px';
	    			this.redLineOnLeft.style.top = mid + 'px';
	    			this.redLineOnLeft.style.width = min + 'px';
	    			
	    			container.appendChild(this.redLineOnLeft);
	    			
	    			this.redLineOnLeft.firstElementChild.innerText = min + ' px';
	    			this.redLineOnLeft.firstElementChild.style.marginLeft = (this.redLineOnLeft.firstElementChild.offsetWidth / -2) + 'px';
	    			
	    			found = true;
	    			flag = true;
	    		}
    		}
    		if (!flag && FL >= TL && FL <= TR) {
    			const mid = (Math.max(FT, TT) + Math.min(FB, TB)) / 2;
	    		const min = FL - TL;
    			
    			if (mid >= FT && mid <= FB && min >= 0) {
	    			this.redLineOnLeft.style.left = (FL - min) + 'px';
	    			this.redLineOnLeft.style.top = mid + 'px';
	    			this.redLineOnLeft.style.width = min + 'px';
	    			
	    			container.appendChild(this.redLineOnLeft);
	    			
	    			this.redLineOnLeft.firstElementChild.innerText = min + ' px';
	    			this.redLineOnLeft.firstElementChild.style.marginLeft = (this.redLineOnLeft.firstElementChild.offsetWidth / -2) + 'px';
	    			
	    			found = true;
	    		}
    		}
    		
    		if (found) {
    			HTMLHelper.addClass(measureTo, 'internal-fsb-measuring');
    			
    			container.appendChild(this.redLineInfo);
    			
    			this.redLineInfo.style.top = ((FT + FB) / 2) + 'px';
    			this.redLineInfo.style.left = ((FL + FR) / 2) + 'px';
    			this.redLineInfo.firstElementChild.innerText = `${measureFromSize[0]} x ${measureFromSize[1]} px`;
    			this.redLineInfo.firstElementChild.style.marginLeft = (this.redLineInfo.firstElementChild.offsetWidth / -2) + 'px';
    		}
    }
    
    render() {
        return (
            pug `
              .internal-fsb-redline.internal-fsb-accessory(ref='container')
            `
        )
    }
}

DeclarationHelper.declare('Controls.RedLine', RedLine);

export {Props, State, RedLine};