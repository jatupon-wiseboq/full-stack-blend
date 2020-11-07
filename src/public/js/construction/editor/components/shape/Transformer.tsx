import {HTMLHelper} from '../../../helpers/HTMLHelper.js';
import {CodeHelper} from '../../../helpers/CodeHelper.js';
import {TransformControls, TransformControlsGizmo, TransformControlsPlane} from '../../lib/TransformControls.js';
import {WebGLRenderer, PerspectiveCamera, Scene, DirectionalLight, BoxBufferGeometry, PlaneGeometry, MeshBasicMaterial, Mesh, LineBasicMaterial, DoubleSide, WireframeGeometry, LineSegments, Matrix4, Vector3, Quaternion} from '../../lib/three.module.js';
import {CSS3DObject, CSS3DSprite, CSS3DRenderer} from '../../lib/CSS3DRenderer.js';
import {IProps, IState, DefaultState, DefaultProps, Base} from '../Base.js';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper.js';

declare let React: any;
declare let ReactDOM: any;
declare let perform: any;
declare let THREE: any;

interface Props extends IProps {
}

interface State extends IState {
    mode: string
}

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
    mode: 'rotate'
});

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
    watchingStyleNames: ['transform', '-fsb-mode']
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
    
    protected recentGuid: string = null;
    protected currentTransform: string = null;
    protected currentMode: string = null;
    
    componentDidMount() {
        this.init();
        this.render3D();
    }
    
    public update(properties: any) {
        let previousMode = this.state.styleValues['-fsb-mode'];
        super.update(properties);
        
        if (this.recentGuid != properties.elementGuid || previousMode != this.state.styleValues['-fsb-mode']) {
            this.recentGuid = properties.elementGuid;
            
            if (!this.state.styleValues['transform']) {
                this.reset();
            } else {
                let splited = this.state.styleValues['transform'].split('matrix3d(')[1].split(')')[0].split(',');
                let f = [];
                for (let i=0; i<16; i++) {
                    f.push(parseFloat(splited[i]));
                }
                
                var m = new Matrix4();
                m.set(f[0], f[1], f[2], f[3], -f[4], -f[5], -f[6], -f[7], f[8], f[9], f[10], f[11], f[12], f[13], f[14], f[15]);
                
                this.webGLMesh.position.set(f[12], f[13], f[14]);
                this.webGLMesh.position.negate();
                this.webGLMesh.quaternion.setFromRotationMatrix(m);
                this.webGLMesh.quaternion.inverse();
                this.webGLMesh.scale.setFromMatrixScale(m);
            }
            
            this.currentTransform = null;
            this.currentMode = null;
            this.render3D();
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
        mesh.position.z = -50/2;
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
        this.webGLMesh.quaternion.set(0, 0, 0, 0);
        this.webGLMesh.scale.set(1, 1, 1);
    }
    
    render3D() {
        this.css3DElement.position.copy(this.webGLMesh.position);
        this.css3DElement.position.negate();
        this.css3DElement.quaternion.copy(this.webGLMesh.quaternion);
        this.css3DElement.scale.copy(this.webGLMesh.scale);
        
        this.css3DRenderer.render(this.css3DScene, this.css3DCamera);
        
        let cameraTransform = HTMLHelper.getInlineStyle(HTMLHelper.getAttribute(this.css3DRenderer.domElement.firstElementChild, 'style'), 'transform');
        let objectTransform = HTMLHelper.getInlineStyle(HTMLHelper.getAttribute(ReactDOM.findDOMNode(this.refs.output), 'style'), 'transform');
        
        let isPerspectiveCamera = (this.state.styleValues['-fsb-mode'] === 'perspective');
        let isOrthographicCamera = (this.state.styleValues['-fsb-mode'] === 'orthographic');
        
        let transform = (isPerspectiveCamera || isOrthographicCamera) ? null : objectTransform;
        if (!!transform) {
            transform = transform.split(';')[0] + 'scaleY(-1)';
        }
        
        if (this.currentTransform != transform || this.currentMode != this.state.styleValues['-fsb-mode']) {
            this.currentTransform = transform;
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
                        value: transform
                    }
                ],
                replace: 'transform'
            });
        }
        
        this.webGLRenderer.render(this.webGLScene, this.webGLCamera);
    }
    
    render() {
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
        `
      )
    }
}

DeclarationHelper.declare('Components.Transformer', Transformer);

export {Props, State, Transformer};