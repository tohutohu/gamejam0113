// phina.js をグローバル領域に展開
phina.globalize();

var ASSETS = {
  image:{
    table:'./tbl2.png',
    head:'./atama.png',
    hito:'./hito.png',    
    teki:'./tekki.png',
  }
}

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function(options) {
    this.superInit(options);
    // 背景色を指定
    this.backgroundColor = '#FFF';
    this.clock = Clock(0,20).addChildTo(this);
    var meter = Meter().addChildTo(this);
    var po = Label('進捗').addChildTo(this);
    po.setPosition(50, 40);
    po.fontSize=20;
    this.fight = Fight(meter).addChildTo(this);
    this.minute=0;
    this.hour=20;
    this.table = Sprite('table').addChildTo(this);
    this.table.setPosition(400,200);
    this.hito = Hito().addChildTo(this);
    this.frame=0;
  },
  update: function(){
    this.frame = this.frame+1
    if(this.frame%2===0){
      this.hour = (this.hour + Math.floor(this.minute/59))%24;
      this.minute = (this.minute+1)%60;
      this.clock.poi(this.hour,this.minute);
    }

    if(this.frame%5===0){
      this.fight.x=100 + Math.random()*20*this.hito.nemumi-10*this.hito.nemumi
      this.fight.y=450 + Math.random()*20*this.hito.nemumi-10*this.hito.nemumi
      
    }

    if(this.minute === 0 && this.frame%2===0){
      Teki(this.hito).addChildTo(this);
    }
    if(this.hour===8 && this.minute===30){
      this.gameover();
    }

    if(this.fight.count === 392){
      this.gameclear(this.clock.text);
    }
  },
  gameover:function(){
    this.exit({
      message:'レポートが書き終わらないまま朝を迎えてしまった…',
      hashtags:'traP3jam',
      url:'https://tohutohu.github.io/gamejam0113',
      score:0
    });   
  },
  gameclear:function(text){
    this.exit({
      message:'無事レポートを提出して落胆を免れた！！！',
      hashtags:'traP3jam',
      url:'https://tohutohu.github.io/gamejam0113',
      score:text
    });   
  },
});

phina.define('Hito', {
  superClass:'Sprite',
  init: function(){
    this.superInit('hito');
    this.x = 460;
    this.y =250;
    this.head = Sprite('head').addChildTo(this);
    this.head.setPosition(-20, -140);
    this.count=0;
    this.nemumi=1;
  },
  update: function(){
    this.count=(this.count+this.nemumi)%40;
    this.head.y=-140+this.count;
  }
});

phina.define('Teki', {
  superClass:'Sprite',
  init: function(hito){
    this.superInit('teki');
    this.x=650;
    this.y=120;
    this.setInteractive(true);
    this.life=5;
    this.hito=hito;
    this.poi=false;
    this.tweener.by({x:-200,y:0,rotation:0}, 3000, 'swing').call(()=>{
      this.poi =true;
      this.hito.nemumi+=1;
      this.tweener.by({x:-100,y:0,rotation:0}, 2000, 'swing')
      .by({x:200,y:0,rotation:0}, 2000, 'swing').setLoop(true);
    });
  },
  onpointstart:function(){
    this.life--;
    if(this.life===0){
      if(this.poi){
        this.hito.nemumi-=1;
      }
      this.remove();
    }
  }
});

phina.define('Neru', {
  superClass:'Label',
  init:function(){
    this.superInit('寝る');
  }
});



phina.define('Meter',{
  superClass: 'RectangleShape',
  init:function(){
    this.superInit();
    this.strokeWidth=10;
    this.stroke='black';
    this.cornerRadius=10;
    this.fill='rgba(0,0,0,0)'; 
    this.setPosition(130,220);
    this.width=100;
    this.height=400;
    this.naka = RectangleShape().addChildTo(this);
    this.naka.setPosition(0, 194);
    this.naka.fill='#2C3';
    this.naka.width=90;
    this.naka.height=0;
    this.naka.cornerRadius=6;
  },
  ki(count){
    this.naka.y=194-count/2;
    this.naka.height=count;
  },
});

phina.define('Clock', {
  superClass: 'Label',
  init:function(hour, minute){
    this.superInit(hour+':'+minute);
    this.fontSize=30;
    this.fill='#000';
    this.x=650;
    this.y=30;
  },
  poi:function(hour,minute){
    if(minute < 10){
      minute = '0'+minute;
    }
    this.text=hour+':'+minute;
  }
});

phina.define('Fight', {
  superClass: 'Label',
  init: function(meter){
    this.superInit('考える');
    this.x=100;
    this.y=450;
    this.setInteractive(true);
    this.count = 0;
    this.fill='rgba(256,30,30,1)';
    this.fontSize = 30;
    this.meter=meter;
  },
  onpointstart:function(){
    this.count+=4;
    this.meter.ki(this.count);
  }
  
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    title:'限界',
    startLabel: 'title', // メインシーンから開始する
    width:720,
    height:480,
    assets:ASSETS,
  });
  // アプリケーション実行
  app.run();
});
