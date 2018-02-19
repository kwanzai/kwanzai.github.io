var MAX_HP = 10;

var bulletTex = new PIXI.Texture.fromImage('/images/jebaited.png');


class Player {
  
  constructor( container, x, y ) { 
    var playerTex = id["explorer.png"];

    var texture = playerTex;
    var textures = [texture];
    var D8 = PIXI.GroupD8;
    for (var rotate = 1; rotate < 16; rotate++) {
        var h = D8.isVertical(rotate) ? texture.frame.width : texture.frame.height;
        var w = D8.isVertical(rotate) ? texture.frame.height : texture.frame.width;

      	var frame = texture.frame;
        var crop = new PIXI.Rectangle(texture.frame.x, texture.frame.y, w, h);
        var trim = crop;
        var rotatedTexture;
        if (rotate%2==0) {
        	rotatedTexture = new PIXI.Texture(texture.baseTexture, frame, crop, trim, rotate);
        } else {
            //HACK to avoid exception
			      //PIXI doesnt like diamond-shaped UVs, because they are different in canvas and webgl
          	rotatedTexture = new PIXI.Texture(texture.baseTexture, frame, crop, trim, rotate-1);
          	rotatedTexture.rotate++;
        }
        textures.push(rotatedTexture);
    }
    
    this._hp = MAX_HP;
    this._attackPower = 1;
    this._attackSpeed = 1;
    this._projectileSpeed = 2;
    this._bullets = [];
    
    this._container = container;
    //this._body = new Sprite(id["explorer.png"]);
    this._body = new Sprite(textures[6]);
    this._body.position.x = x;
    this._body.position.y = y;
    this._body.anchor.x = 0.5;
    this._body.anchor.y = 0.5;
    this._container.addChild( this._body );
    
    this._bulletAngle = 0;
    
    app.ticker.add(delta => this.update(delta));
  }
  
  setPosition(x, y) {
    this._body.position.x = x;
    this._body.position.y = y; 
  } 
  
  shoot(rotation, startPosition) {  
    var bullet = new Sprite(bulletTex);
    bullet.position.x = startPosition.x;
    bullet.position.y = startPosition.y;
    bullet.anchor.x = 0.5;
    bullet.anchor.y = 0.5;
    bullet.rotation = rotation;
    
    this._container.addChild(bullet);
    this._bullets.push(bullet);    
  }
  
  update(delta) {
    
    this._body.rotation = rotateToPoint(app.renderer.plugins.interaction.mouse.global.x, app.renderer.plugins.interaction.mouse.global.y, this._body.position.x, this._body.position.y);

    for(var b = this._bullets.length-1; b >= 0; b--) {
      this._bullets[b].position.x += Math.cos(this._bullets[b].rotation) * this._projectileSpeed;
      this._bullets[b].position.y += Math.sin(this._bullets[b].rotation) * this._projectileSpeed;
    }
    
//     this._bullets.forEach(
//       function(bullet) {

//       if(hitTestRectangle(explorer._body, blob._body)) {
//         explorerHit = true;
//       }
//     });
    
    function rotateToPoint(mx, my, px, py) {
      var self = this;
      var dist_Y = my - py;
      var dist_X = mx - px;
      var angle = Math.atan2(dist_Y,dist_X);
      //var degrees = angle * 180/ Math.PI;
      
      return angle;
    }
  }
  
}