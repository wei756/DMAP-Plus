function formatTime(seconds) {
  return `${parseInt(seconds / 60)}:${('0' + parseInt(seconds % 60)).slice(-2)}`;
}

function compareText(a, b) {
  if (a === b) {
    return 0;
  }
  if (a === [a,b].sort()[0]) {
    return 1;
  } else {
    return -1;
  }
}

/**
 * 특수문자, 띄어쓰기가 제거된 문자열을 반환합니다.
 */
function filterSearchText(str) {
  return str.toLowerCase().replace(/[^ㄱ-ㅎ가-힣\w]+/gi, "");
}

const chosungList = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

/**
 * 문자열을 초성으로 변환합니다.
 */
function convertToChosung(str) {
  const filteredOnlyHangul = str.replace(/[^ㄱ-ㅎ가-힣]+/gi, '');

  return filteredOnlyHangul.split('').map(char => {

    const charCode = char.charCodeAt();

    // ㄱ-ㅎ
    if (charCode < 0xAC00) {
      return char;
    }

    const chosung = parseInt((charCode - 0xAC00) / 21 / 28);

    return chosungList[chosung];
  }).join('');
}

function openFile(type = 'file', accept = '.html') {
  return new Promise((success, reject) => {
    try {
      const input = document.createElement("input");
      input.type = type;
      input.accept = accept;
      input.onchange = e => {
        success(e.target.files[0]);
      }
      input.click();
    } catch (error) {
      reject(error);
    }
  })
}

/**
 * 데이터를 파일로 저장합니다.
 *
 * @param {Any} content 저장될 data
 * @param {String} filename 저장되는 파일 이름
 * @param {String} contentType 저장되는 파일 타입
 */
const saveFile = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click()
}

Array.prototype.shuffle = function() {
  return this.sort((b, c) => Math.random() * 2 - 1);
}

/**
 * commonJS 스타일의 모듈 import 를 구현합니다. (개발중)
 */
function require(path) {
  return new Promise((complete, reject) => {
    const _module = document.createElement('script');
    _module.type = 'text/javascript';
    _module.src = path;
    _module.addEventListener('load', e => {
      console.log('load')
      document.body.removeChild(e.target);
      try {
        const { exports } = module;
        module = undefined;
        complete(exports);
      } catch (err) {
        reject(err);
      }
    });
    document.body.append(_module);
  });
}

function exportMusicSupportingLyric() {
  return musicList.filter(item => Object.keys(lyrics).includes('' + item.musicId)).map(({musicId, title, singer}) => `['${title}', '${singer}', ${musicId}]`).join('\n');
}

/**
 * UUID를 생성합니다.
 * 
 * @returns {string}
 */
function geneUUID() {
  const hex = '0123456789abcdef';
  //8-4-4-4-12
  const result = new Array(36).fill(0).map(_ => hex[Math.min(parseInt(Math.random() * 16), 15)]);
  result[8] = '-';
  result[13] = '-';
  result[18] = '-';
  result[23] = '-';
  return result.join('');
}

/**
 * path에 className를 가진 요소가 있는지 여부를 반환합니다.
 * 
 * @param {string} className 찾을 className
 * @param {HTMLElement[]} path 
 */
function containsPath(className, path) {
  return path.filter(item => item instanceof HTMLElement).reduce((isContain, el) => isContain || el.classList.contains(className), false);
}
