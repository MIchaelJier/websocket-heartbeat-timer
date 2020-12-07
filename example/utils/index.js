function decodeDataFrame(e){
  var i=0,j,s,frame={
      //解析前两个字节的基本数据
      FIN:e[i]>>7,Opcode:e[i++]&15,Mask:e[i]>>7,
      PayloadLength:e[i++]&0x7F
  };
  //处理特殊长度126和127
  if(frame.PayloadLength==126)
      frame.length=(e[i++]<<8)+e[i++];
  if(frame.PayloadLength==127)
      i+=4, //长度一般用四字节的整型，前四个字节通常为长整形留空的
          frame.length=(e[i++]<<24)+(e[i++]<<16)+(e[i++]<<8)+e[i++];
  //判断是否使用掩码
  if(frame.Mask){
      //获取掩码实体
      frame.MaskingKey=[e[i++],e[i++],e[i++],e[i++]];
      //对数据和掩码做异或运算
      for(j=0,s=[];j<frame.PayloadLength;j++)
          s.push(e[i+j]^frame.MaskingKey[j%4]);
  }else s=e.slice(i,frame.PayloadLength); //否则直接使用数据
  //数组转换成缓冲区来使用
  s=new Buffer(s);
  //如果有必要则把缓冲区转换成字符串来使用
  if(frame.Opcode==1)s=s.toString();
  //设置上数据部分
  frame.PayloadData=s;
  //返回数据帧
  return frame;
}
function encodeWsFrame(data) {
const isFinal = data.isFinal !== undefined ? data.isFinal : true,
  opcode = data.opcode !== undefined ? data.opcode : 1,
  payloadData = data.payloadData ? Buffer.from(data.payloadData) : null,
  payloadLen = payloadData ? payloadData.length : 0;

let frame = [];

if (isFinal) frame.push((1 << 7) + opcode);
else frame.push(opcode);

if (payloadLen < 126) {
  frame.push(payloadLen);
} else if (payloadLen < 65536) {
  frame.push(126, payloadLen >> 8, payloadLen & 0xFF);
} else {
  frame.push(127);
  for (let i = 7; i >= 0; --i) {
    frame.push((payloadLen & (0xFF << (i * 8))) >> (i * 8));
  }
}

frame = payloadData ? Buffer.concat([Buffer.from(frame), payloadData]) : Buffer.from(frame);

console.dir(decodeDataFrame(frame));
return frame;
}
function getNowTime() {
  let dateTime
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1
  let dd = new Date().getDate()
  let hh = new Date().getHours()
  let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes()
    :
    new Date().getMinutes()
  let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds()
    :
    new Date().getSeconds()
  dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
  console.log(dateTime)
  return dateTime
}
module.exports = {
  decodeDataFrame,
  encodeWsFrame,
  getNowTime
}