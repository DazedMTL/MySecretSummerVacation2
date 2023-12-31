//===========================================================================
// MOG_PickupThrow.js
// Translate to Japanese : fungamemake.com
//===========================================================================

/*:
 * @plugindesc (v1.3) Sistema de arremessar os eventos.
 * @author Moghunter
 *
 * @param またいで投げられない地形タグ
 * @desc 投げた際に壁等またいで投げられないようにする地形タグを半角カンマを挟んで指定します。
 * @default 5
 *
 * @param またいで投げられないリージョンID
 * @desc 投げた際に壁等またいで投げられないようにするリージョンIDを半角カンマを挟んで指定します。
 * @default 9,10
 *
 * @param Character Height
 * @desc Definição da altura do personagem.
 * @default 22
 *
 * @param Character Pose
 * @desc Ativar pose de carregar objeto.
 * @default true
 *
 * @param Hold Direction
 * @desc Ativar botão de segurar a direção.
 * @default true
 *
 * @param Hold Direction Button
 * @desc Definição do botão que segura a direção.
 * @default pagedown
 *
 * @param Sound File
 * @desc Definição do arquivo de som.
 * @default Jump1
 *
 * @help
 * ===========================================================================
 * +++ MOG - Pick Up and Throw (v1.2) +++
 * By Moghunter
 * https://atelierrgss.wordpress.com/
 * ===========================================================================
 * O sistema permite arremessar o objetos (Eventos) do mapa
 *
 * ===========================================================================
 * EVENT COMMENTS
 * ===========================================================================
 * Para definir o objecto a ser arremessado coloque este comentário no evento.
 *
 * throw : X
 *
 * X - Distância a ser arremessado.
 *
 * ===========================================================================
 * CHARACTER POSES
 * ===========================================================================
 * Para definir o nome da imagem da pose do personagem, nomeie a imagem da
 * seguinte forma.
 *
 * ORIGINAL_FILE_NAME + _pick.png
 *
 *
 *
 * Actor1_pick.png
 *
 * ===========================================================================
 * PLUGIN COMMAND
 * ===========================================================================
 * Para ativar ou desativar o sistema use o plugin abaixo.
 *
 * pickup_enable
 *
 * pickup_disable
 *
 * ===========================================================================
 * HISTÓRICO
 * ===========================================================================
 * v1.5 - TriggerExtensionとのイベント起動関係の競合に対応　by 村人A
 * v1.4 - MV3Dプラグインとの対応 by 村人A
 * v1.3 - Compatibilidade com Char Poses plugin.
 * v1.2 - Mudança da noteTag para padronizar a forma de comandos.
 * v1.1 - Adição do plugin command de ativar e desativar o sistema.
 */

