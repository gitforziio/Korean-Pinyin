
// function stringToEntity(str, radix) {
//     let arr = str.split('');
//     radix = radix || 0;
//     let tmp = arr.map( item => `&#${( radix ? 'x' + item.charCodeAt(0).toString(16) : item.charCodeAt(0) )};` ).join('');
//     // console.log(`'${str}' 转实体为 '${tmp}'`);
//     return tmp;
// }

// function entityToString(entity) {
//     let entities = entity.split(';');
//     entities.pop();
//     let tmp = entities.map( item => String.fromCharCode( item[2] === 'x' ? parseInt( item.slice(3), 16 ) : parseInt(item.slice(2)) ) ).join('');
//     // console.log(`'${entity}' 转字符串为 '${tmp}'`);
//     return tmp;
// }

function charToCode(char, radix) {
    let arr = [char[0]];
    radix = radix || 0;
    let tmp = arr.map( item => `${( radix ? 'x' + item.charCodeAt(0).toString(16) : item.charCodeAt(0) )}` );
    // console.log(`'${str}' 转实体为 '${tmp}'`);
    return tmp;
}

function krnCharSplit(char) {
    //
    // var ffuu_list = `㄰ㄱㄲㄳㄴㄵㄶㄷㄸㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅄㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ`;  // 辅音数量=31
    var qqii_list = `ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ`;  // 起音数量=区数=19
    var yuan_list = `ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ`;  // 元音数量=区内行数=21
    var shou_list = `㄰ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ`;  // 收音数量=列数=28
    // var ting_list = `ㅥㅦㅧㅨㅩㅪㅫㅬㅭㅮㅯㅰㅱㅲㅳㅴㅵㅶㅷㅸㅹㅺㅻㅼㅽㅾㅿㆀㆁㆂㆃㆄㆅㆆㆇㆈㆉㆊㆋㆌㆍㆎ㆏`;  // 停用音数量=43
    //
    var cd = +charToCode(char);
    //
    if (44032 <= cd && cd <= 55203) {
        //
        let char_order = cd - 44031;  // 在整个字表中的序号，从1开始
        let char_order_in_block = char_order % (588);
        char_order_in_block = char_order_in_block == 0 ? 588 : char_order_in_block;
        //
        let block_id = Math.floor(char_order / (588));      // 在哪个区，从0开始，即哪个起音
        let row_id = Math.floor(char_order_in_block / 28);  // 在区里哪一行，从0开始，即哪个元音
        let column_id = char_order_in_block % (28)-1;       // 在哪一列，从0开始，即哪个收音
        //
        let qqii = qqii_list[block_id];
        let yuan = yuan_list[row_id];
        let shou = shou_list[column_id];
        // shou = shou==`㄰` ? `` : shou;
        //
        // console.log(`${cd},${char_order}|${block_id},${row_id},${column_id}|${qqii},${yuan},${shou}`)
        return [qqii, yuan, shou];  // 整字
        //
    } else if (12592 <= cd && cd <= 12622) { return [char];  // 辅音
    } else if (12623 <= cd && cd <= 12643) { return [char];  // 元音
    } else if (12644 <= cd && cd <= 12678) { return [char];  // 停用的辅音
    } else if (12679 <= cd && cd <= 12687) { return [char];  // 停用的元音
    } else { return [char];  // 非韩文
    }
    //
}

function krnStringSplit(str) {
    var lst = str.split('');
    var pre_result = [];
    lst.forEach(char => {pre_result.push(krnCharSplit(char))});
    //
    var result = [];
    var bag = [];
    pre_result.forEach(thing => {
        if (thing.length == 3 || ( thing.length == 1 && (thing[0] == ' ' || thing[0] == '\n' || thing[0] == '\r') )) {
            if (bag.length) {
                result.push([bag.join('')]);
                bag = [];
            }
            result.push(thing);
        } else {
            bag.push(thing[0]);
        }
    });
    if (bag.length) {
        result.push([bag.join('')]);
        bag = [];
    }
    //
    return result;
}

// krnStringSplit('모스크바');

