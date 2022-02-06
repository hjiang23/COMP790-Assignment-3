function getRandomInt(min, max) { //Random int function from MDN web docs
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

window.onload = function () {

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    let house = { //Initialize house
        x: getRandomInt(0, 481),
        y: getRandomInt(0, 331),
        velocity_x: (Math.floor(Math.random() * 2) == 0) ? 3 : -3,
        velocity_y: (Math.floor(Math.random() * 2) == 0) ? 2 : -2
    }

    let person = { //Initialize person
        x: getRandomInt(0, 581),
        y: getRandomInt(0, 351),
        velocity_x: (Math.floor(Math.random() * 2) == 0) ? 4 : -4,
        velocity_y: (Math.floor(Math.random() * 2) == 0) ? 3 : -3,
        rotate: true
    }

    let armAngle = 0; //Initialize arm angle/velocity
    let armAngleVelocity = Math.PI/20;

    let legAngle = 0; //Initialize leg angle

    window.addEventListener("keydown", function (event) { //Checking for spacebar, if so restart animation with new locations/directions
        if (event.key == " ") {
            house = {
                x: getRandomInt(0, 481),
                y: getRandomInt(0, 331),
                velocity_x: (Math.floor(Math.random() * 2) == 0) ? 3 : -3,
                velocity_y: (Math.floor(Math.random() * 2) == 0) ? 2 : -2
            }
            person = {
                x: getRandomInt(0, 581),
                y: getRandomInt(0, 351),
                velocity_x: (Math.floor(Math.random() * 2) == 0) ? 4 : -4,
                velocity_y: (Math.floor(Math.random() * 2) == 0) ? 3 : -3,
                rotate: true
            }
        }
    });

    requestAnimationFrame(mainLoop); //begin animation

    function mainLoop() {
        update();
        draw();
        requestAnimationFrame(mainLoop);
    }

    function update() {
        updatePos(house, 480, 330); //update positions of house and person, using maximum boundaries for them to not fall off canvas
        updatePos(person, 580, 350);

        legAngle += Math.PI / 20; //update leg angle

        armAngle += armAngleVelocity; //update arm angle
        if (armAngle > Math.PI/4 || armAngle < -Math.PI/4) {
            armAngleVelocity = -armAngleVelocity;
        }

        //check if person's chest touches the door, if so stop the animation
        if (person.x + 30 >= house.x + 60 && person.x + 30 <= house.x + 100 && person.y + 60 >= house.y + 90 && person.y + 60 <= house.y + 150) { 
            person.velocity_x = 0;
            person.velocity_y = 0;
            person.rotate = false;
            house.velocity_x = 0;
            house.velocity_y = 0;
        }
    }

    function updatePos(obj, right, bottom) { //update position and flip direction if at boundary
        obj.x = obj.x + obj.velocity_x;
        obj.y = obj.y + obj.velocity_y;

        if (obj.x > right) {
            obj.velocity_x = -obj.velocity_x;
        }

        if (obj.x < 0) {
            obj.velocity_x = -obj.velocity_x;
        }

        if (obj.y > bottom) {
            obj.velocity_y = -obj.velocity_y;
        }

        if (obj.y < 0) {
            obj.velocity_y = -obj.velocity_y;
        }
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "lightgreen"; 
        context.fillRect(0, 0, 640, 480); //background
        drawHouse();
        drawPerson();
    }

    function drawHouse() { //inspired by MDN web docs example
        context.save();
        context.translate(house.x, house.y);

        context.lineWidth = 8;

        //Wall
        context.fillStyle = "red";
        context.fillRect(20, 60, 120, 90);
        context.strokeRect(20, 60, 120, 90);

        // Door
        context.fillStyle = "black";
        context.fillRect(60, 90, 40, 60);

        // Roof
        context.beginPath();
        context.moveTo(0, 60);
        context.lineTo(80, 0);
        context.lineTo(160, 60);
        context.closePath();
        context.fillStyle = "yellow";
        context.fill();
        context.stroke();

        context.restore();
    }

    function drawPerson() {
        context.save();
        context.translate(person.x, person.y);

        context.lineWidth = 3;

        //Head
        context.beginPath();
        context.arc(30, 20, 20, 0, 2 * Math.PI, false);
        context.fillStyle = "white";
        context.fill();

        //Spine
        context.moveTo(30, 40);
        context.lineTo(30, 90);
        context.closePath();
        context.stroke();

        //Eyes
        context.beginPath();
        context.moveTo(25, 10);
        context.lineTo(25, 18);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(35, 10);
        context.lineTo(35, 18);
        context.closePath();
        context.stroke();

        //Mouth
        context.beginPath();
        context.arc(30, 25, 10, 0, Math.PI, false);
        context.closePath();
        context.stroke();
        
        //Arms
        context.save();
        context.translate(30, 60);
        if (person.rotate) {
            context.rotate(armAngle);
        }
        drawArm(30);
        drawArm(-30);
        context.restore();

        //Legs
        context.save();
        context.translate(30, 90);
        if (person.rotate) {
            context.rotate(legAngle);
        }
        drawLeg(30);
        drawLeg(-30);
        context.restore();

        context.restore();
    }

    function drawArm(end) {
        context.beginPath();

        context.moveTo(0, 0);
        context.lineTo(end, 0);

        context.closePath();
        context.stroke();
    }

    function drawLeg(end) {
        context.beginPath();

        context.moveTo(0, 0);
        context.lineTo(end, 30);

        context.closePath();
        context.stroke();
    }
}