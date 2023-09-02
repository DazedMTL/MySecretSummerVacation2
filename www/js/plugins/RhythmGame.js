/*:
 * @plugindesc 簡易リズムゲームプラグイン
 * @author Tennana
 * @help
 * 簡単なリズムゲームをプレイするためのプラグインです。
 *
 * 【使い方】
 * プラグイン設定で、譜面情報を設定し、プラグインコマンドでゲームを開始します。
 * プラグインコマンドでゲームを開始すると、「並列処理」以外がブロックされるため、ヒット/ミス時の処理はスイッチを条件にした並列処理で作成してください。
 * 曲の再生が終わるか、並列処理からゲーム終了コマンドが呼ばれると、呼び出し元のイベントに制御が戻ります。
 *
 * 【プラグインコマンド】
 * RhythmGameStart 曲名
 * 　指定した曲名の譜面を読み込んでゲームを開始します。
 *
 * RhythmGameStop
 * 　ゲームを直ちに終了し、起動したイベントに制御を戻します。
 *
 * RhythmGameHidden
 *   プレイエリアを非表示にします。場所移動でも自動的に非表示となります。
 *
 * @param RhythmNotes
 * @type struct<RhythmNotes>[]
 * @text 譜面情報
 *
 * @param NotesType
 * @type struct<NotesType>[]
 * @text ノーツタイプ定義
 * @default ["{\"name\":\"赤\",\"input\":\"left\",\"size\":\"30\",\"color\":\"red\"}","{\"name\":\"青\",\"input\":\"right\",\"size\":\"30\",\"color\":\"blue\"}"]
 *
 * @param NotesSpeed
 * @type number
 * @text ノーツスピード
 * @default 5000
 * @desc ノーツが画面上を流れる速度をミリ秒で指定します。半分のタイミングでノーツが中央になるように調整されます。
 *
 * @param HitRange
 * @type number
 * @text ヒット範囲
 * @default 100
 * @desc 譜面に対するタイミングのずれを許容する範囲をミリ秒で指定します。100で前後100ミリ秒を許容します。
 *
 * @param HitSwitch
 * @type switch
 * @text ヒット時スイッチ
 * @desc ヒット時にONになるスイッチ
 *
 * @param DifferenceVariable
 * @type variable
 * @text 差分格納変数
 * @desc 最後にヒットしたときの譜面との差分ミリ秒を格納する変数
 *
 * @param MissSwitch
 * @type switch
 * @text ミススイッチ
 * @desc ミス時にONになるスイッチ
 *
 * @param PlayAreaX
 * @type number
 * @text プレイエリアX座標
 * @default 0
 * @min 0
 * @desc プレイエリアの左上X座標
 *
 * @param PlayAreaY
 * @type number
 * @text プレイエリアY座標
 * @default -1
 * @min -1
 * @desc プレイエリアの左上Y座標。-1で画面下部になるよう自動調整します。
 *
 * @param PlayAreaWidth
 * @type number
 * @text プレイエリア幅
 * @default -1
 * @min -1
 * @desc プレイエリアの横幅をピクセル数で指定します。-1で画面幅になるよう自動調整します。
 *
 * @param PlayAreaHeight
 * @type number
 * @text プレイエリア高さ
 * @default 200
 * @min 0
 * @desc プレイエリアの高さをピクセル数で指定します。
 *
 * @param PlayAreaWindow
 * @type file
 * @text プレイエリアウィンドウ画像
 * @default Window
 * @dir img/system
 *
 * @param PlayAreaArrowSize
 * @type number
 * @text プレイエリアの矢印サイズ
 * @default 2
 * @min 1
 * @desc プレイエリアの矢印のサイズを倍率で指定します。
 */
/*~struct~RhythmNotes:
 * @param name
 * @text 曲名
 * @type string
 *
 * @param file
 * @type file
 * @dir audio
 *
 * @param volume
 * @text 音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param pitch
 * @text ピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100
 *
 * @param pan
 * @text 位相
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param notes
 * @text ノーツ情報
 * @type struct<Notes>[]
 *
*/