/*:ja
 * @plugindesc (v1.3) マップのイベントを持ち上げ、投げられるシステム
 * @author Moghunter
 *
 * @param またいで投げられないリージョンID
 * @desc 投げた際に壁等またいで投げられないようにするリージョンIDを半角カンマを挟んで指定します。
 * @default 9,10
 *
 * @param またいで投げられない地形タグ
 * @desc 投げた際に壁等またいで投げられないようにする地形タグを半角カンマを挟んで指定します。
 * @default 5
 *
 * @param Character Height
 * @text 持ち上げ高さ
 * @default 22
 *
 * @param Character Pose
 * @text 持ち上げポーズ有効化
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 *
 * @param Hold Direction
 * @text ※機能不全：位置固定で方向変更有効化
 * @desc false にしても強制的にON
 * @on 有効
 * @off 無効
 * @type boolean
 * @default true
 *
 * @param Hold Direction Button
 * @text 位置固定で方向変更ボタン
 * @option combo
 * @option alt
 * @option a
 * @option d
 * @option c
 * @option s
 * @option q
 * @option w
 * @option cancel
 * @option ok
 * @option pageup
 * @option pagedown
 * @default pagedown
 *
 * @param Sound File
 * @text SEファイル
 * @type file
 * @dir audio/se/
 * @default Jump1
 *
 * @help
 * 翻訳:ムノクラ
 * https://fungamemake.com/
 * https://twitter.com/munokura/
 *
 * ===========================================================================
 * +++ MOG - Pick Up and Throw (v1.2) +++
 * By Moghunter
 * https://atelierrgss.wordpress.com/
 * ===========================================================================
 * マップのイベントを持ち上げ、投げられるシステム
 *
 * ===========================================================================
 * イベント注釈
 * ===========================================================================
 * 投げられるイベントにするには、下記の注釈をイベントに入れます。
 *
 * throw : X
 *
 * X - 投げた時の距離
 *
 * ===========================================================================
 * 必要ファイル
 * ===========================================================================
 * 持ち上げているプレイヤーのポーズ画像は下記のようにファイル名を付けます。
 * 下記フォルダ内に保存してください。
 * \img\characters\
 *
 *
 * ORIGINAL_FILE_NAME + _pick.png
 *
 * 例
 *
 * Actor1_pick.png
 *
 * ===========================================================================
 * プラグインコマンド
 * ===========================================================================
 * システムを有効または無効にするには、以下のプラグインを使用してください。
 *
 * pickup_enable
 *
 * pickup_disable
 *
 * ===========================================================================
 * 更新履歴
 * ===========================================================================
 * v1.51 - 特定条件で発生する不具合を修正　by 村人A
 * v1.5  - TriggerExtensionとのイベント起動関係の競合に対応　by 村人A
 * v1.4  - MV3Dプラグインとの対応 by 村人A
 * v1.3  - Char Posesプラグインとの互換性
 * v1.2  - 注釈コマンドの形式を標準化するように変更
 * v1.1  - システムを有効/無効にするプラグインコマンドを追加
 */

//===========================================================================
// ** PLUGIN PARAMETERS
//===========================================================================
var Imported = Imported || {};
Imported.MOG_PickupThrow = true;
var Moghunter = Moghunter || {};

Moghunter.parameters = PluginManager.parameters('MOG_PickupThrow');
Moghunter.DisableThrowTerrainTags = (Moghunter.parameters['またいで投げられない地形タグ'] || [5]).split(",").map(n => Number(n));
Moghunter.DisableThrowRegionIds = (Moghunter.parameters['またいで投げられないリージョンID'] || [9]).split(",").map(n => Number(n));
Moghunter.pickTargetHeight = Number(Moghunter.parameters['Character Height'] || 22);
Moghunter.pickDirectionFix = String(Moghunter.parameters['Character Direction Fix'] || 'true');
Moghunter.pickPose = String(Moghunter.parameters['Character Pose'] || 'true');
Moghunter.pickDirectionButton = String(Moghunter.parameters['Hold Direction'] || 'true');
Moghunter.pickDirectionButtonKey = String(Moghunter.parameters['Hold Direction Button'] || 'pagedown');
Moghunter.pickSoundFile = String(Moghunter.parameters['Sound File'] || 'Jump1');

//===========================================================================
// ** Game_Interpreter
//===========================================================================

//==============================
// * PluginCommand
//==============================
var _mog_pickup_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function (command, args) {
	_mog_pickup_pluginCommand.call(this, command, args);
	if (command === "pickup_enable") {
		$gameSystem._pickupData[0] = true;
	} else if (command === "pickup_disable") {
		$gameSystem._pickupData[0] = false;
	};
	return true;
};

//===========================================================================
// ** Game System
//===========================================================================

//==============================
// * Initialize
//==============================
var _mog_pickup_Gsys_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
	_mog_pickup_Gsys_initialize.call(this);
	this._pickupData = [true, false];
};

//===========================================================================
// ** Game Character
//===========================================================================

//==============================
// * initMembers
//==============================
var _mog_pick_gcharbase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function () {
	_mog_pick_gcharbase_initMembers.call(this);
	this._pickup = {};
	this._pickup.enabled = false;
	this._pickup.originalName = this._characterName;
	this._pickup.pose = String(Moghunter.pickPose) === "true" ? true : false;
	this._pickup.wait = 0;
	this._pickup.check = false;
	this._throw = {};
	this._throw.enabled = false;
	this._throw.through = false;
	this._throw.directionFixA = String(Moghunter.pickDirectionFix);
	this._throw.directionFix = false;
	this._throw._cantThrowAnyMore = false;
	this._throw.range = 0;
	this._throw.wait = 0;
};

