/*=============================================================================
 PluginCommonBase.js
----------------------------------------------------------------------------
 (C)2020 KADOKAWA
----------------------------------------------------------------------------
 Version(完成時に削除)
 0.0.7 2020/02/18 スキルの計算式が正常に機能しなくなる問題を修正。スクリプト中に制御文字を使用できる機能を一時的に削除
 0.0.6 2020/02/16 動的コモンイベントの機能を提供
 0.0.5 2020/02/16 全体をリファクタリング
 0.0.4 2020/02/12 パラメータの制御文字を変換しない設定を追加
 0.0.3 2020/01/28 配列やオブジェクト内の制御文字も正しく変換できるよう修正
 0.0.2 2020/01/13 MZコアスクリプトでプラグインコマンドの実行主体がGame_Interpreterに変更されたことに伴う修正
 0.0.1 2020/01/05 初版
=============================================================================*/

/*:
 * @target MZ
 * @plugindesc プラグイン解析共通基盤
 * @author トリアコンタン
 *
 * @help PluginCommonBase.js
 *
 * 本プラグインは他のプラグインから参照されることを前提としたベースプラグインです。
 * 本プラグインを導入すると様々な場面で以下の制御文字が使えるようになります。
 *
 * 利用可能な制御文字
 * \v[n]  : n番目の変数の値に変換されます。
 * \s[n]  : n番目のスイッチの値(true, false)に変換されます。
 * \ss[n] : n番目のセルフスイッチの値(true, false)に変換されます。
 *
 * 制御文字を利用可能な場面は以下の通りです。
 * ・文章の表示
 * ・メモ欄(※)
 * ・プラグインコマンド(※)
 * ・プラグインパラメータ(※)
 * ・スキルなどの説明欄
 * ・スキル、アイテムの計算式
 * ※ PluginCommonBase.jsをベースとして取り込んだプラグインのみ
 *
 * 以下は開発者向けの解説です。
 *
 * このプラグインをベースとして取り込むことで、パラメータの解析や
 * プラグインコマンド、メモ欄の取得時にパラメータ型および制御文字の変換を自動化します。
 * 制御文字の変換処理を共通化することで配下の全てのプラグインで一貫した
 * 制御文字の変換仕様を実現します。
 *
 * ・プラグインパラメータの型解析
 * プラグインパラメータを自動で型解析し変換します。
 * また、パラメータ取得時に制御文字の変換を自動で行います。
 * 以下のメソッドを呼んで戻り値を取得します。
 * 引数には必ず「document.currentScript」を指定します。
 *
 * PluginManagerEx.createParameter(document.currentScript);
 *
 * ・プラグインコマンドパラメータの型解析
 * プラグインコマンドパラメータを自動で型解析し変換します。
 * また、パラメータ取得時に制御文字の変換を自動で行います。
 * PluginManager.registerCommandの代わりに以下を使用します。
 * 引数には必ず「document.currentScript」を指定します。
 *
 * PluginManagerEx.registerCommand(document.currentScript, "command", args => {
 * });
 *
 * ・メモ欄の解析
 * 指定したオブジェクトからメモ欄情報を取得します。
 * 制御文字の変換を自動で行います。
 * 名称は複数指定することも可能です。
 *
 * PluginManagerEx.findMetaValue(obj, tagName1, tagName2...);
 *
 * ・動的コモンイベントの実行
 * 動的コモンイベントを実行できます。
 * 動的コモンイベントとは、スタック型の並列処理コモンイベントです。
 * 好きなだけ登録できて実行が終わったものから自働で破棄されます。
 * $gameMap.setupDynamicCommon(commonEventId);
 *
 * ・組み込み関数の追加
 * データベースを指定した条件で完全一致検索して一致した最初の1件を返します。
 * DataManager.searchDataItem(dataArray, columnName, columnValue);
 *
 * 全てのシステムSEを停止します。
 * AudioManager.stopAllStaticSe();
 *
 * 指定したシステムSEを停止します。
 * AudioManager.stopStaticSe(se);
 *
 */
