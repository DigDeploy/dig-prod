/**
 * 汎用JSメソッドのカプセル化処理
 * Copyright (c) 2019 ymsc
 */

// 日付フォーマット
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      // 日付文字列のフォーマットを統一（"-"を"/"に、"T"をスペースに、ミリ秒部分を削除）
      time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
    }
    // 10桁のタイムスタンプ（秒）を13桁（ミリ秒）に変換
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay() // 曜日（0:日曜日、1:月曜日…6:土曜日）
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday（getDay()は日曜日に0を返す）
    if (key === 'a') { return ['日', '月', '火', '水', '木', '金', '土'][value] }
    // 1桁の値の場合、先頭に0を補完
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// フォームリセット
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 日付範囲の追加
export function addDateRange(params, dateRange, propName) {
  let search = params;
  // paramsの構造を確認（オブジェクト型であることを保証）
  search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
  // dateRangeを配列型に統一
  dateRange = Array.isArray(dateRange) ? dateRange : [];
  if (typeof (propName) === 'undefined') {
    // propNameが指定されていない場合は、デフォルトのbeginTime/endTimeを使用
    search.params['beginTime'] = dateRange[0];
    search.params['endTime'] = dateRange[1];
  } else {
    // propNameが指定されている場合は、begin+propName/end+propNameの形式でキーを作成
    search.params['begin' + propName] = dateRange[0];
    search.params['end' + propName] = dateRange[1];
  }
  return search;
}

// データディクショナリの表示（単一値）
export function selectDictLabel(datas, value) {
  if (value === undefined) {
    return "";
  }
  var actions = [];
  // ディクショナリデータから対応するラベルを検索
  Object.keys(datas).some((key) => {
    if (datas[key].value == ('' + value)) {
      actions.push(datas[key].label);
      return true; // 検索成功後、ループを終了
    }
  })
  // ラベルが見つからない場合は、元の値を返す
  if (actions.length === 0) {
    actions.push(value);
  }
  return actions.join('');
}

// データディクショナリの表示（文字列・配列）
export function selectDictLabels(datas, value, separator) {
  if (value === undefined || value.length === 0) {
    return "";
  }
  // 配列型の値を文字列に変換
  if (Array.isArray(value)) {
    value = value.join(",");
  }
  var actions = [];
  // 区切り文字を設定（未指定の場合はカンマをデフォルト）
  var currentSeparator = undefined === separator ? "," : separator;
  var temp = value.split(currentSeparator);
  // 各値に対応するラベルを検索
  Object.keys(value.split(currentSeparator)).some((val) => {
    var match = false;
    Object.keys(datas).some((key) => {
      if (datas[key].value == ('' + temp[val])) {
        actions.push(datas[key].label + currentSeparator);
        match = true;
      }
    })
    // ラベルが見つからない場合は、元の値を追加
    if (!match) {
      actions.push(temp[val] + currentSeparator);
    }
  })
  // 最後の区切り文字を削除して返す
  return actions.join('').substring(0, actions.join('').length - 1);
}

// 文字列フォーマット（プレースホルダ：%s）
export function sprintf(str) {
  var args = arguments, flag = true, i = 1;
  str = str.replace(/%s/g, function () {
    var arg = args[i++];
    // 引数が不足している場合はフラグをfalseに設定
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  // 引数が正常に置換された場合はフォーマット後の文字列を返す
  return flag ? str : '';
}

// 文字列の変換（undefined、nullなどを空文字に変換）
export function parseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

// データマージ（再帰的）
export function mergeRecursive(source, target) {
  for (var p in target) {
    try {
      // ターゲットのプロパティがオブジェクトの場合は、再帰的にマージ
      if (target[p].constructor == Object) {
        source[p] = mergeRecursive(source[p], target[p]);
      } else {
        // オブジェクト以外の場合は、ターゲットの値で上書き
        source[p] = target[p];
      }
    } catch (e) {
      // エラー発生時は、ターゲットの値で上書き
      source[p] = target[p];
    }
  }
  return source;
};

/**
 * ツリー構造データの構築
 * @param {*} data データソース
 * @param {*} id idフィールド デフォルト 'id'
 * @param {*} parentId 親ノードフィールド デフォルト 'parentId'
 * @param {*} children 子ノードフィールド デフォルト 'children'
 */
export function handleTree(data, id, parentId, children) {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  var childrenListMap = {}; // 親ノードIDをキーとした子ノードリストのマップ
  var nodeIds = {}; // ノードIDをキーとしたノードオブジェクトのマップ
  var tree = []; // 最終的なツリーデータ

  // 1. データを走査し、子ノードマップとノードマップを作成
  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  // 2. ルートノード（親ノードが存在しないノード）を抽出
  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  // 3. 再帰的に子ノードをルートノードに紐づけ
  for (let t of tree) {
    adaptToChildrenList(t);
  }

  // 子ノードを親ノードに追加する再帰関数
  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    // 子ノードが存在する場合は、再帰的に処理
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}

/**
* パラメータ処理（URLクエリパラメータ形式に変換）
* @param {*} params 処理対象のパラメータ
*/
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof (value) !== "undefined") {
      // パラメータの値がオブジェクトの場合は、ネストした形式（propName[key]=value）に変換
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
            let paramsKey = propName + '[' + key + ']';
            var subPart = encodeURIComponent(paramsKey) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        // オブジェクト以外の場合は、通常のキーバリュー形式に変換
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result
}

// Blob形式かどうかの検証（BlobはJSON解析不可）
export async function blobValidate(data) {
  try {
    const text = await data.text();
    JSON.parse(text); // JSONとして解析できる場合は、Blobではない
    return false;
  } catch (error) {
    // JSON解析に失敗した場合は、Blobと判断
    return true;
  }
}

// ユニークIDの取得（ランダム文字列）
export function generateUuid() {
  return Math.random().toString(36).substr(3, 10)
}

// ページネーション行番号の処理（全ページで連番にする）
export function transLineNo(rows, pagination) {
  // 行番号のオフセット（前ページの総件数）
  let offset = 0;
  // ページネーションパラメータが存在する場合は、オフセットを計算
  if (pagination) {
    offset = (pagination.pageNum - 1) * pagination.pageSize;
  }
  // 各行に連番の行番号を設定
  rows.forEach((item, index) => {
    item.lineNo = offset + index + 1
  });
  return rows;
}

// テーブルヘッダーに必須マーク（赤い*）を追加
export function addRedStar(h, {column}) {
  return [h('span', {style: 'color: red'}, '*'), h('span', ' ' + column.label)]
}

// テーブルの動的高さ計算（ウィンドウ高さから指定値を引いた値を返す）
export function tableHeight(num) {
  return (window.innerHeight - num) + 'px';
}