//==============================
// * Update
//==============================
var _mog_pick_gchabase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function () {
	if (this._throw.wait > 0) {
		this._throw.wait--;
		if (this.isJumping()) { this.updateJump() };
		if (!this.isJumping()) { this._throw.wait = 0 };
		return;
	};
	if (this._pickup.wait > 0) { this._pickup.wait--; return };
	//村人A改変 return外し　20/05/17不具合のため復活
	if (this._throw.enabled) {
		this.updatePickUp();
		return
	};
	_mog_pick_gchabase_update.call(this);
}

//-----------------------------------------↓
//村人A改変 20/05/17

Game_Map.prototype.updatePickupObjectComfirm = function () {
	$gameMap.events().forEach(function (event) {
		if (event._throw.wait > 0 || event._pickup.wait > 0) { return }
		if (event._throw.enabled) {
			event.updatePickUp();
		}
	});
}

var _mog_pick_Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function () {
	_mog_pick_Scene_Map_update.call(this)
	$gameMap.updatePickupObjectComfirm();

}
//-----------------------------------------↑

//==============================
// * Update Pick Up
//==============================
Game_CharacterBase.prototype.updatePickUp = function () {
	this._x = $gamePlayer._x;
	this._y = $gamePlayer._y;
	this._realX = $gamePlayer._realX;
	this._realY = $gamePlayer._realY;
	//村人A改変　持ち上げる高さ
	this.mv3d_sprite.z = $gamePlayer.mv3d_sprite.z + Moghunter.pickTargetHeight / 48;
};

//==============================
// * can Pass Throw
//==============================
Game_CharacterBase.prototype.canPassThrow = function (x, y, d) {
	var x2 = $gameMap.roundXWithDirection(x, d);
	var y2 = $gameMap.roundYWithDirection(y, d);
	if (d === 2) {
		x3 = x; y3 = y + 1;
	} else if (d === 4) {
		x3 = x - 1; y3 = y;
	} else if (d === 6) {
		x3 = x + 1; y3 = y;
	} else {
		x3 = x; y3 = y - 1;
	};
	//村人A　改変
	if (this._throw._cantThrowAnyMore) {
		return false;
	}
	if (!$gameMap.isValid(x2, y2)) {
		return false;
	};
	if (this.isThrough() || this.isDebugThrough()) {
		return true;
	};
	//村人A　改変
	if (Moghunter.DisableThrowRegionIds.indexOf($gameMap.regionId(x, y)) >= 0) {
		this._throw._cantThrowAnyMore = true;
		return false;
	};
	//村人A　改変
	if (Moghunter.DisableThrowTerrainTags.indexOf($gameMap.terrainTag(x, y)) >= 0) {
		this._throw._cantThrowAnyMore = true;
		return false;
	}
	if (!$gameMap.isPassable(x, y)) {
		return false;
	};
	if (this.isCollidedWithCharacters(x2, y2)) {
		return false;
	};
	return true;
};

//===========================================================================
// ** Game Event
//===========================================================================

//==============================
// * start
//==============================
var _mog_pick_gevent_start = Game_Event.prototype.start;
Game_Event.prototype.start = function () {
	if (this.canPickUp() && arguments[0] != 'pd_TE_enable') { this.pickUp(); return };
	_mog_pick_gevent_start.call(this);
};


//==============================
// * check Pick Comment
//==============================
Game_Event.prototype.checkPickComment = function () {
	var enable = false
	if (!this._erased && this.page()) {
		this.list().forEach(function (l) {
			if (l.code === 108) {
				var comment = l.parameters[0].split(' : ')
				if (comment[0].toLowerCase() == "throw") {
					this._throw.range = Number(comment[1]);
					enable = true;
				};
			};
		}, this);
	};
	return enable;
};