function krnToPinYin(str) {
    let qqii_array = [
        ['ㄱ', 'k'],
        ['ㄲ', 'gg'],
        ['ㄴ', 'n'],
        ['ㄷ', 't'],
        ['ㄸ', 'dd'],
        ['ㄹ', 'l'],
        ['ㅁ', 'm'],
        ['ㅂ', 'p'],
        ['ㅃ', 'bb'],
        ['ㅅ', 'cs'],
        ['ㅆ', 'ss'],
        ['ㅇ', '-'],
        ['ㅈ', 'cc'],
        ['ㅉ', 'zh'],
        ['ㅊ', 'ch'],
        ['ㅋ', 'kh'],
        ['ㅌ', 'th'],
        ['ㅍ', 'ph'],
        ['ㅎ', 'h'],
    ];
    let yuan_array = [
        ['ㅏ', 'a'],
        ['ㅐ', 'ae'],
        ['ㅑ', 'ia'],
        ['ㅒ', 'ea'],
        ['ㅓ', 'r'],
        ['ㅔ', 're'],
        ['ㅕ', 'ir'],
        ['ㅖ', 'er'],
        ['ㅗ', 'o'],
        ['ㅘ', 'oa'],
        ['ㅙ', 'oae'],
        ['ㅚ', 'oi'],
        ['ㅛ', 'io'],
        ['ㅜ', 'u'],
        ['ㅝ', 'ur'],
        ['ㅞ', 'ure'],
        ['ㅟ', 'ui'],
        ['ㅠ', 'iu'],
        ['ㅡ', 'e'],
        ['ㅢ', 'ei'],
        ['ㅣ', 'i'],
    ];
    let shou_array = [
        ['㄰', ''],
        ['ㄱ', 'g-'],
        ['ㄲ', 'gg-'],
        ['ㄳ', 'gcs-'],
        ['ㄴ', 'n-'],
        ['ㄵ', 'ncc-'],
        ['ㄶ', 'nh-'],
        ['ㄷ', 'd-'],
        ['ㄹ', 'l-'],
        ['ㄺ', 'lg-'],
        ['ㄻ', 'lm-'],
        ['ㄼ', 'lp-'],
        ['ㄽ', 'lcs-'],
        ['ㄾ', 'lth-'],
        ['ㄿ', 'lph-'],
        ['ㅀ', 'lh-'],
        ['ㅁ', 'm-'],
        ['ㅂ', 'b-'],
        ['ㅄ', 'bcs-'],
        ['ㅅ', 'cs-'],
        ['ㅆ', 'ss-'],
        ['ㅇ', 'ng-'],
        ['ㅈ', 'cc-'],
        ['ㅊ', 'zh-'],
        ['ㅋ', 'kh-'],
        ['ㅌ', 'th-'],
        ['ㅍ', 'ph-'],
        ['ㅎ', 'h-'],
    ];
    let qqii_map = new Map(qqii_array);
    let yuan_map = new Map(yuan_array);
    let shou_map = new Map(shou_array);
    //
    let happy = [];
    //
    let items = krnStringSplit(str);
    for (let item of items) {
        if (item.length == 3) {
            happy.push(`${qqii_map.get(item[0])}${yuan_map.get(item[1])}${shou_map.get(item[2])}`);
        } else if (item.length == 1 && item[0] == ' ') {
            happy.push('【𠒒𠈔】');
        } else if (item.length == 1 && item[0] == '\n') {
            happy.push('\n');
        } else if (item.length == 1 && item[0] == '\r') {
            console.log('\\r');
        } else {
            happy.push(`𠒒${item[0]}𠈔`);
        }
    }
    //
    let result = happy.join(` `);
    //
    result = result.trim();
    result = result.replace(/\r/g, '');
    result = result.replace(/^-/g, '');
    result = result.replace(/-$/g, '');
    result = result.replace(/ *\n */g, `\n`);
    result = result.replace(/\n-/g, '\n');
    result = result.replace(/-\n/g, '\n');
    result = result.replace(/【𠒒𠈔】 -/g, `【𠒒𠈔】 `);
    result = result.replace(/- 【𠒒𠈔】/g, ` 【𠒒𠈔】`);
    //
    result = result.replace(/^i/g, `y`);
    result = result.replace(/^u/g, `w`);
    result = result.replace(/\ni/g, `\ny`);
    result = result.replace(/\nu/g, `\nw`);
    result = result.replace(/【𠒒𠈔】 i/g, `【𠒒𠈔】 y`);
    result = result.replace(/【𠒒𠈔】 u/g, `【𠒒𠈔】 w`);
    //
    result = result.replace(/^.|【𠒒𠈔】 .|\n./g, str => str.toUpperCase());
    //
    result = result.replace(/^Y /g, `Yi `);
    result = result.replace(/^W /g, `Wu `);
    result = result.replace(/\nY /g, `\nYi `);
    result = result.replace(/\nW /g, `\nWu `);
    result = result.replace(/【𠒒𠈔】 Y /g, `【𠒒𠈔】 Yi `);
    result = result.replace(/【𠒒𠈔】 W /g, `【𠒒𠈔】 Wu `);
    //
    result = result.replace(/- y/g, `-i`);
    result = result.replace(/- w/g, `-u`);
    result = result.replace(/- -/g, `-`);
    //
    // 发音变化
    //
    result = result.replace(/cs-i/g, `-cxi`);
    result = result.replace(/ss-i/g, `-xx-i`);
    result = result.replace(/Ss-i/g, `Xx-i`);
    //
    result = result.replace(/cs-en/g, `-csen`);
    result = result.replace(/m-en/g, `-men`);
    result = result.replace(/n-en/g, `-nen`);
    //
    result = result.replace(/ng- li/g, `ng-ni`);
    result = result.replace(/n- h/g, `-nh`);
    //
    result = result.replace(/csi/g, `cxi`);
    result = result.replace(/ssi/g, `xxi`);
    result = result.replace(/Ssi/g, `Xxi`);
    //
    result = result.replace(/ p/g, ` b`);
    result = result.replace(/ bh/g, ` ph`);
    result = result.replace(/ t/g, ` d`);
    result = result.replace(/ dh/g, ` th`);
    result = result.replace(/ k/g, ` g`);
    result = result.replace(/ gh/g, ` kh`);
    result = result.replace(/ cc/g, ` cz`);
    //
    result = result.replace(/Czre 【𠒒𠈔】 K/g, `Czre 【𠒒𠈔】 G`);
    //
    // 去除连字符
    //
    result = result.replace(/n-i/g, `n y`);
    //
    result = result.replace(/ -i/g, ` y`);
    result = result.replace(/ -u/g, ` w`);
    result = result.replace(/ -/g, ` `);
    result = result.replace(/- /g, ` `);
    //
    // 收音统一化
    //
    result = result.replace(/b /g, `m `);
    result = result.replace(/p /g, `m `);
    result = result.replace(/ym /g, `yim `);
    //
    // 结束
    //
    result = result.replace(/ *【𠒒𠈔】 */g, ` `);
    result = result.replace(/𠒒|𠈔/g, ``);
    //
    return result;
}

