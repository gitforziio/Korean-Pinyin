
function stringToEntity(str, radix) {
    let arr = str.split('');
    radix = radix || 0;
    let tmp = arr.map( item => `&#${( radix ? 'x' + item.charCodeAt(0).toString(16) : item.charCodeAt(0) )};` ).join('');
    // console.log(`'${str}' 转实体为 '${tmp}'`);
    return tmp;
}

function entityToString(entity) {
    let entities = entity.split(';');
    entities.pop();
    let tmp = entities.map( item => String.fromCharCode( item[2] === 'x' ? parseInt( item.slice(3), 16 ) : parseInt(item.slice(2)) ) ).join('');
    // console.log(`'${entity}' 转字符串为 '${tmp}'`);
    return tmp;
}

function charToCode(char, radix) {
    let arr = [char[0]];
    radix = radix || 0;
    let tmp = arr.map( item => `${( radix ? 'x' + item.charCodeAt(0).toString(16) : item.charCodeAt(0) )}` );
    // console.log(`'${str}' 转实体为 '${tmp}'`);
    return tmp;
}

function krnCharSplit(char) {
    var cd = +charToCode(char);
    // var ffuu_list = `㄰ㄱㄲㄳㄴㄵㄶㄷㄸㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅄㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ`;//辅音数量=31
    var qqii_list = `ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ`;//起音数量=区数=19
    var yuan_list = `ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ`;//元音数量=区内行数=21
    var shou_list = `㄰ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ`;//收音数量=列数=28
    // var ting_list = `ㅥㅦㅧㅨㅩㅪㅫㅬㅭㅮㅯㅰㅱㅲㅳㅴㅵㅶㅷㅸㅹㅺㅻㅼㅽㅾㅿㆀㆁㆂㆃㆄㆅㆆㆇㆈㆉㆊㆋㆌㆍㆎ㆏`;//停用音数量=43
    if (44032 <= cd && cd <= 55203) {
        let char_order = cd - 44031;//在整个字表中的序号，从1开始
        let block_id = Math.floor(char_order / (588));//在哪个区，从0开始，即哪个起音
        let char_order_in_block = char_order % (588);
        char_order_in_block = char_order_in_block == 0 ? 588 : char_order_in_block;
        let row_id = Math.floor(char_order_in_block / 28);//在区里哪一行，从0开始，即哪个元音
        let column_id = char_order_in_block % (28)-1;//在哪一列，从0开始，即哪个收音
        let qqii = qqii_list[block_id];
        let yuan = yuan_list[row_id];
        let shou = shou_list[column_id];
        shou = shou==`㄰`?``:shou;
        console.log(`${cd},${char_order}|${block_id},${row_id},${column_id}|${qqii},${yuan},${shou}`)
        return [qqii, yuan, shou];// 整字
    } else if (12592 <= cd && cd <= 12622) {
        return [char];// 辅音
    } else if (12623 <= cd && cd <= 12643) {
        return [char];// 元音
    } else if (12644 <= cd && cd <= 12678) {
        return [char];// 停用的辅音
    } else if (12679 <= cd && cd <= 12687) {
        return [char];// 停用的元音
    } else {
        return [char];// 非韩文
    }
}

function krnStringSplit(str) {
    var lst = str.split('');
    var result = [];
    lst.forEach(char => {result.push(krnCharSplit(char))});
    return result;
}

krnStringSplit('모스크바');