//==============================
// * can Pick UP
//==============================
Game_Event.prototype.canPickUp = function () {
	if (!$gameSystem._pickupData[0]) { return false };
	if ($gamePlayer._pickup.enabled) { return false };
	if (this._trigger > 1) { return false };
	if (this._throw.enabled) { return false };
	if (this._throw.wait > 0) { return false };
	if (this._pickup.wait > 0) { return false };
	if ($gamePlayer._pickup.wait > 0) { return false };
	return this.checkPickComment();
};

//==============================
// * Pick UP
//==============================
Game_Event.prototype.pickUp = function () {
	var wait = 15;
	this._throw.enabled = true
	this._throw.wait = wait;
	this._throw.directionFix = this._directionFix;
	this._throw.through = this._through;
	this._directionFix = this._throw.directionFixA ? true : this._directionFix;
	this._through = true;
	$gamePlayer._pickup.enabled = true;
	$gamePlayer._pickup.wait = wait;
	$gamePlayer._pickup.originalName = $gamePlayer._characterName;
	if ($gamePlayer._pickup.pose) { $gamePlayer._characterName = $gamePlayer._pickup.originalName + "_Pick" };
	if (Imported.MOG_CharPoses) {
		$gamePlayer._pickup.originalName = $gamePlayer._originalName.name;
		if ($gamePlayer._pickup.pose) { $gamePlayer._characterName = $gamePlayer._originalName.name + "_Pick" };
	};
	var x = $gamePlayer._x - this._x;
	var y = $gamePlayer._y - this._y;
	this.jump(x, y, this._direction)
};

//===========================================================================
// ** Game Player
//===========================================================================

//==============================
// * Initialize
//==============================
var _mog_pick_gplayer_initialize = Game_Player.prototype.initialize;
Game_Player.prototype.initialize = function () {
	_mog_pick_gplayer_initialize.call(this);
	this._dirButton = String(Moghunter.pickDirectionButton) === "true" ? true : false;
	this._dirButtonK = String(Moghunter.pickDirectionButtonKey)
};

//==============================
// * move By Input
//==============================
var _mog_gplayer_moveByInput = Game_Player.prototype.moveByInput;
Game_Player.prototype.moveByInput = function () {
	if (this._pickup.wait > 0) { return };
	if (this._pickup.enabled && this.canMove()) {
		if (Input.isTriggered('ok')) { this.throwTarget(); return };
		if (Input.isPressed(this._dirButtonK)) { this.holdDirectionT(); return };
	};
	_mog_gplayer_moveByInput.call(this);
};

//==============================
// * hold Direction D T
//==============================
Game_Player.prototype.holdDirectionT = function () {
	if (Input.isPressed('down')) {
		this.setDirection(2);
	} else if (Input.isPressed('left')) {
		this.setDirection(4);
	} else if (Input.isPressed('right')) {
		this.setDirection(6);
	} else if (Input.isPressed('up')) {
		this.setDirection(8);
	};
};

//==============================
// * trigger Action
//==============================
var _mog_gplayer_pick_triggerAction = Game_Player.prototype.triggerAction;
Game_Player.prototype.triggerAction = function () {
	if (this._throw.wait > 0) { return false };
	if (this._pickup.wait > 0) { return false };
	if (this._pickup.enabled) { return false };
	_mog_gplayer_pick_triggerAction.call(this);
	return false;
};

//==============================
// * throw Target
//==============================
Game_Player.prototype.throwTarget = function () {
	this._pickup.check = false;
	$gameMap.events().forEach(function (event) {
		if (event._throw.enabled) { this.throwEvent(event) };
	}, this);
	if (!this._pickup.check) { return };
	this._pickup.enabled = false;
	this._pickup.wait = 15;
	SoundManager.playThrowSE(String(Moghunter.pickSoundFile));
	if (this._pickup.pose) { this._characterName = this._pickup.originalName };
};

