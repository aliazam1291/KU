/* Three.js WebGL atmospheric shader background */
(function () {
  if (!window.THREE) return;

  const canvas = document.getElementById('bg');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const geometry = new THREE.PlaneGeometry(2, 2);

  const uniforms = {
    uTime:     { value: 0.0 },
    uMouse:    { value: new THREE.Vector2(0.5, 0.5) },
    uScroll:   { value: 0.0 },
  };

  const vert = `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = vec4(position,1.0);
    }
  `;

  const frag = `
    precision highp float;
    uniform float uTime;
    uniform vec2  uMouse;
    uniform float uScroll;
    varying vec2  vUv;

    /* ---- hash / noise helpers ---- */
    float hash(vec2 p){
      p = fract(p * vec2(234.34,435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }

    float vnoise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      float a = hash(i);
      float b = hash(i+vec2(1,0));
      float c = hash(i+vec2(0,1));
      float d = hash(i+vec2(1,1));
      return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
    }

    mat2 rot2(float a){
      float s=sin(a),c=cos(a);
      return mat2(c,s,-s,c);
    }

    float fbm(vec2 p){
      float v=0.0,a=0.5;
      mat2 r=rot2(0.45);
      for(int i=0;i<6;i++){
        v+=a*vnoise(p);
        p=r*p*2.1+vec2(100.0);
        a*=0.5;
      }
      return v;
    }

    /* ---- main ---- */
    void main(){
      vec2 uv = vUv;

      /* subtle mouse parallax */
      vec2 m = (uMouse - 0.5) * 0.18;

      /* domain-warped FBM — gives organic swirling fog */
      vec2 q = vec2(
        fbm(uv*2.4 + uTime*0.035 + m),
        fbm(uv*2.4 + vec2(5.2,1.3) - m + uTime*0.027)
      );

      vec2 r = vec2(
        fbm(uv*2.0 + 1.7*q + vec2(1.7,9.2) + uTime*0.018),
        fbm(uv*2.0 + 1.7*q + vec2(8.3,2.8) - uTime*0.022)
      );

      float f = fbm(uv*1.8 + 1.8*r + uTime*0.015);

      /* colour ramp: near-black → dark warm amber → deep violet */
      vec3 col = mix(
        vec3(0.010,0.010,0.015),   /* base: almost pure black */
        vec3(0.045,0.032,0.010),   /* dark warm */
        clamp(f*f*4.5,0.0,1.0)
      );
      col = mix(col,
        vec3(0.20,0.13,0.04),      /* amber highlight */
        clamp(length(q)*0.55,0.0,1.0)
      );
      col = mix(col,
        vec3(0.018,0.014,0.055),   /* deep violet */
        clamp(f*f*f*9.0,0.0,1.0)
      );

      /* vignette */
      vec2 vig = uv*(1.0-uv);
      col *= pow(vig.x*vig.y*15.0, 0.38);

      /* dim as user scrolls down */
      col *= 1.0 - uScroll * 0.55;

      gl_FragColor = vec4(col,1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    depthWrite: false,
  });

  scene.add(new THREE.Mesh(geometry, material));

  /* mouse tracking */
  let tMx = 0.5, tMy = 0.5;
  let cMx = 0.5, cMy = 0.5;

  window.addEventListener('mousemove', e => {
    tMx = e.clientX / window.innerWidth;
    tMy = 1.0 - e.clientY / window.innerHeight;
  });

  /* resize */
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* public API */
  window.KUBg = {
    setScroll: v => { uniforms.uScroll.value = Math.max(0, Math.min(1, v)); }
  };

  /* render loop */
  let prev = 0;
  (function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;

    uniforms.uTime.value += dt;

    cMx += (tMx - cMx) * 0.04;
    cMy += (tMy - cMy) * 0.04;
    uniforms.uMouse.value.set(cMx, cMy);

    renderer.render(scene, camera);
  })(0);
})();
