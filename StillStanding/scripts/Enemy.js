const MAX_SPEED = 10;
var MAX_HP = 1;

class Enemy { 
  
  constructor( container, x, y ) { 
    this._hp = MAX_HP;
    this._attackPower = 1;
    this._movementSpeed = 2;		
		
    this._container = container; 
    this._body = new Sprite(id["blob.png"]);
    this._body.position.x = x;
    this._body.position.y = y; 
    this._body.anchor.x = 0.5; 
    this._body.anchor.y = 0.5;
    
    this._container.addChild( this._body ); 
    
    app.ticker.add(delta => this.update(delta));
  }
  
  setPosition(x, y) {
    this._body.position.x = x;
    this._body.position.y = y; 
  }
  
  setTarget(target) {
    this._target = target;
		
		this._dx = this._target.position.x - this._body.position.x;
    this._dy = this._target.position.y - this._body.position.y;
		
		this._distToTarget = Math.abs(Math.sqrt(this._dx * this._dx + this._dy * this._dy));
		
		this._velx = (this._dx/this._distToTarget) * this._movementSpeed;
    this._vely = (this._dy/this._distToTarget) * this._movementSpeed;
  }
	
	takeDamage(theDamage) {
		if(this._hp > 0) {
			this._hp -= theDamage;	
			
			if(this._hp <= 0) {
				this.die();			
			}
		}		
	}
	
	die() {
		blobs.pop(this);
		
		this._container.removeChild(this._body);
	}
  
	update( delta ) {

		// cap the speed at max speed
		if( this._movementSpeed > MAX_SPEED ) {
			this._movementSpeed = MAX_SPEED;
		}
		
		if(this._distToTarget >= 1) {
			this._body.position.x += this._velx * delta;
			this._body.position.y += this._vely * delta;
			
			this._dx = this._target.position.x - this._body.position.x;
    	this._dy = this._target.position.y - this._body.position.y;
		
			this._distToTarget = Math.abs(Math.sqrt(this._dx * this._dx + this._dy * this._dy));
			//console.log(this._distToTarget);
		}
	}
}