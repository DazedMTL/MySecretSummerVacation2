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
 * @param time
 * @text 出現時間ミリ秒
 * @type number
 * @min 0
 * @desc ノーツが出現するタイミングを開始からのミリ秒で指定します。
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
 */