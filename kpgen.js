
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
        if (column_id==-1) {
            column_id = 27;
            row_id = row_id-1;
        }
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

function krnToZhuYin(str) {
    var lst = str.split('');
    var result = [];
    var krn_bag = [];
    var oth_bag = [];
    var last_thing = [];
    lst.forEach(char => {
        let thing = krnCharSplit(char);
        if (thing.length == 3) {
            if (oth_bag.length) {result.push({'deal': false, 'content':oth_bag.join('')});oth_bag = [];}
            krn_bag.push(char);
        } else if (thing.length == 1 && (thing[0] == ' ' || thing[0] == '\n' || thing[0] == '\r')) {
            if (last_thing.length == 3) {
                if (krn_bag.length) {result.push({'deal': true, 'content':krn_bag.join('')});krn_bag = [];}
                if (oth_bag.length) {result.push({'deal': false, 'content':oth_bag.join('')});oth_bag = [];}
            } else {
                if (oth_bag.length) {result.push({'deal': false, 'content':oth_bag.join('')});oth_bag = [];}
                if (krn_bag.length) {result.push({'deal': true, 'content':krn_bag.join('')});krn_bag = [];}
            }
            result.push({'deal': false, 'content':char});
        } else {
            if (krn_bag.length) {result.push({'deal': true, 'content':krn_bag.join('')});krn_bag = [];}
            oth_bag.push(char);
        }
        last_thing = thing;
    });
    if (last_thing.length == 3) {
        if (krn_bag.length) {result.push({'deal': true, 'content':krn_bag.join('')});krn_bag = [];}
        if (oth_bag.length) {result.push({'deal': false, 'content':oth_bag.join('')});oth_bag = [];}
    } else {
        if (oth_bag.length) {result.push({'deal': false, 'content':oth_bag.join('')});oth_bag = [];}
        if (krn_bag.length) {result.push({'deal': true, 'content':krn_bag.join('')});krn_bag = [];}
    }
    let zys = [];
    result.forEach(obj=>{
        if (obj.deal) {
            let py = krnToPinYin(obj.content);
            zys.push(`<ruby>${obj.content}<rp>（</rp><rt>${py}</rt><rp>）</rp></ruby>`);
        } else {
            if (obj.content=='\n') {
                zys.push(`<br/>`);
            } else if (obj.content==' ') {
                zys.push(` `);
            } else {
                zys.push(`<span>${obj.content}</span>`);
            }
        }
    });
    return `<p>${zys.join(' ')}</p>`;
}