// var s1 = krnToPinYin(`왕한: 저 사람은 누구입니까?
// 김준호: 저 사람은 양리 씨입니다.
// 왕한: 누가 옵니까?
// 김준호: 이선희 씨가 옵니다.
// 왕한: 이선희 씨의 전공은 무엇입니까?
// 김준호: 이선희 씨의 전공은 경제학입니다.`);

// var s2 = krnToPinYin(`이선희: 이것은 무엇입니까?
// 양리: 그것은 가방입니다.
// 이선희: 이 가방은 누구의 것입니까?
// 양리: 그 가방은 왕한 씨의 것입니다.
// 이선희: 저 사전도 왕한 씨의 것입니까?
// 양리: 아닙니다. 저 사전은 왕한 씨의 것이 아닙니다. 황민 씨의 사전입니다.
// 이선희: 이 컴퓨터는 누구의 것입니까?
// 양리: 그것은 제 것입니다.`);

// var s3 = krnToPinYin(`이선희: 이것은 무엇입니까?
// 양리: 그것은 가방입니다.
// 이선희: 이 가방은 누구声调符号是特大号은 왕한 씨의 것입니다.
// 이선희: 저 사전도 왕한 씨의 것입니까?
// 양리: 아닙니다. sfdghsdehe fdshshnd SEDGbs dfh DE  Hfgadn 왕한 씨의 것이 아닙니다. 황민 씨의 사전입니다.
// 이선희: 이 컴퓨터는 누구의 것입니까?
// 양리: 그것은 제 것입니다.`);

// console.log(s3);
// console.log(s2);
// console.log(s1);

