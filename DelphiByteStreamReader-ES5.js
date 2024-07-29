"use strict";

/*
 *  Class DelphiByteStreamReader
 *    Provides methods to read given byte stream buffer starting from given offset.
 *    Methods correspond data types in Delphi language.
 * 
 *  Minimum required JS version: JS 2009 (ES5)
 */

var DelphiByteStreamReader = (function () {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    function DelphiByteStreamReader(buffer, initOffset, maxLen) {
        // Input is type of ArrayBuffer. It cannot be directly manipulated but create one of the typed array objects or a DataView object.
        // Note: Problem with Typed array is that e.g. offset for reading integer must be multiple of 4. So DataView it is.

        this.offset = 0;
        this.buffer = buffer;
        
        // convert ArrayBuffer to DataView
        if (maxLen > 0) {
            this.data = new DataView(buffer, initOffset, maxLen);
        }
        else {
            this.data = new DataView(buffer, initOffset);
        }
    }

    // -------------------------------------------------------------------------
    // Private methods
    // -------------------------------------------------------------------------
    
    // converts byte array to characters
    function bin2String(arr, maxLen) {
        if (maxLen === void 0) { maxLen = -1; }
        var result = "";
        if ((maxLen < 0) || (maxLen > arr.length))
            maxLen = arr.length;
        for (var i = 0; i < maxLen; i++) {
            if (arr[i] == 0)
                break;
            result += String.fromCharCode(arr[i]);
        }
        return result;
    };
    

    // -------------------------------------------------------------------------
    // Public methods
    // -------------------------------------------------------------------------
    
    DelphiByteStreamReader.prototype.getOffset = function () {
        return this.offset;
    };
    
    DelphiByteStreamReader.prototype.incOffset = function (val) {
        this.offset = this.offset + val;
    };

    // ----------------
    // Integer types 
    //-----------------
    
    // Signed 8-bit int
    DelphiByteStreamReader.prototype.readShortInt = function () {
        var val = this.data.getInt8(this.offset);
        this.offset += 1;
        return val;
    };
    
    // Signed 16-bit int
    DelphiByteStreamReader.prototype.readSmallInt = function () {
        var val = this.data.getInt16(this.offset, true);
        this.offset += 2;
        return val;
    };
    
    // Signed 32-bit int
    DelphiByteStreamReader.prototype.readInteger = function () {
        var val = this.data.getInt32(this.offset, true);
        this.offset += 4;
        return val;
    };
    
    DelphiByteStreamReader.prototype.readFixedInt = function () {
        return this.readInteger();
    };
    
    // Signed 64-bit int as BigInt
    DelphiByteStreamReader.prototype.readInt64Precise = function () {
        throw new Error("Not implemented");
    };
    // Signed 64-bit int
    DelphiByteStreamReader.prototype.readInt64 = function () {
        var valN = this.readInt64Precise();
        return Number(valN);
    };
    
    // Unsigned 8-bit int
    DelphiByteStreamReader.prototype.readByte = function () {
        var val = this.data.getUint8(this.offset);
        this.offset += 1;
        return val;
    };
    
    // Unsigned 16-bit int
    DelphiByteStreamReader.prototype.readWord = function () {
        var val = this.data.getUint16(this.offset, true);
        this.offset += 2;
        return val;
    };
    
    // Unsigned 32-bit int
    DelphiByteStreamReader.prototype.readCardinal = function () {
        var val = this.data.getUint32(this.offset, true);
        this.offset += 4;
        return val;
    };
    
    // Unsigned 64-bit int as BigInt
    DelphiByteStreamReader.prototype.readUInt64Precise = function () {
        throw new Error("Not implemented");
    };
    // Unsigned 64-bit int
    DelphiByteStreamReader.prototype.readUInt64 = function () {
        var valN = this.readUInt64Precise();
        return Number(valN);
    };
    
    // ----------------
    // Integer types (platform-dependent)
    //-----------------
    
    DelphiByteStreamReader.prototype.readNativeIntOn32 = function () {
        return this.readInteger();
    };
    
    DelphiByteStreamReader.prototype.readNativeIntOn64 = function () {
        return this.readInt64();
    };
    
    DelphiByteStreamReader.prototype.readNativeUIntOn32 = function () {
        return this.readCardinal();
    };
    
    DelphiByteStreamReader.prototype.readNativeUIntOn64 = function () {
        return this.readUInt64();
    };
    
    DelphiByteStreamReader.prototype.readLongIntOn32 = function () {
        return this.readInteger();
    };
    DelphiByteStreamReader.prototype.readLongIntOnWin64 = function () {
        return this.readInteger();
    };
    DelphiByteStreamReader.prototype.readLongIntOnPOSIX64 = function () {
        return this.readInt64();
    };

    DelphiByteStreamReader.prototype.readLongWordOn32 = function () {
        return this.readCardinal();
    };
    DelphiByteStreamReader.prototype.readLongWordOnWin64 = function () {
        return this.readCardinal();
    };
    DelphiByteStreamReader.prototype.readLongWordOnPOSIX64 = function () {
        return this.readUInt64();
    };
    
    // ----------------
    // Boolean types 
    //-----------------
    
    DelphiByteStreamReader.prototype.readBoolean = function () {
        var val = this.readByte();
        return (val != 0);
    };
    
    DelphiByteStreamReader.prototype.readByteBool = function () {
        var val = this.readShortInt();
        return (val != 0);
    };
    
    DelphiByteStreamReader.prototype.readWordBool = function () {
        var val = this.readSmallInt();
        return (val != 0);
    };
    
    DelphiByteStreamReader.prototype.readLongBool = function () {
        var val = this.readInteger();
        return (val != 0);
    };
    
    // ----------------
    // Real types 
    //-----------------
    
    // 32-bit real
    DelphiByteStreamReader.prototype.readSingle = function () {
        var val = this.data.getFloat32(this.offset, true);
        this.offset += 4;
        return val;
    };
    
    // 64-bit real
    DelphiByteStreamReader.prototype.readDouble = function () {
        var val = this.data.getFloat64(this.offset, true);
        this.offset += 8;
        return val;
    };
    
    DelphiByteStreamReader.prototype.readReal = function () {
        return this.readDouble();
    };
    
//    DelphiByteStreamReader.prototype.readReal48 = function() {
//        // not implemented
//        var val = [];
//
//        val[0] = this.data.getUint32(this.offset, true);
//        this.offset += 4;
//        val[1] = this.data.getInt16(this.offset, true);
//        this.offset += 2;
//        return (val[1] << 32) | (val[0]);  // doesn't work, shifting must be < 32
//    };
    
//    DelphiByteStreamReader.prototype.readExtended = function () {
//        // not implemented
//    };
    
    DelphiByteStreamReader.prototype.readComp = function () {
        return this.readInt64();
    };
    
    DelphiByteStreamReader.prototype.readCurrency = function () {
        return this.readInt64() / 10000;
    };
    
    
    // ----------------
    // Character types 
    //-----------------
    
    // byte-sized (8-bit) characters
    DelphiByteStreamReader.prototype.readAnsiChar = function () {
        var charCode = this.readByte();
        return String.fromCharCode(charCode);
    };
    
    // word-sized (16-bit) characters
    DelphiByteStreamReader.prototype.readChar = function () {
        return this.readWideChar();
    };
    
    DelphiByteStreamReader.prototype.readWideChar = function () {
        var charCode = this.readWord();
        return String.fromCharCode(charCode);
    };
    
    DelphiByteStreamReader.prototype.readUCS2Char = function () {
        return this.readWideChar();
    };


    // ----------------
    // String types 
    //-----------------
    
    DelphiByteStreamReader.prototype.readShortString = function (savedLen) {
        if (savedLen === void 0) { savedLen = 255; }
        var actualLen = this.readByte();    // the first byte contains the actual length of the string
        var str = this.readAnsiCharArray(savedLen, actualLen);
        return str;
    };
    
    
    // ----------------
    // Helpers for Character arrays 
    //-----------------
    
    DelphiByteStreamReader.prototype.readCharArray = function (savedLen, actualLen) {
        if (actualLen === void 0) { actualLen = -1; }
        var arr = [];
        for (var i = 0; i < savedLen; i++) {
            arr[i] = this.readWord();
        }
        return bin2String(arr, actualLen);
    };
    
    DelphiByteStreamReader.prototype.readAnsiCharArray = function (savedLen, actualLen) {
        if (actualLen === void 0) { actualLen = -1; }
        var arr = this.readByteArray(savedLen);
        return bin2String(arr, actualLen);
    };
    
    
    // ----------------
    // Date and Time types 
    //-----------------

    DelphiByteStreamReader.prototype.readDateTime = function () {
        // In Delphi the TDateTime type maps to a Double 
        // where the integral part is the number of days passed since 1899-12-30 00:00
        // and the fractional part is fraction of a 24 hour day that has elapsed on that day.
        // For example .25 always corresponds to 06:00 not depending on the sign of the the integral part.
        // In JS, Date is internally stored as milliseconds since 1970-01-01 00:00
        var val = this.readDouble();
        var timeInMs = Date.UTC(1899, 11, 30, 0, 0, 0, 0);      // note: in JS months start from 0
        if (val >= 0)
            return new Date(timeInMs + 24*60*60*1000*val);      // note: debugger shows as local time
        else {                                                  // use .toISOString() to show saved time
            var integral = Math.floor(-val);                    // negative
            var fraction = Math.abs(val % 1);                   // positive => val -2.75 becomes -2+0.75=-1.25 days backwards
            return new Date(timeInMs + 24*60*60*1000*(integral + fraction));
        }
    };
    
    
    // ----------------
    // Misc helpers 
    //-----------------
    
    // reads a memory block of given length
    DelphiByteStreamReader.prototype.readByteArray = function (len) {
        var block = new Uint8Array(this.buffer, this.offset, len);
        this.offset += len;
        return block;
    };
    
    return DelphiByteStreamReader;
})();
