/**
 * 가사 데이터를 json형태로 변환합니다.
 */
function parseLyric(str) {
  const output = {
    title: '',
    offset: 0,
    data: [],
    linkedId: '',
  }
  const lines = str.split('\n').map(v => v.trim());
  
  lines.forEach(line => {
    const cmd = line.split(' ', 1)[0];
    
    if (cmd.toUpperCase() === 'TITLE') {
      output.title = line.slice(cmd.length + 1);
    } else if (cmd.toUpperCase() === 'OFFSET') {
      output.offset = parseInt(line.slice(cmd.length + 1).replace(/[^0-9-]/g, '') || 0);
    } else if (cmd.toUpperCase() === 'FROM') {
      const targetId = line.split(' ', 2)[1];
      output.linkedId = '' + targetId;
    } else if (line.includes('->')) { // 가사
      const [time, ...dataArr] = line.split('->');
      const joinedStr = dataArr.join('->');
      const tokenizedStr = tokenizeCaptionText(joinedStr);
      
      const parsedTime = convertStringToTime(time);
      
      output.data.push({
        time: parsedTime,
        caption: tokenizedStr,
      });
    }
    
  });

  output.data.sort((a, b) => a.time - b.time);
  
  return output;
}

/**
 * H:m:s.SSS 형식의 문자열을 ms단위 시간으로 변환합니다.
 */
function convertStringToTime(str) {
  const { groups } = str.match(/((?<hh>[0-9]+):)?(?<mm>[0-9]+):(?<ss>[0-9]+(\.[0-9]+)?)/);
  
  if (!groups) { return 0; }
  
  const { hh, mm, ss } = groups;
  return parseInt((parseInt(hh) * 3600 + parseInt(mm) * 60 + parseFloat(ss)) * 1000);
}

/**
 * ms단위 시간 정수를 HH:mm:ss.SSS 형식의 문자열으로 변환합니다.
 */
function convertTimeToString(time) {
  const hh = `0${parseInt(time / 60 / 60 / 1000)}`.slice(-2);
  const mm = `0${parseInt(time / 60 / 1000)}`.slice(-2);
  const ss = `0${parseInt(time / 1000) % 60}`.slice(-2);
  const ms = `00${time}`.slice(-3);
  return `${hh}:${mm}:${ss}.${ms}`;
}

/**
 * 자막 스타일 속성을 파싱하여 토큰화한 리스트를 반환합니다.
 */
function tokenizeCaptionText(str) {
  if (str === '#') {
    return [''];
  }
  return [str];
}
/**
 * 토큰화한 리스트를 일반 텍스트로 반환합니다.
 */
function untokenizeCaptionText(tokens) {
  if (tokens.length === 1 && tokens[0] === '') {
    return '#';
  }
  return tokens[0];
}

/**
 * 문자열 형태의 가사 데이터를 사용할 수 있는 형태로 일괄 변환합니다.
 */
function initLyricData() {

  // 데이터 파싱
  Object.keys(lyrics).forEach(musicId => {
    const target = lyrics[musicId];
    if (typeof target === 'string') {
      lyrics[musicId] = parseLyric(target);
    }
  })

  // 링크된 가사 데이터 입력
  Object.keys(lyrics).forEach(musicId => {
    const target = lyrics[musicId];
    if (target.linkedId) {
      const linkedTarget = lyrics[target.linkedId];
      if (linkedTarget) {
        target.offset += linkedTarget.offset;
        target.data = JSON.parse(JSON.stringify(linkedTarget.data));
      } else {
      }
    }
  })

  // 리스트 업데이트
  //updateMusiclistView();
}
initLyricData();