function krnToTones(str) {
    let happy = [];
    //
    let items = krnStringSplit(str);
    for (let item of items) {
        if (item.length == 3) {
            happy.push(`${item[0]}${item[1]}${item[2]}-`);
        } else if (item.length == 1 && item[0] == ' ') {
            happy.push('👉👈');
        } else if (item.length == 1 && item[0] == '\n') {
            happy.push('\n');
        } else if (item.length == 1 && item[0] == '\r') {
            console.log('\\r');
        } else {
            let some_thing = item[0];
            some_thing = some_thing.replace(/👉/g, '「✋➡️」');
            some_thing = some_thing.replace(/👈/g, '「⬅️✋」');
            some_thing = some_thing.replace(/🔜/g, '「SOON➡️」');
            some_thing = some_thing.replace(/🔚/g, '「⬅️END」');
            happy.push(`🔜${some_thing}🔚`);
        }
    }
    //
    let result = happy.join(` `);
    //
    result = result.trim();
    result = result.replace(/\r/g, '');
    //
    let rules = [
        [/㄰-/, ''],
        // 特殊规则优先
        [/ㅂ(.)ㄼ- ㄷ/, 'ㅂ$1ㅂ ㄸ'],
        [/ㅂ(.)ㄼ- ㄴ/, 'ㅂ$1ㅁ ㄴ'],
        [/ㄴㅓㄼ- ㅈ/, 'ㄴㅓㅂ ㅉ'],
        [/ㄴㅓㄼ- ㄷ/, 'ㄴㅓㅂ ㄸ'],
        [/ㄴㅓㄼ-/, 'ㄴㅓㅂ-'],
        //
        [/ㄺ- ㄱ/, 'ㄹ ㄲ'],
        [/ㄺ- ㅎ/, 'ㄹ ㅋ'],
        [/ㄱ- ㅎ/, ' ㅋ'],
        [/ㄷ- ㅎ/, ' ㅌ'],
        //
        // 哈
        [/ㄶ-/, 'ㄴㅎ-'],
        [/ㅀ-/, 'ㄹㅎ-'],
        [/ㅎ- ㄱ/, ' ㅋ'],
        [/ㅎ- ㄷ/, ' ㅌ'],
        [/ㅎ- ㅈ/, ' ㅊ'],
        [/ㅎ- ㄱ/, ' ㅋ'],
        [/ㅎ- ㅅ/, ' ㅆ'],
        // 哈
        [/ㅎ- ㅇ/, ' ㅇ'],
        // 哈
        [/ㄴㅎ- ㄴ/, 'ㄴ ㄴ'],
        [/ㄹㅎ- ㄴ/, 'ㄹ ㄹ'],
        [/ㅎ- ㄴㅡㄴ/, 'ㄴ ㄴㅡㄴ'],
        [/ㅎ- ㄴㅔ/, 'ㄴ ㄴㅔ'],
        [/ㅎ- ㄴㅏ/, 'ㄴ ㄴㅏ'],
        [/ㅎ- ㄴㅣ/, 'ㄴ ㄴㅣ'],
        // 啪
        [/ㄿ-/, 'ㅂ-'],
        [/ㅂ- ㅎ/, ' ㅍ'],
        [/ㅄ-/, 'ㅂ-'],
        // 戳
        [/ㅈ- ㅎ/, ' ㅊ'],
        [/ㄵ- ㅎ/, 'ㄴ ㅊ'],
        [/ㄵ-/, 'ㄴ-'],
        // 嗒
        // [/ㅅ-|ㅈ-|ㅊ-|ㅌ-/, 'ㄷ-'],
        [/[ㅅㅈㅊㄷ]- ㅎ/, ' ㅌ'],
        // [/ㅆ-/, 'ㄷ-'],
        // 踢
        [/ㄷ- ㅇㅣ/, ' ㅈㅣ'],
        [/ㄷ- ㅎㅣ/, ' ㅊㅣ'],
        [/ㅌ- ㅇㅣ/, ' ㅊㅣ'],
        [/ㄾ- ㅇㅣ/, 'ㄹ ㅊㅣ'],
        //
        // ↓ 我自己加的规则
        [/ㅁ- ㅎㅣ/, ' ㅁㅣ'],
        // ↑ 我自己加的规则
        //
        // 双收音加元音
        [/ㄲ- ㅇ/, ' ㄲ'],
        [/ㅆ- ㅇ/, ' ㅆ'],
        // 双收音 转 真·双收音
        [/ㄳ-/, 'ㄱㅅ-'],
        [/ㄵ-/, 'ㄴㅈ-'],
        [/ㄺ-/, 'ㄹㄱ-'],
        [/ㄻ-/, 'ㄹㅁ-'],
        [/ㄼ-/, 'ㄹㅂ-'],
        [/ㄽ-/, 'ㄹㅅ-'],
        [/ㄾ-/, 'ㄹㅌ-'],
        [/ㄿ-/, 'ㄹㅍ-'],
        [/ㅄ-/, 'ㅂㅅ-'],
        // 转 真·双收音加元音
        [/ㄱㅅ- ㅇ/, 'ㄱ ㅆ'], // 
        [/ㄴㅈ- ㅇ/, 'ㄴ ㅈ'], // 
        [/ㄹㄱ- ㅇ/, 'ㄹ ㄱ'], // 
        [/ㄹㅁ- ㅇ/, 'ㄹ ㅁ'], // 
        [/ㄹㅂ- ㅇ/, 'ㄹ ㅂ'], // ?
        [/ㄹㅅ- ㅇ/, 'ㄹ ㅆ'], // ?
        [/ㄹㅌ- ㅇ/, 'ㄹ ㅌ'], // 
        [/ㄹㅍ- ㅇ/, 'ㄹ ㅍ'], // 
        [/ㅂㅅ- ㅇ/, 'ㅂ ㅆ'], // 
        // 其余收音加元音
        [/(ㄱ|ㄴ|ㄷ|ㄹ|ㅁ|ㅂ|ㅅ|ㅈ|ㅊ|ㅋ|ㅌ|ㅍ|ㅎ)- ㅇ/, ' $1'],
        // [/(ㄱ|ㄴ|ㄷ|ㄹ|ㅁ|ㅂ|ㅅ|ㅇ|ㅈ|ㅊ|ㅋ|ㅌ|ㅍ|ㅎ)- ㅇ/, ' $1'],
        // 一般收音发音
        // [/ㅋ-|ㄲ-/, 'ㄱ-'],
        // [/ㄱㅅ-/, 'ㄱ-'],
        // [/ㄹㄱ-/, 'ㄱ-'],
        // [/ㅍ-/, 'ㅂ-'],
        // [/ㄹㅂ-|ㄹㅅ-|ㄹㅌ-/, 'ㄹ-'],
        // [/ㄹㅁ-/, 'ㅁ-'],
        //
        [/ㄱ- (ㄴ|ㅁ)/, 'ㅇ $1'],
        [/ㄷ- (ㄴ|ㅁ)/, 'ㄴ $1'],
        [/ㅂ- (ㄴ|ㅁ)/, 'ㅁ $1'],
        //
        [/(ㅁ-|ㅇ-) ㄹ/, '$1 ㄴ'],
        [/(ㄱ-|ㅂ-) ㄹ/, '$1 ㄴ'],
        // ㄴ+ㄹ, ㄹ+ㄴ → ㄴ[ㄹ]
        [/ㄴ- ㄹ/, 'ㄹ ㄹ'],
        [/ㄹ- ㄴ/, 'ㄹ ㄹ'],
        // ㅀ,ㄾ+ㄴ ->ㄴ[ㄹ]
        // [/ㄹㅎ- ㄴ/, 'ㄹ ㄹ'],  // 前面已有，重复了。
        [/ㄹㅌ- ㄴ/, 'ㄹ ㄹ'],
        //
        //
        //
        // TODO:
        // 收音+‘ㅏ,ㅓ,ㅗ,ㅜ,ㅟ’开头的实质形态素，收音变成代表音连读
        // 但 맛있다[마딛따] [마싣따]、멋있다[머딛따] [머싣따] 都可以发
        // 넋 없다:[넉]+[업따] → [너겁따]
        // 닭 앞에:[닥]+[아페] → [다가페]
        // 값어치:값[갑] → [가버치]
    ];
    for (let rule of rules) {
        result = result.replace(new RegExp(rule[0], 'g'), rule[1]);
    }
    //
    return result.trim();
}

