/*
 *  Class DelphiByteStreamReader
 *    Provides methods to read given byte stream buffer starting from given offset.
 *    Methods correspond data types in Delphi language.
 * 
 *  Requires es2020
 */

class DelphiByteStreamReader {
  offset = 0;
  data: DataView;
   
  constructor(private buffer: ArrayBuffer, initOffset: number, maxLen: number) {
    
    // convert ArrayBuffer to DataView
    if (maxLen > 0) {
      this.data = new DataView(buffer, initOffset, maxLen);
    }
    else {
      this.data = new DataView(buffer, initOffset);
    }
  }

  // converts byte array to characters
  private bin2String(arr: number[] | Uint8Array, maxLen = -1): string {
    let result = "";
    if ((maxLen < 0) || (maxLen > arr.length))
      maxLen = arr.length;
    for (let i = 0; i < maxLen; i++) {
      if (arr[i] == 0)
        break;
      result += String.fromCharCode(arr[i]);
    }
    return result;
  }

  getOffset(): number {
    return this.offset;
  }

  incOffset(val: number) {
    this.offset = this.offset + val;
  }

  // ----------------
  // Integer types 
  //-----------------

  // Signed 8-bit int
  readShortInt(): number {
    let val = this.data.getInt8(this.offset);
    this.offset += 1;
    return val;
  }

  // Signed 16-bit int
  readSmallInt(): number {
    let val = this.data.getInt16(this.offset, true);
    this.offset += 2;
    return val;
  }

  // Signed 32-bit int
  readInteger(): number {
    let val = this.data.getInt32(this.offset, true);
    this.offset += 4;
    return val;
  }

  readFixedInt(): number {
    return this.readInteger();
  }

  // Signed 64-bit int as BigInt
  readInt64Precise(): bigint {
    let valN = this.data.getBigInt64(this.offset, true);
    this.offset += 8;
    return valN;
  }
  // Signed 64-bit int
  readInt64(): number {
    let valN = this.readInt64Precise();
    return Number(valN);
  }    

  // Unsigned 8-bit int
  readByte(): number {
    let val = this.data.getUint8(this.offset);
    this.offset += 1;
    return val;
  }

  // Unsigned 16-bit int
  readWord(): number {
    let val = this.data.getUint16(this.offset, true);
    this.offset += 2;
    return val;
  }

  // Unsigned 32-bit int
  readCardinal(): number {
    let val = this.data.getUint32(this.offset, true);
    this.offset += 4;
    return val;
  }

  // Unsigned 64-bit int as BigInt
  readUInt64Precise(): bigint {
    let valN = this.data.getBigUint64(this.offset, true);
    this.offset += 8;
    return valN;
  }
  // Unsigned 64-bit int
  readUInt64(): number {
    let valN = this.readUInt64Precise();
    return Number(valN);
  }

  // ----------------
  // Integer types (platform-dependent)
  //-----------------

  readNativeIntOn32(): number {
    return this.readInteger();
  }

  readNativeIntOn64(): number {
    return this.readInt64();
  }

  readNativeUIntOn32(): number {
    return this.readCardinal();
  }

  readNativeUIntOn64(): number {
    return this.readUInt64();
  }

  readLongIntOn32(): number {
    return this.readInteger();
  }
  readLongIntOnWin64(): number {
    return this.readInteger();
  }
  readLongIntOnPOSIX64(): number {
    return this.readInt64();
  }

  readLongWordOn32(): number {
    return this.readCardinal();
  }    
  readLongWordOnWin64(): number {
    return this.readCardinal();
  }
  readLongWordOnPOSIX64(): number {
    return this.readUInt64();
  }

  // ----------------
  // Boolean types 
  //-----------------

  readBoolean(): boolean {
    let val = this.readByte();
    return (val != 0);
  }

  readByteBool(): boolean {
    let val = this.readShortInt();
    return (val != 0);
  }

  readWordBool(): boolean {
    let val = this.readSmallInt();
    return (val != 0);
  }

  readLongBool(): boolean {
    let val = this.readInteger();
    return (val != 0);
  }    

  // ----------------
  // Real types 
  //-----------------

  // 32-bit real
  readSingle(): number {
    let val = this.data.getFloat32(this.offset, true);
    this.offset += 4;
    return val;
  }

  // 64-bit real
  readDouble(): number {
    let val = this.data.getFloat64(this.offset, true);
    this.offset += 8;
    return val;
  }

  readReal(): number {
    return this.readDouble();
  }

  // readReal48(): number {
  //   // not implemented
  //   let val = [];

  //   val[0] = this.data.getUint32(this.offset, true);
  //   this.offset += 4;
  //   val[1] = this.data.getInt16(this.offset, true);
  //   this.offset += 2;
  //   return (val[1] << 32) | (val[0]);  // doesn't work, shifting must be < 32
  // }

  // readExtended(): number {
  //   // not implemented
  // }

  readComp(): number {
    return this.readInt64();
  }

  readCurrency(): number {
    return this.readInt64()/10000;
  }


  // ----------------
  // Character types 
  //-----------------

  // byte-sized (8-bit) characters
  readAnsiChar(): string {
    let charCode = this.readByte();
    return String.fromCharCode(charCode);
  }

  // word-sized (16-bit) characters
  readChar(): string {
    return this.readWideChar();
  }

  readWideChar(): string {
    let charCode = this.readWord();
    return String.fromCharCode(charCode);
  }

  readUCS2Char(): string {
    return this.readWideChar();
  }


  // ----------------
  // String types 
  //-----------------

  readShortString(savedLen = 255): string {
    let actualLen = this.readByte();    // the first byte contains the actual length of the string
    let str = this.readAnsiCharArray(savedLen, actualLen);
    return str;
  }


  // ----------------
  // Helpers for Character arrays 
  //-----------------

  readCharArray(savedLen: number, actualLen = -1): string {
    let arr: number[] = [];
    for (let i=0; i<savedLen; i++) {
      arr[i] = this.readWord();
    }
    return this.bin2String(arr, actualLen);
  }

  readAnsiCharArray(savedLen: number, actualLen = -1): string {
    let arr = this.readByteArray(savedLen);
    return this.bin2String(arr, actualLen);
  }


  // ----------------
  // Date and Time types 
  //-----------------

  readDateTime(): Date {
    // In Delphi the TDateTime type maps to a Double 
    // where the integral part is the number of days passed since 1899-12-30 00:00
    // and the fractional part is fraction of a 24 hour day that has elapsed on that day.
    // For example .25 always corresponds to 06:00 not depending on the sign of the the integral part.
    // In JS, Date is internally stored as milliseconds since 1970-01-01 00:00
    let val = this.readDouble();
    let timeInMs = Date.UTC(1899, 11, 30, 0, 0, 0, 0);  // note: in JS months start from 0
    if (val >= 0)
      return new Date(timeInMs + 24*60*60*1000*val);    // note: debugger shows as local time
    else {                                              // use .toISOString() to show saved time
      let integral = Math.trunc(val);                   // negative
      let fraction = Math.abs(val % 1);                 // positive => val -2.75 becomes -2+0.75=-1.25 days backwards
      return new Date(timeInMs + 24*60*60*1000*(integral + fraction));
    }
  }


  // ----------------
  // Misc helpers 
  //-----------------

  // reads a memory block of given length
  readByteArray(len: number): Uint8Array {
    let block = new Uint8Array(this.buffer, this.offset, len);
    this.offset += len;
    return block;
  }

}