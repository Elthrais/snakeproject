window.onload = function(){ //se lance quand la fenêtre se charge
	var canvasWidth = 900;
	var canvasHeight = 600;
	var blockSize = 30;
	var ctx;
	var delay = 100; //délais (en mms)
	var snakee;
	var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;
    
	init(); //exécute la fonction init
	
	function init(){ //initialise le programme
		/* 
        Initialise le jeu en entier avec le canvas, la pomme et le
        serpent
        */
		var canvas = document.createElement('canvas'); //permet de dessiner dans le HTML
		canvas.width = canvasWidth; //largeur du canvas
		canvas.height = canvasHeight; //hauteur du canvas
		canvas.style.border = "30px solid #696969"; //définit le style du canvas
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#FFEBCD";
		document.body.appendChild(canvas); //accrocher le canvas au HTML
		ctx = canvas.getContext('2d'); //va permettre de dessiner dans le canvas en 2D
		snakee = new Snake ([[6,4], [5,4], [4,4]], "right"); 
		applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas(); //appel la fonction refresh
	}
	/* 
    va permettre au jeu de fonctionner en rafraîchissant
    le canvas 
    */
	function refreshCanvas(){ //rafraîchir le canvas
        snakee.advance(); //faire avancer le serpent
        if(snakee.checkCollision()){
                gameOver();
            }
        else {
                if (snakee.isEatingApple(applee)) {
                        score++;
                        snakee.ateApple = true;
                        do {
                            applee.setNewPosition();
                        }
                        while(applee.isOnSnake(snakee))
                    }
                    
                ctx.clearRect(0, 0, canvasWidth, canvasHeight); //efface tout le canvas
                drawScore();
                snakee.draw(); //dessine le serpent
                applee.draw(); // dessine la pomme
                timeout = setTimeout(refreshCanvas,delay) //permet d'exécuter une fonction après un délai
            }		
	}
        
        function gameOver() { // affiche la fin de partie et les possibilités
            ctx.save();
             ctx.font = "bold 70px sans-serif";
            ctx.fillStyle = "#FF0000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            var centreX = canvasWidth / 2;
            var centreY = canvasHeight / 2;
            ctx.strokeText("You loose !", centreX, centreY - 180);
            ctx.fillText("You loose !", centreX, centreY - 180);
            ctx.font = "bold 30px sans-serif";
            ctx.strokeText("Continue ? Press space", centreX, centreY - 120);
            ctx.fillText("Continue ? Press space", centreX, centreY - 120);
            ctx.restore();
        }
        
        function restart(){ // permet de recommencer une partie
            snakee = new Snake ([[6,4], [5,4], [4,4]], "right"); 
		    applee = new Apple([10, 10]);
            score = 0;
            clearTimeout(timeout);
            refreshCanvas(); //appel la fonction refresh
        }
        
        function drawScore(){ // affiche le score
            ctx.save();
            ctx.font = "bold 200px sans-serif";
            ctx.fillStyle = "#556B2F"
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            var centreX = canvasWidth / 2;
            var centreY = canvasHeight / 2;
            
            ctx.fillText(score.toString(), centreX, canvasHeight - centreY);
            ctx.restore();
        }
	
	   function drawBlock(ctx, position){
		var x = position[0] * blockSize;
		var y = position[1] * blockSize;
		ctx.fillRect(x, y, blockSize, blockSize);
	}
	
        /*
        fonction du serpent : créer le serpent, donne la direction,
        indique si le serpent mange la pomme
        */
	   function Snake (body, direction){ //prototype du serpent
		this.body = body;
        this.direction = direction;
        this.ateApple = false;
		this.draw = function(){
			ctx.save(); //sauvegarde les paramètre du canvas avant d'entrer dans la fonction
			ctx.fillStyle = "#8470FF"
			for(var i = 0; i < this.body.length; i++){
				drawBlock(ctx,this.body[i]);
			}
			ctx.restore(); //permet de restaurer le contexte d'origine
		};
        
        this.advance = function(){ // faire avancer le serpent
            var nextPosition = this.body[0].slice(); //copie l'élément
           
            switch(this.direction){
                    case "left":
                        nextPosition[0] -= 1;
                        break;
                    case "right":
                        nextPosition[0] += 1;
                        break;
                    case "down":
                        nextPosition[1] += 1;
                        break;
                    case "up":
                        nextPosition[1] -= 1;
                        break;
                    default:
                        throw("Invalid Direction");
                }
            
            this.body.unshift(nextPosition); //mettre l'attribut en première position
            if(!this.ateApple)
                this.body.pop(); //supprimer dernier élément d'un array
            else
                this.ateApple = false;
        };
        
        this.setDirection = function(newDirection){ // fonction de déplacement du serpent
            var allowedDirections;
            switch(this.direction){
                    case "left":
                    case "right":
                        allowedDirections = ["up", "down"];
                        break;
                    case "down":
                    case "up":
                        allowedDirections = ["left", "right"]
                        break; 
                    default:
                        throw("Invalid Direction");
                }
            if(allowedDirections.indexOf(newDirection) > -1){
                    this.direction = newDirection;
                }
                
        };
        
        /*fonction qui va permettre de savoir si le serpent se prend
        un mur ou s'il revient sur lui-même */  
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                    wallCollision = true;
                }
            for (var i = 0; i < rest.length; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1] ){
                        snakeCollision = true;
                    }
            }
            
            return wallCollision || snakeCollision;
        };
        
        this.isEatingApple = function(appleToEat){ // permet de savoir si la pomme est mangée
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                    return true;
            else
                return false;
        }; 
	}	
    
    function Apple(position){ //définit la pomme et sa position
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle="#B22222";
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        
        this.setNewPosition = function(){ // définit la nouvelle position de la pomme une fois mangée
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };
        
        this.isOnSnake = function(snakeToCheck){ // permet d'empêcher la pomme d'apparaître sur le corps du serpent
            var isOnSnake = false;
            for(var i = 0; i < snakeToCheck.body.length; i++){
                    if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                            isOnSnake = true;
                        }
                }
            
            return isOnSnake;
        };
    }
    
	
    /* définie la touche utiliser
    par le user*/
    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode; //évènement qui va donner la touche appuyer
        var newDirection;
        switch(key){
                case 37:
                    newDirection = "left";
                    break;
                case 38:
                    newDirection = "up";
                    break;
                case 39:
                    newDirection = "right";
                    break;
                case 40 :
                    newDirection = "down";
                    break;
                case 32 :
                    restart();
                    return;                    
                default:
                        return;
            }
        snakee.setDirection(newDirection);
    }
    
    
}