(() => {
    'use strict';

    /**
     * PluginParam
     */
    class PluginParam {

        constructor(parameter, needParse = true) {
            if (needParse) {
                parameter = JSON.parse(JSON.stringify(parameter, this._paramReplacer));
            }
            this.setup(parameter);
        }

        setNoConvert(paramName) {
            this._noConvert.push(paramName);
        }

        setup(parameter) {
            this._parameter = parameter;
            for (const paramName in parameter) {
                if (!parameter.hasOwnProperty(paramName)) {
                    continue;
                }
                const subParam = parameter[paramName];
                if (this._isStructArray(subParam)) {
                    subParam.forEach((subParamItem, index) => {
                        subParam[index] = new PluginParam(subParamItem, false);
                    });
                } else if (this._isStruct(subParam)) {
                    parameter[paramName] = new PluginParam(subParam, false);
                }
                this._setAccessor(paramName);
            }
            this._noConvert = []
        }

        _setAccessor(paramName) {
            Object.defineProperty(this, paramName, {
                get() {
                    return this._convert(this._param(paramName), paramName);
                },
                set(value) {
                    this._parameter[paramName] = value;
                },
                configurable: true
            });
        }

        _convert(param, paramName) {
            if (this._isStruct(param) || this._isStructArray(param)) {
                return param;
            } else if (Array.isArray(param)) {
                return param.map(paramItem => this._convert(paramItem, paramName));
            }
            if (!this._noConvert.includes(paramName)) {
                return PluginManagerEx.convertVariables(param);
            } else {
                return param;
            }
        }

        _isStructArray(param) {
            return Array.isArray(param) && (param.length === 0 || this._isStruct(param));
        }

        _isStruct(param) {
            return Object.prototype.toString.call(param) === '[object Object]';
        }

        _param(name) {
            return this._parameter[name];
        }

        _paramReplacer(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }
    }

    /**
     * PluginManagerEx
     */
    class PluginManagerEx {
        static convertVariables(text, data = null) {
            if (text !== String(text)) {
                return text;
            }
            text = this.convertEscapeCharacters(text, data);
            if (text === 'true') {
                return true;
            } else if (text === 'false') {
                return false;
            } else if (Number(text) === parseFloat(text)) {
                return parseFloat(text);
            } else {
                return text;
            }
        }

        static convertEscapeCharacters(text, data = null) {
            text = TextConverter.convertEscapeCharactersBase(text, data);
            text = this.convertEscapeCharactersEx(text, data);
            text = TextConverter.convertEscapeCharactersBase(text, data);
            return text;
        }

        // Additional Escape Characters
        static convertEscapeCharactersEx(text, data = null) {
            const key = this._selfSwitchKey;
            if (!key) {
                return text;
            }
            text = text.replace(/\x1bSS\[(.+)]/gi, (_, p1) => {
                key[2] = p1;
                return $gameSelfSwitches ? $gameSelfSwitches.value(key) : '';
            });
            return text;
        }

        static createParameter(currentScript) {
            const paramText = PluginManager.parameters(this.findPluginName(currentScript));
            return new PluginParam(paramText);
        }

        static createCommandArgs(args) {
            const hasObject = Object.keys(args).some(key => {
                return args[key].match(/^[\[{].*[}\]]$/);
            });
            if (hasObject) {
                return new PluginParam(args);
            }
            const newArgs = {};
            Object.keys(args).forEach(key => {
                newArgs[key] = this.convertVariables(args[key]);
            });
            return newArgs;
        }

        static findMetaValue(object, ...nameList) {
            let metaValue = null;
            const meta = object.meta;
            if (!meta) {
                throw new Error(`Not found meta property : ${object}`)
            }
            this.generateSelfSwitchKey(object.id);
            nameList.some(name => {
                metaValue = meta.hasOwnProperty(name) ? this.convertVariables(meta[name], object) : null;
                return metaValue !== null;
            });
            return metaValue;
        }

        static findPluginName(currentScript) {
            return currentScript.src.replace(/^.*\/(.*).js$/, function () {
                return arguments[1];
            });
        }

        static registerCommand(currentScript, commandName, funcName) {
            const pluginName = this.findPluginName(currentScript);
            const key = pluginName + ":" + commandName;
            const func = typeof funcName === 'function' ? funcName : Game_Interpreter.prototype[funcName];
            if (!func) {
                throw new Error(`Not found function Game_Interpreter : ${funcName}`)
            }
            PluginManager.registerCommand(pluginName, commandName, function (args) {
                func.call(this, PluginManagerEx.createCommandArgs(args, key));
            });
        }

        static isExistPlugin(pluginName) {
            return Object.keys(PluginManager.parameters(pluginName)).length > 0;
        }

        static generateSelfSwitchKey(eventId) {
            if (!$gameMap) {
                return;
            }
            this._selfSwitchKey = [$gameMap.mapId(), eventId, null];
        }

        static findClassName(object) {
            return object.constructor.toString().replace(/function\s+(.*)\s*\([\s\S]*/m, '$1');
        }
    }
    window.PluginManagerEx = PluginManagerEx;

    class TextConverter {
        // Copy of Window_Base.prototype.convertEscapeCharacters
        static convertEscapeCharactersBase(text, data = null) {
            text = text.replace(/\\/g, "\x1b");
            text = text.replace(/\x1b\x1b/g, "\\");
            text = text.replace(/\x1bV\[(\d+)]/gi, (_, p1) =>
                $gameVariables ? $gameVariables.value(parseInt(p1)) : ''
            );
            text = text.replace(/\x1bV\[(\d+)]/gi, (_, p1) =>
                $gameVariables ? $gameVariables.value(parseInt(p1)) : ''
            );
            text = text.replace(/\x1bN\[(\d+)]/gi, (_, p1) =>
                this.actorName(parseInt(p1))
            );
            text = text.replace(/\x1bP\[(\d+)]/gi, (_, p1) =>
                this.partyMemberName(parseInt(p1))
            );
            if ($dataSystem) {
                text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
            }
            return text;
        }

        static actorName(n) {
            const actor = n >= 1 && $gameActors ? $gameActors.actor(n) : null;
            return actor ? actor.name() : '';
        }

        static partyMemberName(n) {
            const actor = n >= 1 && $gameParty ? $gameParty.members()[n - 1] : null;
            return actor ? actor.name() : "";
        }
    }

    const _PluginManager_callCommand = PluginManager.callCommand;
    PluginManager.callCommand = function (self, pluginName, commandName, args) {
        PluginManagerEx.generateSelfSwitchKey(self.eventId());
        _PluginManager_callCommand.apply(this, arguments);
    };

    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function (text) {
        text = _Window_Base_convertEscapeCharacters.apply(this, arguments);
        return PluginManagerEx.convertEscapeCharacters(text);
    };

    /**
     * Game_Map
     * Support dynamic events.
     */
    const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function () {
        _Game_Map_setupEvents.apply(this, arguments);
        this._dynamicEvents = [];
    };

    Game_Map.prototype.setupDynamicCommon = function (id) {
        const event = $dataCommonEvents[id];
        if (event) {
            this.setupDynamicInterpreter(event.list);
        }
    };

    Game_Map.prototype.setupDynamicInterpreter = function (list) {
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, 0);
        this._dynamicEvents.push(interpreter);
        this._dynamicEvents = this._dynamicEvents.filter(
            interpreter => interpreter.isRunning());
    };

    const _Game_Map_updateEvents = Game_Map.prototype.updateEvents;
    Game_Map.prototype.updateEvents = function () {
        _Game_Map_updateEvents.apply(this, arguments);
        this._dynamicEvents.forEach(interpreter => interpreter.update());
    };

    /**
     * DataManager.searchDataItem
     * Search database
     * @param dataArray target
     * @param columnName condition1
     * @param columnValue condition2
     * @returns {object} result
     */
    DataManager.searchDataItem = function (dataArray, columnName, columnValue) {
        let result = 0;
        dataArray.some(function (dataItem) {
            if (dataItem && dataItem[columnName] === columnValue) {
                result = dataItem;
                return true;
            }
            return false;
        });
        return result;
    };

    /**
     * AudioManager.stopAllStaticSe
     * Stop all system SE.
     */
    AudioManager.stopAllStaticSe = function () {
        this._staticBuffers.forEach(function (buffer) {
            buffer.stop();
        });
        this._staticBuffers = [];
    };

    /**
     * AudioManager.stopStaticSe
     * Stop system SE.
     */
    AudioManager.stopStaticSe = function (se) {
        if (!se.name) {
            return;
        }
        for (var i = 0; i < this._staticBuffers.length; i++) {
            var buffer = this._staticBuffers[i];
            if (buffer._reservedSeName === se.name) {
                buffer.stop();
                this.updateSeParameters(buffer, se);
                break;
            }
        }
    };
})();