function krnToPinYin(str) {
    //
    let rules = [
        //
        [/\n +/, '\n'],
        [/ +\n/, '\n'],
        //
        // 收音
        // ['㄰( |-)', ' '],
        [/ㄱ( |- |-$)/, 'k '],
        [/ㄲ( |- |-$)/, 'kk '],
        [/ㄳ( |- |-$)/, 'kc '],
        [/ㄴ( |- |-$)/, 'n '],
        [/ㄵ( |- |-$)/, 'ncq '],
        [/ㄶ( |- |-$)/, 'nh '],
        [/ㄷ( |- |-$)/, 'd '],
        [/ㄹ( |- |-$)/, 'l '],
        [/ㄺ( |- |-$)/, 'lk '],
        [/ㄻ( |- |-$)/, 'lm '],
        [/ㄼ( |- |-$)/, 'lp '],
        [/ㄽ( |- |-$)/, 'lc '],
        [/ㄾ( |- |-$)/, 'lth '],
        [/ㄿ( |- |-$)/, 'lph '],
        [/ㅀ( |- |-$)/, 'lh '],
        [/ㅁ( |- |-$)/, 'm '],
        [/ㅂ( |- |-$)/, 'b '],
        [/ㅄ( |- |-$)/, 'bc '],
        [/ㅅ( |- |-$)/, 'c '],
        [/ㅆ( |- |-$)/, 'ss '],
        [/ㅇ( |- |-$)/, 'ng '],
        [/ㅈ( |- |-$)/, 'cq '],
        [/ㅊ( |- |-$)/, 'zh '],
        [/ㅋ( |- |-$)/, 'kh '],
        [/ㅌ( |- |-$)/, 'th '],
        [/ㅍ( |- |-$)/, 'ph '],
        [/ㅎ( |- |-$)/, 'h '],
        //
        // 辅音
        [/ㄱ/, 'k'],
        [/ㄲ/, 'gg'],
        [/ㄴ/, 'n'],
        [/ㄷ/, 't'],
        [/ㄸ/, 'dd'],
        [/ㄹ/, 'l'],
        [/ㅁ/, 'm'],
        [/ㅂ/, 'p'],
        [/ㅃ/, 'bb'],
        [/ㅅ/, 'c'],
        [/ㅆ/, 'ss'],
        [/ㅇ/, '-'],
        [/ㅈ/, 'cq'],
        [/ㅉ/, 'zh'],
        [/ㅊ/, 'ch'],
        [/ㅋ/, 'kh'],
        [/ㅌ/, 'th'],
        [/ㅍ/, 'ph'],
        [/ㅎ/, 'h'],
        //
        [/([^👈]) p/, `$1 b`],
        [/([^👈]) bh/, `$1 ph`],
        [/([^👈]) t/, `$1 d`],
        [/([^👈]) dh/, `$1 th`],
        [/([^👈]) k/, `$1 g`],
        [/([^👈]) gh/, `$1 kh`],
        [/([^👈]) cq/, `$1 cz`],
        //
        [/czoe 👉👈 k/, `czoe 👉👈 g`],
        //
        // 元音
        [/ㅏ/, 'a'],
        [/ㅐ/, 'ae'],
        [/ㅑ/, 'ia'],
        [/ㅒ/, 'iae'],
        //
        [/ㅓ/, 'o'],
        [/ㅔ/, 'ee'],
        [/ㅕ/, 'io'],
        [/ㅖ/, 'iee'],
        //
        [/ㅗ/, 'u'],
        [/ㅘ/, 'ua'],
        [/ㅙ/, 'uae'],
        [/ㅚ/, 'ui'],
        [/ㅛ/, 'iu'],
        //
        [/ㅜ/, 'uu'],
        [/ㅝ/, 'uuo'],
        [/ㅞ/, 'uuee'],
        [/ㅟ/, 'uui'],
        [/ㅠ/, 'iuu'],
        //
        [/ㅡ/, 'e'],
        [/ㅢ/, 'ei'],
        [/ㅣ/, 'i'],
        //
        //
        [/-i/, 'y'],
        [/-uu/, 'w'],
        [/\ni/, '\ny'],
        [/\nuu/, '\nw'],
        [/👉👈i/, '👉👈y'],
        [/👉👈uu/, '👉👈w'],
        //
        [/y([^aoeiu])/, 'yi$1'],
        [/w([^aoeiu])/, 'wuu$1'],
        //
        [/ -/, ' '],
        [/\n-/, '\n'],
        [/👉👈-/, '👉👈'],
        //
        [/^y$/, 'yi'],
        [/^w$/, 'wuu'],
        [/^y /, 'yi '],
        [/^w /, 'wuu '],
        [/\ny /, 'yi '],
        [/\nw /, 'wuu '],
        //
        // 写法变化
        [/ci/, 'xi'],
        [/ssi/, 'xxi'],
        //
        //
        //
        //
    ]
    let result = krnToTones(str);
    result = result.trim();
    for (let rule of rules) {
        result = result.replace(new RegExp(rule[0], 'g'), rule[1]);
    }
    result = result.replace(/^.|👉👈 .|\n./g, str => str.toUpperCase());
    result = result.replace(/ *👉👈 */g, ' ');
    result = result.replace(/🔜|🔚/g, '');
    return result.trim();
}

