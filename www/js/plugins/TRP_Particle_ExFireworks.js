//=============================================================================
// TRP_Particle_ExFireworks.js
//=============================================================================
/*:
 * @author Thirop
 * @pluguindesc 花火プラグイン(TRP_Particle<for MV>用)
 * @help
 * 【更新履歴】
 * 1.0.4 <2022/02/14> セーブ・ロード時の不具合修正
 * 
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
//PRAGMA_END: fwHeader


//PRAGMA: defGameFireworks
function Game_Fireworks() {
    this.initialize.apply(this, arguments);
};
//PRAGMA_END: defGameFireworks

(function () {
    'use strict';

    //PRAGMA: fwPluginName
    var pluginName = 'TRP_Particle_ExFireworks';
    //PRAGMA_END: fwPluginName


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