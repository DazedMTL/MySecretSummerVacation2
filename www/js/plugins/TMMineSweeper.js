﻿//=============================================================================
// TMVplugin - マインスウィーパ
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 0.11b
// 最終更新日: 2016/03/04
//=============================================================================

/*:
 * @plugindesc 有名な地雷撤去ゲームっぽいものを追加します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param mineSweeperCommand
 * @desc 『選択肢の表示』コマンドで使用するマインスウィーパ起動文字列。
 * 初期値: [マインスウィーパ]
 * @default [マインスウィーパ]
 *
 * @param bombSe
 * @desc 地雷爆発時に鳴らす効果音（ファイル名 音量 ピッチ パン）
 * 初期値: Explosion2 90 100 0
 * @default Explosion2 90 100 0
 *
 * @param clearSe
 * @desc 地雷撤去完了時に鳴らす効果音（ファイル名 音量 ピッチ パン）
 * 初期値: Applause1 90 100 0
 * @default Applause1 90 100 0
 *
 * @requiredAssets img/system/MineSweeper
 *
 * @help
 * 準備:
 *   画像ファイル MineSweeper.png を img/system フォルダに置いてください。
 *   このプラグインの配布元ページで一緒に配布しています。
 *
 * 使い方:
 *   イベントコマンド『選択肢の表示』の選択肢１番に [マインスウィーパ] と
 *   入力することでマインスウィーパが起動します。（括弧は半角です）
 *   選択肢２番には以下の５つの数値を半角スペースで区切って入力します。
 *   ・横に並ぶマスの数
 *   ・縦に並ぶマスの数
 *   ・マス１つの幅（ドット数）
 *   ・マス１つの高さ（ドット数）
 *   ・地雷の数
 *   例）14 8 32 32 20
 *   この例では１つが32*32ドットのマスを横に１４、縦に８、計１１２個並べ、
 *   そのうち２０個のマスに地雷が隠されている状態でスタートします。
 *
 *   地雷の埋まっていないマスをすべて調査すれば選択肢１番の処理が実行されます。
 *   また、途中で地雷のあるマスを調査してしまった場合は２番が実行されます。
 *
 *   選択肢３番に半角数字で制限時間を設定することができます。
 *   入力した秒数が経過するとマインスウィーパが強制終了し、
 *   選択肢３番の処理が実行されます。
 *
 * プラグインコマンド:
 *   mineTime 1       # 直前のマインスウィーパの所要時間を変数１番に代入
 *
 *   mineTime コマンドで得られる値の単位はミリ秒になっていますので、
 *   秒に変換したい場合はイベントコマンド『変数の操作』を使い、この値を
 *   1000 で割ってください。
 *
 *   mineTime で得られる結果は直前に実行されたマインスウィーパのものになります。
 *   また、マインスウィーパとプラグインコマンド実行までの間に
 *   セーブ＆ロードをはさむと結果が取得できなくなります。
 *
 * 注意事項:
 *   『文章の表示』コマンドの直後にマインスウィーパを起動した場合、
 *   メッセージウィンドウが閉じずにそのままマインスウィーパが起動します。
 *   メッセージウィンドウを閉じてからマインスウィーパを起動したい場合は
 *   『文章の表示』と『選択肢の表示』の間に『ウェイト』を 1 フレーム以上
 *   入れてください。
 *
 *   また、マインスウィーパウィンドウの上下位置はメッセージウィンドウの
 *   上下位置に影響を受けるので、背景が透明で内容が空のメッセージウィンドウを
 *   使えばマインスウィーパウィンドウの上下位置を変更することができます。
 * 
 */

var Imported = Imported || {};
Imported.TMMineSweeper = true;