function krnToPinYin_tmp(str) {
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
        ['ㅅ', 'c'],
        ['ㅆ', 'ss'],
        ['ㅇ', '-'],
        ['ㅈ', 'cq'],
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
        ['ㅒ', 'iae'],
        //
        ['ㅓ', 'o'],
        ['ㅔ', 'ee'],
        ['ㅕ', 'io'],
        ['ㅖ', 'iee'],
        //
        ['ㅗ', 'u'],
        ['ㅘ', 'ua'],
        ['ㅙ', 'uae'],
        ['ㅚ', 'ui'],
        ['ㅛ', 'iu'],
        //
        ['ㅜ', 'uu'],
        ['ㅝ', 'uuo'],
        ['ㅞ', 'uuee'],
        ['ㅟ', 'uui'],
        ['ㅠ', 'iuu'],
        //
        ['ㅡ', 'e'],
        ['ㅢ', 'ei'],
        ['ㅣ', 'i'],
    ];
    let shou_array = [
        ['㄰', ''],
        ['ㄱ', 'g-'],
        ['ㄲ', 'gg-'],
        ['ㄳ', 'gc-'],
        ['ㄴ', 'n-'],
        ['ㄵ', 'ncq-'],
        ['ㄶ', 'nh-'],
        ['ㄷ', 'd-'],
        ['ㄹ', 'l-'],
        ['ㄺ', 'lg-'],
        ['ㄻ', 'lm-'],
        ['ㄼ', 'lp-'],
        ['ㄽ', 'lc-'],
        ['ㄾ', 'lth-'],
        ['ㄿ', 'lph-'],
        ['ㅀ', 'lh-'],
        ['ㅁ', 'm-'],
        ['ㅂ', 'b-'],
        ['ㅄ', 'bc-'],
        ['ㅅ', 'c-'],
        ['ㅆ', 'ss-'],
        ['ㅇ', 'ng-'],
        ['ㅈ', 'cq-'],
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
            happy.push(`${item[0]}${item[1]}${item[2]}`);
        } else if (item.length == 1 && item[0] == ' ') {
            happy.push('👉👈');
        } else if (item.length == 1 && item[0] == '\n') {
            happy.push('\n');
        } else if (item.length == 1 && item[0] == '\r') {
            console.log('\\r');
        } else {
            happy.push(`🔜${item[0]}🔚`);
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
    result = result.replace(/👉👈 -/g, `👉👈 `);
    result = result.replace(/- 👉👈/g, ` 👉👈`);
    // //
    // result = result.replace(/^i/g, `y`);
    // result = result.replace(/^uu/g, `w`);
    // result = result.replace(/\ni/g, `\ny`);
    // result = result.replace(/\nuu/g, `\nw`);
    // result = result.replace(/👉👈 i/g, `👉👈 y`);
    // result = result.replace(/👉👈 uu/g, `👉👈 w`);
    // //
    // result = result.replace(/^.|👉👈 .|\n./g, str => str.toUpperCase());
    // //
    // result = result.replace(/^Y$/g, `Yi`);
    // result = result.replace(/^W$/g, `Wuu`);
    // result = result.replace(/^Y /g, `Yi `);
    // result = result.replace(/^W /g, `Wuu `);
    // result = result.replace(/\nY /g, `\nYi `);
    // result = result.replace(/\nW /g, `\nWuu `);
    // result = result.replace(/👉👈 Y /g, `👉👈 Yi `);
    // result = result.replace(/👉👈 W /g, `👉👈 Wuu `);
    // //
    // result = result.replace(/- y/g, `-i`);
    // result = result.replace(/- w/g, `-uu`);
    // result = result.replace(/- -/g, `-`);
    //
    // 发音变化
    //
    // result = result.replace(/c-i/g, `-xi`);
    // result = result.replace(/ss-i/g, `-xx-i`);
    // result = result.replace(/Ss-i/g, `Xx-i`);
    //
    // result = result.replace(/c-en/g, `-cen`);
    // result = result.replace(/m-en/g, `-men`);
    // result = result.replace(/n-en/g, `-nen`);
    //
    // result = result.replace(/ng- li/g, `ng-ni`);
    result = result.replace(/n- h/g, `-nh`);
    //
    // result = result.replace(/ci/g, `xi`);
    // result = result.replace(/ssi/g, `xxi`);
    // result = result.replace(/Ssi/g, `Xxi`);
    //
    // result = result.replace(/ p/g, ` b`);
    // result = result.replace(/ bh/g, ` ph`);
    // result = result.replace(/ t/g, ` d`);
    // result = result.replace(/ dh/g, ` th`);
    // result = result.replace(/ k/g, ` g`);
    // result = result.replace(/ gh/g, ` kh`);
    // result = result.replace(/ cq/g, ` cz`);
    //
    // result = result.replace(/Czoe 👉👈 K/g, `Czoe 👉👈 G`);
    //s
    // 去除连字符
    //
    result = result.replace(/n-i/g, `n y`);
    //
    result = result.replace(/ -i/g, ` y`);
    result = result.replace(/ -uu/g, ` w`);
    result = result.replace(/ -/g, ` `);
    result = result.replace(/- /g, ` `);
    result = result.replace(/ y /g, ` yi `);
    result = result.replace(/ w /g, ` wuu `);
    //
    // 收音统一化
    //
    result = result.replace(/b /g, `m `);
    result = result.replace(/p /g, `m `);
    result = result.replace(/ym /g, `yim `);
    result = result.replace(/b$/g, `m$`);
    result = result.replace(/p$/g, `m$`);
    result = result.replace(/ym$/g, `yim$`);
    //
    result = result.replace(/ um /g, ` om `);
    result = result.replace(/^um /g, `om `);
    result = result.replace(/ um$/g, ` om`);
    result = result.replace(/^um$/g, `om`);
    result = result.replace(/ Um /g, ` Om `);
    result = result.replace(/^Um /g, `Om `);
    result = result.replace(/ Um$/g, ` Om`);
    result = result.replace(/^Um$/g, `Om`);
    //
    // 结束
    //
    result = result.replace(/ *👉👈 */g, ` `);
    result = result.replace(/🔜|🔚/g, ``);
    //
    return result;
}



