//=============================================================================
// TRP_Particle_FWStandAlone.js
//=============================================================================
/* このソフトウェアは正規に購入したユーザーのみが利用規約に従って使用することができます。
   また、このソフトウェアはMITライセンス、ならびにApache 2.0ライセンスで配布されている製作物が含まれています。
   http://www.opensource.org/licenses/mit-license
   http://www.apache.org/licenses/LICENSE-2.0
 */

/*【打ち上げ高さ調整用】
 0で発生、1で消失までのライフサイクルのスピードを設定
 デフォルトでは[0,1000,0.5,200,0.8,100,1,0]
 └発生時(0)にスピード1000
 └半分の寿命(0.5)でスピード200
 └消滅間際(0.8)でスピード100
 └消滅時(1.0)にスピード0
 */
var LAUNCH_SPEED = [0, 1000, 0.5, 200, 0.8, 100, 1, 0];

/*【キャッシュ設定】
 trueにするとパーティクルをより効率的に再利用します。
 falseで無効。
 試験的なパラメータなので要動作確認。
 */
var USE_CACHE = false;


//=============================================================================
/*:
 * @author Thirop
 * @plugindesc 花火プラグイン(MV用スタンドアロン版)
 * @help
 * 【更新履歴】
 * 1.04 2022/2/15  ロード時不具合修正
 * 1.00 2021/7/19  初版
 *
 * @param modes
 * @text 【モード設定】
 * @desc モード設定
 * @type struct<Mode>[]
 * @default ["{\"name\":\"opening1\",\"minInterval\":\"3\",\"maxInterval\":\"3\",\"ids\":\"[\\\"fw_simple\\\"]\",\"variations\":\"\",\"positionStr\":\"1,2,3,4,5,6,7,8,9\",\"launchAtSame\":\"true\",\"dyRange\":\"0.05\",\"defaultSec\":\"0\",\"endWaitSec\":\"1.10\",\"invalidOnAuto\":\"true\"}","{\"name\":\"opening2\",\"minInterval\":\"3\",\"maxInterval\":\"3\",\"ids\":\"[\\\"fw_twin\\\"]\",\"variations\":\"\",\"positionStr\":\"1,2.33,3.67,5,6.33,7.67,9\",\"launchAtSame\":\"true\",\"dyRange\":\"0.10\",\"defaultSec\":\"0\",\"endWaitSec\":\"1.00\",\"invalidOnAuto\":\"true\"}","{\"name\":\"opening1Low\",\"minInterval\":\"3\",\"maxInterval\":\"3\",\"ids\":\"[\\\"fw_simple\\\"]\",\"variations\":\"[]\",\"positionStr\":\"1,2.33,3.67,5,6.33,7.67,9\",\"launchAtSame\":\"true\",\"dyRange\":\"0.05\",\"defaultSec\":\"0\",\"endWaitSec\":\"1.10\"}","{\"name\":\"opening2Low\",\"minInterval\":\"3\",\"maxInterval\":\"3\",\"ids\":\"[\\\"fw_twin\\\"]\",\"variations\":\"\",\"positionStr\":\"2,5,8\",\"launchAtSame\":\"true\",\"dyRange\":\"0.10\",\"defaultSec\":\"0\",\"endWaitSec\":\"1.00\"}","{\"name\":\"normal\",\"minInterval\":\"1\",\"maxInterval\":\"120\",\"ids\":\"[\\\"fw_simple\\\",\\\"fw_twinkle\\\",\\\"fw_dual\\\",\\\"fw_change\\\",\\\"fw_kiku\\\",\\\"fw_kikus\\\"]\",\"variations\":\"[]\",\"positionStr\":\"\",\"launchAtSame\":\"false\",\"dyRange\":\"-1\",\"defaultSec\":\"10.00\",\"endWaitSec\":\"3.00\"}","{\"name\":\"twinkle\",\"minInterval\":\"1\",\"maxInterval\":\"120\",\"ids\":\"[\\\"fw_twinkle\\\"]\",\"variations\":\"[]\",\"positionStr\":\"\",\"launchAtSame\":\"false\",\"dyRange\":\"-1\",\"defaultSec\":\"10.00\",\"endWaitSec\":\"3.00\"}","{\"name\":\"kiku\",\"minInterval\":\"1\",\"maxInterval\":\"120\",\"ids\":\"[\\\"fw_kiku\\\"]\",\"variations\":\"[]\",\"positionStr\":\"\",\"launchAtSame\":\"false\",\"dyRange\":\"-1\",\"defaultSec\":\"10.00\",\"endWaitSec\":\"3.00\"}","{\"name\":\"dual\",\"minInterval\":\"1\",\"maxInterval\":\"120\",\"ids\":\"[\\\"fw_dual\\\"]\",\"variations\":\"[]\",\"positionStr\":\"\",\"launchAtSame\":\"false\",\"dyRange\":\"-1\",\"defaultSec\":\"10.00\",\"endWaitSec\":\"3.00\"}","{\"name\":\"change\",\"minInterval\":\"1\",\"maxInterval\":\"120\",\"ids\":\"[\\\"fw_twinkle\\\"]\",\"variations\":\"[]\",\"positionStr\":\"\",\"launchAtSame\":\"false\",\"dyRange\":\"-1\",\"defaultSec\":\"10.00\",\"endWaitSec\":\"3.00\"}","{\"name\":\"starmine\",\"minInterval\":\"1\",\"maxInterval\":\"20\",\"ids\":\"[\\\"fw_simple\\\"]\",\"variations\":\"[]\",\"positionStr\":\"\",\"launchAtSame\":\"false\",\"dyRange\":\"-1\",\"defaultSec\":\"10.00\",\"endWaitSec\":\"3.00\"}","{\"name\":\"starmineHigh\",\"minInterval\":\"1\",\"maxInterval\":\"15\",\"ids\":\"[\\\"fw_simple\\\",\\\"fw_simple\\\",\\\"fw_simple\\\",\\\"fw_twin\\\"]\",\"variations\":\"[]\",\"positionStr\":\"\",\"launchAtSame\":\"false\",\"dyRange\":\"-1\",\"defaultSec\":\"10.00\",\"endWaitSec\":\"3.00\"}","{\"name\":\"starmineLow\",\"minInterval\":\"1\",\"maxInterval\":\"40\",\"ids\":\"[\\\"fw_simple\\\"]\",\"variations\":\"[]\",\"positionStr\":\"\",\"launchAtSame\":\"false\",\"dyRange\":\"-1\",\"defaultSec\":\"10.00\",\"endWaitSec\":\"3.00\"}","{\"name\":\"kikusMulti\",\"minInterval\":\"3\",\"maxInterval\":\"3\",\"ids\":\"[\\\"fw_kikus\\\"]\",\"variations\":\"[]\",\"positionStr\":\"\",\"launchAtSame\":\"false\",\"dyRange\":\"40.00\",\"defaultSec\":\"0.72\",\"endWaitSec\":\"3.00\"}"]
 *
 * @param fireworks
 * @text 【花火データ設定】
 * @desc 花火パーティクルデータごとの設定。デフォルト値以外を使用する場合に設定
 * @type struct<Fireworks>[]
 * @default ["{\"name\":\"fw_twin\",\"noLaunch\":\"true\",\"variations\":\"[]\",\"se\":\"{\\\"name\\\":\\\"/audio/se/\\\",\\\"volume\\\":\\\"90\\\",\\\"pitch\\\":\\\"100\\\",\\\"pan\\\":\\\"100\\\"}\"}"]
 *
 * @param defaultVariationStr
 * @text 基本バリエーション
 * @desc デフォルトのカラーバリエーション。カンマ(,)続きで指定
 * @default yellow,green,blue,purple,red
 *
 * @param defaultAutoModes
 * @text 自動モード設定
 * @desc 自動モード(auto)で再生するモードをカンマつなぎで指定。(未指定で全て)
 * @default normal,normal,normal:red,normal:green,normal:blue,starmine,starmine:yellow
 *
 * @param defaultDyRange
 * @text 打ち上げ高さ幅
 * @desc 打ち上げて爆発する高さのランダム幅(%)
 * @type number
 * @min 0
 * @default 25
 *
 * @param launchHeight
 * @text 打ち上げ高さ
 * @desc 打ち上げパーティクル設定（fw_base）を調整する場合のみ変更。fw_baseが消滅する地点の高さを設定。(デフォ:452)
 * @default 452
 * @type number
 *
 * @param parallax
 * @text スクロール視差
 * @desc スクロールの視差率。カンマ続きでx,yを指定。1でスクロール完全追従。
 * @default 0.5,0.25
 *
 * @param defaultLaunchSe
 * @text 打ち上げ時のSE
 * @desc 花火打ち上げ時のSE
 * @type struct<SE>
 *
 * @param defaultBurstSe
 * @text 爆発時のSE
 * @desc 花火爆発時のSE
 * @type struct<SE>
 *
 * @param seVolumeRange
 * @text ボリューム乱数幅
 * @desc SEボリュームのランダムに変化させる幅
 * @default 10
 * @type number
 * @max 100
 * @min 0
 * 
 * @param sePitchRange
 * @text ピッチ乱数幅
 * @desc SEピッチのランダムに変化させる幅
 * @default 5
 * @type number
 * @min 0
 *
 *
 *
 *
 * @command start
 * @text start/開始
 * @desc 花火自動打ち上げの開始
 *
 * @arg mode
 * @text モード名
 * @desc モード名。指定無しで自動モード、auto:mode1,...で自動モードで有効なモード指定,waitで待機
 *
 * @arg duration
 * @text モード持続秒数
 * @desc モード指定時のモード持続秒数。-1でデフォ値
 * @type number
 * @min -1
 * @default -1
 *
 * @arg variationStr
 * @text バリエーション
 * @desc モード中有効なバリエーションをカンマ(,)続きで指定。未指定で各モードのデフォルト値、noneで無効
 *
 *
 * @command reserve
 * @text reserve/予約
 * @desc モードの予約
 *
 * @arg mode
 * @text モード名
 * @desc モード名。auto,指定無しで自動モード、auto:mode1,mode2,...で自動モードで有効なモード指定,endで終了
 *
 * @arg duration
 * @text モード持続秒数
 * @desc モード指定時のモード持続秒数。-1でデフォ値
 * @type number
 * @min -1
 * @default -1
 *
 * @arg variationStr
 * @text バリエーション
 * @desc モード中有効なバリエーションをカンマ(,)続きで指定。未指定で各モードのデフォルト値、noneで無効
 *
 * @arg startWait
 * @text 開始時のウェイト(秒)
 * @desc -1で無効。0以上とすると直前のモードの終了時のウェイトを無視して開始ウェイト設定
 * @default -1
 * @type number
 * @min -1
 * @decimals 2
 *
 *
 * @command clear
 * @text 予約クリア
 * @desc 予約している全てのモードをクリア
 *
 * @command end
 * @text end/終了
 * @desc 自動打ち上げの終了。(予約モード完了時に終える場合はreserveコマンドでモードにend指定)
 *
 * 
 */
//============================================================================= 
/*~struct~SE:
 * @param name
 * @text SEファイル名
 * @desc SEに使用するファイル名の選択
 * @type file
 * @default /audio/se/
 *
 * @param volume
 * @text ボリューム
 * @desc SEのボリューム
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * 
 * @param pitch
 * @text ピッチ
 * @desc SEのピッチ
 * @type number
 * @min 0
 * @default 100
 *
 * @param pan
 * @text パン
 * @desc SEのパン
 * @type number
 * @default 100
 * 
 */
/*~struct~Fireworks:
 * @param name
 * @text パーティクルグループ名
 * @desc 対応するパーティクルグループ名
 *
 * @param noLaunch
 * @text 噴き出しタイプ
 * @desc ONとすると吹き上げタイプ（打ち上げせずに地面位置で表示）
 * @type boolean
 * @default false
 *
 * @param variations
 * @text バリエーション
 * @desc このパーティクルグループに用意しているバリエーション。未設定でデフォルト、1項目目にnoneで未使用
 * @type string[]
 * @default []
 * 
 * @param se
 * @text SE設定
 * @desc SE設定。未設定でデフォルトSE、名前をnoneでSE未使用
 * @type struct<SE>
 * 
 */
/*~struct~Mode:
 * @param name
 * @text モード名
 * @desc モード名。各プラグインコマンドでモードの指定に使用
 *
 * @param minInterval
 * @text 最小打ち上げ間隔
 * @desc 打ち上げ間隔の最小フレーム数
 * @type number
 * @min 1
 * @default 30
 *
 * @param maxInterval
 * @text 最大打ち上げ間隔
 * @desc 打ち上げ間隔の最大フレーム数
 * @type number
 * @min 1
 * @default 60
 *
 * @param ids
 * @text 花火IDリスト
 * @desc 有効な花火パーティクルグループのリスト
 * @type string[]
 * @default []
 *
 * @param variations
 * @text バリエーション
 * @desc このモードで有効なバリエーション。1項目目にnoneでバリエーションなし
 * @type string[]
 *
 * @param positionStr
 * @text X位置
 * @desc 発射するX位置(0~10)の指定。カンマ(,)続きで複数指定可能
 *
 * @param launchAtSame
 * @text └同時に発射
 * @desc ONにするとX位置を複数指定時、打ち上げ時にそれらの位置で同時発射
 * @type boolean
 * @default false
 * 
 * @param dyRange
 * @text 打ち上げ高さ幅
 * @desc 爆発位置の高さのランダム幅(%)。-1とするとデフォルト値使用
 * @default -1
 * @decimals 2
 * @type number
 * @min -1
 *
 * @param defaultSec
 * @text モード継続秒数
 * @desc モード継続秒数
 * @default 10
 * @type number
 * @decimals 2
 * @min 0
 * 
 * @param endWaitSec
 * @text 終了時のウェイト
 * @desc モード終了時に次のモードに遷移するまでの秒数
 * @default 3
 * @type number
 * @decimals 2
 * @min 0
 * 
 * 
 */
//============================================================================= 


function Game_Particle() {
	this.initialize.apply(this, arguments);
};
function ParticleGroup() {
	this.initialize.apply(this, arguments);
};
function Game_Fireworks() {
	this.initialize.apply(this, arguments);
};


(function () {
	PluginManager._parameters['trp_particle'] = { "importLibrary": "true", "importFilter": "true", "systemParticles": "[]", "commandName": "particle,パーティクル", "keepPictureOrder": "false", "walkOffset": "16", "dashOffset": "16", "categoryClear": "==============================", "clearCharacterOnMapChange": "true", "clearPartyOnMapChange": "true", "clearScreenOnMapChange": "true", "clearBattleScreenOnEnd": "false", "clearBattleCharaOnEnd": "true", "categoryPerformance": "==============================", "regionMargin": "2", "outsideMargin": "6", "maxParticles": "100000", "categoryConflict": "==============================", "disableState": "false", "disableSkill": "false", "disableRoute": "false", "cacheBeforeTerminate": "false", "categorySenior": "==============================", "sceneTypes": "[]", "noRewriteFunctions": "false", "categoryDebug": "==============================", "displayCount": "false", "errorLog": "true", "windowBugFix": "true", "useCache": USE_CACHE }
	var $dataTrpParticlePreset = [];
	var $dataTrpParticleGroupsPreset = [];

	(function () {
		$dataTrpParticlePreset["fw_base"] = [4, [[0, 1, 0.7, 1, 1, 0]], [[0, 0.15, 1, 0.1], 1], [LAUNCH_SPEED, 1], [[0, "#f8cda8", 1, "#9f9f9f"]], 0, [0, 0], null, [-90, -90], [0, 0], 10, 0, 0, [1.3, 1.3], 1, 0.01, 1, 5, 0.011, 10000, [0, 0], 4, [0, 312], [0, 0, 0.015, 1, 0, 0, 0], 0, 0, "particle7", 0,
			"花火~打ち上げ用[橙]"];
		// $dataTrpParticlePreset["fw_base_yellow"] = [4,[[0,0.8,0.7,0.8,1,0]],[[0,0.15,1,0.15],0.5],[[0,1000,0.5,200,0.8,100,1,0],1],[[0,"#fffa76",1,"#fffdcd"]],0,[0,0],null,[-90,-90],[0,0],0,0,0,[1.3,1.3],1,0.01,1,5,0.011,10000,[0,0],4,[0,312],[0,0,0.015,1,0,0,0],0,0,"particle9",0,
		//     "花火~打ち上げ用[黄]"];
		// $dataTrpParticlePreset["fw_base_green"] = [4,[[0,0.8,0.7,0.8,1,0]],[[0,0.15,1,0.15],0.5],[[0,1000,0.5,200,0.8,100,1,0],1],[[0,"#a1ff76",1,"#daface"]],0,[0,0],null,[-90,-90],[0,0],0,0,0,[1.3,1.3],1,0.01,1,5,0.011,10000,[0,0],4,[0,312],[0,0,0.015,1,0,0,0],0,0,"particle9",0,
		//     "花火~打ち上げ用[緑]"];
		// $dataTrpParticlePreset["fw_base_blue"] = [4,[[0,0.8,0.7,0.8,1,0]],[[0,0.15,1,0.15],0.5],[[0,1000,0.5,200,0.8,100,1,0],1],[[0,"#276aff",1,"#c2eaff"]],0,[0,0],null,[-90,-90],[0,0],0,0,0,[1.3,1.3],1,0.01,1,5,0.011,10000,[0,0],4,[0,312],[0,0,0.015,1,0,0,0],0,0,"particle9",0,
		//     "花火~打ち上げ用[青]"];
		// $dataTrpParticlePreset["fw_base_purple"] = [4,[[0,0.8,0.7,0.8,1,0]],[[0,0.15,1,0.15],0.5],[[0,1000,0.5,200,0.8,100,1,0],1],[[0,"#b169ff",1,"#e7cdff"]],0,[0,0],null,[-90,-90],[0,0],0,0,0,[1.3,1.3],1,0.01,1,5,0.011,10000,[0,0],4,[0,312],[0,0,0.015,1,0,0,0],0,0,"particle9",0,
		//     "花火~打ち上げ用[紫]"];
		// $dataTrpParticlePreset["fw_base_red"] = [4,[[0,0.8,0.7,0.8,1,0]],[[0,0.15,1,0.15],0.5],[[0,1000,0.5,200,0.8,100,1,0],1],[[0,"#ff4444",1,"#ffc2c2"]],0,[0,0],null,[-90,-90],[0,0],0,0,0,[1.3,1.3],1,0.01,1,5,0.011,10000,[0,0],4,[0,312],[0,0,0.015,1,0,0,0],0,0,"particle9",0,
		//     "花火~打ち上げ用[赤]"];


		//fw_twinkle
		$dataTrpParticlePreset["_auto:0:fw_twinkle/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#c29474", 1, "#e4c7ad"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_twinkle_yellow/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#f7fd85", 1, "#fffdc2"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""];
		$dataTrpParticlePreset["_auto:0:fw_twinkle_green/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#a2ddaa", 1, "#e2f8d4"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_twinkle_blue/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#8eaefd", 1, "#b1bffd"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_twinkle_purple/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#ab9dfa", 1, "#ecddfa"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_twinkle_red/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#dda2b4", 1, "#f8d4d4"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_twinkle/h"] = [4, [[0, 0, 0.1, 1, 0.2, 0, 0.3, 1, 0.4, 0, 0.5, 1, 0.6, 0, 0.7, 1, 1, 0]], [[0, 0.1, 0.7, 0.1, 1, 0], 0.5], [[0, 0, 1, 0], 1], [[0, "#f8cf66", 1, "#ffffff"]], 0, [0, 20], null, [0, 360], [0, 0], 0, 0, 0, [1, 2], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""];
		$dataTrpParticlePreset["_sub:0:fw_twinkle_yellow/h"] = [4, [[0, 0, 0.1, 1, 0.2, 0, 0.3, 1, 0.4, 0, 0.5, 1, 0.6, 0, 0.7, 1, 1, 0]], [[0, 0.1, 0.7, 0.1, 1, 0], 0.5], [[0, 0, 1, 0], 1], [[0, "#ecf866", 1, "#ffffff"]], 0, [0, 20], null, [0, 360], [0, 0], 0, 0, 0, [1, 2], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""];
		$dataTrpParticlePreset["_sub:0:fw_twinkle_green/h"] = [4, [[0, 0, 0.1, 1, 0.2, 0, 0.3, 1, 0.4, 0, 0.5, 1, 0.6, 0, 0.7, 1, 1, 0]], [[0, 0.1, 0.7, 0.1, 1, 0], 0.5], [[0, 0, 1, 0], 1], [[0, "#66f879", 1, "#ffffff"]], 0, [0, 20], null, [0, 360], [0, 0], 0, 0, 0, [1, 2], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_twinkle_blue/h"] = [4, [[0, 0, 0.1, 1, 0.2, 0, 0.3, 1, 0.4, 0, 0.5, 1, 0.6, 0, 0.7, 1, 1, 0]], [[0, 0.1, 0.7, 0.1, 1, 0], 0.5], [[0, 0, 1, 0], 1], [[0, "#6692f8", 1, "#ffffff"]], 0, [0, 20], null, [0, 360], [0, 0], 0, 0, 0, [1, 2], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_twinkle_purple/h"] = [4, [[0, 0, 0.1, 1, 0.2, 0, 0.3, 1, 0.4, 0, 0.5, 1, 0.6, 0, 0.7, 1, 1, 0]], [[0, 0.1, 0.7, 0.1, 1, 0], 0.5], [[0, 0, 1, 0], 1], [[0, "#8866f8", 1, "#ffffff"]], 0, [0, 20], null, [0, 360], [0, 0], 0, 0, 0, [1, 2], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_twinkle_red/h"] = [4, [[0, 0, 0.1, 1, 0.2, 0, 0.3, 1, 0.4, 0, 0.5, 1, 0.6, 0, 0.7, 1, 1, 0]], [[0, 0.1, 0.7, 0.1, 1, 0], 0.5], [[0, 0, 1, 0], 1], [[0, "#f47878", 1, "#ffffff"]], 0, [0, 20], null, [0, 360], [0, 0], 0, 0, 0, [1, 2], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""]
		$dataTrpParticleGroupsPreset["fw_twinkle"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.9 -1 3 0 0"], "targetType": 0,
			"comment": "花火~キラキラ[橙]"
		};
		$dataTrpParticleGroupsPreset["fw_twinkle_yellow/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.9 -1 3 0 0"], "targetType": 0,
			"comment": "花火~キラキラ[黄]"
		};
		$dataTrpParticleGroupsPreset["fw_twinkle_green/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.9 -1 3 0 0"], "targetType": 0,
			"comment": "花火~キラキラ[緑]"
		};
		$dataTrpParticleGroupsPreset["fw_twinkle_blue/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.9 -1 3 0 0"], "targetType": 0,
			"comment": "花火~キラキラ[青]"
		};
		$dataTrpParticleGroupsPreset["fw_twinkle_purple/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.9 -1 3 0 0"], "targetType": 0,
			"comment": "花火~キラキラ[紫]"
		};
		$dataTrpParticleGroupsPreset["fw_twinkle_red/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.9 -1 3 0 0"], "targetType": 0,
			"comment": "花火~キラキラ[赤]"
		};


		//fw_kiku
		$dataTrpParticlePreset["_auto:0:fw_kiku/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2, 0.15, 1.5, 0.5, 0.2, 1, 0], 1], [[0, 1500, 0.1, 100, 1, 10], 0.8], [[0, "#ffffff", 1, "#ff8e3e"]], 1, [0, 2], null, [-240, 60], [50, -50], 0, 0, 0, [1, 2.5], 1, 0.001, 1, 1, 0.04, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_kiku_yellow/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2, 0.15, 1.5, 0.5, 0.2, 1, 0], 1], [[0, 1500, 0.1, 100, 1, 10], 0.8], [[0, "#ffffff", 1, "#ffcf3e"]], 1, [0, 2], null, [-240, 60], [50, -50], 0, 0, 0, [1, 2.5], 1, 0.001, 1, 1, 0.04, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_kiku_green/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2, 0.15, 1.5, 0.5, 0.2, 1, 0], 1], [[0, 1500, 0.1, 100, 1, 10], 0.8], [[0, "#ffffff", 1, "#77ad4a"]], 1, [0, 2], null, [-240, 60], [50, -50], 0, 0, 0, [1, 2.5], 1, 0.001, 1, 1, 0.04, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_kiku_blue/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2, 0.15, 1.5, 0.5, 0.2, 1, 0], 1], [[0, 1500, 0.1, 100, 1, 10], 0.8], [[0, "#ffffff", 1, "#4a68ad"]], 1, [0, 2], null, [-240, 60], [50, -50], 0, 0, 0, [1, 2.5], 1, 0.001, 1, 1, 0.04, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_kiku_purple/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2, 0.15, 1.5, 0.5, 0.2, 1, 0], 1], [[0, 1500, 0.1, 100, 1, 10], 0.8], [[0, "#ffffff", 1, "#7a4aad"]], 1, [0, 2], null, [-240, 60], [50, -50], 0, 0, 0, [1, 2.5], 1, 0.001, 1, 1, 0.04, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_kiku_red/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2, 0.15, 1.5, 0.5, 0.2, 1, 0], 1], [[0, 1500, 0.1, 100, 1, 10], 0.8], [[0, "#ffffff", 1, "#ed5942"]], 1, [0, 2], null, [-240, 60], [50, -50], 0, 0, 0, [1, 2.5], 1, 0.001, 1, 1, 0.04, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kiku/h"] = [4, [[0, 1, 1, 0]], [[0, 0.3, 0.5, 0.2, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#f6857f", 1, "#ffffff"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [2.5, 3], 1, 0.06, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kiku_yellow/h"] = [4, [[0, 1, 1, 0]], [[0, 0.3, 0.5, 0.2, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#f6e27f", 1, "#ffffff"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [2.5, 3], 1, 0.06, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kiku_green/h"] = [4, [[0, 1, 1, 0]], [[0, 0.3, 0.5, 0.2, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#99ca87", 1, "#ffffff"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [2.5, 3], 1, 0.06, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kiku_blue/h"] = [4, [[0, 1, 1, 0]], [[0, 0.3, 0.5, 0.2, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#5081b8", 1, "#ffffff"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [2.5, 3], 1, 0.06, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kiku_purple/h"] = [4, [[0, 1, 1, 0]], [[0, 0.3, 0.5, 0.2, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#7e5bb2", 1, "#ffffff"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [2.5, 3], 1, 0.06, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kiku_red/h"] = [4, [[0, 1, 1, 0]], [[0, 0.3, 0.5, 0.2, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#b25b78", 1, "#ffffff"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [2.5, 3], 1, 0.06, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticleGroupsPreset["fw_kiku"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.06 0.5 0.05 1 0"], "targetType": 0,
			"comment": "花火~菊(大)[橙]"
		};
		$dataTrpParticleGroupsPreset["fw_kiku_yellow/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.06 0.5 0.05 1 0"], "targetType": 0,
			"comment": "花火~菊(大)[黄]"
		};
		$dataTrpParticleGroupsPreset["fw_kiku_green/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.06 0.5 0.05 1 0"], "targetType": 0,
			"comment": "花火~菊(大)[緑]"
		};
		$dataTrpParticleGroupsPreset["fw_kiku_blue/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.06 0.5 0.05 1 0"], "targetType": 0,
			"comment": "花火~菊(大)[青]"
		};
		$dataTrpParticleGroupsPreset["fw_kiku_purple/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.06 0.5 0.05 1 0"], "targetType": 0,
			"comment": "花火~菊(大)[紫]"
		};
		$dataTrpParticleGroupsPreset["fw_kiku_red/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.06 0.5 0.05 1 0"], "targetType": 0,
			"comment": "花火~菊(大)[赤]"
		};


		//fw_dual
		$dataTrpParticlePreset["_auto:0:fw_dual/h"] = [4, [[0, 1, 0.11, 1, 0.7, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.3, 1, 0], 1], [[0, 1300, 0.15, 30, 1, 1], 0.5], [[0, "#ddb585", 1, "#ffaf3e"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.05, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 0], 0, 0, "particle9", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_dual_yellow/h"] = [4, [[0, 1, 0.11, 1, 0.7, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.3, 1, 0], 1], [[0, 1300, 0.15, 30, 1, 1], 0.5], [[0, "#dddd85", 1, "#ffcf3e"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.05, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 0], 0, 0, "particle9", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_dual_green/h"] = [4, [[0, 1, 0.11, 1, 0.7, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.3, 1, 0], 1], [[0, 1300, 0.15, 30, 1, 1], 0.5], [[0, "#5fa963", 1, "#54bf67"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.05, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 0], 0, 0, "particle9", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_dual_blue/h"] = [4, [[0, 1, 0.11, 1, 0.7, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.3, 1, 0], 1], [[0, 1300, 0.15, 30, 1, 1], 0.5], [[0, "#5c7bc6", 1, "#243ff6"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.05, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 0], 0, 0, "particle9", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_dual_purple/h"] = [4, [[0, 1, 0.11, 1, 0.7, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.3, 1, 0], 1], [[0, 1300, 0.15, 30, 1, 1], 0.5], [[0, "#6a5adf", 1, "#4e24f6"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.05, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 0], 0, 0, "particle9", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_dual_red/h"] = [4, [[0, 1, 0.11, 1, 0.7, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.3, 1, 0], 1], [[0, 1300, 0.15, 30, 1, 1], 0.5], [[0, "#eb8c8c", 1, "#f66060"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.05, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 0], 0, 0, "particle9", 0, ""]
		$dataTrpParticlePreset["_auto:1:fw_dual/h"] = [4, [[0, 1, 0.11, 1, 0.5, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.25, 1, 0], 1], [[0, 700, 0.13, 20, 1, 10], 0.2], [[0, "#94b976", 1, "#70c847"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.035, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 20], 0, 0, "particle9", 0, ""]
		$dataTrpParticlePreset["_auto:1:fw_dual_yellow/h"] = [4, [[0, 1, 0.11, 1, 0.5, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.25, 1, 0], 1], [[0, 700, 0.13, 20, 1, 10], 0.2], [[0, "#76b9a4", 1, "#4785c8"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.035, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 20], 0, 0, "particle9", 0, ""]
		$dataTrpParticlePreset["_auto:1:fw_dual_green/h"] = [4, [[0, 1, 0.11, 1, 0.5, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.25, 1, 0], 1], [[0, 700, 0.13, 20, 1, 10], 0.2], [[0, "#7696b9", 1, "#4b47c8"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.035, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 20], 0, 0, "particle9", 0, ""]
		$dataTrpParticlePreset["_auto:1:fw_dual_blue/h"] = [4, [[0, 1, 0.11, 1, 0.5, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.25, 1, 0], 1], [[0, 700, 0.13, 20, 1, 10], 0.2], [[0, "#ae67cd", 1, "#9b47c8"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.035, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 20], 0, 0, "particle9", 0, ""]
		$dataTrpParticlePreset["_auto:1:fw_dual_purple/h"] = [4, [[0, 1, 0.11, 1, 0.5, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.25, 1, 0], 1], [[0, 700, 0.13, 20, 1, 10], 0.2], [[0, "#cd8967", 1, "#c88e47"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.035, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 20], 0, 0, "particle9", 0, ""]
		$dataTrpParticlePreset["_auto:1:fw_dual_red/h"] = [4, [[0, 1, 0.11, 1, 0.5, 1, 1, 0]], [[0, 1.2, 0.15, 0.6, 0.7, 0.25, 1, 0], 1], [[0, 700, 0.13, 20, 1, 10], 0.2], [[0, "#cdb967", 1, "#c8b347"]], 1, [0, 0], null, [0, 0], [50, -50], 0, 0, 0, [2, 2], 1, 0.001, 1, 2, 0.035, 10000, [0, 0], 3, [0, -300], [0, 0, 0, 20], 0, 0, "particle9", 0, ""]
		$dataTrpParticleGroupsPreset["fw_dual"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "play _auto:1 target def back"], "targetType": 0,
			"comment": "花火~２色[橙]"
		};
		$dataTrpParticleGroupsPreset["fw_dual_yellow/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "play _auto:1 target def back"], "targetType": 0,
			"comment": "花火~２色[黄]"
		};
		$dataTrpParticleGroupsPreset["fw_dual_green/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "play _auto:1 target def back"], "targetType": 0,
			"comment": "花火~２色[緑]"
		};
		$dataTrpParticleGroupsPreset["fw_dual_blue/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "play _auto:1 target def back"], "targetType": 0,
			"comment": "花火~２色[青]"
		};
		$dataTrpParticleGroupsPreset["fw_dual_purple/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "play _auto:1 target def back"], "targetType": 0,
			"comment": "花火~２色[紫]"
		};
		$dataTrpParticleGroupsPreset["fw_dual_red/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "play _auto:1 target def back"], "targetType": 0,
			"comment": "花火~２色[赤]"
		};


		//fw_simple
		$dataTrpParticlePreset["_auto:0:fw_simple/h"] = [4, [[0, 0, 0.11, 1, 0.4, 1, 1, 0]], [[0, 0.15, 0.15, 0.15, 0.8, 0.08, 1, 0], 0.8], [[0, 1500, 0.12, 200, 0.2, 50, 1, 1], 0.1], [[0, "#fbbb9b", 1, "#f4a84a"]], 1, [0, 0], null, [0, 360], [0, 0], 0, 0, 0, [1.4, 1.6], 1, 0.001, 1, 10, 0.011, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_simple_yellow/h"] = [4, [[0, 0, 0.11, 1, 0.4, 1, 1, 0]], [[0, 0.15, 0.15, 0.15, 0.8, 0.08, 1, 0], 0.8], [[0, 1500, 0.12, 200, 0.2, 50, 1, 1], 0.1], [[0, "#fbe09b", 1, "#f4ca4a"]], 1, [0, 0], null, [0, 360], [0, 0], 0, 0, 0, [1.4, 1.6], 1, 0.001, 1, 10, 0.011, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_simple_green/h"] = [4, [[0, 0, 0.11, 1, 0.4, 1, 1, 0]], [[0, 0.15, 0.15, 0.15, 0.8, 0.08, 1, 0], 0.8], [[0, 1500, 0.12, 200, 0.2, 50, 1, 1], 0.1], [[0, "#6dad78", 1, "#41cb5f"]], 1, [0, 0], null, [0, 360], [0, 0], 0, 0, 0, [1.4, 1.6], 1, 0.001, 1, 10, 0.011, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_simple_blue/h"] = [4, [[0, 0, 0.11, 1, 0.4, 1, 1, 0]], [[0, 0.15, 0.15, 0.15, 0.8, 0.08, 1, 0], 0.8], [[0, 1500, 0.12, 200, 0.2, 50, 1, 1], 0.1], [[0, "#3d7df3", 1, "#5e84eb"]], 1, [0, 0], null, [0, 360], [0, 0], 0, 0, 0, [1.4, 1.6], 1, 0.001, 1, 10, 0.011, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_simple_purple/h"] = [4, [[0, 0, 0.11, 1, 0.4, 1, 1, 0]], [[0, 0.15, 0.15, 0.15, 0.8, 0.08, 1, 0], 0.8], [[0, 1500, 0.12, 200, 0.2, 50, 1, 1], 0.1], [[0, "#996bfa", 1, "#8764fa"]], 1, [0, 0], null, [0, 360], [0, 0], 0, 0, 0, [1.4, 1.6], 1, 0.001, 1, 10, 0.011, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_simple_red/h"] = [4, [[0, 0, 0.11, 1, 0.4, 1, 1, 0]], [[0, 0.15, 0.15, 0.15, 0.8, 0.08, 1, 0], 0.8], [[0, 1500, 0.12, 200, 0.2, 50, 1, 1], 0.1], [[0, "#ed9494", 1, "#fa6464"]], 1, [0, 0], null, [0, 360], [0, 0], 0, 0, 0, [1.4, 1.6], 1, 0.001, 1, 10, 0.011, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticleGroupsPreset["fw_simple"] = {
			"repeat": -1, "list": ["play _auto:0 target def back"], "targetType": 0,
			"comment": "花火~シンプル[橙]"
		};
		$dataTrpParticleGroupsPreset["fw_simple_yellow/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back"], "targetType": 0,
			"comment": "花火~シンプル[黄]"
		};
		$dataTrpParticleGroupsPreset["fw_simple_green/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back"], "targetType": 0,
			"comment": "花火~シンプル[緑]"
		};
		$dataTrpParticleGroupsPreset["fw_simple_blue/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back"], "targetType": 0,
			"comment": "花火~シンプル[青]"
		};
		$dataTrpParticleGroupsPreset["fw_simple_purple/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back"], "targetType": 0,
			"comment": "花火~シンプル[紫]"
		};
		$dataTrpParticleGroupsPreset["fw_simple_red/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back"], "targetType": 0,
			"comment": "花火~シンプル[赤]"
		};


		//fw_change
		$dataTrpParticlePreset["_auto:0:fw_change/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#fa9b46", 1, "#f1de90"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_change_yellow/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#fad646", 1, "#f1e690"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_change_green/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#5da632", 1, "#c7f190"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_change_blue/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#3acdfa", 1, "#3062ed"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_change_purple/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#903afa", 1, "#3059ed"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_change_red/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0.1, 0.15, 0.1, 0.8, 0.05, 1, 0], 0.8], [[0, 1200, 0.1, 200, 0.2, 50, 1, 1], 0.1], [[0, "#fda5a5", 1, "#fa4e2a"]], 1, [0, 0], null, [0, 360], [50, -50], 0, 0, 0, [2, 2], 1, 0.1, 1, 200, 0.11, 10000, [0, 0], 0, [0, -300], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_change/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0, 0.11, 0.15, 0.2, 0.12, 0.8, 0.05, 1, 0], 1], [[0, 10, 1, 0], 0.1], [[0, "#97d6c7", 1, "#398fa9"]], 1, [0, 2], null, [0, 0], [50, -50], 0, 0, 0, [1.5, 1.5], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_change_yellow/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0, 0.11, 0.15, 0.2, 0.12, 0.8, 0.05, 1, 0], 1], [[0, 10, 1, 0], 0.1], [[0, "#9798d6", 1, "#2b4ee6"]], 1, [0, 2], null, [0, 0], [50, -50], 0, 0, 0, [1.5, 1.5], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_change_green/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0, 0.11, 0.15, 0.2, 0.12, 0.8, 0.05, 1, 0], 1], [[0, 10, 1, 0], 0.1], [[0, "#b397d6", 1, "#662be6"]], 1, [0, 2], null, [0, 0], [50, -50], 0, 0, 0, [1.5, 1.5], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_change_blue/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0, 0.11, 0.15, 0.2, 0.12, 0.8, 0.05, 1, 0], 1], [[0, 10, 1, 0], 0.1], [[0, "#edb3b3", 1, "#d1236c"]], 1, [0, 2], null, [0, 0], [50, -50], 0, 0, 0, [1.5, 1.5], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_change_purple/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0, 0.11, 0.15, 0.2, 0.12, 0.8, 0.05, 1, 0], 1], [[0, 10, 1, 0], 0.1], [[0, "#edceb3", 1, "#d17a23"]], 1, [0, 2], null, [0, 0], [50, -50], 0, 0, 0, [1.5, 1.5], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_change_red/h"] = [4, [[0, 0, 0.11, 1, 0.5, 1, 1, 0]], [[0, 0, 0.11, 0.15, 0.2, 0.12, 0.8, 0.05, 1, 0], 1], [[0, 10, 1, 0], 0.1], [[0, "#e0edb3", 1, "#69d123"]], 1, [0, 2], null, [0, 0], [50, -50], 0, 0, 0, [1.5, 1.5], 1, 0.1, 1, 1, 0.11, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flare", 0, ""]
		$dataTrpParticleGroupsPreset["fw_change"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.8 -1 1 1 0 def back"], "targetType": 0,
			"comment": "花火~色変化[橙]"
		};
		$dataTrpParticleGroupsPreset["fw_change_yellow/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.8 -1 1 1 0 def back"], "targetType": 0,
			"comment": "花火~色変化[黄]"
		};
		$dataTrpParticleGroupsPreset["fw_change_green/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.8 -1 1 1 0 def back"], "targetType": 0,
			"comment": "花火~色変化[緑]"
		};
		$dataTrpParticleGroupsPreset["fw_change_blue/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.8 -1 1 1 0 def back"], "targetType": 0,
			"comment": "花火~色変化[青]"
		};
		$dataTrpParticleGroupsPreset["fw_change_purple/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.8 -1 1 1 0 def back"], "targetType": 0,
			"comment": "花火~色変化[紫]"
		};
		$dataTrpParticleGroupsPreset["fw_change_red/h"] = {
			"repeat": -1, "list": ["play _auto:0 target def back", "sub set _auto:0 _sub:0 0.8 -1 1 1 0 def back"], "targetType": 0,
			"comment": "花火~色変化[赤]"
		};

		//fw_kikus
		$dataTrpParticlePreset["_auto:0:fw_kikus/h"] = [4, [[0, 1, 0.6, 1, 1, 0]], [[0, 1.5, 0.11, 1.2, 0.6, 0.3, 1, 0], 1], [[0, 700, 0.11, 150, 0.6, 40, 1, 0], 0.85], [[0, "#ffffff", 1, "#ff683e"]], 1, [0, 5], null, [-225, 45], [50, -50], 10, 0, 0, [0.9, 1.3], 1, 0.001, 1, 1, 0.012, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_kikus_yellow/h"] = [4, [[0, 1, 0.6, 1, 1, 0]], [[0, 1.5, 0.11, 1.2, 0.6, 0.3, 1, 0], 1], [[0, 700, 0.11, 150, 0.6, 40, 1, 0], 0.85], [[0, "#ffffff", 1, "#ffcf3e"]], 1, [0, 5], null, [-225, 45], [50, -50], 10, 0, 0, [0.9, 1.3], 1, 0.001, 1, 1, 0.012, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_kikus_green/h"] = [4, [[0, 1, 0.6, 1, 1, 0]], [[0, 1.5, 0.11, 1.2, 0.6, 0.3, 1, 0], 1], [[0, 700, 0.11, 150, 0.6, 40, 1, 0], 0.85], [[0, "#ffffff", 1, "#92cb91"]], 1, [0, 5], null, [-225, 45], [50, -50], 10, 0, 0, [0.9, 1.3], 1, 0.001, 1, 1, 0.012, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_kikus_blue/h"] = [4, [[0, 1, 0.6, 1, 1, 0]], [[0, 1.5, 0.11, 1.2, 0.6, 0.3, 1, 0], 1], [[0, 700, 0.11, 150, 0.6, 40, 1, 0], 0.85], [[0, "#bccff4", 1, "#5580d4"]], 1, [0, 5], null, [-225, 45], [50, -50], 10, 0, 0, [0.9, 1.3], 1, 0.001, 1, 1, 0.012, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_kikus_purple/h"] = [4, [[0, 1, 0.6, 1, 1, 0]], [[0, 1.5, 0.11, 1.2, 0.6, 0.3, 1, 0], 1], [[0, 700, 0.11, 150, 0.6, 40, 1, 0], 0.85], [[0, "#ccbcf4", 1, "#6855d4"]], 1, [0, 5], null, [-225, 45], [50, -50], 10, 0, 0, [0.9, 1.3], 1, 0.001, 1, 1, 0.012, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_kikus_red/h"] = [4, [[0, 1, 0.6, 1, 1, 0]], [[0, 1.5, 0.11, 1.2, 0.6, 0.3, 1, 0], 1], [[0, 700, 0.11, 150, 0.6, 40, 1, 0], 0.85], [[0, "#f4d1bc", 1, "#d4559b"]], 1, [0, 5], null, [-225, 45], [50, -50], 10, 0, 0, [0.9, 1.3], 1, 0.001, 1, 1, 0.012, 10000, [0, 0], 0, [0, -300], null, 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kikus/h"] = [4, [[0, 1, 1, 0]], [[0, 0.25, 0.5, 0.25, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#f6857f", 1, "#ffffff"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [1.9, 2.3], 1, 0.04, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kikus_yellow/h"] = [4, [[0, 1, 1, 0]], [[0, 0.25, 0.5, 0.25, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#b1a15d", 1, "#ddc96b"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [1.9, 2.3], 1, 0.04, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kikus_green/h"] = [4, [[0, 1, 1, 0]], [[0, 0.25, 0.5, 0.25, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#88cf8b", 1, "#5cbf76"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [1.9, 2.3], 1, 0.04, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kikus_blue/h"] = [4, [[0, 1, 1, 0]], [[0, 0.25, 0.5, 0.25, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#2848bf", 1, "#8589d8"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [1.9, 2.3], 1, 0.04, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kikus_purple/h"] = [4, [[0, 1, 1, 0]], [[0, 0.25, 0.5, 0.25, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#6e4ddd", 1, "#9885d8"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [1.9, 2.3], 1, 0.04, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_kikus_red/h"] = [4, [[0, 1, 1, 0]], [[0, 0.25, 0.5, 0.25, 1, 0], 1], [[0, 0, 1, 0], 1], [[0, "#ea7d7d", 1, "#dfa5c7"]], 0, [0, 0], null, [0, 0], [0, 0], 10, 0, 0, [1.9, 2.3], 1, 0.04, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticleGroupsPreset["fw_kikus"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0.05 0.65 0 1 0"], "targetType": 0,
			"comment": "花火~菊(小)[橙]"
		};
		$dataTrpParticleGroupsPreset["fw_kikus_yellow/h"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0.05 0.65 0 1 0"], "targetType": 0,
			"comment": "花火~菊(小)[黄]"
		};
		$dataTrpParticleGroupsPreset["fw_kikus_green/h"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0.05 0.65 0 1 0"], "targetType": 0,
			"comment": "花火~菊(小)[緑]"
		};
		$dataTrpParticleGroupsPreset["fw_kikus_blue/h"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0.05 0.65 0 1 0"], "targetType": 0,
			"comment": "花火~菊(小)[青]"
		};
		$dataTrpParticleGroupsPreset["fw_kikus_purple/h"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0.05 0.65 0 1 0"], "targetType": 0,
			"comment": "花火~菊(小)[紫]"
		};
		$dataTrpParticleGroupsPreset["fw_kikus_red/h"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0.05 0.65 0 1 0"], "targetType": 0,
			"comment": "花火~菊(小)[赤]"
		};

		//fw_twin
		$dataTrpParticlePreset["_auto:0:fw_twin/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2.5, 0.15, 1, 0.5, 0.1, 1, 0], 1], [[0, 2000, 0.2, 450, 0.5, 100, 1, 10], 0.9], [[0, "#ff9989", 1, "#ffe2ca"]], 0, [0, 0], null, [-120, -110], [50, -50], 0, 0, 0, [1.3, 1.5], 1, 0.01, 1, 2, 0.011, 10000, [0, 0], 4, [0, 0], [20, -100, 0, 0, 0, 0, 0], 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_twin_yellow/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2.5, 0.15, 1, 0.5, 0.1, 1, 0], 1], [[0, 2000, 0.2, 450, 0.5, 100, 1, 10], 0.9], [[0, "#f8dd73", 1, "#ffe2ca"]], 0, [0, 0], null, [-120, -110], [50, -50], 0, 0, 0, [1.3, 1.5], 1, 0.01, 1, 2, 0.011, 10000, [0, 0], 4, [0, 0], [20, -100, 0, 0, 0, 0, 0], 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_twin_green/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2.5, 0.15, 1, 0.5, 0.1, 1, 0], 1], [[0, 2000, 0.2, 450, 0.5, 100, 1, 10], 0.9], [[0, "#48ef49", 1, "#ceffca"]], 0, [0, 0], null, [-120, -110], [50, -50], 0, 0, 0, [1.3, 1.5], 1, 0.01, 1, 2, 0.011, 10000, [0, 0], 4, [0, 0], [20, -100, 0, 0, 0, 0, 0], 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_twin_blue/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2.5, 0.15, 1, 0.5, 0.1, 1, 0], 1], [[0, 2000, 0.2, 450, 0.5, 100, 1, 10], 0.9], [[0, "#739bf8", 1, "#cae5ff"]], 0, [0, 0], null, [-120, -110], [50, -50], 0, 0, 0, [1.3, 1.5], 1, 0.01, 1, 2, 0.011, 10000, [0, 0], 4, [0, 0], [20, -100, 0, 0, 0, 0, 0], 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_twin_purple/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2.5, 0.15, 1, 0.5, 0.1, 1, 0], 1], [[0, 2000, 0.2, 450, 0.5, 100, 1, 10], 0.9], [[0, "#8548ef", 1, "#ddcaff"]], 0, [0, 0], null, [-120, -110], [50, -50], 0, 0, 0, [1.3, 1.5], 1, 0.01, 1, 2, 0.011, 10000, [0, 0], 4, [0, 0], [20, -100, 0, 0, 0, 0, 0], 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_auto:0:fw_twin_red/h"] = [4, [[0, 2, 0.11, 1, 0.5, 1, 1, 0]], [[0, 2.5, 0.15, 1, 0.5, 0.1, 1, 0], 1], [[0, 2000, 0.2, 450, 0.5, 100, 1, 10], 0.9], [[0, "#f69a9a", 1, "#ffcae5"]], 0, [0, 0], null, [-120, -110], [50, -50], 0, 0, 0, [1.3, 1.5], 1, 0.01, 1, 2, 0.011, 10000, [0, 0], 4, [0, 0], [20, -100, 0, 0, 0, 0, 0], 0, 0, "particle8", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_twin/h"] = [4, [[0, 1, 1, 0]], [[0, 0.2, 0.5, 0.2, 1, 0], 1], [[0, 30, 1, 0], 1], [[0, "#f6857f", 1, "#ffffff"]], 0, [0, 4], null, [0, 0], [0, 0], 10, 0, 0, [0.8, 1], 1, 0.005, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_twin_yellow/h"] = [4, [[0, 1, 1, 0]], [[0, 0.2, 0.5, 0.2, 1, 0], 1], [[0, 30, 1, 0], 1], [[0, "#edb350", 1, "#f3d4a0"]], 0, [0, 4], null, [0, 0], [0, 0], 10, 0, 0, [0.8, 1], 1, 0.005, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_twin_green/h"] = [4, [[0, 1, 1, 0]], [[0, 0.2, 0.5, 0.2, 1, 0], 1], [[0, 30, 1, 0], 1], [[0, "#62ed50", 1, "#a8e8b1"]], 0, [0, 4], null, [0, 0], [0, 0], 10, 0, 0, [0.8, 1], 1, 0.005, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_twin_blue/h"] = [4, [[0, 1, 1, 0]], [[0, 0.2, 0.5, 0.2, 1, 0], 1], [[0, 30, 1, 0], 1], [[0, "#4c5ffb", 1, "#c8cffb"]], 0, [0, 4], null, [0, 0], [0, 0], 10, 0, 0, [0.8, 1], 1, 0.005, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_twin_purple/h"] = [4, [[0, 1, 1, 0]], [[0, 0.2, 0.5, 0.2, 1, 0], 1], [[0, 30, 1, 0], 1], [[0, "#7e4cfb", 1, "#d0c8fb"]], 0, [0, 4], null, [0, 0], [0, 0], 10, 0, 0, [0.8, 1], 1, 0.005, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticlePreset["_sub:0:fw_twin_red/h"] = [4, [[0, 1, 1, 0]], [[0, 0.2, 0.5, 0.2, 1, 0], 1], [[0, 30, 1, 0], 1], [[0, "#ff5999", 1, "#ff9b9b"]], 0, [0, 4], null, [0, 0], [0, 0], 10, 0, 0, [0.8, 1], 1, 0.005, 1, 1, -1, 10000, [0, 0], 0, [0, 0], null, 0, 0, "flame1g", 0, ""]
		$dataTrpParticleGroupsPreset["fw_twin"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0 0.5 0 1 0"], "targetType": 0,
			"comment": "花火~V字噴出[橙]"
		};
		$dataTrpParticleGroupsPreset["fw_twin_yellow/h"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0 0.5 0 1 0"], "targetType": 0,
			"comment": "花火~V字噴出[黄]"
		};
		$dataTrpParticleGroupsPreset["fw_twin_green/h"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0 0.5 0 1 0"], "targetType": 0,
			"comment": "花火~V字噴出[緑]"
		};
		$dataTrpParticleGroupsPreset["fw_twin_blue/h"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0 0.5 0 1 0"], "targetType": 0,
			"comment": "花火~V字噴出[青]"
		};
		$dataTrpParticleGroupsPreset["fw_twin_purple/h"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0 0.5 0 1 0"], "targetType": 0,
			"comment": "花火~V字噴出[紫]"
		};
		$dataTrpParticleGroupsPreset["fw_twin_red/h"] = {
			"repeat": -1, "list": ["set _auto:0 target def back", "sub set _auto:0 _sub:0 0 0.5 0 1 0"], "targetType": 0,
			"comment": "花火~V字噴出[赤]"
		};
	})();


	//PRAGMA: SRC

	var $dataTrpParticlePreset = $dataTrpParticlePreset || null;
	var $dataTrpParticles = null;
	(function () {
		//PRAGMA: pluginName
		var pluginName = 'TRP_Particle';
		//PRAGMA_END: pluginName
		if (PluginManager.parameters(pluginName).importLibrary !== 'true') return;

		/*!
		 * pixi-particles - v4.3.0
		 * Compiled Fri, 18 Sep 2020 13:47:54 UTC
		 *
		 * pixi-particles is licensed under the MIT License.
		 * http://www.opensource.org/licenses/mit-license
		 */
		this.PIXI = this.PIXI || {}, function (t, i) { "use strict"; var e, s = function () { function i(i, e, s) { this.value = i, this.time = e, this.next = null, this.isStepped = !1, this.ease = s ? "function" == typeof s ? s : t.ParticleUtils.generateEase(s) : null } return i.createList = function (e) { if ("list" in e) { var s = e.list, r = void 0, n = s[0], a = n.value, h = n.time, o = r = new i("string" == typeof a ? t.ParticleUtils.hexToRGB(a) : a, h, e.ease); if (s.length > 2 || 2 === s.length && s[1].value !== a) for (var l = 1; l < s.length; ++l) { var p = s[l], d = p.value, c = p.time; r.next = new i("string" == typeof d ? t.ParticleUtils.hexToRGB(d) : d, c), r = r.next } return o.isStepped = !!e.isStepped, o } var u = new i("string" == typeof e.start ? t.ParticleUtils.hexToRGB(e.start) : e.start, 0); return e.end !== e.start && (u.next = new i("string" == typeof e.end ? t.ParticleUtils.hexToRGB(e.end) : e.end, 1)), u }, i }(), r = i; function n(t) { return e(t) } e = parseInt(/^(\d+)\./.exec(i.VERSION)[1], 10) < 5 ? r.Texture.fromImage : r.Texture.from, function (t) { t.verbose = !1, t.DEG_TO_RADS = Math.PI / 180, t.rotatePoint = function (i, e) { if (i) { i *= t.DEG_TO_RADS; var s = Math.sin(i), r = Math.cos(i), n = e.x * r - e.y * s, a = e.x * s + e.y * r; e.x = n, e.y = a } }, t.combineRGBComponents = function (t, i, e) { return t << 16 | i << 8 | e }, t.normalize = function (i) { var e = 1 / t.length(i); i.x *= e, i.y *= e }, t.scaleBy = function (t, i) { t.x *= i, t.y *= i }, t.length = function (t) { return Math.sqrt(t.x * t.x + t.y * t.y) }, t.hexToRGB = function (t, i) { var e; return i || (i = {}), "#" === t.charAt(0) ? t = t.substr(1) : 0 === t.indexOf("0x") && (t = t.substr(2)), 8 === t.length && (e = t.substr(0, 2), t = t.substr(2)), i.r = parseInt(t.substr(0, 2), 16), i.g = parseInt(t.substr(2, 2), 16), i.b = parseInt(t.substr(4, 2), 16), e && (i.a = parseInt(e, 16)), i }, t.generateEase = function (t) { var i = t.length, e = 1 / i; return function (s) { var r = i * s | 0, n = (s - r * e) * i, a = t[r] || t[i - 1]; return a.s + n * (2 * (1 - n) * (a.cp - a.s) + n * (a.e - a.s)) } }, t.getBlendMode = function (t) { if (!t) return i.BLEND_MODES.NORMAL; for (t = t.toUpperCase(); t.indexOf(" ") >= 0;)t = t.replace(" ", "_"); return i.BLEND_MODES[t] || i.BLEND_MODES.NORMAL }, t.createSteppedGradient = function (i, e) { void 0 === e && (e = 10), ("number" != typeof e || e <= 0) && (e = 10); var r = new s(t.hexToRGB(i[0].value), i[0].time); r.isStepped = !0; for (var n = r, a = i[0], h = 1, o = i[h], l = 1; l < e; ++l) { for (var p = l / e; p > o.time;)a = o, o = i[++h]; p = (p - a.time) / (o.time - a.time); var d = t.hexToRGB(a.value), c = t.hexToRGB(o.value), u = { r: (c.r - d.r) * p + d.r, g: (c.g - d.g) * p + d.g, b: (c.b - d.b) * p + d.b }; n.next = new s(u, l / e), n = n.next } return r } }(t.ParticleUtils || (t.ParticleUtils = {})); var a = function (t, i) { return (a = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, i) { t.__proto__ = i } || function (t, i) { for (var e in i) i.hasOwnProperty(e) && (t[e] = i[e]) })(t, i) }; function h(t, i) { function e() { this.constructor = t } a(t, i), t.prototype = null === i ? Object.create(i) : (e.prototype = i.prototype, new e) } function o(t) { return this.ease && (t = this.ease(t)), (this.next.value - this.current.value) * t + this.current.value } function l(i) { this.ease && (i = this.ease(i)); var e = this.current.value, s = this.next.value, r = (s.r - e.r) * i + e.r, n = (s.g - e.g) * i + e.g, a = (s.b - e.b) * i + e.b; return t.ParticleUtils.combineRGBComponents(r, n, a) } function p(t) { for (this.ease && (t = this.ease(t)); t > this.next.time;)this.current = this.next, this.next = this.next.next; return t = (t - this.current.time) / (this.next.time - this.current.time), (this.next.value - this.current.value) * t + this.current.value } function d(i) { for (this.ease && (i = this.ease(i)); i > this.next.time;)this.current = this.next, this.next = this.next.next; i = (i - this.current.time) / (this.next.time - this.current.time); var e = this.current.value, s = this.next.value, r = (s.r - e.r) * i + e.r, n = (s.g - e.g) * i + e.g, a = (s.b - e.b) * i + e.b; return t.ParticleUtils.combineRGBComponents(r, n, a) } function c(t) { for (this.ease && (t = this.ease(t)); this.next && t > this.next.time;)this.current = this.next, this.next = this.next.next; return this.current.value } function u(i) { for (this.ease && (i = this.ease(i)); this.next && i > this.next.time;)this.current = this.next, this.next = this.next.next; var e = this.current.value; return t.ParticleUtils.combineRGBComponents(e.r, e.g, e.b) } var m, f = function () { function t(t) { void 0 === t && (t = !1), this.current = null, this.next = null, this.isColor = !!t, this.interpolate = null, this.ease = null } return t.prototype.reset = function (t) { this.current = t, this.next = t.next, this.next && this.next.time >= 1 ? this.interpolate = this.isColor ? l : o : t.isStepped ? this.interpolate = this.isColor ? u : c : this.interpolate = this.isColor ? d : p, this.ease = this.current.ease }, t }(), _ = function (e) { function s(t) { var r = e.call(this) || this; return r.prevChild = r.nextChild = null, r.emitter = t, r.anchor.x = r.anchor.y = .5, r.velocity = new i.Point, r.rotationSpeed = 0, r.rotationAcceleration = 0, r.maxLife = 0, r.age = 0, r.ease = null, r.extraData = null, r.alphaList = new f, r.speedList = new f, r.speedMultiplier = 1, r.acceleration = new i.Point, r.maxSpeed = NaN, r.scaleList = new f, r.scaleMultiplier = 1, r.colorList = new f(!0), r._doAlpha = !1, r._doScale = !1, r._doSpeed = !1, r._doAcceleration = !1, r._doColor = !1, r._doNormalMovement = !1, r._oneOverLife = 0, r.next = null, r.prev = null, r.init = r.init, r.Particle_init = s.prototype.init, r.update = r.update, r.Particle_update = s.prototype.update, r.Sprite_destroy = e.prototype.destroy, r.Particle_destroy = s.prototype.destroy, r.applyArt = r.applyArt, r.kill = r.kill, r } return h(s, e), s.prototype.init = function () { this.age = 0, this.velocity.x = this.speedList.current.value * this.speedMultiplier, this.velocity.y = 0, t.ParticleUtils.rotatePoint(this.rotation, this.velocity), this.noRotation ? this.rotation = 0 : this.rotation *= t.ParticleUtils.DEG_TO_RADS, this.rotationSpeed *= t.ParticleUtils.DEG_TO_RADS, this.rotationAcceleration *= t.ParticleUtils.DEG_TO_RADS, this.alpha = this.alphaList.current.value, this.scale.x = this.scale.y = this.scaleList.current.value, this._doAlpha = !!this.alphaList.current.next, this._doSpeed = !!this.speedList.current.next, this._doScale = !!this.scaleList.current.next, this._doColor = !!this.colorList.current.next, this._doAcceleration = 0 !== this.acceleration.x || 0 !== this.acceleration.y, this._doNormalMovement = this._doSpeed || 0 !== this.speedList.current.value || this._doAcceleration, this._oneOverLife = 1 / this.maxLife; var i = this.colorList.current.value; this.tint = t.ParticleUtils.combineRGBComponents(i.r, i.g, i.b), this.visible = !0 }, s.prototype.applyArt = function (t) { this.texture = t || i.Texture.EMPTY }, s.prototype.update = function (i) { if (this.age += i, this.age >= this.maxLife || this.age < 0) return this.kill(), -1; var e = this.age * this._oneOverLife; if (this.ease && (e = 4 === this.ease.length ? this.ease(e, 0, 1, 1) : this.ease(e)), this._doAlpha && (this.alpha = this.alphaList.interpolate(e)), this._doScale) { var s = this.scaleList.interpolate(e) * this.scaleMultiplier; this.scale.x = this.scale.y = s } if (this._doNormalMovement) { var r = void 0, n = void 0; if (this._doSpeed) { var a = this.speedList.interpolate(e) * this.speedMultiplier; t.ParticleUtils.normalize(this.velocity), t.ParticleUtils.scaleBy(this.velocity, a), r = this.velocity.x * i, n = this.velocity.y * i } else if (this._doAcceleration) { var h = this.velocity.x, o = this.velocity.y; if (this.velocity.x += this.acceleration.x * i, this.velocity.y += this.acceleration.y * i, this.maxSpeed) { var l = t.ParticleUtils.length(this.velocity); l > this.maxSpeed && t.ParticleUtils.scaleBy(this.velocity, this.maxSpeed / l) } r = (h + this.velocity.x) / 2 * i, n = (o + this.velocity.y) / 2 * i } else r = this.velocity.x * i, n = this.velocity.y * i; this.position.x += r, this.position.y += n } if (this._doColor && (this.tint = this.colorList.interpolate(e)), 0 !== this.rotationAcceleration) { var p = this.rotationSpeed + this.rotationAcceleration * i; this.rotation += (this.rotationSpeed + p) / 2 * i, this.rotationSpeed = p } else 0 !== this.rotationSpeed ? this.rotation += this.rotationSpeed * i : this.acceleration && !this.noRotation && (this.rotation = Math.atan2(this.velocity.y, this.velocity.x)); return e }, s.prototype.kill = function () { this.emitter.recycle(this) }, s.prototype.destroy = function () { this.parent && this.parent.removeChild(this), this.Sprite_destroy(), this.emitter = this.velocity = this.colorList = this.scaleList = this.alphaList = this.speedList = this.ease = this.next = this.prev = null }, s.parseArt = function (i) { var e; for (e = i.length; e >= 0; --e)"string" == typeof i[e] && (i[e] = n(i[e])); if (t.ParticleUtils.verbose) for (e = i.length - 1; e > 0; --e)if (i[e].baseTexture !== i[e - 1].baseTexture) { window.console && console.warn("PixiParticles: using particle textures from different images may hinder performance in WebGL"); break } return i }, s.parseData = function (t) { return t }, s }(i.Sprite), C = function () { function t(t) { this.segments = [], this.countingLengths = [], this.totalLength = 0, this.init(t) } return t.prototype.init = function (t) { if (t && t.length) if (Array.isArray(t[0])) for (var i = 0; i < t.length; ++i)for (var e = t[i], s = e[0], r = 1; r < e.length; ++r) { var n = e[r]; this.segments.push({ p1: s, p2: n, l: 0 }), s = n } else for (s = t[0], i = 1; i < t.length; ++i) { n = t[i]; this.segments.push({ p1: s, p2: n, l: 0 }), s = n } else this.segments.push({ p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 }, l: 0 }); for (i = 0; i < this.segments.length; ++i) { var a = this.segments[i], h = a.p1, o = a.p2, l = Math.sqrt((o.x - h.x) * (o.x - h.x) + (o.y - h.y) * (o.y - h.y)); this.segments[i].l = l, this.totalLength += l, this.countingLengths.push(this.totalLength) } }, t.prototype.getRandomPoint = function (t) { var i, e, s = Math.random() * this.totalLength; if (1 === this.segments.length) i = this.segments[0], e = s; else for (var r = 0; r < this.countingLengths.length; ++r)if (s < this.countingLengths[r]) { i = this.segments[r], e = 0 === r ? s : s - this.countingLengths[r - 1]; break } e /= i.l || 1; var n = i.p1, a = i.p2; t.x = n.x + e * (a.x - n.x), t.y = n.y + e * (a.y - n.y) }, t }(), v = i; m = parseInt(/^(\d+)\./.exec(i.VERSION)[1], 10) < 5 ? v.ticker.shared : v.Ticker.shared; var x = new i.Point, y = function () { function e(t, i, e) { this._currentImageIndex = -1, this._particleConstructor = _, this.particleImages = null, this.startAlpha = null, this.startSpeed = null, this.minimumSpeedMultiplier = 1, this.acceleration = null, this.maxSpeed = NaN, this.startScale = null, this.minimumScaleMultiplier = 1, this.startColor = null, this.minLifetime = 0, this.maxLifetime = 0, this.minStartRotation = 0, this.maxStartRotation = 0, this.noRotation = !1, this.minRotationSpeed = 0, this.maxRotationSpeed = 0, this.particleBlendMode = 0, this.customEase = null, this.extraData = null, this._frequency = 1, this.spawnChance = 1, this.maxParticles = 1e3, this.emitterLifetime = -1, this.spawnPos = null, this.spawnType = null, this._spawnFunc = null, this.spawnRect = null, this.spawnCircle = null, this.spawnPolygonalChain = null, this.particlesPerWave = 1, this.particleSpacing = 0, this.angleStart = 0, this.rotation = 0, this.ownerPos = null, this._prevEmitterPos = null, this._prevPosIsValid = !1, this._posChanged = !1, this._parent = null, this.addAtBack = !1, this.particleCount = 0, this._emit = !1, this._spawnTimer = 0, this._emitterLife = -1, this._activeParticlesFirst = null, this._activeParticlesLast = null, this._poolFirst = null, this._origConfig = null, this._origArt = null, this._autoUpdate = !1, this._currentImageIndex = -1, this._destroyWhenComplete = !1, this._completeCallback = null, this.parent = t, i && e && this.init(i, e), this.recycle = this.recycle, this.update = this.update, this.rotate = this.rotate, this.updateSpawnPos = this.updateSpawnPos, this.updateOwnerPos = this.updateOwnerPos } return Object.defineProperty(e.prototype, "orderedArt", { get: function () { return -1 !== this._currentImageIndex }, set: function (t) { this._currentImageIndex = t ? 0 : -1 }, enumerable: !0, configurable: !0 }), Object.defineProperty(e.prototype, "frequency", { get: function () { return this._frequency }, set: function (t) { this._frequency = "number" == typeof t && t > 0 ? t : 1 }, enumerable: !0, configurable: !0 }), Object.defineProperty(e.prototype, "particleConstructor", { get: function () { return this._particleConstructor }, set: function (t) { if (t !== this._particleConstructor) { this._particleConstructor = t, this.cleanup(); for (var i = this._poolFirst; i; i = i.next)i.destroy(); this._poolFirst = null, this._origConfig && this._origArt && this.init(this._origArt, this._origConfig) } }, enumerable: !0, configurable: !0 }), Object.defineProperty(e.prototype, "parent", { get: function () { return this._parent }, set: function (t) { this.cleanup(), this._parent = t }, enumerable: !0, configurable: !0 }), e.prototype.init = function (e, r) { if (e && r) { this.cleanup(), this._origConfig = r, this._origArt = e, e = Array.isArray(e) ? e.slice() : [e]; var n = this._particleConstructor; this.particleImages = n.parseArt ? n.parseArt(e) : e, r.alpha ? this.startAlpha = s.createList(r.alpha) : this.startAlpha = new s(1, 0), r.speed ? (this.startSpeed = s.createList(r.speed), this.minimumSpeedMultiplier = ("minimumSpeedMultiplier" in r ? r.minimumSpeedMultiplier : r.speed.minimumSpeedMultiplier) || 1) : (this.minimumSpeedMultiplier = 1, this.startSpeed = new s(0, 0)); var a = r.acceleration; a && (a.x || a.y) ? (this.startSpeed.next = null, this.acceleration = new i.Point(a.x, a.y), this.maxSpeed = r.maxSpeed || NaN) : this.acceleration = new i.Point, r.scale ? (this.startScale = s.createList(r.scale), this.minimumScaleMultiplier = ("minimumScaleMultiplier" in r ? r.minimumScaleMultiplier : r.scale.minimumScaleMultiplier) || 1) : (this.startScale = new s(1, 0), this.minimumScaleMultiplier = 1), r.color ? this.startColor = s.createList(r.color) : this.startColor = new s({ r: 255, g: 255, b: 255 }, 0), r.startRotation ? (this.minStartRotation = r.startRotation.min, this.maxStartRotation = r.startRotation.max) : this.minStartRotation = this.maxStartRotation = 0, r.noRotation && (this.minStartRotation || this.maxStartRotation) ? this.noRotation = !!r.noRotation : this.noRotation = !1, r.rotationSpeed ? (this.minRotationSpeed = r.rotationSpeed.min, this.maxRotationSpeed = r.rotationSpeed.max) : this.minRotationSpeed = this.maxRotationSpeed = 0, this.rotationAcceleration = r.rotationAcceleration || 0, this.minLifetime = r.lifetime.min, this.maxLifetime = r.lifetime.max, this.particleBlendMode = t.ParticleUtils.getBlendMode(r.blendMode), r.ease ? this.customEase = "function" == typeof r.ease ? r.ease : t.ParticleUtils.generateEase(r.ease) : this.customEase = null, n.parseData ? this.extraData = n.parseData(r.extraData) : this.extraData = r.extraData || null, this.spawnRect = this.spawnCircle = null, this.particlesPerWave = 1, r.particlesPerWave && r.particlesPerWave > 1 && (this.particlesPerWave = r.particlesPerWave), this.particleSpacing = 0, this.angleStart = 0, this.parseSpawnType(r), this.frequency = r.frequency, this.spawnChance = "number" == typeof r.spawnChance && r.spawnChance > 0 ? r.spawnChance : 1, this.emitterLifetime = r.emitterLifetime || -1, this.maxParticles = r.maxParticles > 0 ? r.maxParticles : 1e3, this.addAtBack = !!r.addAtBack, this.rotation = 0, this.ownerPos = new i.Point, this.spawnPos = new i.Point(r.pos.x, r.pos.y), this.initAdditional(e, r), this._prevEmitterPos = this.spawnPos.clone(), this._prevPosIsValid = !1, this._spawnTimer = 0, this.emit = void 0 === r.emit || !!r.emit, this.autoUpdate = !!r.autoUpdate, this.orderedArt = !!r.orderedArt } }, e.prototype.initAdditional = function (t, i) { }, e.prototype.parseSpawnType = function (t) { var e; switch (t.spawnType) { case "rect": this.spawnType = "rect", this._spawnFunc = this._spawnRect; var s = t.spawnRect; this.spawnRect = new i.Rectangle(s.x, s.y, s.w, s.h); break; case "circle": this.spawnType = "circle", this._spawnFunc = this._spawnCircle, e = t.spawnCircle, this.spawnCircle = new i.Circle(e.x, e.y, e.r); break; case "ring": this.spawnType = "ring", this._spawnFunc = this._spawnRing, e = t.spawnCircle, this.spawnCircle = new i.Circle(e.x, e.y, e.r), this.spawnCircle.minRadius = e.minR; break; case "burst": this.spawnType = "burst", this._spawnFunc = this._spawnBurst, this.particleSpacing = t.particleSpacing, this.angleStart = t.angleStart ? t.angleStart : 0; break; case "point": this.spawnType = "point", this._spawnFunc = this._spawnPoint; break; case "polygonalChain": this.spawnType = "polygonalChain", this._spawnFunc = this._spawnPolygonalChain, this.spawnPolygonalChain = new C(t.spawnPolygon); break; default: this.spawnType = "point", this._spawnFunc = this._spawnPoint } }, e.prototype.recycle = function (t) { t.next && (t.next.prev = t.prev), t.prev && (t.prev.next = t.next), t === this._activeParticlesLast && (this._activeParticlesLast = t.prev), t === this._activeParticlesFirst && (this._activeParticlesFirst = t.next), t.prev = null, t.next = this._poolFirst, this._poolFirst = t, t.parent && t.parent.removeChild(t), --this.particleCount }, e.prototype.rotate = function (i) { if (this.rotation !== i) { var e = i - this.rotation; this.rotation = i, t.ParticleUtils.rotatePoint(e, this.spawnPos), this._posChanged = !0 } }, e.prototype.updateSpawnPos = function (t, i) { this._posChanged = !0, this.spawnPos.x = t, this.spawnPos.y = i }, e.prototype.updateOwnerPos = function (t, i) { this._posChanged = !0, this.ownerPos.x = t, this.ownerPos.y = i }, e.prototype.resetPositionTracking = function () { this._prevPosIsValid = !1 }, Object.defineProperty(e.prototype, "emit", { get: function () { return this._emit }, set: function (t) { this._emit = !!t, this._emitterLife = this.emitterLifetime }, enumerable: !0, configurable: !0 }), Object.defineProperty(e.prototype, "autoUpdate", { get: function () { return this._autoUpdate }, set: function (t) { this._autoUpdate && !t ? m.remove(this.update, this) : !this._autoUpdate && t && m.add(this.update, this), this._autoUpdate = !!t }, enumerable: !0, configurable: !0 }), e.prototype.playOnceAndDestroy = function (t) { this.autoUpdate = !0, this.emit = !0, this._destroyWhenComplete = !0, this._completeCallback = t }, e.prototype.playOnce = function (t) { this.emit = !0, this._completeCallback = t }, e.prototype.update = function (t) { if (this._autoUpdate && (t = t / i.settings.TARGET_FPMS / 1e3), this._parent) { var e, s, r, n, a; for (s = this._activeParticlesFirst; s; s = r)r = s.next, s.update(t); this._prevPosIsValid && (n = this._prevEmitterPos.x, a = this._prevEmitterPos.y); var h = this.ownerPos.x + this.spawnPos.x, o = this.ownerPos.y + this.spawnPos.y; if (this._emit) for (this._spawnTimer -= t < 0 ? 0 : t; this._spawnTimer <= 0;) { if (this._emitterLife >= 0 && (this._emitterLife -= this._frequency, this._emitterLife <= 0)) { this._spawnTimer = 0, this._emitterLife = 0, this.emit = !1; break } if (this.particleCount >= this.maxParticles) this._spawnTimer += this._frequency; else { var l = void 0; if (l = this.minLifetime === this.maxLifetime ? this.minLifetime : Math.random() * (this.maxLifetime - this.minLifetime) + this.minLifetime, -this._spawnTimer < l) { var p = void 0, d = void 0; if (this._prevPosIsValid && this._posChanged) { var c = 1 + this._spawnTimer / t; p = (h - n) * c + n, d = (o - a) * c + a } else p = h, d = o; e = 0; for (var u = Math.min(this.particlesPerWave, this.maxParticles - this.particleCount); e < u; ++e)if (!(this.spawnChance < 1 && Math.random() >= this.spawnChance)) { var m = void 0; this._poolFirst ? (m = this._poolFirst, this._poolFirst = this._poolFirst.next, m.next = null) : m = new this.particleConstructor(this), this.particleImages.length > 1 ? -1 !== this._currentImageIndex ? (m.applyArt(this.particleImages[this._currentImageIndex++]), (this._currentImageIndex < 0 || this._currentImageIndex >= this.particleImages.length) && (this._currentImageIndex = 0)) : m.applyArt(this.particleImages[Math.floor(Math.random() * this.particleImages.length)]) : m.applyArt(this.particleImages[0]), m.alphaList.reset(this.startAlpha), 1 !== this.minimumSpeedMultiplier && (m.speedMultiplier = Math.random() * (1 - this.minimumSpeedMultiplier) + this.minimumSpeedMultiplier), m.speedList.reset(this.startSpeed), m.acceleration.x = this.acceleration.x, m.acceleration.y = this.acceleration.y, m.maxSpeed = this.maxSpeed, 1 !== this.minimumScaleMultiplier && (m.scaleMultiplier = Math.random() * (1 - this.minimumScaleMultiplier) + this.minimumScaleMultiplier), m.scaleList.reset(this.startScale), m.colorList.reset(this.startColor), this.minRotationSpeed === this.maxRotationSpeed ? m.rotationSpeed = this.minRotationSpeed : m.rotationSpeed = Math.random() * (this.maxRotationSpeed - this.minRotationSpeed) + this.minRotationSpeed, m.rotationAcceleration = this.rotationAcceleration, m.noRotation = this.noRotation, m.maxLife = l, m.blendMode = this.particleBlendMode, m.ease = this.customEase, m.extraData = this.extraData, this.applyAdditionalProperties(m), this._spawnFunc(m, p, d, e), m.init(), this.addAtBack ? this._parent.addChildAt(m, 0) : this._parent.addChild(m), this._activeParticlesLast ? (this._activeParticlesLast.next = m, m.prev = this._activeParticlesLast, this._activeParticlesLast = m) : this._activeParticlesLast = this._activeParticlesFirst = m, ++this.particleCount, m.update(-this._spawnTimer) } } this._spawnTimer += this._frequency } } if (this._posChanged && (this._prevEmitterPos.x = h, this._prevEmitterPos.y = o, this._prevPosIsValid = !0, this._posChanged = !1), !this._emit && !this._activeParticlesFirst) { if (this._completeCallback) { var f = this._completeCallback; this._completeCallback = null, f() } this._destroyWhenComplete && this.destroy() } } }, e.prototype.applyAdditionalProperties = function (t) { }, e.prototype._spawnPoint = function (t, i, e) { this.minStartRotation === this.maxStartRotation ? t.rotation = this.minStartRotation + this.rotation : t.rotation = Math.random() * (this.maxStartRotation - this.minStartRotation) + this.minStartRotation + this.rotation, t.position.x = i, t.position.y = e }, e.prototype._spawnRect = function (i, e, s) { this.minStartRotation === this.maxStartRotation ? i.rotation = this.minStartRotation + this.rotation : i.rotation = Math.random() * (this.maxStartRotation - this.minStartRotation) + this.minStartRotation + this.rotation, x.x = Math.random() * this.spawnRect.width + this.spawnRect.x, x.y = Math.random() * this.spawnRect.height + this.spawnRect.y, 0 !== this.rotation && t.ParticleUtils.rotatePoint(this.rotation, x), i.position.x = e + x.x, i.position.y = s + x.y }, e.prototype._spawnCircle = function (i, e, s) { this.minStartRotation === this.maxStartRotation ? i.rotation = this.minStartRotation + this.rotation : i.rotation = Math.random() * (this.maxStartRotation - this.minStartRotation) + this.minStartRotation + this.rotation, x.x = Math.random() * this.spawnCircle.radius, x.y = 0, t.ParticleUtils.rotatePoint(360 * Math.random(), x), x.x += this.spawnCircle.x, x.y += this.spawnCircle.y, 0 !== this.rotation && t.ParticleUtils.rotatePoint(this.rotation, x), i.position.x = e + x.x, i.position.y = s + x.y }, e.prototype._spawnRing = function (i, e, s) { var r = this.spawnCircle; this.minStartRotation === this.maxStartRotation ? i.rotation = this.minStartRotation + this.rotation : i.rotation = Math.random() * (this.maxStartRotation - this.minStartRotation) + this.minStartRotation + this.rotation, r.minRadius !== r.radius ? x.x = Math.random() * (r.radius - r.minRadius) + r.minRadius : x.x = r.radius, x.y = 0; var n = 360 * Math.random(); i.rotation += n, t.ParticleUtils.rotatePoint(n, x), x.x += this.spawnCircle.x, x.y += this.spawnCircle.y, 0 !== this.rotation && t.ParticleUtils.rotatePoint(this.rotation, x), i.position.x = e + x.x, i.position.y = s + x.y }, e.prototype._spawnPolygonalChain = function (i, e, s) { this.minStartRotation === this.maxStartRotation ? i.rotation = this.minStartRotation + this.rotation : i.rotation = Math.random() * (this.maxStartRotation - this.minStartRotation) + this.minStartRotation + this.rotation, this.spawnPolygonalChain.getRandomPoint(x), 0 !== this.rotation && t.ParticleUtils.rotatePoint(this.rotation, x), i.position.x = e + x.x, i.position.y = s + x.y }, e.prototype._spawnBurst = function (t, i, e, s) { 0 === this.particleSpacing ? t.rotation = 360 * Math.random() : t.rotation = this.angleStart + this.particleSpacing * s + this.rotation, t.position.x = i, t.position.y = e }, e.prototype.cleanup = function () { var t, i; for (t = this._activeParticlesFirst; t; t = i)i = t.next, this.recycle(t), t.parent && t.parent.removeChild(t); this._activeParticlesFirst = this._activeParticlesLast = null, this.particleCount = 0 }, e.prototype.destroy = function () { var t; this.autoUpdate = !1, this.cleanup(); for (var i = this._poolFirst; i; i = t)t = i.next, i.destroy(); this._poolFirst = this._parent = this.particleImages = this.spawnPos = this.ownerPos = this.startColor = this.startScale = this.startAlpha = this.startSpeed = this.customEase = this._completeCallback = null }, e }(), g = new i.Point, P = ["pow", "sqrt", "abs", "floor", "round", "ceil", "E", "PI", "sin", "cos", "tan", "asin", "acos", "atan", "atan2", "log"], w = new RegExp(["[01234567890\\.\\*\\-\\+\\/\\(\\)x ,]"].concat(P).join("|"), "g"); var b = function (e) { function s(t) { var s = e.call(this, t) || this; return s.path = null, s.initialRotation = 0, s.initialPosition = new i.Point, s.movement = 0, s } return h(s, e), s.prototype.init = function () { this.initialRotation = this.rotation, this.Particle_init(), this.path = this.extraData.path, this._doNormalMovement = !this.path, this.movement = 0, this.initialPosition.x = this.position.x, this.initialPosition.y = this.position.y }, s.prototype.update = function (i) { var e = this.Particle_update(i); if (e >= 0 && this.path) { if (this._doSpeed) { var s = this.speedList.interpolate(e) * this.speedMultiplier; this.movement += s * i } else { s = this.speedList.current.value * this.speedMultiplier; this.movement += s * i } g.x = this.movement, g.y = this.path(this.movement), t.ParticleUtils.rotatePoint(this.initialRotation, g), this.position.x = this.initialPosition.x + g.x, this.position.y = this.initialPosition.y + g.y } return e }, s.prototype.destroy = function () { this.Particle_destroy(), this.path = this.initialPosition = null }, s.parseArt = function (t) { return _.parseArt(t) }, s.parseData = function (i) { var e = {}; if (i && i.path) try { e.path = function (t) { for (var i = t.match(w), e = i.length - 1; e >= 0; --e)P.indexOf(i[e]) >= 0 && (i[e] = "Math." + i[e]); return t = i.join(""), new Function("x", "return " + t + ";") }(i.path) } catch (i) { t.ParticleUtils.verbose && console.error("PathParticle: error in parsing path expression"), e.path = null } else t.ParticleUtils.verbose && console.error("PathParticle requires a path string in extraData!"), e.path = null; return e }, s }(_), S = function (t) { function e(i) { var e = t.call(this, i) || this; return e.textures = null, e.duration = 0, e.framerate = 0, e.elapsed = 0, e.loop = !1, e } return h(e, t), e.prototype.init = function () { this.Particle_init(), this.elapsed = 0, this.framerate < 0 && (this.duration = this.maxLife, this.framerate = this.textures.length / this.duration) }, e.prototype.applyArt = function (t) { this.textures = t.textures, this.framerate = t.framerate, this.duration = t.duration, this.loop = t.loop }, e.prototype.update = function (t) { var e = this.Particle_update(t); if (e >= 0) { this.elapsed += t, this.elapsed > this.duration && (this.loop ? this.elapsed = this.elapsed % this.duration : this.elapsed = this.duration - 1e-6); var s = this.elapsed * this.framerate + 1e-7 | 0; this.texture = this.textures[s] || i.Texture.EMPTY } return e }, e.prototype.destroy = function () { this.Particle_destroy(), this.textures = null }, e.parseArt = function (t) { for (var e = [], s = 0; s < t.length; ++s) { for (var r = t[s], a = e[s] = {}, h = a.textures = [], o = r.textures, l = 0; l < o.length; ++l) { var p = o[l]; if ("string" == typeof p) h.push(n(p)); else if (p instanceof i.Texture) h.push(p); else { var d = p.count || 1; for (p = "string" == typeof p.texture ? n(p.texture) : p.texture; d > 0; --d)h.push(p) } } "matchLife" === r.framerate ? (a.framerate = -1, a.duration = 0, a.loop = !1) : (a.loop = !!r.loop, a.framerate = r.framerate > 0 ? r.framerate : 60, a.duration = h.length / a.framerate) } return e }, e }(_), R = function (t) { function e() { var i = null !== t && t.apply(this, arguments) || this; return i._firstChild = null, i._lastChild = null, i._childCount = 0, i } return h(e, t), Object.defineProperty(e.prototype, "firstChild", { get: function () { return this._firstChild }, enumerable: !0, configurable: !0 }), Object.defineProperty(e.prototype, "lastChild", { get: function () { return this._lastChild }, enumerable: !0, configurable: !0 }), Object.defineProperty(e.prototype, "childCount", { get: function () { return this._childCount }, enumerable: !0, configurable: !0 }), e.prototype.addChild = function () { for (var t = [], i = 0; i < arguments.length; i++)t[i] = arguments[i]; if (t.length > 1) for (var e = 0; e < t.length; e++)this.addChild(t[e]); else { var s = t[0]; s.parent && s.parent.removeChild(s), s.parent = this, this.sortDirty = !0, s.transform._parentID = -1, this._lastChild ? (this._lastChild.nextChild = s, s.prevChild = this._lastChild, this._lastChild = s) : this._firstChild = this._lastChild = s, ++this._childCount, this._boundsID++, this.onChildrenChange(), this.emit("childAdded", s, this, this._childCount), s.emit("added", this) } return t[0] }, e.prototype.addChildAt = function (t, i) { if (i < 0 || i > this._childCount) throw new Error("addChildAt: The index " + i + " supplied is out of bounds " + this._childCount); t.parent && t.parent.removeChild(t), t.parent = this, this.sortDirty = !0, t.transform._parentID = -1; var e = t; if (this._firstChild) if (0 === i) this._firstChild.prevChild = e, e.nextChild = this._firstChild, this._firstChild = e; else if (i === this._childCount) this._lastChild.nextChild = e, e.prevChild = this._lastChild, this._lastChild = e; else { for (var s = 0, r = this._firstChild; s < i;)r = r.nextChild, ++s; r.prevChild.nextChild = e, e.prevChild = r.prevChild, e.nextChild = r, r.prevChild = e } else this._firstChild = this._lastChild = e; return ++this._childCount, this._boundsID++, this.onChildrenChange(i), t.emit("added", this), this.emit("childAdded", t, this, i), t }, e.prototype.addChildBelow = function (t, i) { if (i.parent !== this) throw new Error("addChildBelow: The relative target must be a child of this parent"); return t.parent && t.parent.removeChild(t), t.parent = this, this.sortDirty = !0, t.transform._parentID = -1, i.prevChild.nextChild = t, t.prevChild = i.prevChild, t.nextChild = i, i.prevChild = t, this._firstChild === i && (this._firstChild = t), ++this._childCount, this._boundsID++, this.onChildrenChange(), this.emit("childAdded", t, this, this._childCount), t.emit("added", this), t }, e.prototype.addChildAbove = function (t, i) { if (i.parent !== this) throw new Error("addChildBelow: The relative target must be a child of this parent"); return t.parent && t.parent.removeChild(t), t.parent = this, this.sortDirty = !0, t.transform._parentID = -1, i.nextChild.prevChild = t, t.nextChild = i.nextChild, t.prevChild = i, i.nextChild = t, this._lastChild === i && (this._lastChild = t), ++this._childCount, this._boundsID++, this.onChildrenChange(), this.emit("childAdded", t, this, this._childCount), t.emit("added", this), t }, e.prototype.swapChildren = function (t, i) { if (t !== i && t.parent === this && i.parent === this) { var e = t, s = e.prevChild, r = e.nextChild; t.prevChild = i.prevChild, t.nextChild = i.nextChild, i.prevChild = s, i.nextChild = r, this._firstChild === t ? this._firstChild = i : this._firstChild === i && (this._firstChild = t), this._lastChild === t ? this._lastChild = i : this._lastChild === i && (this._lastChild = t), this.onChildrenChange() } }, e.prototype.getChildIndex = function (t) { for (var i = 0, e = this._firstChild; e && e !== t;)e = e.nextChild, ++i; if (!e) throw new Error("The supplied DisplayObject must be a child of the caller"); return i }, e.prototype.setChildIndex = function (t, i) { if (i < 0 || i >= this._childCount) throw new Error("The index " + i + " supplied is out of bounds " + this._childCount); if (t.parent !== this) throw new Error("The supplied DisplayObject must be a child of the caller"); if (t.nextChild && (t.nextChild.prevChild = t.prevChild), t.prevChild && (t.prevChild.nextChild = t.nextChild), this._firstChild === t && (this._firstChild = t.nextChild), this._lastChild === t && (this._lastChild = t.prevChild), t.nextChild = null, t.prevChild = null, this._firstChild) if (0 === i) this._firstChild.prevChild = t, t.nextChild = this._firstChild, this._firstChild = t; else if (i === this._childCount) this._lastChild.nextChild = t, t.prevChild = this._lastChild, this._lastChild = t; else { for (var e = 0, s = this._firstChild; e < i;)s = s.nextChild, ++e; s.prevChild.nextChild = t, t.prevChild = s.prevChild, t.nextChild = s, s.prevChild = t } else this._firstChild = this._lastChild = t; this.onChildrenChange(i) }, e.prototype.removeChild = function () { for (var t = [], i = 0; i < arguments.length; i++)t[i] = arguments[i]; if (t.length > 1) for (var e = 0; e < t.length; e++)this.removeChild(t[e]); else { var s = t[0]; if (s.parent !== this) return null; s.parent = null, s.transform._parentID = -1, s.nextChild && (s.nextChild.prevChild = s.prevChild), s.prevChild && (s.prevChild.nextChild = s.nextChild), this._firstChild === s && (this._firstChild = s.nextChild), this._lastChild === s && (this._lastChild = s.prevChild), s.nextChild = null, s.prevChild = null, --this._childCount, this._boundsID++, this.onChildrenChange(), s.emit("removed", this), this.emit("childRemoved", s, this) } return t[0] }, e.prototype.getChildAt = function (t) { if (t < 0 || t >= this._childCount) throw new Error("getChildAt: Index (" + t + ") does not exist."); if (0 === t) return this._firstChild; if (t === this._childCount) return this._lastChild; for (var i = 0, e = this._firstChild; i < t;)e = e.nextChild, ++i; return e }, e.prototype.removeChildAt = function (t) { var i = this.getChildAt(t); return i.parent = null, i.transform._parentID = -1, i.nextChild && (i.nextChild.prevChild = i.prevChild), i.prevChild && (i.prevChild.nextChild = i.nextChild), this._firstChild === i && (this._firstChild = i.nextChild), this._lastChild === i && (this._lastChild = i.prevChild), i.nextChild = null, i.prevChild = null, --this._childCount, this._boundsID++, this.onChildrenChange(t), i.emit("removed", this), this.emit("childRemoved", i, this, t), i }, e.prototype.removeChildren = function (t, i) { void 0 === t && (t = 0), void 0 === i && (i = this._childCount); var e = t, s = i, r = s - e; if (r > 0 && r <= s) { for (var n = [], a = this._firstChild, h = 0; h <= s && a; ++h, a = a.nextChild)h >= e && n.push(a); var o = n[0].prevChild, l = n[n.length - 1].nextChild; l ? l.prevChild = o : this._lastChild = o, o ? o.nextChild = l : this._firstChild = l; for (h = 0; h < n.length; ++h)n[h].parent = null, n[h].transform && (n[h].transform._parentID = -1), n[h].nextChild = null, n[h].prevChild = null; this._boundsID++, this.onChildrenChange(t); for (h = 0; h < n.length; ++h)n[h].emit("removed", this), this.emit("childRemoved", n[h], this, h); return n } if (0 === r && 0 === this._childCount) return []; throw new RangeError("removeChildren: numeric values are outside the acceptable range.") }, e.prototype.updateTransform = function () { var t, i; for (this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha, t = this._firstChild; t; t = i)i = t.nextChild, t.visible && t.updateTransform() }, e.prototype.calculateBounds = function () { var t, i; for (this._bounds.clear(), this._calculateBounds(), t = this._firstChild; t; t = i)if (i = t.nextChild, t.visible && t.renderable) if (t.calculateBounds(), t._mask) { var e = t._mask.maskObject || t._mask; e.calculateBounds(), this._bounds.addBoundsMask(t._bounds, e._bounds) } else t.filterArea ? this._bounds.addBoundsArea(t._bounds, t.filterArea) : this._bounds.addBounds(t._bounds); this._bounds.updateID = this._boundsID }, e.prototype.getLocalBounds = function (t, e) { void 0 === e && (e = !1); var s = i.DisplayObject.prototype.getLocalBounds.call(this, t); if (!e) { var r = void 0, n = void 0; for (r = this._firstChild; r; r = n)n = r.nextChild, r.visible && r.updateTransform() } return s }, e.prototype.render = function (t) { if (this.visible && !(this.worldAlpha <= 0) && this.renderable) if (this._mask || this.filters && this.filters.length) this.renderAdvanced(t); else { this._render(t); var i = void 0, e = void 0; for (i = this._firstChild; i; i = e)e = i.nextChild, i.render(t) } }, e.prototype.renderAdvanced = function (t) { t.batch.flush(); var i, e, s = this.filters, r = this._mask; if (s) { this._enabledFilters || (this._enabledFilters = []), this._enabledFilters.length = 0; for (var n = 0; n < s.length; n++)s[n].enabled && this._enabledFilters.push(s[n]); this._enabledFilters.length && t.filter.push(this, this._enabledFilters) } for (r && t.mask.push(this, this._mask), this._render(t), i = this._firstChild; i; i = e)e = i.nextChild, i.render(t); t.batch.flush(), r && t.mask.pop(this), s && this._enabledFilters && this._enabledFilters.length && t.filter.pop() }, e.prototype.renderWebGL = function (t) { if (this.visible && !(this.worldAlpha <= 0) && this.renderable) if (this._mask || this.filters && this.filters.length) this.renderAdvancedWebGL(t); else { this._renderWebGL(t); var i = void 0, e = void 0; for (i = this._firstChild; i; i = e)e = i.nextChild, i.renderWebGL(t) } }, e.prototype.renderAdvancedWebGL = function (t) { t.flush(); var i, e, s = this._filters, r = this._mask; if (s) { this._enabledFilters || (this._enabledFilters = []), this._enabledFilters.length = 0; for (var n = 0; n < s.length; n++)s[n].enabled && this._enabledFilters.push(s[n]); this._enabledFilters.length && t.filterManager.pushFilter(this, this._enabledFilters) } for (r && t.maskManager.pushMask(this, this._mask), this._renderWebGL(t), i = this._firstChild; i; i = e)e = i.nextChild, i.renderWebGL(t); t.flush(), r && t.maskManager.popMask(this, this._mask), s && this._enabledFilters && this._enabledFilters.length && t.filterManager.popFilter() }, e.prototype.renderCanvas = function (t) { if (this.visible && !(this.worldAlpha <= 0) && this.renderable) { var i, e; for (this._mask && t.maskManager.pushMask(this._mask), this._renderCanvas(t), i = this._firstChild; i; i = e)e = i.nextChild, i.renderCanvas(t); this._mask && t.maskManager.popMask(t) } }, e }(i.Container); t.AnimatedParticle = S, t.Emitter = y, t.GetTextureFromString = n, t.LinkedListContainer = R, t.Particle = _, t.PathParticle = b, t.PolygonalChain = C, t.PropertyList = f, t.PropertyNode = s }(this.PIXI.particles = this.PIXI.particles || {}, PIXI);
		//# sourceMappingURL=pixi-particles.min.js.map
	})();
	(function () {
		//PRAGMA: pluginName
		var pluginName = 'TRP_Particle';
		//PRAGMA_END: pluginName
		if (PluginManager.parameters(pluginName).importFilter !== 'true') return;

		/*!
		 * pixi-filters - v3.2.1
		 * Compiled Wed, 30 Dec 2020 18:32:15 UTC
		 *
		 * pixi-filters is licensed under the MIT License.
		 * http://www.opensource.org/licenses/mit-license
		 */
		var __filters = function (e, t, n, r, o, i, l, s) { "use strict"; var a = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", u = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float gamma;\nuniform float contrast;\nuniform float saturation;\nuniform float brightness;\nuniform float red;\nuniform float green;\nuniform float blue;\nuniform float alpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (c.a > 0.0) {\n        c.rgb /= c.a;\n\n        vec3 rgb = pow(c.rgb, vec3(1. / gamma));\n        rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb)), rgb, saturation), contrast);\n        rgb.r *= red;\n        rgb.g *= green;\n        rgb.b *= blue;\n        c.rgb = rgb * brightness;\n\n        c.rgb *= c.a;\n    }\n\n    gl_FragColor = c * alpha;\n}\n", c = function (e) { function t(t) { e.call(this, a, u), Object.assign(this, { gamma: 1, saturation: 1, contrast: 1, brightness: 1, red: 1, green: 1, blue: 1, alpha: 1 }, t) } return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.apply = function (e, t, n, r) { this.uniforms.gamma = Math.max(this.gamma, 1e-4), this.uniforms.saturation = this.saturation, this.uniforms.contrast = this.contrast, this.uniforms.brightness = this.brightness, this.uniforms.red = this.red, this.uniforms.green = this.green, this.uniforms.blue = this.blue, this.uniforms.alpha = this.alpha, e.applyFilter(this, t, n, r) }, t }(t.Filter), f = a, h = "\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}", p = "\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\nuniform vec4 filterClamp;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}\n", d = function (e) { function t(t, r, o) { void 0 === t && (t = 4), void 0 === r && (r = 3), void 0 === o && (o = !1), e.call(this, f, o ? p : h), this.uniforms.uOffset = new Float32Array(2), this._pixelSize = new n.Point, this.pixelSize = 1, this._clamp = o, this._kernels = null, Array.isArray(t) ? this.kernels = t : (this._blur = t, this.quality = r) } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var r = { kernels: { configurable: !0 }, clamp: { configurable: !0 }, pixelSize: { configurable: !0 }, quality: { configurable: !0 }, blur: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { var o, i = this._pixelSize.x / t._frame.width, l = this._pixelSize.y / t._frame.height; if (1 === this._quality || 0 === this._blur) o = this._kernels[0] + .5, this.uniforms.uOffset[0] = o * i, this.uniforms.uOffset[1] = o * l, e.applyFilter(this, t, n, r); else { for (var s, a = e.getFilterTexture(), u = t, c = a, f = this._quality - 1, h = 0; h < f; h++)o = this._kernels[h] + .5, this.uniforms.uOffset[0] = o * i, this.uniforms.uOffset[1] = o * l, e.applyFilter(this, u, c, 1), s = u, u = c, c = s; o = this._kernels[f] + .5, this.uniforms.uOffset[0] = o * i, this.uniforms.uOffset[1] = o * l, e.applyFilter(this, u, n, r), e.returnFilterTexture(a) } }, t.prototype._updatePadding = function () { this.padding = Math.ceil(this._kernels.reduce(function (e, t) { return e + t + .5 }, 0)) }, t.prototype._generateKernels = function () { var e = this._blur, t = this._quality, n = [e]; if (e > 0) for (var r = e, o = e / t, i = 1; i < t; i++)r -= o, n.push(r); this._kernels = n, this._updatePadding() }, r.kernels.get = function () { return this._kernels }, r.kernels.set = function (e) { Array.isArray(e) && e.length > 0 ? (this._kernels = e, this._quality = e.length, this._blur = Math.max.apply(Math, e)) : (this._kernels = [0], this._quality = 1) }, r.clamp.get = function () { return this._clamp }, r.pixelSize.set = function (e) { "number" == typeof e ? (this._pixelSize.x = e, this._pixelSize.y = e) : Array.isArray(e) ? (this._pixelSize.x = e[0], this._pixelSize.y = e[1]) : e instanceof n.Point ? (this._pixelSize.x = e.x, this._pixelSize.y = e.y) : (this._pixelSize.x = 1, this._pixelSize.y = 1) }, r.pixelSize.get = function () { return this._pixelSize }, r.quality.get = function () { return this._quality }, r.quality.set = function (e) { this._quality = Math.max(1, Math.round(e)), this._generateKernels() }, r.blur.get = function () { return this._blur }, r.blur.set = function (e) { this._blur = e, this._generateKernels() }, Object.defineProperties(t.prototype, r), t }(t.Filter), m = a, g = "\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform float threshold;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    // A simple & fast algorithm for getting brightness.\n    // It's inaccuracy , but good enought for this feature.\n    float _max = max(max(color.r, color.g), color.b);\n    float _min = min(min(color.r, color.g), color.b);\n    float brightness = (_max + _min) * 0.5;\n\n    if(brightness > threshold) {\n        gl_FragColor = color;\n    } else {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    }\n}\n", v = function (e) { function t(t) { void 0 === t && (t = .5), e.call(this, m, g), this.threshold = t } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { threshold: { configurable: !0 } }; return n.threshold.get = function () { return this.uniforms.threshold }, n.threshold.set = function (e) { this.uniforms.threshold = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), x = "uniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D bloomTexture;\nuniform float bloomScale;\nuniform float brightness;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    color.rgb *= brightness;\n    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);\n    bloomColor.rgb *= bloomScale;\n    gl_FragColor = color + bloomColor;\n}\n", y = function (e) { function t(t) { e.call(this, m, x), "number" == typeof t && (t = { threshold: t }), t = Object.assign({ threshold: .5, bloomScale: 1, brightness: 1, kernels: null, blur: 8, quality: 4, pixelSize: 1, resolution: r.settings.FILTER_RESOLUTION }, t), this.bloomScale = t.bloomScale, this.brightness = t.brightness; var n = t.kernels, o = t.blur, i = t.quality, l = t.pixelSize, s = t.resolution; this._extractFilter = new v(t.threshold), this._extractFilter.resolution = s, this._blurFilter = n ? new d(n) : new d(o, i), this.pixelSize = l, this.resolution = s } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { resolution: { configurable: !0 }, threshold: { configurable: !0 }, kernels: { configurable: !0 }, blur: { configurable: !0 }, quality: { configurable: !0 }, pixelSize: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r, o) { var i = e.getFilterTexture(); this._extractFilter.apply(e, t, i, 1, o); var l = e.getFilterTexture(); this._blurFilter.apply(e, i, l, 1, o), this.uniforms.bloomScale = this.bloomScale, this.uniforms.brightness = this.brightness, this.uniforms.bloomTexture = l, e.applyFilter(this, t, n, r), e.returnFilterTexture(l), e.returnFilterTexture(i) }, n.resolution.get = function () { return this._resolution }, n.resolution.set = function (e) { this._resolution = e, this._extractFilter && (this._extractFilter.resolution = e), this._blurFilter && (this._blurFilter.resolution = e) }, n.threshold.get = function () { return this._extractFilter.threshold }, n.threshold.set = function (e) { this._extractFilter.threshold = e }, n.kernels.get = function () { return this._blurFilter.kernels }, n.kernels.set = function (e) { this._blurFilter.kernels = e }, n.blur.get = function () { return this._blurFilter.blur }, n.blur.set = function (e) { this._blurFilter.blur = e }, n.quality.get = function () { return this._blurFilter.quality }, n.quality.set = function (e) { this._blurFilter.quality = e }, n.pixelSize.get = function () { return this._blurFilter.pixelSize }, n.pixelSize.set = function (e) { this._blurFilter.pixelSize = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), _ = a, b = "varying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n\n    if (clamp(p.x, 0.0, 4.0) == p.x)\n    {\n        if (clamp(p.y, 0.0, 4.0) == p.y)\n        {\n            if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n        }\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}\n", C = function (e) { function t(t) { void 0 === t && (t = 8), e.call(this, _, b), this.size = t } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { size: { configurable: !0 } }; return n.size.get = function () { return this.uniforms.pixelSize }, n.size.set = function (e) { this.uniforms.pixelSize = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), S = a, F = "precision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float transformX;\nuniform float transformY;\nuniform vec3 lightColor;\nuniform float lightAlpha;\nuniform vec3 shadowColor;\nuniform float shadowAlpha;\n\nvoid main(void) {\n    vec2 transform = vec2(1.0 / filterArea) * vec2(transformX, transformY);\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float light = texture2D(uSampler, vTextureCoord - transform).a;\n    float shadow = texture2D(uSampler, vTextureCoord + transform).a;\n\n    color.rgb = mix(color.rgb, lightColor, clamp((color.a - light) * lightAlpha, 0.0, 1.0));\n    color.rgb = mix(color.rgb, shadowColor, clamp((color.a - shadow) * shadowAlpha, 0.0, 1.0));\n    gl_FragColor = vec4(color.rgb * color.a, color.a);\n}\n", z = function (e) { function t(t) { void 0 === t && (t = {}), e.call(this, S, F), this.uniforms.lightColor = new Float32Array(3), this.uniforms.shadowColor = new Float32Array(3), t = Object.assign({ rotation: 45, thickness: 2, lightColor: 16777215, lightAlpha: .7, shadowColor: 0, shadowAlpha: .7 }, t), this.rotation = t.rotation, this.thickness = t.thickness, this.lightColor = t.lightColor, this.lightAlpha = t.lightAlpha, this.shadowColor = t.shadowColor, this.shadowAlpha = t.shadowAlpha, this.padding = 1 } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var r = { rotation: { configurable: !0 }, thickness: { configurable: !0 }, lightColor: { configurable: !0 }, lightAlpha: { configurable: !0 }, shadowColor: { configurable: !0 }, shadowAlpha: { configurable: !0 } }; return t.prototype._updateTransform = function () { this.uniforms.transformX = this._thickness * Math.cos(this._angle), this.uniforms.transformY = this._thickness * Math.sin(this._angle) }, r.rotation.get = function () { return this._angle / n.DEG_TO_RAD }, r.rotation.set = function (e) { this._angle = e * n.DEG_TO_RAD, this._updateTransform() }, r.thickness.get = function () { return this._thickness }, r.thickness.set = function (e) { this._thickness = e, this._updateTransform() }, r.lightColor.get = function () { return o.rgb2hex(this.uniforms.lightColor) }, r.lightColor.set = function (e) { o.hex2rgb(e, this.uniforms.lightColor) }, r.lightAlpha.get = function () { return this.uniforms.lightAlpha }, r.lightAlpha.set = function (e) { this.uniforms.lightAlpha = e }, r.shadowColor.get = function () { return o.rgb2hex(this.uniforms.shadowColor) }, r.shadowColor.set = function (e) { o.hex2rgb(e, this.uniforms.shadowColor) }, r.shadowAlpha.get = function () { return this.uniforms.shadowAlpha }, r.shadowAlpha.set = function (e) { this.uniforms.shadowAlpha = e }, Object.defineProperties(t.prototype, r), t }(t.Filter), A = function (e) { function t(t, o, a, u) { var c, f; void 0 === t && (t = 2), void 0 === o && (o = 4), void 0 === a && (a = r.settings.FILTER_RESOLUTION), void 0 === u && (u = 5), e.call(this), "number" == typeof t ? (c = t, f = t) : t instanceof n.Point ? (c = t.x, f = t.y) : Array.isArray(t) && (c = t[0], f = t[1]), this.blurXFilter = new s.BlurFilterPass(!0, c, o, a, u), this.blurYFilter = new s.BlurFilterPass(!1, f, o, a, u), this.blurYFilter.blendMode = i.BLEND_MODES.SCREEN, this.defaultFilter = new l.AlphaFilter } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var o = { blur: { configurable: !0 }, blurX: { configurable: !0 }, blurY: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { var o = e.getFilterTexture(); this.defaultFilter.apply(e, t, n, r), this.blurXFilter.apply(e, t, o), this.blurYFilter.apply(e, o, n, 0), e.returnFilterTexture(o) }, o.blur.get = function () { return this.blurXFilter.blur }, o.blur.set = function (e) { this.blurXFilter.blur = this.blurYFilter.blur = e }, o.blurX.get = function () { return this.blurXFilter.blur }, o.blurX.set = function (e) { this.blurXFilter.blur = e }, o.blurY.get = function () { return this.blurYFilter.blur }, o.blurY.set = function (e) { this.blurYFilter.blur = e }, Object.defineProperties(t.prototype, o), t }(t.Filter), T = a, w = "uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 coord = vTextureCoord * filterArea.xy;\n    coord -= center * dimensions.xy;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center * dimensions.xy;\n    coord /= filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    vec4 color = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    gl_FragColor = color;\n}\n", O = function (e) { function t(t) { if (e.call(this, T, w), "object" != typeof t) { var n = arguments[0], r = arguments[1], o = arguments[2]; t = {}, void 0 !== n && (t.center = n), void 0 !== r && (t.radius = r), void 0 !== o && (t.strength = o) } this.uniforms.dimensions = new Float32Array(2), Object.assign(this, { center: [.5, .5], radius: 100, strength: 1 }, t) } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { radius: { configurable: !0 }, strength: { configurable: !0 }, center: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { this.uniforms.dimensions[0] = t.filterFrame.width, this.uniforms.dimensions[1] = t.filterFrame.height, e.applyFilter(this, t, n, r) }, n.radius.get = function () { return this.uniforms.radius }, n.radius.set = function (e) { this.uniforms.radius = e }, n.strength.get = function () { return this.uniforms.strength }, n.strength.set = function (e) { this.uniforms.strength = e }, n.center.get = function () { return this.uniforms.center }, n.center.set = function (e) { this.uniforms.center = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), D = a, P = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D colorMap;\nuniform float _mix;\nuniform float _size;\nuniform float _sliceSize;\nuniform float _slicePixelSize;\nuniform float _sliceInnerSize;\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord.xy);\n\n    vec4 adjusted;\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n        float innerWidth = _size - 1.0;\n        float zSlice0 = min(floor(color.b * innerWidth), innerWidth);\n        float zSlice1 = min(zSlice0 + 1.0, innerWidth);\n        float xOffset = _slicePixelSize * 0.5 + color.r * _sliceInnerSize;\n        float s0 = xOffset + (zSlice0 * _sliceSize);\n        float s1 = xOffset + (zSlice1 * _sliceSize);\n        float yOffset = _sliceSize * 0.5 + color.g * (1.0 - _sliceSize);\n        vec4 slice0Color = texture2D(colorMap, vec2(s0,yOffset));\n        vec4 slice1Color = texture2D(colorMap, vec2(s1,yOffset));\n        float zOffset = fract(color.b * innerWidth);\n        adjusted = mix(slice0Color, slice1Color, zOffset);\n\n        color.rgb *= color.a;\n    }\n    gl_FragColor = vec4(mix(color, adjusted, _mix).rgb, color.a);\n\n}", M = function (e) { function n(t, n, r) { void 0 === n && (n = !1), void 0 === r && (r = 1), e.call(this, D, P), this._size = 0, this._sliceSize = 0, this._slicePixelSize = 0, this._sliceInnerSize = 0, this._scaleMode = null, this._nearest = !1, this.nearest = n, this.mix = r, this.colorMap = t } e && (n.__proto__ = e), n.prototype = Object.create(e && e.prototype), n.prototype.constructor = n; var r = { colorSize: { configurable: !0 }, colorMap: { configurable: !0 }, nearest: { configurable: !0 } }; return n.prototype.apply = function (e, t, n, r) { this.uniforms._mix = this.mix, e.applyFilter(this, t, n, r) }, r.colorSize.get = function () { return this._size }, r.colorMap.get = function () { return this._colorMap }, r.colorMap.set = function (e) { e instanceof t.Texture || (e = t.Texture.from(e)), e && e.baseTexture && (e.baseTexture.scaleMode = this._scaleMode, e.baseTexture.mipmap = !1, this._size = e.height, this._sliceSize = 1 / this._size, this._slicePixelSize = this._sliceSize / this._size, this._sliceInnerSize = this._slicePixelSize * (this._size - 1), this.uniforms._size = this._size, this.uniforms._sliceSize = this._sliceSize, this.uniforms._slicePixelSize = this._slicePixelSize, this.uniforms._sliceInnerSize = this._sliceInnerSize, this.uniforms.colorMap = e), this._colorMap = e }, r.nearest.get = function () { return this._nearest }, r.nearest.set = function (e) { this._nearest = e, this._scaleMode = e ? i.SCALE_MODES.NEAREST : i.SCALE_MODES.LINEAR; var t = this._colorMap; t && t.baseTexture && (t.baseTexture._glTextures = {}, t.baseTexture.scaleMode = this._scaleMode, t.baseTexture.mipmap = !1, t._updateID++, t.baseTexture.emit("update", t.baseTexture)) }, n.prototype.updateColorMap = function () { var e = this._colorMap; e && e.baseTexture && (e._updateID++, e.baseTexture.emit("update", e.baseTexture), this.colorMap = e) }, n.prototype.destroy = function (t) { this._colorMap && this._colorMap.destroy(t), e.prototype.destroy.call(this) }, Object.defineProperties(n.prototype, r), n }(t.Filter), R = a, k = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec3 color;\nvoid main(void) {\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\n    vec3 colorOverlay = color * currentColor.a;\n    gl_FragColor = vec4(colorOverlay.r, colorOverlay.g, colorOverlay.b, currentColor.a);\n}\n", j = function (e) { function t(t) { void 0 === t && (t = 0), e.call(this, R, k), this.uniforms.color = new Float32Array(3), this.color = t } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { color: { configurable: !0 } }; return n.color.set = function (e) { var t = this.uniforms.color; "number" == typeof e ? (o.hex2rgb(e, t), this._color = e) : (t[0] = e[0], t[1] = e[1], t[2] = e[2], this._color = o.rgb2hex(t)) }, n.color.get = function () { return this._color }, Object.defineProperties(t.prototype, n), t }(t.Filter), E = a, L = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n", I = function (e) { function t(t, n, r) { void 0 === t && (t = 16711680), void 0 === n && (n = 0), void 0 === r && (r = .4), e.call(this, E, L), this.uniforms.originalColor = new Float32Array(3), this.uniforms.newColor = new Float32Array(3), this.originalColor = t, this.newColor = n, this.epsilon = r } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { originalColor: { configurable: !0 }, newColor: { configurable: !0 }, epsilon: { configurable: !0 } }; return n.originalColor.set = function (e) { var t = this.uniforms.originalColor; "number" == typeof e ? (o.hex2rgb(e, t), this._originalColor = e) : (t[0] = e[0], t[1] = e[1], t[2] = e[2], this._originalColor = o.rgb2hex(t)) }, n.originalColor.get = function () { return this._originalColor }, n.newColor.set = function (e) { var t = this.uniforms.newColor; "number" == typeof e ? (o.hex2rgb(e, t), this._newColor = e) : (t[0] = e[0], t[1] = e[1], t[2] = e[2], this._newColor = o.rgb2hex(t)) }, n.newColor.get = function () { return this._newColor }, n.epsilon.set = function (e) { this.uniforms.epsilon = e }, n.epsilon.get = function () { return this.uniforms.epsilon }, Object.defineProperties(t.prototype, n), t }(t.Filter), X = a, B = "precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n", N = function (e) { function t(t, n, r) { void 0 === n && (n = 200), void 0 === r && (r = 200), e.call(this, X, B), this.uniforms.texelSize = new Float32Array(2), this.uniforms.matrix = new Float32Array(9), void 0 !== t && (this.matrix = t), this.width = n, this.height = r } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { matrix: { configurable: !0 }, width: { configurable: !0 }, height: { configurable: !0 } }; return n.matrix.get = function () { return this.uniforms.matrix }, n.matrix.set = function (e) { var t = this; e.forEach(function (e, n) { return t.uniforms.matrix[n] = e }) }, n.width.get = function () { return 1 / this.uniforms.texelSize[0] }, n.width.set = function (e) { this.uniforms.texelSize[0] = 1 / e }, n.height.get = function () { return 1 / this.uniforms.texelSize[1] }, n.height.set = function (e) { this.uniforms.texelSize[1] = 1 / e }, Object.defineProperties(t.prototype, n), t }(t.Filter), G = a, q = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n", K = function (e) { function t() { e.call(this, G, q) } return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t }(t.Filter), W = a, Y = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nconst float SQRT_2 = 1.414213;\n\nconst float light = 1.0;\n\nuniform float curvature;\nuniform float lineWidth;\nuniform float lineContrast;\nuniform bool verticalLine;\nuniform float noise;\nuniform float noiseSize;\n\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\n\nuniform float seed;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 dir = vec2(vTextureCoord.xy - vec2(0.5, 0.5)) * filterArea.xy / dimensions;\n\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 rgb = gl_FragColor.rgb;\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        rgb += _noise * noise;\n    }\n\n    if (lineWidth > 0.0)\n    {\n        float _c = curvature > 0. ? curvature : 1.;\n        float k = curvature > 0. ?(length(dir * dir) * 0.25 * _c * _c + 0.935 * _c) : 1.;\n        vec2 uv = dir * k;\n\n        float v = (verticalLine ? uv.x * dimensions.x : uv.y * dimensions.y) * min(1.0, 2.0 / lineWidth ) / _c;\n        float j = 1. + cos(v * 1.2 - time) * 0.5 * lineContrast;\n        rgb *= j;\n        float segment = verticalLine ? mod((dir.x + .5) * dimensions.x, 4.) : mod((dir.y + .5) * dimensions.y, 4.);\n        rgb *= 0.99 + ceil(segment) * 0.015;\n    }\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    gl_FragColor.rgb = rgb;\n}\n", Z = function (e) { function t(t) { e.call(this, W, Y), this.uniforms.dimensions = new Float32Array(2), this.time = 0, this.seed = 0, Object.assign(this, { curvature: 1, lineWidth: 1, lineContrast: .25, verticalLine: !1, noise: 0, noiseSize: 1, seed: 0, vignetting: .3, vignettingAlpha: 1, vignettingBlur: .3, time: 0 }, t) } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { curvature: { configurable: !0 }, lineWidth: { configurable: !0 }, lineContrast: { configurable: !0 }, verticalLine: { configurable: !0 }, noise: { configurable: !0 }, noiseSize: { configurable: !0 }, vignetting: { configurable: !0 }, vignettingAlpha: { configurable: !0 }, vignettingBlur: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { this.uniforms.dimensions[0] = t.filterFrame.width, this.uniforms.dimensions[1] = t.filterFrame.height, this.uniforms.seed = this.seed, this.uniforms.time = this.time, e.applyFilter(this, t, n, r) }, n.curvature.set = function (e) { this.uniforms.curvature = e }, n.curvature.get = function () { return this.uniforms.curvature }, n.lineWidth.set = function (e) { this.uniforms.lineWidth = e }, n.lineWidth.get = function () { return this.uniforms.lineWidth }, n.lineContrast.set = function (e) { this.uniforms.lineContrast = e }, n.lineContrast.get = function () { return this.uniforms.lineContrast }, n.verticalLine.set = function (e) { this.uniforms.verticalLine = e }, n.verticalLine.get = function () { return this.uniforms.verticalLine }, n.noise.set = function (e) { this.uniforms.noise = e }, n.noise.get = function () { return this.uniforms.noise }, n.noiseSize.set = function (e) { this.uniforms.noiseSize = e }, n.noiseSize.get = function () { return this.uniforms.noiseSize }, n.vignetting.set = function (e) { this.uniforms.vignetting = e }, n.vignetting.get = function () { return this.uniforms.vignetting }, n.vignettingAlpha.set = function (e) { this.uniforms.vignettingAlpha = e }, n.vignettingAlpha.get = function () { return this.uniforms.vignettingAlpha }, n.vignettingBlur.set = function (e) { this.uniforms.vignettingBlur = e }, n.vignettingBlur.get = function () { return this.uniforms.vignettingBlur }, Object.defineProperties(t.prototype, n), t }(t.Filter), Q = a, U = "precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n", V = function (e) { function t(t, n) { void 0 === t && (t = 1), void 0 === n && (n = 5), e.call(this, Q, U), this.scale = t, this.angle = n } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { scale: { configurable: !0 }, angle: { configurable: !0 } }; return n.scale.get = function () { return this.uniforms.scale }, n.scale.set = function (e) { this.uniforms.scale = e }, n.angle.get = function () { return this.uniforms.angle }, n.angle.set = function (e) { this.uniforms.angle = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), H = a, $ = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\n\nuniform vec2 shift;\nuniform vec4 inputSize;\n\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord - shift * inputSize.zw);\n\n    // Premultiply alpha\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}", J = function (e) { function t(t) { t && t.constructor !== Object && (console.warn("DropShadowFilter now uses options instead of (rotation, distance, blur, color, alpha)"), t = { rotation: t }, void 0 !== arguments[1] && (t.distance = arguments[1]), void 0 !== arguments[2] && (t.blur = arguments[2]), void 0 !== arguments[3] && (t.color = arguments[3]), void 0 !== arguments[4] && (t.alpha = arguments[4])), t = Object.assign({ rotation: 45, distance: 5, color: 0, alpha: .5, shadowOnly: !1, kernels: null, blur: 2, quality: 3, pixelSize: 1, resolution: r.settings.FILTER_RESOLUTION }, t), e.call(this); var o = t.kernels, i = t.blur, l = t.quality, s = t.pixelSize, a = t.resolution; this._tintFilter = new e(H, $), this._tintFilter.uniforms.color = new Float32Array(4), this._tintFilter.uniforms.shift = new n.Point, this._tintFilter.resolution = a, this._blurFilter = o ? new d(o) : new d(i, l), this.pixelSize = s, this.resolution = a; var u = t.shadowOnly, c = t.rotation, f = t.distance, h = t.alpha, p = t.color; this.shadowOnly = u, this.rotation = c, this.distance = f, this.alpha = h, this.color = p, this._updatePadding() } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var i = { resolution: { configurable: !0 }, distance: { configurable: !0 }, rotation: { configurable: !0 }, alpha: { configurable: !0 }, color: { configurable: !0 }, kernels: { configurable: !0 }, blur: { configurable: !0 }, quality: { configurable: !0 }, pixelSize: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { var o = e.getFilterTexture(); this._tintFilter.apply(e, t, o, 1), this._blurFilter.apply(e, o, n, r), !0 !== this.shadowOnly && e.applyFilter(this, t, n, 0), e.returnFilterTexture(o) }, t.prototype._updatePadding = function () { this.padding = this.distance + 2 * this.blur }, t.prototype._updateShift = function () { this._tintFilter.uniforms.shift.set(this.distance * Math.cos(this.angle), this.distance * Math.sin(this.angle)) }, i.resolution.get = function () { return this._resolution }, i.resolution.set = function (e) { this._resolution = e, this._tintFilter && (this._tintFilter.resolution = e), this._blurFilter && (this._blurFilter.resolution = e) }, i.distance.get = function () { return this._distance }, i.distance.set = function (e) { this._distance = e, this._updatePadding(), this._updateShift() }, i.rotation.get = function () { return this.angle / n.DEG_TO_RAD }, i.rotation.set = function (e) { this.angle = e * n.DEG_TO_RAD, this._updateShift() }, i.alpha.get = function () { return this._tintFilter.uniforms.alpha }, i.alpha.set = function (e) { this._tintFilter.uniforms.alpha = e }, i.color.get = function () { return o.rgb2hex(this._tintFilter.uniforms.color) }, i.color.set = function (e) { o.hex2rgb(e, this._tintFilter.uniforms.color) }, i.kernels.get = function () { return this._blurFilter.kernels }, i.kernels.set = function (e) { this._blurFilter.kernels = e }, i.blur.get = function () { return this._blurFilter.blur }, i.blur.set = function (e) { this._blurFilter.blur = e, this._updatePadding() }, i.quality.get = function () { return this._blurFilter.quality }, i.quality.set = function (e) { this._blurFilter.quality = e }, i.pixelSize.get = function () { return this._blurFilter.pixelSize }, i.pixelSize.set = function (e) { this._blurFilter.pixelSize = e }, Object.defineProperties(t.prototype, i), t }(t.Filter), ee = a, te = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n", ne = function (e) { function t(t) { void 0 === t && (t = 5), e.call(this, ee, te), this.strength = t } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { strength: { configurable: !0 } }; return n.strength.get = function () { return this.uniforms.strength }, n.strength.set = function (e) { this.uniforms.strength = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), re = a, oe = "// precision highp float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\nuniform float aspect;\n\nuniform sampler2D displacementMap;\nuniform float offset;\nuniform float sinDir;\nuniform float cosDir;\nuniform int fillMode;\n\nuniform float seed;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nconst int TRANSPARENT = 0;\nconst int ORIGINAL = 1;\nconst int LOOP = 2;\nconst int CLAMP = 3;\nconst int MIRROR = 4;\n\nvoid main(void)\n{\n    vec2 coord = (vTextureCoord * filterArea.xy) / dimensions;\n\n    if (coord.x > 1.0 || coord.y > 1.0) {\n        return;\n    }\n\n    float cx = coord.x - 0.5;\n    float cy = (coord.y - 0.5) * aspect;\n    float ny = (-sinDir * cx + cosDir * cy) / aspect + 0.5;\n\n    // displacementMap: repeat\n    // ny = ny > 1.0 ? ny - 1.0 : (ny < 0.0 ? 1.0 + ny : ny);\n\n    // displacementMap: mirror\n    ny = ny > 1.0 ? 2.0 - ny : (ny < 0.0 ? -ny : ny);\n\n    vec4 dc = texture2D(displacementMap, vec2(0.5, ny));\n\n    float displacement = (dc.r - dc.g) * (offset / filterArea.x);\n\n    coord = vTextureCoord + vec2(cosDir * displacement, sinDir * displacement * aspect);\n\n    if (fillMode == CLAMP) {\n        coord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    } else {\n        if( coord.x > filterClamp.z ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.x -= filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x = filterClamp.z * 2.0 - coord.x;\n            }\n        } else if( coord.x < filterClamp.x ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.x += filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x *= -filterClamp.z;\n            }\n        }\n\n        if( coord.y > filterClamp.w ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.y -= filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y = filterClamp.w * 2.0 - coord.y;\n            }\n        } else if( coord.y < filterClamp.y ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.y += filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y *= -filterClamp.w;\n            }\n        }\n    }\n\n    gl_FragColor.r = texture2D(uSampler, coord + red * (1.0 - seed * 0.4) / filterArea.xy).r;\n    gl_FragColor.g = texture2D(uSampler, coord + green * (1.0 - seed * 0.3) / filterArea.xy).g;\n    gl_FragColor.b = texture2D(uSampler, coord + blue * (1.0 - seed * 0.2) / filterArea.xy).b;\n    gl_FragColor.a = texture2D(uSampler, coord).a;\n}\n", ie = function (e) { function r(n) { void 0 === n && (n = {}), e.call(this, re, oe), this.uniforms.dimensions = new Float32Array(2), n = Object.assign({ slices: 5, offset: 100, direction: 0, fillMode: 0, average: !1, seed: 0, red: [0, 0], green: [0, 0], blue: [0, 0], minSize: 8, sampleSize: 512 }, n), this.direction = n.direction, this.red = n.red, this.green = n.green, this.blue = n.blue, this.offset = n.offset, this.fillMode = n.fillMode, this.average = n.average, this.seed = n.seed, this.minSize = n.minSize, this.sampleSize = n.sampleSize, this._canvas = document.createElement("canvas"), this._canvas.width = 4, this._canvas.height = this.sampleSize, this.texture = t.Texture.from(this._canvas, { scaleMode: i.SCALE_MODES.NEAREST }), this._slices = 0, this.slices = n.slices } e && (r.__proto__ = e), r.prototype = Object.create(e && e.prototype), r.prototype.constructor = r; var o = { sizes: { configurable: !0 }, offsets: { configurable: !0 }, slices: { configurable: !0 }, direction: { configurable: !0 }, red: { configurable: !0 }, green: { configurable: !0 }, blue: { configurable: !0 } }; return r.prototype.apply = function (e, t, n, r) { var o = t.filterFrame.width, i = t.filterFrame.height; this.uniforms.dimensions[0] = o, this.uniforms.dimensions[1] = i, this.uniforms.aspect = i / o, this.uniforms.seed = this.seed, this.uniforms.offset = this.offset, this.uniforms.fillMode = this.fillMode, e.applyFilter(this, t, n, r) }, r.prototype._randomizeSizes = function () { var e = this._sizes, t = this._slices - 1, n = this.sampleSize, r = Math.min(this.minSize / n, .9 / this._slices); if (this.average) { for (var o = this._slices, i = 1, l = 0; l < t; l++) { var s = i / (o - l), a = Math.max(s * (1 - .6 * Math.random()), r); e[l] = a, i -= a } e[t] = i } else { for (var u = 1, c = Math.sqrt(1 / this._slices), f = 0; f < t; f++) { var h = Math.max(c * u * Math.random(), r); e[f] = h, u -= h } e[t] = u } this.shuffle() }, r.prototype.shuffle = function () { for (var e = this._sizes, t = this._slices - 1; t > 0; t--) { var n = Math.random() * t >> 0, r = e[t]; e[t] = e[n], e[n] = r } }, r.prototype._randomizeOffsets = function () { for (var e = 0; e < this._slices; e++)this._offsets[e] = Math.random() * (Math.random() < .5 ? -1 : 1) }, r.prototype.refresh = function () { this._randomizeSizes(), this._randomizeOffsets(), this.redraw() }, r.prototype.redraw = function () { var e, t = this.sampleSize, n = this.texture, r = this._canvas.getContext("2d"); r.clearRect(0, 0, 8, t); for (var o = 0, i = 0; i < this._slices; i++) { e = Math.floor(256 * this._offsets[i]); var l = this._sizes[i] * t, s = e > 0 ? e : 0, a = e < 0 ? -e : 0; r.fillStyle = "rgba(" + s + ", " + a + ", 0, 1)", r.fillRect(0, o >> 0, t, l + 1 >> 0), o += l } n.baseTexture.update(), this.uniforms.displacementMap = n }, o.sizes.set = function (e) { for (var t = Math.min(this._slices, e.length), n = 0; n < t; n++)this._sizes[n] = e[n] }, o.sizes.get = function () { return this._sizes }, o.offsets.set = function (e) { for (var t = Math.min(this._slices, e.length), n = 0; n < t; n++)this._offsets[n] = e[n] }, o.offsets.get = function () { return this._offsets }, o.slices.get = function () { return this._slices }, o.slices.set = function (e) { this._slices !== e && (this._slices = e, this.uniforms.slices = e, this._sizes = this.uniforms.slicesWidth = new Float32Array(e), this._offsets = this.uniforms.slicesOffset = new Float32Array(e), this.refresh()) }, o.direction.get = function () { return this._direction }, o.direction.set = function (e) { if (this._direction !== e) { this._direction = e; var t = e * n.DEG_TO_RAD; this.uniforms.sinDir = Math.sin(t), this.uniforms.cosDir = Math.cos(t) } }, o.red.get = function () { return this.uniforms.red }, o.red.set = function (e) { this.uniforms.red = e }, o.green.get = function () { return this.uniforms.green }, o.green.set = function (e) { this.uniforms.green = e }, o.blue.get = function () { return this.uniforms.blue }, o.blue.set = function (e) { this.uniforms.blue = e }, r.prototype.destroy = function () { this.texture.destroy(!0), this.texture = null, this._canvas = null, this.red = null, this.green = null, this.blue = null, this._sizes = null, this._offsets = null }, Object.defineProperties(r.prototype, o), r }(t.Filter); ie.TRANSPARENT = 0, ie.ORIGINAL = 1, ie.LOOP = 2, ie.CLAMP = 3, ie.MIRROR = 4; var le = a, se = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float outerStrength;\nuniform float innerStrength;\n\nuniform vec4 glowColor;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform bool knockout;\n\nconst float PI = 3.14159265358979323846264;\n\nconst float DIST = __DIST__;\nconst float ANGLE_STEP_SIZE = min(__ANGLE_STEP_SIZE__, PI * 2.0);\nconst float ANGLE_STEP_NUM = ceil(PI * 2.0 / ANGLE_STEP_SIZE);\n\nconst float MAX_TOTAL_ALPHA = ANGLE_STEP_NUM * DIST * (DIST + 1.0) / 2.0;\n\nvoid main(void) {\n    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\n    float totalAlpha = 0.0;\n\n    vec2 direction;\n    vec2 displaced;\n    vec4 curColor;\n\n    for (float angle = 0.0; angle < PI * 2.0; angle += ANGLE_STEP_SIZE) {\n       direction = vec2(cos(angle), sin(angle)) * px;\n\n       for (float curDistance = 0.0; curDistance < DIST; curDistance++) {\n           displaced = clamp(vTextureCoord + direction * \n                   (curDistance + 1.0), filterClamp.xy, filterClamp.zw);\n\n           curColor = texture2D(uSampler, displaced);\n\n           totalAlpha += (DIST - curDistance) * curColor.a;\n       }\n    }\n    \n    curColor = texture2D(uSampler, vTextureCoord);\n\n    float alphaRatio = (totalAlpha / MAX_TOTAL_ALPHA);\n\n    float innerGlowAlpha = (1.0 - alphaRatio) * innerStrength * curColor.a;\n    float innerGlowStrength = min(1.0, innerGlowAlpha);\n    \n    vec4 innerColor = mix(curColor, glowColor, innerGlowStrength);\n\n    float outerGlowAlpha = alphaRatio * outerStrength * (1. - curColor.a);\n    float outerGlowStrength = min(1.0 - innerColor.a, outerGlowAlpha);\n\n    vec4 outerGlowColor = outerGlowStrength * glowColor.rgba;\n    \n    if (knockout) {\n      float resultAlpha = outerGlowAlpha + innerGlowAlpha;\n      gl_FragColor = vec4(glowColor.rgb * resultAlpha, resultAlpha);\n    }\n    else {\n      gl_FragColor = innerColor + outerGlowColor;\n    }\n}\n", ae = function (e) { function t(n) { var r = Object.assign({}, t.defaults, n), o = r.distance, i = r.outerStrength, l = r.innerStrength, s = r.color, a = r.knockout, u = r.quality; o = Math.round(o), e.call(this, le, se.replace(/__ANGLE_STEP_SIZE__/gi, "" + (1 / u / o).toFixed(7)).replace(/__DIST__/gi, o.toFixed(0) + ".0")), this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]), Object.assign(this, { color: s, outerStrength: i, innerStrength: l, padding: o, knockout: a }) } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { color: { configurable: !0 }, outerStrength: { configurable: !0 }, innerStrength: { configurable: !0 }, knockout: { configurable: !0 } }; return n.color.get = function () { return o.rgb2hex(this.uniforms.glowColor) }, n.color.set = function (e) { o.hex2rgb(e, this.uniforms.glowColor) }, n.outerStrength.get = function () { return this.uniforms.outerStrength }, n.outerStrength.set = function (e) { this.uniforms.outerStrength = e }, n.innerStrength.get = function () { return this.uniforms.innerStrength }, n.innerStrength.set = function (e) { this.uniforms.innerStrength = e }, n.knockout.get = function () { return this.uniforms.knockout }, n.knockout.set = function (e) { this.uniforms.knockout = e }, Object.defineProperties(t.prototype, n), t }(t.Filter); ae.defaults = { distance: 10, outerStrength: 4, innerStrength: 0, color: 16777215, quality: .1, knockout: !1 }; var ue = a, ce = "vec3 mod289(vec3 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x)\n{\n    return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r)\n{\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t)\n{\n    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n    Pi0 = mod289(Pi0);\n    Pi1 = mod289(Pi1);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n    vec4 gx0 = ixy0 * (1.0 / 7.0);\n    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n    vec4 gx1 = ixy1 * (1.0 / 7.0);\n    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n    return 2.2 * n_xyz;\n}\nfloat turb(vec3 P, vec3 rep, float lacunarity, float gain)\n{\n    float sum = 0.0;\n    float sc = 1.0;\n    float totalgain = 1.0;\n    for (float i = 0.0; i < 6.0; i++)\n    {\n        sum += totalgain * pnoise(P * sc, rep);\n        sc *= lacunarity;\n        totalgain *= gain;\n    }\n    return abs(sum);\n}\n", fe = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform vec2 light;\nuniform bool parallel;\nuniform float aspect;\n\nuniform float gain;\nuniform float lacunarity;\nuniform float time;\nuniform float alpha;\n\n${perlin}\n\nvoid main(void) {\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    float d;\n\n    if (parallel) {\n        float _cos = light.x;\n        float _sin = light.y;\n        d = (_cos * coord.x) + (_sin * coord.y * aspect);\n    } else {\n        float dx = coord.x - light.x / dimensions.x;\n        float dy = (coord.y - light.y / dimensions.y) * aspect;\n        float dis = sqrt(dx * dx + dy * dy) + 0.00001;\n        d = dy / dis;\n    }\n\n    vec3 dir = vec3(d, d, 0.0);\n\n    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);\n    noise = mix(noise, 0.0, 0.3);\n    //fade vertically.\n    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);\n    mist.a = 1.0;\n    // apply user alpha\n    mist *= alpha;\n\n    gl_FragColor = texture2D(uSampler, vTextureCoord) + mist;\n\n}\n", he = function (e) { function t(t) { e.call(this, ue, fe.replace("${perlin}", ce)), this.uniforms.dimensions = new Float32Array(2), "number" == typeof t && (console.warn("GodrayFilter now uses options instead of (angle, gain, lacunarity, time)"), t = { angle: t }, void 0 !== arguments[1] && (t.gain = arguments[1]), void 0 !== arguments[2] && (t.lacunarity = arguments[2]), void 0 !== arguments[3] && (t.time = arguments[3]), void 0 !== arguments[4] && (t.alpha = arguments[4])), t = Object.assign({ angle: 30, gain: .5, lacunarity: 2.5, time: 0, parallel: !0, center: [0, 0], alpha: 1 }, t), this._angleLight = new n.Point, this.angle = t.angle, this.gain = t.gain, this.lacunarity = t.lacunarity, this.alpha = t.alpha, this.parallel = t.parallel, this.center = t.center, this.time = t.time } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var r = { angle: { configurable: !0 }, gain: { configurable: !0 }, lacunarity: { configurable: !0 }, alpha: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { var o = t.filterFrame, i = o.width, l = o.height; this.uniforms.light = this.parallel ? this._angleLight : this.center, this.uniforms.parallel = this.parallel, this.uniforms.dimensions[0] = i, this.uniforms.dimensions[1] = l, this.uniforms.aspect = l / i, this.uniforms.time = this.time, this.uniforms.alpha = this.alpha, e.applyFilter(this, t, n, r) }, r.angle.get = function () { return this._angle }, r.angle.set = function (e) { this._angle = e; var t = e * n.DEG_TO_RAD; this._angleLight.x = Math.cos(t), this._angleLight.y = Math.sin(t) }, r.gain.get = function () { return this.uniforms.gain }, r.gain.set = function (e) { this.uniforms.gain = e }, r.lacunarity.get = function () { return this.uniforms.lacunarity }, r.lacunarity.set = function (e) { this.uniforms.lacunarity = e }, r.alpha.get = function () { return this.uniforms.alpha }, r.alpha.set = function (e) { this.uniforms.alpha = e }, Object.defineProperties(t.prototype, r), t }(t.Filter), pe = a, de = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uVelocity;\nuniform int uKernelSize;\nuniform float uOffset;\n\nconst int MAX_KERNEL_SIZE = 2048;\n\n// Notice:\n// the perfect way:\n//    int kernelSize = min(uKernelSize, MAX_KERNELSIZE);\n// BUT in real use-case , uKernelSize < MAX_KERNELSIZE almost always.\n// So use uKernelSize directly.\n\nvoid main(void)\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        gl_FragColor = color;\n        return;\n    }\n\n    vec2 velocity = uVelocity / filterArea.xy;\n    float offset = -uOffset / length(uVelocity) - 0.5;\n    int k = uKernelSize - 1;\n\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\n        if (i == k) {\n            break;\n        }\n        vec2 bias = velocity * (float(i) / float(k) + offset);\n        color += texture2D(uSampler, vTextureCoord + bias);\n    }\n    gl_FragColor = color / float(uKernelSize);\n}\n", me = function (e) { function t(t, r, o) { void 0 === t && (t = [0, 0]), void 0 === r && (r = 5), void 0 === o && (o = 0), e.call(this, pe, de), this.uniforms.uVelocity = new Float32Array(2), this._velocity = new n.ObservablePoint(this.velocityChanged, this), this.velocity = t, this.kernelSize = r, this.offset = o } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var r = { velocity: { configurable: !0 }, offset: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { var o = this.velocity, i = o.x, l = o.y; this.uniforms.uKernelSize = 0 !== i || 0 !== l ? this.kernelSize : 0, e.applyFilter(this, t, n, r) }, r.velocity.set = function (e) { Array.isArray(e) ? this._velocity.set(e[0], e[1]) : (e instanceof n.Point || e instanceof n.ObservablePoint) && this._velocity.copyFrom(e) }, r.velocity.get = function () { return this._velocity }, t.prototype.velocityChanged = function () { this.uniforms.uVelocity[0] = this._velocity.x, this.uniforms.uVelocity[1] = this._velocity.y }, r.offset.set = function (e) { this.uniforms.uOffset = e }, r.offset.get = function () { return this.uniforms.uOffset }, Object.defineProperties(t.prototype, r), t }(t.Filter), ge = a, ve = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float epsilon;\n\nconst int MAX_COLORS = %maxColors%;\n\nuniform vec3 originalColors[MAX_COLORS];\nuniform vec3 targetColors[MAX_COLORS];\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    float alpha = gl_FragColor.a;\n    if (alpha < 0.0001)\n    {\n      return;\n    }\n\n    vec3 color = gl_FragColor.rgb / alpha;\n\n    for(int i = 0; i < MAX_COLORS; i++)\n    {\n      vec3 origColor = originalColors[i];\n      if (origColor.r < 0.0)\n      {\n        break;\n      }\n      vec3 colorDiff = origColor - color;\n      if (length(colorDiff) < epsilon)\n      {\n        vec3 targetColor = targetColors[i];\n        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);\n        return;\n      }\n    }\n}\n", xe = function (e) { function t(t, n, r) { void 0 === n && (n = .05), void 0 === r && (r = null), r = r || t.length, e.call(this, ge, ve.replace(/%maxColors%/g, r)), this.epsilon = n, this._maxColors = r, this._replacements = null, this.uniforms.originalColors = new Float32Array(3 * r), this.uniforms.targetColors = new Float32Array(3 * r), this.replacements = t } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { replacements: { configurable: !0 }, maxColors: { configurable: !0 }, epsilon: { configurable: !0 } }; return n.replacements.set = function (e) { var t = this.uniforms.originalColors, n = this.uniforms.targetColors, r = e.length; if (r > this._maxColors) throw "Length of replacements (" + r + ") exceeds the maximum colors length (" + this._maxColors + ")"; t[3 * r] = -1; for (var i = 0; i < r; i++) { var l = e[i], s = l[0]; "number" == typeof s ? s = o.hex2rgb(s) : l[0] = o.rgb2hex(s), t[3 * i] = s[0], t[3 * i + 1] = s[1], t[3 * i + 2] = s[2]; var a = l[1]; "number" == typeof a ? a = o.hex2rgb(a) : l[1] = o.rgb2hex(a), n[3 * i] = a[0], n[3 * i + 1] = a[1], n[3 * i + 2] = a[2] } this._replacements = e }, n.replacements.get = function () { return this._replacements }, t.prototype.refresh = function () { this.replacements = this._replacements }, n.maxColors.get = function () { return this._maxColors }, n.epsilon.set = function (e) { this.uniforms.epsilon = e }, n.epsilon.get = function () { return this.uniforms.epsilon }, Object.defineProperties(t.prototype, n), t }(t.Filter), ye = a, _e = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform float sepia;\nuniform float noise;\nuniform float noiseSize;\nuniform float scratch;\nuniform float scratchDensity;\nuniform float scratchWidth;\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\nuniform float seed;\n\nconst float SQRT_2 = 1.414213;\nconst vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvec3 Overlay(vec3 src, vec3 dst)\n{\n    // if (dst <= 0.5) then: 2 * src * dst\n    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)\n    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),\n                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),\n                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\n}\n\n\nvoid main()\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 color = gl_FragColor.rgb;\n\n    if (sepia > 0.0)\n    {\n        float gray = (color.x + color.y + color.z) / 3.0;\n        vec3 grayscale = vec3(gray);\n\n        color = Overlay(SEPIA_RGB, grayscale);\n\n        color = grayscale + sepia * (color - grayscale);\n    }\n\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        vec2 dir = vec2(vec2(0.5, 0.5) - coord);\n        dir.y *= dimensions.y / dimensions.x;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        color.rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    if (scratchDensity > seed && scratch != 0.0)\n    {\n        float phase = seed * 256.0;\n        float s = mod(floor(phase), 2.0);\n        float dist = 1.0 / scratchDensity;\n        float d = distance(coord, vec2(seed * dist, abs(s - seed * dist)));\n        if (d < seed * 0.6 + 0.4)\n        {\n            highp float period = scratchDensity * 10.0;\n\n            float xx = coord.x * period + phase;\n            float aa = abs(mod(xx, 0.5) * 4.0);\n            float bb = mod(floor(xx / 0.5), 2.0);\n            float yy = (1.0 - bb) * aa + bb * (2.0 - aa);\n\n            float kk = 2.0 * period;\n            float dw = scratchWidth / dimensions.x * (0.75 + seed);\n            float dh = dw * kk;\n\n            float tine = (yy - (2.0 - dh));\n\n            if (tine > 0.0) {\n                float _sign = sign(scratch);\n\n                tine = s * tine / period + scratch + 0.1;\n                tine = clamp(tine + 1.0, 0.5 + _sign * 0.5, 1.5 + _sign * 0.5);\n\n                color.rgb *= tine;\n            }\n        }\n    }\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        // vec2 d = pixelCoord * noiseSize * vec2(1024.0 + seed * 512.0, 1024.0 - seed * 512.0);\n        // float _noise = snoise(d) * 0.5;\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        color += _noise * noise;\n    }\n\n    gl_FragColor.rgb = color;\n}\n", be = function (e) { function t(t, n) { void 0 === n && (n = 0), e.call(this, ye, _e), this.uniforms.dimensions = new Float32Array(2), "number" == typeof t ? (this.seed = t, t = null) : this.seed = n, Object.assign(this, { sepia: .3, noise: .3, noiseSize: 1, scratch: .5, scratchDensity: .3, scratchWidth: 1, vignetting: .3, vignettingAlpha: 1, vignettingBlur: .3 }, t) } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { sepia: { configurable: !0 }, noise: { configurable: !0 }, noiseSize: { configurable: !0 }, scratch: { configurable: !0 }, scratchDensity: { configurable: !0 }, scratchWidth: { configurable: !0 }, vignetting: { configurable: !0 }, vignettingAlpha: { configurable: !0 }, vignettingBlur: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { this.uniforms.dimensions[0] = t.filterFrame.width, this.uniforms.dimensions[1] = t.filterFrame.height, this.uniforms.seed = this.seed, e.applyFilter(this, t, n, r) }, n.sepia.set = function (e) { this.uniforms.sepia = e }, n.sepia.get = function () { return this.uniforms.sepia }, n.noise.set = function (e) { this.uniforms.noise = e }, n.noise.get = function () { return this.uniforms.noise }, n.noiseSize.set = function (e) { this.uniforms.noiseSize = e }, n.noiseSize.get = function () { return this.uniforms.noiseSize }, n.scratch.set = function (e) { this.uniforms.scratch = e }, n.scratch.get = function () { return this.uniforms.scratch }, n.scratchDensity.set = function (e) { this.uniforms.scratchDensity = e }, n.scratchDensity.get = function () { return this.uniforms.scratchDensity }, n.scratchWidth.set = function (e) { this.uniforms.scratchWidth = e }, n.scratchWidth.get = function () { return this.uniforms.scratchWidth }, n.vignetting.set = function (e) { this.uniforms.vignetting = e }, n.vignetting.get = function () { return this.uniforms.vignetting }, n.vignettingAlpha.set = function (e) { this.uniforms.vignettingAlpha = e }, n.vignettingAlpha.get = function () { return this.uniforms.vignettingAlpha }, n.vignettingBlur.set = function (e) { this.uniforms.vignettingBlur = e }, n.vignettingBlur.get = function () { return this.uniforms.vignettingBlur }, Object.defineProperties(t.prototype, n), t }(t.Filter), Ce = a, Se = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterClamp;\n\nconst float DOUBLE_PI = 3.14159265358979323846264 * 2.;\n\nvoid main(void) {\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle <= DOUBLE_PI; angle += ${angleStep}) {\n        displaced.x = vTextureCoord.x + thickness.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n", Fe = function (e) { function t(n, r, o) { void 0 === n && (n = 1), void 0 === r && (r = 0), void 0 === o && (o = .1); var i = Math.max(o * t.MAX_SAMPLES, t.MIN_SAMPLES), l = (2 * Math.PI / i).toFixed(7); e.call(this, Ce, Se.replace(/\$\{angleStep\}/, l)), this.uniforms.thickness = new Float32Array([0, 0]), this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]), Object.assign(this, { thickness: n, color: r, quality: o }) } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { color: { configurable: !0 }, thickness: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { this.uniforms.thickness[0] = this._thickness / t._frame.width, this.uniforms.thickness[1] = this._thickness / t._frame.height, e.applyFilter(this, t, n, r) }, n.color.get = function () { return o.rgb2hex(this.uniforms.outlineColor) }, n.color.set = function (e) { o.hex2rgb(e, this.uniforms.outlineColor) }, n.thickness.get = function () { return this._thickness }, n.thickness.set = function (e) { this._thickness = e, this.padding = e }, Object.defineProperties(t.prototype, n), t }(t.Filter); Fe.MIN_SAMPLES = 1, Fe.MAX_SAMPLES = 100; var ze = a, Ae = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n", Te = function (e) { function t(t) { void 0 === t && (t = 10), e.call(this, ze, Ae), this.size = t } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { size: { configurable: !0 } }; return n.size.get = function () { return this.uniforms.size }, n.size.set = function (e) { "number" == typeof e && (e = [e, e]), this.uniforms.size = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), we = a, Oe = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float uRadian;\nuniform vec2 uCenter;\nuniform float uRadius;\nuniform int uKernelSize;\n\nconst int MAX_KERNEL_SIZE = 2048;\n\nvoid main(void)\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        gl_FragColor = color;\n        return;\n    }\n\n    float aspect = filterArea.y / filterArea.x;\n    vec2 center = uCenter.xy / filterArea.xy;\n    float gradient = uRadius / filterArea.x * 0.3;\n    float radius = uRadius / filterArea.x - gradient * 0.5;\n    int k = uKernelSize - 1;\n\n    vec2 coord = vTextureCoord;\n    vec2 dir = vec2(center - coord);\n    float dist = length(vec2(dir.x, dir.y * aspect));\n\n    float radianStep = uRadian;\n    if (radius >= 0.0 && dist > radius) {\n        float delta = dist - radius;\n        float gap = gradient;\n        float scale = 1.0 - abs(delta / gap);\n        if (scale <= 0.0) {\n            gl_FragColor = color;\n            return;\n        }\n        radianStep *= scale;\n    }\n    radianStep /= float(k);\n\n    float s = sin(radianStep);\n    float c = cos(radianStep);\n    mat2 rotationMatrix = mat2(vec2(c, -s), vec2(s, c));\n\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\n        if (i == k) {\n            break;\n        }\n\n        coord -= center;\n        coord.y *= aspect;\n        coord = rotationMatrix * coord;\n        coord.y /= aspect;\n        coord += center;\n\n        vec4 sample = texture2D(uSampler, coord);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample;\n    }\n\n    gl_FragColor = color / float(uKernelSize);\n}\n", De = function (e) { function t(t, n, r, o) { void 0 === t && (t = 0), void 0 === n && (n = [0, 0]), void 0 === r && (r = 5), void 0 === o && (o = -1), e.call(this, we, Oe), this._angle = 0, this.angle = t, this.center = n, this.kernelSize = r, this.radius = o } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { angle: { configurable: !0 }, center: { configurable: !0 }, radius: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { this.uniforms.uKernelSize = 0 !== this._angle ? this.kernelSize : 0, e.applyFilter(this, t, n, r) }, n.angle.set = function (e) { this._angle = e, this.uniforms.uRadian = e * Math.PI / 180 }, n.angle.get = function () { return this._angle }, n.center.get = function () { return this.uniforms.uCenter }, n.center.set = function (e) { this.uniforms.uCenter = e }, n.radius.get = function () { return this.uniforms.uRadius }, n.radius.set = function (e) { (e < 0 || e === 1 / 0) && (e = -1), this.uniforms.uRadius = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), Pe = a, Me = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nuniform bool mirror;\nuniform float boundary;\nuniform vec2 amplitude;\nuniform vec2 waveLength;\nuniform vec2 alpha;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 coord = pixelCoord / dimensions;\n\n    if (coord.y < boundary) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    float k = (coord.y - boundary) / (1. - boundary + 0.0001);\n    float areaY = boundary * dimensions.y / filterArea.y;\n    float v = areaY + areaY - vTextureCoord.y;\n    float y = mirror ? v : vTextureCoord.y;\n\n    float _amplitude = ((amplitude.y - amplitude.x) * k + amplitude.x ) / filterArea.x;\n    float _waveLength = ((waveLength.y - waveLength.x) * k + waveLength.x) / filterArea.y;\n    float _alpha = (alpha.y - alpha.x) * k + alpha.x;\n\n    float x = vTextureCoord.x + cos(v * 6.28 / _waveLength - time) * _amplitude;\n    x = clamp(x, filterClamp.x, filterClamp.z);\n\n    vec4 color = texture2D(uSampler, vec2(x, y));\n\n    gl_FragColor = color * _alpha;\n}\n", Re = function (e) { function t(t) { e.call(this, Pe, Me), this.uniforms.amplitude = new Float32Array(2), this.uniforms.waveLength = new Float32Array(2), this.uniforms.alpha = new Float32Array(2), this.uniforms.dimensions = new Float32Array(2), Object.assign(this, { mirror: !0, boundary: .5, amplitude: [0, 20], waveLength: [30, 100], alpha: [1, 1], time: 0 }, t) } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { mirror: { configurable: !0 }, boundary: { configurable: !0 }, amplitude: { configurable: !0 }, waveLength: { configurable: !0 }, alpha: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { this.uniforms.dimensions[0] = t.filterFrame.width, this.uniforms.dimensions[1] = t.filterFrame.height, this.uniforms.time = this.time, e.applyFilter(this, t, n, r) }, n.mirror.set = function (e) { this.uniforms.mirror = e }, n.mirror.get = function () { return this.uniforms.mirror }, n.boundary.set = function (e) { this.uniforms.boundary = e }, n.boundary.get = function () { return this.uniforms.boundary }, n.amplitude.set = function (e) { this.uniforms.amplitude[0] = e[0], this.uniforms.amplitude[1] = e[1] }, n.amplitude.get = function () { return this.uniforms.amplitude }, n.waveLength.set = function (e) { this.uniforms.waveLength[0] = e[0], this.uniforms.waveLength[1] = e[1] }, n.waveLength.get = function () { return this.uniforms.waveLength }, n.alpha.set = function (e) { this.uniforms.alpha[0] = e[0], this.uniforms.alpha[1] = e[1] }, n.alpha.get = function () { return this.uniforms.alpha }, Object.defineProperties(t.prototype, n), t }(t.Filter), ke = a, je = "precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n", Ee = function (e) { function t(t, n, r) { void 0 === t && (t = [-10, 0]), void 0 === n && (n = [0, 10]), void 0 === r && (r = [0, 0]), e.call(this, ke, je), this.red = t, this.green = n, this.blue = r } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { red: { configurable: !0 }, green: { configurable: !0 }, blue: { configurable: !0 } }; return n.red.get = function () { return this.uniforms.red }, n.red.set = function (e) { this.uniforms.red = e }, n.green.get = function () { return this.uniforms.green }, n.green.set = function (e) { this.uniforms.green = e }, n.blue.get = function () { return this.uniforms.blue }, n.blue.set = function (e) { this.uniforms.blue = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), Le = a, Ie = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\n\nuniform vec2 center;\n\nuniform float amplitude;\nuniform float wavelength;\n// uniform float power;\nuniform float brightness;\nuniform float speed;\nuniform float radius;\n\nuniform float time;\n\nconst float PI = 3.14159;\n\nvoid main()\n{\n    float halfWavelength = wavelength * 0.5 / filterArea.x;\n    float maxRadius = radius / filterArea.x;\n    float currentRadius = time * speed / filterArea.x;\n\n    float fade = 1.0;\n\n    if (maxRadius > 0.0) {\n        if (currentRadius > maxRadius) {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);\n    }\n\n    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);\n    dir.y *= filterArea.y / filterArea.x;\n    float dist = length(dir);\n\n    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    vec2 diffUV = normalize(dir);\n\n    float diff = (dist - currentRadius) / halfWavelength;\n\n    float p = 1.0 - pow(abs(diff), 2.0);\n\n    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );\n    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );\n\n    vec2 offset = diffUV * powDiff / filterArea.xy;\n\n    // Do clamp :\n    vec2 coord = vTextureCoord + offset;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    vec4 color = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    // No clamp :\n    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);\n\n    color.rgb *= 1.0 + (brightness - 1.0) * p * fade;\n\n    gl_FragColor = color;\n}\n", Xe = function (e) { function t(t, n, r) { void 0 === t && (t = [0, 0]), void 0 === n && (n = {}), void 0 === r && (r = 0), e.call(this, Le, Ie), this.center = t, Array.isArray(n) && (console.warn("Deprecated Warning: ShockwaveFilter params Array has been changed to options Object."), n = {}), n = Object.assign({ amplitude: 30, wavelength: 160, brightness: 1, speed: 500, radius: -1 }, n), this.amplitude = n.amplitude, this.wavelength = n.wavelength, this.brightness = n.brightness, this.speed = n.speed, this.radius = n.radius, this.time = r } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { center: { configurable: !0 }, amplitude: { configurable: !0 }, wavelength: { configurable: !0 }, brightness: { configurable: !0 }, speed: { configurable: !0 }, radius: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { this.uniforms.time = this.time, e.applyFilter(this, t, n, r) }, n.center.get = function () { return this.uniforms.center }, n.center.set = function (e) { this.uniforms.center = e }, n.amplitude.get = function () { return this.uniforms.amplitude }, n.amplitude.set = function (e) { this.uniforms.amplitude = e }, n.wavelength.get = function () { return this.uniforms.wavelength }, n.wavelength.set = function (e) { this.uniforms.wavelength = e }, n.brightness.get = function () { return this.uniforms.brightness }, n.brightness.set = function (e) { this.uniforms.brightness = e }, n.speed.get = function () { return this.uniforms.speed }, n.speed.set = function (e) { this.uniforms.speed = e }, n.radius.get = function () { return this.uniforms.radius }, n.radius.set = function (e) { this.uniforms.radius = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), Be = a, Ne = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D uLightmap;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 ambientColor;\nvoid main() {\n    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);\n    vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;\n    vec4 light = texture2D(uLightmap, lightCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\n}\n", Ge = function (e) { function t(t, n, r) { void 0 === n && (n = 0), void 0 === r && (r = 1), e.call(this, Be, Ne), this.uniforms.dimensions = new Float32Array(2), this.uniforms.ambientColor = new Float32Array([0, 0, 0, r]), this.texture = t, this.color = n } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { texture: { configurable: !0 }, color: { configurable: !0 }, alpha: { configurable: !0 } }; return t.prototype.apply = function (e, t, n, r) { this.uniforms.dimensions[0] = t.filterFrame.width, this.uniforms.dimensions[1] = t.filterFrame.height, e.applyFilter(this, t, n, r) }, n.texture.get = function () { return this.uniforms.uLightmap }, n.texture.set = function (e) { this.uniforms.uLightmap = e }, n.color.set = function (e) { var t = this.uniforms.ambientColor; "number" == typeof e ? (o.hex2rgb(e, t), this._color = e) : (t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], this._color = o.rgb2hex(t)) }, n.color.get = function () { return this._color }, n.alpha.get = function () { return this.uniforms.ambientColor[3] }, n.alpha.set = function (e) { this.uniforms.ambientColor[3] = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), qe = a, Ke = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    color /= total;\n    color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n", We = function (e) { function t(t, r, o, i) { void 0 === t && (t = 100), void 0 === r && (r = 600), void 0 === o && (o = null), void 0 === i && (i = null), e.call(this, qe, Ke), this.uniforms.blur = t, this.uniforms.gradientBlur = r, this.uniforms.start = o || new n.Point(0, window.innerHeight / 2), this.uniforms.end = i || new n.Point(600, window.innerHeight / 2), this.uniforms.delta = new n.Point(30, 30), this.uniforms.texSize = new n.Point(window.innerWidth, window.innerHeight), this.updateDelta() } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var r = { blur: { configurable: !0 }, gradientBlur: { configurable: !0 }, start: { configurable: !0 }, end: { configurable: !0 } }; return t.prototype.updateDelta = function () { this.uniforms.delta.x = 0, this.uniforms.delta.y = 0 }, r.blur.get = function () { return this.uniforms.blur }, r.blur.set = function (e) { this.uniforms.blur = e }, r.gradientBlur.get = function () { return this.uniforms.gradientBlur }, r.gradientBlur.set = function (e) { this.uniforms.gradientBlur = e }, r.start.get = function () { return this.uniforms.start }, r.start.set = function (e) { this.uniforms.start = e, this.updateDelta() }, r.end.get = function () { return this.uniforms.end }, r.end.set = function (e) { this.uniforms.end = e, this.updateDelta() }, Object.defineProperties(t.prototype, r), t }(t.Filter), Ye = function (e) { function t() { e.apply(this, arguments) } return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.updateDelta = function () { var e = this.uniforms.end.x - this.uniforms.start.x, t = this.uniforms.end.y - this.uniforms.start.y, n = Math.sqrt(e * e + t * t); this.uniforms.delta.x = e / n, this.uniforms.delta.y = t / n }, t }(We), Ze = function (e) { function t() { e.apply(this, arguments) } return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.updateDelta = function () { var e = this.uniforms.end.x - this.uniforms.start.x, t = this.uniforms.end.y - this.uniforms.start.y, n = Math.sqrt(e * e + t * t); this.uniforms.delta.x = -t / n, this.uniforms.delta.y = e / n }, t }(We), Qe = function (e) { function t(t, n, r, o) { void 0 === t && (t = 100), void 0 === n && (n = 600), void 0 === r && (r = null), void 0 === o && (o = null), e.call(this), this.tiltShiftXFilter = new Ye(t, n, r, o), this.tiltShiftYFilter = new Ze(t, n, r, o) } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { blur: { configurable: !0 }, gradientBlur: { configurable: !0 }, start: { configurable: !0 }, end: { configurable: !0 } }; return t.prototype.apply = function (e, t, n) { var r = e.getFilterTexture(); this.tiltShiftXFilter.apply(e, t, r, 1), this.tiltShiftYFilter.apply(e, r, n), e.returnFilterTexture(r) }, n.blur.get = function () { return this.tiltShiftXFilter.blur }, n.blur.set = function (e) { this.tiltShiftXFilter.blur = this.tiltShiftYFilter.blur = e }, n.gradientBlur.get = function () { return this.tiltShiftXFilter.gradientBlur }, n.gradientBlur.set = function (e) { this.tiltShiftXFilter.gradientBlur = this.tiltShiftYFilter.gradientBlur = e }, n.start.get = function () { return this.tiltShiftXFilter.start }, n.start.set = function (e) { this.tiltShiftXFilter.start = this.tiltShiftYFilter.start = e }, n.end.get = function () { return this.tiltShiftXFilter.end }, n.end.set = function (e) { this.tiltShiftXFilter.end = this.tiltShiftYFilter.end = e }, Object.defineProperties(t.prototype, n), t }(t.Filter), Ue = a, Ve = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n", He = function (e) { function t(t) { e.call(this, Ue, Ve), "number" == typeof t && (t = { radius: t }, void 0 !== arguments[1] && (t.angle = arguments[1]), void 0 !== arguments[2] && (t.padding = arguments[2])), Object.assign(this, { radius: 200, angle: 4, padding: 20, offset: new n.Point }, t) } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var r = { offset: { configurable: !0 }, radius: { configurable: !0 }, angle: { configurable: !0 } }; return r.offset.get = function () { return this.uniforms.offset }, r.offset.set = function (e) { this.uniforms.offset = e }, r.radius.get = function () { return this.uniforms.radius }, r.radius.set = function (e) { this.uniforms.radius = e }, r.angle.get = function () { return this.uniforms.angle }, r.angle.set = function (e) { this.uniforms.angle = e }, Object.defineProperties(t.prototype, r), t }(t.Filter), $e = a, Je = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uCenter;\nuniform float uStrength;\nuniform float uInnerRadius;\nuniform float uRadius;\n\nconst float MAX_KERNEL_SIZE = ${maxKernelSize};\n\n// author: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\nhighp float rand(vec2 co, float seed) {\n    const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n    highp float dt = dot(co + seed, vec2(a, b)), sn = mod(dt, 3.14159);\n    return fract(sin(sn) * c + seed);\n}\n\nvoid main() {\n\n    float minGradient = uInnerRadius * 0.3;\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\n\n    float gradient = uRadius * 0.3;\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\n\n    float countLimit = MAX_KERNEL_SIZE;\n\n    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\n\n    float strength = uStrength;\n\n    float delta = 0.0;\n    float gap;\n    if (dist < innerRadius) {\n        delta = innerRadius - dist;\n        gap = minGradient;\n    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity\n        delta = dist - radius;\n        gap = gradient;\n    }\n\n    if (delta > 0.0) {\n        float normalCount = gap / filterArea.x;\n        delta = (normalCount - delta) / normalCount;\n        countLimit *= delta;\n        strength *= delta;\n        if (countLimit < 1.0)\n        {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n    }\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = rand(vTextureCoord, 0.0);\n\n    float total = 0.0;\n    vec4 color = vec4(0.0);\n\n    dir *= strength;\n\n    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {\n        float percent = (t + offset) / MAX_KERNEL_SIZE;\n        float weight = 4.0 * (percent - percent * percent);\n        vec2 p = vTextureCoord + dir * percent;\n        vec4 sample = texture2D(uSampler, p);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample * weight;\n        total += weight;\n\n        if (t > countLimit){\n            break;\n        }\n    }\n\n    color /= total;\n    // switch back from pre-multiplied alpha\n    // color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n", et = function (e) { function t(t) { if ("object" != typeof t) { var n = arguments[0], r = arguments[1], o = arguments[2], i = arguments[3]; t = {}, void 0 !== n && (t.strength = n), void 0 !== r && (t.center = r), void 0 !== o && (t.innerRadius = o), void 0 !== i && (t.radius = i) } t = Object.assign({ strength: .1, center: [0, 0], innerRadius: 0, radius: -1, maxKernelSize: 32 }, t), e.call(this, $e, Je.replace("${maxKernelSize}", t.maxKernelSize.toFixed(1))), this.strength = t.strength, this.center = t.center, this.innerRadius = t.innerRadius, this.radius = t.radius } e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t; var n = { center: { configurable: !0 }, strength: { configurable: !0 }, innerRadius: { configurable: !0 }, radius: { configurable: !0 } }; return n.center.get = function () { return this.uniforms.uCenter }, n.center.set = function (e) { this.uniforms.uCenter = e }, n.strength.get = function () { return this.uniforms.uStrength }, n.strength.set = function (e) { this.uniforms.uStrength = e }, n.innerRadius.get = function () { return this.uniforms.uInnerRadius }, n.innerRadius.set = function (e) { this.uniforms.uInnerRadius = e }, n.radius.get = function () { return this.uniforms.uRadius }, n.radius.set = function (e) { (e < 0 || e === 1 / 0) && (e = -1), this.uniforms.uRadius = e }, Object.defineProperties(t.prototype, n), t }(t.Filter); return e.AdjustmentFilter = c, e.AdvancedBloomFilter = y, e.AsciiFilter = C, e.BevelFilter = z, e.BloomFilter = A, e.BulgePinchFilter = O, e.CRTFilter = Z, e.ColorMapFilter = M, e.ColorOverlayFilter = j, e.ColorReplaceFilter = I, e.ConvolutionFilter = N, e.CrossHatchFilter = K, e.DotFilter = V, e.DropShadowFilter = J, e.EmbossFilter = ne, e.GlitchFilter = ie, e.GlowFilter = ae, e.GodrayFilter = he, e.KawaseBlurFilter = d, e.MotionBlurFilter = me, e.MultiColorReplaceFilter = xe, e.OldFilmFilter = be, e.OutlineFilter = Fe, e.PixelateFilter = Te, e.RGBSplitFilter = Ee, e.RadialBlurFilter = De, e.ReflectionFilter = Re, e.ShockwaveFilter = Xe, e.SimpleLightmapFilter = Ge, e.TiltShiftAxisFilter = We, e.TiltShiftFilter = Qe, e.TiltShiftXFilter = Ye, e.TiltShiftYFilter = Ze, e.TwistFilter = He, e.ZoomBlurFilter = et, e }({}, PIXI, PIXI, PIXI, PIXI.utils, PIXI, PIXI.filters, PIXI.filters); Object.assign(PIXI.filters, __filters);
		//# sourceMappingURL=pixi-filters.js.map

	})();



	function ParticleEmitter() {
		this.initialize.apply(this, arguments);
	};
	function ParticleSystem() {
		this.initialize.apply(this, arguments);
	};


	var TRP_Localize = TRP_Localize || function () { };
	if (!TRP_Localize.localize) {
		TRP_Localize.localize = function (symbol, original, id) {
			if ($gameSystem && $gameSystem.isJapanese()) return original;
			return this.DATA[symbol][id] || this.DATA.duplication[original] || original;
		};
		TRP_Localize.noLocalize = function (original, id, translated) {
			if ($gameSystem && $gameSystem.isJapanese()) return original;
			return translated || original;
		};
		TRP_Localize.DATA = { "duplication": {}, "parPr": {}, "parMa": {}, "parEd": {}, "parGr": {}, "parGe": {}, "parSe": {}, "preWa": {} };
	}






	//PRAGMA: dataFilePath
	Game_Particle.DATA_FILE_PATH = 'TrpParticles.json';
	//PRAGMA_END: dataFilePath

	DataManager._databaseFiles.push({
		name: '$dataTrpParticles',
		src: Game_Particle.DATA_FILE_PATH,
	});
	(function () {
		"use strict";

		/*! *****************************************************************************
		Copyright (c) Microsoft Corporation. All rights reserved.
		Licensed under the Apache License, Version 2.0 (the "License"); you may not use
		this file except in compliance with the License. You may obtain a copy of the
		License at http://www.apache.org/licenses/LICENSE-2.0
		
		THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
		KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
		WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
		MERCHANTABLITY OR NON-INFRINGEMENT.
		
		See the Apache Version 2.0 License for specific language governing permissions
		and limitations under the License.
		***************************************************************************** */
		/* global Reflect, Promise */
		var extendStatics = function (d, b) {
			extendStatics = Object.setPrototypeOf ||
				({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
				function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
			return extendStatics(d, b);
		};
		function __extends(d, b) {
			extendStatics(d, b);
			function __() { this.constructor = d; }
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		/***************************************************************************** */

		//PRAGMA: pluginName
		var pluginName = 'TRP_Particle';
		//PRAGMA_END: pluginName
		var parameters = PluginManager.parameters(pluginName);
		var commandNames = (parameters['commandName'] || NLC('particle,パーティクル', 0)).split(',');
		parameters.commandNames = commandNames;

		var LC = TRP_Localize.localize.bind(TRP_Localize, 'parMa');
		var NLC = TRP_Localize.noLocalize;

		var regionMargin = Number(parameters.regionMargin) || 0;
		var outsideMargin = isNaN(parameters.outsideMargin) ? -1 : (Number(parameters.outsideMargin) || 0);
		var walkOffset = Number(parameters.walkOffset) || 0;
		var dashOffset = Number(parameters.dashOffset) || 0;
		var maxParticles = Number(parameters.maxParticles);
		var keepPictureOrder = parameters.keepPictureOrder === 'true';

		var displayCount = parameters.displayCount === 'true';
		var systemParticles = JSON.parse(parameters.systemParticles);
		var clearScreenOnMapChange = parameters.clearScreenOnMapChange === 'true';
		var clearCharacterOnMapChange = parameters.clearCharacterOnMapChange === 'true';
		var clearPartyOnMapChange = parameters.clearPartyOnMapChange === 'true';
		var clearBattleScreenOnEnd = parameters.clearBattleScreenOnEnd === 'true';
		var clearBattleCharaOnEnd = parameters.clearBattleCharaOnEnd === 'true';
		var cacheBeforeTerminate = parameters.cacheBeforeTerminate === 'true';

		var disableState = parameters.disableState === 'true';
		var disableSkill = parameters.disableSkill === 'true';
		var disableRoute = parameters.disableRoute === 'true';
		var sceneTypes = parameters.sceneTypes ? JSON.parse(parameters.sceneTypes) : [];
		var sceneGroups = [];

		var noRewriteFunctions = parameters.noRewriteFunctions === 'true';
		var errorLog = parameters.errorLog === 'true';

		var defaultImage = parameters.defaultImage = 'particle1';
		var commandNameRegex;
		(function () {
			//scene
			var length = sceneTypes.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var scene = sceneTypes[i];
				if (scene.contains('-')) {
					var group = scene.split('-');
					sceneTypes.splice(i, 1);
					Array.prototype.push.apply(sceneTypes, group);
					i -= 1;
					length -= 1;
					sceneGroups.push(group);
				}
			}

			//regex
			var regexStr = '^(?:';
			var length = commandNames.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var name = commandNames[i];
				if (i > 0) {
					regexStr += '|';
				}
				regexStr += name + ' ';
			}
			regexStr += ')';
			commandNameRegex = new RegExp(regexStr);
		})();

		function supplement(defaultValue, optionArg) {
			if (optionArg === undefined) {
				return defaultValue;
			}
			return optionArg;
		};
		function supplementNum(defaultValue, optionArg) {
			return Number(supplement(defaultValue, optionArg));
		};
		var _supplementDefWords = ['default', 'def', 'd'];
		function supplementDef(defaultValue, optionArg, otherWords) {
			var value = supplement(defaultValue, optionArg);

			var defTargetWords = otherWords || [];
			if (defTargetWords) {
				defTargetWords = defTargetWords.concat(_supplementDefWords);
			} else {
				defTargetWords = _supplementDefWords;
			}

			var length = defTargetWords.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var target = defTargetWords[i];
				if (value === target) {
					value = defaultValue;
					break;
				}
			}
			return value;
		};
		function supplementDefNum(defaultValue, optionArg, otherWords) {
			var value = supplementDef(defaultValue, optionArg, otherWords);
			return Number(value);
		};


		//PRAGMA: blendModes
		(function () {
			var blendModes = PIXI.BLEND_MODES;
			var keys = Object.keys(blendModes);
			var length = keys.length;
			var sorted = [];
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = keys[i];
				if (!isNaN(key)) {
					continue;
				}
				if (!sorted[blendModes[key]]) {
					sorted[blendModes[key]] = key;
					if (sorted.length >= 10) {
						break;
					}
				}
			}
			Game_Particle.BLEND_MODE_NAMES = sorted;
		})();
		//PRAGMA_END: blendModes


		Game_Particle.DATA_VERSION = 4;
		Game_Particle.CONFIG_PARAM_INDEXES = {
			all: ["version", "alpha", "scale", "speed", "color", "colorMode", "acceleration", "maxSpeed", "startRotation", "rotationSpeed", "angle", "mirrorType", "orderedArt", "lifetime", "blendMode", "frequency", "spawnChance", "particlesPerWave", "emitterLifetime", "maxParticles", "fluctuation", "spawnType", "pos", "spawnData", "noRotation", "addAtBack", "image", "targetType", "comment"]
			// ,all4:["version","alpha","scale","speed","color","colorMode","acceleration","maxSpeed","startRotation","rotationSpeed","angle","mirrorType","orderedArt","lifetime","blendMode","frequency","spawnChance","particlesPerWave","emitterLifetime","maxParticles","fluctuation","spawnType","pos","spawnData","noRotation","addAtBack","image","targetType","comment"]
			, all3: ["version", "alpha", "scale", "speed", "color", "colorMode", "acceleration", "maxSpeed", "startRotation", "rotationSpeed", "angle", "mirrorType", "lifetime", "blendMode", "frequency", "spawnChance", "particlesPerWave", "emitterLifetime", "maxParticles", "fluctuation", "spawnType", "pos", "spawnData", "noRotation", "addAtBack", "image", "targetType", "comment"]
			, all2: ["version", "alpha", "scale", "speed", "color", "colorMode", "acceleration", "maxSpeed", "startRotation", "rotationSpeed", "angleType", "mirrorType", "lifetime", "blendMode", "frequency", "spawnChance", "particlesPerWave", "emitterLifetime", "maxParticles", "fluctuation", "spawnType", "pos", "spawnData", "noRotation", "addAtBack", "image", "targetType", "comment"]
			, all0: ["alpha", "scale", "speed", "color", "colorMode", "acceleration", "maxSpeed", "startRotation", "rotationSpeed", "angleType", "mirrorType", "lifetime", "blendMode", "frequency", "spawnChance", "particlesPerWave", "emitterLifetime", "maxParticles", "fluctuation", "spawnType", "pos", "spawnRect", "spawnCircle", "noRotation", "addAtBack", "image", "targetType", "comment"]
			, alpha: ["list", "start", "end"]
			, scale: ["list", "minimumScaleMultiplier", "start", "end"]
			, speed: ["list", "minimumSpeedMultiplier", "start", "end"]
			, color: ["list", "start", "end"]
			, acceleration: ["x", "y"]
			, startRotation: ["min", "max"]
			, rotationSpeed: ["min", "max"]
			, lifetime: ["min", "max"]
			, fluctuation: ["max", "sensitivity"]
			, pos: ["x", "y"]
			, spawnRect: ["x", "y", "w", "h"]
			, spawnCircle: ["x", "y", "r", "minR"]
			, spawnBurst: ["particleSpacing", "angleStart", "bdt", "brt", "br", "bdr", "bdx", "bdy"]
		};
		Game_Particle.SPAWN_TYPES = ['point', 'rect', 'circle', 'ring', 'burst'];
		Game_Particle.TARGET_CATEGORIES = [['character', 'walk', 'tilemap', 'startdash'], ['screen', 'weather', 'region'], ['click', 'drag'], ['others'], ['hidden']];
		Game_Particle.CATEGORY_NAMES = ['character', 'screen', 'system', 'others', 'hidden'];
		Game_Particle.DEFAULT_DATA = {
			"alpha": {
				"list": [{
					time: 0,
					value: 0
				}, {
					time: 0.5,
					value: 1
				}, {
					time: 1,
					value: 0
				}]
			},
			"scale": {
				"list": [{
					time: 0,
					value: 0
				}, {
					time: 0.5,
					value: 1
				}, {
					time: 1,
					value: 0
				}],
				"minimumScaleMultiplier": 0.5
			},
			"speed": {
				"list": [{
					time: 0,
					value: 300
				}, {
					time: 1,
					value: 100
				}],
				"minimumSpeedMultiplier": 1
			},
			"color": {
				"list": [{
					time: 0,
					value: "#ffffff"
				}, {
					time: 1,
					value: "#ffffff"
				}]
			},
			"colorMode": 0,
			"acceleration": {
				"x": 0,
				"y": 0
			},
			"maxSpeed": NaN,
			"startRotation": {
				"min": 0,
				"max": 360
			},
			"noRotation": false,
			"rotationSpeed": {
				"min": 0,
				"max": 0
			},
			"angle": 0,
			"mirrorType": 0,
			"orderedArt": 0,
			"lifetime": {
				"min": 1,
				"max": 1
			},
			"blendMode": "add",
			"frequency": 0.01,
			"spawnChance": 1,
			"particlesPerWave": 1,
			"emitterLifetime": -1,
			"maxParticles": 10000,
			"fluctuation": {
				"max": 0,
				"sensitivity": 0
			},
			"spawnType": "point",
			"pos": {
				"x": 0,
				"y": 0
			},
			"spawnRect": null,
			"spawnCircle": null,
			"particleSpacing": 0,
			"angleStart": 0,
			"bdt": 0,
			"brt": 0,
			"br": 0,
			"bdr": 0,
			"bdx": 0,
			"bdy": 0,
			"addAtBack": false,
			"noRotation": false,
			"image": null,
			"targetType": 0,
			"comment": "",
		};
		Game_Particle.compressConfigDataToArray = function (data) {
			var array = [];
			var dataKeys = Object.keys(data);

			var allKeys = Game_Particle.CONFIG_PARAM_INDEXES.all.concat();
			var length = allKeys.length;

			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = allKeys[i];
				if (key === 'version') {
					array.push(Game_Particle.DATA_VERSION);
				} else if (key === 'spawnData') {
					var spawnType = data.spawnType;
					if (spawnType === 'rect') {
						allKeys.splice(i + 1, 0, 'spawnRect');
						length += 1;
					} else if (spawnType === 'circle' || spawnType === 'ring') {
						allKeys.splice(i + 1, 0, 'spawnCircle');
						length += 1;
					} else if (spawnType === 'burst') {
						array.push([data.particleSpacing, data.angleStart, data.bdt || 0, data.brt || 0, data.br || 0, data.bdx || 0, data.bdy || 0]);
					} else {
						array.push(null);
					}
				} else if (dataKeys.indexOf(key) >= 0) {
					var type = typeof data[key];
					if (data[key] && type === 'object') {
						var childObj = data[key];
						var childArr = [];
						array.push(childArr);

						var childKeys = Game_Particle.CONFIG_PARAM_INDEXES[key];
						var childKeyLen = childKeys.length;
						for (var j = 0; j < childKeyLen; j = (j + 1) | 0) {
							var childKey = childKeys[j];
							if (childKey === 'list' && childObj[childKey]) {
								var list = childObj[childKey];
								var listLen = list.length;
								var listArr = [];
								childArr.push(listArr);
								for (var k = 0; k < listLen; k = (k + 1) | 0) {
									listArr.push(list[k].time);
									listArr.push(list[k].value);
								}
							} else if (childObj[childKey] === undefined && (childKey === 'start' || childKey === 'end')) {
								continue;
							} else {
								childArr.push(childObj[childKey] || 0);
							}
						}
					} else if (type === 'string') {
						if (key === 'blendMode') {
							array.push(PIXI.BLEND_MODES[data[key].toUpperCase()]);
						} else if (key === 'spawnType') {
							array.push(Game_Particle.SPAWN_TYPES.indexOf(data[key]));
						} else {
							array.push(data[key]);
						}
					} else if (type === 'boolean') {
						array.push(data[key] === true ? 1 : 0);
					} else {
						array.push(data[key]);
					}
				} else {
					if (Game_Particle.CONFIG_PARAM_INDEXES[key]) {
						array.push(null);
					} else if (key === 'comment') {
						array.push('');
					} else {
						array.push(0);
					}
				}
			}
			return array;
		};
		Game_Particle.decompressConfigDataFromArray = function (array) {
			var data = JsonEx.makeDeepCopy(Game_Particle.DEFAULT_DATA);
			var allKeys;

			if (!isNaN(array[0])) {
				var version = array.shift();
				if (version === Game_Particle.DATA_VERSION) {
					allKeys = Game_Particle.CONFIG_PARAM_INDEXES.all.concat();
				} else {
					allKeys = Game_Particle.CONFIG_PARAM_INDEXES['all' + version].concat();
				}
				allKeys.shift();
			} else {
				allKeys = Game_Particle.CONFIG_PARAM_INDEXES.all0.concat();
			}

			var length = allKeys.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = allKeys[i];
				if (key === 'spawnData') {
					var childArr = array[i];
					if (data.spawnType === 'rect') {
						allKeys.splice(i + 1, 0, 'spawnRect');
						array.splice(i + 1, 0, childArr);
						length += 1;
					} else if (data.spawnType === 'circle' || data.spawnType === 'ring') {
						allKeys.splice(i + 1, 0, 'spawnCircle');
						array.splice(i + 1, 0, childArr);
						length += 1;
					} else if (data.spawnType === 'burst') {
						data.particleSpacing = childArr[0];
						data.angleStart = childArr[1];
						data.bdt = childArr[2] || 0;
						data.brt = childArr[3] || 0;
						data.br = childArr[4] || 0;
						data.bdx = childArr[5] || 0;
						data.bdy = childArr[6] || 0;
					}
				} else if (Game_Particle.CONFIG_PARAM_INDEXES[key]) {
					var childArr = array[i];

					if (!childArr) {
						data[key] = null;
					} else {
						var childKeys = Game_Particle.CONFIG_PARAM_INDEXES[key];
						var childObj = {};
						data[key] = childObj || null;
						var childKeyLen = childKeys.length;
						for (var j = 0; j < childKeyLen; j = (j + 1) | 0) {
							var childKey = childKeys[j];
							if (childKey === 'list') {
								var listArr = childArr[j];
								var list = [];
								childObj[childKey] = list;
								var listLen = listArr.length;
								for (var k = 0; k < listLen; k = (k + 2) | 0) {
									list.push({
										time: listArr[k],
										value: listArr[k + 1]
									});
								}
							} else if (key === 'color' && (childKey === 'start' || childKey === 'end')) {
								childObj[childKey] = childArr[j] || '#ffffff';
							} else {
								childObj[childKey] = childArr[j] || 0;
							}
						}
					}
				} else {
					if (key === 'angleType') {
						//migrate under V3: angleType > angle
						data.angle = (array[i] === 1 ? -1 : 0);
					} else if (key === 'blendMode') {
						data[key] = Game_Particle.BLEND_MODE_NAMES[array[i] || 0];
					} else if (key === 'spawnType') {
						data[key] = Game_Particle.SPAWN_TYPES[array[i] || 0];
					} else if (key === 'noRotation' || key === 'addAtBack') {
						data[key] = array[i] ? true : false;
					} else if (key === 'image' || key === 'comment') {
						data[key] = array[i] || '';
					} else {
						data[key] = array[i] || 0;
					}
				}
			}
			return data;
		};

		ParticleEmitter.Z_INDEX = {
			screen: -1000,
			spriteset: -900,
			back: -800,
			below: 1,
			above: 5,
			top: 9,
		};

		var Z_INDEX = ParticleEmitter.Z_INDEX;
		ParticleEmitter.TARGET_TYPES = {
			displayObject: -1,

			character: 0,
			walk: 1,
			startdash: 2,
			attach: 3,
			tilemap: 4,

			screen: 5,
			weather: 6,
			region: 7,

			party: 8,
			enemy: 9,
			battle: 10,
			battleWeather: 11,

			click: 12,
			drag: 13,

			picture: 14,
			skit: 15,
			battlePicture: 16,
			battleSkit: 17,

			attachParty: 18,
			attachEnemy: 19,

			back: 20,
			weatherBack: 21,

			actor: 22,
			attachActor: 23,
		};
		var TARGET_TYPES = ParticleEmitter.TARGET_TYPES;
		ParticleEmitter.DELTA_TIME = 1 / 60;


		ParticleEmitter.NODE_PARAMS = ['alpha', 'speed', 'scale', 'color'];
		ParticleEmitter.NODE_KEY_CONVERT = {
			alpha: 'startAlpha',
			speed: 'startSpeed',
			scale: 'startScale',
			color: 'startColor'
		};

		var CLEAR_ARGS = ['clear', NLC('クリア', 1), NLC('クリアー', 2), NLC('消去', 3)];
		var SET_COMMANDS = ['set', 'play', 'edit'];


		//PRAGMA: registerCommands
		//PRAGMA_END: registerCommands




		//=============================================================================
		// core Game_Objects
		//=============================================================================
		var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
		Game_Interpreter.prototype.pluginCommand = function (command, args) {
			if (commandNames.contains(command.toLowerCase())) {
				var subCommand = args[0];
				if (subCommand === 'test') {
					this.trpParticleTest();
				} else if (subCommand === 'test2') {
					this.trpParticleTest2();
				} else {
					$gameScreen._particle.pluginCommand(this, args, this.eventId());
				}
			} else {
				_Game_Interpreter_pluginCommand.call(this, command, args);
			}
		};

		var _Game_Screen_initialize = Game_Screen.prototype.initialize;
		Game_Screen.prototype.initialize = function () {
			_Game_Screen_initialize.call(this);
			this._particle = new Game_Particle();
		};
		Game_Screen.prototype.tryCreateParticle = function () {
			if (!this._particle) {
				this._particle = new Game_Particle();
			}
			if (!this._particle._groups) {
				this._particle._groups = {};
			}
			if (!this._particle._groupKeys) {
				this._particle._groupKeys = [];
			}
		};

		var _Game_Screen_update = Game_Screen.prototype.update;
		Game_Screen.prototype.update = function () {
			_Game_Screen_update.call(this);

			this._particle.update();
		};



		/* Scene_Map
		===================================*/
		var _Scene_Map_start = Scene_Map.prototype.start;
		Scene_Map.prototype.start = function () {
			if ($gameMap && $gameScreen._particle) {
				$gameScreen._particle.willStartSceneMap();
			}

			_Scene_Map_start.call(this);
		};


		/* Event
		===================================*/
		var _Game_Event_setupPage = Game_Event.prototype.setupPage;
		Game_Event.prototype.setupPage = function () {
			_Game_Event_setupPage.call(this);

			if (SceneManager._scene._mapLoaded) {
				this.setupParticles();
			}
		};

		Game_Event.prototype.setupParticles = function () {
			var page = this.page();
			if (!page) return;
			var list = page.list;
			var length = list.length;

			for (var i = 0; i < length; i = (i + 1) | 0) {
				var command = list[i];
				if (command.code !== 108 && command.code !== 408) break;
				var line = command.parameters[0];
				if (typeof line === 'string') {
					if (commandNameRegex.test(line)) {
						var args = line.split(' ');
						args.shift();
						if (args[0] === 'edit') {
							$gameScreen._particle.reservePluginCommand(4, $gameMap._interpreter, args, this.eventId());
						} else {
							$gameScreen._particle.pluginCommand($gameMap._interpreter, args, this.eventId());
						}
					}
				}
			}
		};

		/* Game_Battler
		===================================*/
		Game_Battler.prototype.setupStatesParticles = function () {
			var states = this._states;
			var length = states ? states.length : 0;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var state = $dataStates[states[i]];
				if (state) {
					this.setupStateParticles(state);
				}
			}
		};

		Game_Battler.prototype.setupStateParticles = function (state) {
			var meta = state.meta;
			if (!meta.particle && !meta.particle1) return;

			var targetId = this.particleTargetId();
			var tag = 'state:' + targetId + ':' + state.id;
			this.setupParticlesWithMeta(meta, targetId, tag);
		};

		Game_Battler.prototype.particleTargetId = function () {
			var targetId;
			if (this.isEnemy()) {
				targetId = 'enemy:' + (this.index() + 1);
			} else {
				targetId = this.isActor() ? ('actor:' + this.actorId()) : ('party:' + (this.index() + 1));
			}

			return targetId;
		};


		/* State
		===================================*/
		if (!disableState) {
			var _Game_Battler_addNewState = Game_Battler.prototype.addNewState;
			Game_Battler.prototype.addNewState = function (stateId) {
				_Game_Battler_addNewState.call(this, stateId);

				var state = $dataStates[stateId];
				if (state && state.meta) {
					this.setupStateParticles(state);
				}
			};

			var _Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
			Game_BattlerBase.prototype.eraseState = function (stateId) {
				_Game_BattlerBase_eraseState.call(this, stateId);

				var state = $dataStates[stateId];
				if (state && state.meta) {
					this.eraseStateParticles(state);
				}
			};

			Game_Battler.prototype.eraseStateParticles = function (state) {
				var meta = state.meta;
				if (!meta.particle && !meta.particle1) return;

				var tag = 'state:' + this.particleTargetId() + ':' + state.id;
				var targetId = 'tag:' + tag;
				$gameScreen._particle.particleClear(targetId, false);
			};
		};

		Game_Battler.prototype.setupParticlesWithMeta = function (meta, targetId, tag) {
			tag = tag || '';

			var argsStr = meta.particle || meta.particle1;
			var idx = 1;
			var interpreter = $gameTroop._interpreter;
			var dummyEventId = 0;

			var suffix = ':' + targetId;
			$gameScreen._particle.setAutoIdSuffix(suffix);
			while (!!argsStr) {
				argsStr = argsStr.replace('this', targetId);
				var args = argsStr.split(" ");
				if (tag && !argsStr.contains('tag:') && SET_COMMANDS.contains(args[0])) {
					args.push('tag:' + tag);
				}
				$gameScreen._particle.pluginCommand(interpreter, args, dummyEventId);

				idx += 1;
				argsStr = meta['particle' + idx];
			}
			$gameScreen._particle.clearAutoIdSuffix();
		};


		var _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
		Game_Battler.prototype.onBattleStart = function (advantageous) {
			_Game_Battler_onBattleStart.call(this, ...arguments);

			this.setupStatesParticles();
		};

		/* party
		===================================*/
		var _Game_Party_addActor = Game_Party.prototype.addActor;
		Game_Party.prototype.addActor = function (actorId) {
			_Game_Party_addActor.call(this, actorId);

			var actor = $gameActors.actor(actorId);
			if (actor) {
				actor.setupStatesParticles();
			}
		};

		var _Game_Party_swapOrder = Game_Party.prototype.swapOrder;
		Game_Party.prototype.swapOrder = function (index1, index2) {
			_Game_Party_swapOrder.call(this, ...arguments);

			var actor1 = $gameActors.actor(this._actors[index1]);
			var actor2 = $gameActors.actor(this._actors[index2]);
			if (actor1) {
				actor1.setupStatesParticles();
			}
			if (actor2) {
				actor2.setupStatesParticles();
			}
		};




		/* Troop&Enemy
		===================================*/
		var _Game_Troop_setup = Game_Troop.prototype.setup;
		Game_Troop.prototype.setup = function (troopId) {
			_Game_Troop_setup.apply(this, arguments);
			var members = this._enemies;
			var length = members.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				members[i].setupParticles();
			}
		};

		Game_Enemy.prototype.setupParticles = function () {
			var data = this.enemy();
			if (!data) return;

			var targetId = this.particleTargetId();
			this.setupParticlesWithMeta(data.meta, targetId);
		};

		var _Game_Enemy_die = Game_Enemy.prototype.die;
		Game_Enemy.prototype.die = function () {
			_Game_Enemy_die.call(this);

			$gameScreen._particle.clearEnemyTargetParticles(this);
		};

		var _Game_Enemy_revive = Game_Enemy.prototype.revive;
		Game_Enemy.prototype.revive = function () {
			_Game_Enemy_revive.call(this);
			this.setupParticles();
		};

		/* skill
		===================================*/
		if (!disableSkill) {
			var _Window_BattleLog_startAction = Window_BattleLog.prototype.startAction;
			Window_BattleLog.prototype.startAction = function (subject, action, targets) {
				_Window_BattleLog_startAction.apply(this, arguments);
				var item = action.item();
				if (item) {
					this.showParticleEffect(subject, targets, item);
				}
			};
			Window_BattleLog.prototype.showParticleEffect = function (subject, targets, item) {
				var argsStr = item.meta.particle || item.meta.particle1;
				var delayStr = item.meta.particleDelay || item.meta.particle1Delay || item.meta.particleDelay1 || item.meta.particle1delay;

				var idx = 1;
				var interpreter = $gameTroop._interpreter;
				var dummyEventId = 0;

				var subjectId = subject.particleTargetId();

				var targetIds = [];
				var length = targets ? targets.length : 0;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var target = targets[i];
					var targetId = target.particleTargetId();
					targetIds.push(targetId);
				}

				while (!!argsStr) {
					argsStr = argsStr.replace('this', subjectId);
					var args = argsStr.split(" ");
					var targetIdx = args.indexOf('target');
					var isAttach = false;
					if (targetIdx < 0) {
						targetIdx = args.indexOf('attach:target');
						if (targetIdx >= 0) {
							isAttach = true;
						}
					}
					if (targetIdx >= 0) {
						for (var i = 0; i < length; i = (i + 1) | 0) {
							if (i > 0) args = args.concat();

							var targetId = targetIds[i];
							args[targetIdx] = (isAttach ? 'attach:' : '') + targetId;

							var suffix = ':' + targetId;
							$gameScreen._particle.setAutoIdSuffix(suffix);
							if (!isNaN(delayStr)) {
								$gameScreen._particle.reservePluginCommand(Number(delayStr), interpreter, args, dummyEventId);
							} else {
								$gameScreen._particle.pluginCommand(interpreter, args, dummyEventId);
							}
						}
					} else {
						var suffix = ':' + subjectId;
						$gameScreen._particle.setAutoIdSuffix(suffix);
						if (!isNaN(delayStr)) {
							$gameScreen._particle.reservePluginCommand(Number(delayStr), interpreter, args, dummyEventId);
						} else {
							$gameScreen._particle.pluginCommand(interpreter, args, dummyEventId);
						}
					}

					idx += 1;
					argsStr = item.meta['particle' + idx];
					delayStr = item.meta['particle' + idx + 'Delay'] || item.meta['particle' + idx + 'delay'] || item.meta['particleDelay' + idx];
				}
				$gameScreen._particle.clearAutoIdSuffix();
			};
		}

		/* Scene_Battle
		===================================*/
		var _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
		Scene_Battle.prototype.terminate = function () {
			_Scene_Battle_terminate.call(this);

			if (clearBattleScreenOnEnd) {
				$gameScreen._particle.removeBattleScreenParticles();
			}
			if (clearBattleCharaOnEnd) {
				$gameScreen._particle.removeBattleCharacterParticles();
			}
		};


		//=============================================================================
		// Manager
		//=============================================================================
		ImageManager.loadParticle = function (filename, hue) {
			return this.loadBitmap('img/particles/', filename, hue, true);
		};

		var _SceneManager_changeScene = SceneManager.changeScene;
		SceneManager.changeScene = function () {
			if (this.isSceneChanging() && !this.isCurrentSceneBusy() && $gameScreen && $gameScreen._particle) {
				$gameScreen._particle.willSceneChange();
			}
			_SceneManager_changeScene.call(this);
		};

		var _DataManager_loadDataFile = DataManager.loadDataFile;
		DataManager.loadDataFile = function (name, src) {
			if (src.contains('Test_') && src.contains('TrpParticles')) {
				src = Game_Particle.DATA_FILE_PATH;
			}
			_DataManager_loadDataFile.call(this, name, src);
		};


		var _DataManager_extractSaveContents = DataManager.extractSaveContents;
		DataManager.extractSaveContents = function (contents) {
			_DataManager_extractSaveContents.call(this, contents);

			$gameScreen.tryCreateParticle();
		};


		//=============================================================================
		// Scene
		//=============================================================================
		var _Scene_Base_initialize = Scene_Base.prototype.initialize;
		Scene_Base.prototype.initialize = function () {
			_Scene_Base_initialize.call(this);
			this.initializeParticleSystem();
		};
		Scene_Base.prototype.initializeParticleSystem = function () {
			this._particleSystem = null;
		};

		var _Scene_Base_create = Scene_Base.prototype.create;
		Scene_Base.prototype.create = function () {
			_Scene_Base_create.call(this);
			if ($gameScreen && $gameScreen._particle && this.useParticleSystem()) {
				this.createParticleSystem();
			};
		};
		Scene_Base.prototype.createParticleSystem = function () {
			if (ParticleSystem.temporallyCacheForGroupedScene) {
				this._particleSystem = ParticleSystem.temporallyCacheForGroupedScene;
				ParticleSystem.temporallyCacheForGroupedScene = null;
			} else {
				this._particleSystem = new ParticleSystem();
			}
		};
		var _Scene_Base_start = Scene_Base.prototype.start;
		Scene_Base.prototype.start = function () {
			_Scene_Base_start.call(this);
			if (this._particleSystem) {
				this._particleSystem.tryRestoreFromCache(this);
			}
		};

		Scene_Base.prototype.useParticleSystem = function () {
			return true;
		};

		var _Scene_Base_update = Scene_Base.prototype.update;
		Scene_Base.prototype.update = function () {
			_Scene_Base_update.call(this);
			if (this._particleSystem) {
				this._particleSystem.update(this);
			}
		};

		Scene_Base.prototype.isParticleTargetTypeValid = function (type, targetId) {
			switch (type) {
				case TARGET_TYPES.click:
				case TARGET_TYPES.drag:
				case TARGET_TYPES.displayObject:
					return true;
				case TARGET_TYPES.scene:
				default:
					if (type < -1) {
						return sceneTypes[-type - 2] === this.constructor.name;
					}
					return false;
			}
		};

		/* Scene_Boot
		===================================*/
		var _Scene_Boot_start = Scene_Boot.prototype.start;
		Scene_Boot.prototype.start = function () {
			_Scene_Boot_start.call(this);
			ParticleSystem.setupSystemParticles();
		};

		/* Scene_Map
		===================================*/
		Scene_Map.prototype.initializeParticleSystem = function () {
			Scene_Base.prototype.initializeParticleSystem.call(this);
			this._useCachedParticleSystem = false;
		};
		Scene_Map.prototype.createParticleSystem = function () {
			if (ParticleSystem.temporallyCacheForSceneMap && ParticleSystem.cacheMapId === $gameMap.mapId()) {
				this._particleSystem = ParticleSystem.temporallyCacheForSceneMap;
				ParticleSystem.clearCache();
				this._useCachedParticleSystem = true;
			} else {
				Scene_Base.prototype.createParticleSystem.call(this);
			}
		};
		Scene_Map.prototype.useParticleSystem = function () {
			return true;
		};
		Scene_Map.prototype.isParticleTargetTypeValid = function (type, targetId) {
			if (type < -1) return false;

			switch (type) {
				case TARGET_TYPES.party:
				case TARGET_TYPES.enemy:
				case TARGET_TYPES.attachParty:
				case TARGET_TYPES.attachEnemy:
				case TARGET_TYPES.battle:
				case TARGET_TYPES.battleWeather:
				case TARGET_TYPES.battlePicture:
				case TARGET_TYPES.battleSkit:
				case TARGET_TYPES.actor:
				case TARGET_TYPES.attachActor:
					return false;
				default:
					return true;
			}
		};

		var _Scene_Map_terminate = Scene_Map.prototype.terminate;
		if (cacheBeforeTerminate) {
			Scene_Map.prototype.terminate = function () {
				if (SceneManager.isNextScene(Scene_Menu)) {
					if (this._particleSystem) {
						this._particleSystem.cacheForMap();
						this._particleSystem = null;
					}
				}
				_Scene_Map_terminate.call(this);
			};
		} else {
			Scene_Map.prototype.terminate = function () {
				_Scene_Map_terminate.call(this);
				if (SceneManager.isNextScene(Scene_Menu)) {
					if (this._particleSystem) {
						this._particleSystem.cacheForMap();
						this._particleSystem = null;
					}
				}
			};
		}


		var _Scene_Base_terminate = Scene_Base.prototype.terminate;
		Scene_Base.prototype.terminate = function () {
			this.tryCacheParticleSystem();
			_Scene_Base_terminate.call(this);
		};
		Scene_Base.prototype.tryCacheParticleSystem = function () {
			if (!this._particleSystem) return;
			var length = sceneGroups.length;

			var next = SceneManager._nextScene ? SceneManager._nextScene.constructor.name : '';
			if (!next) return;

			var constructor = this.constructor.name;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var group = sceneGroups[i];
				if (group.contains(constructor) && group.contains(next)) {
					this._particleSystem.cacheForGroupedScene();
					return;
				}
			}
		};


		/* Scene_Battle
		===================================*/
		Scene_Battle.prototype.useParticleSystem = function () {
			return true;
		};
		Scene_Battle.prototype.isParticleTargetTypeValid = function (type, targetId) {
			if (type < -1) return false;

			switch (type) {
				case TARGET_TYPES.character:
				case TARGET_TYPES.attach:
				case TARGET_TYPES.tilemap:
				case TARGET_TYPES.screen:
				case TARGET_TYPES.weather:
				case TARGET_TYPES.walk:
				case TARGET_TYPES.startdash:
				case TARGET_TYPES.region:
				case TARGET_TYPES.picture:
				case TARGET_TYPES.skit:
					return false;
				default:
					return true;
			}
		};

		/* Scene_Load
		===================================*/
		var _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
		Scene_Load.prototype.onLoadSuccess = function () {
			ParticleSystem.clearCache();
			_Scene_Load_onLoadSuccess.call(this);
		};



		//=============================================================================
		// Game_Character
		//=============================================================================
		if (!disableRoute) {
			var _Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
			Game_Character.prototype.processMoveCommand = function (command) {
				if (command.code === Game_Character.ROUTE_SCRIPT &&
					/particle /.test(command.parameters[0])) {
					var params = command.parameters[0].split(' ');
					params.shift();
					var charaId = (this instanceof Game_Event ? this._eventId : 0);
					$gameScreen._particle.pluginCommand($gameMap._interpreter, params, charaId);
				} else {
					_Game_Character_processMoveCommand.call(this, command);
				}
			};
		}



		//=============================================================================
		// Game_Particle
		//=============================================================================
		Game_Particle.displayObjects = {};
		Game_Particle.clearDisplayObjects = function () {
			Game_Particle.displayObjects = {};
		};
		Game_Particle.defaultImage = function () {
			return parameters.defaultImage || 'particle1';
		};
		Game_Particle.isPlayCommands = function (sub) {
			return sub === 'play' || sub === 'set' || sub === 'edit';
		};

		Game_Particle.prototype.initialize = function () {
			this._data = {};
			this._keys = [];
			this._lastMapId = 0;
			this._tagInfo = {};
			this.maxParticles = maxParticles || 0;
			this._suffix = '';
			this._skitIds = [];
			this._reservedCommands = [];

			this.resetMaxParticles();
		};

		Game_Particle.EVENT_ID_REGEXP = /-EID$/;
		Game_Particle.prototype.processArgsEventId = function (args, eventId) {
			var length = args.length;
			var regexp = Game_Particle.EVENT_ID_REGEXP;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var arg = args[i];
				if (typeof arg === 'string' && regexp.test(arg)) {
					args[i] = arg.replace(regexp, '-' + String(eventId));
				}
			}
		};

		Game_Particle.prototype.convertEscapeCharacters = function (args) {
			var length = args.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				if (typeof args[i] !== 'string') continue;
				var arg = args[i];
				arg = arg.replace(/\\/g, "\x1b");
				arg = arg.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
					$gameVariables.value(parseInt(p1))
				);
				arg = arg.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
					$gameVariables.value(parseInt(p1))
				);
				arg = arg.replace(/\x1bJ\[(.+?)]/gi, function (_, p1) {
					return eval(p1) || '';
				})
				args[i] = arg;
			}
		};

		Game_Particle.prototype.pluginCommand = function (interpreter, args, eventId) {
			var sub = args.shift().toLowerCase();

			this.convertEscapeCharacters(args);

			//process eid
			if (!isNaN(eventId)) {
				this.processArgsEventId(args, eventId);
			}

			this._pluginCommand(interpreter, sub, args, eventId);
		};

		Game_Particle.prototype._pluginCommand = function (interpreter, sub, args, eventId) {
			var tag;
			if (Game_Particle.isPlayCommands(sub)) {
				tag = this.extractTagRegister(args);

				var targetId = '';
				if (sub === 'set') {
					args.unshift(eventId);
					Game_Particle.prototype.particleSet.apply(this, args);
					targetId = args[1];
				} else if (sub === 'play') {
					args.unshift(eventId);
					Game_Particle.prototype.particlePlay.apply(this, args);
					targetId = args[1];
				} else if (sub === 'edit') {
					var copyName = '';
					if (typeof args[args.length - 1] === 'string') {
						if (args[args.length - 1].indexOf('copy:') === 0) {
							copyName = args.pop().replace('copy:', '');
						}
					}
					args.unshift(copyName);
					args.unshift(eventId);
					if (Game_Particle.prototype._particleEdit.apply(this, args) && interpreter) {
						interpreter.wait(1);
					}
					targetId = args[2];
				}
				//register tag
				if (tag) {
					this.particleTag(targetId, tag);
				}
			} else if (sub === 'repeat') {
				Game_Particle.prototype.particleRepeat.apply(this, args);
			} else if (sub === 'on') {
				Game_Particle.prototype.particleOn.apply(this, args);
			} else if (sub === 'off') {
				Game_Particle.prototype.particleOff.apply(this, args);
			} else if (sub === 'clear') {
				Game_Particle.prototype.particleClear.apply(this, args);
			} else if (sub === 'update') {
				this.particleUpdate(args);
			} else if (sub === 'animate') {
				this.particleAnimate(args);
			} else if (sub === 'exceed') {
				Game_Particle.prototype.particleExceed.apply(this, args);
			} else if (sub === 'screenLoop' || sub === 'loop') {
				Game_Particle.prototype.particleLoop.apply(this, args);
			} else if (sub === 'filter') {
				this.particleFilter(args);
			} else if (sub === 'max') {
				if (isNaN(args[0])) {
					this.resetMaxParticles();
				} else {
					this.maxParticles = Number(args[0]);
				}

			} else if (sub === 'flash') {
				$gameScreen.startFlash([Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3])], Number(args[4]));
			} else if (sub === 'shake') {
				$gameScreen.startShake(Number(args[0]), Number(args[1]), Number(args[2]));
			} else if (sub === 'se') {
				AudioManager.playSe({ name: args[0], volume: Number(args[1]) || 90, pitch: Number(args[2]) || 100, pan: Number(args[3]) || 0 })

			} else if (sub === 'reserve') {
				this.reservePluginCommand(Number(args.shift()), interpreter, args, eventId);
			}
		};

		Game_Particle.prototype.reservePluginCommand = function (delay, interpreter, args, eventId) {
			this._reservedCommands = this._reservedCommands || [];
			this._reservedCommands.push([Number(delay), interpreter, args, eventId, this._suffix]);
		};

		Game_Particle.prototype.update = function () {
			if (this._reservedCommands && this._reservedCommands.length > 0) {
				this.updateReservedCommands();
			}

			var keys = this._keys;
			var length = keys.length;
			var destroyed = false;
			for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
				var key = keys[i];
				var data = this._data[key];
				if (!data || data.destroy) {
					keys.splice(i, 1);
					delete this._data[key];

					if (Game_Particle.displayObjects[key]) {
						delete Game_Particle.displayObjects[key];
					}
					destroyed = true;
				} else if (data.animations) {
					this.updateAnimations(key, data);
				}
			}
			if (destroyed) {
				this.truncateTagInfo();
			}
		};
		Game_Particle.prototype.updateReservedCommands = function () {
			var length = this._reservedCommands.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var command = this._reservedCommands[i];
				command[0] -= 1;
				if (command[0] <= 0) {
					var hasSuffix = command.length >= 5;
					if (hasSuffix) {
						this.setAutoIdSuffix(command[4]);
					}
					this.pluginCommand(command[1], command[2], command[3]);
					if (hasSuffix) {
						this.clearAutoIdSuffix();
					}
					this._reservedCommands.splice(i, 1);
					length -= 1;
					i -= 1;
				}
			}
		}

		Game_Particle.prototype.idWithSuffix = function (id) {
			var idx = id.indexOf(this._suffix);
			if (this._suffix &&
				(idx < 0 || idx !== id.length - this._suffix.length)) {
				id += this._suffix;
			}
			return id;
		};
		Game_Particle.prototype.particleSet = function (eventId, id, target, name, z, x, y, image) {
			name = supplementDef(id, name) || id;
			id = this.idWithSuffix(id);

			if (!!this._data[id]) {
				this.particleOn(id);
				return;
			}

			var data = this.particleData(eventId, id, target, name, z, x, y, image);
			if (!data) return;

			this._data[id] = data;
			this._keys.push(id);
			return data;
		};

		Game_Particle.prototype.particleData = function (eventId, id, target, name, z, x, y, image, ignoreError = false) {
			x = Number(x) || 0;
			y = Number(y) || 0;

			if (!ignoreError && !Game_Particle.configDataWithName(name)) {
				if (errorLog) {
					throw new Error(LC('設定名:%1のパーティクル設定データが存在しません。', 4).format(name));
				}
				return;
			}
			if (!ignoreError && errorLog && target === undefined) {
				throw new Error(LC('パーティクル表示コマンドの対象が設定されてません。', 6) + '(ID:' + id + ')');
			}

			var targetType = TARGET_TYPES.character;
			var targetId = 0;
			var exData = null;
			var elems;
			if (target instanceof PIXI.Container) {
				targetType = TARGET_TYPES.displayObject;
				targetId = id;
				Game_Particle.displayObjects[id] = target;
			} else if (target.toLowerCase().contains('scene_')) {
				targetType = sceneTypes.indexOf(target);
				if (errorLog && targetType < 0) {
					throw new Error(LC('対象のシーンが登録されてませんされてません。(対象:%1)', 7).foramt(target));
				}
				targetType = -targetType - 2;
			} else if (target === 'this') {
				targetId = eventId;
			} else if (!isNaN(target)) {
				targetId = Number(target);
			} else if (target === 'player') {
				targetId = 0;
			} else if (target === 'tilemap') {
				targetType = TARGET_TYPES.tilemap;
			} else {
				var targetElems = target.split(':');
				targetId = targetElems.length >= 2 ? Number(targetElems[1]) : 0;
				switch (targetElems[0].toLowerCase()) {
					case 'follower':
						targetType = TARGET_TYPES.character;
						targetId *= -1;
						break;
					case 'attach':
						targetElems.shift();
						if (targetElems[0] === 'party') {
							targetType = TARGET_TYPES.attachParty;
							targetId = targetElems[1];
						} else if (targetElems[0] === 'enemy') {
							targetType = TARGET_TYPES.attachEnemy;
							targetId = targetElems[1];
						} else if (targetElems[0] === 'actor') {
							targetType = TARGET_TYPES.attachActor;
							targetId = targetElems[1];
						} else {
							targetType = TARGET_TYPES.attach;
							targetId = this.processCharacterTargetId(targetElems, eventId);
						}
						break;
					case 'walk':
					case 'startdash':
						targetType = TARGET_TYPES[targetElems.shift()];
						targetId = this.processCharacterTargetId(targetElems, eventId);

						if (targetElems[0]) {
							exData = exData || {};
							exData.regions = [];
							targetElems[0].split(',').forEach(function (regionId) {
								exData.regions.push(Number(regionId));
							});
						}
						if (targetType === TARGET_TYPES.walk) {
							exData = exData || {};
							exData.dashing = false;
							exData.lastMoving = false;
							exData.frequency = 0;
						} else if (targetType === TARGET_TYPES.startdash) {
							exData = exData || {};
							exData.dashing = false;
							exData.lastDashing = false;
							exData.dir = 0;
						}
						break;
					case 'stay':
						targetType = TARGET_TYPES.tilemap;
						var event = $gameMap.event(targetId || eventId);
						x += event._x;
						y += event._y;
						break;
					case 'weather':
						targetType = TARGET_TYPES.weather;
						if (targetElems.length > 1) {
							exData = exData || {};
							elems = targetElems[1].split(',');
							exData.px = Number(elems[0]);
							exData.py = elems.length >= 2 ? Number(elems[1]) : 1;
						}
						break;
					case 'skit':
					case 'battleSkit':
						targetType = TARGET_TYPES[targetElems[0]];
						if (!this._skitIds.contains(targetElems[1])) {
							this._skitIds.push(targetElems[1]);
						}
						targetId = this._skitIds.indexOf(targetElems[1]);
						break;
					case 'event':
						targetType = TARGET_TYPES.character;
						break;
					default:
						if (TARGET_TYPES[targetElems[0]]) {
							targetType = TARGET_TYPES[targetElems[0]];
							if (targetElems[0] === 'region') {
								targetId = targetElems[1];
								exData = {
									lastX: -1,
									lastY: -1,
									frequency: 1,
									maxParticles: 0,
									particlesPerWave: 0,
									allPos: null
								}
							}
						}
				}
			}

			//supplement z
			if (isNaN(z)) {
				if (!isNaN(Z_INDEX[z])) {
					z = Z_INDEX[z];
				} else {
					z = this.defaultZIndexForType(targetType);
				}
			}
			z = Number(z) || 0;

			//make data
			var data = {
				targetType: targetType,
				targetId: targetId,
				name: name,
				image: image || null,
				x: x,
				y: y,
				z: z,
				stop: false,
				clear: false,
				quit: false,
				interval: 0,
				params: {},
				pChanged: false,
				filters: {},
				fid: 0,
				exceed: null,
				loop: null,
				animations: null,
				repeat: 0,
				destroy: false,
				ex: exData
			};
			return data;
		}

		Game_Particle.prototype.defaultZIndexForType = function (targetType) {
			var z = 0;
			if (targetType < -1) {
				z = Z_INDEX.below;
			} else if (targetType === TARGET_TYPES.character) {
				z = Z_INDEX.above;
			} else if (targetType === TARGET_TYPES.walk) {
				z = Z_INDEX.below;
			} else if (targetType === TARGET_TYPES.startdash) {
				z = Z_INDEX.below;
			} else if (targetType === TARGET_TYPES.attach) {
				z = Z_INDEX.above;
			} else if (targetType === TARGET_TYPES.screen) {
				z = Z_INDEX.spriteset;
			} else if (targetType === TARGET_TYPES.displayObject) {
				z = 1;
			} else if (targetType === TARGET_TYPES.weather) {
				z = Z_INDEX.spriteset;
			} else if (targetType === TARGET_TYPES.party) {
				z = Z_INDEX.above;
			} else if (targetType === TARGET_TYPES.enemy) {
				z = Z_INDEX.above;
			} else if (targetType === TARGET_TYPES.attachParty) {
				z = Z_INDEX.above;
			} else if (targetType === TARGET_TYPES.attachEnemy) {
				z = Z_INDEX.above;
			} else if (targetType === TARGET_TYPES.battle) {
				z = Z_INDEX.screen;
			} else if (targetType === TARGET_TYPES.battleWeather) {
				z = Z_INDEX.above;
			} else if (targetType === TARGET_TYPES.region) {
				z = Z_INDEX.above;
			} else if (targetType === TARGET_TYPES.picture) {
				z = Z_INDEX.above;
			} else if (targetType === TARGET_TYPES.skit) {
				z = Z_INDEX.above;
			} else if (targetType === TARGET_TYPES.battleSkit) {
				z = Z_INDEX.above;
			}
			return z;
		};


		Game_Particle.prototype.processCharacterTargetId = function (targetElems, eventId) {
			var elem0 = targetElems.shift();
			if (elem0 === 'player') {
				return 0;
			} else if (elem0 === 'follower') {
				return -Number(targetElems.shift()) || -1;
			} else if (elem0 === 'this') {
				return eventId;
			} else if (elem0 === 'event') {
				return Number(targetElems.shift()) || eventId;
			} else if (!isNaN(elem0)) {
				return Number(elem0);
			} else {
				throw new Error(LC('パーティクルの対象の値に誤りがあります。', 8));
			}
		};

		Game_Particle.prototype.particlePlay = function (eventId, id, target, name, z, x, y, image) {
			var data = this._data[this.idWithSuffix(id)];
			if (!data) {
				data = this.particleSet(eventId, id, target, name, z, x, y, image);
			}
			data.clear = true;
		};

		Game_Particle.prototype.particleRepeat = function (id, interval) {
			var targetIds = this.targetIds(id);
			var length = targetIds.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var id = targetIds[i];
				var data = this.dataWithId(id, true);
				if (data) {
					if (interval === undefined) {
						data.repeat = 1;
					} else if (isNaN(interval)) {
						data.repeat = 0;
					} else {
						data.repeat = Number(interval) || 0;
					}
				}
			}
		};

		Game_Particle.prototype.particleOn = function (id) {
			var targetIds = this.targetIds(id);
			var length = targetIds.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var id = targetIds[i];
				var data = this.dataWithId(id, true);
				if (data) {
					data.stop = false;
				}
			}
		};

		Game_Particle.prototype.particleOff = function (id) {
			var targetIds = this.targetIds(id);
			var length = targetIds.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var id = targetIds[i];
				var data = this.dataWithId(id, true);
				if (data) {
					data.stop = true;
				}
			}
		};

		Game_Particle.prototype.stopAll = function () {
			var keys = this._keys;
			var length = keys.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = keys[i];
				this.particleOff(key);
			}
		};
		Game_Particle.prototype.resumeAll = function () {
			var keys = this._keys;
			var length = keys.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = keys[i];
				this.particleOn(key);
			}
		};

		Game_Particle.prototype.particleClear = function (id, quit) {
			if (quit === 'false' || quit === 'f') {
				quit = false;
			} else if (quit === 'true' || quit === 't') {
				quit = true;
			} else {
				quit = supplementDef(false, quit);
			}

			var targetIds = this.targetIds(id);
			var length = targetIds.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var id = targetIds[i];
				var data = this.dataWithId(id, true);
				if (data) {
					data.clear = true;
					data.stop = true;
					data.quit = quit;
					data.repeat = 0;
				}
			}
		};

		Game_Particle.SPAWN_PARAMS = ['pos', 'point', 'spawnPos', 'burst', 'ring', 'circle', 'rect'];
		Game_Particle.prototype.particleUpdate = function (args) {
			var id = args.shift();
			var key = args.shift();
			var targetIds = this.targetIds(id);
			var length = targetIds.length;

			for (var i = 0; i < length; i = (i + 1) | 0) {
				var id = targetIds[i];
				var data = this.dataWithId(id, true);
				if (data) {
					this.tryUpdateSpawnType(key, data);

					data.params[key] = i === 0 ? args : args.concat();
					data.pChanged = true;
				}
			}
		};

		Game_Particle.prototype.tryUpdateSpawnType = function (type, data) {
			if (!Game_Particle.SPAWN_PARAMS.contains(type)) return;

			var animations = data.animations;
			Game_Particle.SPAWN_PARAMS.forEach(function (spawnKey) {
				if (spawnKey === 'pos' || spawnKey === 'point' || spawnKey === 'spawnPos') return;

				delete data.params[spawnKey];
				if (animations) {
					var length = animations.length;
					for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
						if (animations[i].key === spawnKey) {
							animations.splice(i, 1);
						}
					}
				}
			});
		};

		Game_Particle.prototype.particleAnimate = function (args) {
			var id = args.shift();
			var duration = args.shift();
			var key = args.shift();

			var targetIds = this.targetIds(id);
			var length = targetIds.length;
			if (duration <= 0) {
				//apply particleUpdate
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var id = targetIds[i];
					args.unshift(id);
					Game_Particle.prototype.particleUpdate.call(this, args);
					args.shift();
				}
				return;
			}


			var coeff = 1;
			var last = args[args.length - 1];
			if (typeof last === 'string') {
				if (last.indexOf('coeff:') === 0) {
					coeff = Number(args.pop().replace('coeff:', ''));
				} else if (last.indexOf(NLC('係数:', 9)) === 0) {
					coeff = Number(args.pop().replace(NLC('係数:', 10), ''));
				}
			}

			for (var i = 0; i < length; i = (i + 1) | 0) {
				var id = targetIds[i];
				var data = this.dataWithId(id, true);
				if (data) {
					this.tryUpdateSpawnType(key, data);
					if (!data.animations) {
						data.animations = [];
					}
					var animation = {
						d: duration,
						key: key,
						args: i === 0 ? args : args.concat(),
						coeff: coeff
					};
					data.animations.push(animation);
				}
			}
		};

		Game_Particle.prototype.updateAnimations = function (id, data) {
			var animations = data.animations;
			var length = animations.length;
			for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
				var animation = animations[i];
				animation.d -= 1;
				if (animation.d <= 0) {
					animations.splice(i, 1);
					var args = animation.args;
					args.unshift(animation.key);
					args.unshift(id);
					this.particleUpdate(args);
				}
			}
		};


		/* exceed
		===================================*/
		Game_Particle.prototype.particleExceed = function (id, arg) {
			var targetIds = this.targetIds(id);
			var length = targetIds.length;

			var value = Number(arg) || 0;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var id = targetIds[i];
				var data = this.dataWithId(id, true);
				if (data) {
					if (!data.exceed) {
						data.exceed = {
							id: 0,
							value: value
						};
					} else {
						data.exceed.id = data.exceed.id + 1;
						data.exceed.value = value;
					}
				}
			};
		};

		/* loop
		===================================*/
		Game_Particle.prototype.particleLoop = function (id, x = 48, y = x) {
			var targetIds = this.targetIds(id);
			var length = targetIds.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var id = targetIds[i];
				var data = this.dataWithId(id, true);
				if (data) {
					if (isNaN(x)) {
						data.loop = null;
					} else {
						if (!x && !y) {
							data.loop = null;
						} else {
							data.loop = [Number(x), Number(y)];
						}
					}
				}
			}
		};


		/* filter
		===================================*/
		Game_Particle.prototype.particleFilter = function (args) {
			var id = args.shift();
			var filterType = args.shift().toLowerCase();

			var targetIds = this.targetIds(id);
			var length = targetIds.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var id = targetIds[i];
				var data = this.dataWithId(id, true);
				if (data) {
					if (CLEAR_ARGS.contains(filterType)) {
						data.filters = {};
						return;
					};
					if (!FILTER.classWithType[filterType]) {
						return;
					}
					if (CLEAR_ARGS.contains(args[0])) {
						delete data.filters[filterType];
					} else {
						data.filters[filterType] = args;
					}

					data.fid += 1;
				}
			}
		};

		Game_Particle.prototype.particleEdit = function () { };
		Game_Particle.prototype._particleEditWithExData = function () { };
		Game_Particle.prototype._particleEdit = function () { };


		Game_Particle.configData = function (data) {
			return this.configDataWithName(data.name);
		};
		Game_Particle.configDataWithName = function (name) {
			var config = $dataTrpParticles[name];
			if (config) {
				if (Array.isArray(config)) {
					$dataTrpParticles[name] = this.decompressConfigDataFromArray(config);
					return $dataTrpParticles[name];
				} else {
					this.migrateConfig(config);
				}
				return config;
			}

			config = $dataTrpParticlePreset[name];
			if (config) {
				if (Array.isArray(config)) {
					$dataTrpParticlePreset[name] = this.decompressConfigDataFromArray(config);
					return $dataTrpParticlePreset[name];
				} else {
					this.migrateConfig(config);
				}
				return config;
			}

			if (name.indexOf('/h') !== name.length - 2) {
				return this.configDataWithName(name + '/h');
			}

			return null;
		};
		Game_Particle.migrateConfig = function (config) {
			// under V3: angleType > angle
			if (config.angle === undefined) {
				if (config.angleType === 1) {
					config.angle = -1;
				} else {
					config.angle = 0;
				}
			}
		};


		/* maxParticles
		===================================*/
		Game_Particle.prototype.resetMaxParticles = function () {
			this.maxParticles = maxParticles;
		};

		/* cache & auto clear
		===================================*/
		Game_Particle.prototype.removeAll = function () {
			var keys = this._keys;
			var length = keys.length;
			for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
				var key = keys[i];
				var data = this._data[key];
				data.clear = true;
				data.quit = true;
			}
			this._keys.length = 0;
			this._data = {};
			this.truncateTagInfo();
		};

		Game_Particle.prototype.willSceneChange = function () {
			Game_Particle.clearDisplayObjects();

			if (this._reservedCommands) {
				this._reservedCommands.length = 0;
			}

			var keys = this._keys;
			var length = keys.length;
			for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
				var key = keys[i];
				var data = this._data[key];
				if (data.type === ParticleEmitter.TARGET_TYPES.displayObject) {
					keys.splice(i, 1);
					delete data[key];
				}
			}
		};


		Game_Particle.prototype.willStartSceneMap = function () {
			var newMapId = $gameMap.mapId();
			if (this._lastMapId !== newMapId) {
				this._lastMapId = newMapId;

				if (clearCharacterOnMapChange) {
					this.removeCharacterTargetParticles();
				}
				if (clearPartyOnMapChange) {
					this.removePartyTargetParticles();
				}
				if (clearScreenOnMapChange) {
					this.removeScreenTargetParticles();
				}

				var events = $gameMap.events();
				var length = events.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					events[i].setupParticles();
				}
			}
		};


		Game_Particle.SCREEN_TARGET_TYPES = [
			TARGET_TYPES.screen, TARGET_TYPES.weather, TARGET_TYPES.region,
		];
		Game_Particle.CHARACTER_TARGET_TYPES = [
			TARGET_TYPES.character, TARGET_TYPES.walk, TARGET_TYPES.startdash, TARGET_TYPES.attach
		];
		Game_Particle.BATTLE_SCREEN_TARGET_TYPES = [
			TARGET_TYPES.battle, TARGET_TYPES.battleWeather
		];
		Game_Particle.BATTLE_CHARACTER_TARGET_TYPES = [
			TARGET_TYPES.actor, TARGET_TYPES.attachActor, TARGET_TYPES.party, TARGET_TYPES.enemy, TARGET_TYPES.attachParty, TARGET_TYPES.attachEnemy
		];
		Game_Particle.BATTLE_ENEMY_TARGET_TYPES = [
			TARGET_TYPES.enemy, TARGET_TYPES.attachEnemy
		];
		Game_Particle.BATTLE_PARTY_TARGET_TYPES = [
			TARGET_TYPES.party, TARGET_TYPES.attachParty
		];
		Game_Particle.BATTLE_ACTOR_TARGET_TYPES = [
			TARGET_TYPES.actor, TARGET_TYPES.attachActor
		];

		Game_Particle.prototype.removeParticlesWithTargetTypes = function (types) {
			this._removeParticlesWithTargetTypes(types, this._keys, this._data);
			this.truncateTagInfo();
		};
		Game_Particle.prototype._removeParticlesWithTargetTypes = function (types, keys, allData) {
			var length = keys.length;
			for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
				var key = keys[i];
				var data = allData[key];
				if (types.contains(data.targetType)) {
					if (!this.isStateTagged(key, data)) {
						keys.splice(i, 1);
						delete allData[key];
					}
				}
			}
		};

		Game_Particle.prototype.isStateTagged = function (key, data) {
			if (disableState) return false;

			var info = this._tagInfo;
			if (!info) return true;

			var tags = Object.keys(info);
			var length = tags.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var tag = tags[i];
				if (tag.indexOf('state:party:') !== 0) continue;

				if (info[tag].contains(key)) {
					return true;
				}
			}
			return false;
		};

		Game_Particle.prototype.removeScreenTargetParticles = function () {
			this.removeParticlesWithTargetTypes(Game_Particle.SCREEN_TARGET_TYPES);
		};
		Game_Particle.prototype.removeBattleScreenParticles = function () {
			this.removeParticlesWithTargetTypes(Game_Particle.BATTLE_SCREEN_TARGET_TYPES);
		};
		Game_Particle.prototype.removeBattleCharacterParticles = function () {
			this.removeParticlesWithTargetTypes(Game_Particle.BATTLE_CHARACTER_TARGET_TYPES);
		};

		Game_Particle.prototype.removeCharacterTargetParticles = function () {
			this._removeCharacterTargetParticles(this._keys, this._data);
			this.truncateTagInfo();
		};
		Game_Particle.prototype._removeCharacterTargetParticles = function (keys, allData) {
			var length = keys.length;
			for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
				var key = keys[i];
				var data = allData[key];

				var isForEvent = Game_Particle.CHARACTER_TARGET_TYPES.contains(data.targetType) && data.targetId > 0;
				var isTilemap = data.targetType === TARGET_TYPES.tilemap;
				if (isForEvent || isTilemap) {
					keys.splice(i, 1);
					delete allData[key];
				}
			}
		};
		Game_Particle.prototype.removePartyTargetParticles = function () {
			this._removePartyTargetParticles(this._keys, this._data);
			this.truncateTagInfo();
		};
		Game_Particle.prototype._removePartyTargetParticles = function (keys, allData) {
			var length = keys.length;
			for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
				var key = keys[i];
				var data = allData[key];
				if (Game_Particle.CHARACTER_TARGET_TYPES.contains(data.targetType) && data.targetId <= 0) {
					if (!this.isStateTagged(key, data)) {
						keys.splice(i, 1);
						delete allData[key];
					}
				}
			}
		};

		Game_Particle.prototype.clearEnemyTargetParticles = function (enemy) {
			var types = Game_Particle.BATTLE_ENEMY_TARGET_TYPES
			var targetId = enemy.index() + 1;
			this.clearTargetsParticles(types, targetId, this._keys, this._data);
		};
		Game_Particle.prototype.clearActorTargetParticles = function (actor, quit) {
			if (actor.index() < 0) return;

			var types = Game_Particle.BATTLE_PARTY_TARGET_TYPES;
			var targetId = actor.index() + 1;
			this.clearTargetsParticles(types, targetId, this._keys, this._data, quit);

			types = Game_Particle.BATTLE_ACTOR_TARGET_TYPES;
			targetId = actor.particleTargetId();
			this.clearTargetsParticles(types, targetId, this._keys, this._data, quit);
		};
		Game_Particle.prototype.clearTargetsParticles = function (targetTypes, targetId, keys, allData, quit = false) {
			var length = keys.length;
			for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
				var key = keys[i];
				var data = allData[key];

				if (!targetTypes.contains(data.targetType)) continue;
				if (String(data.targetId) !== String(targetId)) continue;

				allData[key].clear = true;
				allData[key].stop = true;
				if (quit) {
					allData[key].quit = true;
				}
				keys.splice(i, 1);
				delete allData[key];
			}
			this.truncateTagInfo();
		};


		/* tag
		===================================*/
		Game_Particle.prototype.extractTagRegister = function (args) {
			var tag = '';

			var length = args.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var arg = args[i];
				if (typeof arg === 'string' && arg.indexOf('tag:') === 0) {
					tag = arg.replace('tag:', '');
					args.splice(i, 1);
					break;
				}
			}

			return tag;
		};
		Game_Particle.prototype.particleTag = function (id, tag) {
			if (!this._tagInfo) this._tagInfo = {};
			id = this.idWithSuffix(id);

			var info = this._tagInfo;
			if (!info[tag]) {
				info[tag] = [];
			}
			if (!info[tag].contains(id)) {
				info[tag].push(id);
			}
		};
		Game_Particle.prototype.truncateTagInfo = function () {
			if (!this._tagInfo) return;

			var keys = Object.keys(this._tagInfo);
			var length = this._tagInfo.length;
			for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
				var key = keys[i];
				var ids = this._tagInfo[key];
				var idLen = ids.length;
				for (var j = idLen - 1; j >= 0; j = (j - 1) | 0) {
					var id = ids[j];
					if (!this._data[key]) {
						ids.splice(j, 1);
					}
				}
				if (ids.length === 0) {
					delete this._tagInfo[key];
				}
			}
		};



		/* helper&accessor
		===================================*/
		Game_Particle.prototype.dataWithId = function (id, noErrorLog) {
			if (this._suffix) {
				var suffixIdx = id.indexOf(this._suffix);
				if (suffixIdx < 0 || suffixIdx !== id.length - this._suffix.length) {
					id += this._suffix;
				}
			}

			var data = this._data[id] || null;
			if (!data && !noErrorLog && errorLog) {
				throw new Error(LC('管理ID:%1のパーティクルは再生されてません。', 11).format(id));
			}
			return data;
		};
		Game_Particle.prototype.data = function () {
			return this._data;
		};
		Game_Particle.prototype.keys = function () {
			return this._keys;
		};
		Game_Particle.prototype.setAutoIdSuffix = function (suffix) {
			this._suffix = suffix;
		};
		Game_Particle.prototype.addAutoIdSuffix = function (suffix) {
			this._suffix += suffix;
		};
		Game_Particle.prototype.removeAutoIdSuffix = function (suffix) {
			var index = this._suffix.indexOf(suffix);
			this._suffix = this._suffix.substring(0, index);
		};
		Game_Particle.prototype.clearAutoIdSuffix = function () {
			this._suffix = '';
		};

		Game_Particle.TEMP_TARGET_ARRAY = [];
		Game_Particle.TEMP_TARGET_TYPES_ARRAY = [];
		Game_Particle.prototype.targetIds = function (idStr) {
			var ret = Game_Particle.TEMP_TARGET_ARRAY;
			ret.length = 0;

			if (typeof idStr === 'number') {
				ret.push(idStr);
				return ret;
			}

			var id_lc = idStr.toLowerCase();
			if (id_lc.indexOf('group:') === 0) {
				idStr = 'tag:' + idStr;
				id_lc = 'tag:' + id_lc;
			}

			var types = null;
			if (id_lc.indexOf('all:') === 0) {
				idStr = idStr.substr(4);
				if (idStr.contains(',')) {
					types = idStr.split(',');
				} else {
					types = Game_Particle.TEMP_TARGET_TYPES_ARRAY;
					types.length = 0;
					types.push(idStr);
				}
				var length = types.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var targetType = TARGET_TYPES[types[i]];
					if (isNaN(targetType)) {
						if (errorLog) {
							throw new Error(idStr + ' > ' + LC('対象タイプが不正です。', 12));
						}
					} else {
						this.pushIdsWithTargetType(ret, targetType);
					}
				}
			} else if (id_lc === 'all') {
				ret = this._keys;
			} else if (id_lc.indexOf('tag:') === 0) {
				var tagStr = idStr.substr(4);
				if (tagStr.contains(',')) {
					types = tagStr.split(',');
				} else {
					types = Game_Particle.TEMP_TARGET_TYPES_ARRAY;
					types.length = 0;
					types.push(tagStr);
				}
				var length = types.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var tag = types[i];
					if (this._tagInfo && this._tagInfo[tag]) {
						Array.prototype.push.apply(ret, this._tagInfo[tag]);
					}
				}
			} else {
				ret.push(idStr);
			}
			return ret;
		};

		Game_Particle.prototype.pushIdsWithTargetType = function (array, type) {
			var keys = this._keys;
			var length = keys.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = keys[i];
				var data = this._data[key];
				if (data.targetType === type) {
					array.push(key);
				}
			}
		};

		Game_Particle.prototype.skitPictureId = function (id) {
			var actor = $gameSkit._skitActors[this._skitIds[id]];
			if (!actor) return -1;
			return actor.pictureId();
		};




		//=============================================================================
		// ParticleSystem
		//=============================================================================
		ParticleSystem.cacheMapId = -1;
		ParticleSystem.temporallyCacheForSceneMap = null;
		ParticleSystem.temporallyCacheForGroupedScene = null;
		ParticleSystem.clearCache = function () {
			this.temporallyCacheForSceneMap = null;
			this.cacheMapId = -1;
		};

		ParticleSystem.systemParticles = null;
		ParticleSystem.systemParticleIds = null;
		ParticleSystem.setupSystemParticles = function () {
			if (this.systemParticles) return;

			var particle = new Game_Particle();

			this.systemParticles = [];
			this.systemParticleIds = [];

			var length = systemParticles.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var args = systemParticles[i].split(' ');
				if (commandNames.contains(args[0])) {
					args.shift();
				}

				var command = args[0];
				var id = args[1];
				if (id) {
					particle.pluginCommand(null, args);
					var data = particle._data[id];
					if (!data) continue;

					this.systemParticles.push(data);
					this.systemParticleIds.push(id);
				}
			}

			particle._keys.length = 0;
			particle._data = {};
		};

		ParticleSystem.prototype.initialize = function () {
			this._emitters = {};
			this._keys = [];
			this._useCapacityLimit = false;
			this._maxParticles = 0;
			this._isCapacityLimitted = false;
			this._cached = false;

			if (displayCount) {
				this._particleCount = -1;
				this._displayCountFrame = 15;
				this._countSprite = null;
				this._limitedSprite = null;
				this.createCountSprite();
			}
		};

		ParticleSystem.prototype.cacheForMap = function () {
			this.prepareCache();
			ParticleSystem.temporallyCacheForSceneMap = this;
			ParticleSystem.cacheMapId = $gameMap.mapId();
		};
		ParticleSystem.prototype.cacheForGroupedScene = function () {
			this.prepareCache();
			ParticleSystem.temporallyCacheForGroupedScene = this;
		};
		ParticleSystem.prototype.prepareCache = function () {
			this._cached = true;

			if (displayCount) {
				if (this._countSprite && this._countSprite.parent) {
					this._countSprite.parent.removeChild(this._countSprite);
				}
				if (this._limitedSprite && this._limitedSprite.parent) {
					this._limitedSprite.parent.removeChild(this._limitedSprite);
				}
			}

			var keys = this._keys;
			var length = keys.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var emitter = this._emitters[keys[i]];
				var container = emitter.container();
				if (emitter._targetType === TARGET_TYPES.click || emitter._targetType === TARGET_TYPES.drag) {
					emitter.cleanup();
				} else if (emitter._targetType === TARGET_TYPES.displayObject) {
					emitter.destroy();
					delete this._emitters[keys[i]];
					keys.splice(i, 1);
					i -= 1;
					length -= 1;
				}
				if (container.parent) {
					container.parent.removeChild(container);
				}
			}
		};

		ParticleSystem.prototype.tryRestoreFromCache = function (scene) {
			if (!this._cached) return;
			this._cached = false;

			var keys = this._keys;
			var length = keys.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var emitter = this._emitters[keys[i]];
				this.addEmitterToParent(emitter, scene);
			}
		};

		ParticleSystem.prototype.updateForEditor = function (scene) {
			this.update(scene);
		};

		ParticleSystem.prototype.update = function (scene) {
			var emitters = this._emitters;
			var particle = $gameScreen._particle
			var particles = particle.data();
			var dataKeys = particle.keys();

			var changed = false;

			var length = dataKeys.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = dataKeys[i];
				if (emitters[key]) continue;

				var data = particles[key];
				if (!data || !scene.isParticleTargetTypeValid(data.targetType, data.targetId)) continue;
				if (!data.destroy) {
					changed = true;
					var emitter = this.createParticleEmitter(key, data, scene);
					if (!emitter._destroyed) {
						emitters[key] = emitter;
						this._keys.push(key);
					}
				}
			}

			var systemKeys = ParticleSystem.systemParticleIds;
			var length = systemKeys.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = systemKeys[i];
				if (emitters[key]) continue;

				var data = ParticleSystem.systemParticles[i];
				if (!data || !scene.isParticleTargetTypeValid(data.targetType)) continue;
				if (!data.destroy) {
					changed = true;
					emitters[key] = (this.createParticleEmitter(key, data, scene));
					this._keys.push(key);
				}
			}

			var emitterKeys = this._keys;
			length = emitterKeys.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				if (emitters[emitterKeys[i]].update()) {
					changed = true;
				}
			}

			if (this._maxParticles !== particle.maxParticles) {
				changed = true;
				this._maxParticles = particle.maxParticles;
				this._useCapacityLimit = this._maxParticles > 0;
				this.refreshCapacity();
			} else if (this._useCapacityLimit && changed) {
				this.refreshCapacity();
			}

			for (i = length - 1; i >= 0; i = (i - 1) | 0) {
				var emitter = emitters[emitterKeys[i]];
				emitter.updateEmitter();
				if (emitter._destroyed) {
					changed = true;
					delete emitters[emitterKeys[i]];
					emitterKeys.splice(i, 1);
				}
			}

			if (displayCount) {
				this._displayCountFrame -= 1
				if (this._displayCountFrame <= 0) {
					// this._displayCountFrame = 15;
					this._displayCountFrame = 5;
					this.refreshParticleCount();
				}
			}
		};


		ParticleSystem.prototype.createParticleEmitter = function (key, data, scene) {
			var emitter = new ParticleEmitter(key, data);
			if (!emitter._destroyed) {
				this.addEmitterToParent(emitter, scene);
			}
			return emitter;
		};

		ParticleSystem.prototype.addEmitterToParent = function (emitter, scene) {
			var data = emitter._data;
			var container = emitter.container();
			var z = data.z || 0;

			var target, index, sprset, parent;

			switch (data.targetType) {
				case TARGET_TYPES.displayObject:
					target = Game_Particle.displayObjects[data.targetId];
					if (target && target.parent) {
						index = target.parent.children.indexOf(target);
						index = (index + z).clamp(0, target.parent.children.length);
						target.parent.addChildAt(container, Math.min(target.parent.children.length, index));
					}
					break;
				case TARGET_TYPES.actor:
				case TARGET_TYPES.attachActor:
				case TARGET_TYPES.party:
				case TARGET_TYPES.enemy:
				case TARGET_TYPES.attachParty:
				case TARGET_TYPES.attachEnemy:
				case TARGET_TYPES.battleWeather:
					target = emitter.target();
					container.z = z;
					parent = target.parent || this.battleField(scene);
					if (z <= Z_INDEX.below) {
						for (var i = 0; i < parent.children.length; i = (i + 1) | 0) {
							if (parent.children[i] instanceof Sprite_Battler) {
								parent.addChildAt(container, i);
								break;
							}
						}
					} else {
						parent.addChild(container);
					}
					break;
				case TARGET_TYPES.battle:
					sprset = this.battleSpriteset(scene);
					parent = sprset.parent;
					parent.addChildAt(container, parent.children.indexOf(sprset) + 1);
					break;
				case TARGET_TYPES.click:
				case TARGET_TYPES.drag:
					SceneManager._scene.addChild(container);
					break;
				case TARGET_TYPES.picture:
				case TARGET_TYPES.battlePicture:
					sprset = this.spriteset(scene);
					target = sprset._pictureContainer;
					if (keepPictureOrder) {
						parent = target;
						parent.children.some(function (child) {
							if (child instanceof Sprite_Picture) {
								if (child._pictureId === data.targetId) {
									target = child;
									return true;
								}
							}
							return false;
						});
					} else {
						parent = target.parent;
					}
					index = parent.children.indexOf(target);
					if (z <= Z_INDEX.below) {
						parent.addChildAt(container, index);
					} else {
						parent.addChildAt(container, index + 1);
					}
					break;
				case TARGET_TYPES.skit:
				case TARGET_TYPES.battleSkit:
					sprset = this.spriteset(scene);
					target = sprset._bustPictureContainer;
					parent = target.parent;
					index = parent.children.indexOf(target);
					if (z <= Z_INDEX.below) {
						parent.addChildAt(container, index);
					} else {
						parent.addChildAt(container, index + 1);
					}
					break;
				default:
					if (data.targetType < 0) {
						index = scene.children.indexOf(scene._windowLayer) || 0;
						if (z < 0) {
							scene.addChildAt(container, (-z - 1).clamp(0, scene.children.length));
						} else if (z === Z_INDEX.below) {
							scene.addChildAt(container, index);
						} else {
							scene.addChild(container);
						}
					}
					break;
			}


			if (z === Z_INDEX.screen) {
				scene.addChild(container);
			} else if (z === Z_INDEX.spriteset && this.spriteset(scene)) {
				this.spriteset(scene).addChild(container);
			} else if (z === Z_INDEX.back && this.spriteset(scene)) {
				var sprset = this.spriteset(scene);
				sprset._tilemap.parent.addChildAt(container, sprset._tilemap.parent.children.indexOf(sprset._tilemap));
			} else if (!container.parent) {
				if (z >= 0) {
					container.z = z;
					var baseField = this.baseField(scene);
					if (baseField) {
						baseField.addChild(container);
					}
				} else {
					var sprset = this.spriteset(scene);
					if (sprset) {
						sprset.addChildAt(container, (-z + 1).clamp(0, sprset.children.length));
					} else {
						scene.addChildAt(container, (-z + 1).clamp(0, scene.children.length));
					}
				}
			}
			return emitter;
		};

		ParticleSystem.prototype.baseField = function (scene) {
			if (scene instanceof Scene_Map) {
				return this.spriteset(scene)._tilemap;
			} else if (this.spriteset(scene)) {
				return this.spriteset(scene);
			} else {
				return null;
			}
		};

		ParticleSystem.prototype.spriteset = function (scene) {
			return scene._spriteset;
		};
		ParticleSystem.prototype.battleSpriteset = function (scene) {
			return scene._spriteset;
		};
		ParticleSystem.prototype.battleField = function (scene) {
			return this.battleSpriteset(scene)._battleField;
		};


		ParticleSystem.prototype.createCountSprite = function () {
			var bitmap = new Bitmap(256, 16);
			var sprite = new Sprite(bitmap);
			bitmap.fontSize = 14;
			bitmap.drawText(LC('パーティクル数:', 13), 0, 0, 100, 16, 'right');
			this._countSprite = sprite;

			//limited sprite
			bitmap = new Bitmap(128, 16);
			sprite = this._limitedSprite = new Sprite(bitmap);
			sprite.visible = false;
			sprite.y = 16;
			bitmap.textColor = 'red';
			bitmap.fontSize = 14;
			bitmap.drawText(LC('最大数制限中！', 14), 0, 0, 128, 16);
		};

		ParticleSystem.prototype.refreshParticleCount = function () {
			var emitters = this._emitters;
			var keys = this._keys;
			var length = keys.length;
			var count = 0;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var emitter = emitters[keys[i]];
				if (emitter) {
					count += emitter.particleCount();
				}
			}

			if (this._particleCount === count) return;
			this._particleCount = count;

			var sprite = this._countSprite;
			if (!sprite) this.createCountSprite();
			if (sprite.parent !== SceneManager._scene) {
				SceneManager._scene.addChild(sprite);
			}

			var bitmap = sprite.bitmap;
			var x = 100;
			var width = bitmap.width - x;
			var height = bitmap.height;
			bitmap.clearRect(x, 0, width, height);
			bitmap.drawText(count, x + 1, 0, width - 2, height);

			if (this._isCapacityLimitted) {
				sprite = this._limitedSprite;
				if (sprite.parent !== SceneManager._scene) {
					SceneManager._scene.addChild(sprite);
				}
				sprite.visible = true;
			} else if (this._limitedSprite) {
				this._limitedSprite.visible = false;
			}
		};

		/* capacity
		===================================*/
		ParticleSystem.prototype.refreshCapacity = function () {
			var keys = this._keys;
			var emitters = this._emitters;
			var length = keys.length;
			var capacity = 0;

			for (var i = 0; i < length; i = (i + 1) | 0) {
				capacity += emitters[keys[i]].particleCapacity();
			}
			var capacityRate;
			if (this._maxParticles <= 0) {
				if (!this._isCapacityLimitted) {
					return;
				}
				capacityRate = 1;
			} else if (capacity <= this._maxParticles) {
				if (this._isCapacityLimitted) {
					capacityRate = 1;
				} else {
					return;
				}
			} else {
				capacityRate = this._maxParticles / (capacity || 1);
			}
			this._isCapacityLimitted = capacityRate < 1;

			for (var i = 0; i < length; i = (i + 1) | 0) {
				emitters[keys[i]].setParticleCapacity(capacityRate);
			}
		};



		//=============================================================================
		// ParticleEmitter
		//=============================================================================
		ParticleEmitter.rgbWithStr = function (string) {
			var values = string.match(/\((.+)\)/)[1].split(',');
			if (string.indexOf('rgba') >= 0) {
				return {
					r: Number(values[0]),
					g: Number(values[1]),
					b: Number(values[2]),
					a: Number(values[3])
				};
			} else {
				return {
					r: Number(values[0]),
					g: Number(values[1]),
					b: Number(values[2])
				};
			}
		};

		ParticleEmitter.prototype.initialize = function (id, data) {
			this.initMembers();

			var config = Game_Particle.configData(data);
			var container = new PIXI.Container();
			this._container = container;
			this._id = id;
			this._data = data;
			this._config = config;
			this._image = data.image;

			this._isSceneMap = SceneManager._scene instanceof Scene_Map;
			this._loopXThreshold = (this._isSceneMap && $gameMap.isLoopHorizontal()) ? $dataMap.width / 2 * 48 : 0;
			this._loopYThreshold = (this._isSceneMap && $gameMap.isLoopVertical()) ? $dataMap.height / 2 * 48 : 0;;

			this.setupTarget(data);

			var image = this.imageName(data.image);
			var bitmaps = this.bitmapsWithImage(image);
			this.setupBitmaps(image, bitmaps);
		};
		ParticleEmitter.prototype.setupBitmaps = function (image, bitmaps) {
			var length = bitmaps.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				bitmaps[i].addLoadListener(ParticleEmitter.prototype.tryStart.bind(this, image, bitmaps));
			}
		};

		ParticleEmitter.prototype.initMembers = function () {
			this._container = null;
			this._data = null;
			this._image = null;
			this._id = null;

			this._started = false;
			this._isSceneMap = true;
			this._freezed = false;
			this._lastFreezed = false;

			this._targetType = 0;
			this._target = null;
			this._targetId = -1;
			this._isCharacterTarget = false;
			this._characterTargetMargin = isNaN(outsideMargin) ? -1 : ParticleEmitter.TILE_SIZE * Number(outsideMargin);

			this._fid = -1;
			this._filterArgs = {};
			this._filterKeys = [];

			this._exceedId = -1;

			this._emitter = null;
			this._destroyed = false;
			this._stop = false;
			this._restartCount = 0;

			this._x = 0;
			this._y = 0;
			this._dispX = 0;
			this._dispY = 0;
			this._loopXThreshold = 0;
			this._loopYThreshold = 0;
			this._followScroll = false;
			this._scrollXRate = 1.0;
			this._scrollYRate = 1.0;
			this._updatePos = false;
			this._isWeather = false;
		};

		ParticleEmitter.prototype.paramWithRate = function (target, current, rate) {
			if (rate === 1) return target;
			return current + (target - current) * rate;
		};

		ParticleEmitter.prototype.target = function () {
			return this._target;
		};

		ParticleEmitter.prototype.bitmapsWithImage = function (imageStr) {
			var images = imageStr.split(',');
			var length = images.length;
			var bitmaps = [];
			var bitmap;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var image = images[i];
				if (image.indexOf('tile:') === 0) {
					// var bitmapIndex = Number(image.match(/tile:(\d+?):/)[1]);
					// bitmap = SceneManager._scene._spriteset._tilemap.bitmaps[bitmapIndex];

					var tilesetImage = image.match(/tile:(.+?):/)[1];
					bitmap = ImageManager.loadTileset(tilesetImage);
				} else if (image.indexOf('ANIM:') === 0) {
					if (this.hasSplitAnimationImage(image)) {
						bitmap = ImageManager.loadParticle(this.splitAnimationImage(image));
					} else {
						bitmap = ImageManager.loadAnimation(image.match(/ANIM:(.+?):/)[1]);
					}
				} else {
					bitmap = ImageManager.loadParticle(image);
				}
				bitmaps.push(bitmap);
			}
			return bitmaps;
		};
		ParticleEmitter.prototype.splitAnimationImage = function (image) {
			return '_' + image.replace(/:/gi, '_');
		};
		ParticleEmitter.prototype.hasSplitAnimationImage = function (image) {
			var params = PluginManager._parameters.trp_particlelist;
			if (!params || !params.animImages) return false;
			return params.animImages.contains(image);
		};

		ParticleEmitter.prototype.setupTarget = function (data) {
			var type = data.targetType;
			var id = data.targetId;

			var target = null;
			var followScroll = false;
			var updatePos = false;
			var isWeather = false;
			switch (type) {
				case TARGET_TYPES.displayObject:
					updatePos = true;
					target = {
						x: data.x,
						y: data.y
					}
					break;

				case TARGET_TYPES.walk:
					this._data.ex.frequency = this._config.frequency;
				case TARGET_TYPES.startdash:
				case TARGET_TYPES.character:
					followScroll = true;
				case TARGET_TYPES.attach:
					updatePos = true;
					if (id === 0) {
						target = $gamePlayer;
					} else if (id < 0) {
						target = $gamePlayer._followers.follower(id * -1 - 1);
						if (!target || !target.actor()) {
							target = null;
						}
					} else {
						target = $gameMap.event(id);
					}
					break;
				case TARGET_TYPES.screen:
					target = {
						x: Graphics.width / 2,
						y: Graphics.height / 2
					};
					break;
				case TARGET_TYPES.tilemap:
					followScroll = true;
					updatePos = true;
					target = {
						x: data.x,
						y: data.y
					};
					break;
				case TARGET_TYPES.weather:
					followScroll = true;
					updatePos = false;
					isWeather = true;
					target = {
						x: Graphics.width / 2,
						y: Graphics.height / 2
					};
					if (data.ex) {
						this._scrollXRate = data.ex.px;
						this._scrollYRate = data.ex.py;
					}
					break;
				case TARGET_TYPES.actor:
				case TARGET_TYPES.attachActor:
					updatePos = true;
					var battler = $gameActors.actor(id);
					target = this._actorSpriteTarget(battler);
					this._data.ex = {
						index: battler.index(),
					};

					break;
				case TARGET_TYPES.party:
				case TARGET_TYPES.attachParty:
					updatePos = true;
					target = this._actorSpriteTarget($gameParty.members()[id - 1]);
					break;
				case TARGET_TYPES.enemy:
				case TARGET_TYPES.attachEnemy:
					updatePos = true;
					target = this._enemySpriteTarget($gameTroop.members()[id - 1]);
					break;
				case TARGET_TYPES.battle:
				case TARGET_TYPES.battleWeather:
					target = {
						x: Graphics.width / 2,
						y: Graphics.height / 2
					};
					break;
				case TARGET_TYPES.region:
					followScroll = true;
					target = [];
					this._data.ex.frequency = this._config.frequency;
					this._data.ex.maxParticles = this._config.maxParticles;
					this._data.ex.particlesPerWave = this._config.particlesPerWave;
					this._data.ex.allPos = this.positionsWithRegionIds(id);
					this._data.ex.lastX = -1;
					this._data.ex.lastY = -1;
					break;
				case TARGET_TYPES.click:
				case TARGET_TYPES.drag:
					break;
				case TARGET_TYPES.picture:
				case TARGET_TYPES.battlePicture:
					updatePos = true;
					target = id;
					break;
				case TARGET_TYPES.skit:
				case TARGET_TYPES.battleSkit:
					updatePos = true;
					target = id;
					break;
				default:
					if (type < -1) {
						target = {
							x: Graphics.width / 2,
							y: Graphics.height / 2
						};
					}
			}

			this._targetType = type;
			this._target = target;
			this._targetId = id;
			this._followScroll = followScroll;
			this._updatePos = updatePos;
			this._isWeather = isWeather;

			this._isCharacterTarget = Game_Particle.CHARACTER_TARGET_TYPES.contains(type);
			if (this._isCharacterTarget && target) {
				if (target instanceof Game_Event) {
					if (target.event().meta.pMargin !== undefined) {
						this._characterTargetMargin = ParticleEmitter.TILE_SIZE * Number(target.event().meta.pMargin);
					}
				}
			}
		};

		ParticleEmitter.prototype._enemySpriteTarget = function (target) {
			var sprites = SceneManager._scene._spriteset._enemySprites;
			return this._battlerSpriteTarget(target, sprites);
		};

		ParticleEmitter.prototype._actorSpriteTarget = function (target) {
			var sprites = SceneManager._scene._spriteset._actorSprites;
			return this._battlerSpriteTarget(target, sprites);
		};
		ParticleEmitter.prototype._battlerSpriteTarget = function (target, sprites) {
			var length = sprites.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var sprite = sprites[i];
				if (sprite && sprite._battler === target) {
					return sprite;
				}
			}
			return null;
		};

		ParticleEmitter.prototype.positionsWithRegionIds = function (regionIdStr) {
			var regionIds = regionIdStr.split(',');
			var length = regionIds.length;
			var positions = [];
			for (var i = 0; i < length; i = (i + 1) | 0) {
				regionIds[i] = Number(regionIds[i]);
			}

			var width = $dataMap.width;
			var height = $dataMap.height;
			var zIdx = 5 * height;
			for (var y = 0; y < height; y = (y + 1) | 0) {
				var yIdx = (zIdx + y) * width;
				for (var x = 0; x < width; x = (x + 1) | 0) {
					var idx = yIdx + x;
					var regionId = $dataMap.data[idx];
					if (regionIds.indexOf(regionId) >= 0) {
						positions.push(x);
						positions.push(y);
					}
				}
			}
			return positions;
		};

		ParticleEmitter.prototype.tryDestroy = function (force = false) {
			this.destroy(force);
		};

		ParticleEmitter.prototype.destroy = function (force) {
			if (this._destroyed) return;
			this._destroyed = true;
			this._data.destroy = true;

			this._data = null;
			this._target = null;

			if (this._emitter) {
				this._emitter.emit = false;
				this._emitter.destroy();
				this._emitter = null;
			}

			if (this._container.parent) {
				this._container.parent.removeChild(this._container);
			}
			this._container = null;
		};

		/* util interface
		===================================*/
		ParticleEmitter.prototype.setParticleCapacity = function (value) {
			if (this._freezed) return;
			if (this._targetType === TARGET_TYPES.click || this._targetType === TARGET_TYPES.drag) {
				return;
			}
			if (this._emitter) {
				this._emitter.capacityRate = value;
			}
		};
		ParticleEmitter.prototype.particleCapacity = function () {
			if (this._freezed) {
				return 0;
			}
			if (this._targetType === TARGET_TYPES.click || this._targetType === TARGET_TYPES.drag) {
				return 0;
			}

			var emitter = this._emitter;
			if (!emitter) return 0;

			return emitter.particleCapacity();
		};

		/* start
		===================================*/
		ParticleEmitter.prototype.tryStart = function (image, bitmaps) {
			if (this._started) return;

			var length = bitmaps.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				if (!bitmaps[i].isReady()) return;
			}
			this.start(image, bitmaps);
		};
		ParticleEmitter.prototype.particleConstructor = function () {
			return TRP_Particle;
		};
		ParticleEmitter.prototype.emitterConstructor = function () {
			return TRP_Emitter;
		};

		ParticleEmitter.prototype.start = function (image, bitmaps) {
			if (this._destroyed) return;
			if (this._started) return;

			this._started = true;
			var data = this._data;
			var container = this._container;

			var config = this._config;
			var textures = this._texturesWithBitmaps(image, bitmaps);

			var emitterConstructor = this.emitterConstructor();
			var emitter = new emitterConstructor(container, textures, config);
			this._emitter = emitter;

			emitter.particleConstructor = this.particleConstructor();

			if (this._targetType !== TARGET_TYPES.click && this._targetType !== TARGET_TYPES.drag) {
				emitter.emit = true;
			} else {
				emitter.emit = false;
			}

			if (this._targetType === TARGET_TYPES.region) {
				emitter._spawnFunc = emitter._spawnRegion.bind(emitter, this._target);
			}
			this.updateParams(data);

			if (this._isWeather ||
				(!this._updatePos && !this._followScroll)) {
				if (this._target) {
					container.x = this._target.x;
					container.y = this._target.y;
				}
			} else {
				this.updatePosition();
			}
		};



		ParticleEmitter.prototype._texturesWithBitmaps = function (imageStr, bitmaps) {
			var hasTile = imageStr.contains('tile:');
			var hasAnimation = imageStr.contains('ANIM:');
			var images = null;
			if (hasTile || hasAnimation) {
				images = imageStr.split(',');
			}

			var config = this._config;
			var frames = config.frames;

			var textures = [];
			var length = bitmaps.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var bitmap = bitmaps[i];
				var frameData = frames ? (frames[i] || null) : null;
				var frame = null;
				if (frameData) {
					frame = new Rectangle(frameData[0], frameData[1], frameData[2], frameData[3]);
				} else if (hasTile) {
					var image = images[i];
					if (image.indexOf('tile:') === 0) {
						frame = this.frameForTileIndex(Number(image.split(':')[2]));
					}
				} else if (hasAnimation && !this.hasSplitAnimationImage(images[i])) {
					var image = images[i];
					if (image.indexOf('ANIM:') === 0) {
						frame = this.frameForAnimationIndex(Number(image.split(':')[2]));
					}
				}
				if (frame) {
					frame.x = frame.x.clamp(0, bitmap.width);
					frame.width = frame.width.clamp(0, bitmap.width - frame.x);
					frame.y = frame.y.clamp(0, bitmap.height);
					frame.height = frame.height.clamp(0, bitmap.height - frame.y);
				}
				var texture = new PIXI.Texture(bitmap.baseTexture, frame);
				textures.push(texture);
			}
			return textures;
		};

		ParticleEmitter.TILE_SIZE = 48;
		ParticleEmitter.TILESET_COLUMNS = 16;
		ParticleEmitter.prototype.frameForTileIndex = function (tileIndex) {
			var tileSize = ParticleEmitter.TILE_SIZE;
			var cols = ParticleEmitter.TILESET_COLUMNS;
			var col = tileIndex % cols;
			var row = Math.floor(tileIndex / cols);
			return new Rectangle(tileSize * col, tileSize * row, tileSize, tileSize);
		};
		ParticleEmitter.ANIMATION_SIZE = 192;
		ParticleEmitter.ANIMATION_COLUMNS = 5;
		ParticleEmitter.prototype.frameForAnimationIndex = function (index) {
			var frameSize = ParticleEmitter.ANIMATION_SIZE;
			var cols = ParticleEmitter.ANIMATION_COLUMNS;
			var col = index % cols;
			var row = Math.floor(index / cols);
			return new Rectangle(frameSize * col, frameSize * row, frameSize, frameSize);
		};

		ParticleEmitter.prototype.cleanup = function () {
			if (!this._emitter) return;
			this._emitter.emit = false;
			this._emitter.cleanup();
		};

		/* update
		===================================*/
		ParticleEmitter.prototype.particleCount = function (subId = '') {
			if (this._freezed || !this._emitter) return 0;
			if (subId) {
				return this.subEmitter(subId).particleTotalCount();
			} else {
				return this._emitter.particleTotalCount();
			}
		};
		ParticleEmitter.prototype.update = function () {
			var changed = false;

			var emitter = this._emitter;
			if (!emitter || this._destroyed) return changed;

			var data = this._data;
			if (this._stop !== data.stop) {
				this._stop = data.stop;
				if (this._targetType !== TARGET_TYPES.click && this._targetType !== TARGET_TYPES.drag) {
					emitter.emit = !this._stop;
				}
				changed = true;
			}


			if ((this._targetType === TARGET_TYPES.click && TouchInput.isTriggered())
				|| (this._targetType === TARGET_TYPES.drag && TouchInput.isPressed())) {
				this._stop = false;
				if (TouchInput.isTriggered()) {
					emitter.resetPositionTracking();
					if (this._targetType === TARGET_TYPES.click) {
						emitter.emit = true;
					}
				} else if (this._targetType === TARGET_TYPES.drag) {
					emitter.emit = (emitter.ownerPos.x !== TouchInput.x || emitter.ownerPos.y !== TouchInput.y);
				}
				emitter.updateOwnerPos(TouchInput.x, TouchInput.y);
				this._container.parent.addChild(this._container);
			}

			if (!this._stop) {
				if (this._targetType === TARGET_TYPES.region) {
					if (this.updateForRegion(false)) {
						changed = true;
					}
				}
				if (!this._freezed && data.exceed && data.exceed.id !== this._exceedId) {
					if (this._emitter._prevPosIsValid) {
						this._emitter.update(data.exceed.value);
						this._exceedId = data.exceed.id;
					}
				}

				if (data.animations) {
					this.updateAnimations(data);
					changed = true;
				}
				if (data.pChanged) {
					this.updateParams(data);
					data.pChanged = false;
					changed = true;
				}
				if (this._fid !== data.fid) {
					this.updateFilters(data);
					changed = true;
				}

				if (this._image !== data.image) {
					this._image = data.image;
					this.changeImage(data.image);
				}

				switch (this._targetType) {
					case TARGET_TYPES.walk:
						if (this.updateForWalk()) {
							changed = true;
						}
						break;
					case TARGET_TYPES.startdash:
						if (this.updateForStartDash()) {
							changed = true;
						}
						break;
					default:
						if (data.loop) {
							this.loopParticles(data.loop[0], data.loop[1]);
						}
				};
			}

			if (this._lastFreezed !== this._freezed) {
				changed = true;
				this._lastFreezed = this._freezed;
			}

			return changed;
		};

		ParticleEmitter.prototype.updateDeltaTime = function () {
			return ParticleEmitter.DELTA_TIME;
		};
		ParticleEmitter.prototype.updateEmitter = function () {
			var emitter = this._emitter;
			if (!emitter || this._destroyed) return;

			if (this._data.quit) {
				this.tryDestroy(true);
				return;
			}
			if (this._stop && emitter.particleTotalCount() === 0) {
				if (this._data.clear && emitter._emitterLife <= 0) {
					this.tryDestroy(false);
				}
				return;
			}

			//update position
			if (this._followScroll || this._updatePos) {
				this.updatePosition();
				if (this._destroyed) return;
			}

			if (this._freezed) {
				return;
			}

			var dt = this.updateDeltaTime();
			this._updateEmitter(dt);
		};

		ParticleEmitter.prototype._updateEmitter = function (dt) {
			var emitter = this._emitter;
			if (dt !== 0) {
				emitter.update(dt);
			}

			if (!emitter.emit && emitter.particleTotalCount() === 0) {
				if (!this.isEmitByOriginalTrigger()) {
					if (this._restartCount > 0) {
						this._restartCount -= 1;
						if (this._restartCount <= 0) {
							this._restartCount = 0;
							this._emitter.emit = true;
							this._stop = false;
							this._data.stop = false;
						}
					} else if (this._data.repeat > 0) {
						emitter.emit = false;
						this._restartCount = this._data.repeat;
					}
					if (!emitter.emit && this._restartCount <= 0) {
						if (this._data.clear) {
							this.tryDestroy();
						} else {
							this._stop = this._data.stop = true;
						}
					}
				} else {
					if (this._data.clear) {
						this.tryDestroy();
					}
				}
			}
		};

		ParticleEmitter.prototype.changeImage = function (image, emitter = this._emitter) {
			image = this.imageName(image);
			var bitmaps = this.bitmapsWithImage(image);
			var length = bitmaps.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				bitmaps[i].addLoadListener(ParticleEmitter.prototype._tryChangeImage.bind(this, image, bitmaps, emitter));
			}
		};
		ParticleEmitter.prototype._tryChangeImage = function (image, bitmaps, emitter = this._emitter) {
			var length = bitmaps.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				if (!bitmaps[i].isReady()) return;
			}
			this._changeImage(image, bitmaps, emitter);
		};
		ParticleEmitter.prototype._changeImage = function (image, bitmaps, emitter = this._emitter) {
			emitter.particleImages = this._texturesWithBitmaps(image, bitmaps);
		};


		ParticleEmitter.prototype.updatePosition = function () {
			var scrolled = false;
			if (this._followScroll) {
				scrolled = this._updateFollowScroll();
			}

			if (this._isWeather) return;

			if (this._updatePos) {
				this._updatePosition(scrolled);
			}
		};

		ParticleEmitter.prototype._updateFollowScroll = function () {
			var scrolled = false;
			var dispX = 0;
			var dispY = 0;
			if (this._isSceneMap) {
				dispX = $gameMap._displayX * 48;
				dispY = $gameMap._displayY * 48;
			}
			if (this._dispX !== dispX || this._dispY !== dispY) {
				scrolled = true;
				var dx = (dispX - this._dispX) * this._scrollXRate;
				var dy = (dispY - this._dispY) * this._scrollYRate;
				if (this._loopXThreshold > 0) {
					if (dx > this._loopXThreshold) {
						this._emitter.shiftParticlePosX($dataMap.width * 48)
						this._emitter.resetPositionTracking();
					} else if (dx < -this._loopXThreshold) {
						this._emitter.shiftParticlePosX(-$dataMap.width * 48)
						this._emitter.resetPositionTracking();
					}
				}
				if (this._loopYThreshold) {
					if (dy > this._loopYThreshold) {
						this._emitter.shiftParticlePosY($dataMap.height * 48)
						this._emitter.resetPositionTracking();
					} else if (dy < -this._loopYThreshold) {
						this._emitter.shiftParticlePosY(-$dataMap.height * 48)
						this._emitter.resetPositionTracking();
					}
				}
				this._container.x -= dx;
				this._container.y -= dy;

				this._dispX = dispX;
				this._dispY = dispY;

				if (this._isWeather) {
					this._x += dx;
					this._y += dy;
					this._emitter.updateOwnerPos(this._x, this._y);
				}
			}
			return scrolled;
		};

		ParticleEmitter.prototype._updatePosition = function (scrolled) {
			var x, y;
			var target = this._target;
			switch (this._targetType) {
				case TARGET_TYPES.displayObject:
					target = Game_Particle.displayObjects[this._targetId];
					if (!target || !target.parent) {
						this.destroy();
						return;
					} else {
						x = target.x;
						y = target.y;
					}
					break;
				case TARGET_TYPES.character:
					if (!target) {
						this.destroy();
						return;
					}
					x = target.screenX();
					y = target.screenY();
					this.updateCharacterOutsideFreeze(x, y);
					break;
				case TARGET_TYPES.walk:
					if (!target) {
						this.destroy();
						return;
					}
					if (!this._emitter.emit) return;
					x = target.screenX();
					y = target.screenY();
					this.updateCharacterOutsideFreeze(x, y);

					switch (target._direction) {
						case 2: y += walkOffset; break;
						case 4: x -= walkOffset; break;
						case 6: x += walkOffset; break;
						case 8: y -= walkOffset; break;
					}
					break;
				case TARGET_TYPES.startdash:
					if (!target) {
						this.destroy();
						return;
					}
					if (!this._emitter.emit) return;
					x = target.screenX();
					y = target.screenY();
					this.updateCharacterOutsideFreeze(x, y);

					switch (target._direction) {
						case 2: y += dashOffset; break;
						case 4: x -= dashOffset; break;
						case 6: x += dashOffset; break;
						case 8: y -= dashOffset; break;
					}
					break;
				case TARGET_TYPES.attach:
					if (!target) {
						this.destroy();
						return;
					}
					x = target.screenX();
					y = target.screenY();
					this._container.x = x;
					this._container.y = y;
					this.updateCharacterOutsideFreeze(x, y);

					return;
				case TARGET_TYPES.tilemap:
					if (scrolled) {
						x = Math.round($gameMap.adjustX(target.x) * 48 + 24);
						y = Math.round($gameMap.adjustY(target.y) * 48 + 24);
					} else {
						x = this._x;
						y = this._y;
					}
					break;
				case TARGET_TYPES.actor:
					if (this._data.ex.index !== $gameActors.actor(this._targetId).index()) {
						this._data.ex.index = $gameActors.actor(this._targetId).index();
						target = this._target = this._actorSpriteTarget($gameActors.actor(this._targetId));
					}
				case TARGET_TYPES.party:
				case TARGET_TYPES.enemy:
					if (!target) {
						this.destroy();
						return;
					}
					x = target.x;
					y = target.y - this.battlerSpriteHeight(target) / 2;
					break;
				case TARGET_TYPES.attachActor:
					if (this._data.ex.index !== $gameActors.actor(this._targetId).index()) {
						this._data.ex.index = $gameActors.actor(this._targetId).index();
						target = this._target = this._actorSpriteTarget($gameActors.actor(this._targetId));
					}
				case TARGET_TYPES.attachParty:
				case TARGET_TYPES.attachEnemy:
					if (!target) {
						this.destroy();
						return;
					}
					x = target.x;
					y = target.y - this.battlerSpriteHeight(target) / 2;
					this._container.x = x;
					this._container.y = y;
					return;
				case TARGET_TYPES.picture:
				case TARGET_TYPES.battlePicture:
					target = $gameScreen.picture(target);
					if (!target) {
						this.destroy();
						return;
					}
					x = target.x();
					y = target.y();
					break;
				case TARGET_TYPES.skit:
				case TARGET_TYPES.battleSkit:
					target = $gameScreen.picture($gameScreen._particle.skitPictureId(target));
					if (!target) {
						this.destroy();
						return;
					}
					x = target.x();
					y = target.y();
					break;
				default:
					if (this._target) {
						this._container.x = target.x;
						this._container.y = target.y;
					}
			};

			if (scrolled || (this._x !== x || this._y !== y)) {
				this._applyPosition(x, y);
			}
		}

		ParticleEmitter.prototype._applyPosition = function (x, y) {
			x += this._dispX;
			y += this._dispY;
			this._x = x;
			this._y = y;
			this._emitter.updateOwnerPos(x, y);
		};



		ParticleEmitter.prototype.battlerSpriteHeight = function (sprite) {
			var targetSprite = sprite._mainSprite || sprite;
			return targetSprite.height * targetSprite.scale.y;
		};


		ParticleEmitter.prototype.updateAnimations = function (data) {
			var animations = data.animations;
			var length = animations.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				this._updateAnimation(animations[i]);
			}
		};

		ParticleEmitter.prototype._updateAnimation = function (animation) {
			var coeff = animation.coeff;
			var rate = coeff === 1 ? 1 / animation.d : 1 / Math.pow(animation.d, coeff);
			this._updateParam(animation.key, animation.args, rate);
		};

		ParticleEmitter.prototype.updateParams = function (data, emitter = this._emitter) {
			var params = data.params;

			var keys = Object.keys(params);
			var length = keys.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = keys[i];
				this._updateParam(key, params[key], 1, emitter);
			}
		};

		ParticleEmitter.prototype._updateParam = function (key, args, rate, emitter = this._emitter) {
			rate = rate || 1;

			emitter = emitter || this._emitter;

			if (ParticleEmitter.NODE_PARAMS.contains(key)) {
				this._updateNodeParam(emitter, key, args, rate);
			} else {
				this._updateNormalParam(emitter, key, args, rate);
			}
		};

		ParticleEmitter.prototype._updateNodeParam = function (emitter, key, args, rate) {
			var list, node, data;

			var isUpdate = rate === 1;
			key = ParticleEmitter.NODE_KEY_CONVERT[key] || key;
			if (isUpdate) {
				list = [];
				data = { list: list };
			}
			if (!isUpdate) {
				node = emitter[key];
			}
			var isColor = key === 'color' || key === 'startColor';
			var length = args.length;
			var time;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var elems = args[i].split('@');
				if (elems.length >= 2) {
					time = Number(elems[1]);
				} else if (i === 0) {
					time = 0;
				} else {
					time = 1;
				}
				var value;
				if (isColor) {
					if (elems[0][0] === '#') {
						value = PIXI.particles.ParticleUtils.hexToRGB(elems[0]);
					} else {
						value = ParticleEmitter.rgbWithStr(elems[0]);
					}
					if (!isUpdate) {
						value.r = Math.floor(this.paramWithRate(value.r, node.value.r, rate));
						value.g = Math.floor(this.paramWithRate(value.g, node.value.g, rate));
						value.b = Math.floor(this.paramWithRate(value.g, node.value.g, rate));
					}
				} else {
					if (isUpdate) {
						value = Number(elems[0]);
					} else {
						value = this.paramWithRate(Number(elems[0]), node.value, rate);
					}
				}
				if (isUpdate) {
					list.push({
						time: time,
						value: value
					});
				} else {
					node.value = value;
					node = node.next;
				}
			}
			if (isUpdate) {
				emitter[key] = PIXI.particles.PropertyNode.createList(data);
			}
		};
		ParticleEmitter.prototype._updateNormalParam = function (emitter, key, args, rate) {
			var value = Number(args[0]);
			var value2 = args[1] === undefined ? value : Number(args[1]);
			switch (key) {
				case 'acceleration':
					if (value || value2) {
						emitter.acceleration.x = this.paramWithRate(value || 0, emitter.acceleration.x, rate);
						emitter.acceleration.y = this.paramWithRate(value2 || 0, emitter.acceleration.y, rate);
						// emitter.startSpeed.next = null;

						// if(args[2]){
						// 	emitter.maxSpeed = this.paramWithRate(args[2]||0,emitter.maxSpeed,rate);
						// }else{
						// 	emitter.maxSpeed = emitter.maxSpeed||NaN;
						// }
					} else {
						emitter.acceleration.x = this.paramWithRate(value || 0, emitter.acceleration.x, rate);
						emitter.acceleration.y = this.paramWithRate(value2 || 0, emitter.acceleration.y, rate);
					}
					break;
				// case 'maxSpeed':
				// 	if(args[0]==='NaN'){
				// 		emitter.maxSpeed = NaN;
				// 	}else{
				// 		emitter.maxSpeed = this.paramWithRate(value,emitter.maxSpeed,rate);
				// 	}
				// 	break;
				case 'startRotation':
					emitter.minStartRotation = this.paramWithRate(value, emitter.minStartRotation, rate);
					emitter.maxStartRotation = this.paramWithRate(value2, emitter.maxStartRotation, rate);
					break;
				case 'rotationSpeed':
					emitter.minRotationSpeed = this.paramWithRate(value, emitter.minRotationSpeed, rate);
					emitter.maxRotationSpeed = this.paramWithRate(value2, emitter.maxRotationSpeed, rate);
					break;
				case 'imageOption':
					emitter.angle = this.paramWithRate(value, emitter.angle, rate);
					emitter.mirrorType = this.paramWithRate(value2, emitter.mirrorType, rate);
					break;
				case 'lifetime':
					emitter.minLifetime = this.paramWithRate(value, emitter.minLifetime, rate);
					emitter.maxLifetime = this.paramWithRate(value2, emitter.maxLifetime, rate);
					break;
				case 'blendMode':
					if (isNaN(args[0])) {
						emitter.particleBlendMode = PIXI.BLEND_MODES[args[0].toUpperCase()] || 0;
					} else {
						emitter.particleBlendMode = value;
					}
					emitter.particleBlendMode = emitter.particleBlendMode.clamp(0, 10);
					break;
				case 'rect': //x,y,w,h
					if (this._targetType === TARGET_TYPES.region) {
						return;
					}
					emitter.spawnType = 'rect';
					emitter._spawnFunc = emitter._spawnRect;
					if (!emitter.spawnRect) emitter.spawnRect = new PIXI.Rectangle(0, 0, 0, 0);

					emitter.spawnRect.x = this.paramWithRate(value, emitter.spawnRect.x, rate);
					emitter.spawnRect.y = this.paramWithRate(value2, emitter.spawnRect.y, rate);
					emitter.spawnRect.width = this.paramWithRate(Number(args[2]), emitter.spawnRect.width, rate);
					emitter.spawnRect.height = this.paramWithRate(Number(args[3]), emitter.spawnRect.height, rate);
					// emitter.spawnRect = new PIXI.Rectangle(value,value2,Number(args[2]),Number(args[3]));
					break;
				case 'circle': //x,y,r
					if (this._targetType === TARGET_TYPES.region) {
						return;
					}
					emitter.spawnType = 'circle';
					emitter._spawnFunc = emitter._spawnCircle;
					if (!emitter.spawnCircle) emitter.spawnCircle = new PIXI.Circle(0, 0, 1);
					emitter.spawnCircle.x = this.paramWithRate(value, emitter.spawnCircle.x, rate);
					emitter.spawnCircle.y = this.paramWithRate(value2, emitter.spawnCircle.y, rate);
					emitter.spawnCircle.radius = this.paramWithRate(Number(args[2]), emitter.spawnCircle.radius, rate);
					// emitter.spawnCircle = new PIXI.Circle(value, value2, Number(args[2]));
					break;
				case 'ring': //x,y,r,minR
					if (this._targetType === TARGET_TYPES.region) {
						return;
					}
					emitter.spawnType = 'ring';
					emitter._spawnFunc = emitter._spawnRing;
					if (!emitter.spawnCircle) emitter.spawnCircle = new PIXI.Circle(0, 0, 1);
					emitter.spawnCircle.x = this.paramWithRate(value, emitter.spawnCircle.x, rate);
					emitter.spawnCircle.y = this.paramWithRate(value2, emitter.spawnCircle.y, rate);
					emitter.spawnCircle.radius = this.paramWithRate(Number(args[2]), emitter.spawnCircle.radius, rate);
					emitter.spawnCircle.minRadius = this.paramWithRate(Number(args[3]), emitter.spawnCircle.minRadius || 0, rate);
					break;
				case 'burst':
					if (this._targetType === TARGET_TYPES.region) {
						return;
					}
					emitter.spawnType = 'burst';
					emitter._spawnFunc = emitter._spawnBurst;
					emitter.particleSpacing = this.paramWithRate(value, emitter.particleSpacing, rate);
					emitter.angleStart = this.paramWithRate(value2, emitter.angleStart, rate);
					emitter.bdt = this.paramWithRate(Number(args[2] || 0), emitter.bdt, rate);
					emitter.brt = this.paramWithRate(Number(args[3] || 0), emitter.brt, rate);
					emitter.br = this.paramWithRate(Number(args[4] || 0), emitter.br, rate);
					emitter.bdr = this.paramWithRate(Number(args[5] || 0), emitter.bdr, rate);
					emitter.bdx = this.paramWithRate(Number(args[6] || 0), emitter.bdx, rate);
					emitter.bdy = this.paramWithRate(Number(args[7] || 0), emitter.bdy, rate);
					break;
				case 'point':
					if (this._targetType === TARGET_TYPES.region) {
						return;
					}
					emitter.spawnType = 'point';
					emitter._spawnFunc = emitter._spawnPoint;
				case 'position':
				case 'pos':
				case 'spawnPos':
					if (args[0] !== undefined) {
						emitter.spawnPos.x = this.paramWithRate(value, emitter.spawnPos.x, rate);
						emitter.spawnPos.y = this.paramWithRate(value2, emitter.spawnPos.y, rate);
					}
					break;

				case 'fluctuation':
					emitter.fluc = this.paramWithRate(value, emitter.fluc, rate);
					emitter.flucSense = this.paramWithRate(value2, emitter.flucSense, rate);
					break;
				case 'minimumSpeedMultiplier':
					emitter.minimumSpeedMultiplier = value;
					break;
				case 'minimumScaleMultiplier':
					emitter.minimumScaleMultiplier = value;
					break;
				case 'rotationAcceleration':
					emitter.rotationAcceleration = this.paramWithRate(value, emitter.rotationAcceleration, rate);
					break;
				case 'particlesPerWave':
					if (this._targetType === TARGET_TYPES.region) {
						this._data.ex.particlesPerWave = this.paramWithRate(value, emitter.particlesPerWave, rate) || 1;
						this.updateForRegion(true);
					} else {
						emitter.setParticlesPerWaveToApplyCapacity(Math.round(this.paramWithRate(value, emitter.particlesPerWave, rate)) || 1);
					}
					break;
				case 'frequency':
					if (this._targetType === TARGET_TYPES.region) {
						this._data.ex.frequency = this.paramWithRate(value, emitter.frequency, rate);
						this.updateForRegion(true);
					} else if (this._targetType === TARGET_TYPES.walk) {
						this._data.ex.frequency = this.paramWithRate(value, emitter.frequency, rate);
					} else {
						emitter.setFrequencyToApplyCapacity(this.paramWithRate(value, emitter.frequency, rate));
					}
					break;
				case 'spawnChance':
					emitter.spawnChance = this.paramWithRate(value, emitter.spawnChance, rate) || 1;
					break;
				case 'emitterLifetime':
					emitter.emitterLifetime = this.paramWithRate(value, emitter.emitterLifetime, rate);
					emitter._emitterLife = emitter.emitterLifetime;
					break;
				case 'maxParticles':
					if (this._targetType === TARGET_TYPES.region) {
						this._data.ex.maxParticles = this.paramWithRate(value, emitter.maxParticles, rate);
						this.updateForRegion(true);
					} else {
						emitter.setMaxParticlesToApplyCapacity(Math.round(this.paramWithRate(value, emitter.maxParticles, rate)));
					}
					break;
				case 'colorMode':
					emitter.colorDistribution = value !== 0;
					break;
				default:
					console.log('no param with key:', key, args);
					return;
			}
		};

		/* loop
		===================================*/
		ParticleEmitter.prototype.loopParticles = function (loopX, loopY, emitter = this._emitter) {
			var p = emitter._activeParticlesFirst;
			var width = Graphics.width + 2 * loopX;
			var height = Graphics.height + 2 * loopY;
			while (p) {
				var x = p.x;
				var node = p.parent;
				while (node) {
					x += node.x;
					node = node.parent;
				}
				var pw_half = p.width / 2;
				while (x + pw_half < -loopX) {
					x += width + pw_half;
					p.x += width + pw_half;
				}
				while (x - pw_half > Graphics.width + loopX) {
					x -= width + pw_half;
					p.x -= width + pw_half;
				}

				var y = p.y;
				node = p.parent;
				while (node) {
					y += node.y;
					node = node.parent;
				}
				var ph_half = p.height / 2;
				while (y + ph_half < -loopY) {
					y += height + pw_half;
					p.y += height + pw_half
				}
				while (y - ph_half > Graphics.height + loopY) {
					y -= height + pw_half;
					p.y -= height + pw_half
				}

				p = p.next;
			}
		};

		/* each targets
		===================================*/
		ParticleEmitter.prototype.updateCharacterOutsideFreeze = function (x, y) {
			if (this._data.stop) {
				this._freezed = false;
				return;
			}

			var margin = this._characterTargetMargin;
			if (margin < 0) return;

			if (x < -margin || x > Graphics.width + margin
				|| y < -margin || y > Graphics.height + margin) {
				this._freezed = true;
			} else {
				this._freezed = false;
			}
			this._container.visible = !this._freezed;
		};

		ParticleEmitter.prototype.updateForStartDash = function () {
			var target = this._target;
			if (!target) return false;

			var dashing = target.isDashing() && target.isMoving();

			var emit = dashing && ((!this._data.ex.dashing && !this._data.ex.lastDashing) || (this._data.ex.dir !== target._direction));
			this._data.ex.lastDashing = this._data.ex.dashing;
			this._data.ex.dashing = dashing;
			this._data.ex.dir = target._direction;

			if (emit !== this._emitter.emit) {
				this._emitter.resetPositionTracking();
				this._emitter.emit = emit
				return true;
			} else {
				return false;
			}
		};

		ParticleEmitter.prototype.updateForWalk = function () {
			var target = this._target;
			if (!target) return false;
			var emit;
			if (target.isMoving()) {
				emit = true;
				this._data.ex.lastMoving = true;
			} else {
				emit = (this._data.ex.lastMoving || false);
				this._data.ex.lastMoving = false;
			}
			if (emit) {
				if (this._data.ex && this._data.ex.regions) {
					var regionId = $gameMap.regionId(Math.round(target._realX), Math.round(target._realY));
					if (!this._data.ex.regions.contains(regionId)) {
						emit = false;
					}
				}
			}

			if (emit) {
				var dashing = target.isDashing() && target.isMoving();
				if (dashing !== this._data.ex.dashing) {
					var freq = this._data.ex.frequency * (dashing ? 1 : 2);
					this._emitter.setFrequencyToApplyCapacity(freq);
					this._data.ex.dashing = dashing;
				}
			}
			if (emit !== this._emitter.emit) {
				this._emitter.resetPositionTracking();
				this._emitter.emit = emit;
				return true;
			} else {
				return false;
			}
		};

		ParticleEmitter.prototype.updateForRegion = function (force) {
			var ex = this._data.ex;
			var sx = Math.round($gameMap._displayX);
			var sy = Math.round($gameMap._displayY);

			if (!force && ex.lastX === sx && ex.lastY === sy) return false;

			ex.lastX = sx;
			ex.lastY = sy;

			var x0 = sx - regionMargin;
			var y0 = sy - regionMargin;
			var x1 = sx + Graphics.width / 48 + regionMargin;
			var y1 = sy + Graphics.height / 48 + regionMargin;

			var target = this._target;
			target.length = 0;
			var allPos = ex.allPos;
			var length = allPos.length;

			for (var i = 0; i < length; i = (i + 2) | 0) {
				var x = allPos[i];
				if (x < x0 || x > x1) {
					if (this._loopXThreshold > 0) {
						x += $dataMap.width;
						if (x < x0 || x > x1) continue;
					} else {
						continue;
					}
				}
				var y = allPos[i + 1];
				if (y < y0 || y > y1) {
					if (this._loopYThreshold > 0) {
						y += $dataMap.height;
						if (y < y0 || y > y1) continue;
					} else {
						continue;
					}
				}

				target.push(x);
				target.push(y);
			}
			length = target.length / 2;
			var emit = length > 0;
			if (this._emitter.emit !== emit) {
				this._emitter.emit = emit;
			}
			if (emit) {
				this._emitter.setFrequencyToApplyCapacity(ex.frequency / length);
				this._emitter.setMaxParticlesToApplyCapacity(ex.maxParticles * length);
				this._emitter.setParticlesPerWaveToApplyCapacity(ex.particlesPerWave);
			}

			return true;
		};



		/* accessor
		===================================*/
		ParticleEmitter.prototype.container = function () {
			return this._container;
		};

		/* helper
		===================================*/
		ParticleEmitter.TRIGGER_TYPE_TARGETS = [
			TARGET_TYPES.walk, TARGET_TYPES.startdash, TARGET_TYPES.click, TARGET_TYPES.drag, TARGET_TYPES.region
		];

		ParticleEmitter.prototype.isEmitByOriginalTrigger = function () {
			return ParticleEmitter.TRIGGER_TYPE_TARGETS.contains(this._targetType);
		};

		ParticleEmitter.prototype.imageName = function (image) {
			return image || this._config.image || defaultImage;
		};


		/* filters
		===================================*/
		if (PIXI.filters) {
			var FILTER = {
				classWithType: {
					blur: PIXI.filters.BlurFilter,
					glow: PIXI.filters.GlowFilter,
					rgbsplit: PIXI.filters.RGBSplitFilter,
					pixelate: PIXI.filters.PixelateFilter,
					displacement: PIXI.filters.DisplacementFilter,
				},
				applyArgs: {
					blur: function (filter, args) {
						filter.blur = supplementDefNum(filter.blur, args[0]);
						filter.quality = supplementDefNum(filter.blur, args[1]);
					},
					glow: function (filter, args) {
						filter.innerStrength = supplementDefNum(filter.innerStrength, args[0]);
						filter.outerStrength = supplementDefNum(filter.outerStrength, args[1]);
						if (filter.distance !== undefined) {
							filter.distance = supplementDefNum(filter.distance, args[2]);
						}

						if (args[5] !== undefined) {
							var r = Number(args[3]).toString(16);
							var g = Number(args[4]).toString(16);
							var b = Number(args[5]).toString(16);
							if (r.length === 1) r = '0' + r;
							if (g.length === 1) g = '0' + g;
							if (b.length === 1) b = '0' + b;
							var color = '0x' + r + g + b;
							filter.color = Number(color)
						}
					},
					rgbsplit: function (filter, args) {
						filter.red = [supplementDefNum(filter.red[0], args[0]), supplementDefNum(filter.red[1], args[1])];
						filter.green = [supplementDefNum(filter.green[0], args[2]), supplementDefNum(filter.green[1], args[3])];
						filter.blue = [supplementDefNum(filter.blue[0], args[4]), supplementDefNum(filter.blue[1], args[5])];
					},
					pixelate: function (filter, args) {
						filter.size.x = supplementDefNum(filter.size.x, args[0]);
						filter.size.y = supplementDefNum(filter.size.y, args[1]);
					},
					displacement: function (filter, args) {
						filter.scale.x = supplementDefNum(filter.scale.x, args[0]);
						filter.scale.y = supplementDefNum(filter.scale.y, args[1]);
						filter.maskSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
					}
				},
			};

			ParticleEmitter.prototype.updateFilters = function (data) {
				this._fid = data.fid;
				var filterData = data.filters;
				var keys = Object.keys(filterData);

				var container = this._container;

				//remove erased filter
				var filter;
				var filters = container.filters || [];
				var currentKeys = this._filterKeys;
				var filterArgs = this._filterArgs;

				var length = currentKeys.length;
				for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
					var key = currentKeys[i];
					if (!keys.contains(key)) {
						currentKeys.splice(i, 1);
						delete this._filterArgs[key];

						filter = this.filterWithTypeInFilters(filters, key);
						if (filter) {
							filters.splice(filters.indexOf(filter));
						}
					}
				}

				//create & update filter
				var length = keys.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var key = keys[i];
					var args = filterData[key];
					var updateArgs = false;
					if (currentKeys.contains(key)) {
						updateArgs = !args.equals(filterArgs[key]);
						filter = this.filterWithTypeInFilters(filters, key);
					} else {
						var filterClass = this.filterClassWithType(key);
						if (filterClass === PIXI.filters.DisplacementFilter) {
							var bitmap = ImageManager.loadPicture('displacement');
							var sprite = new Sprite(bitmap);
							filter = new filterClass(sprite);
							filter.enabled = false;
							bitmap.addLoadListener(function (filter) {
								filter.enabled = true;
							}.bind(this, filter));
						} else {
							filter = new filterClass();
						}
						filters.push(filter);
						currentKeys.push(key);
						updateArgs = true;
					}
					if (updateArgs) {
						filterArgs[key] = args;
						this.applyFilterArgs(key, filter, args);
					}
				}

				container.filters = filters;
			};

			ParticleEmitter.prototype.applyFilterArgs = function (type, filter, args) {
				FILTER.applyArgs[type](filter, args);
			};
			ParticleEmitter.prototype.filterClassWithType = function (type) {
				return FILTER.classWithType[type];
			};

			ParticleEmitter.prototype.filterWithTypeInFilters = function (filters, type) {
				var filterClass = this.filterClassWithType(type);
				var filterLen = filters.length;
				for (var i = 0; i < filterLen; i = (i + 1) | 0) {
					var filter = filters[i];
					if (filter instanceof filterClass) {
						return filter;
					}
				}
				return null;
			};

		} else {
			ParticleEmitter.prototype.updateFilters = function (data) {
				this._fid = data.fid;
			}
		};



		//=============================================================================
		// TRP_Particle
		//=============================================================================
		var TRP_Emitter = /** @class */(function (_super) {
			__extends(TRP_Emitter, _super);

			var utils = PIXI.particles.ParticleUtils;
			function TRP_Emitter(particleParent, particleImages, config) {
				var _this = _super.call(this, particleParent, particleImages, config) || this;
				_this.fluc = _this.fluc || 0;
				_this.flucSense = _this.flucSense || 0;
				_this.colorDistribution = _this.colorDistribution || false;
				_this.mirrorType = _this.mirrorType || 0;
				_this.angle = _this.angle || 0;

				_this.bdt = _this.bdt || 0;
				_this.brt = _this.bdr || 0;
				_this.br = _this.br || 0;
				_this.bdr = _this.bdr || 0;
				_this.bdx = _this.bdx || 0;
				_this.bdy = _this.bdy || 0;

				_this._capacityRate = _this._capacityRate || 1;
				_this._capacityTarget = _this._capacityTarget || 0;
				_this._originalFrequency = _this._originalFrequency || 0;
				_this._originalMaxParticles = _this._originalMaxParticles || 0;
				_this._originalParticlesPerWave = _this._originalParticlesPerWave || 0;
				return _this;
			};
			TRP_Emitter.prototype.particleTotalCount = function () {
				return this.particleCount;
			};
			TRP_Emitter.prototype.init = function (art, config) {
				_super.prototype.init.call(this, art, config);
				if (!noRewriteFunctions) {
					if (config.speed) {
						this.startSpeed = PIXI.particles.PropertyNode.createList(config.speed);
					}
				}

				if (config.fluctuation) {
					this.fluc = config.fluctuation.max || 0;
					this.flucSense = config.fluctuation.sensitivity || 0;
				} else {
					this.fluc = 0;
					this.flucSense = 0;
				}
				this.colorDistribution = config.colorMode !== undefined && config.colorMode !== 0;
				if (config.angle !== undefined) {
					this.angle = config.angle || 0;
				} else {
					this.angle = config.angleType === 1 ? -1 : 0;
				}
				this.mirrorType = config.mirrorType || 0;

				this.bdt = config.bdt || 0;
				this.brt = config.brt || 0;
				this.br = config.br || 0;
				this.bdr = config.bdr || 0;
				this.bdx = config.bdx || 0;
				this.bdy = config.bdy || 0;

				this._originalFrequency = this._frequency;
				this._originalMaxParticles = this.maxParticles;
				this._originalParticlesPerWave = this.particlesPerWave || 1;
				this._capacityTarget = this.realParticleCapacity();
			};

			Object.defineProperty(TRP_Emitter.prototype, 'capacityRate', {
				get: function () {
					return this._capacityRate;
				}, set: function (value) {
					if (this._capacityRate === value) return;
					if (value >= 1) {
						this._capacityRate = value;
						this.didResetCapacityLimit();
					} else {
						this._capacityTarget = this.particleCapacity() * value;
						this._capacityRate = value;
						this.applyCapacityLimit();
					}
				},
				configurable: true
			});
			TRP_Emitter.prototype.didResetCapacityLimit = function () {
				this.frequency = this._originalFrequency;
				this.maxParticles = this._originalMaxParticles;
				this.particlesPerWave = this._originalParticlesPerWave || 1;
			};
			TRP_Emitter.prototype.setFrequencyToApplyCapacity = function (value) {
				this._originalFrequency = value;
				if (this._capacityRate < 1) {
					this.applyCapacityLimit();
				} else {
					this.frequency = value;
				}
			};
			TRP_Emitter.prototype.setMaxParticlesToApplyCapacity = function (value) {
				this._originalMaxParticles = value;
				if (this._capacityRate < 1) {
					this.applyCapacityLimit();
				} else {
					this.maxParticles = value;
				}
			};
			TRP_Emitter.prototype.setParticlesPerWaveToApplyCapacity = function (value) {
				this._originalParticlesPerWave = value || 1;
				if (this._capacityRate < 1) {
					this.applyCapacityLimit();
				} else {
					this.particlesPerWave = value || 1;
				}
			};
			TRP_Emitter.prototype.applyCapacityLimit = function () {
				var target = this._capacityTarget;
				var naturalCapacity = this.naturalCapacity(this._originalFrequency, this._originalParticlesPerWave);

				this.maxParticles = target;
				if (this.particlesPerWave > 1) {
					this.particlesPerWave = Math.ceil(Math.min(this._originalParticlesPerWave, this._originalParticlesPerWave * (target / naturalCapacity))) || 1;
					naturalCapacity = this.naturalCapacity(this._originalFrequency, this.particlesPerWave);
				}
				this.frequency = Math.max(this._originalFrequency, this._originalFrequency / (target / naturalCapacity));
			};
			TRP_Emitter.prototype.particleCapacity = function () {
				return Math.min(this._originalMaxParticles, this.naturalCapacity(this._originalFrequency, this._originalParticlesPerWave));
			};
			TRP_Emitter.prototype.realParticleCapacity = function () {
				return Math.min(this.maxParticles, this.naturalCapacity(this._frequency, this.particlesPerWave || 1));
			};
			TRP_Emitter.prototype.naturalCapacity = function (frequency, particlesPerWave) {
				var emitterLife = this._emitterLife < 0 ? this.emitterLifetime : this._emitterLife;
				if (emitterLife < 0) {
					return (this.minLifetime + this.maxLifetime) / 2
						* this.spawnChance * particlesPerWave / frequency;
				} else {
					return Math.min(emitterLife, (this.minLifetime + this.maxLifetime) / 2)
						* this.spawnChance * particlesPerWave / frequency;
				}
			};

			TRP_Emitter.prototype.applyAdditionalProperties = function (p) {
				_super.prototype.applyAdditionalProperties.call(this, p);
				if (this.minimumSpeedMultiplier === 1) {
					p.speedMultiplier = 1;
				}
				if (this.minimumScaleMultiplier === 1) {
					p.scaleMultiplier = 1;
				}

				p.fluc = this.fluc;
				p.flucSense = this.flucSense;
				p.colorDistribution = this.colorDistribution;

				p.wait = 0;

				p.mirror = this.mirrorType === 0 ? false : (this.mirrorType === 1 ? true : (Math.random() <= 0.5));
				p._angle = this.angle;
			};

			var helperPoint = new PIXI.Point();
			TRP_Emitter.prototype._spawnRegion = function (validPositions, p, emitPosX, emitPosY) {
				if (validPositions.length === 0) {
					return;
				}

				var rand = Math.randomInt(validPositions.length / 2) * 2;
				if (this.minStartRotation == this.maxStartRotation) {
					p.rotation = this.minStartRotation + this.rotation;
				} else {
					p.rotation = Math.random() * (this.maxStartRotation - this.minStartRotation) + this.minStartRotation + this.rotation;
				}

				//place the particle at a random point in the rectangle
				helperPoint.x = validPositions[rand] * 48 + Math.random() * 48;
				helperPoint.y = validPositions[rand + 1] * 48 + Math.random() * 48;
				if (this.rotation !== 0) {
					utils.rotatePoint(this.rotation, helperPoint);
				}
				p.position.x = emitPosX + helperPoint.x;
				p.position.y = emitPosY + helperPoint.y;
			};


			TRP_Emitter.prototype.shiftParticlePosX = function (value) {
				var particle = this._activeParticlesFirst;
				while (!!particle) {
					particle.x += value;
					particle = particle.next;
				}
			};
			TRP_Emitter.prototype.shiftParticlePosY = function (value) {
				var particle = this._activeParticlesFirst;
				while (!!particle) {
					particle.y += value;
					particle = particle.next;
				}
			};

			TRP_Emitter.prototype._spawnCircle = function (p, emitPosX, emitPosY) {
				//set the initial rotation/direction of the particle based on starting
				//particle angle and rotation of emitter
				if (this.minStartRotation == this.maxStartRotation)
					p.rotation = this.minStartRotation + this.rotation;
				else
					p.rotation = Math.random() * (this.maxStartRotation - this.minStartRotation) +
						this.minStartRotation + this.rotation;
				//place the particle at a random radius in the circle

				helperPoint.x = (1 - Math.random() * Math.random()) * this.spawnCircle.radius;
				helperPoint.y = 0;
				//rotate the point to a random angle in the circle
				utils.rotatePoint(Math.random() * 360, helperPoint);
				//offset by the circle's center
				helperPoint.x += this.spawnCircle.x;
				helperPoint.y += this.spawnCircle.y;
				//rotate the point by the emitter's rotation
				if (this.rotation !== 0)
					utils.rotatePoint(this.rotation, helperPoint);
				//set the position, offset by the emitter's position
				p.position.x = emitPosX + helperPoint.x;
				p.position.y = emitPosY + helperPoint.y;
			};

			TRP_Emitter.prototype._spawnBurst = function (p, emitPosX, emitPosY, i) {
				//set the initial rotation/direction of the particle based on spawn
				//angle and rotation of emitter
				var angle, r;
				if (this.particleSpacing === 0) {
					p.rotation = Math.random() * 360;
					r = this.br + this.bdr * i;
				} else {
					if (this.bdr < 0) {
						p.rotation = (this.particleSpacing * i);
						r = this.br + -1 * Math.floor(p.rotation / 360) * this.bdr;
						p.rotation += this.angleStart + this.rotation;
					} else {
						p.rotation = this.angleStart + (this.particleSpacing * i) + this.rotation;
						r = this.br + this.bdr * i;
					}
				}
				//drop the particle at the emitter's position
				p.position.x = emitPosX;
				p.position.y = emitPosY;

				p.x += r * Math.cos(p.rotation * Math.PI / 180) + this.bdx * i;
				p.y += r * Math.sin(p.rotation * Math.PI / 180) + this.bdy * i;

				if (this.brt === 1) {
					if (this.minStartRotation == this.maxStartRotation)
						p.rotation = this.minStartRotation + this.rotation;
					else
						p.rotation = Math.random() * (this.maxStartRotation - this.minStartRotation) + this.minStartRotation + this.rotation;
				} else if (this.brt === 2) {
					if (this.minStartRotation == this.maxStartRotation)
						p.rotation += this.minStartRotation + this.rotation;
					else
						p.rotation += Math.random() * (this.maxStartRotation - this.minStartRotation) + this.minStartRotation + this.rotation;
				}

				if (this.bdt && i > 0) {
					p.wait = this.bdt * i;
				}
			};

			return TRP_Emitter;
		}(PIXI.particles.Emitter));
		ParticleEmitter.TRP_Emitter = TRP_Emitter;

		var TRP_Particle = /** @class */(function (_super) {
			__extends(TRP_Particle, _super);

			var utils = PIXI.particles.ParticleUtils;
			function TRP_Particle(emitter) {
				var _this = _super.call(this, emitter) || this;
				_this.colorDistribution = false;
				_this.aVelocity = new PIXI.Point(0, 0);
				//inertiaVelocity
				_this.iVelocity = new PIXI.Point(0, 0);
				_this._doInertia = false;

				_this.fluc = 0;
				_this.flucSense = 0;
				_this._doFluctuation = false;
				_this._flucSpeed = 0;
				_this.rotatePoint = utils.rotatePoint;

				_this.mirror = false;
				_this._angle = 0;

				_this._doWait = false;
				_this.wait = 0;

				return _this;
			};

			if (noRewriteFunctions) {
				TRP_Particle.prototype.init = function () {
					_super.prototype.init.call(this);

					this.aVelocity.x = 0;
					this.aVelocity.y = 0;
					this.iVelocity.x = 0;
					this.iVelocity.y = 0;

					this._doWait = this.wait > 0;
					if (this._doWait) {
						this.alpha = 0;
					}

					this._doFluctuation = this.fluc > 0;
					this._flucSpeed = 0;

					if (this.colorDistribution) {
						this._doColor = false;
						if (this.colorList.next) {
							this.tint = this.colorList.interpolate(Math.random());
						}
					}

					if (this._angle < 0) {
						this.rotation = Math.random() * (Math.PI * 2);
					} else if (this._angle > 0) {
						this.rotation += this._angle * utils.DEG_TO_RADS;
					}

					this._doInertia = this.iVelocity.x !== 0 || this.iVelocity.y !== 0;
				};
				TRP_Particle.prototype.update = function (delta) {
					if (this._doWait) {
						this.wait -= delta;
						if (this.wait > 0) {
							return -1;
						}
						this._doWait = false;
						this.wait = 0;
					}

					var lerp = _super.prototype.update.call(this, delta);

					if (this._doFluctuation) {
						this._flucSpeed = this.flucSense * (-1 + 2 * Math.random()) * this.fluc
							+ (1 - this.flucSense) * (this._flucSpeed || 0);
						this.rotatePoint(this._flucSpeed, this.velocity);
					}
					if (this._doInertia) {
						this.position.x += delta * this.iVelocity.x;
						this.position.y += delta * this.iVelocity.y;
					}
					return lerp;
				};
			} else {
				TRP_Particle.prototype.init = function () {
					//reset the age
					this.age = 0;
					//set up the velocity based on the start speed and rotation
					this.velocity.x = this.speedList.current.value * this.speedMultiplier;
					this.velocity.y = 0;
					this.aVelocity.x = 0;
					this.aVelocity.y = 0;
					this.iVelocity.x = 0;
					this.iVelocity.y = 0;

					utils.rotatePoint(this.rotation, this.velocity);
					if (this._angle < 0) {
						this.rotation = Math.random() * (Math.PI * 2);
					} else if (this.noRotation) {
						this.rotation = 0;
					} else {
						if (this._angle > 0) {
							this.rotation += this._angle;
						}

						//convert rotation to Radians from Degrees
						this.rotation *= utils.DEG_TO_RADS;
					}
					//convert rotation speed to Radians from Degrees
					this.rotationSpeed *= utils.DEG_TO_RADS;
					this.rotationAcceleration *= utils.DEG_TO_RADS;
					//set alpha to inital alpha
					this.alpha = this.alphaList.current.value;
					//set scale to initial scale
					this.scale.x = this.scale.y = this.scaleList.current.value * this.scaleMultiplier;
					if (this.mirror) this.scale.x *= -1;
					//figure out what we need to interpolate

					this._doAlpha = !!this.alphaList.current.next;
					this._doSpeed = !!this.speedList.current.next;
					this._doScale = !!this.scaleList.current.next;
					this._doColor = !this.colorDistribution && !!this.colorList.current.next;
					this._doAcceleration = this.acceleration.x !== 0 || this.acceleration.y !== 0;
					//_doNormalMovement can be cancelled by subclasses
					this._doNormalMovement = this._doSpeed || this.speedList.current.value !== 0 || this._doAcceleration;
					//save our lerp helper
					this._oneOverLife = 1 / this.maxLife;
					//set the inital color
					if (this.colorDistribution && this.colorList.next) {
						this.tint = this.colorList.interpolate(Math.random());
					} else {
						var color = this.colorList.current.value;
						this.tint = utils.combineRGBComponents(color.r, color.g, color.b);
					}

					this._doWait = this.wait > 0;
					if (this._doWait) {
						this.alpha = 0;
					}

					this._doFluctuation = this.fluc > 0;
					this._flucSpeed = 0;

					this._doInertia = this.iVelocity.x !== 0 || this.iVelocity.y !== 0;

					//ensure visibility
					this.visible = true;
				};
				TRP_Particle.prototype.update = function (delta) {
					if (this._doWait) {
						this.wait -= delta;
						if (this.wait > 0) return -1;
						this._doWait = false;
					}

					//increase age
					this.age += delta;
					//recycle particle if it is too old
					if (this.age >= this.maxLife || this.age < 0) {
						this.kill();
						return -1;
					}
					//determine our interpolation value
					var lerp = this.age * this._oneOverLife; //lifetime / maxLife;
					if (this.ease) {
						if (this.ease.length == 4) {
							//the t, b, c, d parameters that some tween libraries use
							//(time, initial value, end value, duration)
							lerp = this.ease(lerp, 0, 1, 1);
						} else {
							//the simplified version that we like that takes
							//one parameter, time from 0-1. TweenJS eases provide this usage.
							lerp = this.ease(lerp);
						}
					}
					//interpolate alpha
					if (this._doAlpha) {
						this.alpha = this.alphaList.interpolate(lerp);
					}
					//interpolate scale
					if (this._doScale) {
						var scale = this.scaleList.interpolate(lerp) * this.scaleMultiplier;
						this.scale.x = this.scale.y = scale;
						if (this.mirror) this.scale.x *= -1;
					}
					//handle movement
					if (this._doNormalMovement) {
						//interpolate speed
						var oldVX = void 0;
						var oldVY = void 0;
						if (this._doAcceleration) {
							oldVX = this.velocity.x;
							oldVY = this.velocity.y;
						}
						if (this._doSpeed) {
							var speed = this.speedList.interpolate(lerp) * this.speedMultiplier;
							utils.normalize(this.velocity);
							utils.scaleBy(this.velocity, speed);
						}

						if (this._doAcceleration) {
							if (this._doSpeed) {
								this.aVelocity.x += this.acceleration.x * delta;
								this.aVelocity.y += this.acceleration.y * delta;
								this.velocity.x += this.aVelocity.x;
								this.velocity.y += this.aVelocity.y;
							} else {
								this.velocity.x += this.acceleration.x * delta;
								this.velocity.y += this.acceleration.y * delta;
							}
							if (this._doFluctuation) {
								this._flucSpeed = this.flucSense * (-1 + 2 * Math.random()) * this.fluc
									+ (1 - this.flucSense) * (this._flucSpeed || 0);
								this.rotatePoint(this._flucSpeed, this.velocity);
							}

							this.position.x += (oldVX + this.velocity.x) / 2 * delta;
							this.position.y += (oldVY + this.velocity.y) / 2 * delta;


						} else {
							if (this._doFluctuation) {
								this._flucSpeed = this.flucSense * (-1 + 2 * Math.random()) * this.fluc
									+ (1 - this.flucSense) * (this._flucSpeed || 0);
								this.rotatePoint(this._flucSpeed, this.velocity);
							}
							this.position.x += this.velocity.x * delta;
							this.position.y += this.velocity.y * delta;
						}
					}

					//inertia movement
					if (this._doInertia) {
						this.position.x += delta * this.iVelocity.x;
						this.position.y += delta * this.iVelocity.y;
					}

					//interpolate color
					if (this._doColor) {
						this.tint = this.colorList.interpolate(lerp);
					}
					//update rotation
					if (this.rotationAcceleration !== 0) {
						var newRotationSpeed = this.rotationSpeed + this.rotationAcceleration * delta;
						this.rotation += (this.rotationSpeed + newRotationSpeed) / 2 * delta;
						this.rotationSpeed = newRotationSpeed;
					}
					else if (this.rotationSpeed !== 0) {
						this.rotation += this.rotationSpeed * delta;
					}
					else if (this._doAcceleration && !this.noRotation && !this._angle) {
						this.rotation = Math.atan2(this.velocity.y, this.velocity.x); // + Math.PI / 2;
					}
					return lerp;
				};
			}

			return TRP_Particle;
		}(PIXI.particles.Particle));
		ParticleEmitter.TRP_Particle = TRP_Particle;



		/* test command
		===================================*/
		//PRAGMA: testCommands
		Game_Interpreter.prototype.trpParticleTest = function () {
			var eventId = this.isOnCurrentMap() ? this._eventId : 0;
			var list = [{ "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>パーティクルプラグインの基本動作のテストを行います。"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]1.パーティクルの再生(寿命あり)\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└particle play ID this 設定名"] }, { "code": 356, "indent": 0, "parameters": ["particle play fuss_startdash this"] }, { "code": 230, "indent": 0, "parameters": [45] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]2.パーティクルの表示(寿命なし)\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└particle set ID this 設定名"] }, { "code": 356, "indent": 0, "parameters": ["particle set particle this"] }, { "code": 230, "indent": 0, "parameters": [45] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]3.パーティクルの停止と再開\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└particle off ID"] }, { "code": 401, "indent": 0, "parameters": ["\\>└particle on ID"] }, { "code": 356, "indent": 0, "parameters": ["particle off particle this"] }, { "code": 230, "indent": 0, "parameters": [45] }, { "code": 356, "indent": 0, "parameters": ["particle on particle this"] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]4.パラメータの変更\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└particle update ID パラメータ名 値..."] }, { "code": 356, "indent": 0, "parameters": ["particle update particle color #ffffff #ffff00@0.5 #ff0000"] }, { "code": 356, "indent": 0, "parameters": ["particle update particle blendMode 0"] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]5.パラメータを徐々に変化\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└particle animate ID 時間 パラメータ名 値..."] }, { "code": 356, "indent": 0, "parameters": ["particle animate particle 30 pos -200 -200"] }, { "code": 230, "indent": 0, "parameters": [60] }, { "code": 356, "indent": 0, "parameters": ["particle animate particle 30 speed 100 0"] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 356, "indent": 0, "parameters": ["particle animate particle 30 pos 0 0"] }, { "code": 356, "indent": 0, "parameters": ["particle animate particle 30 speed 400 0"] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 356, "indent": 0, "parameters": ["particle off particle"] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]6.強制的に時間を進める\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└particle exceed ID フレーム数"] }, { "code": 356, "indent": 0, "parameters": ["particle on particle"] }, { "code": 356, "indent": 0, "parameters": ["particle exceed particle 10"] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]7.停止してクリア\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└particle clear ID"] }, { "code": 356, "indent": 0, "parameters": ["particle clear particle"] }, { "code": 230, "indent": 0, "parameters": [30] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]8.対象:screen\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└画面上で固定表示"] }, { "code": 356, "indent": 0, "parameters": ["particle set thunder_w screen"] }, { "code": 356, "indent": 0, "parameters": ["particle set thunder_w2 screen"] }, { "code": 230, "indent": 0, "parameters": [60] }, { "code": 356, "indent": 0, "parameters": ["particle clear thunder_w"] }, { "code": 356, "indent": 0, "parameters": ["particle clear thunder_w2"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]9.対象:weather\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└画面上で固定表示＆スクロールに連動"] }, { "code": 356, "indent": 0, "parameters": ["particle set rain_w3 weather"] }, { "code": 204, "indent": 0, "parameters": [6, 8, 5] }, { "code": 204, "indent": 0, "parameters": [4, 8, 5] }, { "code": 230, "indent": 0, "parameters": [60] }, { "code": 356, "indent": 0, "parameters": ["particle clear rain_w3"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]10.対象:リージョン\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└指定したリージョンのタイルから発生"] }, { "code": 356, "indent": 0, "parameters": ["particle set r_light region:1"] }, { "code": 230, "indent": 0, "parameters": [90] }, { "code": 356, "indent": 0, "parameters": ["particle clear r_light"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]11.対象:歩き\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└対象キャラが歩いてるときに表示"] }, { "code": 356, "indent": 0, "parameters": ["particle set fuss_walk walk:player"] }, { "code": 205, "indent": 0, "parameters": [-1, { "list": [{ "code": 29, "parameters": [5], "indent": null }, { "code": 37, "indent": 0 }, { "code": 3, "indent": null }, { "code": 3, "indent": null }, { "code": 3, "indent": 0 }, { "code": 3, "indent": 0 }, { "code": 3, "indent": null }, { "code": 3, "indent": null }, { "code": 2, "indent": 0 }, { "code": 2, "indent": 0 }, { "code": 2, "indent": null }, { "code": 2, "indent": null }, { "code": 2, "indent": null }, { "code": 2, "indent": null }, { "code": 29, "parameters": [4], "indent": null }, { "code": 38, "indent": null }, { "code": 0 }], "repeat": false, "skippable": false, "wait": true }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 29, "parameters": [5], "indent": null }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 37, "indent": 0 }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 3, "indent": null }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 3, "indent": null }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 3, "indent": 0 }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 3, "indent": 0 }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 3, "indent": null }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 3, "indent": null }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 2, "indent": 0 }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 2, "indent": 0 }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 2, "indent": null }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 2, "indent": null }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 2, "indent": null }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 2, "indent": null }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 29, "parameters": [4], "indent": null }] }, { "code": 505, "indent": 0, "parameters": [{ "code": 38, "indent": null }] }, { "code": 356, "indent": 0, "parameters": ["particle clear fuss_walk"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2, ""] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]12.グループ機能＆サブエミッター\\C[0]"] }, { "code": 401, "indent": 0, "parameters": ["\\>└グループ機能：まとめてコマンドを実行"] }, { "code": 401, "indent": 0, "parameters": ["\\>└サブエミッター：パーティクルから子パーティクル発生"] }, { "code": 401, "indent": 0, "parameters": ["\\>└\\C[2]※上部に遠景が見える場所で実行してください。"] }, { "code": 356, "indent": 0, "parameters": ["particle group set fireworks this"] }, { "code": 230, "indent": 0, "parameters": [90] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2, ""] }, { "code": 401, "indent": 0, "parameters": ["\\>\\C[14]13.グループ停止"] }, { "code": 356, "indent": 0, "parameters": ["particle clear tag:group:fireworks"] }, { "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": ["\\>以上で基本動作テストを終わります。"] }, { "code": 0, "indent": 0, "parameters": [] }];
			this.setupChild(list, eventId);
		};
		//PRAGMA_END: testCommands

		Game_Interpreter.prototype.trpParticleTest2 = function () {
			var eventId = this.isOnCurrentMap() ? this._eventId : 0;
			var list = [{ "code": 101, "indent": 0, "parameters": ["", 0, 0, 2] }, { "code": 401, "indent": 0, "parameters": [NLC("\\>パーティクルエディタの動作テストを行います。", 182)] }, { "code": 230, "indent": 0, "parameters": [10] }, { "code": 356, "indent": 0, "parameters": ["particle edit test this"] }, { "code": 0, "indent": 0, "parameters": [] }];
			this.setupChild(list, eventId);
		};




		/* instant bug fix
		===================================*/
		(() => {
			if (parameters.windowBugFix === 'false' || parameters.windowBugFix === false) {
				return;
			}

			var Window_drawShape = Window.prototype.drawShape;
			Window.prototype.drawShape = function (graphics) {
				if (this.opacity === 0) return;
				Window_drawShape.call(this, graphics);
			}
		})();



		/* cache config
		===================================*/
		(function () {
			'use strict';
			if (!parameters.useCache || parameters.useCache === 'false') return;

			//=============================================================================
			// TRP_Emitter
			//=============================================================================
			var Emitter = PIXI.particles.Emitter;
			var TRP_Emitter = ParticleEmitter.TRP_Emitter;

			TRP_Emitter._particleCache = {};

			var _TRP_Emitter_destroy = TRP_Emitter.prototype.destroy;
			TRP_Emitter.prototype.destroy = function () {
				this.cleanup();

				var constructorName = this._particleConstructor.name;;
				if (!TRP_Emitter._particleCache[constructorName]) {
					TRP_Emitter._particleCache[constructorName] = [];
				}

				var next;
				for (var particle = this._poolFirst; particle; particle = next) {
					//store next value so we don't lose it in our destroy call
					next = particle.next;

					particle.emitter = null;
					particle.next = null;
					particle.prev = null;
					if (constructorName === 'TRP_ParticleEx') {
						particle.subEmitters = null;
						particle.subEmitterData.length = 0;
					}
					particle.applyArt(null);

					TRP_Emitter._particleCache[constructorName].push(particle);
				}
				this._poolFirst = null;

				Emitter.prototype.destroy.call(this);
			};

			var _TRP_Emitter_init = TRP_Emitter.prototype.init;
			TRP_Emitter.prototype.init = function (art, config) {
				_TRP_Emitter_init.call(this, art, config);
				this.preparePoolFromCache();
			};

			TRP_Emitter.prototype.preparePoolFromCache = function (rate = 1) {
				var capacity = rate * this.naturalCapacity(this._originalFrequency, this._originalParticlesPerWave);

				var constructorName = this._particleConstructor.name;;
				var cache = TRP_Emitter._particleCache[constructorName];
				if (!cache) return;

				var particle = cache.pop();
				if (!particle) return;
				if (!this._poolFirst) {
					this._poolFirst = particle;
				}

				var prev = null;
				particle.emitter = this;

				for (var i = 0; i < capacity; i = (i + 1) | 0) {
					particle.emitter = this;

					if (prev) {
						prev.next = particle;
						particle.prev = prev;
					}
					prev = particle;

					particle = cache.pop();
					if (!particle) {
						break;
					}
				}
			};
		})();

	})();

	// ParticleEditor
	// ParticleParam
	// ParticleParam.ValueParam
	// ParticleParam.NodeParam
	// ParticleParam.ColorNodeParam
	// ColorPicker
	// ImagePicker

	function ParticleEditor() {
		this.initialize.apply(this, arguments);
	}
	if (Utils.isNwjs() && Utils.isOptionValid('test')) {
		//PRAGMA: editorPathSetting
		ParticleEditor.DATA_DIR_PATH = 'data';
		ParticleEditor.FILE_PATH = 'data/TrpParticles.json';
		ParticleEditor.HELP_PATH = 'js/plugins/TRP_Particle_List.js';
		ParticleEditor.IMAGE_PATH = 'img/particles/';
		ParticleEditor.ANIMATION_PATH = 'img/animations/';
		//PRAGMA_END: editorPathSetting

		//make animation dir
		var fs = require('fs');
		var path = require('path');
		var base = path.dirname(process.mainModule.filename);
		var filePath = path.join(base, ParticleEditor.ANIMATION_PATH);
		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(ParticleEditor.ANIMATION_PATH)
		}
		if (!fs.existsSync(ParticleEditor.DATA_DIR_PATH)) {
			fs.mkdirSync(ParticleEditor.DATA_DIR_PATH);
		}
	};



	(function () {
		"use strict";
		if (!Utils.isNwjs() || !Utils.isOptionValid('test')) {
			return;
		}
		var fs = require('fs');
		var path = require('path');
		var base = path.dirname(process.mainModule.filename);
		var filePath = path.join(base, ParticleEditor.FILE_PATH);
		if (!fs.existsSync(filePath)) {
			var defData = JSON.stringify(JsonEx.makeDeepCopy(Game_Particle.DEFAULT_DATA));
			var file = '{"test":' + defData + '}';
			fs.writeFileSync(filePath, file);
		}
	})();


	(function () {
		"use strict";

		if (!Utils.isNwjs() || !Utils.isOptionValid('test')) {
			return;
		};

		//PRAGMA: editorPluginNames
		var pluginName = 'TRP_ParticleEditor';
		var basePluginName = 'TRP_Particle';
		var listPluginName = 'TRP_Particle_List';
		//PRAGMA_END: editorPluginNames

		var LC = TRP_Localize.localize.bind(TRP_Localize, 'parEd');
		var NLC = TRP_Localize.noLocalize;

		var parameters = PluginManager.parameters(pluginName);
		parameters.imageNames = null;
		parameters.animationNames = null;

		var showGuide = parameters.showGuide === 'true';
		var paramFontSize = Number(parameters.paramFontSize) || 18;
		var noColorCode = parameters.noColorCode === 'true';

		var saveAsArray = parameters.saveAsArray === 'true';
		var copyAsArray = parameters.copyAsArray === 'true';

		var noLineBreaks = parameters.noLineBreaks === saveAsArray;


		var isMac = navigator.userAgent.match(/Macintosh|Mac/);
		var displayCount = PluginManager.parameters(basePluginName).displayCount === 'true';
		ParticleEditor.DEFAULT_DATA = Game_Particle.DEFAULT_DATA;


		(function () {
			ParticleEditor.GUIDE_TEXTS = {
				alpha: [LC('【アルファ/不透明度】', 0), LC('値の範囲:0~1', 1), null, LC('<中間値設定可能>', 2), LC('左端が開始時(時間0)、右端が終了時(時間1)の値', 3), LC('@時間(0~1) + Enterで中間値を設定可能', 4), LC('delete(Macはfn+delete)で中間値の削除', 5), LC('中間値編集中にshift+@時間(0~1)+Enterで時間変更', 6), LC('例)@0.5 + Enterで中間地点での値を設定開始', 7)],
				scale: [LC('【スケール/拡大率】', 8), LC('1で等倍', 9), null, LC('<中間値設定可能>', 10), LC('左端が開始時(時間0)、右端が終了時(時間1)の値', 11), LC('@時間(0~1) + Enterで中間値を設定可能', 12), LC('delete(Macはfn+delete)で中間値の削除', 13), LC('中間値編集中にshift+@時間(0~1)+Enterで時間変更', 14), LC('例)@0.5 + Enterで中間地点での値を設定開始', 15)],
				minimumScaleMultiplier: [LC('【最小スケール倍率】', 16), LC('パーティクル生成時の最小スケール倍率', 17), LC('例)0.1として開始時のスケールが0.5の場合は', 18), LC('　 0.5*0.1=0.05から0.5の間の', 19), LC('　 ランダムなスケールのパーティクルが発生。', 20)],
				speed: [LC('【スピード/速度】', 21), LC('パーティクルの速度。開始値は0にしないこと。', 22), null, LC('<中間値設定可能>', 23), LC('左端が開始時(時間0)、右端が終了時(時間1)の値', 24), LC('@時間(0~1) + Enterで中間値を設定可能', 25), LC('delete(Macはfn+delete)で中間値の削除', 26), LC('中間値編集中にshift+@時間(0~1)+Enterで時間変更', 27), LC('例)@0.5 + Enterで中間地点での値を設定開始', 28)],
				minimumSpeedMultiplier: [LC('【最小スピード倍率】', 29), LC('パーティクル生成時の最小スピード倍率', 30), LC('例)0.1として開始時のスピードが0.5の場合は', 31), LC('　 0.5*0.1=0.05から0.5の間の', 32), LC('　 ランダムなスピードのパーティクルが発生。', 33)],
				color: [LC('【カラー/色】', 34), LC('左上のカラーピッカーで設定可能', 35), LC('バックスペース(Macはdelete)で白にリセット', 36), null, LC('<中間値設定可能>', 37), LC('左端が開始時(時間0)、右端が終了時(時間1)の値', 38), LC('@時間(0~1) + Enterで中間値を設定可能', 39), LC('delete(Macはfn+delete)で中間値の削除', 40), LC('中間値編集中にshift+@時間(0~1)+Enterで時間変更', 41), LC('例)@0.5 + Enterで中間地点での値を設定開始', 42)],
				colorMode: [LC('【カラーモード】', 43), LC('0で時間によって色が変化。', 44), LC('0以外で発生時の色の分布を変化(時間変化無し)', 45)],
				acceleration: [LC('【加速度】', 46), LC('加速度が有効な場合は画像の向きは移動方向で固定', 47)],
				startRotation: [LC('【発生時の射出角度】', 48), LC('パーティクルの飛び出す方向。(画像の向きも連動)', 49), LC('0で右,90で下,180で左,270(-90)で上方向。', 50)],
				rotationSpeed: [LC('【画像回転速度】', 51), LC('画像の回転速度の最小値と最大値。', 52), LC('動きには影響なし。', 53)],
				imageOption: [LC('【画像表示設定】', 54), LC('画像の向き/反転の設定。動きには影響なし。', 55), LC('angle:0~360で画像のみ回転、-1でランダムな角度。', 56), LC('mirror:0で調整なし,1で反転,2でランダム。', 57)],
				lifetime: [LC('【パーティクル寿命】', 58), LC('個々のパーティクルの消えるまでの秒数', 59)],
				blendMode: [],
				frequency: [LC('【フリクエンシー/発生間隔】', 60), LC('パーティクルが発生する間隔', 61), LC('0.01とすると0.01秒に1回発生し、1秒間に100回', 62)],
				spawnChance: [LC('【発生確率】', 63), LC('各発生タイミングに、パーティクルが発生する確率。', 64)],
				particlesPerWave: [LC('【1回での発生個数】', 65), LC('各発生タイミングに同時に発生する個数。', 66), LC('同時に発生するパーティクルのlifetimeは固定', 67)],
				emitterLifetime: [LC('【エミッター寿命】', 68), LC('-1で無限。0より大きくすると、指定時間で発生終了', 69)],
				maxParticles: [LC('【最大表示数の制限】', 70), LC('このエミッターから発生する最大数の制限値', 71)],
				fluctuation: [LC('【フラクチュエーション/ゆらぎ】', 72), LC('角度のゆらぎ設定。', 73), LC('max:各フレームで角度の変化幅の最大値', 74), LC('sensitivity:0~1で指定。小さいほどゆるやかに、大きいほど激しくゆらぐ。', 75)],
				pos: [LC('【ポイント(発生方法)】', 76), LC('指定の点から発生。', 77), LC('<※発生方法はいずれか１つのみ指定が有効>', 78)],
				rect: [LC('【レクト/四角(発生方法)】', 79), LC('四角形の中からランダムに発生。', 80), LC('左上の点をx,y、幅/高さをwidth,heightで指定', 81), LC('<※発生方法はいずれか１つのみ指定が有効>', 82)],
				circle: [LC('【サークル/円(発生方法)】', 83), LC('円の中からからランダムに発生', 84), LC('中心点をx,y、半径をradiusで指定。', 85), LC('<※発生方法はいずれか１つのみ指定が有効>', 86)],
				ring: [LC('【リング(発生方法)】', 87), LC('ドーナツ状のリングからランダムに発生。', 88), LC('中心点をx,y、外側の半径をradius', 89), LC('内側の半径をminRで指定。', 90), LC('<※発生方法はいずれか１つのみ指定が有効>', 91)],
				burst: [LC('【バースト(発生方法)】', 92), LC('particlesPerWaveで規則的に発生させる', 93), LC('ps:射出角度の差(particleSpacing)', 94), LC('sa:開始角度。ps*sa=360とすると放射状に射出(startAngle)', 95), LC('dt:射出時間の差(deltaTime)', 96), LC('rt:0=開始角度(startRotation)無視', 97), LC('└1=開始角度優先,2=開始角度を加算(rotationType)', 98), LC('r:半径(radius)', 99), LC('dr:半径の差。マイナスで1周ごとの差(deltaRadius)', 100), LC('dx:xの差(deltaX)', 101), LC('dy:yの差(deltaY)', 102), LC('<※発生方法はいずれか１つのみ指定が有効>', 103)],

				sub: [LC('【サブエミッター設定】', 104), LC('st:射出開始タイミング(0~1)', 105), LC('et:射出終了タイミング(0~1。-1で無効)', 106), LC('spd:慣性の影響度合い。0=影響なし、1=100%影響。', 107), LC('iAngle:1=開始角度は慣性方向基準', 108), LC('iScale:1=親パーティクルの拡大率乗数を継承', 109)]
			};

			//blend mode guide text
			var texts = ParticleEditor.GUIDE_TEXTS.blendMode;
			ParticleEditor.BLEND_MODE_NAMES = Game_Particle.BLEND_MODE_NAMES;
			texts.push(LC('【ブレンドモード/画像合成方法】', 110));
			var length = ParticleEditor.BLEND_MODE_NAMES.length;
			var text = '';
			for (var i = 0; i < length; i = (i + 1) | 0) {
				if (i % 3 === 0) {
					if (i > 0) {
						texts.push(text);
					}
					text = '';
				} else {
					text += ',';
				}
				text += i + ':' + ParticleEditor.BLEND_MODE_NAMES[i];
				if (i === length - 1) {
					texts.push(text);
				}
			}
		})();

		function supplement(defaultValue, optionArg) {
			if (optionArg === undefined) {
				return defaultValue;
			}
			return optionArg;
		};
		function supplementNum(defaultValue, optionArg) {
			return Number(supplement(defaultValue, optionArg));
		};

		var _supplementDefWords = ['default', 'def', 'd'];
		function supplementDef(defaultValue, optionArg, otherWords) {
			var value = supplement(defaultValue, optionArg);

			var defTargetWords = otherWords || [];
			if (defTargetWords) {
				defTargetWords = defTargetWords.concat(_supplementDefWords);
			} else {
				defTargetWords = _supplementDefWords;
			}

			var length = defTargetWords.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var target = defTargetWords[i];
				if (value === target) {
					value = defaultValue;
					break;
				}
			}
			return value;
		};
		function supplementDefNum(defaultValue, optionArg, otherWords) {
			var value = supplementDef(defaultValue, optionArg, otherWords);
			return Number(value);
		};

		//=============================================================================
		// Game_Particle
		//=============================================================================
		Game_Particle.prototype.particleEdit = function (eventId, id, target, name, z, x, y, image) {
			this._particleEdit(eventId, null, id, target, name, z, x, y, image);
		};
		Game_Particle.prototype._particleEditWithExData = function (exData, eventId, copyName, id, target, name, z, x, y, image) {
			this._particleEdit(eventId, copyName, id, target, name, z, x, y, image, exData);
		};
		Game_Particle.prototype._particleEdit = function (eventId, copyName, id, target, name, z, x, y, image, exData = null) {
			var mainId = '';
			var subId = '';
			if (id.contains(Game_Particle.SUB_EMITTER_DEV_SUFFIX)) {
				var args = id.split(Game_Particle.SUB_EMITTER_DEV_SUFFIX);
				mainId = args[0];
				subId = args[1];
				name = supplementDef(subId, name) || subId;
			} else {
				mainId = id;
				name = supplementDef(id, name) || id;
			}

			//ensure config data exists
			if (copyName) {
				var copyData = $dataTrpParticles[copyName];
				if (!copyData) {
					throw new Error('not found copy original data for name ' + copyName);
				}
				$dataTrpParticles[name] = JsonEx.makeDeepCopy($dataTrpParticles[copyName]);
			} else if (!$dataTrpParticles[name]) {
				if ($dataTrpParticlePreset[name]) {
					$dataTrpParticles[name] = JsonEx.makeDeepCopy($dataTrpParticlePreset[name]);
				} else {
					$dataTrpParticles[name] = JsonEx.makeDeepCopy(ParticleEditor.DEFAULT_DATA);
				}
			}

			//ensure emitter data exists
			var data = this.dataWithId(mainId, true);
			if (!data) {
				if (!subId) {
					this.particleSet(eventId, mainId, target, name, z, x, y, image);
				} else {
					throw new Error(LC('管理ID「%1」は再生されてません。', 111).format(mainId));
				}
			}

			id = this.idWithSuffix(id);
			SceneManager._scene.startParticleEdit(this, id, exData);

			return true;
		};




		//=============================================================================
		// ParticleEmitter
		//=============================================================================
		var _ParticleEmitter_update = ParticleEmitter.prototype.update;
		ParticleEmitter.prototype.update = function () {
			if (this._destroyed) return false;

			var changed = false;
			if (this._data.editing) {
				ParticleEditor.EDITING_EMITTER = this;
				changed = this.updateForEditing();
			}
			return _ParticleEmitter_update.call(this) || changed;
		};

		ParticleEmitter.prototype.updateForEditing = function () {
			var changed = false;
			if (this._data.forceChangeImage) {
				this._data.forceChangeImage = false;
				this.changeImage(this._data.image);
			}

			if (this._data.editingSubData) {
				var subData = this._data.editingSubData;
				if (subData.forceChangeImage) {
					subData.forceChangeImage = false;
					this.changeImage(subData.image, this.subEmitter(subData.name));
				}
				if (subData.pChanged) {
					this.updateParams(subData, this.subEmitter(subData.name));
					subData.pChanged = false;

					changed = true;
				}
			}
			return changed;
		};

		var _ParticleEmitter_updateEmitter = ParticleEmitter.prototype.updateEmitter;
		ParticleEmitter.prototype.updateEmitter = function () {
			_ParticleEmitter_updateEmitter.call(this);

			if (this._restartCount <= 0
				&& this._data
				&& this._data.editing
				&& this._emitter
				&& ((this._emitter._emitterLife === 0 || !this._emitter.emit) || this.isEmitByOriginalTrigger())
				&& this._emitter.particleCount === 0
				&& this._targetType !== TARGET_TYPES.click
				&& this._targetType !== TARGET_TYPES.drag) {
				this.restartForEditing();
			}
		};

		var _ParticleEmitter_tryDestroy = ParticleEmitter.prototype.tryDestroy;
		ParticleEmitter.EDIT_RESTART_COUNT = 10;
		ParticleEmitter.prototype.tryDestroy = function () {
			if (this._data.editing) {
				this.restartForEditing();
				return;
			}

			_ParticleEmitter_tryDestroy.call(this);
		};


		ParticleEmitter.prototype.restartForEditing = function () {
			this._emitter.emit = false;
			this._restartCount = ParticleEmitter.EDIT_RESTART_COUNT;
			this._stop = false;
			this._data.stop = false;
		};

		var _ParticleEmitter_updateForWalk = ParticleEmitter.prototype.updateForWalk;
		ParticleEmitter.prototype.updateForWalk = function () {
			if (this._data.editing) {
				this._emitter.emit = true;
			} else {
				_ParticleEmitter_updateForWalk.call(this);
			}
		};

		var _ParticleEmitter_updateForStartDash = ParticleEmitter.prototype.updateForStartDash;
		ParticleEmitter.prototype.updateForStartDash = function () {
			if (this._data.editing) {
				this._emitter.emit = true;
			} else {
				_ParticleEmitter_updateForStartDash.call(this);
			}
		};


		//=============================================================================
		// Scenes
		//=============================================================================
		var _Scene_Boot_start = Scene_Boot.prototype.start;
		Scene_Boot.prototype.start = function () {
			_Scene_Boot_start.call(this);

			PresetPicker.CATEGORY_NAMES = [NLC('キャラ対象', 158, 'character'), NLC('スクリーン/天候/リージョン', 159, 'screen/weather/region'), NLC('マウス/タップ', 160, 'click/drag'), NLC('その他', 161, 'Others'), NLC('非表示(/h)', 162, 'hidden(/h)')];
		};

		Scene_Base.prototype.particleCountHandlerWithId = function (id, subId) {
			if (!this._particleSystem) return null;

			var emitter = this._particleSystem._emitters[id];
			if (!emitter) return null;

			return emitter.particleCount.bind(emitter, subId);
		};

		Scene_Base.prototype.startParticleEdit = function (particle, id, exData) {
			if (this._particleEditor) {
				this.addChild(this._particleEditor);
				return;
			}
			if (!this._particleSystem) return;

			this._particleEditor = new ParticleEditor(particle, id, exData);
			this.addChild(this._particleEditor);
		};


		var _Scene_Base_update = Scene_Base.prototype.update;
		Scene_Base.prototype.update = function () {
			if (!!this._particleEditor) {
				this.updateForParticleEdit();
			} else {
				_Scene_Base_update.call(this);
			}
		};
		Scene_Base.prototype.updateForParticleEdit = function () {
			$gameScreen._particle.update();
			this._particleSystem.updateForEditor(this);
			this._particleEditor.update();
			if (this._particleEditor.isTerminated()) {
				this.removeChild(this._particleEditor);
				this._particleEditor = null;
			}
		};


		var _Scene_Map_update = Scene_Map.prototype.update;
		Scene_Map.prototype.update = function () {
			if (!!this._particleEditor) {
				Scene_Base.prototype.update.call(this);
				this._spriteset._destinationSprite.update();
			} else {
				_Scene_Map_update.call(this);
			}
		};



		var _Scene_Battle_update = Scene_Battle.prototype.update;
		Scene_Battle.prototype.update = function () {
			if (!!this._particleEditor) {
				Scene_Base.prototype.update.call(this);
			} else {
				_Scene_Battle_update.call(this);
			}
		};



		//=============================================================================
		// Manager
		//=============================================================================
		ImageManager.loadParticlePreset = function (filename, hue) {
			return this.loadBitmap('img/particlePresets/', filename, hue, true);
		};



		//=============================================================================
		// ParticleEditor
		//=============================================================================
		ParticleEditor.EDITING_EMITTER = null;
		ParticleEditor.prototype = Object.create(PIXI.Container.prototype);
		ParticleEditor.prototype.constructor = ParticleEditor;

		ParticleEditor.prototype.initialize = function (particle, id, exData) {
			PIXI.Container.call(this);
			this.initMembers();

			this.width = Graphics.width;
			this.height = Graphics.height;
			Input.clear();

			var data, subData, targetData;
			var subConfig = null;
			var mainId = id;
			var subId = '';
			if (id.contains(Game_Particle.SUB_EMITTER_DEV_SUFFIX)) {
				var args = id.split(Game_Particle.SUB_EMITTER_DEV_SUFFIX);
				mainId = args[0];
				subId = args[1];

				data = particle._data[mainId];
				targetData = subData = particle.particleData(0, subId, 'this', args[1], data.z, data.x, data.y);
				subConfig = exData || {
					timing: 0,
					speedRate: 0,
					inheritAngle: 0,
					inheritScale: 0,
				};
			} else {
				targetData = data = particle._data[id];
				subData = null;
			}
			var config = Game_Particle.configData(targetData);

			if (targetData.image) {
				this.checkImageExists(targetData);
			} else if (config.image) {
				this.checkImageExists(config);
			}

			data.editing = true;
			if (subData) {
				subData.editing = true;
			}
			data.editingSubData = subData;

			this._id = id;
			this._mainId = mainId;
			this._subId = subId;
			this._particle = particle;

			this._data = data;
			this._subData = subData;
			this._config = config;
			this._subConfig = subConfig;
			this._image = config.image;

			this.trySearchImageNames();

			this.createSelectorSprite();
			this.createParts(targetData, config);
			this.createColorPicker();
			this.createMenuButtons();
			this.createNumInfo();

			if (showGuide) {
				this.createGuideSprite();
			}

			this.registerKeyListeners();
			this.resetInputingWords();

			this.refreshPartsHidden();
		};
		ParticleEditor.prototype.initMembers = function () {
			this._id = '';
			this._mainId = '';
			this._subId = '';
			this._particle = null;

			this._terminated = false;
			this._data = null;
			this._subData = null;
			this._config = null;
			this._subConfig = null;
			this._image = '';

			this._lastEditingIndex = -1;
			this._editingIndex = -1;
			this._particleCount = 0;
			this._particleCountInterval = 0;
			this._commands = [];
			this._menuCommands = [];
			this._saveButton = null;
			this._hiddenButton = null;

			this._guideSprite = null;
			this._guideCache = null;

			this._countHandler = null;
			this._keydownListener = null;
			this._keyupListener = null;
			this._keyCode = 0;
			this._key = '';


			this._parts = [];
			this._particleCountSprite = null;
			this._inputtingWords = null;

			this._colorPicker = null;

			this._imagePicker = null;
			this._tilePicker = null;
			this._animationPicker = null;
			this._presetPicker = null;
			this._loadPicker = null;
			this._activePicker = null;

			this._menuSprites = [];
		};

		ParticleEditor.prototype.terminate = function () {
			this._terminated = true;

			var emitter = ParticleEditor.EDITING_EMITTER;
			ParticleEditor.EDITING_EMITTER = null;

			if (this._data) {
				delete this._data.editing;
				delete this._data.editingSubData;
				if (emitter && emitter._emitter && emitter._emitter._emitterLife >= 0) {
					this._data.clear = true;
				}
			}
			if (this._subData) {
				delete this._subData.editing;
			}

			this._countHandler = null;
			this._particle = null;
			this._data = null;
			this._subData = null;
			this._config = null;

			this.removeEventListeners();

			emitter = null;
		}


		ParticleEditor.prototype.isTerminated = function () {
			return this._terminated;
		};

		ParticleEditor.prototype.trySearchImageNames = function () {
			if (parameters.imageNames) return;

			var fs = require('fs');
			var path = require('path');
			var base = path.dirname(process.mainModule.filename);
			var dirPath = path.join(base, ParticleEditor.IMAGE_PATH);

			var imageNames = [];
			var files = fs.readdirSync(dirPath)
			var length = files.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var file = files[i];
				var fp = path.join(dirPath, file);

				if (!fs.statSync(fp).isFile()) continue;
				if (!(/.*\.png$/.test(file))) continue;
				if (file.indexOf('_ANIM_') !== 0) {
					imageNames.push(file.replace('.png', ''));
				}
			}
			imageNames.sort();
			parameters.imageNames = imageNames;

			//animations
			dirPath = path.join(base, ParticleEditor.ANIMATION_PATH);
			var animationNames = [];
			var files = fs.readdirSync(dirPath)
			var length = files.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var file = files[i];
				var fp = path.join(dirPath, file);

				if (!fs.statSync(fp).isFile()) continue;
				if (!(/.*\.png$/.test(file))) continue;
				animationNames.push(file.replace('.png', ''));
			}
			animationNames.sort();
			parameters.animationNames = animationNames;
		};

		ParticleEditor.prototype.targetData = function () {
			return this._subData || this._data;
		};

		/* key
		===================================*/
		ParticleEditor.prototype.registerKeyListeners = function () {
			var listener = this._onKeyDown.bind(this);
			this._keydownListener = listener;
			document.addEventListener('keydown', listener);

			listener = this._onKeyUp.bind(this);
			this._keyupListener = listener;
			document.addEventListener('keyup', listener);

			listener = this.processCopy.bind(this);
			this._copyListener = listener;
			document.addEventListener('copy', listener);

			listener = this.processPaste.bind(this);
			this._pasteListener = listener;
			document.addEventListener('paste', listener);
		};
		ParticleEditor.prototype.removeEventListeners = function () {
			if (this._keydownListener) {
				document.removeEventListener('keydown', this._keydownListener);
				this._keydownListener = null;
			}
			if (this._keyupListener) {
				document.removeEventListener('keyup', this._keyupListener);
				this._keyupListener = null;
			}
			if (this._copyListener) {
				document.removeEventListener('copy', this._copyListener);
				this._copyListener = null;
			}
			if (this._pasteListener) {
				document.removeEventListener('paste', this._pasteListener);
				this._pasteListener = null;
			}
		};

		ParticleEditor.prototype._onKeyDown = function (event) {
			if ((event.ctrlKey || event.metaKey) && event.keyCode === KEY_CODE.g) {
				this.processHide();
				return;
			}
			if (this._activePicker) {
				this._activePicker.onKeyDown(event.keyCode, event);
				return;
			}

			if (event.ctrlKey || event.metaKey) {
				this._onControlKeyDown(event);
			} else if (!event.ctrlKey && !event.altKey) {
				this._keyCode = event.keyCode;
				this._key = event.key;
			}
		};

		ParticleEditor.prototype._onControlKeyDown = function (event) {
			if (event.keyCode === KEY_CODE.s) {
				//save
				this.processSave();
			} else if (event.keyCode === KEY_CODE.i) {
				if (parameters.imageNames && parameters.imageNames.length > 0) {
					this.processPickImage();
				}
			} else if (event.keyCode === KEY_CODE.p) {
				this.processPickPreset();
			} else if (event.keyCode === KEY_CODE.a) {
				if (parameters.animationNames && parameters.animationNames.length > 0) {
					this.processPickAnimation();
				}
			} else if (event.keyCode === KEY_CODE.w) {
				this.processQuit();
			} else if (event.keyCode === KEY_CODE.e) {
				this.processComplete();
			} else if (event.keyCode === KEY_CODE.t) {
				this.processPickTile();
			} else if (event.keyCode === KEY_CODE.l) {
				this.processPickLoad();
			}
		}

		ParticleEditor.prototype._onKeyUp = function (event) {
			// this._keyCode = 0;
		};




		/* word inputting
		===================================*/
		ParticleEditor.prototype.resetInputingWords = function () {
			if (this._inputtingWords === '') return;

			this._inputtingWords = '';
			this.prepareInputtingCandidates();
		};
		ParticleEditor.prototype.prepareInputtingCandidates = function () {
			this._inputtingCandidates = this._commands.concat();
			this._inputtingCandidates.push('SCREEN');
		};
		ParticleEditor.prototype.pushInputtingCharacter = function (chara) {
			this._inputtingWords += chara;
			var words = this._inputtingWords;
			var candidates = this._inputtingCandidates;
			var length = candidates.length;
			var firstHit = null;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var word = candidates[i];
				if (word.indexOf(words) !== 0) {
					candidates.splice(i, 1);
					i -= 1;
					length -= 1;
				} else {
					firstHit = firstHit || word;
				}
			}

			if (!firstHit) {
				this.prepareInputtingCandidates();
				candidates = this._inputtingCandidates
				var length = candidates.length;
				while (words.length > 0 && !firstHit) {
					for (var i = 0; i < length; i = (i + 1) | 0) {
						if (candidates[i].indexOf(words) !== 0) continue;
						firstHit = candidates[i];
						break;
					}
					if (!firstHit) {
						words = words.substr(1);
					}
				}
				if (firstHit) {
					for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
						if (candidates[i].indexOf(words) !== 0) continue;
						candidates.splice(i, 1);
					}
				}
				this._inputtingWords = words;
			}

			if (firstHit) {
				this.tryInputtingFirstHit(firstHit)
			}
		};
		ParticleEditor.prototype.tryInputtingFirstHit = function (firstHit) {
			var perfectHit = this._inputtingWords === firstHit;
			if (firstHit === 'SCREEN') {
				if (perfectHit) {
					var index = this._commands.indexOf('RECT');
					this.targetData().params.rect = [-Graphics.width / 2, -Graphics.height / 2, Graphics.width, Graphics.height];
					this._parts[index].refreshParts();
					this.startEditing(index);
				}
			} else {
				var index = this._commands.indexOf(firstHit);
				this.startEditing(index);
			}
		};


		/* update
		===================================*/
		ParticleEditor.prototype.update = function () {
			if (this._terminated) return;

			if (this.updateParticleCount) {
				this.updateParticleCount();
			}

			if (this._activePicker) {
				this._activePicker.update();
				this._keyCode = 0;
				this._key = '';
				return;
			}

			var children = this.children;
			var length = children.length;
			var i = length - 1;
			for (; i >= 0; i -= 1) {
				var child = children[i];
				if (child && child.update) {
					child.update();
				}
			}

			/* input & return
			===================================*/
			if (TouchInput.isTriggered() || TouchInput.isPressed()) {
				this.processTouch();
			} else if (Input._latestButton || this._keyCode) {
				this.processInput();
			}
			this._keyCode = 0;
			this._key = '';
		};


		ParticleEditor.prototype.processTouch = function () {
			var allParts = this._parts;
			var length = allParts.length;
			var x = TouchInput.x;
			var y = TouchInput.y;

			var margin = ParticleEditor.SELECTOR_MARGIN;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var parts = allParts[i];
				if (parts.processTouch(x, y, margin)) {
					TouchInput.clear();
					this.startEditing(i);
					return;
				} else if (this._editingIndex === i) {
					if (parts.hasSaveData()) {
						this.saveEditingParams();
					}
				}
			}

			//menu
			var sprites = this._menuSprites;
			var length = sprites.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var sprite = sprites[i];
				if (!sprite.visible) continue;
				if (sprite.x <= x && x <= sprite.x + sprite.width &&
					sprite.y <= y && y <= sprite.y + sprite.height) {
					this.processMenuCommand(i);
					TouchInput.clear();
					return;
				}
			}
		};

		ParticleEditor.prototype.processInput = function () {
			if (Input.isRepeated('down') && this._keyCode !== 98) {
				var index = this._editingIndex;
				do {
					index = (index + 1) % this._parts.length;
				} while (this._parts[index].isSpawnParam());

				this.startEditing(index);
				this.resetInputingWords();
			} else if (Input.isRepeated('up') && this._keyCode !== 104) {
				var index = this._editingIndex;
				do {
					index -= 1;
					if (index < 0) index = this._parts.length - 1;
				} while (this._parts[index].isSpawnParam());
				this.startEditing(index);
				this.resetInputingWords();
			} else if (this._keyCode >= KEY_CODE.alphabet && this._keyCode <= KEY_CODE.alphabetEnd) {
				this.pushInputtingCharacter(String.fromCharCode(this._keyCode));
			} else {
				var editing = this._editingIndex >= 0 ? this.editingParts() : null;
				if (editing) {
					if (!editing.processInput(this._keyCode, this._key)) {
						this.endEditing();
					} else {
						this.selectParts(this._editingIndex);
						if (editing.hasSaveData()) {
							this.saveEditingParams();
						}
					}
				} else if (Input.isTriggered('cancel') && this._keyCode !== 96) {
					if (this._saveButton.opacity < 255) {
						this.processQuit();
					} else {
						SoundManager.playBuzzer();
					}
				}
				if (this._keyCode !== 0) {
					this.resetInputingWords();
				}
			}
		};

		ParticleEditor.prototype.saveEditingParams = function () {
			var editing = this.editingParts();
			if (!editing) return;

			this.supplyEditingParams(editing);

			var saveData = editing.handOverSaveData();
			if (!saveData) return;
			this.saveEditingData(saveData);

			editing.didSaveParams();
		};
		ParticleEditor.prototype.supplyEditingParams = function (editing) { };
		ParticleEditor.prototype.saveEditingData = function (saveData) {
			var editing = this.editingParts();
			if (!editing) return;
			this._saveEditingData(editing._title, saveData);
		};
		ParticleEditor.prototype._saveEditingData = function (title, saveData) {
			saveData.unshift(title);
			saveData.unshift(this._id);

			this._applySaveData(saveData);
			this._saveButton.opacity = 255;
		};
		ParticleEditor.prototype._applySaveData = function (saveData) {
			if (this._subData) {
				var id = saveData.shift();
				var key = saveData.shift();
				var data = this._subData;
				this._particle.tryUpdateSpawnType(key, data);
				data.params[key] = saveData;
				data.pChanged = true;
			} else {
				this._particle.particleUpdate(saveData);
			}
		};

		var _ParticleEmitter__updateParam = ParticleEmitter.prototype._updateParam;
		ParticleEmitter.prototype._updateParam = function (key, args, rate, emitter = this._emitter) {
			if (key === 'sub') {
				emitter.timing = Number(args[0]) || 0;
				emitter.endTiming = supplementDefNum(-1, args[1]);
				emitter.speedRate = Number(args[2]) || 0;
				emitter.inheritAngle = Number(args[3]) || 0;
				emitter.inheritScale = Number(args[4]) || 0;
				if (Game_Particle.GROUP_EDITOR) {
					Game_Particle.GROUP_EDITOR.changeSubEmitterConfig(emitter.timing, emitter.endTiming, emitter.speedRate, emitter.inheritAngle, emitter.inheritScale);
				}
			} else {
				_ParticleEmitter__updateParam.apply(this, arguments);
			}
		};

		ParticleEditor.prototype.startEditing = function (index) {
			if (index < 0) return;

			if (this._editingIndex === index) return;


			SoundManager.playCursor();

			var target = this._parts[index];
			if (this._editingIndex >= 0) {
				this._endEditing();
				index = this._parts.indexOf(target);
				if (index < 0) {
					this._editingIndex = -1;
					this.deselectParts();
					return;
				}
			}

			if (!target) {
				this.refreshPartsHidden();
				return;
			}

			this._editingIndex = index;

			target.startEditing();

			var title = target.title();
			this.showGuideWithTitle(title);
			if (target.type() === 'color') {
				target.setPicker(this._colorPicker);
			}

			if (target.isSpawnParam()) {
				var saveData = target.paramSaveData();
				this.saveEditingData(saveData);
			}

			this.refreshPartsHidden();
			this.selectParts(index);
		};

		ParticleEditor.prototype.spawnType = function () {
			var spawnType = this._config.spawnType;

			var params = this.targetData().params;
			if (params.rect) spawnType = 'rect';
			else if (params.circle) spawnType = 'circle';
			else if (params.ring) spawnType = 'ring';
			else if (params.burst) spawnType = 'burst';
			else if (params.pos || params.point || params.spawnPos) spawnType = 'point';

			if (spawnType === 'position' || spawnType === 'pos') spawnType = 'point';

			return spawnType;
		};


		ParticleEditor.prototype.refreshPartsHidden = function () {
			var spawnType = this.spawnType();

			var allParts = this._parts;
			var length = allParts.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var parts = allParts[i];
				if (parts.isSpawnParam() && parts._title !== spawnType) {
					parts.hide();
				} else {
					parts.show();
				}
			}
		};

		ParticleEditor.prototype.endEditing = function () {
			SoundManager.playCancel();

			this._lastEditingIndex = this._editingIndex;
			this._endEditing();

			this._editingIndex = -1;
			this.deselectParts();
		};
		ParticleEditor.prototype._endEditing = function () {
			var editing = this.editingParts();
			if (editing) {
				editing.endEditing();

				if (editing.hasSaveData()) {
					this.saveEditingParams();
				}
			}
		}
		ParticleEditor.prototype.editingParts = function () {
			return this._parts[this._editingIndex];
		};

		/* selector
		===================================*/
		ParticleEditor.prototype.createSelectorSprite = function () {
			var size = ParticleParam.LINE_HEIGHT;
			var bitmap = new Bitmap(size, size);
			bitmap.fillAll('rgb(255,255,255)');

			var sprite = new Sprite(bitmap);
			sprite.opacity = 150;
			this._selectorSprite = sprite;
			this.addChild(sprite);
			sprite.visible = false;
		};
		ParticleEditor.SELECTOR_MARGIN = 20;
		ParticleEditor.prototype.selectParts = function (index) {
			var parts = this._parts[index];
			var sprite = this._selectorSprite;

			var size = sprite.bitmap.height;
			sprite.y = parts.y;

			if (parts._align === 'right') {
				sprite.anchor.set(1, 0);
				sprite.x = Graphics.width;
			} else {
				sprite.anchor.set(0, 0);
				sprite.x = 0;
			}
			sprite.scale.x = (parts._width + ParticleEditor.SELECTOR_MARGIN) / size;
			sprite.visible = true;
		};
		ParticleEditor.prototype.deselectParts = function () {
			this._selectorSprite.visible = false;
		};


		/* parts
		===================================*/
		ParticleEditor.prototype.createParts = function (data, config) {
			var title, configNames, headers;
			var y = 5;

			title = 'alpha';
			configNames = ['alpha'];
			y += this.addNodeParts(y, data, config, configNames, title);

			title = 'scale';
			configNames = ['scale'];
			y += this.addNodeParts(y, data, config, configNames, title);
			title = 'minimumScaleMultiplier';
			configNames = ['scale.minimumScaleMultiplier'];
			headers = null;
			y += this.addValueParts(y, data, config, configNames, title, headers);


			title = 'speed';
			configNames = ['speed'];
			y += this.addNodeParts(y, data, config, configNames, title);

			title = 'minimumSpeedMultiplier';
			configNames = ['speed.minimumSpeedMultiplier'];
			headers = null;
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'color';
			configNames = ['color'];
			y += this.addColorNodeParts(y, data, config, configNames, title);

			title = 'colorMode';
			configNames = ['colorMode'];
			headers = null;
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'acceleration';
			configNames = ['acceleration.x', 'acceleration.y'];
			headers = ['x', 'y'];
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'startRotation';
			configNames = ['startRotation.min', 'startRotation.max'];
			headers = ['min', 'max'];
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'rotationSpeed';
			configNames = ['rotationSpeed.min', 'rotationSpeed.max'];
			headers = ['min', 'max'];
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'imageOption';
			configNames = ['angle', 'mirrorType'];
			headers = ['angle', 'mirror'];
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'lifetime';
			configNames = ['lifetime.min', 'lifetime.max'];
			headers = ['min', 'max'];
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'blendMode';
			configNames = ['blendMode'];
			headers = null;
			y += this.addValueParts(y, data, config, configNames, title, headers);


			title = 'frequency';
			configNames = ['frequency'];
			headers = null;
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'spawnChance';
			configNames = ['spawnChance'];
			headers = null;
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'particlesPerWave';
			configNames = ['particlesPerWave'];
			headers = null;
			y += this.addValueParts(y, data, config, configNames, title, headers);


			title = 'emitterLifetime';
			configNames = ['emitterLifetime'];
			headers = null;
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'maxParticles';
			configNames = ['maxParticles'];
			headers = null;
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'fluctuation';
			configNames = ['fluctuation.max', 'fluctuation.sensitivity'];
			headers = ['max', 'sensitivity'];
			y += this.addValueParts(y, data, config, configNames, title, headers);



			y += 10;

			title = 'point';
			configNames = ['pos.x', 'pos.y'];
			headers = ['x', 'y'];
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'rect';
			configNames = ['spawnRect.x', 'spawnRect.y', 'spawnRect.w', 'spawnRect.h'];
			headers = ['x', 'y', 'w', 'h'];
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'circle';
			configNames = ['spawnCircle.x', 'spawnCircle.y', 'spawnCircle.r'];
			headers = ['x', 'y', 'r'];
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'ring';
			configNames = ['spawnCircle.x', 'spawnCircle.y', 'spawnCircle.r', 'spawnCircle.minR'];
			headers = ['x', 'y', 'r', 'minR'];
			y += this.addValueParts(y, data, config, configNames, title, headers);

			title = 'burst';
			configNames = ['particleSpacing', 'angleStart', 'bdt', 'brt', 'br', 'bdr', 'bdx', 'bdy'];
			headers = ['ps', 'as', 'dt', 'rt', 'r', 'dr', 'dx', 'dy'];
			y += this.addValueParts(y, data, config, configNames, title, headers);

			if (this._subData) {
				y += 10;
				title = 'sub';
				configNames = ['timing', 'endTiming', 'speedRate', 'inheritAngle', ''];
				headers = ['st', 'et', 'spd', 'iAngle', 'iScale'];
				y += this.addValueParts(y, data, this._subConfig, configNames, title, headers);
			}
		};

		ParticleEditor.POS_PARAMS = ['point', 'rect', 'circle', 'ring', 'burst'];

		ParticleEditor.prototype.addValueParts = function (y, data, config, configNames, title, headers) {
			var parts = new ParticleParam.ValueParam(data, config, configNames, title, headers);
			return this._addParts(y, parts, title);
		};
		ParticleEditor.prototype.addNodeParts = function (y, data, config, configNames, title) {
			var parts = new ParticleParam.NodeParam(data, config, configNames, title);
			return this._addParts(y, parts, title);
		};
		ParticleEditor.prototype.addColorNodeParts = function (y, data, config, configNames, title) {
			var parts = new ParticleParam.ColorNodeParam(data, config, configNames, title);
			return this._addParts(y, parts, title);
		};

		ParticleEditor.prototype._addParts = function (y, parts, title) {
			parts.refresh();
			this.addChild(parts);
			this._commands.push(title.toUpperCase());
			this._parts.push(parts);
			parts.y = y;
			return parts._height;
		};


		/* picker
		===================================*/
		ParticleEditor.prototype.createColorPicker = function () {
			var size = 144;
			var picker = new ColorPicker(size);
			this._colorPicker = picker;
			this.addChild(picker);
			picker.x = 10;
			picker.y = 30;
			picker.visible = false;
		};

		ParticleEditor.prototype.createMenuButtons = function () {
			var sprite;
			var commands = this._menuCommands;
			var color = 'black';

			var index = 0;
			var xOffset = 0;
			var categoryOffset = 10;

			//complete
			commands.push('processComplete');
			sprite = this.menuButtonSprite(index++, xOffset, color, LC('保存＆終了', 113), '(ctrl+E)');
			//save
			commands.push('processSave');
			sprite = this.menuButtonSprite(index++, xOffset, color, LC('保存', 114), '(ctrl+S)');
			this._saveButton = sprite;

			xOffset += categoryOffset;

			if (this.usePickingMenuButtons()) {
				//change image
				if (parameters.imageNames) {
					commands.push('processPickImage');
					sprite = this.menuButtonSprite(index++, xOffset, color, LC('画像選択', 115), '(ctrl+I)');
				}
				//change tile
				commands.push('processPickTile');
				sprite = this.menuButtonSprite(index++, xOffset, color, LC('タイル選択', 116), '(ctrl+T)');

				//change animation
				if (parameters.animationNames) {
					commands.push('processPickAnimation');
					sprite = this.menuButtonSprite(index++, xOffset, color, LC('アニメーション選択', 117), '(ctrl+A)');
				}
			}


			xOffset += categoryOffset;

			//preset
			commands.push('processPickPreset');
			sprite = this.menuButtonSprite(index++, xOffset, color, LC('プリセット', 118), '(ctrl+P)');

			//load
			commands.push('processPickLoad');
			sprite = this.menuButtonSprite(index++, xOffset, color, LC('読みこみ', 119), '(ctrl+L)');

			xOffset += categoryOffset;

			//quit
			commands.push('processQuit');
			sprite = this.menuButtonSprite(index++, xOffset, 'rgb(100,100,100)', LC('終了', 120), '(ctrl+W)');


			//hidden
			commands.push('processHide');
			sprite = this.hideButtonSprite();
			this._hiddenButton = sprite;
		};

		ParticleEditor.prototype.usePickingMenuButtons = function () {
			return true;
		};


		ParticleEditor.BUTTON_FONT_SIZE = Number(parameters.buttonFontSize || 16);
		ParticleEditor.BUTTON_WIDTH = Number(parameters.buttonWidth || 144)
		ParticleEditor.BUTTON_MIN_HEIGHT = 24;
		ParticleEditor.prototype.menuButtonSprite = function (index, xOffset, color, name, keyInfo) {
			var fontSize = ParticleEditor.BUTTON_FONT_SIZE;
			var keyFontSize = fontSize - 2;
			var marginTB = 2;
			var calcHeight = fontSize + keyFontSize + 2 * marginTB;
			var height = Math.max(ParticleEditor.BUTTON_MIN_HEIGHT, calcHeight);
			var width = ParticleEditor.BUTTON_WIDTH;
			var margin = 4;

			var bitmap = new Bitmap(width, height);
			var sprite = new Sprite(bitmap);
			this._menuSprites.push(sprite);
			this.addChild(sprite);
			bitmap.fillAll('rgba(255,255,255,0.8)');

			var y = marginTB;
			bitmap.fontSize = fontSize;
			bitmap.textColor = color;
			bitmap.outlineWidth = 0;
			bitmap.drawText(name, 0, y, width, fontSize, 'center');

			y += fontSize
			bitmap.fontSize = keyFontSize;
			bitmap.drawText(keyInfo, 0, y, width, keyFontSize, 'center');

			sprite.x = Graphics.width - margin - index * (width + margin) - width - xOffset;
			sprite.y = Graphics.height - margin - height;

			return sprite;
		};

		ParticleEditor.prototype.hideButtonSprite = function () {
			var w = 42;
			var h = 30;
			var bitmap = new Bitmap(w, h);
			var sprite = new Sprite(bitmap);
			this._menuSprites.push(sprite);
			this.addChild(sprite);
			sprite.x = Graphics.width - w - 5;
			var button = this._menuSprites[0];
			sprite.y = button.y - h - 5;


			var ctx = bitmap._context;
			var textH = 12;

			//rounded rect
			var r = 5;
			ctx.save();
			ctx.fillStyle = 'rgba(255,255,255,0.8)';
			ctx.beginPath();
			ctx.moveTo(0 + r, 0);
			ctx.lineTo(w - r, 0);
			ctx.arc(w - r, r, r, -90 * Math.PI / 180, 0, false);
			ctx.lineTo(w, h - r);
			ctx.arc(w - r, h - r, r, 0, 90 * Math.PI / 180, false);
			ctx.lineTo(r, h);
			ctx.arc(r, h - r, r, 90 * Math.PI / 180, 180 * Math.PI / 180, false);
			ctx.lineTo(0, r);
			ctx.arc(r, r, r, 180 * Math.PI / 180, 270 * Math.PI / 180, false);
			ctx.fill();
			ctx.restore();

			//icon
			var cx = w / 2;
			var cy = Math.floor((h - textH) / 2) + 2;
			var ir = ((h - textH) - 10) / 2;
			var irx = 15;
			var ia = 50;
			ctx.save();
			ctx.fillStyle = ctx.strokeStyle = 'rgb(160,160,160)';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(cx, cy, ir, 0, Math.PI * 2, false);
			ctx.fill();

			ctx.beginPath();
			ctx.arc(cx, cy + (irx - ir - 2), irx, (-90 - ia) * Math.PI / 180, (-90 + ia) * Math.PI / 180);
			ctx.arc(cx, cy - (irx - ir - 2), irx, (90 - ia) * Math.PI / 180, (90 + ia) * Math.PI / 180);

			ctx.closePath();
			ctx.stroke();
			ctx.restore();


			//text 
			var y = h - textH;
			bitmap.fontSize = textH - 2;
			bitmap.textColor = 'black';
			bitmap.outlineWidth = 0;
			bitmap.drawText('ctrl+G', 0, y, w, textH, 'center');
		};

		ParticleEditor.prototype.processMenuCommand = function (i) {
			this[this._menuCommands[i]]();
		};

		ParticleEditor.prototype.processSave = function () {
			if (this._saveButton.opacity < 255) return;
			this.executeSave();
			SoundManager.playSave();
			this._saveButton.opacity = 100;
		};
		ParticleEditor.prototype.processQuit = function () {
			this.executeQuit();
		};
		ParticleEditor.prototype.executeQuit = function () {
			this.terminate();
			SoundManager.playCancel();
		};
		ParticleEditor.prototype.processComplete = function () {
			this.processSave();
			this.executeQuit();
		};

		ParticleEditor.prototype.processPickImage = function () {
			if (!this._imagePicker) {
				this.createImagePicker();
				if (!this._imagePicker) return;
			}
			var image = this.targetData().image || this._config.image;
			this._imagePicker.startPicking(this, image);
			this.startPicking(this._imagePicker);
		};
		ParticleEditor.prototype.processPickTile = function () {
			if (!(SceneManager._scene instanceof Scene_Map)) {
				SoundManager.playBuzzer();
				return;
			}
			if (!this._tilePicker) {
				this.createTilePicker();
			}
			var image = this.targetData().image || this._config.image;
			this._tilePicker.startPicking(this, image);
			this.startPicking(this._tilePicker);
		};
		ParticleEditor.prototype.processPickAnimation = function () {
			if (!this._animationPicker) {
				this.createAnimationPicker();
			}
			var image = this.targetData().image || this._config.image;
			this._animationPicker.startPicking(this, image);
			this.startPicking(this._animationPicker);
		};
		ParticleEditor.prototype.processPickPreset = function () {
			if (!this._presetPicker) {
				this.createPresetPicker();
				if (!this._presetPicker) return;
			}

			var targetType = this.targetData().targetType;
			var currentData = this.editingDataObject();
			this._presetPicker.startPicking(this, targetType, currentData);
			this.startPicking(this._presetPicker);
		};
		ParticleEditor.prototype.processPickLoad = function () {
			if (!this._loadPicker) {
				this.createLoadPicker();
				if (!this._loadPicker) return;
			}
			var targetType = this.targetData().targetType;
			var currentData = this.editingDataObject();
			this._loadPicker.startPicking(this, targetType, currentData);
			this.startPicking(this._loadPicker);
		};
		ParticleEditor.prototype.startPicking = function (picker) {
			this.endEditing();

			this._activePicker = picker;
			this.addChild(picker);
			this.hideMenu();
			this.hideParts();

			var dx = picker.x + picker._width;
			this.slideNumSpritesX(dx);

			if (this._guideSprite) {
				this._guideSprite.visible = false;
			}
		};
		ParticleEditor.prototype.didEndPicking = function () {
			var dx = -this._activePicker.x - this._activePicker._width;
			this.slideNumSpritesX(dx);

			this._activePicker.parent.removeChild(this._activePicker);
			this._activePicker = null;

			this.showParts();
			this.showMenu();

			if (this._lastEditingIndex >= 0) {
				this.startEditing(this._lastEditingIndex);
			}

			if (this._guideSprite) {
				this._guideSprite.visible = true;
			}
		};
		ParticleEditor.prototype.slideNumSpritesX = function (dx) {
			var system = SceneManager._scene._particleSystem;
			for (var i = 0; i < 3; i = (i + 1) | 0) {
				var sprite;
				if (i === 0) sprite = this._particleCountSprite;
				else if (i === 1) sprite = system ? system._countSprite : null;
				else sprite = system ? system._limitedSprite : null;

				if (sprite) {
					sprite.x += dx;
				}
			}
		};

		ParticleEditor.prototype.hideParts = function () {
			var parts = this._parts;
			var length = parts.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var sprite = parts[i];
				sprite.alpha = 0.3;
			}
		};
		ParticleEditor.prototype.showParts = function () {
			var parts = this._parts;
			var length = parts.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var sprite = parts[i];
				sprite.alpha = 1;
			}
		};

		ParticleEditor.prototype._addPicker = function (picker) {
			this.addChild(picker);
			picker.x = 10;
			picker.y = 0;
		}
		ParticleEditor.prototype.createImagePicker = function () {
			if (!parameters.imageNames || parameters.imageNames.length === 0) return;

			var picker = new ImagePicker(parameters.imageNames);
			this._imagePicker = picker;
			this._addPicker(picker);
		};
		ParticleEditor.prototype.createTilePicker = function () {
			var picker = new TilePicker();
			this._tilePicker = picker;
			this._addPicker(picker);
		};
		ParticleEditor.prototype.createAnimationPicker = function () {
			var picker = new AnimationPicker(parameters.animationNames);
			this._animationPicker = picker;
			this._addPicker(picker);
		};
		ParticleEditor.prototype.createPresetPicker = function () {
			var picker = new PresetPicker();
			this._presetPicker = picker;
			this._addPicker(picker);
		};
		ParticleEditor.prototype.createLoadPicker = function () {
			var picker = new LoadPicker();
			this._loadPicker = picker;
			this._addPicker(picker);
		};

		ParticleEditor.prototype.didPickImage = function (image) {
			this.forceChangeImage(image);
		};
		ParticleEditor.prototype.changeImage = function (image) {
			this._image = image || this._image;
			this.targetData().image = this._image;

			this.checkImageExists(this.targetData());
		};
		ParticleEditor.prototype.forceChangeImage = function (image) {
			this.changeImage(image);
			this.targetData().forceChangeImage = true;
		};
		ParticleEditor.prototype.checkImageExists = function (data) {
			var images = data.image.split(',');
			var length = images.length;

			var fs = require('fs');
			var path = require('path');
			var base = path.dirname(process.mainModule.filename);
			var dirPath = path.join(base, ParticleEditor.IMAGE_PATH);
			var animPath = path.join(base, ParticleEditor.ANIMATION_PATH);
			var splitAnimImages = PluginManager.parameters(listPluginName).animImages || [];

			var ext = '.png';
			for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
				var image = images[i];
				if (image.indexOf('tile:') === 0) continue

				var filePath;
				if (image.indexOf('ANIM:') === 0) {
					if (splitAnimImages.contains(image)) {
						filePath = path.join(dirPath, '_' + image.replace(/:/gi, '_') + ext);
					} else {
						filePath = path.join(animPath, image.split(':')[1] + ext);
					}
				} else {
					filePath = path.join(dirPath, image + ext)
				}
				if (!fs.existsSync(filePath)) {
					images.splice(i, 1);
				}
			}
			if (length !== images.length) {
				var length = images.length;
				var image = '';
				for (var i = 0; i < length; i = (i + 1) | 0) {
					if (i > 0) {
						image += ',';
					}
					image += images[i];
				}
				if (image.length === 0) {
					image = Game_Particle.defaultImage();
				}
				data.image = image;
			}
		};

		/* applyData
		===================================*/
		ParticleEditor.prototype.applyData = function (applyData, originalName) {
			Game_Particle.migrateConfig(applyData);

			var allParts = this._parts;
			var length = allParts.length;
			if (this._subData) {
				length -= 1;
			}

			var data = this.targetData();
			data.params = {};

			for (var i = 0; i < length; i = (i + 1) | 0) {
				var parts = allParts[i];
				parts.refreshWithConfigData(applyData);
			}

			var spawnType = applyData.spawnType;
			var spawnTitles = [spawnType];
			if (spawnType === 'point') spawnTitles.push('pos');
			if (spawnType === 'pos') spawnTitles.push('point');
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var parts = allParts[i];
				if (parts.isSpawnParam()) {
					if (!spawnTitles.contains(parts._title)) {
						continue;
					}
				}

				parts.applyAll();
				var saveData = parts.handOverSaveData();
				if (saveData) {
					this._saveEditingData(parts._title, saveData);
				}
			}

			if (!applyData.image) {
				applyData.image = Game_Particle.defaultImage();
			}
			// this.changeImage(applyData.image);
			this.forceChangeImage(applyData.image);

			this.refreshPartsHidden();

			this.cleanupCurrentParticles();
		};
		ParticleEditor.prototype.cleanupCurrentParticles = function () {
			var emitter = ParticleEditor.EDITING_EMITTER;
			if (!emitter) return;

			emitter.cleanup();
		};


		/* numInfo
		===================================*/
		ParticleEditor.PARTICLE_NUM_HEADER_WIDTH = 128;
		ParticleEditor.PARTICLE_NUM_HEIGHT = 20;
		ParticleEditor.prototype.createNumInfo = function () {
			var width = 192;
			var height = ParticleEditor.PARTICLE_NUM_HEIGHT;
			var fontSize = 16;
			var margin = 6;

			var bitmap = new Bitmap(width, height);
			// bitmap.fillAll('rgba(0,0,0,0.3)')

			var sprite = new Sprite(bitmap);
			this._particleCountSprite = sprite;
			this.addChild(sprite);
			sprite.x = margin;
			sprite.y = margin;
			if (displayCount) {
				sprite.y += 26;
			}

			bitmap.fontSize = fontSize;
			bitmap.outlineColor = 'black';
			bitmap.outlineWidth = 4;
			bitmap.textColor = 'rgb(255,255,150)';
			var dw = ParticleEditor.PARTICLE_NUM_HEADER_WIDTH;
			bitmap.drawText(LC('パーティクル数:', 121), 0, 0, dw, height);
		};
		ParticleEditor.PARTICLE_COUNT_INTERVAL = 10;
		ParticleEditor.prototype.updateParticleCount = function () {
			var handler = this._countHandler;
			if (!handler) {
				handler = SceneManager._scene.particleCountHandlerWithId(this._mainId, this._subId);
				if (handler) {
					this._countHandler = handler;
				} else {
					return;
				}
			}

			this._particleCountInterval -= 1;
			if (this._particleCountInterval > 0) {
				return;
			}

			this._particleCountInterval = ParticleEditor.PARTICLE_COUNT_INTERVAL;
			var num = handler();
			if (this._particleCount === num) return;
			this._particleCount = num;

			var bitmap = this._particleCountSprite.bitmap;
			var x = ParticleEditor.PARTICLE_NUM_HEADER_WIDTH;
			var width = bitmap.width - x;
			var height = bitmap.height;
			bitmap.clearRect(x - 2, 0, width + 2, height);

			bitmap.drawText(num, x, 0, width, height);
		};

		/* guideSprite
		===================================*/
		ParticleEditor.GUIDE_TEXT_MARGIN = 5;
		ParticleEditor.GUIDE_TEXT_FONT_SIZE = 14;
		ParticleEditor.GUIDE_TEXT_LINE_HEIGHT = 18;
		ParticleEditor.GUIDE_TEXT_MAX_ROW = 12;
		ParticleEditor.prototype.createGuideSprite = function () {
			var maxRow = ParticleEditor.GUIDE_TEXT_MAX_ROW;
			var fontSize = ParticleEditor.GUIDE_TEXT_FONT_SIZE;
			var lineHeight = ParticleEditor.GUIDE_TEXT_LINE_HEIGHT;

			var width = $gameSystem.isJapanese() ? 300 : 500;
			var height = lineHeight * maxRow + 2 * ParticleEditor.GUIDE_TEXT_MARGIN;

			var bitmap = new Bitmap(width, height)
			var sprite = new Sprite(bitmap);
			this.addChild(sprite);
			this._guideSprite = sprite;
			sprite.anchor.set(0, 1);
			sprite.visible = false;
			sprite.x = 5;
			sprite.y = Graphics.height - ParticleEditor.GUIDE_TEXT_LINE_HEIGHT - 20;

			bitmap.fontSize = fontSize;
			bitmap.outlineColor = 'black';
			bitmap.outlineWidth = 4;
		};

		ParticleEditor.prototype.guideTexts = function (title) {
			return ParticleEditor.GUIDE_TEXTS[title];
		};
		ParticleEditor.prototype.showGuideWithTitle = function (title) {
			if (!showGuide) return;

			var sprite = this._guideSprite;
			var texts = this.guideTexts(title);
			if (!texts || texts.length === 0) {
				sprite.visible = false;
				return;
			}

			sprite.visible = true;

			if (this._guideCache === title) return;
			this._guideCache = title;

			var bitmap = sprite.bitmap;
			bitmap.clear();
			bitmap.fillAll('rgba(0,0,0,0.3)')

			var margin = ParticleEditor.GUIDE_TEXT_MARGIN;

			var width = bitmap.width;
			var height = ParticleEditor.GUIDE_TEXT_LINE_HEIGHT;
			var length = Math.min(ParticleEditor.GUIDE_TEXT_MAX_ROW, texts.length);
			var y = ParticleEditor.GUIDE_TEXT_MARGIN;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var text = texts[i];
				if (text) {
					if (i === 0) {
						bitmap.textColor = 'rgb(255,200,150)';
					} else if (i === 1) {
						bitmap.textColor = 'white';
					}
					bitmap.drawText(text, margin, y, width - 2 * margin, height)
				} else {
					bitmap.textColor = 'rgb(220,220,255)';
				}
				y += height;
			}
			y += margin;
			sprite.setFrame(0, 0, width, y);
		};



		/* save
		===================================*/
		ParticleEditor.prototype.executeSave = function () {
			var data = this.editingDataObject();
			if (saveAsArray) {
				data = Game_Particle.compressConfigDataToArray(data);
			}

			var date = new Date();
			var year = (date.getFullYear() % 100).padZero(2);
			var month = (date.getMonth() + 1).padZero(2);
			var day = date.getDate().padZero(2);
			data.comment = year + month + day;

			//register to config
			var name = this.targetData().name;
			$dataTrpParticles[name] = data;

			var file;
			if (noLineBreaks) {
				file = JSON.stringify($dataTrpParticles);
			} else {
				file = JSON.stringify($dataTrpParticles, null, 4);
			}
			this.writeSaveData(file);

			//save help
			this.writeHelpFile();
		};

		ParticleEditor.prototype.editingDataObject = function () {
			var allParts = this._parts;
			var length = allParts.length;

			var data = JsonEx.makeDeepCopy(ParticleEditor.DEFAULT_DATA);
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var parts = allParts[i];
				if (parts._title === 'point' || !parts._hidden) {
					parts.pushSaveDataParams(data);
				}
			}

			if (!isNaN(data.blendMode)) {
				data.blendMode = ParticleEditor.BLEND_MODE_NAMES[data.blendMode];
				if (data.blendMode === undefined) {
					data.blendMode = 0;
				}
			}

			this.adjustSpawnParamData(data, this.spawnType());

			var spawnParams = ParticleEditor.POS_PARAMS;
			var length = spawnParams.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var spawnParam = spawnParams[i];
				if (spawnParam === 'point') {
					continue;
				}
				if (data.spawnType !== spawnParam) {
					delete data[spawnParam];
				}
			}

			data.noRotation = false;
			data.addAtBack = false;
			data.image = this._image;

			//add meta data
			data.targetType = this.targetData().targetType;

			return data;
		};


		ParticleEditor.prototype.writeSaveData = function (file, filePath = this.saveFilePath()) {
			var fs = require('fs');
			var path = require('path');
			var base = path.dirname(process.mainModule.filename);
			filePath = path.join(base, filePath);
			fs.writeFileSync(filePath, file);
		};
		ParticleEditor.prototype.saveFilePath = function () {
			return ParticleEditor.FILE_PATH
		};

		ParticleEditor.prototype.adjustSpawnParamData = function (data, spawnType) {
			data.spawnType = spawnType;
			if (!data.pos) {
				data.pos = { x: 0, y: 0 };
			}
			var spawnParams = ParticleEditor.POS_PARAMS;
			var length = spawnParams.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var spawnParam = spawnParams[i];
				if (spawnParam === 'point') continue;
				if (spawnType !== spawnParam) {
					delete data[spawnParam];
				}
			}
		};

		/* save help plugin
		===================================*/
		Game_Particle.isIdHidden = function (id) {
			return /\/(?:h|H)(?:$|\/)/.test(id);
		};
		ParticleEditor.prototype.writeHelpFile = function () {
			var database = $dataTrpParticles;
			var keys = Object.keys(database);
			keys.sort();
			var length = keys.length;

			var file = '/*' + ': @target MZ\n';
			file += ' * @' + 'base TRP_ParticleMZ\n';
			file += ' * @' + 'plugindesc ' + LC('自作パーティクル設定の一覧', 122) + '\n';
			file += ' * @' + 'help\n';


			var images = [];

			var idx = 0;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = keys[i];
				var data = database[key];

				var isHidden = Game_Particle.isIdHidden(key)

				if (Array.isArray(data)) {
					data = Game_Particle.decompressConfigDataFromArray(data.concat());
				}
				var imageStr = data.image;
				var targetType = data.targetType;
				var comment = data.comment;

				if (!isHidden) {
					if (idx++ > 0) {
						file += '\n';
					}
					file += ' * ' + ParticleEditor.helpFileListText(key, targetType, comment);
				}

				if (imageStr) {
					imageStr.split(',').forEach(function (image) {
						if (image.indexOf('tile:') === 0) return;
						if (image.indexOf('ANIM:') === 0) {

						} else if (!images.contains(image)) {
							images.push(image);
						}
					});
				}
			}

			file += this.helpPluginExtraHelpTexts();
			file += '\n *';

			if (parameters.skipListCommand !== 'true') {
				file += this.helpPluginCommandTexts();
				file += '\n *';
			}

			var length = images.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				file += '\n * @requiredAssets img/particles/' + images[i];
			}

			var animImages = PluginManager.parameters(listPluginName).animImages || null;
			var length = animImages ? animImages.length : 0;
			var animImageArrStr = '';
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var image = '_' + animImages[i].replace(/:/gi, '_');
				file += '\n * @requiredAssets img/particles/' + image;
				if (i > 0) {
					animImageArrStr += ',';
				}
				animImageArrStr += '"' + animImages[i] + '"';
			}
			file += '\n *' + '/';

			if (animImageArrStr.length > 0) {
				//PRAGMA: saveListData
				file += '\nPluginManager._parameters.trp_particle_list = {';
				file += '\n\tanimImages:[' + animImageArrStr + ']';
				file += '\n};';
				//PRAGMA_END: saveListData
			}


			var fs = require('fs');
			var path = require('path');
			var base = path.dirname(process.mainModule.filename);
			var filePath = path.join(base, ParticleEditor.HELP_PATH);
			fs.writeFileSync(filePath, file);
		};
		ParticleEditor.helpFileListText = function (key, targetType, comment) {
			var text = key + ' <';
			text += PresetPicker.TARGET_NAMES[targetType] || '---';
			text += '> ＠';
			var date = comment;
			if (!date) {
				text += '---';
			} else if (isNaN(date)) {
				text += comment;
			} else {
				var day = date % 100;
				var month = Math.floor(date / 100) % 100;
				var year = Math.floor(date / 10000) % 100;
				text += '20' + year + '/' + month + '/' + day;
			}
			return text;
		}
		ParticleEditor.prototype.helpPluginExtraHelpTexts = function () {
			return '';
		};
		ParticleEditor.prototype.helpPluginCommandTexts = function (database = $dataTrpParticles) {
			var texts = '';

			var allKeys = Object.keys(database);
			allKeys.sort();
			var length = allKeys.length;

			var setDatabase = {};
			var playDatabase = {};

			var INDEXES = Game_Particle.CONFIG_PARAM_INDEXES.all;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = allKeys[i];
				var data = database[key];

				if (Game_Particle.isIdHidden(key)) {
					continue;
				}

				if (Array.isArray(data)) {
					data = Game_Particle.decompressConfigDataFromArray(data.concat());
				}
				var emitterLifetime = data.emitterLifetime;
				if (emitterLifetime > 0) {
					playDatabase[key] = data;
				} else {
					setDatabase[key] = data;
				}
			}

			var setData = [];
			var setNames = [];
			PresetPicker.setCategoriedList(setDatabase, setData, setNames);
			var playData = [];
			var playNames = [];
			PresetPicker.setCategoriedList(playDatabase, playData, playNames);

			var dataArr, keysArr, command;
			for (var i = 0; i < 2; i = (i + 1) | 0) {
				var isSetCommand = i === 0;
				if (isSetCommand) {
					dataArr = setData;
					keysArr = setNames;
				} else {
					dataArr = playData;
					keysArr = playNames;
				}

				var categoryLen = keysArr.length;
				for (var j = 0; j < categoryLen; j = (j + 1) | 0) {
					var dataList = dataArr[j];
					var keys = keysArr[j];
					var category = PresetPicker.CATEGORY_NAMES_EN[j];
					var categoryText = PresetPicker.CATEGORY_NAMES[j];
					var keysLen = keys.length;
					if (keysLen === 0) continue;

					if (isSetCommand) {
						texts += '\n * @command set_' + category;
						texts += NLC('\n * @text set/表示 > ', 123) + categoryText + '(' + keysLen + ')';
						texts += NLC('\n * @desc パーティクル表示', 124);
					} else {
						texts += '\n * @command play_' + category;
						texts += NLC('\n * @text play/１回再生 > ', 125) + categoryText + '(' + keysLen + ')';
						texts += NLC('\n * @desc パーティクルを１回だけ再生', 126);
					}
					texts += '\n *';
					texts += '\n * @arg id';
					texts += NLC('\n * @text 管理ID', 127);
					texts += NLC('\n * @desc 他と被らない管理ID。「def」で設定名,「-EID」で設定名-EID', 128);
					texts += '\n * @default def';
					texts += '\n *';
					texts += '\n * @arg target';
					texts += NLC('\n * @text ターゲット', 129);
					texts += NLC('\n * @desc thisでこのイベント。「event:イベントID」「player」「weather」など', 130);
					if (category === 'screen') {
						texts += '\n * @default this';
					} else {
						texts += '\n * @default weather';
					}

					texts += '\n *';
					texts += '\n * @arg name';
					texts += NLC('\n * @text 《データ名》', 131);
					texts += NLC('\n * @desc データ名。defとすると管理IDをデータ名として使用。（重み同じデータ名を複数表示するときは管理IDを分ける）', 132);
					texts += NLC('\n * @default 《呼び出す設定を選択》', 133);
					texts += '\n * @type select';
					for (var k = 0; k < keysLen; k = (k + 1) | 0) {
						var key = keys[k];
						var data = dataList[k];
						var targetType = data.targetType;
						var comment = data.comment;
						texts += '\n * @option ' + ParticleEditor.helpFileListText(key, targetType, comment);
						texts += '\n * @value ' + key;
					}
					texts += '\n *';
					texts += '\n * @arg z';
					texts += NLC('\n * @text Z値', 134);
					texts += NLC('\n * @desc 重なり順。above:上、below:後ろ、screen、spritesetなど。数値指定も可', 135);
					texts += '\n * @default def';
					texts += '\n *';
					texts += '\n * @arg tag';
					texts += NLC('\n * @text 管理タグ', 136);
					texts += NLC('\n * @desc 管理用のタグ名', 137);
					texts += '\n *';
					texts += '\n * @arg edit';
					texts += NLC('\n * @text Editモード', 138);
					texts += NLC('\n * @desc ONにするとエディタを呼び出し(テストプレイ時のみ有効)', 139);
					texts += '\n * @default false';
					texts += '\n * @type boolean';
					texts += '\n *';
					texts += '\n * @arg delay';
					texts += NLC('\n * @text _ディレイ', 140);
					texts += NLC('\n * @desc 1以上とすると、指定フレーム後にコマンドを実効', 141);
					texts += '\n * @default 0';
					texts += '\n * @type number';
					texts += '\n * @min 0';
					texts += '\n *';
					texts += '\n *';
				}
			}
			return texts;
		};



		/* copy & paste
		===================================*/
		ParticleEditor.prototype.processCopy = function (e) {
			var data = this.editingDataObject();
			delete data.comment;

			var file;
			if (copyAsArray) {
				if (!Array.isArray(data)) {
					data = Game_Particle.compressConfigDataToArray(data);
				}
				file = JSON.stringify(data);
			} else {
				file = JSON.stringify(data, null, 4);
			}

			e.clipboardData.setData("text/plain", file);
			e.preventDefault();

			SoundManager.playSave();
		};

		ParticleEditor.prototype.processPaste = function (e) {
			e.preventDefault();
			var clipboardData = e.clipboardData;
			if (!clipboardData) {
				SoundManager.playBuzzer();
				return;
			}

			var text = clipboardData.getData("text/plain");
			try {
				var data = JSON.parse(text);
				var dataObj = null;
				if (Array.isArray(data)) {
					dataObj = Game_Particle.decompressConfigDataFromArray(data);
				} else {
					dataObj = data;
				}

				this.endEditing();

				this.applyData(dataObj);
				SoundManager.playLoad();
			} catch (e) {
				SoundManager.playBuzzer();
			}
		};



		/* helper
		===================================*/
		ParticleEditor.prototype.hideMenu = function () {
			var menuSprites = this._menuSprites;
			var length = menuSprites.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var sprite = menuSprites[i];
				sprite.opacity = 0.3 * 255;
			}
		};
		ParticleEditor.prototype.showMenu = function () {
			var menuSprites = this._menuSprites;
			var length = menuSprites.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var sprite = menuSprites[i];
				sprite.opacity = 255;
			}
		};

		ParticleEditor.prototype.processHide = function () {
			if (this.alpha === 1) {
				this.alpha = 0.25;
			} else {
				this.alpha = 1;
			}
			SoundManager.playCursor();
		};


		//=============================================================================
		// ParticleParam
		//=============================================================================
		ParticleEditor.ParticleParam = function ParticleParam() {
			this.initialize.apply(this, arguments);
		};
		var ParticleParam = ParticleEditor.ParticleParam;

		ParticleParam.FONT_SIZE = paramFontSize || 18;
		ParticleParam.LINE_HEIGHT = ParticleParam.FONT_SIZE + 4;

		ParticleParam.prototype = Object.create(PIXI.Container.prototype);
		ParticleParam.prototype.constructor = ParticleParam;
		ParticleParam.prototype.initialize = function (data, config, configNames, title) {
			PIXI.Container.call(this);
			this.width = Graphics.width;
			this.height = Graphics.height;

			this._data = data;
			this._config = config;
			this._configNames = configNames;
			this._title = title;
			this._hidden = false;
			this._align = 'right';

			this._isSpawnParam = ParticleEditor.POS_PARAMS.contains(title);

			this._width = 0;
			this._height = ParticleParam.LINE_HEIGHT;

			this._titleWidth = 0;
			this._titleSprite = null;
			this._parts = [];
			this._textsCache = [];

			this._saveData = null;

			this._editingIndex = -1;
			this._inputting = '';
		};

		ParticleParam.prototype.title = function () {
			return this._title;
		};

		ParticleParam.prototype.type = function () {
			return 'value';
		};
		ParticleParam.prototype.isSpawnParam = function () {
			return this._isSpawnParam;
		};

		ParticleParam.prototype.refreshWithConfigData = function (config) {
			this.refresh();
		};

		ParticleParam.prototype.refresh = function () {
			this.refreshParts();
		};

		ParticleParam.prototype.titleColor = function () {
			if (this._isSpawnParam) {
				return 'rgb(255,200,100)';
			} else {
				return 'rgb(100,200,255)';
			}
		};
		ParticleParam.prototype.partsColor = function () {
			if (this._isSpawnParam) {
				return 'rgb(255,255,200)';
			} else {
				return 'rgb(200,255,255)';
			}
		};
		ParticleParam.prototype.titleText = function () {
			return '[' + this._title + ']';
		};
		ParticleParam.prototype.createTitleSprite = function () {
			var sprite = new Sprite();
			this.addChild(sprite);
			this._titleSprite = sprite;

			this.refreshTitleSprite();
		};
		ParticleParam.prototype.refreshTitleSprite = function () {
			var text = this.titleText();

			var sprite = this._titleSprite;
			var bitmap = sprite.bitmap;

			var fontSize = ParticleParam.FONT_SIZE;
			var width = text.length * fontSize + 4;
			var height = fontSize + 4;
			if (bitmap && bitmap.width < width) {
				bitmap.clear();
			} else {
				bitmap = new Bitmap(width, height);
				sprite.bitmap = bitmap;
			}


			sprite.anchor.set(this._align === 'right' ? 1 : 0, 0);

			bitmap.fontSize = fontSize;
			bitmap.outlineColor = 'black';
			bitmap.outlineWidth = 5;
			bitmap.textColor = this.titleColor();
			bitmap.drawText(text, 0, 0, width, height, this._align);

			this._titleWidth = bitmap.measureTextWidth(text);
		};
		ParticleParam.prototype.setAlign = function (align) {
			this._align = align || 'right';
		}

		ParticleParam.prototype.refreshParts = function () {
			var parts = this._parts;
			var length = this.partsNum();

			for (var i = 0; i < length; i = (i + 1) | 0) {
				var text = this.partsText(i);
				var sprite = parts[i];
				if (!sprite) {
					sprite = this.createPartsSprite();
					this.addChild(sprite);
					parts[i] = sprite;
					this._textsCache[i] = null;
				} else {
					sprite.visible = true;
				}
				if (this.checkChangeFromCache(text, i)) {
					this.refreshPartsText(sprite, text, i);
				}
			}

			var partsLen = parts.length;
			for (; i < partsLen; i = (i + 1) | 0) {
				parts[i].parent.removeChild(parts[i]);
			}
			parts.length = length;

			this.layout();
		};

		ParticleParam.prototype.checkChangeFromCache = function (text, i) {
			if (this._textsCache[i] === text) {
				return false;
			}

			this._textsCache[i] = text;
			return true;
		};

		ParticleParam.prototype.partsNum = function () {
			return 1;
		};

		ParticleParam.prototype.partsText = function (index) { };
		ParticleParam.prototype.defaultValue = function () {
			return 0;
		};

		ParticleParam.prototype.pushSaveDataParams = function (data) {
		};


		ParticleParam.prototype.configValue = function (configName, config) {
			var elems = configName.split('.');
			config = config || this._config;
			while (elems.length > 0 && config) {
				var elem = elems.shift();
				config = config[elem];
			}
			return config || this.defaultValue();
		};
		ParticleParam.prototype.defaultValue = function () {
			return 0;
		};


		ParticleParam.MAX_PARTS_WIDTH = 128;
		ParticleParam.prototype.maxPartsWidth = function () {
			return ParticleParam.MAX_PARTS_WIDTH;
		};

		ParticleParam.prototype.createPartsSprite = function () {
			var fontSize = ParticleParam.FONT_SIZE;
			var width = this.maxPartsWidth();
			var height = fontSize + 4;

			var bitmap = new Bitmap(width, height);
			bitmap.fontSize = fontSize;
			bitmap.outlineColor = 'black';
			bitmap.outlineWidth = 5;
			bitmap.textColor = this.partsColor();
			var sprite = new Sprite(bitmap);

			return sprite;
		};

		ParticleParam.prototype.refreshPartsText = function (sprite, text, i) {
			var bitmap = sprite.bitmap;
			bitmap.clear();

			var width = bitmap.width;
			var height = bitmap.height;
			var textWidth = Math.min(width, bitmap.measureTextWidth(text) + 2);
			bitmap.drawText(text, 1, 0, width - 2, height);

			sprite._frame.width = textWidth;
			sprite._refresh();
		};


		ParticleParam.prototype.layout = function () {
			if (!this._titleSprite) {
				this.createTitleSprite();
			}

			var margin = 5;
			var x;
			var rightAlign = this._align === 'right';

			var title = this._titleSprite;
			if (rightAlign) {
				x = Graphics.width - margin;
			} else {
				x = margin;
				title.x = x;
				x += this._titleWidth + margin;
			}


			var allParts = this._parts;
			var length = allParts.length;
			if (rightAlign) {
				for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
					var parts = allParts[i];
					parts.visible = !this._hidden;
					if (!parts.visible) continue;

					x -= parts.width;
					parts.x = x;
					x -= margin;
				}
			} else {
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var parts = allParts[i];
					parts.visible = !this._hidden;
					if (!parts.visible) continue;

					parts.x = x;
					x += parts.width + margin;
				}
			}


			var title = this._titleSprite;
			if (rightAlign) {
				title.x = x;
				this._width = Graphics.width - x + this._titleWidth;
			} else {
				this._width = x - margin;
			}
		};

		ParticleParam.prototype.show = function () {
			if (!this._hidden) return;
			this._hidden = false;
			this.layout();
		};
		ParticleParam.prototype.hide = function () {
			if (this._hidden) return;
			this._hidden = true;
			this.layout();
		};


		/* edit
		===================================*/
		ParticleParam.prototype.processTouch = function (x, y, margin) {
			if (y < this.y) return false;
			if (y > this.y + this._height) return false;

			var rightAlign = this._align === 'right';
			if (rightAlign) {
				if (x < Graphics.width - this._width - margin) return false;
			} else {
				if (this._width + margin < x) return false;
			}

			var allParts = this._parts;
			var length = allParts.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var parts = allParts[i];
				if (parts.x <= x && x <= parts.x + parts.width) {
					this.setEditing(i);
					return true;
				}
			}
			return true;
		};

		ParticleParam.prototype.startEditing = function () {
			this.setEditing(Math.max(0, this._editingIndex));
		};
		ParticleParam.prototype.setEditing = function (index) {
			var parts = this._parts;
			var length = parts.length;
			index = index % length;
			this._editingIndex = index;
			this.clearInputting();

			for (var i = 0; i < length; i = (i + 1) | 0) {
				parts[i].opacity = i === index ? 255 : 150;
			}
			this.refreshParts();
		};
		ParticleParam.prototype.endEditing = function () {
			var needsRefresh = this._editingIndex >= 0;
			this._editingIndex = -1;
			var parts = this._parts;
			var length = parts.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				parts[i].opacity = 255;
			}

			if (needsRefresh) {
				this.refreshParts();
			}
		};

		ParticleParam.KEY_CODE = {
			backSpace: 8,
			tab: 9,
			delete: 46,
			num: 48,
			alphabet: 65,
			a: 65,
			c: 67,
			e: 69,
			f: 70,
			g: 71,
			i: 73,
			l: 76,
			p: 80,
			s: 83,
			t: 84,
			v: 86,
			w: 87,
			alphabetEnd: 90,
			tenkey: 96,
			minus: 189,
			tenkeyMinus: 109,
			dot: 190,
			tenkeyDot: 110,
			at: 192,
			bracket: 219
		};
		var KEY_CODE = ParticleParam.KEY_CODE;

		ParticleParam.prototype.processInput = function (keyCode, key) {
			if (Input.isTriggered('cancel') && keyCode !== 96) {
				return false;
			} else if (Input.isTriggered('ok')) {
				this.clearInputting();
			} else if (keyCode === KEY_CODE.tab || (Input.isTriggered('right') && keyCode !== 102)) {
				var index = this._editingIndex + 1;
				if (index > this._parts.length - 1) index = 0;
				this.setEditing(index);
			} else if (Input.isTriggered('left') && keyCode !== 100) {
				var index = this._editingIndex - 1;
				if (index < 0) index = this._parts.length - 1;
				this.setEditing(index);
			} else if (keyCode === KEY_CODE.backSpace) {
				this.clearInputting(true);
				this.applyEditing();
			} else {
				this._processCharacterInput(keyCode, key);
			}

			return true;
		};
		ParticleParam.prototype._processCharacterInput = function (keyCode) {
			var numKeyCode = KEY_CODE.num;
			var tenKeyCode = KEY_CODE.tenkey;
			var chara = null;

			if (keyCode >= numKeyCode && keyCode < numKeyCode + 10) {
				chara = Number(keyCode - numKeyCode);
			} else if (keyCode >= tenKeyCode && keyCode < tenKeyCode + 10) {
				chara = Number(keyCode - tenKeyCode);
			} else if (keyCode === KEY_CODE.minus || keyCode === KEY_CODE.tenkeyMinus) {
				chara = '-';
				this._inputting = '';
			} else if (keyCode === KEY_CODE.dot || keyCode === KEY_CODE.tenkeyDot) {
				if (!this._inputting.contains('.')) {
					chara = '.';
				}
			}
			if (chara !== null) {
				this._inputting += chara;
				this.applyEditing();
			}
		};

		ParticleParam.prototype.clearInputting = function () {
			this._inputting = '';
		};

		ParticleParam.prototype.applyEditing = function () {
			var index = this._editingIndex;
			if (index < 0) return;

			var value = this.valueWithInputting();
			var data = this.paramSaveData(index, value);

			if (data) {
				this.saveToParam(data);
			}
			this.refreshParts();
		};

		ParticleParam.prototype.valueWithInputting = function () {
			var input = this._inputting;
			var value;
			if (this.type() === 'color') {
				value = this._inputting;
			} else {
				value = Number(this._inputting);
				if (value === NaN) {
					value = this.value(this._editingIndex);
					this._inputting = String(value);
				}
			}
			return value;
		};

		ParticleParam.prototype.value = function (config) { return 0; };

		ParticleParam.prototype.shouldSave = function (data) {
			return true;
		};
		ParticleParam.prototype.isEqualsToLast = function () {

		};
		ParticleParam.prototype.saveToParam = function (data) {
			if (!this.shouldSave(data)) {
				return false;
			}


			data = data || this.paramSaveData();
			if (!data) return;

			this._saveData = data;
		};
		ParticleParam.prototype.hasSaveData = function () {
			return !!this._saveData;
		};
		ParticleParam.prototype.handOverSaveData = function () {
			var data = this._saveData;
			this._saveData = null;
			return data;
		};
		ParticleParam.prototype.didSaveParams = function () { };


		//=============================================================================
		// ParticleParam.ValueParam
		//=============================================================================
		ParticleParam.ValueParam = function () {
			this.initialize.apply(this, arguments);
		};
		var ValueParam = ParticleParam.ValueParam;
		ValueParam.prototype = Object.create(ParticleParam.prototype);
		ValueParam.prototype.constructor = ValueParam;
		ValueParam.prototype.initialize = function (data, config, name, title, headers) {
			ParticleParam.prototype.initialize.call(this, data, config, name, title);
			this._headers = headers;
		};
		ValueParam.prototype.partsHeader = function (index) {
			var headers = this._headers;
			if (!headers || headers.length === 0) return '';
			else if (headers.length === 1) return headers[0];
			else return headers[index];
		};

		ValueParam.prototype.partsNum = function () {
			return this._configNames.length;
		};

		ValueParam.prototype.partsText = function (index) {
			var text = index === this._editingIndex ? this._inputting : String(this.value(index));
			if (text === '') {
				text = String(this.value(index))
			}

			var header = this.partsHeader(index);
			if (header) {
				text = header + ':' + text;
			}
			return text
		};

		ValueParam.prototype.paramSaveData = function (index, value) {
			var values = this.values();

			if (this._configNames[0] === 'frequency' && value === 0) {
				return null;
			}

			if (value !== undefined) {
				if (isNaN(value)) return null;
				values[index] = Number(value);
			}

			return values;
		};

		ValueParam.prototype.values = function () {
			var ret = [];
			var num = this._parts.length;
			for (var i = 0; i < num; i = (i + 1) | 0) {
				var value = this.value(i);
				ret.push(value);
			}
			return ret;
		};

		ValueParam.prototype.value = function (index) {
			var name = this._title;

			var params = this._data.params[name];
			if (params !== undefined) return params[index];

			var config = this.configValue(this._configNames[index]);
			if (config !== undefined) return config;

			return 0;
		};

		ValueParam.prototype.pushSaveDataParams = function (data) {
			var saveData = this.paramSaveData();
			var length = saveData.length;

			for (var i = 0; i < length; i = (i + 1) | 0) {
				var value = saveData[i];

				var configName = this._configNames[i];
				configName = configName.replace('point', 'pos');

				var elems = configName.split('.');
				var targetObj = data;
				while (elems.length > 1) {
					var elem = elems.shift();
					if (!targetObj[elem]) {
						targetObj[elem] = {};
					}
					targetObj = targetObj[elem];
				}
				targetObj[elems[0]] = value;
			}
		};

		ValueParam.prototype.refreshWithConfigData = function (config) {
			var names = this._configNames;
			var length = names.length;

			var data = this._data.params[this._title];
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var name = names[i];
				var value = this.configValue(name, config);
				if (value === undefined || value === null) {
					if (data) {
						delete this._data.params[this._title];
					}
					return;
				}
				if (!data) {
					data = this._data.params[this._title] = [];
				}
				data[i] = value;
			}

			ParticleParam.prototype.refreshWithConfigData.call(this, config);
		};
		ParticleParam.prototype.applyAll = function () {
			var names = this._configNames;
			var length = names.length;

			var data = this.paramSaveData();
			if (data) {
				this.saveToParam(data);
			}
		};




		//=============================================================================
		// ParticleParam.NodeParam
		//=============================================================================
		ParticleParam.NodeParam = function () {
			this.initialize.apply(this, arguments);
		};

		var NodeParam = ParticleParam.NodeParam;
		NodeParam.prototype = Object.create(ParticleParam.prototype);
		NodeParam.prototype.constructor = NodeParam;
		NodeParam.prototype.initialize = function (data, config, name, title) {
			ParticleParam.prototype.initialize.call(this, data, config, name, title);

			this._inputtingTimeSprite = null;
			this._lastInputtingTimeText = null;
			this._inputtingTime = null;
			this._innerData = [];
			this.initInnerData(data, config, title);
		};

		NodeParam.prototype.initInnerData = function (data, config, title) {
			this._innerData.length = 0;

			var params = data.params[title];
			if (params) {
				var length = params.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var elems = params[i].split('@');
					this._innerData.push({
						time: Number(elems[1]),
						value: isNaN(elems[0]) ? elems[0] : Number(elems[0])
					});
				}
			} else if (config[title].list) {
				this._innerData = config[title].list.concat();
			} else {
				this._innerData.push({
					time: 0,
					value: config[title].start
				});
				this._innerData.push({
					time: 1,
					value: config[title].end
				});
			}
			this.sortInnerData();
		};


		NodeParam.prototype.refreshParts = function () {
			this.refreshInputtingSprite();
			ParticleParam.prototype.refreshParts.call(this);
		};

		NodeParam.prototype.refreshInputtingSprite = function () {
			var sprite = this._inputtingTimeSprite;
			if (this._inputtingTime !== null && this._editingIndex < 0) {
				if (!sprite) {
					this._inputtingTimeSprite = sprite = this.createPartsSprite();
					this.addChild(sprite);
					sprite.anchor.set(1, 0);
				}
				sprite.visible = true;
				var text = '@' + this._inputtingTime + '→';
				if (text !== this._lastInputtingTimeText) {
					this._lastInputtingTimeText = text;

					var bitmap = sprite.bitmap;
					bitmap.clear();
					bitmap.fillAll('rgb(150,150,0)');
					bitmap.drawText(text, 0, 0, bitmap.width, bitmap.height, 'right');
				}
			} else {
				if (sprite) {
					sprite.visible = false;
				}
			}
		};
		NodeParam.prototype.layout = function () {
			ParticleParam.prototype.layout.call(this);
			var sprite = this._inputtingTimeSprite;
			if (!sprite || !sprite.visible) return;
			sprite.x = this._titleSprite.x - this._titleWidth - 4;
		};

		NodeParam.prototype.partsText = function (index) {
			var data = this._innerData[index];
			var editing = index === this._editingIndex;
			var text = (editing && this._inputtingTime === null) ? this._inputting : String(data.value);
			if (text === '') text = String(data.value);
			text += this._timeText(index)

			return text;
		};
		NodeParam.prototype._timeText = function (index) {
			var data = this._innerData[index];
			var editing = index === this._editingIndex;
			var text = '';
			if (index > 0 && index < this._innerData.length - 1) {
				text += '@' + data.time;
				if (this._inputtingTime !== null && editing) {
					text += '→' + this._inputtingTime;
				}
			}
			return text;
		};

		NodeParam.prototype.titleColor = function () {
			return 'rgb(200,150,255)';
		};
		// NodeParam.prototype.titleText = function(){
		// 	return '['+this._title+']';
		// };

		NodeParam.prototype.paramSaveData = function (index, value) {
			var data;

			if (value !== undefined) {
				value = isNaN(value) ? value : Number(value)
				var data = this._innerData[index];
				data.value = value;

				this.sortInnerData();

				var lastInputting = this._inputting;
				this.setEditing(this._innerData.indexOf(data));
				this._inputting = lastInputting;
			}


			var saveData = [];
			var innerData = this._innerData;
			var length = innerData.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var data = innerData[i];
				saveData.push(data.value + '@' + data.time);
			};

			return saveData;
		};




		NodeParam.prototype.sortInnerData = function () {
			this._innerData.sort(NodeParam.prototype.compareInnerData.bind(this));
		};

		NodeParam.prototype.compareInnerData = function (a, b) {
			return a.time - b.time;
		};

		NodeParam.prototype.partsNum = function () {
			return this._innerData.length;
		};

		/* input
		===================================*/
		NodeParam.prototype.processInput = function (keyCode, key) {
			if (keyCode === KEY_CODE.delete) {
				if (this._editingIndex !== 0 && this._editingIndex !== this._innerData.length - 1) {
					this._innerData.splice(this._editingIndex, 1);
					this.saveToParam();
					this._inputting = String(this._innerData[this._editingIndex].value);
					this.refreshParts();
				}
			} else if (keyCode === KEY_CODE.at && (isMac || Input.isPressed('shift'))) {
				// mac > at = shift + @
				if (this._editingIndex > 0 && this._editingIndex < this._innerData.length - 1) {
					this._inputtingTime = '';
					this.refreshParts();
				} else {
					SoundManager.playBuzzer();
				}
			} else if (isMac ? keyCode === KEY_CODE.bracket : keyCode === KEY_CODE.at) {//[ > new
				// mac > @ = bracket
				this.setEditing(-1);
				this._inputtingTime = '';
				this.refreshParts();
			} else if (this._inputtingTime !== null) {
				this.processInputForInputtingTime(keyCode, key);
			} else {
				return ParticleParam.prototype.processInput.call(this, keyCode, key);
			}
			return true;
		};
		NodeParam.prototype.processInputForInputtingTime = function (keyCode, key) {
			var numKeyCode = KEY_CODE.num;
			var tenKeyCode = KEY_CODE.tenkey;
			if (Input.isTriggered('ok')) {
				this.startEditingPartsWithTime(Number(this._inputtingTime));
				this._inputtingTime = null;
			} else if (keyCode === KEY_CODE.backSpace) {
				this._inputtingTime = null;
				this.refreshParts();
			} else if (keyCode === KEY_CODE.dot || keyCode === KEY_CODE.tenkeyDot) {
				if (this._inputtingTime.contains('.')) {
					SoundManager.playBuzzer();
				} else {
					this._inputtingTime += '.';
				}
				this.refreshParts();
			} else if ((keyCode >= numKeyCode && keyCode < numKeyCode + 10)
				|| (keyCode >= tenKeyCode && keyCode < tenKeyCode + 10)) {
				var num = (keyCode >= tenKeyCode ? keyCode - tenKeyCode : keyCode - numKeyCode);
				if (this._inputtingTime.contains('.')) {
					this._inputtingTime += num;
				} else {
					this._inputtingTime = num === 0 ? '0' : '1';
				}
				this.refreshParts();
			} else {
				return;
			}
		};


		NodeParam.prototype.setEditing = function (index) {
			this._inputtingTime = null;
			ParticleParam.prototype.setEditing.call(this, index);
		};
		NodeParam.prototype.startEditingPartsWithTime = function (time) {
			var innerData = this._innerData;
			var length = innerData.length;

			var data = this._editingIndex >= 0 ? innerData[this._editingIndex] : null;
			if (data) {
				data.time = time;
				this._inputting = String(data.value);
			}

			for (var i = 0; i < length; i = (i + 1) | 0) {
				if (innerData[i].time === time) {
					if (this._editingIndex >= 0) {
						if (this._editingIndex !== i) {
							innerData.splice(i, 1);
							break;
						}
					} else {
						this.setEditing(i);
						return;
					}
				}
			}


			if (!data) {
				data = {
					time: time,
					value: this.defaultValue()
				};
				this._inputting = data.value;
				innerData.push(data);
			}

			this.sortInnerData();

			var index = innerData.indexOf(data);
			this._editingIndex = index;

			this.setEditing(index);
			this.applyAll();
		};

		NodeParam.prototype.endEditing = function () {
			this._inputtingTime = null;
			ParticleParam.prototype.endEditing.call(this);
			if (this._inputtingTimeSprite) {
				this._inputtingTimeSprite.visible = false;
			}
		};

		NodeParam.prototype.pushSaveDataParams = function (data) {
			var list = this._innerData.concat();
			var configName = this._configNames[0];
			if (!data[configName]) {
				data[configName] = {};
			}
			data[configName].list = list;
		};


		NodeParam.prototype.refreshWithConfigData = function (config) {
			var params = config[this._title];
			if (!params || !params.list) return;

			this._innerData = params.list.concat();
			this.sortInnerData();

			ParticleParam.prototype.refreshWithConfigData.call(this, config);
		};


		//=============================================================================
		// ParticleParam.ColorNodeParam
		//=============================================================================
		ParticleParam.ColorNodeParam = function () {
			this.initialize.apply(this, arguments);
		};

		var ColorNodeParam = ParticleParam.ColorNodeParam;
		ColorNodeParam.prototype = Object.create(NodeParam.prototype);
		ColorNodeParam.prototype.constructor = ColorNodeParam;
		ColorNodeParam.prototype.initialize = function (data, config, name, title) {
			NodeParam.prototype.initialize.call(this, data, config, name, title);

			this._colorPicker = null;
		};
		ColorNodeParam.prototype.type = function () {
			return 'color';
		};
		ColorNodeParam.prototype.defaultValue = function () {
			return this._colorPicker ? this._colorPicker.color() : 'rgb(255,255,255)';
		};

		ColorNodeParam.prototype.setPicker = function (picker) {
			this._colorPicker = picker;
			picker.visible = true;

			this.refreshPickerColor();
		};
		ColorNodeParam.prototype.refreshPickerColor = function () {
			var picker = this._colorPicker;
			if (!picker) return;

			var index = this._editingIndex;
			if (index < 0) return;

			var value = this._innerData[index].value;
			picker.setColor(value);
		};

		ColorNodeParam.prototype.setEditing = function (index) {
			NodeParam.prototype.setEditing.call(this, index);
			this.refreshPickerColor();
		};
		ColorNodeParam.prototype.endEditing = function () {
			NodeParam.prototype.endEditing.call(this);
			this._colorPicker.visible = false;
			this._colorPicker = null;
		};
		ColorNodeParam.prototype.processTouch = function (x, y, margin) {
			var editingData = this._innerData[this._editingIndex];
			if (!!editingData && this._colorPicker) {
				var color = this._colorPicker.color();
				if (color !== editingData.value) {
					this._inputting = color;
					this.applyEditing();
				}
			}

			return NodeParam.prototype.processTouch.call(this, x, y, margin);
		};

		ColorNodeParam.prototype.paramSaveData = function (index, value) {
			//check value is color
			if (value !== undefined) {
				if (value.indexOf('rgb') === 0) {
					if (!value.match(/rgb\(\d+,\d+,\d+\)/)) {
						return null;
					}
				} else {
					var color;
					if (value[0] === '#') {
						color = value.substr(1);
					} else {
						color = value;
						value = '#' + value;
					}

					if (isNaN(color) && color.length !== 6) {
						return null;
					}
				}
			}
			return NodeParam.prototype.paramSaveData.call(this, index, value);
		};

		/* input
		===================================*/
		ColorNodeParam.prototype.processInput = function (keyCode, key) {
			if (keyCode === KEY_CODE.delete) {
				if (this._editingIndex !== 0 && this._editingIndex !== this._innerData.length - 1) {
					var index = this._editingIndex;
					this._innerData.splice(this._editingIndex, 1);
					this._inputting = this._innerData[this._editingIndex].value;
					this.applyEditing();
				}
			} else {
				return NodeParam.prototype.processInput.call(this, keyCode, key);
			}
			return true;
		};

		ColorNodeParam.prototype.clearInputting = function (deleteFlag = false) {
			if (deleteFlag) {
				if (this._editingIndex === 0) {
					this._inputting = '#ffffff';
				} else {
					var previousNode = this._innerData[this._editingIndex - 1];
					this._inputting = this.colorCodeWithValue(previousNode.value);
				}
			} else {
				var innerData = this._innerData[this._editingIndex];
				if (!innerData) {
					innerData = this._innerData[this._editingIndex - 1];
				}
				this._inputting = innerData ? innerData.value : '#ffffff';
			}
		};


		ColorNodeParam.prototype.refreshPartsText = function (sprite, text, i) {
			var bitmap = sprite.bitmap;
			bitmap.clear();

			var width = bitmap.width;
			var height = bitmap.height;

			var data = this._innerData[i];
			var color = data ? data.value : null;
			if (color.indexOf('rgb') === 0) {
				if (!color.match(/rgb\(\d+,\d+,\d+\)/)) {
					color = 'white';
				}
			} else {
				if (color[0] === '#') {
					color = color.substr(1);
				}
				if (!color.match(/[0-9a-f]+/)) {
					color = 'white;'
				} else if (color.length !== 6) {
					color = 'white';
				} else {
					color = '#' + color;
				}
			}
			bitmap.fillRect(0, 1, height - 2, height - 2, 'black');
			bitmap.fillRect(1, 2, height - 4, height - 4, color);

			var textWidth = Math.min(width, height + bitmap.measureTextWidth(text) + 2);
			bitmap.drawText(text, height, 0, width - 2 - height, height);

			sprite._frame.width = textWidth;
			sprite._refresh();
		};

		ColorNodeParam.prototype.partsText = function (index) {
			return this._partsText(index, noColorCode);
		};
		ColorNodeParam.prototype._partsText = function (index, noColorCode) {
			var data = this._innerData[index];
			var text;
			if (noColorCode) {
				text = '';
			} else {
				text = index === this._editingIndex ? this._inputting : String(data.value);
			}
			if (index > 0 && index < this._innerData.length - 1) {
				// text += '@'+data.time;
				text += this._timeText(index);
			}
			return text;
		};

		ColorNodeParam.prototype.checkChangeFromCache = function (text, i) {
			var withColorCode = this._partsText(i, false);
			if (this._textsCache[i] === withColorCode) {
				return false;
			}

			this._textsCache[i] = withColorCode;
			return true;
		};

		ColorNodeParam.prototype.pushSaveDataParams = function (data) {
			var list = this._innerData.concat();
			var configName = this._configNames[0];
			if (!data[configName]) {
				data[configName] = {};
			}

			var length = list.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var node = list[i];
				var value = node.value;
				node.value = this.colorCodeWithValue(value);
			}

			data[configName].list = list;
		};

		ColorNodeParam.prototype.colorCodeWithValue = function (value) {
			if (value.indexOf('rgb') === 0) {
				var values = value.match(/\((\d+),(\d+),(\d+)/);
				return '#' + Number(values[1]).toString(16) + Number(values[2]).toString(16) + Number(values[3].toString(16));
			} else {
				return value
			}
		};


		//=============================================================================
		// ColorPicker
		//=============================================================================
		ParticleEditor.ColorPicker = function ColorPicker() {
			this.initialize.apply(this, arguments);
		};
		var ColorPicker = ParticleEditor.ColorPicker;


		ColorPicker.colorWithHsv = function (h, s, v) {
			var max = v;
			var min = max - ((s / 255) * max);
			var r, g, b;
			if (h <= 60) {
				r = max;
				g = (h / 60) * (max - min) + min;
				b = min;
			} else if (h <= 120) {
				r = ((120 - h) / 60) * (max - min) + min;
				g = max;
				b = min;
			} else if (h <= 180) {
				r = min;
				g = max;
				b = ((h - 120) / 60) * (max - min) + min;
			} else if (h <= 240) {
				r = min;
				g = ((240 - h) / 60) * (max - min) + min;
				b = max;
			} else if (h <= 300) {
				r = ((h - 240) / 60) * (max - min) + min;
				g = min;
				b = max;
			} else {
				r = max;
				g = min;
				b = ((360 - h) / 60) * (max - min) + min;
			}
			r = Math.round(r).toString(16);
			g = Math.round(g).toString(16);
			b = Math.round(b).toString(16);
			if (r.length === 1) r = '0' + r;
			if (g.length === 1) g = '0' + g;
			if (b.length === 1) b = '0' + b;
			var color = '#' + r + g + b;
			return color;
		};

		ColorPicker.HUE_WIDTH = 20;
		ColorPicker.MARGIN = 3;

		ColorPicker.prototype = Object.create(PIXI.Container.prototype);
		ColorPicker.prototype.constructor = ColorPicker;
		ColorPicker.prototype.initialize = function (size) {
			PIXI.Container.call(this);

			this._size = size;

			this._hue = -1;
			this._saturation = -1;
			this._value = -1;
			this._color = null;

			this._touchingHue = false;
			this._touchingSv = false;

			var margin = ColorPicker.MARGIN;
			var hueWidth = ColorPicker.HUE_WIDTH;
			var totalWidth = margin * 3 + size + hueWidth;
			var totalHeight = margin * 2 + size;

			var bitmap, sprite;

			//this > backBitmap
			bitmap = new Bitmap(16, 16);
			bitmap.fillAll('rgba(0,0,0,0.5)');
			sprite = new Sprite(bitmap);
			this.addChild(sprite);
			sprite.scale.set(totalWidth / 16, totalHeight / 16);
			this._backSprite = sprite;


			//pickerSprite
			bitmap = new Bitmap(size, size);
			sprite = new Sprite(bitmap);
			this.addChild(sprite);
			sprite.x = margin;
			sprite.y = margin;
			this._pickerSprite = sprite;
			this.bitmap = bitmap;

			//huePicker
			bitmap = new Bitmap(hueWidth, size);
			sprite = new Sprite(bitmap);
			this.addChild(sprite);
			sprite.x = margin * 2 + size;
			sprite.y = margin;
			this._huePicker = sprite;

			//pointer
			bitmap = new Bitmap(16, 16);
			sprite = new Sprite(bitmap);
			this.addChild(sprite);
			sprite.anchor.set(0.5, 0.5);
			this._pointer = sprite;
			var ctx = bitmap._context;
			ctx.beginPath();
			ctx.arc(8, 8, 6, 0, 360 * Math.PI / 180, false);
			ctx.fillStyle = 'rgb(255,255,255)';
			ctx.fill();
			ctx.beginPath();
			ctx.arc(8, 8, 3, 0, 360 * Math.PI / 180, false);
			ctx.globalCompositeOperation = "destination-out";
			ctx.fill();

			//huePointer
			var lineWidth = 2;
			var spaceHeight = 2;
			bitmap = new Bitmap(hueWidth + lineWidth * 2, spaceHeight + lineWidth * 2);
			sprite = new Sprite(bitmap);
			this.addChild(sprite);
			sprite.anchor.set(0.5, 0.5);
			this._huePointer = sprite;
			bitmap.fillAll('black');
			bitmap.clearRect(lineWidth, lineWidth, bitmap.width - lineWidth * 2, bitmap.height - lineWidth * 2);


			this.setupHuePicker();
			this.setColor('rgb(255,255,255)');
		};

		ColorPicker.prototype.setupHuePicker = function () {
			var bitmap = this._huePicker.bitmap;
			var width = bitmap.width;
			var height = bitmap.height;

			var s = 255;
			var v = 255;
			for (var y = 0; y < height; y = (y + 1) | 0) {
				var h = 360 * (y / height);
				var color = ColorPicker.colorWithHsv(h, s, v);
				bitmap.fillRect(0, y, width, 1, color);
			}
		};

		ColorPicker.prototype.setupPallete = function (h) {
			var bitmap = this._pickerSprite.bitmap;
			bitmap.clear();

			var width = this.width;
			var height = this.height;

			var r, g, b;
			for (var x = 0; x < width; x = (x + 1) | 0) {
				var s = 255 * x / width;
				for (var y = 0; y < height; y = (y + 1) | 0) {
					var v = 255 * y / height;
					var color = ColorPicker.colorWithHsv(h, s, v);
					bitmap.fillRect(x, height - y - 1, 1, 1, color);
				}
			}
		};

		ColorPicker.prototype.setColor = function (color) {
			var r, g, b;
			if (color.indexOf('rgb') !== 0) {
				if (color[0] == "#") {
					color = color.substr(1);
				} else if (color.indexOf("0x") === 0) {
					color = color.substr(2);
				}
				if (color.length == 8) {
					color = color.substr(2);
				}
				r = parseInt(color.substr(0, 2), 16);
				g = parseInt(color.substr(2, 2), 16);
				b = parseInt(color.substr(4, 2), 16);
			} else {
				var args = color.match(/\((.+)\)/)[1].split(',');
				r = Number(args[0]);
				g = Number(args[1]);
				b = Number(args[2]);
			}

			var h, s, v;
			var max = Math.max(r, g, b);
			var min = Math.min(r, g, b);
			if (r === g && g === b) {
				h = Math.max(0, this._hue);
			} else if (r >= g && r >= b) {
				h = 60 * (g - b) / (max - min);
			} else if (g >= r && g >= b) {
				h = 60 * (b - r) / (max - min) + 120;
			} else {
				h = 60 * (r - g) / (max - min) + 240;
			}

			s = (max - min) / max * 255;
			v = max;

			if (h < 0) {
				h += 360;
			} else if (h > 360) {
				h -= 360;
			}

			this.setHue(h);
			this.setSV(s, v);
		};

		ColorPicker.prototype.updateResultColor = function () {
			this._color = ColorPicker.colorWithHsv(this._hue, this._saturation, this._value);
		};

		ColorPicker.prototype.color = function () {
			return this._color;
		};

		ColorPicker.prototype.setHue = function (h) {
			h = h.clamp(0, 360);
			if (this._hue === h) return;

			var dh = h - this._hue;
			this._hue = h;
			this.setupPallete(this._hue);

			var sprite = this._huePicker;
			var pointer = this._huePointer;
			pointer.x = sprite.x + sprite.width / 2;
			pointer.y = sprite.y + sprite.height * h / 360;

			this.updateResultColor();
		};

		ColorPicker.prototype.setSV = function (s, v) {
			if (this._saturation === s && this._value === v) return;

			this._saturation = s;
			this._value = v;

			var margin = ColorPicker.MARGIN
			var size = this._size;

			var pointer = this._pointer;
			pointer.x = margin + Math.round((s / 255) * size);
			pointer.y = margin + Math.round(size - (v / 255) * size - 1);

			this.updateResultColor();
		};

		ColorPicker.prototype.update = function () {
			if (!this.visible) {
				this._touchingHue = false;
				this._touchingSv = false;
				return;
			}
			if (!TouchInput.isTriggered() && !TouchInput.isPressed()) {
				this._touchingHue = false;
				this._touchingSv = false;
				return;
			}

			var x = TouchInput.x - this.x;
			var y = TouchInput.y - this.y;
			var dx, dy, touchInside;

			var hPicker = this._huePicker;
			dx = x - hPicker.x;
			dy = y - hPicker.y;

			touchInside = (dx >= 0 && dx <= hPicker.width && dy >= 0 && dy <= hPicker.height);
			if (this._touchingHue || (!this._touchingSv && touchInside)) {
				dy = dy.clamp(0, hPicker.height - 1);
				var hue = Math.round(dy / (hPicker.height - 1) * 360);
				this.setHue(hue);
				this._touchingHue = true;
				return;
			}

			var svPicker = this._pickerSprite;
			dx = x - svPicker.x;
			dy = y - svPicker.y;
			touchInside = (dx >= 0 && dx <= svPicker.width && dy >= 0 && dy <= svPicker.height);
			if (this._touchingSv || (!this._touchingHue && touchInside)) {
				dx = dx.clamp(0, svPicker.width - 1);
				dy = dy.clamp(0, svPicker.height - 1);
				var s = Math.round(dx / (svPicker.width - 1) * 255);
				var v = Math.round((svPicker.height - 1 - dy) / (svPicker.height - 1) * 255);
				this.setSV(s, v);
				this._touchingSv = true;
				return;
			}
		};



		//=============================================================================
		// PickerBase
		//=============================================================================
		function PickerBase() {
			this.initialize.apply(this, arguments);
		};
		PickerBase.TINT_SEVERAL = 0xaaffff;
		PickerBase.TINT_NORMAL = 0xffffaa;
		PickerBase.TINT_SEARCH = 0xaaffaa;
		PickerBase.LAYOUT = {
			marginTopBottom: 5
		};

		PickerBase.prototype = Object.create(PIXI.Container.prototype);
		PickerBase.prototype.constructor = PickerBase;
		PickerBase.prototype.initialize = function () {
			PIXI.Container.call(this);
			this.initMembers();

			this.createBackSprite();
			this.createHighlightBitmap();
			this.createGuideSprite();
			this.createHeaderSprite();
		};

		PickerBase.prototype.initMembers = function () {
			this._header = '';
			this._headerSprite = null;

			this._topRow = 0;
			this._maxRow = 0;
			this._dispRows = 0;
			this._maxTopRow = 0;

			this._owner = null;
			this._severalMode = false;
			this._severalModeSwitched = false;
			this._selectingIndexes = [];

			this._backSprite = null;
			this._highlightSprites = [];
			this._highlightBitmap = null;
			this._guideSprite = null;
			this._searchSprite = null;

			this._listType = null;

			this._categoryIndex = 0;
		};

		PickerBase.prototype.startPicking = function (owner) {
			this.visible = true;
			this._owner = owner;

			Input.clear();
			TouchInput.clear();
			this.registerWheelListener();

			this.refresh();
			this._headerSprite.opacity = 255;
			this._headerSprite.visible = true;

			if (this._guideSprite) {
				var sprite = this._guideSprite;
				sprite.x = this._width + 10;
				sprite.y = Graphics.height - 50 + (this._topRow * this.itemHeight());
			}
		};

		PickerBase.prototype.end = function () {
			if (this._owner) {
				this._owner.didEndPicking();
			}
			this._owner = null;

			this.resignWheelListener();
			this.visible = false;


			SoundManager.playCancel();
			Input.clear();
			TouchInput.clear();
		};

		PickerBase.prototype.refresh = function () {
			var type = this.categoryType();
			if (this._listType === type) return;
			this.setListType(type);

			if (this.isReady()) {
				this._refresh();
			}
		};

		PickerBase.prototype.isReady = function () {
			return true;
		};

		PickerBase.prototype._refresh = function () {
			var col = this.maxColumns();

			var itemWidth = this.itemWidth();
			var itemHeight = this.itemHeight();

			var margin = PickerBase.LAYOUT.marginTopBottom;
			var itemNum = this.maxItems();

			var mx = this.itemMarginX();
			var my = this.itemMarginY();

			this._maxRow = Math.ceil(itemNum / col);
			this._dispRows = Math.floor((Graphics.height - 2 * margin) / (itemHeight + my));
			this._maxTopRow = Math.max(0, this._maxRow - this._dispRows - 1);

			var row = this._maxRow;
			var width = itemWidth * col + mx * (col - 1) + margin * 2;
			this._width = width;
			this._height = Graphics.height;

			this.refreshBackSprite();
			this.refreshItems();
		};
		PickerBase.prototype.setListType = function (type) {
			this._listType = type;
			this.refreshHeaderSprite();
		};

		PickerBase.prototype.refreshItems = function () { };


		/* needs overwrite
		===================================*/
		PickerBase.prototype.maxColumns = function () { return 4; };
		PickerBase.prototype.itemHeight = function () { return 48; };
		PickerBase.prototype.itemWidth = function () { return 48; };
		PickerBase.prototype.maxItems = function () { return 0; };
		PickerBase.prototype.guideTexts = function () { return null; };
		PickerBase.prototype.itemMarginX = function () { return 0; };
		PickerBase.prototype.itemMarginY = function () { return 0; };
		PickerBase.prototype.categoryType = function () {
			return 1;
		};
		PickerBase.prototype.headerText = function () { return ''; }

		//category
		PickerBase.prototype.maxCategories = function () { return 1 };
		PickerBase.prototype.isCategoryValid = function (index) { return true };
		PickerBase.prototype.isSeveralModeValid = function () { return true };
		PickerBase.prototype.applyData = function () { };


		/* select
		===================================*/
		PickerBase.prototype.deselectIndex = function (index) {
			if (index < 0) return;
			var arrayIdx = this._selectingIndexes.indexOf(index);
			if (arrayIdx < 0) return;

			this._selectingIndexes.splice(arrayIdx, 1);
			var sprite = this._highlightSprites[arrayIdx];
			if (sprite) {
				this._highlightSprites.splice(arrayIdx, 1);
				sprite.parent.removeChild(sprite);
			}
		};

		PickerBase.prototype.didPickData = function (index) {
			if (this._selectingIndexes.contains(index)) {
				this.deselectIndex(index);
			} else {
				this.setSelectingIndex(index);
			}
			this.applyData();
		};




		/* update
		===================================*/
		PickerBase.prototype.update = function () {
			if (this._headerSprite.visible) {
				this.updateHeaderSprite();
			}
			if (this._searchSprite && this._searchSprite.opacity > 0) {
				this._searchSprite.opacity -= 3;
			}

			if (Input._latestButton) {
				this.processInput();
			} else if (TouchInput.isLongPressed() && this.isSeveralModeValid()) {
				if (!this._severalModeSwitched) {
					this.switchSelectingMode();
					this._severalModeSwitched = true;
					if (this._selectingIndexes.length === 0) {
						this.processTouch();
					}
					this.applyData();
				}
			} else if (TouchInput.isTriggered()) {
				this.processTouch();
				this._severalModeSwitched = false;
			}
		};
		PickerBase.prototype.onKeyDown = function (keyCode, event) {
			if ((!event.ctrlKey && !event.metaKey) && keyCode >= KEY_CODE.alphabet && keyCode <= KEY_CODE.alphabetEnd) {
				var chara = event.key;
				this.search(chara);
			}
		};
		PickerBase.prototype.search = function (chara) { };
		PickerBase.prototype.didSuccessSearch = function (index) {
			this.setTopIndex(index);
			var sprite = this._searchSprite;
			if (!sprite) {
				sprite = this.createHighlightSprite();
				this._searchSprite = sprite;
				sprite.tint = PickerBase.TINT_SEARCH;
			}
			this.setHighlightSpritePosition(sprite, index);
			sprite.opacity = 150;
		};


		PickerBase.prototype.processTouch = function () {
			var x = TouchInput.x - this.x;
			var y = TouchInput.y - this.y;

			if (x < 0 || x > this._width) {
				this.end();
				return;
			}

			var maxCol = this.maxColumns();
			var length = this.maxItems();
			var margin = PickerBase.LAYOUT.marginTopBottom;
			var mx = this.itemMarginX();
			var my = this.itemMarginY();
			var itemWidth = this.itemWidth();
			var itemHeight = this.itemHeight();
			var colW = itemWidth + mx;
			var rowH = itemHeight + my;
			var x0 = margin / 2;

			var ix = x0;
			var iy = margin / 2;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				if (i === 0) {
				} else if (i % maxCol === 0) {
					ix = margin / 2;
					iy += rowH;
				} else {
					ix += colW;
				}
				if (ix <= x && x <= ix + colW && iy <= y && y <= iy + rowH) {
					this.didPickData(i);
					return;
				}
			}
		};

		PickerBase.prototype.setSelectingIndex = function (index) {
			SoundManager.playCursor();
			var sprite = null;
			var noSelect = index < 0;

			if (this._severalMode) {
				if (this._selectingIndexes.contains(index)) {
					return;
				}
				this._selectingIndexes.push(index);
			} else {
				this._selectingIndexes[0] = index;
				sprite = this._highlightSprites[0];
				if (noSelect) {
					if (sprite) {
						this._highlightSprites.length = 0;
						sprite.parent.removeChild(sprite);
					}
					return;
				}
			}
			if (noSelect) return;

			if (!sprite) {
				sprite = this.createHighlightSprite();
				this._highlightSprites.push(sprite);
			}
			sprite.tint = this._severalMode ? PickerBase.TINT_SEVERAL : PickerBase.TINT_NORMAL;
			this.setHighlightSpritePosition(sprite, index);
		};

		PickerBase.prototype.setHighlightSpritePosition = function (sprite, index) {
			var maxCol = this.maxColumns();
			var margin = PickerBase.LAYOUT.marginTopBottom;
			var mx = this.itemMarginX();
			var my = this.itemMarginY();
			var itemWidth = this.itemWidth();
			var itemHeight = this.itemHeight();

			var col = index % maxCol;
			var row = Math.floor(index / maxCol);
			sprite.visible = true;
			sprite.x = margin + col * itemWidth + (col - 1) * mx;
			sprite.y = margin + row * itemHeight + (row - 1) * my;
		};

		PickerBase.prototype.deselectAll = function () {
			var sprites = this._highlightSprites;
			var length = sprites.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var sprite = sprites[i];
				sprite.parent.removeChild(sprite);
			}
			sprites.length = 0;
			this._selectingIndexes.length = 0;
		};

		/* headerSprite
		===================================*/
		PickerBase.prototype.createHeaderSprite = function () {
			var bitmap = new Bitmap(256, 24);
			var sprite = new Sprite(bitmap);
			bitmap.fontSize = 21;
			bitmap.textColor = 'white'
			bitmap.outlineWidth = 6;
			this.addChild(sprite);
			this._headerSprite = sprite;
		};
		PickerBase.prototype.refreshHeaderSprite = function () {
			var header = this.headerText();
			this.showHeaderSprite(header);
		};
		PickerBase.prototype.showHeaderSprite = function (header, color = 'rgb(0,0,200)') {
			if (header === this._header) return;
			this._header = header;
			var sprite = this._headerSprite;
			var bitmap = sprite.bitmap;
			bitmap.clear();
			bitmap.outlineColor = color;
			bitmap.drawText(header, 1, 0, bitmap.width - 2, bitmap.height);
			sprite.opacity = 255;
			sprite.visible = true;

			this.addChild(sprite);
		};
		PickerBase.prototype.updateHeaderSprite = function () {
			if (this._headerSprite.opacity > 200) {
				this._headerSprite.opacity -= 1;
			} else {
				this._headerSprite.opacity -= 5;
			}
			if (this._headerSprite.opacity <= 0) {
				this._headerSprite.visible = false;
			}
		};


		/* backSprite
		===================================*/
		PickerBase.prototype.createBackSprite = function () {
			var sprite, bitmap;
			bitmap = new Bitmap(16, 16);
			sprite = new Sprite(bitmap);
			this.addChild(sprite);
			this._backSprite = sprite;
			sprite.opacity = 150;
			bitmap.fillAll('black');
		};
		PickerBase.prototype.refreshBackSprite = function () {
			var width = this._width;
			var height = Graphics.height;
			var sprite = this._backSprite;
			sprite.scale.set(width / 16, height / 16);
		};


		/* highlight sprites
		===================================*/
		PickerBase.prototype.createHighlightBitmap = function () {
			var bitmap = new Bitmap(16, 16);
			bitmap.fillAll('white');
			this._highlightBitmap = bitmap;
		};
		PickerBase.prototype.createHighlightSprite = function () {
			var itemHeight = this.itemHeight();
			var itemWidth = this._width / this.maxColumns();

			var bitmap = this._highlightBitmap;
			var sprite = new Sprite(bitmap);
			this.addChild(sprite);
			sprite.opacity = 100;
			sprite.scale.set(itemWidth / bitmap.width, itemHeight / bitmap.height);
			return sprite;
		};

		/* guide sprite
		===================================*/
		PickerBase.prototype.createGuideSprite = function () {
			var texts = this.guideTexts();
			if (!texts) return;

			var fontSize = 14;
			var width = $gameSystem.isJapanese() ? 200 : 400;
			var lineHeight = fontSize + 4;
			var lines = texts.length;
			var height = lineHeight * lines;
			var bitmap = new Bitmap(width, height);
			var sprite = new Sprite(bitmap);
			this.addChild(sprite);
			this._guideSprite = sprite;

			sprite.anchor.set(0, 1);

			bitmap.fontSize = fontSize;
			bitmap.fillAll('rgb(0,0,150,0.6)');

			var y = 0;
			var length = texts.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var text = texts[i];
				bitmap.drawText(text, 1, y, width - 2, lineHeight);
				y += lineHeight;
			};
		};

		/* scroll
		===================================*/
		PickerBase.prototype.setTopIndex = function (i) {
			var row = Math.floor(i / this.maxColumns());
			var newRow = row.clamp(0, this._maxTopRow);
			if (this._topRow === newRow) return;
			this._topRow = newRow;
			this.refreshPosition();
		};
		PickerBase.prototype.setTopRowNext = function () {
			var index = (this._topRow - 1) * this.maxColumns()
			this.setTopIndex(index);
		};
		PickerBase.prototype.setTopRowPrevious = function () {
			var index = (this._topRow + 1) * this.maxColumns();
			this.setTopIndex(index);
		};
		PickerBase.prototype.refreshPosition = function () {
			var oldY = this.y
			this.y = -this._topRow * this.itemHeight();
			if (this._topRow !== 0) {
				this.y -= PickerBase.LAYOUT.marginTopBottom;
			}

			var dy = this.y - oldY;
			this._backSprite.y -= dy;
			if (this._guideSprite) {
				this._guideSprite.y -= dy;
			}
			if (this._headerSprite) {
				this._headerSprite.y -= dy;
			}
		};

		PickerBase.prototype.processInput = function () {
			if (Input.isTriggered('ok') || Input.isTriggered('cancel')) {
				this.end();
			} else if (Input.isRepeated('up')) {
				SoundManager.playCursor();
				this.setTopRowNext();
			} else if (Input.isRepeated('down')) {
				SoundManager.playCursor();
				this.setTopRowPrevious();
			} else if (Input.isRepeated('left')) {
				this.processPageDown();
			} else if (Input.isRepeated('right')) {
				this.processPageUp();
			}
		};

		PickerBase.prototype.processPageUp = function () {
			SoundManager.playCursor();
			if (this.maxCategories() > 1) {
				this._topRow = 0;
				var index = this._categoryIndex;
				do {
					index += 1;
					if (index >= this.maxCategories()) {
						index = 0;
					}
				} while (index !== this._categoryIndex && !this.isCategoryValid(index));
				this._categoryIndex = index;
				this.refreshCategory();
			} else {
				this._topRow = Math.min(this._maxTopRow, this._topRow + this._dispRows);
				this.refreshPosition();
			}
		};
		PickerBase.prototype.processPageDown = function () {
			SoundManager.playCursor();
			if (this.maxCategories() > 1) {
				this._topRow = 0;
				var index = this._categoryIndex;
				do {
					index -= 1;
					if (index < 0) {
						index = this.maxCategories() - 1;
					}
				} while (index !== this._categoryIndex && !this.isCategoryValid(index));
				this._categoryIndex = index;
				this.refreshCategory();
			} else {
				this._topRow = Math.max(0, this._topRow - this._dispRows);
				this.refreshPosition();
			}
		};

		PickerBase.prototype.refreshCategory = function () {
			this.deselectAll();
			this.refresh();
			this.refreshPosition();
		};



		/* several mode
		===================================*/
		PickerBase.prototype.switchSelectingMode = function () {
			this.setSeveralMode(!this._severalMode);
		};
		PickerBase.prototype.setSeveralMode = function (valid) {
			if (this._severalMode === valid) return;
			this._severalMode = valid;

			this.deselectAll();
		};

		/* wheel
		===================================*/
		PickerBase.prototype.registerWheelListener = function () {
			var listener = this._onWheel.bind(this);
			this._wheelListener = listener;
			document.addEventListener('wheel', listener);
		};
		PickerBase.prototype.resignWheelListener = function () {
			if (!this._wheelListener) return;

			document.removeEventListener('wheel', this._wheelListener);
			this._wheelListener = null;
		};

		PickerBase.prototype._onWheel = function (event) {
			if (event.deltaY > 0) {
				this.setTopRowNext();
			} else if (event.deltaY < 0) {
				this.setTopRowPrevious();
			}
			event.stopPropagation();
		};


		//=============================================================================
		// ImagePickerBase
		//=============================================================================
		ParticleEditor.ImagePickerBase = function ImagePickerBase() {
			this.initialize.apply(this, arguments);
		};
		var ImagePickerBase = ParticleEditor.ImagePickerBase;

		ImagePickerBase.prototype = Object.create(PickerBase.prototype);
		ImagePickerBase.prototype.constructor = ImagePickerBase;
		ImagePickerBase.prototype.initialize = function () {
			PickerBase.prototype.initialize.call(this);
		};
		ImagePickerBase.prototype.applyData = function () {
			if (this._owner) {
				var imageName = this.imageName();
				this._owner.didPickImage(imageName);
			}
		};
		ImagePickerBase.prototype.imageName = function () { return ''; };




		//=============================================================================
		// ImagePicker
		//=============================================================================
		ParticleEditor.ImagePicker = function ImagePicker() {
			this.initialize.apply(this, arguments);
		};
		var ImagePicker = ParticleEditor.ImagePicker;

		ImagePicker.MARGIN = 5;
		ImagePicker.NAME_HEIGHT = 14;
		ImagePicker.MAX_COL = 4;
		ImagePicker.IMAGE_SIZE = 48;


		ImagePicker.prototype = Object.create(ImagePickerBase.prototype);
		ImagePicker.prototype.constructor = ImagePicker;
		ImagePicker.prototype.initialize = function () {
			ImagePickerBase.prototype.initialize.call(this);

			this._imageNames = parameters.imageNames;
			this._imageSize = this.imageSize();

			this._imageSprites = [];
			this._nameSprites = [];
		};


		/* overwrite setting
		===================================*/
		ImagePicker.prototype.maxItems = function () {
			return this._imageNames.length;
		};
		ImagePicker.prototype.maxColumns = function () {
			return ImagePicker.MAX_COL;
		};
		ImagePicker.prototype.itemHeight = function () {
			var nameHeight = ImagePicker.NAME_HEIGHT;
			return this.imageSize() + nameHeight;
		};
		ImagePicker.prototype.itemWidth = function () {
			return this.imageSize();
		};
		ImagePicker.prototype.itemMarginX = function () {
			return ImagePicker.MARGIN;
		};
		ImagePicker.prototype.itemMarginY = function () {
			return 0;
		};
		ImagePicker.prototype.guideTexts = function () {
			return [
				LC('↑↓キー、マウスホイールでスクロール', 142),
				LC('決定キー、リスト外クリックで選択終了', 143),
				LC('長押しクリックで複数<=>単体選択切り替え', 144)
			];
		};
		ImagePicker.prototype.imageName = function () {
			var name = '';
			var indexes = this._selectingIndexes;
			var length = indexes.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				if (i > 0) {
					name += ',';
				}
				var index = indexes[i];
				name += this._imageNames[index];
			}
			return name;
		};


		/* originalSetting
		===================================*/
		ImagePicker.prototype.imageSize = function () {
			return ImagePicker.IMAGE_SIZE;
		};

		/* refresh
		===================================*/
		ImagePicker.prototype.refreshItems = function () {
			var nameHeight = ImagePicker.NAME_HEIGHT;
			var mx = this.itemMarginX();
			var my = this.itemMarginY();
			var margin = PickerBase.LAYOUT.marginTopBottom;

			//images
			var width = this._width;
			var itemWidth = this.itemWidth();
			var itemHeight = this.itemHeight();
			var imageSize = this.imageSize();

			var colW = itemWidth + mx;
			var rowH = itemHeight + my;

			var nameSprites = this._nameSprites;
			var nameSprite, nameBitmap, bitmap, sprite;

			var col = this.maxColumns();

			var imageNames = this._imageNames;
			var length = imageNames.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var r = Math.floor(i / col);
				var c = i % col;
				if (c === 0) {
					nameSprite = nameSprites[r];
					if (!nameSprite) {
						nameBitmap = new Bitmap(width, nameHeight);
						nameBitmap.fontSize = nameHeight - 2;

						nameSprite = new Sprite(nameBitmap);
						this.addChild(nameSprite);
						nameSprites[r] = nameSprite;
						nameSprite.y = margin + imageSize + r * rowH;
					} else {
						nameSprite.bitmap.clear();
					}
					nameBitmap = nameSprite.bitmap;
				}

				var name = imageNames[i];
				var x = margin + c * (colW);
				var y = margin + r * (rowH);
				bitmap = ImageManager.loadParticle(name);
				sprite = new Sprite(bitmap);
				this.addChild(sprite);
				sprite.anchor.set(0.5, 0.5);
				sprite.x = x + imageSize / 2;
				sprite.y = y + imageSize / 2;
				this._imageSprites.push(sprite);
				bitmap.addLoadListener(this._adjustSpriteScale.bind(this, sprite, itemWidth, itemHeight));

				nameBitmap.drawText(name, x, 0, imageSize, nameHeight, 'center');
			}
		};

		ImagePicker.prototype._adjustSpriteScale = function (sprite, width, height, bitmap) {
			if (sprite.bitmap !== bitmap) return;

			var scale = Math.min(1, width / sprite.width, height / sprite.height);
			sprite.scale.set(scale, scale);
		};


		/* start picking
		===================================*/
		ImagePicker.prototype.startPicking = function (owner, image) {
			ImagePickerBase.prototype.startPicking.call(this, owner);

			if (image) {
				var images = image.split(',');
				var length = images.length;
				var validIndexes = [];
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var index = this._imageNames.indexOf(images[i]);
					if (index >= 0) {
						validIndexes.push(index);
					}
				}

				length = validIndexes.length;
				var severalMode = length >= 2;
				this.setSeveralMode(severalMode);

				for (var i = 0; i < length; i = (i + 1) | 0) {
					var index = validIndexes[i];
					this.setSelectingIndex(index);
				}
			}
		};


		/* search
		===================================*/
		ImagePicker.prototype.search = function (chara) {
			var names = this._imageNames;
			var length = names.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var name = names[i];
				if (name[0] === chara) {
					this.didSuccessSearch(i);
					return;
				}
			}
		};






		//=============================================================================
		// TilePicker
		//=============================================================================
		ParticleEditor.TilePicker = function TilePicker() {
			this.initialize.apply(this, arguments);
		};
		var TilePicker = ParticleEditor.TilePicker;

		TilePicker.MAX_COL = 8;
		TilePicker.TILE_SCALE = 0.5;


		TilePicker.prototype = Object.create(ImagePickerBase.prototype);
		TilePicker.prototype.constructor = ImagePicker;
		TilePicker.prototype.initialize = function () {
			ImagePickerBase.prototype.initialize.call(this);

			this._bitmaps = this.tilesetBitmaps();


			this._maxItems = 0;
			this._tileSize = this.tileSize();
			this._imageRows = 0;
			this._imageCols = 0;

			var scale = this.tileScale();
			var sprite = new Sprite();
			this._upperSprite = sprite;
			this.addChild(sprite);
			sprite.scale.set(scale, scale);

			sprite = new Sprite();
			this._lowerSprite = sprite;
			this.addChild(sprite);
			sprite.scale.set(scale, scale);
		};

		//PRAGMA: tilesetBitmaps
		TilePicker.prototype.tilesetBitmaps = function () {
			return SceneManager._scene._spriteset._tilemap.bitmaps;
		};
		//PRAGMA_END: tilesetBitmaps

		/* overwrite setting
		===================================*/
		TilePicker.prototype.maxItems = function () {
			return this._maxItems;
		};
		TilePicker.prototype.maxColumns = function () {
			return TilePicker.MAX_COL;
		};
		TilePicker.prototype.itemHeight = function () {
			return this.tileSize() * this.tileScale();
		};
		TilePicker.prototype.itemWidth = function () {
			return this.tileSize() * this.tileScale();
		};
		TilePicker.prototype.itemMarginX = function () {
			return 0;
		};
		TilePicker.prototype.itemMarginY = function () {
			return 0;
		};
		TilePicker.prototype.guideTexts = function () {
			return [
				LC('１つのタイルセットのみから選択可', 145),
				LC('↑↓キー、マウスホイールでスクロール', 146),
				LC('←→キー、タイルセット切り替え', 147),
				LC('決定キー、リスト外クリックで選択終了', 148),
				LC('長押しクリックで複数<=>単体選択切り替え', 149)
			];
		};

		TilePicker.prototype.bitmapsImages = function () {
			var bitmaps = this._bitmaps;
			var images = [];
			var length = bitmaps.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var bitmap = bitmaps[i];
				if (bitmap) {
					images.push(this.imageNameForBitmap(bitmap));
				}
			}
			return images;
		};
		TilePicker.prototype.imageNameForBitmap = function (bitmap) {
			var bitmapNameElems = bitmap._url.split('/');
			var bitmapName = bitmapNameElems[bitmapNameElems.length - 1].replace('.png', '');
			return bitmapName;
		};
		TilePicker.prototype.imageName = function () {
			var bitmapIndex = this._categoryIndex;
			var bitmapName = this.imageNameForBitmap(this._bitmaps[bitmapIndex]);
			var name = '';

			var indexes = this._selectingIndexes;
			var length = indexes.length;
			var rows = this._imageRows;
			var cols = this.maxColumns();
			var tilesetCols = ParticleEmitter.TILESET_COLUMNS;

			var lowerSpriteIndex = rows * cols;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				if (i > 0) {
					name += ',';
				}
				var index = indexes[i];
				var tileIndex;
				var c = index % cols;
				var r = Math.floor(index / cols);
				if (index >= lowerSpriteIndex) {
					c += cols;
					r -= rows;
				}
				var tileIndex = r * tilesetCols + c;

				// name += 'tile:'+bitmapIndex+':'+tileIndex;
				name += 'tile:' + bitmapName + ':' + tileIndex;
			}
			return name;
		};
		TilePicker.prototype.categoryType = function () {
			return this._categoryIndex;
		};

		TilePicker.prototype.maxCategories = function () {
			return this._bitmaps ? this._bitmaps.length : 1;
		};
		TilePicker.prototype.isCategoryValid = function (index) {
			var bitmap = this._bitmaps[index];
			if (!bitmap) return false;
			return bitmap.width >= 48 && bitmap.height >= 48;
		};



		/* originalSetting
		===================================*/
		TilePicker.prototype.tileSize = function () {
			return 48;
		};
		TilePicker.prototype.tileScale = function () {
			return TilePicker.TILE_SCALE;
		};

		/* refresh
		===================================*/
		TilePicker.prototype.setListType = function (type) {
			ImagePickerBase.prototype.setListType.call(this, type);
			var tileSize = this.tileSize();

			var bitmap = this.bitmap();
			var width = bitmap.width;
			var height = bitmap.height;
			var imageCols = Math.floor(width / tileSize);
			var imageRows = Math.floor(height / tileSize);

			this._imageCols = imageCols;
			this._imageRows = imageRows;

			var maxCol = this.maxColumns();
			var validCols = Math.ceil(imageCols / maxCol) * maxCol;

			this._maxItems = validCols * imageRows;
		};
		TilePicker.prototype.refreshItems = function () {
			var tileSize = this.tileSize();

			var bitmap = this.bitmap();
			var width = bitmap.width;
			var height = bitmap.height;
			var imageCols = Math.floor(width / tileSize);
			var imageRows = Math.floor(height / tileSize);
			var maxCol = this.maxColumns();
			var margin = PickerBase.LAYOUT.marginTopBottom;

			var sprite = this._upperSprite;
			sprite.bitmap = bitmap;
			sprite._frame.width = maxCol * tileSize;
			sprite._refresh();
			sprite.x = margin;
			sprite.y = margin;

			sprite = this._lowerSprite
			sprite.visible = imageCols > maxCol
			if (sprite.visible) {
				sprite.bitmap = bitmap;
				sprite._frame.x = maxCol * tileSize;
				sprite._refresh();
				sprite.x = margin;
				sprite.y = margin + height * this.tileScale();
			}
		};

		TilePicker.prototype.bitmap = function () {
			return this._bitmaps[this._categoryIndex];
		};


		/* start picking
		===================================*/
		TilePicker.prototype.startPicking = function (owner, imagestr) {
			var tileIndexes = [];
			if (imagestr) {
				var images = imagestr.split(',');

				var tilesetImages = this.bitmapsImages();
				var bitmaps = this._bitmaps;

				var tilesetIndex = -1;
				var length = images.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var image = images[i];
					var setIndex = -1;
					if (image.indexOf('tile:') === 0) {
						var elems = image.split(':');
						setIndex = tilesetImages.indexOf(elems[1]);
						if (tilesetIndex < 0) {
							tilesetIndex = setIndex;
						} else if (tilesetIndex !== setIndex) {
							continue;
						}
						var tileIndex = Number(elems[2]);
						tileIndexes.push(tileIndex)
					}
				}
				this._categoryIndex = tilesetIndex;
			};
			if (this._categoryIndex < 0) {
				this._categoryIndex = this._bitmaps.length >= 6 ? 5 : 0;
			}

			ImagePickerBase.prototype.startPicking.call(this, owner);

			var rows = this._imageRows;
			var cols = this.maxColumns();
			var tilesetCols = ParticleEmitter.TILESET_COLUMNS;
			var lowerSpriteIndex = cols * rows;
			var length = tileIndexes.length;

			var severalMode = length >= 2;
			this.setSeveralMode(severalMode);

			for (var i = 0; i < length; i = (i + 1) | 0) {
				var tileIndex = tileIndexes[i];

				var col, row;
				var col = tileIndex % tilesetCols;
				var row = Math.floor(tileIndex / tilesetCols);
				if (col >= cols) {
					row += rows;
					col -= cols;
				}
				var index = row * cols + col;
				this.setSelectingIndex(index);
			}
		};






		//=============================================================================
		// AnimationPicker
		//=============================================================================
		ParticleEditor.AnimationPicker = function AnimationPicker() {
			this.initialize.apply(this, arguments);
		};
		var AnimationPicker = ParticleEditor.AnimationPicker;



		AnimationPicker.MAX_COL = 5;
		AnimationPicker.IMAGE_SCALE = 1 / 3;

		AnimationPicker.prototype = Object.create(ImagePickerBase.prototype);
		AnimationPicker.prototype.constructor = ImagePicker;
		AnimationPicker.prototype.initialize = function () {
			ImagePickerBase.prototype.initialize.call(this);

			this._imageNames = parameters.animationNames;
			this._monoTone = false;

			this._maxItems = 0;
			this._imageSize = this.imageSize();
			this._imageRows = 0;
			this._imageCols = 0;

			this._bitmap = null;

			var scale = this.imageScale();
			var sprite = new Sprite();
			this._imageSprite = sprite;
			this.addChild(sprite);
			sprite.scale.set(scale, scale);
		};

		/* overwrite setting
		===================================*/
		AnimationPicker.prototype.maxItems = function () {
			return this._maxItems;
		};
		AnimationPicker.prototype.maxColumns = function () {
			return AnimationPicker.MAX_COL;
		};
		AnimationPicker.prototype.itemHeight = function () {
			return this.imageSize() * this.imageScale();
		};
		AnimationPicker.prototype.itemWidth = function () {
			return this.imageSize() * this.imageScale();
		};
		AnimationPicker.prototype.itemMarginX = function () {
			return 0;
		};
		AnimationPicker.prototype.itemMarginY = function () {
			return 0;
		};
		AnimationPicker.prototype.guideTexts = function () {
			return [
				LC('１つのアニメーション画像のみから選択可', 150),
				LC('↑↓キー、マウスホイールでスクロール', 151),
				LC('←→キー、画像切り替え', 152),
				LC('キーボードで頭1文字をサーチ可能', 153),
				LC('決定キー、リスト外クリックで選択終了', 154),
				LC('長押しクリックで複数<=>単体選択切り替え', 155),
				LC('Shiftでモノトーン切り替え', 156),
				LC('(モノトーンはピッカー終了時に反映)', 157)
			];
		};
		AnimationPicker.prototype.imageName = function () {
			var imageName = this._imageNames[this._categoryIndex];
			var name = ''

			var indexes = this._selectingIndexes;
			var length = indexes.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				if (i > 0) {
					name += ',';
				}
				var index = indexes[i];
				name += 'ANIM:' + imageName + ':' + index;
				if (this._monoTone) {
					name += ':M';
				}
			}
			return name;
		};
		AnimationPicker.prototype.headerText = function () {
			var imageName = this._imageNames[this._categoryIndex];
			var text = '【' + imageName + '】(' + (this._categoryIndex + 1) + '/' + this._imageNames.length + ')';
			return text;
		};
		AnimationPicker.prototype.categoryType = function () {
			return this._categoryIndex;
		};
		AnimationPicker.prototype.maxCategories = function () {
			return this._imageNames ? this._imageNames.length : 1;
		};
		AnimationPicker.prototype.isCategoryValid = function (index) {
			return !!this._imageNames[index];
		};


		/* originalSetting
		===================================*/
		AnimationPicker.prototype.imageSize = function () {
			return 192;
		};
		AnimationPicker.prototype.imageScale = function () {
			return AnimationPicker.IMAGE_SCALE;
		};

		/* refresh
		===================================*/
		AnimationPicker.prototype.setListType = function (type) {
			ImagePickerBase.prototype.setListType.call(this, type);

			this._imageCols = 0;
			this._imageRows = 0;
			this._maxItems = 0;

			var bitmap = this.bitmap();
			this._bitmap = bitmap;
			bitmap.addLoadListener(AnimationPicker.prototype._setListType.bind(this));
		};
		AnimationPicker.prototype._setListType = function (bitmap) {
			if (this._bitmap !== bitmap) return;

			var imageSize = this.imageSize();
			var width = bitmap.width;
			var height = bitmap.height;
			var imageCols = Math.floor(width / imageSize);
			var imageRows = Math.floor(height / imageSize);
			this._imageCols = imageCols;
			this._imageRows = imageRows;

			var maxCol = this.maxColumns();
			var validCols = Math.ceil(imageCols / maxCol) * maxCol;
			this._maxItems = validCols * imageRows;

			this._refresh();
		};

		AnimationPicker.prototype.refreshItems = function () {
			var imageSize = this.imageSize();

			var bitmap = this.bitmap();
			var width = bitmap.width;
			var height = bitmap.height;
			var imageCols = Math.floor(width / imageSize);
			var imageRows = Math.floor(height / imageSize);
			var maxCol = this.maxColumns();
			var margin = PickerBase.LAYOUT.marginTopBottom;

			var sprite = this._imageSprite;
			sprite.bitmap = bitmap;
			sprite._frame.width = maxCol * imageSize;
			sprite._refresh();
			sprite.x = margin;
			sprite.y = margin;
		};

		AnimationPicker.prototype.bitmap = function () {
			var imageName = this._imageNames[this._categoryIndex];
			return ImageManager.loadAnimation(imageName);
		};


		/* start picking
		===================================*/
		AnimationPicker.prototype.startPicking = function (owner, imagestr) {
			var frames = [];
			if (imagestr) {
				var images = imagestr.split(',');

				var length = images.length;
				var index = -1;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var image = images[i];
					if (image.indexOf('ANIM:') === 0) {
						var elems = image.split(':');
						var animImage = elems[1];
						if (index < 0) {
							index = this._imageNames.indexOf(animImage);
						}
						var frame = Number(elems[2]);
						frames.push(frame)
					}
				}
				this._categoryIndex = index;
			};
			if (this._categoryIndex < 0) {
				this._categoryIndex = 0;
			}

			ImagePickerBase.prototype.startPicking.call(this, owner);

			var rows = this._imageRows;
			var cols = this.maxColumns();
			var length = frames.length;

			var severalMode = length >= 2;
			this.setSeveralMode(severalMode);
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var frame = frames[i];

				var col, row;
				var col = frame % cols;
				var row = Math.floor(frame / cols);
				if (col >= cols) {
					row += rows;
					col -= cols;
				}
				var index = row * cols + col;
				this.setSelectingIndex(index);
			}
		};

		/* search
		===================================*/
		AnimationPicker.prototype.search = function (chara) {
			var imageNames = this._imageNames;
			var length = imageNames.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var image = imageNames[i];
				if (image[0].toLowerCase() === chara) {
					SoundManager.playCursor();
					if (this._categoryIndex === i) {
						this._headerSprite.opacity = 255;
						this._headerSprite.visible = true;
					} else {
						this._categoryIndex = i;
						this._topRow = 0;
						this.refreshCategory();
					}
					return;
				}
			}
		};

		/* MonoTone
		===================================*/
		AnimationPicker.prototype.update = function () {
			PickerBase.prototype.update.call(this);
			if (Input.isTriggered('shift')) {
				this.changeMonoTone();
			}
		};
		AnimationPicker.prototype.changeMonoTone = function () {
			if (PIXI.filters.ColorMatrixFilter) {
				this._monoTone = !this._monoTone;
				SoundManager.playCursor();
				if (this._monoTone) {
					var filter = new PIXI.filters.ColorMatrixFilter();
					filter.saturate(-1);
					this._imageSprite.filters = [filter];
				} else {
					this._imageSprite.filters = null;
				}
			}
		};




		/* write image
		===================================*/
		AnimationPicker.prototype.end = function () {
			var indexes = this._selectingIndexes;
			var imageName = this.imageName();
			if (indexes.length > 0) {
				this.writeImageFiles(indexes);
				this.registerAnimationImageNames(imageName);
			}
			var owner = this._owner;
			PickerBase.prototype.end.call(this);

			if (owner && indexes.length > 0) {
				owner.forceChangeImage(imageName);
				owner.writeHelpFile();
			}
		};
		AnimationPicker.prototype.registerAnimationImageNames = function (imageName) {
			var params = PluginManager._parameters.trp_particlelist;
			if (!params) {
				params = PluginManager._parameters.trp_particlelist = {};
			}
			var animImages = params.animImages;
			if (!animImages) {
				animImages = params.animImages = [];
			}
			var imageNames = imageName.split(',');
			var length = imageNames.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var image = imageNames[i];
				if (!animImages.contains(image)) {
					animImages.push(image);
				}
			}
		};
		AnimationPicker.prototype.writeImageFiles = function (indexes) {
			var bitmap = this.bitmap();

			var length = indexes.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var index = indexes[i];
				this.writeImageFile(bitmap, index);
			}
		};
		AnimationPicker.prototype.writeImageFile = function (bitmap, index) {
			var size = this.imageSize();
			var cols = this._imageCols;
			var col = index % cols;
			var row = Math.floor(index / cols);

			var x = col * size;
			var y = row * size;

			var sprite = new Sprite(this._imageSprite.bitmap);
			sprite.setFrame(x, y, size, size);
			sprite.filters = this._imageSprite.filters;

			var renderTexture = PIXI.RenderTexture.create(size, size);

			//PRAGMA: renderAnimation
			Graphics._renderer.render(sprite, renderTexture);
			sprite.worldTransform.identity();
			var canvas;
			if (Graphics.isWebGL()) {
				canvas = Graphics._renderer.extract.canvas(renderTexture);
			} else {
				canvas = renderTexture.baseTexture._canvasRenderTarget.canvas;
			}
			//PRAGMA_END: renderAnimation

			var imageName = this._imageNames[this._categoryIndex];
			imageName += '_' + index;
			if (this._monoTone) {
				imageName += '_M';
			}
			var name = '_ANIM_' + imageName + '.png';

			var fs = require('fs');
			var path = require('path');
			var base = ParticleEditor.IMAGE_PATH;
			var filePath = path.join(base, name);
			var urlData = canvas.toDataURL('image/png')

			var regex = (/^data:image\/png;base64,/);
			var base64Data = urlData.replace(regex, "");
			fs.writeFileSync(filePath, base64Data, 'base64');

			renderTexture.destroy({ destroyBase: true });
		};




		//=============================================================================
		// PresetPicker
		//=============================================================================
		ParticleEditor.PresetPicker = function PresetPicker() {
			this.initialize.apply(this, arguments);
		};
		var PresetPicker = ParticleEditor.PresetPicker

		PresetPicker.MARGIN = 5;
		PresetPicker.ROW_HEIGHT = 20;
		PresetPicker.COL_WIDTH = 300;
		PresetPicker.MAX_COL = 1;


		var TARGET_TYPES = ParticleEmitter.TARGET_TYPES;
		PresetPicker.TARGET_NAMES = [];
		PresetPicker.TARGET_NAMES[TARGET_TYPES.character] = 'character';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.walk] = 'walk';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.startdash] = 'startdash';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.attach] = 'character';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.tilemap] = 'tilemap';

		PresetPicker.TARGET_NAMES[TARGET_TYPES.screen] = 'screen';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.weather] = 'weather';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.region] = 'region';

		PresetPicker.TARGET_NAMES[TARGET_TYPES.actor] = 'actor';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.party] = 'party';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.enemy] = 'enemy';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.battle] = 'battle';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.battleWeather] = 'bWeather';

		PresetPicker.TARGET_NAMES[TARGET_TYPES.click] = 'click';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.drag] = 'drag';

		PresetPicker.TARGET_NAMES[TARGET_TYPES.picture] = 'picture';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.battlePicture] = 'picture';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.skit] = 'skit';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.battleSkit] = 'skit';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.attachActor] = 'actor';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.attachParty] = 'party';
		PresetPicker.TARGET_NAMES[TARGET_TYPES.attachEnemy] = 'enemy';


		// Game_Particle.TARGET_CATEGORIES = [['character','walk','tilemap','startdash'],['screen','weather','region'],['click','drag'],['others'],['hidden']];
		// Game_Particle.CATEGORY_NAMES = ['character','screen','system','others','hidden'];

		PresetPicker.CATEGORIES = Game_Particle.TARGET_CATEGORIES;
		PresetPicker.CATEGORY_NAMES_EN = Game_Particle.CATEGORY_NAMES;
		//dummySet > Scene_Boot.prototype.start
		PresetPicker.CATEGORY_NAMES = [LC('キャラ対象', 158), NLC('スクリーン/天候/リージョン', 159, 'screen/weather/region'), NLC('マウス/タップ', 160, 'click/drag'), LC('その他', 161, 'Others'), LC('非表示(/h)', 162)];

		PresetPicker.prototype = Object.create(PickerBase.prototype);
		PresetPicker.prototype.constructor = PresetPicker;
		PresetPicker.prototype.initialize = function () {
			PickerBase.prototype.initialize.call(this);

			this._list = [];
			this._names = [];
			this._contentsSprite = null;
			this._allData = null;
			this._allNames = null;
			this._filterMode = '';
			this._targetType = -1;
			this._currentData = null;

			this.createAllData();
			this.createContentsSprite();
		};

		PresetPicker.prototype.createContentsSprite = function () {
			var maxNum = 0;
			var allData = this.allData();
			var length = allData.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var categoryData = allData[i];
				maxNum = Math.max(maxNum, Object.keys(categoryData).length);
			}

			var width = this.itemWidth();
			var height = this.itemHeight() * maxNum;

			var bitmap = new Bitmap(width, height);
			var sprite = new Sprite(bitmap);
			this.addChild(sprite);
			this._contentsSprite = sprite;
			sprite.y = PickerBase.LAYOUT.marginTopBottom;
		};
		PresetPicker.prototype.rawData = function () {
			return $dataTrpParticlePreset;
		};
		PresetPicker.prototype.createAllData = function () {
			return this._createAllData(this.rawData());
		};
		PresetPicker.prototype._createAllData = function (database) {
			var allData = [];
			var allNames = [];
			this._allData = allData;
			this._allNames = allNames;

			PresetPicker.setCategoriedList(database, allData, allNames);
		};
		PresetPicker.setCategoriedList = function (database, allData, allNames) {
			var categoryLength = PresetPicker.CATEGORIES.length;
			for (var i = 0; i < categoryLength; i = (i + 1) | 0) {
				allData.push([]);
				allNames.push([]);
			}

			//add hidden category
			var keys = Object.keys(database).sort();
			var length = keys.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var key = keys[i];
				var data = database[key];
				if (Array.isArray(data)) {
					data = Game_Particle.decompressConfigDataFromArray(data.concat());
				}

				if (Game_Particle.isIdHidden(key)) {
					allData[allData.length - 1].push(data);
					allNames[allNames.length - 1].push(key);
				} else {
					var targetType = PresetPicker.TARGET_NAMES[data.targetType];
					var pushed = false;
					for (var j = 0; j < categoryLength - 1; j = (j + 1) | 0) {
						if (PresetPicker.CATEGORIES[j].contains(targetType)) {
							pushed = true;
							allData[j].push(data);
							allNames[j].push(key);
							break;
						}
					}
					if (!pushed) {
						allData[allData.length - 2].push(data);
						allNames[allNames.length - 2].push(key);
					}
				}
			}
		};
		PresetPicker.prototype.allData = function () {
			return this._allData;
		};


		/* overwrite setting
		===================================*/
		PresetPicker.prototype.maxItems = function () {
			return this._list.length;
		};
		PresetPicker.prototype.maxColumns = function () {
			return PresetPicker.MAX_COL;
		};
		PresetPicker.prototype.itemHeight = function () {
			return PresetPicker.ROW_HEIGHT;
		};
		PresetPicker.prototype.itemWidth = function () {
			return PresetPicker.COL_WIDTH;
		};
		PresetPicker.prototype.itemMarginX = function () {
			return PresetPicker.MARGIN;
		};
		PresetPicker.prototype.itemMarginY = function () {
			return 0;
		};
		PresetPicker.prototype.guideTexts = function () {
			return [
				LC('プリセットの設定を読み込みます。', 163),
				LC('↑↓キー、マウスホイールでスクロール', 164),
				LC('←→キー、カテゴリー切り替え', 165),
				LC('決定キー、リスト外クリックで選択終了', 166)
			];
		};
		PresetPicker.prototype.headerText = function () {
			return '【' + PresetPicker.CATEGORY_NAMES[this._categoryIndex] + '】';
		};
		PresetPicker.prototype.categoryType = function () {
			return this._categoryIndex;
		};
		PresetPicker.prototype.maxCategories = function () {
			return PresetPicker.CATEGORIES.length;
		};
		PresetPicker.prototype.isCategoryValid = function (index) {
			return index === 0 || (this._allData[index] && this._allData[index].length > 0);
		}
		PresetPicker.prototype.isSeveralModeValid = function () { return false };

		PresetPicker.prototype.applyData = function () {
			if (!this._owner) return;

			var index = this._selectingIndexes[0];
			var data = this._list[index];
			if (!data) return;

			var name = this._names[index];
			this._owner.applyData(JsonEx.makeDeepCopy(data), name);
		};

		/* refresh
		===================================*/
		PresetPicker.prototype.setListType = function (type) {
			PickerBase.prototype.setListType.call(this, type);

			var names = this._allNames[this._categoryIndex];
			var list = this.allData()[this._categoryIndex];
			if (this._filterMode) {
				names = names.concat();
				list = list.concat();
				var length = names.length;
				for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
					var data = list[i];
					if (data) {
						var mode = data.emitterLifetime > 0 ? 'play' : 'set';
						if (this._filterMode !== mode) {
							list.splice(i, 1);
							names.splice(i, 1);
						}
					}
				}
			}

			this._names = names;
			this._list = list;
		};

		PresetPicker.prototype.refreshItems = function () {
			var width = this.itemWidth();
			var lineHeight = this.itemHeight();
			var list = this._list;
			var length = list.length;
			var height = lineHeight * length;

			var bitmap = this._contentsSprite.bitmap;
			bitmap.clear();

			var margin = 5;
			var names = this._names;
			var length = list.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var data = list[i];
				var name = names[i];
				var x = margin;
				var y = i * lineHeight;

				var elemWidth = 100;
				bitmap.fontSize = lineHeight - 3;

				//name
				bitmap.drawText(name, x, y, elemWidth, lineHeight);
				x += elemWidth + margin;

				//comment(target)
				var text = data.comment;
				if (!text) {
					text = PresetPicker.TARGET_NAMES[data.targetType] || null;
					if (text) {
						text = '[' + text + ']';
					}
				}
				if (text) {
					bitmap.drawText(text, x, y, width - x, lineHeight);
				}
			}
		};

		/* start picking
		===================================*/
		PresetPicker.prototype.startPicking = function (owner, targetType, currentData) {
			this._categoryIndex = 0;
			this._currentData = currentData;
			this._targetType = targetType;

			this.deselectAll();
			if (targetType >= 0) {
				var typeName = PresetPicker.TARGET_NAMES[targetType];
				var categories = PresetPicker.CATEGORIES;
				var length = categories.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					if (categories[i].contains(typeName)) {
						this._categoryIndex = i;
						this.refreshCategory();
						break;
					}
				}
			}
			PickerBase.prototype.startPicking.call(this, owner);
		};

		/* search
		===================================*/
		PresetPicker.prototype.search = function (chara) {
			var names = this._names;
			var length = names.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var name = names[i];
				if (name[0] === chara) {
					this.didSuccessSearch(i);
					return;
				}
			}
		};

		/* filter
		===================================*/
		PresetPicker.prototype.onKeyDown = function (keyCode, event) {
			if (keyCode === KEY_CODE.f && (event.ctrlKey || event.metaKey)) {
				this.changeFilterMode();
			} else {
				PickerBase.prototype.onKeyDown.call(this, keyCode, event);
			}
		};
		PickerBase.prototype.changeFilterMode = function () {
			var header;
			if (this._filterMode === 'set') {
				this._filterMode = 'play';
				header = LC('《フィルター=play用》', 167);
			} else if (this._filterMode === 'play') {
				this._filterMode = '';
				header = LC('《フィルター=なし》', 168);
			} else {
				this._filterMode = 'set';
				header = LC('《フィルター=set用》', 169);

			}

			this._listType = -1;
			SoundManager.playCursor();

			this.refreshCategory();
			this.showHeaderSprite(header, 'rgb(0,150,0)');
		};


		/* input
		===================================*/
		PresetPicker.prototype.processInput = function () {
			if (Input.isRepeated('cancel')) {
				this._owner.applyData(this._currentData);
				this.end();
			} else if (Input.isRepeated('down')) {
				this.selectNext();
			} else if (Input.isRepeated('up')) {
				this.selectPrevious();
			} else {
				PickerBase.prototype.processInput.call(this);
			}
		};
		PresetPicker.prototype.selectNext = function () {
			var index = this._selectingIndexes.length ? this._selectingIndexes[0] : -1;
			index += 1;
			if (index >= this.maxItems()) {
				SoundManager.playBuzzer();
				return;
			}
			this.didPickData(index);
			if (index > this._topRow + this._dispRows) {
				this.setTopRowPrevious();
			}
		};
		PresetPicker.prototype.selectPrevious = function () {
			var index = this._selectingIndexes.length ? this._selectingIndexes[0] : this.maxItems();
			index -= 1;
			if (index < 0) {
				SoundManager.playBuzzer();
				return;
			}
			this.didPickData(index);
			if (index < this._topRow) {
				this.setTopRowNext();
			}
		};






		//=============================================================================
		// LoadPicker
		//=============================================================================
		ParticleEditor.LoadPicker = function LoadPicker() {
			this.initialize.apply(this, arguments);
		};
		var LoadPicker = ParticleEditor.LoadPicker
		LoadPicker.prototype = Object.create(PresetPicker.prototype);
		LoadPicker.prototype.constructor = LoadPicker;
		LoadPicker.prototype.initialize = function () {
			PresetPicker.prototype.initialize.call(this);
		};

		LoadPicker.prototype.refreshItems = function () {
			var width = this.itemWidth();
			var lineHeight = this.itemHeight();
			var list = this._list;
			var length = list.length;
			var height = lineHeight * length;

			var bitmap = this._contentsSprite.bitmap;
			bitmap.clear();

			var margin = 5;
			var names = this._names;
			var length = list.length;
			var today = new Date();
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var data = list[i];
				var name = names[i];
				var x = margin;
				var y = i * lineHeight;

				var elemWidth = 140;
				bitmap.fontSize = lineHeight - 3;
				bitmap.drawText(name, x, y, elemWidth, lineHeight);
				x += elemWidth + margin;

				elemWidth = 60;
				var text = PresetPicker.TARGET_NAMES[data.targetType] || null;
				if (text) {
					bitmap.textColor = 'rgb(150,200,255)';
					bitmap.fontSize -= 1;
					bitmap.drawText(text, x, y, elemWidth, lineHeight)
					bitmap.textColor = 'white';
					bitmap.fontSize += 1;
				}
				x += elemWidth + margin;

				elemWidth = 90;
				bitmap.fontSize -= 2;

				var comment = data.comment;
				var text;
				if (!comment) {
					text = '---';
				} else if (isNaN(comment)) {
					text = '-' + comment + '-';
				} else {
					var dateNum = Number(comment);
					var day = dateNum % 100;
					var month = Math.floor(dateNum / 100) % 100;
					var year = 2000 + Math.floor(dateNum / 10000) % 100;
					var date = new Date(year, month - 1, day);
					var diff = today - date;
					var diffDate = Math.floor(diff / (1000 * 60 * 60 * 24));
					text = '-' + month + '/' + day;
					if (diffDate === 0) text += LC('(今日)-', 171);
					else if (diffDate === 1) text += LC('(昨日)-', 172);
					else text += '(' + diffDate + LC('日前)-', 173);
				}
				text = text;
				bitmap.drawText(text, x, y, elemWidth, lineHeight)
			}
		};



		/* overwrite setting
		===================================*/
		LoadPicker.prototype.guideTexts = function () {
			return [
				LC('保存データ設定をコピーします。', 174),
				LC('マウスホイールでスクロール', 175),
				LC('↑↓キー、上下のデータを選択', 181),
				LC('←→キー、カテゴリー切り替え', 176),
				LC('決定キー、リスト外クリックで選択終了', 177),
				LC('対象は編集時に設定していた対象(参考用)。', 178),
				LC('deleteキー(macはfn+delete)でデータ削除', 179),
				LC('（データ削除は保存を行った時点で確定します）', 180),
			];
		};
		LoadPicker.prototype.rawData = function () {
			return $dataTrpParticles;
		};


		/* delete
		===================================*/
		LoadPicker.prototype.onKeyDown = function (keyCode, event) {
			PresetPicker.prototype.onKeyDown.call(this, keyCode, event);
			if (keyCode === KEY_CODE.delete) {
				this.processDelete();
			}
		};
		LoadPicker.prototype.processDelete = function () {
			if (this._selectingIndexes.length === 0) return;
			var index = this._selectingIndexes[0];
			var key = this._names[index];
			delete this.rawData()[key];

			this._names.splice(index, 1);
			this._list.splice(index, 1);
			this.refreshItems();

			this.deselectAll();
		};



	})();

	(function () {
		'use strict';


		//PRAGMA: subEmitterRegisterCommands
		//PRAGMA_END: subEmitterRegisterCommands


		/*! *****************************************************************************
		Copyright (c) Microsoft Corporation. All rights reserved.
		Licensed under the Apache License, Version 2.0 (the "License"); you may not use
		this file except in compliance with the License. You may obtain a copy of the
		License at http://www.apache.org/licenses/LICENSE-2.0
		
		THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
		KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
		WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
		MERCHANTABLITY OR NON-INFRINGEMENT.
		
		See the Apache Version 2.0 License for specific language governing permissions
		and limitations under the License.
		***************************************************************************** */
		/* global Reflect, Promise */
		var extendStatics = function (d, b) {
			extendStatics = Object.setPrototypeOf ||
				({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
				function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
			return extendStatics(d, b);
		};
		function __extends(d, b) {
			extendStatics(d, b);
			function __() { this.constructor = d; }
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
		/***************************************************************************** */

		//PRAGMA: subEmitterPluginSetting
		var baseParameters = PluginManager.parameters('TRP_Particle');
		//PRAGMA_END: subEmitterPluginSetting

		var LC = TRP_Localize.localize.bind(TRP_Localize, 'parSe');

		var _Game_Particle_particleData = Game_Particle.prototype.particleData;
		Game_Particle.prototype.particleData = function (eventId, id, target, name, z, x, y, image) {
			var data = _Game_Particle_particleData.apply(this, arguments);
			if (data.subs) {
				data.subs = null;
			}
			return data;
		};

		var _Game_Particle_pluginCommand = Game_Particle.prototype.pluginCommand;
		Game_Particle.prototype.pluginCommand = function (interpreter, args, eventId) {
			var sub = args[0].toLowerCase();
			if (sub === 'sub') {
				this.processSubEmitterCommand(interpreter, args, eventId);
			} else {
				_Game_Particle_pluginCommand.call(this, interpreter, args, eventId);
			}
		};

		Game_Particle.prototype.processSubEmitterCommand = function (interpreter, args, eventId) {
			var main = args.shift();
			var sub = args.shift().toLowerCase();

			if (!isNaN(eventId)) {
				this.processArgsEventId(args, eventId);
			}

			if (sub === 'set' || sub === 'play' || sub === 'edit') {
				if (sub === 'set' || sub === 'play') {
					Game_Particle.prototype.particleSubEmitterSet.apply(this, args);
				} else if (sub === 'edit') {
					if (Game_Particle.prototype.particleSubEmitterEdit.apply(this, args) && interpreter) {
						interpreter.wait(1);
					}
				}
			}
		};

		Game_Particle.prototype.particleSubEmitterSet = function (id, name, timing = 0, endTiming = -1, speedRate = 0, inheritAngle = 0, inheritScale = 0) {
			var data = this.dataWithId(id);
			if (!data) {
				return;
			}
			var subEmitters = data.subs;
			if (!subEmitters) {
				subEmitters = data.subs = [];
			}


			var length = subEmitters.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var sb = subEmitters[i];
				if (sb[0] === name) {
					return;
				}
			}

			subEmitters.push([name, Number(timing), Number(endTiming), Number(speedRate), Number(inheritAngle), Number(inheritScale)]);
		};


		Game_Particle.SUB_EMITTER_DEFAULT_DATA = null;
		Game_Particle.prototype.particleSubEmitterEdit = function (id, name, timing = 0, endTiming = -1, speedRate = 0, inheritAngle = 0, inheritScale = 0) {
			//ensure config data exists
			if (!$dataTrpParticles[name] && !$dataTrpParticlePreset[name]) {
				if (!Game_Particle.SUB_EMITTER_DEFAULT_DATA) {
					Game_Particle.SUB_EMITTER_DEFAULT_DATA = JsonEx.makeDeepCopy(ParticleEditor.DEFAULT_DATA || {});
					Game_Particle.SUB_EMITTER_DEFAULT_DATA.frequency = 0.1;
				}
				$dataTrpParticles[name] = JsonEx.makeDeepCopy(Game_Particle.SUB_EMITTER_DEFAULT_DATA);
			}
			this.particleSubEmitterSet.apply(this, arguments);

			id = id + Game_Particle.SUB_EMITTER_DEV_SUFFIX + name;
			var exData = {
				timing: timing,
				endTiming: endTiming,
				speedRate: speedRate,
				inheritAngle: inheritAngle,
				inheritScale: inheritScale,
			}
			this._particleEditWithExData(exData, 0, '', id);
		};

		Game_Particle.SUB_EMITTER_DEV_SUFFIX = '/SUB:';

		var _Game_Particle_idWithSuffix = Game_Particle.prototype.idWithSuffix;
		Game_Particle.prototype.idWithSuffix = function (id) {
			if (this._suffix && id.contains(Game_Particle.SUB_EMITTER_DEV_SUFFIX)) {
				var args = id.split(Game_Particle.SUB_EMITTER_DEV_SUFFIX);
				var main = args[0];
				var sub = args[1];

				main = _Game_Particle_idWithSuffix.call(this, main);
				return main + Game_Particle.SUB_EMITTER_DEV_SUFFIX + sub;
			} else {
				return _Game_Particle_idWithSuffix.call(this, id);
			}
		};


		//=============================================================================
		// ParticleEmitter
		//=============================================================================
		var _ParticleEmitter_setupBitmaps = ParticleEmitter.prototype.setupBitmaps;
		ParticleEmitter.prototype.setupBitmaps = function (image, bitmaps) {
			_ParticleEmitter_setupBitmaps.call(this, image, bitmaps);

			this._setupSubEmitterBitmaps = true;
			if (this._data.subs) {
				this.setupSubEmitters(image, bitmaps, this._data.subs);
			} else {
				this.tryStart(image, bitmaps);
			}
		};

		var _ParticleEmitter_initMembers = ParticleEmitter.prototype.initMembers;
		ParticleEmitter.prototype.initMembers = function () {
			_ParticleEmitter_initMembers.call(this);

			this._setupSubEmitterBitmaps = false;
			this._subData = null;
			this._subNames = null;
			this._subBitmaps = null;
		};

		ParticleEmitter.prototype.setupSubEmitters = function (image, mainBitmaps, subData) {
			this._subData = subData;
			this._subNames = [];
			var bitmaps = this._subBitmaps = [];

			var length = subData.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var data = subData[i];
				var name = data[0];
				var config = Game_Particle.configDataWithName(name)
				Array.prototype.push.apply(bitmaps, this.bitmapsWithImage(config.image || baseParameters.defaultImage));
				this._subNames.push(name);
			}

			var length = bitmaps.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				bitmaps[i].addLoadListener(ParticleEmitter.prototype.tryStart.bind(this, image, mainBitmaps));
			}
		};

		var _ParticleEmitter_tryStart = ParticleEmitter.prototype.tryStart;
		ParticleEmitter.prototype.tryStart = function (image, bitmaps) {
			if (this._started) return;
			if (!this._setupSubEmitterBitmaps) {
				return;
			}
			if (this._subBitmaps) {
				for (const bitmap of this._subBitmaps) {
					if (!bitmap.isReady()) {
						return false;
					}
				}
				this._subBitmaps = null;
			}
			return _ParticleEmitter_tryStart.call(this, image, bitmaps);
		};

		var _ParticleEmitter_start = ParticleEmitter.prototype.start;
		ParticleEmitter.prototype.start = function (image, bitmaps) {
			_ParticleEmitter_start.call(this, image, bitmaps);

			if (this._subData) {
				var emitter = this._emitter;
				var container = this._container;
				for (const data of this._subData) {
					this.setSubEmitter(emitter, container, data);
				}
			}
		};
		ParticleEmitter.prototype.setSubEmitter = function (emitter, container, data) {
			var name = data[0];
			var timing = data[1] || 0;
			var endTiming = data.length >= 3 ? data[2] || 0 : -1;
			var speedRate = data[3] || 0;
			var inheritAngle = data[4] || 0;
			var inheritScale = data[5] || 0;
			var config = Game_Particle.configDataWithName(name);


			var image = config.image || baseParameters.defaultImage;
			var bitmaps = this.bitmapsWithImage(image);
			var textures = this._texturesWithBitmaps(image, bitmaps);
			emitter.setSubEmitter(container, textures, config, timing, endTiming, speedRate, inheritAngle, inheritScale);
		};

		ParticleEmitter.prototype.particleConstructor = function () {
			return this._subData ? TRP_ParticleEx : TRP_Particle;
		};
		ParticleEmitter.prototype.emitterConstructor = function () {
			return this._subData ? TRP_EmitterEx : TRP_Emitter;
		};
		ParticleEmitter.prototype.subEmitter = function (name) {
			return this._emitter._subEmitters ? this._emitter._subEmitters[this._subNames.indexOf(name)] : null;
		};

		var _ParticleEmitter_loopParticles = ParticleEmitter.prototype.loopParticles;
		ParticleEmitter.prototype.loopParticles = function (loopX, loopY) {
			_ParticleEmitter_loopParticles.call(this, loopX, loopY, this._emitter);

			if (this._subEmitters) {
				var length = this._subEmitters.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					_ParticleEmitter_loopParticles.call(this, loopX, loopY, this._subEmitters[i]);
				}
			}
		};

		var _ParticleEmitter_cleanup = ParticleEmitter.prototype.cleanup;
		ParticleEmitter.prototype.cleanup = function () {
			_ParticleEmitter_cleanup.call(this);

			if (this._emitter instanceof TRP_EmitterEx) {
				this._emitter.cleanupSubEmitters();
			}
		};


		//=============================================================================
		// TRP_EmitterEx
		//=============================================================================
		var TRP_Emitter = ParticleEmitter.TRP_Emitter;
		var Emitter = PIXI.particles.Emitter;

		var TRP_EmitterEx = /** @class */(function (_super) {
			__extends(TRP_EmitterEx, _super);

			var utils = PIXI.particles.ParticleUtils;
			function TRP_EmitterEx(particleParent, particleImages, config) {
				var _this = _super.call(this, particleParent, particleImages, config) || this;
				_this._subEmitters = [];
				return _this;
			};

			TRP_EmitterEx.prototype.destroy = function (force) {
				if (!force && this.particleTotalCount() > 0) return;

				_super.prototype.destroy.call(this);

				var length = this._subEmitters.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					this._subEmitters[i].destroy();
				}
				this._subEmitters.length = 0;
			};

			TRP_EmitterEx.prototype.cleanupSubEmitters = function () {
				var length = this._subEmitters.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var sub = this._subEmitters[i];
					sub.cleanup();
				}
			}

			TRP_EmitterEx.prototype.particleTotalCount = function () {
				var count = this.particleCount;
				var length = this._subEmitters.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					count += this._subEmitters[i].particleCount;
				}
				return count;
			};

			TRP_EmitterEx.prototype.update = function (delta) {
				_super.prototype.update.call(this, delta);

				if (!this._parent) return;
				if (this._subEmitters) {
					var length = this._subEmitters.length;
					for (var i = 0; i < length; i = (i + 1) | 0) {
						this._subEmitters[i].update(delta);
					}
				}
			};

			TRP_EmitterEx.prototype.setSubEmitter = function (container, textures, config, timing, endTiming, speedRate, inheritAngle, inheritScale) {
				var emitter = new TRP_SubEmitter(container, textures, config, timing, endTiming, speedRate, inheritAngle, inheritScale);
				this._subEmitters.push(emitter);
			};

			TRP_EmitterEx.prototype.applyAdditionalProperties = function (p) {
				TRP_Emitter.prototype.applyAdditionalProperties.call(this, p);

				p.subEmitters = this._subEmitters;
				if (p.subEmitters) {
					var emitters = p.subEmitters;
					var length = emitters.length;
					for (var i = 0; i < length; i = (i + 1) | 0) {
						this.pushSubEmitterData(p, i);
					}
				}
			};

			TRP_EmitterEx.prototype.pushSubEmitterData = function (p, i) {
				var data = p.subEmitterData[i];
				if (!data) {
					data = {};
					p.subEmitterData[i] = data;

					data._prevEmitterPos = new PIXI.Point(p.x, p.y);
				} else {
					data._prevEmitterPos.x = p.x;
					data._prevEmitterPos.y = p.y;
				}
				data._emit = false;
				data._spawnTimer = 0;
				data._emitterLife = 0;
				data._prevPosIsValid = false;
				data._spawn = false;
			};

			TRP_EmitterEx.prototype.applyCapacityLimit = function () {
				var naturalCapacity = this.naturalCapacity(this._originalFrequency, this._originalParticlesPerWave);
				var subCapacity = this.subEmittersCapacity();

				var mainRate = Math.pow(this._capacityRate, naturalCapacity / ((naturalCapacity + subCapacity) || 1));
				var subRate = this._capacityRate / (mainRate || 1);

				//main limit
				var target = naturalCapacity * mainRate;
				this.maxParticles = target;
				if (this.particlesPerWave > 1) {
					this.particlesPerWave = Math.ceil(Math.min(this._originalParticlesPerWave, this._originalParticlesPerWave * (target / naturalCapacity))) || 1;
					naturalCapacity = this.naturalCapacity(this._originalFrequency, this.particlesPerWave);
				}
				this.frequency = Math.max(this._originalFrequency, this._originalFrequency / (target / naturalCapacity));

				//sub limit
				var length = this._subEmitters.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var sub = this._subEmitters[i];
					sub.capacityRate = subRate;
					sub.maxParticles = sub._originalMaxParticles * subRate;
				}
			};

			TRP_EmitterEx.prototype.particleCapacity = function () {
				var capacity = _super.prototype.particleCapacity.call(this);
				var subCapacity = this.subEmittersCapacity();
				return capacity * subCapacity;
			};
			TRP_EmitterEx.prototype.subEmittersCapacity = function () {
				var subCapacity = 1;
				var length = this._subEmitters.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					subCapacity += this._subEmitters[i].particleCapacity();
				}
				return subCapacity;
			}

			return TRP_EmitterEx;
		}(TRP_Emitter));
		ParticleEmitter.TRP_EmitterEx = TRP_EmitterEx;




		//=============================================================================
		// TRP_SubEmitter
		//=============================================================================
		var TRP_SubEmitter = /** @class */(function (_super) {
			__extends(TRP_SubEmitter, _super);

			var utils = PIXI.particles.ParticleUtils;
			function TRP_SubEmitter(particleParent, particleImages, config, timing = 0, endTiming = -1, speedRate = 0, inheritAngle = 0, inheritScale = 0) {
				var _this = TRP_Emitter.call(this, particleParent, particleImages, config) || this;
				_this._particleConstructor = TRP_Particle;

				_this.timing = timing;
				_this.endTiming = endTiming;
				_this.speedRate = speedRate;
				_this.inheritAngle = inheritAngle;
				_this.inheritScale = inheritScale;

				return _this;
			};

			TRP_SubEmitter.prototype.update = function (delta) {
				if (this._autoUpdate) {
					delta = delta / pixi.settings.TARGET_FPMS / 1000;
				}
				if (!this._parent) return;

				var i, particle, next;
				for (particle = this._activeParticlesFirst; particle; particle = next) {
					next = particle.next;
					particle.update(delta);
				}
			};

			TRP_SubEmitter.prototype.updateParticleEmitter = function (ep, lerp, delta, data) {
				//data ~ time,
				//ep : emitter particle
				if (!data._emit) {
					if (!data._spawn && lerp >= this.timing) {
						data._emit = true;
						data._spawn = true;
						data._emitterLife = this.emitterLifetime
					} else {
						return;
					}
				} else if (this.endTiming >= 0 && lerp >= this.endTiming) {
					data._spawnTimer = 0;
					data._emitterLife = 0;
					data._emit = false;
					return;
				}

				if (!this._parent)
					return;

				if (this._autoUpdate) {
					delta = delta / pixi.settings.TARGET_FPMS / 1000;
				}

				//update existing particles        
				var prevX, prevY;
				//if the previous position is valid, store these for later interpolation
				if (data._prevPosIsValid) {
					prevX = data._prevEmitterPos.x;
					prevY = data._prevEmitterPos.y;
				}
				//store current position of the emitter as local variables
				var curX = ep.x + this.spawnPos.x;
				var curY = ep.y + this.spawnPos.y;
				var posChanged = data._prevPosIsValid && (prevX !== curX || prevY !== curY);

				//spawn new particles
				if (this._emit) {
					//decrease spawn timer
					data._spawnTimer -= delta < 0 ? 0 : delta;
					//while _spawnTimer < 0, we have particles to spawn
					while (data._spawnTimer <= 0) {
						//determine if the emitter should stop spawning
						if (data._emitterLife > 0) {
							data._emitterLife -= this._frequency;
							if (data._emitterLife <= 0) {
								data._spawnTimer = 0;
								data._emitterLife = 0;
								data._emit = false;
								break;
							}
						}
						//determine if we have hit the particle limit
						if (this.particleCount >= this.maxParticles) {
							data._spawnTimer += this._frequency;
							continue;
						}
						//determine the particle lifetime
						var lifetime = void 0;
						if (this.minLifetime == this.maxLifetime)
							lifetime = this.minLifetime;
						else
							lifetime = Math.random() * (this.maxLifetime - this.minLifetime) + this.minLifetime;
						//only make the particle if it wouldn't immediately destroy itself
						if (-data._spawnTimer < lifetime) {
							//If the position has changed and this isn't the first spawn,
							//interpolate the spawn position
							var emitPosX = void 0, emitPosY = void 0;
							if (data._prevPosIsValid && posChanged) {
								//1 - _spawnTimer / delta, but _spawnTimer is negative
								var lerp = 1 + data._spawnTimer / delta;
								emitPosX = (curX - prevX) * lerp + prevX;
								emitPosY = (curY - prevY) * lerp + prevY;
							}
							else //otherwise just set to the spawn position
							{
								emitPosX = curX;
								emitPosY = curY;
							}
							//create enough particles to fill the wave (non-burst types have a wave of 1)
							var i = 0;
							for (var len = Math.min(this.particlesPerWave, this.maxParticles - this.particleCount); i < len; ++i) {
								//see if we actually spawn one
								if (this.spawnChance < 1 && Math.random() >= this.spawnChance)
									continue;
								//create particle
								var p = void 0;
								if (this._poolFirst) {
									p = this._poolFirst;
									this._poolFirst = this._poolFirst.next;
									p.next = null;
								}
								else {
									p = new this.particleConstructor(this);
								}
								//set a random texture if we have more than one
								if (this.particleImages.length > 1) {
									// if using ordered art
									if (this._currentImageIndex !== -1) {
										// get current art index, then increment for the next particle
										p.applyArt(this.particleImages[this._currentImageIndex++]);
										// loop around if needed
										if (this._currentImageIndex < 0 || this._currentImageIndex >= this.particleImages.length) {
											this._currentImageIndex = 0;
										}
									}
									// otherwise grab a random one
									else {
										p.applyArt(this.particleImages[Math.floor(Math.random() * this.particleImages.length)]);
									}
								}
								else {
									//if they are actually the same texture, a standard particle
									//will quit early from the texture setting in setTexture().
									p.applyArt(this.particleImages[0]);
								}
								//set up the start and end values
								p.alphaList.reset(this.startAlpha);
								p.speedList.reset(this.startSpeed);
								if (this.minimumSpeedMultiplier != 1) {
									p.speedMultiplier = Math.random() * (1 - this.minimumSpeedMultiplier) + this.minimumSpeedMultiplier;
								}
								p.acceleration.x = this.acceleration.x;
								p.acceleration.y = this.acceleration.y;
								p.maxSpeed = this.maxSpeed;
								if (this.minimumScaleMultiplier != 1) {
									p.scaleMultiplier = Math.random() * (1 - this.minimumScaleMultiplier) + this.minimumScaleMultiplier;
								}
								p.scaleList.reset(this.startScale);
								p.colorList.reset(this.startColor);
								//randomize the rotation speed
								if (this.minRotationSpeed == this.maxRotationSpeed)
									p.rotationSpeed = this.minRotationSpeed;
								else
									p.rotationSpeed = Math.random() * (this.maxRotationSpeed - this.minRotationSpeed) + this.minRotationSpeed;
								p.rotationAcceleration = this.rotationAcceleration;
								p.noRotation = this.noRotation;
								//set up the lifetime
								p.maxLife = lifetime;
								//set the blend mode
								p.blendMode = this.particleBlendMode;
								//set the custom ease, if any
								p.ease = this.customEase;
								//set the extra data, if any
								p.extraData = this.extraData;


								//set additional properties to particle
								this.applyAdditionalProperties(p);
								//call the proper function to handle rotation and position of particle
								this._spawnFunc(p, emitPosX, emitPosY, i);

								if (this.inheritScale > 0) {
									p.scaleMultiplier *= ep.scaleMultiplier;
								}

								//initialize particle
								p.init();

								//inertia
								p.iVelocity.x = this.speedRate * ep.velocity.x;
								p.iVelocity.y = this.speedRate * ep.velocity.y;
								p._doInertia = !!(p.iVelocity.x || p.iVelocity.y);

								//inheritAngle
								if (this.inheritAngle > 0) {
									var v1Rotation = Math.atan2(ep.velocity.y, ep.velocity.x);
									utils.rotatePoint(v1Rotation / utils.DEG_TO_RADS, p.velocity);
									p.rotation += v1Rotation;
								}

								//update the particle by the time passed, so the particles are spread out properly
								p.update(-data._spawnTimer); //we want a positive delta, because a negative delta messes things up
								//add the particle to the display list
								if (!p.parent) {
									if (this.addAtBack)
										this._parent.addChildAt(p, 0);
									else
										this._parent.addChild(p);
								}
								else {
									//kind of hacky, but performance friendly
									//shuffle children to correct place
									var children = this._parent.children;
									//avoid using splice if possible
									if (children[0] == p)
										children.shift();
									else if (children[children.length - 1] == p)
										children.pop();
									else {
										var index = children.indexOf(p);
										children.splice(index, 1);
									}
									if (this.addAtBack)
										children.unshift(p);
									else
										children.push(p);
								}
								//add particle to list of active particles
								if (this._activeParticlesLast) {
									this._activeParticlesLast.next = p;
									p.prev = this._activeParticlesLast;
									this._activeParticlesLast = p;
								}
								else {
									this._activeParticlesLast = this._activeParticlesFirst = p;
								}
								++this.particleCount;
							}
						}
						//increase timer and continue on to any other particles that need to be created
						data._spawnTimer += this._frequency;
					}
					//if the position changed before this update, then keep track of that

					data._prevEmitterPos.x = curX;
					data._prevEmitterPos.y = curY;
					data._prevPosIsValid = true;
				}
			};
			return TRP_SubEmitter;
		}(ParticleEmitter.TRP_Emitter));




		//=============================================================================
		// TRP_ParticleEx
		//=============================================================================
		var TRP_Particle = ParticleEmitter.TRP_Particle;
		var TRP_ParticleEx = /** @class */(function (_super) {
			__extends(TRP_ParticleEx, _super);

			var utils = PIXI.particles.ParticleUtils;
			function TRP_ParticleEx(emitter) {
				var _this = _super.call(this, emitter) || this;
				_this.subEmitters = null;
				_this.subEmitterData = [];

				return _this;
			};

			TRP_ParticleEx.prototype.kill = function () {
				var emitters = this.subEmitters;
				var length = emitters ? emitters.length : 0;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					var data = this.subEmitterData[i];
					if (!data._spawn || data._emitterLife > 0) {
						return;
					}
				}
				_super.prototype.kill.call(this);
			}

			TRP_ParticleEx.prototype.update = function (delta) {
				var lerp = _super.prototype.update.call(this, delta);
				if (this._wait > 0) return lerp;

				var emitters = this.subEmitters;
				var length = emitters ? emitters.length : 0;
				var subLerp = lerp < 0 ? 1 : lerp;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					emitters[i].updateParticleEmitter(this, subLerp, delta, this.subEmitterData[i]);
				}
				return lerp;
			};


			return TRP_ParticleEx;
		}(TRP_Particle));



		/* cache config
		===================================*/
		(function () {
			'use strict';
			if (!baseParameters.useCache || baseParameters.useCache === 'false') return;

			//=============================================================================
			// TRP_Emitter
			//=============================================================================
			var Emitter = PIXI.particles.Emitter;
			var TRP_Emitter = ParticleEmitter.TRP_Emitter;
			var TRP_EmitterEx = ParticleEmitter.TRP_EmitterEx;
			if (TRP_EmitterEx) {
				var _TRP_EmitterEx_applyAdditionalProperties = TRP_EmitterEx.prototype.applyAdditionalProperties;
				TRP_EmitterEx.prototype.applyAdditionalProperties = function (p) {
					_TRP_EmitterEx_applyAdditionalProperties.call(this, p);

					var naturalCapacity = this.naturalCapacity(this._originalFrequency, this._originalParticlesPerWave);
					var rate = naturalCapacity - 1;

					var subEmitters = this._subEmitters;
					var length = subEmitters.length;
					for (var i = 0; i < length; i = (i + 1) | 0) {
						var emitter = subEmitters[i];
						emitter.preparePoolFromCache(rate);
					}
				};
			}
		})();






	})();

	var $dataTrpParticleGroupsPreset = $dataTrpParticleGroupsPreset || null;
	var $dataTrpParticleGroups = null;



	(function () {
		'use strict';
		//PRAGMA: groupPluginSetting
		var pluginName = 'TRP_Particle_Group';
		Game_Particle.GROUP_DATA_FIILE_PATH = 'TrpParticleGroups.json';
		var baseParameters = PluginManager.parameters('TRP_Particle');
		//PRAGMA_END: groupPluginSetting

		var LC = TRP_Localize.localize.bind(TRP_Localize, 'parGr');
		var NLC = TRP_Localize.noLocalize;

		var errorLog = baseParameters.errorLog === 'true';

		DataManager._databaseFiles.push({
			name: '$dataTrpParticleGroups',
			src: Game_Particle.GROUP_DATA_FIILE_PATH,
		});

		var _DataManager_loadDataFile = DataManager.loadDataFile;
		DataManager.loadDataFile = function (name, src) {
			if (src.contains('Test_') && src.contains('TrpParticleGroups')) {
				src = Game_Particle.GROUP_DATA_FIILE_PATH;
			}
			_DataManager_loadDataFile.call(this, name, src);
		};

		function supplement(defaultValue, optionArg) {
			if (optionArg === undefined) {
				return defaultValue;
			}
			return optionArg;
		};
		function supplementNum(defaultValue, optionArg) {
			return Number(supplement(defaultValue, optionArg));
		};

		var _supplementDefWords = ['default', 'def', 'd'];
		function supplementDef(defaultValue, optionArg, otherWords) {
			var value = supplement(defaultValue, optionArg);

			var defTargetWords = otherWords || [];
			if (defTargetWords) {
				defTargetWords = defTargetWords.concat(_supplementDefWords);
			} else {
				defTargetWords = _supplementDefWords;
			}

			var length = defTargetWords.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var target = defTargetWords[i];
				if (value === target) {
					value = defaultValue;
					break;
				}
			}
			return value;
		};
		function supplementDefNum(defaultValue, optionArg, otherWords) {
			var value = supplementDef(defaultValue, optionArg, otherWords);
			return Number(value);
		};


		//PRAGMA: groupCommandRegister
		//PRAGMA_END: groupCommandRegister



		//=============================================================================
		// Game_Particle
		//=============================================================================
		Game_Particle.groupData = function (data) {
			return this.groupDataWithName(data.name);
		};
		Game_Particle.groupDataWithName = function (name) {
			var config = $dataTrpParticleGroups[name];
			if (config) {
				return config;
			}

			config = $dataTrpParticleGroupsPreset[name];
			if (config) {
				return config;
			}

			if (name.indexOf('/h') !== name.length - 2) {
				return this.groupDataWithName(name + '/h');
			}

			return null;
		};

		var _Game_Particle_initialize = Game_Particle.prototype.initialize;
		Game_Particle.prototype.initialize = function () {
			_Game_Particle_initialize.call(this);
			this._groups = {};
			this._groupKeys = [];
		};

		var _Game_Particle_pluginCommand = Game_Particle.prototype.pluginCommand;
		Game_Particle.prototype.pluginCommand = function (interpreter, args, eventId) {
			var sub = args[0].toLowerCase();
			if (sub === 'group') {
				this.processGroupCommand(interpreter, args, eventId);
			} else {
				_Game_Particle_pluginCommand.call(this, interpreter, args, eventId);
			}
		};

		Game_Particle.prototype.processGroupCommand = function (interpreter, args, eventId) {
			var main = args.shift();
			var sub = args.shift().toLowerCase();

			//process eid
			if (!isNaN(eventId)) {
				this.processArgsEventId(args, eventId);
			}

			var tag;
			if (sub === 'set' || sub === 'play' || sub === 'edit') {
				tag = this.extractTagRegister(args);
				args.splice(-1 + Game_Particle.GROUP_COMMAND_ARGS_INDEX_TAG, 0, tag);

				var targetId = '';
				if (sub === 'set' || sub === 'play') {
					args.unshift(eventId);
					Game_Particle.prototype.particleGroupSet.apply(this, args);
					targetId = args[1];
				} else if (sub === 'edit') {

					args.unshift(eventId);
					if (Game_Particle.prototype.particleGroupEdit.apply(this, args) && interpreter) {
						interpreter.wait(1);
					}
					targetId = args[2];
				}
			} else if (sub === 'clear') {
				Game_Particle.prototype.particleGroupClear.apply(this, args);
			}
		};

		Game_Particle.GROUP_COMMAND_ARGS_INDEX_TAG = 3;
		Game_Particle.prototype.particleGroupEdit = function () { };
		Game_Particle.prototype.particleGroupSet = function (eventId, id, target, tag, name, x, y) {
			name = supplementDef(id, name) || id;
			id = this.idWithSuffix(id);

			if (!!this._groups[id]) {
				return;
			}


			x = Number(x) || 0;
			y = Number(y) || 0;

			if (!Game_Particle.groupDataWithName(name)) {
				if (errorLog) {
					throw new Error(LC('設定名:%1のグループ設定データが存在しません。', 0).format(name));
				}
				return;
			}
			if (errorLog && target === undefined) {
				throw new Error(LC('パーティクル表示コマンドの対象が設定されてません。', 2) + '(ID:' + id + ')');
			}

			//make data
			var group = new ParticleGroup(eventId, id, target, tag, name, x, y);

			this._groups[id] = group;
			this._groupKeys.push(id);
			return group;
		};

		Game_Particle.prototype.particleGroupClear = function (id, quit) {
			if (quit === 'false' || quit === 'f') {
				quit = false;
			} else if (quit === 'true' || quit === 't') {
				quit = true;
			} else {
				quit = supplementDef(false, quit);
			}

			var data = this._groups[id];
			if (data) {
				data.repeat = -1;
				if (quit) {
					var index = this._groupKeys.indexOf(id);
					this._groupKeys.splice(index, 1);
					delete this._groups[id];
				}
			}
		};


		var _Game_Particle_update = Game_Particle.prototype.update;
		Game_Particle.prototype.update = function () {
			_Game_Particle_update.call(this);

			var keys = this._groupKeys;
			var length = keys.length;
			var destroyed = false;
			for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
				var key = keys[i];
				var group = this._groups[key];
				if (group && !group.destroy) {
					group.update(this);
				}

				if (!group || group.destroy) {
					keys.splice(i, 1);
					delete this._groups[key];
				}
			}
		};

		/* auto remove
		===================================*/
		var _Game_Particle_removeCharacterTargetParticles = Game_Particle.prototype.removeCharacterTargetParticles;
		Game_Particle.prototype.removeCharacterTargetParticles = function () {
			this._removeCharacterTargetParticles(this._groupKeys, this._groups);

			_Game_Particle_removeCharacterTargetParticles.call(this);
		};
		var _Game_Particle_removePartyTargetParticles = Game_Particle.prototype.removePartyTargetParticles;
		Game_Particle.prototype.removePartyTargetParticles = function () {
			this._removePartyTargetParticles(this._groupKeys, this._groups);

			_Game_Particle_removePartyTargetParticles.call(this);
		};

		var _Game_Particle_removeParticlesWithTargetTypes = Game_Particle.prototype.removeParticlesWithTargetTypes;
		Game_Particle.prototype.removeParticlesWithTargetTypes = function (types) {
			this._removeParticlesWithTargetTypes(types, this._groupKeys, this._groups);

			_Game_Particle_removeParticlesWithTargetTypes.call(this, types);
		};

		var _Game_Particle_clearTargetsParticles = Game_Particle.prototype.clearTargetsParticles;
		Game_Particle.prototype.clearTargetsParticles = function (targetTypes, targetId, keys, allData) {
			_Game_Particle_clearTargetsParticles.call(this, targetTypes, targetId, this._groupKeys, this._groups);
			_Game_Particle_clearTargetsParticles.call(this, targetTypes, targetId, keys, allData);
		};


		//=============================================================================
		// ParticleGroup
		//=============================================================================
		Game_Particle.ParticleGroup = ParticleGroup;

		ParticleGroup.prototype.initialize = function (eventId, id, target, tag, name, x, y) {
			var particleData = $gameScreen._particle.particleData(eventId, id, target, name, undefined, undefined, undefined, undefined, true);

			this.id = id;
			this.eventId = eventId;
			this.target = target;
			this.targetType = particleData.targetType;
			this.targetId = particleData.targetId;
			this.name = name;
			this.replacedName = name.replace('/h', '');
			this.tag = tag || ('group:' + id);
			this.x = x;
			this.y = y;

			this.params = {};

			this._stop = false;
			this._clear = false;
			this.quit = false;
			this.interval = 0;

			this.exceed = null;

			this.list = null;
			this.repeat = 0;

			this.destroy = false;

			this._index = -1;
			this._wait = 0;

			this.applyData();
		};
		ParticleGroup.prototype.applyData = function () {
			var data = this.data();
			this.repeat = data.repeat;

			if (data.list.length === 0) {
				data.list = [''];
			}
			this.list = data.list;
		}
		ParticleGroup.prototype.data = function () {
			return Game_Particle.groupData(this);
		};
		ParticleGroup.idSuffix = function (id) {
			return '/GROUP:' + id
		};

		Object.defineProperty(ParticleGroup.prototype, 'clear', {
			get: function () {
				return this._clear
			}, set: function (value) {
				this._clear = value;
				if (value) {
					this.repeat = -1;
					if (this.stop) {
						this.processQuit();
					}
				}
			},
			configurable: true
		});
		Object.defineProperty(ParticleGroup.prototype, 'stop', {
			get: function () {
				return this._stop
			}, set: function (value) {
				this._stop = value;
				if (value) {
					if (this.clear) {
						this.processQuit();
					}
				}
			},
			configurable: true
		});
		ParticleGroup.prototype.processQuit = function (particle = $gameScreen._particle) {
			var index = particle._groupKeys.indexOf(this.id);
			if (index >= 0) {
				particle._groupKeys.splice(index, 1);
				delete particle._groups[this.id];
			}
		};


		function activeInterpreter() {
			var interpreter;
			if ($gameTroop.inBattle() && $gameTroop.isEventRunning()) {
				interpreter = $gameTroop._interpreter;
			} else if ($gameMap.isEventRunning()) {
				interpreter = $gameMap._interpreter;
			} else {
				return null;
			}

			while (interpreter._childInterpreter) {
				interpreter = interpreter._childInterpreter;
			}
			return interpreter;
		};

		ParticleGroup.processParticleSubCommand = function (args) {
			if (baseParameters.commandNames.contains(args[0])) {
				args.shift();
			}
			return args[0];
		}

		ParticleGroup.prototype.update = function (particle) {
			if (this._wait > 0) {
				this._wait -= 1;
				return;
			}

			var list = this.data().list;
			var length = list.length;

			var suffix = ParticleGroup.idSuffix(this.id);
			$gameScreen._particle.addAutoIdSuffix(suffix);

			var interpreter = activeInterpreter();
			while (this._index < length - 1 && this._wait <= 0) {
				this._index = (this._index + 1) | 0

				var command = list[this._index];

				var args = command.split(' ');
				var isPlayCommands = false;

				ParticleGroup.processParticleSubCommand(args);

				if (!this.isCommandValid(command, this.id, this.replacedName, args)) {
					break;
				}

				switch (args[0].toLowerCase()) {
					case 'wait':
						this._wait = Number(args[1]);
						break;


					case 'edit':
					case 'set':
					case 'play':
						isPlayCommands = true;
						var tag = particle.extractTagRegister(args);
						tag = tag || this.tag;

						if (tag) {
							if (!tag.contains('tag:')) {
								tag = 'tag:' + tag;
							}
							args.push(tag);
						}
						if (args[2] === 'target') {
							args[2] = this.target;
						}
						if (/^_auto:[0-9]+$/.test(args[1])) {
							args[1] += ':' + this.replacedName + '/h';
						}
						if (args[3] && /^_auto:[0-9]+$/.test(args[3])) {
							args[3] += ':' + this.replacedName + '/h';
						}

						break;
					case 'repeat':
					case 'on':
					case 'off':
					case 'clear':
					case 'update':
					case 'animate':
					case 'move':
					case 'exceed':
					case 'screenLoop':
					case 'loop':
					case 'filter':
					case 'max':
						if (/^_auto:[0-9]+$/.test(args[1])) {
							args[1] += ':' + this.replacedName + '/h';
						}
						break;

					case 'sub':
						if (/_auto:[0-9]+$/.test(args[2])) {
							args[2] += ':' + this.replacedName + '/h';
						}
						if (/_sub:[0-9]+$/.test(args[3])) {
							args[3] += ':' + this.replacedName + '/h';
						}
						break;
				}
				if (this._wait > 0) {
					break;
				}

				particle.pluginCommand(interpreter, args, this.eventId);
				if (isPlayCommands) {
					if (this.x || this.y) {
						particle.particleUpdate([args[1], 'pos', this.x || 0, this.y || 0]);
					}
				}
			}

			$gameScreen._particle.removeAutoIdSuffix(suffix);

			if (this._wait <= 0 && this._index >= length - 1) {
				if (this.repeat >= 0) {
					this._wait = this.repeat;
					this._index = -1;
				} else {
					this.destroy = true;
				}
			}
		};


		//=============================================================================
		// command validation
		//=============================================================================
		ParticleGroup.prototype.isCommandValid = function (command, id, name, args) {
			return ParticleGroup.isCommandValid(command, id, name, args);
		};
		ParticleGroup.isCommandValid = function (command, id, groupName, args = null) {
			if (!command) return false;

			args = args || command.split(' ');
			var sub = ParticleGroup.processParticleSubCommand(args);
			if (!sub) {
				return false;
			}

			sub = sub.toLowerCase();

			//check sub commands
			switch (sub) {
				case 'wait':
					return !isNaN(args[1]) && Number(args[1]) >= 0
				case 'set':
				case 'play':
				case 'edit':
					return this._isPlayCommandValid(id, groupName, sub, args);

				case 'repeat':
				case 'on':
				case 'off':
				case 'clear':
				case 'update':
				case 'animate':
				case 'move':
				case 'exceed':
				case 'screenLoop':
				case 'loop':
				case 'filter':
				case 'max':
					if (!this.isCommandTargetIdValid(id, groupName, args[1])) {
						return false;
					}
					break;
				case 'sub':
					if (/_auto:[0-9]+$/.test(args[2])) {
						args[2] += ':' + groupName + '/h';
					}
					if (args[1] !== 'edit') {
						var name = args[3];
						if (/^_sub:[0-9]+$/.test(name)) {
							name += ':' + groupName + '/h';
						}
						if (!$dataTrpParticles[name] && !$dataTrpParticlePreset[name]) {
							return false;
						}
					}
					if (!this.isCommandTargetIdValid(id, groupName, args[2])) {
						return false;
					}
					break;


				case 'flash':
				case 'shake':
				case 'se':
					return true;

				case 'group':
					return false;
				default:
					return false;
			}

			return true;
		};

		ParticleGroup.isCommandTargetIdValid = function (groupId, groupName, id) {
			if (id === undefined) {
				return false;
			}
			if (id === '' || id === ' ') {
				return false;
			}
			if (/_auto:[0-9]+$/.test(id)) {
				id += ':' + groupName + '/h';
			}

			if (!id.contains('/GROUP:')
				&& id !== 'all'
				&& id.indexOf('all:') !== 0
				&& id.indexOf('tag:') !== 0) {
				id += ParticleGroup.idSuffix(groupId);
				if (!$gameScreen._particle._data[id]) {
					return false;
				}
			}

			return true;
		};
		ParticleGroup._isPlayCommandValid = function (groupId, groupName, command, args) {
			if (args.length <= 2 || args[2] === '' || args[2] === ' ') {
				return false;
			}

			//remove tag arg
			var length = args.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var arg = args[i];
				if (arg.indexOf('tag:') === 0) {
					args = args.concat();
					args.splice(i, 1);
					break;
				}
			}

			var id = args[1];
			var target = args[2];
			var name = args[3];

			if (/^_auto:[0-9]+$/.test(id)) {
				id += ':' + groupName + '/h';
			}
			if (/^_auto:[0-9]+$/.test(name)) {
				name += ':' + groupName + '/h';
			}

			name = supplementDef(id, name) || id;

			// var eventId = this._data.eventId;
			// var data = $gameScreen._particle.particleData(eventId,id,target,name)
			// if(!data)return false;


			//check id
			if (id === '' || id === ' ') {
				return false;
			}


			//check name exists
			if (command !== 'edit') {
				if (!$dataTrpParticles[name] && !$dataTrpParticlePreset[name]) {
					return false;
				}
			}

			return true;
		};




	})();



	(function () {
		'use strict';

		var pluginName = 'TRP_Particle_FWStandAlone';



		function supplement(defaultValue, optionArg) {
			if (optionArg === undefined) {
				return defaultValue;
			}
			return optionArg;
		};
		function supplementNum(defaultValue, optionArg) {
			return Number(supplement(defaultValue, optionArg));
		};
		var _supplementDefWords = ['default', 'def', 'd'];
		function supplementDef(defaultValue, optionArg, otherWords) {
			var value = supplement(defaultValue, optionArg);

			var defTargetWords = otherWords || [];
			if (defTargetWords) {
				defTargetWords = defTargetWords.concat(_supplementDefWords);
			} else {
				defTargetWords = _supplementDefWords;
			}

			var length = defTargetWords.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var target = defTargetWords[i];
				if (value === target) {
					value = defaultValue;
					break;
				}
			}
			return value;
		};
		function supplementDefNum(defaultValue, optionArg, otherWords) {
			var value = supplementDef(defaultValue, optionArg, otherWords);
			return Number(value);
		};


		/* process parameters
		===================================*/
		var parameters = PluginManager.parameters(pluginName);
		var modes = null;
		var modeNamesForAuto = [];
		var fireworks = {};
		(() => {
			parameters = JSON.parse(JSON.stringify(parameters, function (key, value) {
				try {
					return JSON.parse(value);
				} catch (e) {
					try {
						if (value[0] === '[' || value[0] === '{') {
							if (value.contains(' ')) {
								return value;
							}
							return eval(value);
						} else if (value === '') {
							return value;
						} else if (!isNaN(value)) {
							return Number(value);
						} else if (value === 'true') {
							return true;
						} else if (value === 'false') {
							return false;
						} else {
							return value;
						}
					} catch (e) {
						return value;
					}
				}
			}));

			//variations
			parameters.defaultVariations = parameters.defaultVariations || (parameters.defaultVariationStr || '').split(',');


			//process seData
			function processSe(se) {
				if (!se) return null;
				var elems = se.name.split('/');
				var name = elems[elems.length - 1];
				if (!name) {
					return null;
				} else {
					se.name = name.split('.')[0]
				}
				return se;
			}
			for (const data of parameters.fireworks) {
				data.se = processSe(data.se);
				fireworks[data.name] = data;
			}
			parameters.defaultLaunchSe = processSe(parameters.defaultLaunchSe);
			parameters.defaultBurstSe = processSe(parameters.defaultBurstSe);

			//parallax
			parameters.parallax = parameters.parallax || '0.5,0.25';
			var parallax = parameters.parallax.split(',');
			parameters.parallaxX = Number(parallax[0]);
			parameters.parallaxY = parallax.length > 1 ? Number(parallax[1]) : Number(parallax[0]);


			//supplement mode params
			modes = parameters.modes;
			for (var i = modes.length - 1; i >= 0; i = (i - 1) | 0) {
				var mode = modes[i];
				if (!mode.name) {
					modes.splice(i, 1);
				} else {
					mode.positions = mode.positionStr ? mode.positionStr.split(',') : null;
				}
			}


			//auto mode
			parameters.defaultValidAutoModes = parameters.defaultAutoModes ? parameters.defaultAutoModes.split(',') : [];
			if (parameters.defaultValidAutoModes.length === 0) {
				for (const modeData of modes) {
					parameters.defaultValidAutoModes.push(modeData.name);
				}
			}

			parameters.fireworks = null;
		})();

		var defaultFireworks = {
			noLaunch: false,
			variations: parameters.defaultVariations,
			se: parameters.defaultBurstSe,
		};



		//=============================================================================
		// PluginManager
		//=============================================================================
		//PRAGMA: fwRegisterCommands
		//PRAGMA_END: fwRegisterCommands

		var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
		Game_Interpreter.prototype.pluginCommand = function (command, args) {
			if (command.toLowerCase() === 'fireworks' || command === '花火') {
				$gameScreen._particle.processFireworksCommand(args);
			} else {
				_Game_Interpreter_pluginCommand.call(this, command, args);
			}
		};





		//=============================================================================
		// Game_Particle
		//=============================================================================
		var Game_Particle_initialize = Game_Particle.prototype.initialize;
		Game_Particle.prototype.initialize = function () {
			Game_Particle_initialize.call(this);
			this._fireworks = null;
		};
		var Game_Particle_update = Game_Particle.prototype.update;
		Game_Particle.prototype.update = function () {
			Game_Particle_update.call(this);
			if (this._fireworks) {
				if (!this._fireworks.update()) {
					this._fireworks = null;
				}
			}
		};

		Game_Particle.prototype.processFireworksCommand = function (args) {
			var command = args.shift();
			switch (command.toLowerCase()) {
				case 'start':
				case '開始':
					this.startFireworksMode.apply(this, args);
					break;
				case 'reserve':
				case '予約':
					this.reserveFireworksMode.apply(this, args);
					break;
				default:
					if (this._fireworks) {
						this._fireworks.processCommand(command, args);
					}
			}
		};

		Game_Particle.prototype.startFireworksMode = function (mode, duration, variationStr) {
			if (!this._fireworks) {
				this._fireworks = new Game_Fireworks();
			}

			mode = supplementDef('auto', mode);
			duration = supplementDefNum(-1, duration);
			variationStr = supplementDef('', variationStr);

			this._fireworks.start(mode, duration, variationStr);
		};
		Game_Particle.prototype.reserveFireworksMode = function (mode, duration, variationStr, startWait) {
			if (!this._fireworks) {
				this._fireworks = new Game_Fireworks();
			}

			mode = supplementDef('auto', mode);
			duration = supplementDefNum(-1, duration);
			variationStr = supplementDef('', variationStr);
			startWait = supplementDefNum(-1, startWait);

			this._fireworks.reserve(mode, duration, variationStr, startWait);
		};




		//=============================================================================
		// Game_Fireworks
		//=============================================================================
		Game_Fireworks.BASE_NAME = 'fw_base';


		Game_Fireworks.prototype.initialize = function () {
			this._end = false;
			this._active = false;
			this._nextCount = 0;
			this._uid = 0;
			this._launchStack = [];
			this._modeStack = [];

			this._mode = '';
			this._variations = null;

			this._validAutoModes = null;
			this._autoModeVariationStr = '';

			this._reservedModes = [];
			this._modeCount = 0;
		};

		Game_Fireworks.prototype.processCommand = function (command, args) {
			switch (command.toLowerCase()) {
				case 'clear':
				case 'クリア':
					this._modeStack.length = 0;
					break;

				case 'end':
				case '終了':
					this.end();
					break;
			}
		};

		Game_Fireworks.prototype.reserve = function (mode = '', duration = -1, variationStr, startWait = -1) {
			if (!this._mode || this._modeCount <= 0) {
				this.start(mode, duration, variationStr);
				return;
			}

			this._modeStack.push({
				mode: mode,
				duration: duration,
				variationStr: variationStr,
				startWait: startWait,
			});
		}
		Game_Fireworks.prototype.start = function (mode = '', duration = -1, variationStr, startWait = -1) {
			this._active = true;
			this._validAutoModes = null;
			this._autoModeVariationStr = '';
			this._end = false;

			if (!mode || mode.indexOf('auto') === 0) {
				//clear stack after auto
				this._modeStack.length = 0;

				if (mode && mode.contains(':')) {
					this._validAutoModes = mode.substring(5).split(',');
				}
				this._autoModeVariationStr = variationStr;
				this.exceedMode(duration, variationStr);
			} else {
				this.changeMode(mode, duration, variationStr, startWait);
			}

			if (this._mode !== 'wait' && this._nextCount <= 0 && !this._end) {
				this.launch();
			}
		};
		Game_Fireworks.prototype.end = function () {
			this._end = true;
			this._mode = '';
			this._modeStack.length = 0;
			this._nextCount = 0;
			this._modeCount = 0;
		};


		//=============================================================================
		// Mode
		//=============================================================================
		Game_Fireworks.prototype.exceedMode = function (duration = -1, variationStr = this._autoModeVariationStr) {
			var mode;
			if (this._modeStack.length > 0) {
				var stack = this._modeStack.shift();
				mode = stack.mode;
				duration = stack.duration;
				variationStr = stack.variationStr;
				var startWait = stack.startWait;
				this.start(mode, duration, variationStr, startWait);
			} else {
				var validModes = this._validAutoModes || parameters.defaultValidAutoModes;
				if (validModes.length === 0) {
					this.end();
					return;
				}

				//auto mode
				if (validModes.length === 1) {
					mode = validModes[0];
				} else {
					while (!mode || mode === this._mode) {
						mode = validModes[Math.randomInt(validModes.length)];
					}
				}

				if (mode.contains(':')) {
					var elems = mode.split(':');
					mode = elems[0];
					variationStr = elems[1];
				}
				this.changeMode(mode, duration, variationStr);
			}
		};

		Game_Fireworks.prototype.changeMode = function (mode, duration = -1, variationStr, startWait = -1) {
			var lastModeData = this.modeData();
			if (mode === 'end' || mode === '終了') {
				this.end();
				return;
			}

			this._mode = mode;
			this._nextCount = 0;
			this._variations = variationStr ? variationStr.split(',') : null;

			if (mode !== 'wait') {
				var modeData = this.modeData();
				if (!modeData) {
					throw new Error('モード名「' + mode + '」の設定が存在しません');
				}
				if (duration < 0) {
					duration = modeData.defaultSec;
				}
			}

			this._modeCount = Math.ceil(duration * 60) || 1;

			if (startWait >= 0) {
				this._modeCount += startWait;
				this._nextCount += startWait;
			} else if (lastModeData && lastModeData.endWaitSec) {
				var delay = Math.ceil(lastModeData.endWaitSec * 60)
				this._modeCount += delay;
				this._nextCount += delay;
			}
		};

		Game_Fireworks.prototype.modeData = function (target = this._mode) {
			var length = modes.length;
			for (var i = 0; i < length; i = (i + 1) | 0) {
				var mode = modes[i];
				if (mode.name === target) {
					return mode;
				}
			}
			return null;
		};




		//=============================================================================
		// Update
		//=============================================================================
		Game_Fireworks.prototype.update = function () {
			if (!this._active) return true;

			if (!this._end) {
				if (this._mode !== 'wait' && this._nextCount > 0) {
					this._nextCount -= 1;
					if (this._nextCount <= 0) {
						this.launch();
					}
				}
				if (this._modeCount > 0) {
					this._modeCount -= 1;
					if (this._modeCount <= 0) {
						this.exceedMode();
					}
				}
			}

			for (var i = this._launchStack.length - 1; i >= 0; i = (i - 1) | 0) {
				var stack = this._launchStack[i];
				stack.fr -= 1;
				if (stack.fr <= 0) {
					this._launchStack.splice(i, 1);
					this.burst(stack);
				}
			}

			if (this._end && this._launchStack.length === 0) {
				return false;
			}
			return true;
		};



		Game_Fireworks.BASE_DATA = null;
		Game_Fireworks.prototype.fireworks = function (name) {
			return fireworks[name] || defaultFireworks;
		};

		Game_Fireworks.prototype.launch = function () {
			var mode = this.modeData();
			this._nextCount = mode.minInterval + Math.randomInt(mode.maxInterval - mode.minInterval + 1);

			var fireworksName = mode.ids[Math.randomInt(mode.ids.length)];
			var fireworks = this.fireworks(fireworksName);

			var variations;
			var modeVariations = this._variations || mode.variations;
			if (modeVariations === '' || (modeVariations && modeVariations.length === 0)) {
				modeVariations = parameters.defaultVariations;
			}

			if (modeVariations.length > 0 && modeVariations[0] !== 'none') {
				variations = fireworks.variations;
				if (!variations || variations.length === 0) {
					variations = parameters.defaultVariations;
				}
				if (modeVariations.length > 0) {
					variations = variations.concat();
					variations.push('default');
					variations.push('def')

					var length = variations.length;
					for (var i = length - 1; i >= 0; i = (i - 1) | 0) {
						if (!modeVariations.contains(variations[i])) {
							variations.splice(i, 1);
						}
					}
				}
			}


			var dyRange = 0.01 * (mode.dyRange >= 0 ? mode.dyRange : parameters.defaultDyRange);

			var positions = mode.positions;
			var xPos;
			if (!positions || positions.length === 0) {
			} else if (positions.length === 1) {
				xPos = Number(positions[0]);
			} else if (!mode.launchAtSame) {
				xPos = Number(positions[Math.random(positions.length)]);
			} else {
				var length = positions.length;
				for (var i = 0; i < length; i = (i + 1) | 0) {
					xPos = Number(positions[i]);
					this._launch(xPos, dyRange, variations, fireworksName);
				}
				return;
			}

			this._launch(xPos, dyRange, variations, fireworksName);
		};

		Game_Fireworks.prototype._launch = function (xPos, dyRange = 0, variations, fireworksName) {
			if (isNaN(xPos)) {
				xPos = (1 + 8 * Math.random())
			}

			var fireworks = this.fireworks(fireworksName);


			if (variations && variations[0] !== 'none') {
				var variation = variations[Math.randomInt(variations.length)];
				if (variation !== 'default' && variation !== 'def') {
					if (variation.indexOf('_') !== 0) {
						fireworksName += '_';
					}
					fireworksName += variation;
				}
			}

			//prepare launch particle
			var uid = this._uid++;
			var name;

			if (fireworks.noLaunch) {
				name = fireworksName;
			} else {
				name = Game_Fireworks.BASE_NAME;
			}
			var id = name + '-' + uid;

			var bx = Graphics.boxWidth * (-0.5 + xPos / 10);
			var dy = dyRange * (-0.5 + Math.random()) * Graphics.boxHeight;
			var by = Graphics.boxHeight / 2 + dy;
			if (fireworks.noLaunch) {
				//update position(x)
				if (Game_Particle.groupDataWithName(name)) {
					$gameScreen._particle.particleGroupSet(0, id, 'weather:' + parameters.parallax, '', name, bx, by);
				} else {
					$gameScreen._particle.particlePlay(0, id, 'weather:' + parameters.parallax, name);
					$gameScreen._particle.particleUpdate([id, 'pos', bx, by]);
				}
			} else {
				$gameScreen._particle.particlePlay(0, id, 'weather:' + parameters.parallax, name, 'back');
				//update position(x)
				$gameScreen._particle.particleUpdate([id, 'pos', bx, by])
			}


			if (fireworks.noLaunch) {
				this.tryPlaySe(fireworks.se);
				return;
			}

			//launch se
			this.tryPlaySe(parameters.defaultLaunchSe);

			//update lifetime(y)
			var config = Game_Particle.BASE_DATA;
			if (!config) {
				config = Game_Fireworks.BASE_DATA = Game_Particle.configDataWithName(name);
			}
			var lifetime = config.lifetime.min;
			var frame = lifetime * 60;
			var x = bx;
			var y = Graphics.boxHeight / 2 - parameters.launchHeight + dy;

			this._launchStack.push({
				fr: frame,
				uid: uid,
				mode: this._mode,
				name: fireworksName,
				x: x,
				y: y,
				dx: $gameMap._displayX,
				dy: $gameMap._displayY,
			})
		};
		Game_Fireworks.prototype.tryPlaySe = function (se) {
			if (!se || se.name === 'none') return;

			var volume = se.volume;
			var pitch = se.pitch;
			if (parameters.seVolumeRange) {
				se.volume += parameters.seVolumeRange * (-1 + 2 * Math.random());
			}
			if (parameters.sePitchRange) {
				se.pitch += parameters.sePitchRange * (-1 + 2 * Math.random());
			}
			AudioManager.playSe(se);
			se.volume = volume;
			se.pitch = pitch;
		};

		Game_Fireworks.prototype.burst = function (data) {
			var mode = this.modeData(data.mode);
			var fireworks = this.fireworks(data.name);

			var dx = parameters.parallaxX * ($gameMap._displayX - data.dx) * 48;
			var dy = parameters.parallaxY * ($gameMap._displayY - data.dy) * 48;
			var x = (data.x - dx);
			var y = (data.y - dy);
			var name = data.name;
			var id = name + '-' + data.uid;
			if (Game_Particle.groupDataWithName(name)) {
				$gameScreen._particle.particleGroupSet(0, id, 'weather:' + parameters.parallax, '', name, x, y);
			} else {
				$gameScreen._particle.particlePlay(0, id, 'weather:' + parameters.parallax, name);
				$gameScreen._particle.particleUpdate([id, 'pos', x, y]);
			}


			this.tryPlaySe(fireworks.se || parameters.defaultBurstSe);
		};









	})();
	//PRAGMA_END: SRC



	var $dataTrpParticles = [];
	var $dataTrpParticleGroups = [];
	for (var i = DataManager._databaseFiles.length - 1; i >= 0; i = (i - 1) | 0) {
		var data = DataManager._databaseFiles[i];
		if (data && data.name === '$dataTrpParticles') {
			DataManager._databaseFiles.splice(i, 1);
		} else if (data && data.name === '$dataTrpParticleGroups') {
			DataManager._databaseFiles.splice(i, 1);
		}
	}



})();