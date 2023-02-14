import {CodeHelper} from '../../../helpers/CodeHelper';
import {IProps, IState, DefaultProps, DefaultState, Base} from '../Base';
import {FullStackBlend, DeclarationHelper} from '../../../helpers/DeclarationHelper';
import {SCREEN_RELAXATION_BEGIN} from '../../../Constants';

declare let React: any;
declare let ReactDOM: any;

const shell = require("gl-now")();

const vertexSource = `
precision highp float;

attribute vec3 position;
varying vec2 uv;

void main() {
  uv = position.xy;
  gl_Position = vec4(position, 1.0);
}`;

// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

const fragmentSource = `
precision highp float;

varying vec2 uv;
uniform float seed;
uniform float t;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  // Normalized pixel coordinates (from 0 to 1)
  vec2 pos = uv;
  vec3 col = vec3(0.0);
  float time = (t + seed) / 1000.0;

  // Time varying pixel color
  float p = 1.0 / 10.0;
  float c = 0.0;
  for (int i=0; i<20; i++) {
    float n = snoise(vec3(pos * 0.75, i) + vec3(-time, time, -time) * 0.1);
    
    if (n > 0.0) {
      c += p * n;
    }
  }
  c = 0.5 + c;
  
  col = vec3(c);

  // Output to screen
  float opacity = min(0.8, t / 10000.0);
  gl_FragColor = vec4(col * opacity, opacity);
}`;

interface Props extends IProps {
}

interface State extends IState {
}

let ExtendedDefaultProps = Object.assign({}, DefaultProps);
Object.assign(ExtendedDefaultProps, {
  watchingExtensionNames: []
});

let ExtendedDefaultState = Object.assign({}, DefaultState);
Object.assign(ExtendedDefaultState, {
});

class ScreenRelaxation extends Base<Props, State> {
  protected state: State = {};
  protected static defaultProps: Props = ExtendedDefaultProps;

  constructor(props) {
    super(props);
    Object.assign(this.state, CodeHelper.clone(ExtendedDefaultState));
    
		const makeShader = require("gl-shader");
		let shader, buffer, last = Date.now();
		
		shell.on("gl-init", (() => {
		  const gl = shell.gl;
		
		  shader = makeShader(gl, vertexSource, fragmentSource);
		
		  buffer = gl.createBuffer();
		  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		    -1, -1, 0,
		    -1, 1, 0,
		    1, 1, 0,
		    1, 1, 0,
		    1, -1, 0,
		    -1, -1, 0
		  ]), gl.STATIC_DRAW);
		  
		  if (this.refs.screen) {
		    const screen = ReactDOM.findDOMNode(this.refs.screen);
		    if (screen && shell.element) screen.appendChild(shell.element);
		  }
		}).bind(this));
		
		shell.on("gl-render", ((t) => {
		  const now = Date.now();
		  const diff = now - last;
		  if (diff < SCREEN_RELAXATION_BEGIN) {
		    shader.uniforms.seed = Math.random() * 9999999;
		    return;
		  }
		  
		  const gl = shell.gl;
		
		  shader.bind();
		  
		  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		  shader.attributes.position.pointer();
		  
		  shader.uniforms.t = diff - SCREEN_RELAXATION_BEGIN;
		
		  gl.drawArrays(gl.TRIANGLES, 0, 6);
		}).bind(this));
		
		document.addEventListener('mousemove', () => {
		  last = Date.now();
		}, false);
  }
  
  public componentDidMount() {
    if (this.refs.screen) {
	    const screen = ReactDOM.findDOMNode(this.refs.screen);
	    if (screen && shell.element) screen.appendChild(shell.element);
	  }
  }

  public update(properties: any) {
    if (!super.update(properties)) return;
  }

  render() {
    return pug`
        div(ref='screen' style={pointerEvents: 'none', width: '100vw', height: '100vh', position: 'fixed', zIndex: 16777222, left: 0, right: 0})
        `
  }
}

DeclarationHelper.declare('Components.ScreenRelaxation', ScreenRelaxation);

export {Props, State, ScreenRelaxation};