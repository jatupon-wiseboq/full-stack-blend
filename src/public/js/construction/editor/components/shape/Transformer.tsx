import {HTMLHelper} from '../../../helpers/HTMLHelper';
import {CodeHelper} from '../../../helpers/CodeHelper';
import {TransformControls, TransformControlsGizmo, TransformControlsPlane} from '../../lib/TransformControls';
import {WebGLRenderer, PerspectiveCamera, Scene, DirectionalLight, BoxBufferGeometry, PlaneGeometry, MeshBasicMaterial, Mesh, LineBasicMaterial, DoubleSide, WireframeGeometry, LineSegments, Matrix4, Vector3, Quaternion} from '../../lib/three.module';
import {CSS3DObject, CSS3DSprite, CSS3DRenderer} from '../../lib/CSS3DRenderer';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;
declare let THREE: any;

const ZERO: number = 0.00001;

interface Props extends IProps {
}

interface State extends IState {
    mode: string,
    translateX: number,
    translateY: number,
    translateZ: number,
    rotateX: number,
    rotateY: number,
    rotateZ: number,
    scaleX: number,
    scaleY: number,
    scaleZ: number
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    mode: 'rotate'
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    watchingStyleNames: ['-fsb-transform', '-fsb-mode']
});

class Transformer extends Base<Props, State> {
    protected state: State = {};
    protected static defaultProps: Props = ExtendedDefaultProps;
    
    private webGLCamera: any;
    private webGLScene: any;
    private webGLRenderer: any;
    private webGLControl: any;
    private webGLMesh: any;
    
