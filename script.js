window.requestAnimFrame = (function () {
      return window.requestAnimationFrame || function (callback) {
        window.setTimeout(callback, 5000 / 50);
      };
    })();
    
    function Scene() {
      this.animation = undefined;
      this.canvas = undefined;
      this.height = 0;
      this.width = 0;
      this.context = undefined;
      this.paused = false;
      this.stats = undefined;
      this.istats = undefined;
    }
    Scene.prototype = {
      constructor: Scene,
      setup: function (canvas, animation, width, height, stats) {
        this.canvas = canvas;
        this.animation = animation;
        this.height = this.canvas.height = height;
        this.width = this.canvas.width = width;
        this.context = this.canvas.getContext('2d');
        this.stats = stats && window.Stats;
        if (this.stats) {
          this.istats = new Stats();
          this.istats.setMode(0);
          this.istats.domElement.style.position = 'absolute';
          this.istats.domElement.style.left = '0px';
          this.istats.domElement.style.top = '0px';
          this.istats.domElement.style.zIndex = '99999';
          document.body.appendChild(this.istats.domElement);
        }
      },
      animate: function () {
        if (!this.paused) {
          requestAnimFrame(this.animate.bind(this));
        }
        this.stats && (this.istats.begin());
        this.animation(this); 
        this.stats && (this.istats.end());
      }
    };
    
    let scene = new Scene(),
      particles = [],
      len = 200,
      height = document.body.offsetHeight,
      width = document.body.offsetWidth;
    
    function Particle() {
      this.x = 0;
      this.y = 0;
      this.size = 0;
      this.depth = 0;
      this.vy = 0;
    }
    Particle.prototype = {
      constructor: Particle,
      update: function (width, height) {
        if (this.y > height) {
          this.y = 1 - this.size;
        }
        this.y += this.vy;
      }
    };
    for (let i = 0; i < len; i++) {
      let particle = new Particle();
      particle.x = Math.random() * width;
      particle.y = Math.random() * height;
      particle.depth = Math.random() * 6 | 0;
      particle.size = (particle.depth + 1) / 7;
      particle.vy = (particle.depth * .25) + 1 / Math.random();
      particles.push(particle);
    }
    
    function falling_particles() {
      let idata = this.context.createImageData(this.width, this.height);
      for (let i = 0, l = particles.length; i < l; i++) {
        let particle = particles[i];
        for (let w = 0; w < particle.size; w++) {
          for (let h = 0; h < particle.size; h++) {
            let pData = (~~(particle.x + w) + (~~(particle.y + h) * this.width)) * 4;
            idata.data[pData] = 255;
            idata.data[pData + 1] = 255;
            idata.data[pData + 2] = 255;
            idata.data[pData + 3] = 255;
          }
        }
        particle.update(this.width, this.height);
      }
      this.context.putImageData(idata, 0, 0);
    }
    scene.setup(document.getElementById('canvas'), falling_particles, width, height, !0);
    scene.animate();
    window.onresize = function () {
      height = scene.height = scene.canvas.height = document.body.offsetHeight;
      width = scene.width = scene.canvas.width = document.body.offsetWidth;
    };
    