/*~struct~Notes:
 * @param hitTime
 * @text 判定タイミングミリ秒
 * @min 0
 * @desc ノーツにヒットするタイミングを開始からのミリ秒で指定します。出現時間を上書きします。
 *
 * @param time
 * @text 出現時間ミリ秒
 * @type number
 * @min 0
 * @desc ノーツが出現するタイミングを開始からのミリ秒で指定します。判定タイミングは出現+ノーツスピードの半分になります。
 *
 * @param type
 * @text ノーツタイプ
 * @type combo
 * @option 赤
 * @option 青
 * @desc ノーツの種類を名前で指定します。
 *
 * @param size
 * @text 半径
 * @type number
 * @min 0
 * @default 0
 * @desc ノーツの半径を上書きします。0でデフォルトの大きさになります。
 *
 * @param color
 * @text 色
 * @type string
 * @desc ノーツの色を上書きします。CSS COLOR形式で指定します。空でデフォルトの色になります。
*/

/*~struct~NotesType:
 * @param name
 * @text ノーツタイプ名
 * @type string
 * @desc ノーツタイプの名前です。譜面側で指定する名前になります。
 *
 * @param input
 * @type select
 * @text キー名称
 * @desc このノーツを叩くためのキー名称です。
 * @option 決定
 * @value ok
 * @option キャンセル
 * @value cancel
 * @option ダッシュ
 * @value shift
 * @option メニュー
 * @value menu
 * @option ページアップ
 * @value pageup
 * @option ページダウン
 * @value pagedown
 * @option 上移動
 * @value up
 * @option 下移動
 * @value down
 * @option 左移動
 * @value left
 * @option 右移動
 * @value right
 * @default ok
 *
 * @param size
 * @text 半径
 * @type number
 * @min 2
 * @default 30
 * @desc ノーツの半径をピクセルで指定します。
 *
 * @param color
 * @text 色
 * @type string
 * @desc ノーツの色をCSS COLOR形式で指定します。空でデフォルトの色になります。
 *
 * @param borderColor
 * @text 枠色
 * @type string
 * @desc ノーツの枠線の色をCSS COLORで指定します。空で白色になります。
 * @default white
 *
 * @param borderWidth
 * @text 枠線の太さ
 * @type number
 * @default 1
 * @min 0
 * @desc ノーツの枠線の太さを指定します。
 */