    private css3DCamera: any;
    private css3DScene: any;
    private css3DRenderer: any;
    private css3DElement: any;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    }
    
    protected currentTransform: string = null;
    
    componentDidMount() {
        this.init();
        this.render3D();
    }
    
    public update(properties: any) {
        let previousMode = this.state.styleValues['-fsb-mode'];
        super.update(properties);
        
        if (this.state.styleValues['-fsb-transform'] != this.currentTransform || this.state.styleValues['-fsb-mode'] != previousMode) {
            this.currentTransform = this.state.styleValues['-fsb-transform'];
            
            if (!this.state.styleValues['-fsb-transform']) {
                this.reset();
            } else {
                let splited = this.state.styleValues['-fsb-transform'].split(' ');
                let f = [];
                for (let i=0; i<9; i++) {
                    f.push(parseFloat(splited[i]));
                }
                
                this.webGLMesh.position.x = f[0];
                this.webGLMesh.position.y = f[1]; 
                this.webGLMesh.position.z = f[2];
                this.webGLMesh.quaternion.x = f[3];
                this.webGLMesh.quaternion.y = f[4]; 
                this.webGLMesh.quaternion.z = f[5];
                this.webGLMesh.scale.x = f[6];
                this.webGLMesh.scale.y = f[7]; 
                this.webGLMesh.scale.z = f[8];
            }
            
            this.render3D();
            this.forceUpdate();
        }
    }
    
    init() {
        let width = 236.0;
        let height = 210.0;
        
        this.initWebGLRenderer(width, height);
        this.initCSS3DRenderer(width, height);
        this.initControl();
        
        window.setTimeout(this.render3D.bind(this), 1000);
		}
    initWebGLRenderer(width: number, height: number) {
        // WebGL Renderer
        //
        let container = ReactDOM.findDOMNode(this.refs.container);
    
        this.webGLRenderer = new WebGLRenderer({alpha: true});
        this.webGLRenderer.setPixelRatio(window.devicePixelRatio);
        this.webGLRenderer.setSize(236, 210);
        this.webGLRenderer.setClearColor(0x000000, 0);
        container.appendChild(this.webGLRenderer.domElement);
        
        this.webGLCamera = new PerspectiveCamera(90, width / height, 1, 3000);
        this.webGLCamera.position.set(0, 0, -100);
        this.webGLCamera.lookAt(0, 0, 0);
        
        this.webGLScene = new Scene();
        this.webGLScene.add(this.webGLCamera);
        
        var geometry = new BoxBufferGeometry(50, 50, 50);
        var wireframe = new WireframeGeometry(geometry);
        
        this.webGLMesh = new LineSegments(wireframe);
        this.webGLMesh.material.color.setHex(0x555555);
        this.webGLMesh.material.depthTest = false;
        this.webGLMesh.material.opacity = 0.25;
        this.webGLMesh.material.transparent = true;
        
        this.webGLScene.add(this.webGLMesh);
        
        let plane = new PlaneGeometry(50, 50, 8);
        let material = new MeshBasicMaterial({color: 0xf5f5f5, side: DoubleSide});
        let mesh = new Mesh(plane, material);
        mesh.position.z = 50/2;
        this.webGLMesh.add(mesh);
        
        this.reset();
    }
    initCSS3DRenderer(width: number, height: number) {
        // CSS3D Renderer
        //
        this.css3DRenderer = new CSS3DRenderer();
        this.css3DRenderer.setSize(236, 210);
        
        this.css3DCamera = new PerspectiveCamera(90, width / height, 1, 3000);
        this.css3DCamera.position.set(0, 0, -100);
        this.css3DCamera.lookAt(0, 0, 0);
        
        this.css3DElement = new CSS3DObject(ReactDOM.findDOMNode(this.refs.output));
        this.css3DElement.position.set(0, 0, 0);
        
        this.css3DScene = new Scene();
        this.css3DScene.add(this.css3DElement);
        this.css3DScene.add(this.css3DCamera);
    }
    initControl() {
        // Transformer Control
        //
        this.webGLControl = new TransformControls(this.webGLCamera, this.webGLRenderer.domElement);
        
        this.webGLControl.attach(this.webGLMesh);
        this.webGLControl.setMode(this.state.mode);
        this.webGLControl.addEventListener('change', this.render3D.bind(this));
        
        this.webGLScene.add(this.webGLControl);
    }
    
    optionOnClick(mode) {
        if (mode == 'reset') {
            this.reset();
            this.render3D();
        } else {
            this.setState({
                mode: mode
            });
            this.webGLControl.setMode(mode);
        }
    }
    
    modeOnClick(mode) {
        perform('update', {
            styles: [{
                name: '-fsb-mode',
                value: mode || null
            }],
            replace: '-fsb-mode'
        });
    }
    
    reset() {
        this.webGLMesh.position.set(0, 0, 0);
        this.webGLMesh.quaternion.set(-1, ZERO, ZERO, ZERO);
        this.webGLMesh.scale.set(1, 1, 1);
    }
    
    render3D() {
        this.css3DElement.position.copy(this.webGLMesh.position);
        this.css3DElement.position.negate();
        this.css3DElement.quaternion.copy(this.webGLMesh.quaternion);
        this.css3DElement.scale.copy(this.webGLMesh.scale);
        
        const updatingState = {};
        
        if (this.state.translateX != this.webGLMesh.position.x) updatingState.translateX = this.webGLMesh.position.x.toFixed(8);
        if (this.state.translateY != this.webGLMesh.position.y) updatingState.translateY = this.webGLMesh.position.y.toFixed(8);
        if (this.state.translateZ != this.webGLMesh.position.z) updatingState.translateZ = this.webGLMesh.position.z.toFixed(8);
        
        if (this.state.rotateX != this.webGLMesh.quaternion.x) updatingState.rotateX = this.webGLMesh.quaternion.x.toFixed(8);
        if (this.state.rotateY != this.webGLMesh.quaternion.y) updatingState.rotateY = this.webGLMesh.quaternion.y.toFixed(8);
        if (this.state.rotateZ != this.webGLMesh.quaternion.z) updatingState.rotateZ = this.webGLMesh.quaternion.z.toFixed(8);
        
        if (updatingState.rotateX == ZERO) updatingState.rotateX = 0;
        if (updatingState.rotateY == ZERO) updatingState.rotateY = 0;
        if (updatingState.rotateZ == ZERO) updatingState.rotateZ = 0;
        
        if (this.state.scaleX != this.webGLMesh.scale.x) updatingState.scaleX = this.webGLMesh.scale.x.toFixed(8);
        if (this.state.scaleY != this.webGLMesh.scale.y) updatingState.scaleY = this.webGLMesh.scale.y.toFixed(8);
        if (this.state.scaleZ != this.webGLMesh.scale.z) updatingState.scaleZ = this.webGLMesh.scale.z.toFixed(8);
        
        if (Object.keys(updatingState).length != 0) {
        	this.setState(updatingState);
        }
        
        this.css3DRenderer.render(this.css3DScene, this.css3DCamera);
        
        let cameraTransform = HTMLHelper.getInlineStyle(HTMLHelper.getAttribute(this.css3DRenderer.domElement.firstElementChild, 'style'), 'transform');
        let objectTransform = HTMLHelper.getInlineStyle(HTMLHelper.getAttribute(ReactDOM.findDOMNode(this.refs.output), 'style'), 'transform');
        
        let isPerspectiveCamera = (this.state.styleValues['-fsb-mode'] === 'perspective');
        let isOrthographicCamera = (this.state.styleValues['-fsb-mode'] === 'orthographic');
        
        let transform = (isPerspectiveCamera || isOrthographicCamera) ? null : objectTransform;
        if (!!transform) {
            transform = transform.split(';')[0];
        }
        
        let fsbTransform = [
        	this.webGLMesh.position.x.toFixed(8), this.webGLMesh.position.y.toFixed(8), this.webGLMesh.position.z.toFixed(8),
        	this.webGLMesh.quaternion.x.toFixed(8), this.webGLMesh.quaternion.y.toFixed(8), this.webGLMesh.quaternion.z.toFixed(8),
        	this.webGLMesh.scale.x.toFixed(8), this.webGLMesh.scale.y.toFixed(8), this.webGLMesh.scale.z.toFixed(8)
        ].join(' ');
        
        if (this.currentTransform != fsbTransform) {
            const Default = '0.00000000 0.00000000 0.00000000 -1.00000000 0.00001000 0.00001000 1.00000000 1.00000000 1.00000000';
            
            this.currentTransform = (fsbTransform != Default) ? fsbTransform : null;
            this.currentMode = this.state.styleValues['-fsb-mode'];
            
            perform('update', {
                styles: [
                    {
                        name: '-fsb-mode',
                        value: (isPerspectiveCamera || isOrthographicCamera) ? this.state.styleValues['-fsb-mode'] : null
                    },
                    {
                        name: 'perspective',
                        value: (isPerspectiveCamera) ? '236px' : null
                    },
                    {
                        name: '-child-transform-style',
                        value: (isPerspectiveCamera) ? 'preserve-3d' : null
                    },
                    {
                        name: '-child-transform',
                        value: null
                    },
                    {
                        name: 'transform',
                        value: (fsbTransform != Default) ? transform : null
                    },
                    {
                        name: '-fsb-transform',
                        value: (fsbTransform != Default) ? fsbTransform : null
                    }
                ],
                replace: '-fsb-transform'
            });
        }
        
        this.webGLRenderer.render(this.webGLScene, this.webGLCamera);
    }
    
    textboxOnUpdateTranslateX(value: string) {
    	let number = parseFloat(value);    	
    	if (isNaN(number)) number = 0;
    	
    	this.webGLMesh.position.x = number;
    	
    	this.render3D();
    }
    
    textboxOnUpdateTranslateY(value: string) {
    	let number = parseFloat(value);    	
    	if (isNaN(number)) number = 0;
    	
    	this.webGLMesh.position.y = number;
    	
    	this.render3D();
    }
    
    textboxOnUpdateTranslateZ(value: string) {
    	let number = parseFloat(value);    	
    	if (isNaN(number)) number = 0;
    	
    	this.webGLMesh.position.z = number;
    	
    	this.render3D();
    }
    
    textboxOnUpdateRotateX(value: string) {
    	let number = parseFloat(value);    	
    	if (isNaN(number)) number = 0;
    	if (number == 0) number = ZERO;
    	
    	this.webGLMesh.quaternion.x = number;
    	
    	this.render3D();
    }
    
    textboxOnUpdateRotateY(value: string) {
    	let number = parseFloat(value);    	
    	if (isNaN(number)) number = 0;
    	if (number == 0) number = ZERO;
    	
    	this.webGLMesh.quaternion.y = number;
    	
    	this.render3D();
    }
    
    textboxOnUpdateRotateZ(value: string) {
    	let number = parseFloat(value);    	
    	if (isNaN(number)) number = 0;
    	if (number == 0) number = ZERO;
    	
    	this.webGLMesh.quaternion.z = number;
    	
    	this.render3D();
    }
    
    textboxOnUpdateScaleX(value: string) {
    	let number = parseFloat(value);    	
    	if (isNaN(number)) number = 0;
    	
    	this.webGLMesh.scale.x = number;
    	
    	this.render3D();
    }
    
    textboxOnUpdateScaleY(value: string) {
    	let number = parseFloat(value);    	
    	if (isNaN(number)) number = 0;
    	
    	this.webGLMesh.scale.y = number;
    	
    	this.render3D();
    }
    
    textboxOnUpdateScaleZ(value: string) {
    	let number = parseFloat(value);    	
    	if (isNaN(number)) number = 0;
    	
    	this.webGLMesh.scale.z = number;
    	
    	this.render3D();
    }
    
    render() {
    	const Textbox = FullStackBlend.Controls.Textbox;
    	const floatingPointPreRegex = "-?(([0-9])|([0-9][\.])|([0-9][\.][0-9]*)|([1-9][0-9]*)|([1-9][0-9]*[\.])|([1-9][0-9]*[\.][0-9]*)|([1-9][0-9]*))?";
    	const floatingPointPostRegex = "-?(([0][\.][0-9]+)|([1-9][0-9]*[\.][0-9]+)|([1-9][0-9]*)|([0]))";
    	
      return (
        pug `
          div
            div
              div.text-center.mt-1.mb-1
                .btn-group.btn-group-sm(role="group")
                  button.btn.btn-sm.text-center(onClick=this.modeOnClick.bind(this, 'perspective'), className=(this.state.styleValues['-fsb-mode'] == 'perspective' ? 'btn-primary' : 'btn-light'))
                    | Perspective
                  button.btn.btn-sm.text-center(onClick=this.modeOnClick.bind(this, 'orthographic'), className=(this.state.styleValues['-fsb-mode'] == 'orthographic' ? 'btn-primary' : 'btn-light'))
                    | Orthographic
                  button.btn.btn-sm.text-center(onClick=this.modeOnClick.bind(this, ''), className=(!this.state.styleValues['-fsb-mode'] ? 'btn-primary' : 'btn-light'))
                    | Object
            div
              div(ref="output", style={display: 'none'})
              div(style={position: 'relative', border: 'dashed 1px #999999'})
                div(ref="container", style={visibility: !this.state.styleValues['-fsb-mode'] ? 'visible' : 'hidden'})
                div(style={position: 'absolute', top: '20px', right: '20px', bottom: '20px', left: '20px', fontSize: '10px', visibility: this.state.styleValues['-fsb-mode'] ? 'visible' : 'hidden'})
                  | 3D control is not available for this camera. Please manipulate from other objects inside this one.
              div.text-center.mt-1
                .btn-group.btn-group-sm(role="group")
                  button.btn.btn-sm.text-center(onClick=this.optionOnClick.bind(this, 'translate'), className=(this.state.mode == 'translate' ? 'btn-primary' : 'btn-light'))
                    | Move
                  button.btn.btn-sm.text-center(onClick=this.optionOnClick.bind(this, 'rotate'), className=(this.state.mode == 'rotate' ? 'btn-primary' : 'btn-light'))
                    | Rotate
                  button.btn.btn-sm.text-center(onClick=this.optionOnClick.bind(this, 'scale'), className=(this.state.mode == 'scale' ? 'btn-primary' : 'btn-light'))
                    | Scale
                  button.btn.btn-sm.text-center.btn-light(onClick=this.optionOnClick.bind(this, 'reset'))
                    | Reset
              div(style={display: this.state.mode == 'translate' ? 'block' : 'none', padding: '5px 24px'})
                .input-group.input-group-sm(style={padding: '3px 0 0 0'})
                  .input-group-prepend
                    .input-group-text(style={backgroundColor: '#f8f9fa'})
                      | x:
                  div(style={width: '100%'})
                    Textbox(value=this.state.translateX preRegExp=floatingPointPreRegex postRegExp=floatingPointPostRegex borderRadiusOnLeft=true onUpdate=this.textboxOnUpdateTranslateX.bind(this))
                .input-group.input-group-sm(style={padding: '3px 0 0 0'})
                  .input-group-prepend
                    .input-group-text(style={backgroundColor: '#f8f9fa'})
                      | y:
                  div(style={width: '100%'})
                    Textbox(value=this.state.translateY preRegExp=floatingPointPreRegex postRegExp=floatingPointPostRegex borderRadiusOnLeft=true onUpdate=this.textboxOnUpdateTranslateY.bind(this))
                .input-group.input-group-sm(style={padding: '3px 0 0 0'})
                  .input-group-prepend
                    .input-group-text(style={backgroundColor: '#f8f9fa'})
                      | z:
                  div(style={width: '100%'})
                    Textbox(value=this.state.translateZ preRegExp=floatingPointPreRegex postRegExp=floatingPointPostRegex borderRadiusOnLeft=true onUpdate=this.textboxOnUpdateTranslateZ.bind(this))
              div(style={display: this.state.mode == 'rotate' ? 'block' : 'none', padding: '5px 24px'})
                .input-group.input-group-sm(style={padding: '3px 0 0 0'})
                  .input-group-prepend
                    .input-group-text(style={backgroundColor: '#f8f9fa'})
                      | x:
                  div(style={width: '100%'})
                    Textbox(value=this.state.rotateX preRegExp=floatingPointPreRegex postRegExp=floatingPointPostRegex borderRadiusOnLeft=true onUpdate=this.textboxOnUpdateRotateX.bind(this))
                .input-group.input-group-sm(style={padding: '3px 0 0 0'})
                  .input-group-prepend
                    .input-group-text(style={backgroundColor: '#f8f9fa'})
                      | y:
                  div(style={width: '100%'})
                    Textbox(value=this.state.rotateY preRegExp=floatingPointPreRegex postRegExp=floatingPointPostRegex borderRadiusOnLeft=true onUpdate=this.textboxOnUpdateRotateY.bind(this))
                .input-group.input-group-sm(style={padding: '3px 0 0 0'})
                  .input-group-prepend
                    .input-group-text(style={backgroundColor: '#f8f9fa'})
                      | z:
                  div(style={width: '100%'})
                    Textbox(value=this.state.rotateZ preRegExp=floatingPointPreRegex postRegExp=floatingPointPostRegex borderRadiusOnLeft=true onUpdate=this.textboxOnUpdateRotateZ.bind(this))
              div(style={display: this.state.mode == 'scale' ? 'block' : 'none', padding: '5px 24px'})
                .input-group.input-group-sm(style={padding: '3px 0 0 0'})
                  .input-group-prepend
                    .input-group-text(style={backgroundColor: '#f8f9fa'})
                      | x:
                  div(style={width: '100%'})
                    Textbox(value=this.state.scaleX preRegExp=floatingPointPreRegex postRegExp=floatingPointPostRegex borderRadiusOnLeft=true onUpdate=this.textboxOnUpdateScaleX.bind(this))
                .input-group.input-group-sm(style={padding: '3px 0 0 0'})
                  .input-group-prepend
                    .input-group-text(style={backgroundColor: '#f8f9fa'})
                      | y:
                  div(style={width: '100%'})
                    Textbox(value=this.state.scaleY preRegExp=floatingPointPreRegex postRegExp=floatingPointPostRegex borderRadiusOnLeft=true onUpdate=this.textboxOnUpdateScaleY.bind(this))
                .input-group.input-group-sm(style={padding: '3px 0 0 0'})
                  .input-group-prepend
                    .input-group-text(style={backgroundColor: '#f8f9fa'})
                      | z:
                  div(style={width: '100%'})
                    Textbox(value=this.state.scaleZ preRegExp=floatingPointPreRegex postRegExp=floatingPointPostRegex borderRadiusOnLeft=true onUpdate=this.textboxOnUpdateScaleZ.bind(this))
        `
      )
    }
}

DeclarationHelper.declare('Components.Transformer', Transformer);

export {Props, State, Transformer};