//==============================
// * throw Event
//==============================
Game_Player.prototype.throwEvent = function (event) {
	//村人A改変
	var r = event._throw.range; var xr = 0; var yr = 0;
	var hv = Math.abs(this._direction - 5) == 1 ? [1, 0] : [0, 1]
	var d = (this._direction - 5) / (3 - 2 * hv[0])
	var x = this._x;
	var y = this._y;
	var xr, xy = 0;
	for (var i = 0; i < r; i++) {
		x += d * hv[0]; y += -d * hv[1];
		if (this.canPassThrow(x, y, this._direction)) { xr = x - this._x; yr = y - this.y };
	};
	this._throw._cantThrowAnyMore = false
	/*
	var x = this._x + d*(r - 1)*hv[0];
	var y = this._y + d*(r - 1)*hv[1];
	var x2 = -d*r*hv[0];
	var y2 = d*r*hv[1];
	for (var i = 0; i < r; i++) {
		if (this.canPassThrow(x,y,this._direction)) {xr = x2; yr = y2;break};
		x += d*hv[0]; x2 += d*hv[0]; y += -d*hv[1]; y2 += -d*hv[1];
	};
	
	
	if (this._direction === 2) {
		x = this._x; y = this._y + r - 1; x2 = 0; y2 = +r;
		for (var i = 0; i < r; i++) {
			if (this.canPassThrow(x,y,this._direction)) {xr = x2; yr = y2;break};
			y--;y2--;
		};
	} else if (this._direction === 4) {
		x = this._x - r + 1; y = this._y; x2 = -r; y2 = 0;
		for (var i = 0; i < r; i++) {
			if (this.canPassThrow(x,y,this._direction)) {xr = x2; yr = y2;break};
			x++;x2++;
		};
	} else if (this._direction === 6) {
		x = this._x + r - 1; y = this._y; x2 = +r; y2 = 0;
		for (var i = 0; i < r; i++) {
			if (this.canPassThrow(x,y,this._direction)) {xr = x2; yr = y2;break};
			x--;x2--;
		};
	} else if (this._direction === 8) {
		x = this._x; y = this._y - r + 1; x2 = 0; y2 = -r;
		for (var i = 0; i < r; i++) {
			if (this.canPassThrow(x,y,this._direction)) {xr = x2; yr = y2;break};
			y++;y2++;
		};
	};
	*/
	if (xr === 0 && yr === 0) { return };
	event.jump(xr, yr)
	event._throw.enabled = false
	event._throw.wait = 30;
	event._through = this._throw.through;
	event._directionFix = this._throw._directionFix;
	this._pickup.check = true;
};

//==============================
// * clear Transfer Info
//==============================
var _mog_pick_gplayer_clearTransferInfo = Game_Player.prototype.clearTransferInfo;
Game_Player.prototype.clearTransferInfo = function () {
	_mog_pick_gplayer_clearTransferInfo.call(this);
	this.clearPick();
};

//==============================
// * clearPick
//==============================
Game_Player.prototype.clearPick = function () {
	this._pickup.enabled = false;
	this._pickup.wait = 0;
};

//===========================================================================
// ** Sound Manager
//===========================================================================

//==============================
// * Play ThrowSE
//==============================
SoundManager.playThrowSE = function (fileName) {
	var se = {};
	se.name = fileName;
	se.pitch = 100;
	se.volume = 100;
	AudioManager.playSe(se);
};

//===========================================================================
// ** Sprite Character
//===========================================================================

//==============================
// * update Position
//==============================
var _mog_pick_sprChar_updatePosition = Sprite_Character.prototype.updatePosition;
Sprite_Character.prototype.updatePosition = function () {
	if (this.needUpdatePick()) { this.updateSprtPick(); return };
	_mog_pick_sprChar_updatePosition.call(this);
	if (this._character._throw.wait > 0) { this.z = $gamePlayer.screenZ() + 1 };
};

//==============================
// * Need Update Pick
//==============================
Sprite_Character.prototype.needUpdatePick = function () {
	if (this._character._throw.enabled && this._character._throw.wait > 0) { return false };
	return this._character._throw.enabled;
};

//==============================
// * update Sprt Pick
//==============================
Sprite_Character.prototype.updateSprtPick = function () {
	this.x = $gamePlayer.screenX();
	this.y = $gamePlayer.screenY()// - Moghunter.pickTargetHeight;
	this.z = $gamePlayer.screenZ() + 1;
};