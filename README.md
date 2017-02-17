## 1. 创建一个Canvas对象

```javascript
    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 480;
    document.body.appendChild(canvas);
```

我们首先要做的是创建一个canvas对象。可以用JavaScript或HTML来做，都非常简单。此处我用的是JS。当创建了canvas之后，我们就可以获取它的上下文对象（context）、设置尺寸，并且把它加到当前文档中。

## 2. 载入图片

```javascript
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";
```

游戏需要图像，所以让我们载入一些图片吧。我想尽量简单化，所以只用了Image对象来做，当然，还可以将载入图像的功能封装成一个类或别的任何形式。代码中的bgReady用来标识图片是否已完全载入，只有当图片载入完成后，我们才能使用它，如果在载入完成前就对其进行绘制或渲染，JS将会报一个DOM error的错误。

我们会用到三张图片（背景、英雄、怪物），每张图片都需要这样处理。

## 3. 定义游戏要使用的对象

```javascript
// Game objects
var hero = {
    speed: 256, // movement in pixels per second
    x: 0,
    y: 0
};
var monster = {
    x: 0,
    y: 0
};
var monstersCaught = 0;
```

定义一些变量，稍后会用到。hero对象的speed属性表示英雄的移动速度（像素/秒）；monster对象不会移动，所以仅仅具有一对坐标；monstersCaught表示玩家抓住的怪物数量。

## 4. 处理玩家输入

```javascript
// Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function (e) {
     keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
     delete keysDown[e.keyCode];
}, false);
```

现在进行输入的处理。（对具有web开发背景的人来说，这是目前为止第一个具有挑战性的部分）对一般的网页来说，当用户开始输入时，可能需要马上开始播放动画或请求数据。但在这里，我们想让游戏逻辑在一个单独的地方对游戏中发生的事情进行处理。为此我们需要将用户输入保存下来以备稍后处理，而不是立即处理。

我们通过简单地将事件对应的键编码（keyCode）保存在keysDown变量中来实现。如果该变量中具有某个键编码，就表示用户目前正按下这个键。简单吧！

## 5. 新游戏

```javascript
// Reset the game when the player catches a monster
var reset = function () {
     hero.x = canvas.width / 2;
     hero.y = canvas.height / 2;

     // Throw the monster somewhere on the screen randomly
     monster.x = 32 + (Math.random() * (canvas.width - 64));
     monster.y = 32 + (Math.random() * (canvas.height - 64));
};
```

通过调用reset函数来开始新游戏。该函数将英雄（即玩家角色）放到屏幕中间，然后随机选择一个位置来安置怪物。

## 6. 更新对象

```javascript
// Update game objects
var update = function (modifier) {
    if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
    }

    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
            && monster.x <= (hero.x + 32)
            && hero.y <= (monster.y + 32)
            && monster.y <= (hero.y + 32)
    ) {
         ++monstersCaught;
         reset();
    }
};
```

这是update函数，游戏每隔一定时间会调用它一次。它所做的第一件事情是检查用户是否按下了上下左右四个箭头键。如果是，就将我们的英雄向相应的方向移动。

update有一个modifier参数，这看起来好像有点奇怪。你会在游戏的主函数即main函数中看到它，不过我在这儿先解释一下。modifier参数是一个从1开始的与时间相关的数。如果间隔刚好为1秒时，它的值就会为1，英雄移动的距离即为256像素（英雄的速度为256像素/秒）；而如果间隔是0.5秒，它的值就为0.5，即英雄移动的距离为其速度的一半，以此类推。通常update函数调用的间隔很短，所以modifier的值很小，但用这种方式能够确保不管代码执行的速度怎么样，英雄的移动速度都是相同的。

我们已经实现了根据用户的输入来移动英雄，但我们还可以在移动英雄时对其进行检查，以确定是否有其他事件发生。例如：英雄是否与怪物发生了碰撞——当英雄与怪物发生碰撞时，我们为玩家进行计分（monstersCaught加1）并重置游戏（调用reset函数）。

## 7. 渲染对象

```javascript
// Draw everything
var render = function () {
    if (bgReady) {
         ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
         ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
         ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};
```

当你能够看到你的行动时游戏才会变得更有趣，所以让我们在屏幕上绘制吧。首先我们将背景图片绘制到canvas，然后是英雄和怪物。注意顺序很重要，因为任何位于表层的图片都会将其下面的像素覆盖掉。

接下来是文字，这有些不同，我们调用fillText函数显示玩家的分数。因为不需要复杂的动画或者对文字进行移动，所以只是绘制一下就ok了。

## 8. 游戏主循环

```javascript
// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
};
```

游戏的主循环用来控制游戏流程。首先我们要获得当前的时间，这样我们才能计算时间差（自上次循环以来经过的时间）。然后计算modifier的值并交给update（需要将delta除以1000以将其转换为毫秒）。最后调用render并更新记录的时间。

更多关于游戏循环的内容见“Onslaught! Arena Case Study”。

## 9. 开始游戏吧

```javascript
// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
```

快完成了，这是最后一段代码。首先调用reset来开始新游戏。（还记得吗，这会将英雄置中并随机安放怪物）。然后将起始时间保存到变量then中并启动游戏的主循环。
OK！（但愿）你现在已经理解了在HTML5 Canvas中用JS来开发游戏的基础知识了。建议最好是能够自己亲自试一把！