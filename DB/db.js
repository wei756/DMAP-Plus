const db = [
['낵꺽약!)Ebodf!Qsbdujdf!23/wfs*', '악익즉웑', 216, 491, '31331504:334758:4:7957:04:334758:4:7957:/tnjm', 1786],
['sfqmz!)닶잦*', '깁돚륡', 2824.6, 3176, '31331:0995:389933:746760995:389933:74676/tnjm', 1681],
['TNBSUQIPOF', '쵝옉낙', 2444.9, 2641, '31331:0995:389933:746760995:389933:74676/tnjm', 1680],
['Ifz-!Pdfbo!)박닥약*', '깁속엱', 1894.6, 2113, '31331:0995:389933:746760995:389933:74676/tnjm', 1679],
['극락덱익셙', '21dn', 1436.8, 1635, '31331:0995:389933:746760995:389933:74676/tnjm', 1678],
['춖젝', '멝록맞슥', 578.8, 844, '31331:0995:389933:746760995:389933:74676/tnjm', 1677],
['Hjsmt', '엑슥팍', 155.5, 401.2, '3133190463755357159575604637553571595756/tnjm', 1539],
['몪욕읽!밥!)Gfbu/!빉직녹*', '억밙작칵팍', 600.5, 807, '3133180:2:2:72:773235730:2:2:72:77323573/tnjm', 1497],
['극랙독!낙!삭랒학직', '솢학옂)픅록믹슥낙읹*', 1758, 1923.5, '313316027446232273:4915027446232273:4915/tnjm', 1315],
['UPNCPZ', ')역작*악익듥', 1806, 1979, '3133150249728576572:6460249728576572:646/tnjm', 1284],
['Mpwf!Ejwf', 'JWF)악익븍*', 184, 359, '3133150249728576572:6460249728576572:646/tnjm', 1281],
['TDJFOUJTU', '특왁익슥', 211, 400, '31322305896457538:892::05896457538:892::/tnjm', 981],
['잕속릭', "악익육'입슭옺", 2666, 2872, '3127170435:615:3::695940435:615:3::69594/tnjm', 850],
['봅낡', '밪탅속녅닩', 1489, 1779, '313123055:32258:5939:55055:32258:5939:55/tnjm', 587],
['싡혹듲', '익묵짅', 2624, 2853, '3132180223121235487754902231212354877549/tnjm', 352],
['욱삱', '윥학', 1734, 1942, '3127140223:6998565835890223:699856583589/tnjm', 343],
['엑있', '악익육', 1146, 1296, '3132120496865259:89215:0496865259:89215:/tnjm', 225],
['낙맍-!봅', '볽빩갅삭춙긱', 1974, 2190, '3131130712437466:1568:50712437466:1568:5/tnjm', 131],
['Cvuufs', '밪탅속녅닩', 310, 474, '31321807958299519:3:92507958299519:3:925/tnjm', 117],
];
// 검색방지용 암호화 적용

// encode
/*db.forEach(item => {
  item[0]=item[0].split('').map(c => String.fromCharCode(c.charCodeAt() + 1)).join('');
  item[1]=item[1].split('').map(c => String.fromCharCode(c.charCodeAt() + 1)).join('');
  item[4]=item[4].split('').map(c => String.fromCharCode(c.charCodeAt() + 1)).join('');
});*/
// decode
db.forEach(item => {
  item[0]=item[0].split('').map(c => String.fromCharCode(c.charCodeAt() - 1)).join('');
  item[1]=item[1].split('').map(c => String.fromCharCode(c.charCodeAt() - 1)).join('');
  item[4]=item[4].split('').map(c => String.fromCharCode(c.charCodeAt() - 1)).join('');
});