(function () {

  var parameters = PluginManager.parameters('TMMineSweeper');
  var mineSweeperCommand = parameters['mineSweeperCommand'];
  var a = parameters['bombSe'].split(' ');
  var bombSe = { name: a[0], volume: a[1], pitch: a[2], pan: a[3] };
  var a = parameters['clearSe'].split(' ');
  var clearSe = { name: a[0], volume: a[1], pitch: a[2], pan: a[3] };

  //-----------------------------------------------------------------------------
  // Game_Temp
  //

  var _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function () {
    _Game_Temp_initialize.call(this);
    this._mineTime = 0;
  };

  Game_Temp.prototype.setMineScore = function (time) {
    this._mineTime = time;
  };

  Game_Temp.prototype.mineTime = function () {
    return this._mineTime;
  };

  //-----------------------------------------------------------------------------
  // Game_Message
  //

  var _Game_Message_clear = Game_Message.prototype.clear;
  Game_Message.prototype.clear = function () {
    _Game_Message_clear.call(this);
    this._mineWidth = 0;
    this._mineHeight = 0;
    this._mineCellWidth = 0;
    this._mineCellHeight = 0;
    this._mineTimeLimit = 0;
    this._mineNumber = 0;
  };

  Game_Message.prototype.mineWidth = function () {
    return this._mineWidth;
  };

  Game_Message.prototype.mineHeight = function () {
    return this._mineHeight;
  };

  Game_Message.prototype.mineCellWidth = function () {
    return this._mineCellWidth;
  };

  Game_Message.prototype.mineCellHeight = function () {
    return this._mineCellHeight;
  };

  Game_Message.prototype.mineNumber = function () {
    return this._mineNumber;
  };

  Game_Message.prototype.setMine = function (choices, cancelType) {
    var a = choices[1].split(' ');
    this._mineWidth = Number(a[0]);
    this._mineHeight = Number(a[1]);
    this._mineCellWidth = Number(a[2]);
    this._mineCellHeight = Number(a[3]);
    this._mineNumber = Number(a[4]);
    this._mineTimeLimit = choices[2] ? Number(choices[2]) * 1000 : 0;
    this._choiceCancelType = cancelType;
  };

  Game_Message.prototype.isMineSweeper = function () {
    return this._mineWidth > 0;
  };

  var _Game_Message_isBusy = Game_Message.prototype.isBusy;
  Game_Message.prototype.isBusy = function () {
    return (_Game_Message_isBusy.call(this) || this.isMineSweeper());
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_setupChoices = Game_Interpreter.prototype.setupChoices;
  Game_Interpreter.prototype.setupChoices = function (params) {
    var choices = params[0].clone();
    if (choices[0] === mineSweeperCommand) {
      var cancelType = params[1];
      var defaultType = params.length > 2 ? params[2] : 0;
      var positionType = params.length > 3 ? params[3] : 2;
      var background = params.length > 4 ? params[4] : 0;
      if (cancelType >= choices.length) {
        cancelType = -2;
      }
      $gameMessage.setMine(choices, cancelType);
      $gameMessage.setChoiceBackground(background);
      $gameMessage.setChoicePositionType(positionType);
      $gameMessage.setChoiceCallback(function (n) {
        this._branch[this._indent] = n;
      }.bind(this));
    } else {
      _Game_Interpreter_setupChoices.call(this, params);
    }
  };

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    if (command === 'mineTime') {
      $gameVariables.setValue(Number(args[0]), $gameTemp.mineTime());
    } else {
      _Game_Interpreter_pluginCommand.call(this, command, args);
    }
  };

  //-----------------------------------------------------------------------------
  // Window_MineSweeper
  //

  function Window_MineSweeper() {
    this.initialize.apply(this, arguments);
  }

  Window_MineSweeper.prototype = Object.create(Window_Selectable.prototype);
  Window_MineSweeper.prototype.constructor = Window_MineSweeper;

  Window_MineSweeper.prototype.initialize = function (messageWindow) {
    this._messageWindow = messageWindow;
    Window_Selectable.prototype.initialize.call(this, 0, 0, 0, 0);
    this.openness = 0;
    this.deactivate();
  };

  Window_MineSweeper.prototype.maxCols = function () {
    return this._mineWidth || 1;
  };

  Window_MineSweeper.prototype.maxItems = function () {
    return this._mineCellNumber || 0;
  };

  Window_MineSweeper.prototype.spacing = function () {
    return 0;
  };

  Window_MineSweeper.prototype.isCursorMovable = function () {
    return Window_Selectable.prototype.isCursorMovable &&
      this._mineState === -1;
  };

  Window_MineSweeper.prototype.start = function () {
    this._mineWidth = $gameMessage.mineWidth();
    this._mineHeight = $gameMessage.mineHeight();
    this._mineCellWidth = $gameMessage.mineCellWidth();
    this._mineCellHeight = $gameMessage.mineCellHeight();
    this._mineNumber = $gameMessage.mineNumber();
    this._mineCellNumber = this._mineWidth * this._mineHeight;
    this.clearMine();
    this._mineState = -1;
    this._mineStartTime = new Date();
    this._lastRefreshTime = this._mineStartTime;
    this._sweepCount = 0;
    this.updatePlacement();
    this.updateBackground();
    this.select(0);
    this.refresh();
    this.open();
    this.activate();
  };

  Window_MineSweeper.prototype.clearMine = function () {
    this._mineMap = [];
    for (var i = 0; i < this._mineCellNumber; i++) {
      this._mineMap[i] = { value: 0, mine: 0, flag: false, sweeped: false };
    }
  };

  Window_MineSweeper.prototype.setupMine = function () {
    var a = [];
    for (var i = 0; i < this._mineCellNumber; i++) {
      a[i] = i;
    }
    for (var i = -1; i < 2; i++) {
      if ((i >= 0 || this.index() % this._mineWidth > 0) &&
        (i < 1 || this.index() % this._mineWidth < this._mineWidth - 1)) {
        for (var j = -1; j < 2; j++) {
          var index = this.index() + i + this._mineWidth * j;
          if (this.isIndexValid(index)) {
            a.splice(a.indexOf(index), 1);
          }
        }
      }
    }
    for (var i = 0; i < this._mineNumber; i++) {
      var index = a.splice(Math.randomInt(a.length), 1)[0];
      this._mineMap[index].mine = 1;
      for (var j = -1; j < 2; j++) {
        this.increaseMineCount(index + this._mineWidth * j);
        if (index % this._mineWidth > 0) {
          this.increaseMineCount(index - 1 + this._mineWidth * j);
        }
        if (index % this._mineWidth < this._mineWidth - 1) {
          this.increaseMineCount(index + 1 + this._mineWidth * j);
        }
      }
    }
  };

  Window_MineSweeper.prototype.increaseMineCount = function (index) {
    if (this.isIndexValid(index)) {
      this._mineMap[index].value++;
    }
  };

  Window_MineSweeper.prototype.isIndexValid = function (index) {
    return index >= 0 && index < this._mineCellNumber;
  };

  Window_MineSweeper.prototype.updatePlacement = function () {
    var positionType = $gameMessage.choicePositionType();
    var messageY = this._messageWindow.y;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    switch (positionType) {
      case 0:
        this.x = 0;
        break;
      case 1:
        this.x = (Graphics.boxWidth - this.width) / 2;
        break;
      case 2:
        this.x = Graphics.boxWidth - this.width;
        break;
    }
    if (messageY >= Graphics.boxHeight / 2) {
      this.y = messageY - this.height;
    } else {
      this.y = messageY + this._messageWindow.height;
    }
  };

  Window_MineSweeper.prototype.updateBackground = function () {
    this._background = $gameMessage.choiceBackground();
    this.setBackgroundType(this._background);
  };

  Window_MineSweeper.prototype.windowWidth = function () {
    var width = $gameMessage.mineWidth() * $gameMessage.mineCellWidth() +
      this.padding * 2;
    return Math.min(width, Graphics.boxWidth);
  };

  Window_MineSweeper.prototype.windowHeight = function () {
    return this.fittingHeight($gameMessage.mineHeight()) + 36;
  };

  Window_MineSweeper.prototype.update = function () {
    var lastIndex = this.index();
    Window_Selectable.prototype.update.call(this);
    if (this.active) {
      if (this._mineState === -1) {
        this.updateTime();
      } else if (Input.isTriggered('ok') || (TouchInput.isTriggered())) {
        $gameMessage.onChoice(this._mineState);
        this.endMineSweeper();
        SoundManager.playOk();
      } else if (Input.isTriggered('escape') || (TouchInput.isCancelled())) {
        $gameMessage.onChoice(this._mineState);
        this.endMineSweeper();
        SoundManager.playCancel();
      }
      if (lastIndex !== this.index()) {
        this.redrawItem(lastIndex);
        this.redrawItem(this.index());
      }
    }
  };

  Window_MineSweeper.prototype.updateTime = function () {
    var currentTime = new Date();
    if (currentTime - this._lastRefreshTime > 1000) {
      this.refreshTime();
      this._lastRefreshTime = currentTime;
    }
  };

  Window_MineSweeper.prototype.gameOver = function (state) {
    this._mineState = state;
    var time = new Date();
    $gameTemp.setMineScore(time - this._mineStartTime);
    if (this._mineState >= 1) {
      for (var i = 0; i < this._mineCellNumber; i++) {
        var data = this._mineMap[i];
        if (data.mine && !data.sweeped) {
          this._mineMap[i].sweeped = true;
          this.redrawItem(i);
        }
      }
      AudioManager.playSe(bombSe);
    } else {
      AudioManager.playSe(clearSe);
    }
  };

  Window_MineSweeper.prototype.endMineSweeper = function () {
    this._messageWindow.terminateMessage();
    this.deactivate();
    this.close();
  };

  Window_MineSweeper.prototype.drawItem = function (index) {
    var rect = this.itemRect(index);
    var bitmap = ImageManager.loadSystem('MineSweeper');
    var data = this._mineMap[index];
    var sx = 12;
    if (data.sweeped) {
      if (data.mine) {
        sx = 8 + data.mine;
      } else {
        sx = data.value;
      }
    }
    this.contents.blt(bitmap, sx * 32, 0, 32, 32, rect.x, rect.y,
      rect.width, rect.height);
    if (data.flag) {
      this.contents.blt(bitmap, 416, 0, 32, 32, rect.x, rect.y,
        rect.width, rect.height);
    }
    if (index === this.index()) {
      this.contents.blt(bitmap, 448, 0, 32, 32, rect.x, rect.y,
        rect.width, rect.height);
    }
  };

  Window_MineSweeper.prototype.refresh = function () {
    this.createContents();
    this.drawAllItems();
    this.refreshTime();
  };

  Window_MineSweeper.prototype.refreshTime = function () {
    var time = new Date();
    time -= this._mineStartTime;
    if ($gameMessage._mineTimeLimit) {
      time = $gameMessage._mineTimeLimit - time;
      if (time < 0) {
        time = 0;
        this.gameOver(2);
      }
    }
    var width = this.contents.width - this.textPadding();
    var height = 36;
    var y = this.contents.height - height;
    this.contents.clearRect(0, y, width, height);
    this.drawText(Math.floor(time / 1000) + ' 秒', 0, y, width, 'right');
  };

  Window_MineSweeper.prototype.isCurrentItemEnabled = function () {
    return this.index() >= 0 && !this._mineMap[this.index()].sweeped;
  };

  Window_MineSweeper.prototype.isOkEnabled = function () {
    return true;
  };

  Window_MineSweeper.prototype.isCancelEnabled = function () {
    return true;
  };

  Window_MineSweeper.prototype.processOk = function () {
    if (this._mineState === -1) {
      Window_Selectable.prototype.processOk.call(this);
    }
  };

  Window_MineSweeper.prototype.callOkHandler = function () {
    if (this._sweepCount === 0) {
      this.setupMine();
    }
    this._mineSweepTargets = [this.index()];
    while (this._mineSweepTargets.length > 0) {
      this.sweep(this._mineSweepTargets.pop());
    }
    if (this._mineState === -1) {
      this.checkGameComplete();
    }
    this.activate();
  };

  Window_MineSweeper.prototype.sweep = function (index) {
    var data = this._mineMap[index];
    if (data.mine) {
      this.gameOver(1);
      this._mineMap[index].mine = 2;
    }
    this._mineMap[index].sweeped = true;
    this._mineMap[index].flag = false;
    this._sweepCount++;
    this.redrawItem(index);
    if (data.value > 0) {
      return;
    }
    this.addSweepTarget(index - this._mineWidth);
    this.addSweepTarget(index + this._mineWidth);
    for (var i = -1; i < 2; i++) {
      if (index % this._mineWidth > 0) {
        this.addSweepTarget(index - 1 + this._mineWidth * i);
      }
      if (index % this._mineWidth < this._mineWidth - 1) {
        this.addSweepTarget(index + 1 + this._mineWidth * i);
      }
    }
  };

  Window_MineSweeper.prototype.addSweepTarget = function (index) {
    if (index >= 0 && index < this._mineCellNumber &&
      this._mineSweepTargets.indexOf(index) === -1 &&
      !this._mineMap[index].sweeped) {
      this._mineSweepTargets.push(index);
    }
  };

  Window_MineSweeper.prototype.checkGameComplete = function (index) {
    if (this._sweepCount === this._mineCellNumber - this._mineNumber) {
      this.gameOver(0);
    }
  };

  Window_MineSweeper.prototype.processCancel = function () {
    if (this._mineState === -1) {
      Window_Selectable.prototype.processCancel.call(this);
    }
  };

  Window_MineSweeper.prototype.callCancelHandler = function () {
    if (this.index() >= 0 && !this._mineMap[this.index()].sweeped) {
      this._mineMap[this.index()].flag = !this._mineMap[this.index()].flag;
      this.redrawItem(this.index());
    } else {
      SoundManager.playBuzzer();
    }
    this.activate();
  };
  //-----------------------------------------------------------------------------
  // Window_Message
  //

  var _Window_Message_subWindows = Window_Message.prototype.subWindows;
  Window_Message.prototype.subWindows = function () {
    return _Window_Message_subWindows.call(this).concat(this._mineSweeperWindow);
  };

  var _Window_Message_createSubWindows = Window_Message.prototype.createSubWindows;
  Window_Message.prototype.createSubWindows = function () {
    _Window_Message_createSubWindows.call(this);
    this._mineSweeperWindow = new Window_MineSweeper(this);
  };

  var _Window_Message_isAnySubWindowActive = Window_Message.prototype.isAnySubWindowActive;
  Window_Message.prototype.isAnySubWindowActive = function () {
    return (_Window_Message_isAnySubWindowActive.call(this) ||
      this._mineSweeperWindow.active);
  };

  var _Window_Message_startInput = Window_Message.prototype.startInput;
  Window_Message.prototype.startInput = function () {
    if ($gameMessage.isMineSweeper()) {
      this._mineSweeperWindow.start();
      return true;
    }
    return _Window_Message_startInput.call(this);
  };

  //-----------------------------------------------------------------------------
  // Scene_Boot
  //

  var _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
  Scene_Boot.prototype.loadSystemImages = function () {
    _Scene_Boot_loadSystemImages.call(this);
    ImageManager.loadSystem('MineSweeper');
  };

})();