"use strict";
{
	const PARAMS = PluginManagerEx.createParameter(document.currentScript);
	const HIT_RANGE = PARAMS.HitRange; // ヒット可能範囲
	const NOTES_SPEED = PARAMS.NotesSpeed || 5000; // ノーツの速度(ミリ秒)
	const FADE_OUT_TIME = 1; // フェードアウト秒数

	if (!Html5Audio.addStopListener) {
		Html5Audio.addStopListener = function (listener) {
			this._audioElement.addEventListener('ended', listener, { once: true });
		}
	}

	(function (orig) {
		Game_Interpreter.prototype.pluginCommand = function (command, args) {
			orig.call(this, command, args);
			if (command === "RhythmGameStart") {
				this._waitMode = "rhythm";
				RhythmManager.start(args).finally(() => {
					this._waitMode = ""
				});
			}
			if (command === "RhythmGameStop") {
				RhythmManager.stop();
				this._waitMode = "";
				this._waitCount = FADE_OUT_TIME * 60 + 10;
				return;
			}
			if (command === "RhythmGameHidden") {
				RhythmManager.hidden();
				return;
			}
		};
	})(Game_Interpreter.prototype.pluginCommand);
	(function (orig) {
		Game_Interpreter.prototype.updateWaitMode = function () {
			if (this._waitMode === "rhythm") {
				return true;
			}
			return orig.call(this);
		};
	})(Game_Interpreter.prototype.updateWaitMode);

	class RhythmManagerImpl {
		async start(args) {
			const bgmName = args[0];
			const rhythmNote = PARAMS.RhythmNotes.find(rhythmNotes => {
				return rhythmNotes.name === bgmName;
			});
			if (!rhythmNote) {
				throw new Error(`RhythmNotes not found. name: ${bgmName}`);
			}
			this._currentRhythmNote = rhythmNote;
			this._waitNotes = rhythmNote.notes.map(notes => {
				if (Number.isFinite(notes.hitTime)) {
					notes.time = notes.hitTime - NOTES_SPEED / 2;
				}
				return notes;
			}).sort((a, b) => a.time - b.time);

			return Promise.all([
				this.preloadBgm(rhythmNote).then(bgm => {
					this._bgmBuffer = bgm
				}),
				this.createPlayArea()
			]).then(() => {
				this._playing = true;
				AudioManager.updateBufferParameters(this._bgmBuffer,
					ConfigManager.bgmVolume, this._currentRhythmNote);
				this._bgmBuffer.play(false, 0);
				return new Promise((resolve, reject) => {
					this._bgmBuffer.addStopListener(resolve);
				});
			}).then(() => {
				this._playing = false;
			});
		}

		preloadBgm(rhythmNotes) {
			return new Promise((resolve, reject) => {
				const ext = AudioManager.audioFileExt();
				let url = "./audio/" + rhythmNotes.file;
				if (!AudioManager.shouldUseHtml5Audio()) {
					const audio = new WebAudio(url + ext);
					audio.addLoadListener(resolve.bind(null, audio));
					return;
				}
				if (!Decrypter.hasEncryptedAudio) {
					return url + ext;
				}
				return fetch(Decrypter.extToEncryptExt(rhythmNotes.file + ext))
					.then(response => response.arrayBuffer())
					.then(arrayBuffer => {
						return Decrypter.createBlobUrl(arrayBuffer);
					});
			}).then(url => {
				if (typeof url === 'string') {
					Html5Audio.setup(url)
					return new Promise((resolve, reject) => {
						Html5Audio.addLoadListener(resolve.bind(null, Html5Audio));
					});
				}
				return url;
			});
		}

		async createPlayArea() {
			if (this._playArea && this._playArea.parent) {
				this._playArea.visible = true;
			} else {
				await new Promise(resolve => {
					if (!PARAMS.PlayAreaWindow) {
						return resolve();
					}
					ImageManager.loadSystem(PARAMS.PlayAreaWindow).addLoadListener(
						resolve);
				});
				this._playArea = new PlayArea();
			}
			this._playArea.children.filter(child => child instanceof Notes).forEach(
				child => {
					child.destroy();
				});
			SceneManager._scene.addWindow(this._playArea);
			return this._playArea;
		}

		appearNotes(time) {
			if (this._waitNotes.length === 0) {
				return;
			}
			const notes = this._waitNotes[0];
			if (notes.time > time) {
				return;
			}
			const notesType = PARAMS.NotesType.find(
				notesType => notesType.name === notes.type);

			const notesAppearance = Object.assign({
				time: notes.time,
				borderWidth: 1,
				borderColor: 'white',
				zIndex: notes.zIndex
			}, notesType);
			notesAppearance.color = notes.color || notesAppearance.color;
			notesAppearance.size = notes.size || notesAppearance.size;
			this._playArea.addNotes(notesAppearance);
			this._waitNotes.shift();
		}

		stop() {
			this._bgmBuffer.fadeOut(FADE_OUT_TIME);
			setTimeout(this._bgmBuffer.stop.bind(this._bgmBuffer),
				FADE_OUT_TIME * 1000 + 100);
			this._playing = false;
		}

		hidden() {
			if (this._playArea) {
				this._playArea.visible = false;
			}
		}
	}

	Object.defineProperties(RhythmManagerImpl.prototype, {
		playing: {
			get: function () {
				return this._playing;
			}
		},
		currentRhythmNote: {
			get: function () {
				return this._currentRhythmNote;
			}
		},
		currentPlayTime: {
			get: function () {
				return this._bgmBuffer ? this._bgmBuffer.seek() * 1000 : 0;
			}
		}
	});

	class PlayArea extends Window_Base {
		constructor() {
			const width = PARAMS.PlayAreaWidth > 0 ? PARAMS.PlayAreaWidth
				: Graphics.width;
			const height = PARAMS.PlayAreaHeight > 0 ? PARAMS.PlayAreaHeight : 200;
			const x = PARAMS.PlayAreaX > 0 ? PARAMS.PlayAreaX : 0;
			const y = PARAMS.PlayAreaY >= 0 ? PARAMS.PlayAreaY : Graphics.height
				- height;
			super(x, y, width, height);
			this.notesChunk = width / NOTES_SPEED;
			this.resetFontSettings()
			this.downArrowVisible = true;
			this.upArrowVisible = true;
			const scale = PARAMS.PlayAreaArrowSize || 2;
			this._upArrowSprite.scale.x = scale;
			this._upArrowSprite.scale.y = scale;
			this._downArrowSprite.scale.x = scale;
			this._downArrowSprite.scale.y = scale;
		}

		_refreshArrows() {
			super._refreshArrows();
			let cursorX = this.width / 2;
			this._downArrowSprite.move(cursorX, this.standardPadding() * 1.5);
			this._upArrowSprite.move(cursorX,
				this.height - this.standardPadding() * 1.5);
		}

		standardFontSize() {
			return 24;
		}

		update() {
			const time = RhythmManager.currentPlayTime;
			const width = this.width;
			const notesArray = this.children.filter(child => child instanceof Notes).reverse();
			notesArray.forEach(notes => {
				notes.updatePos(time, width, this.notesChunk);
				notes.miss(time);
			});
			super.update();
			if (RhythmManager.playing === false) {
				return;
			}
			RhythmManager.appearNotes(time);
			if (notesArray.length === 0) {
				return;
			}
			PARAMS.NotesType.forEach(notesType => {
				if (Input.isTriggered(notesType.input)) {
					const hitNotes = notesArray.find(notes => {
						return notes.canHit(time, notesType.input);
					});
					if (hitNotes) {
						hitNotes.hit(time);
					} else {
						$gameSwitches.setValue(PARAMS.MissSwitch, true);
					}
				}
			});
		}

		addNotes(notes) {
			this.addChildAt(new Notes(this.width,
				this.contentsHeight() / 2 + this.standardPadding(), notes), 3);
		}

		loadWindowskin() {
			if (!PARAMS.PlayAreaWindow) {
				return super.loadWindowskin();
			}
			this.windowskin = ImageManager.loadSystem(PARAMS.PlayAreaWindow);
		}
	}

	class Notes extends Sprite {
		constructor(x, y, notes) {
			super();
			const radius = notes.size + notes.borderWidth;
			this.bitmap = new Bitmap(radius * 2, radius * 2);
			if (notes.borderWidth > 0) {
				this.bitmap.drawCircle(radius, radius, radius, notes.borderColor);
			}
			this.bitmap.drawCircle(radius, radius, notes.size, notes.color);
			this.x = x || 0;
			this.y = y || 0;
			this.anchor.x = 0.5;
			this.anchor.y = 0.5;
			this.zIndex = notes.zIndex;
			this.hitTime = notes.time + NOTES_SPEED / 2;
			this.appearTime = notes.time;
			this._input = notes.input;
			this._result = null;
		}

		canHit(time, input) {
			if (this._result !== null || (input && input !== this._input)) {
				return false;
			}
			return this.hitTime - HIT_RANGE <= time && time <= this.hitTime
				+ HIT_RANGE;
		}

		hit(time) {
			this.destroy();
			$gameSwitches.setValue(PARAMS.HitSwitch, true);
			$gameVariables.setValue(PARAMS.DifferenceVariable, time - this.hitTime);
			this._result = true;
		}

		miss(time) {
			if (this._result !== null || time <= this.hitTime + HIT_RANGE) {
				return;
			}
			this._result = false;
			$gameSwitches.setValue(PARAMS.MissSwitch, true);
		}

		updatePos(time, parentWidth, chunk) {
			const x = parentWidth - (time - this.appearTime) * chunk;
			if (x < 0 && x < -this.width) {
				// 画面外へ出たら削除
				this.destroy();
				return;
			}
			this.x = x;
		}
	}

	(function (orig) {
		Scene_Map.prototype.onMapLoaded = function () {
			orig.apply(this, arguments);
			if (!window.RhythmManager || !window.RhythmManager.playing) {
				return;
			}
			this.addWindow(window.RhythmManager._playArea);
		};
	})(Scene_Map.prototype.onMapLoaded);

	window.RhythmManager = new RhythmManagerImpl();
}
