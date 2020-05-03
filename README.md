# DelphiByteStreamReader
JavaScript class that provides methods to read byte stream written in Delphi.
Supports Delphi Simple types and ShortString.
Data types Real48 and Extended are not implemented.
**Note:** JS doesn't support as big 64-bit integers as Delphi. To read those big values, use readInt64Precise() or readUInt64Precise(). Both methods return BigInt object.
**Note:** When reading record you may need to read extra bytes because of field alignments. Use packed record to avoid this.


## Usage:

#### Write stream in Delphi:

```
type
  TExampleRec = record
    b1: byte;
    b2: byte;
    b3: byte;
    Last: double;
  end;

  TPackedRec = packed record
    b1: byte;
    b2: byte;
    b3: byte;
    Last: double;
  end;

procedure WriteTestBytes();
var
  FS: TStream;
  iInteger: Integer;
  fDouble: Double;
  bBoolean: boolean;
  iInt64: Int64;
  sShortString: ShortString;
  sString10: String[10];
  charA: array[1..20] of Char;
  Rec: TExampleRec;
  PackedRec: TPackedRec;
  dtDateTime: TDateTime;
begin
  FS := TFileStream.Create('D2JSDemo.bin', fmCreate or fmShareExclusive) ;
  try
    sShortString := 'PI as a whole number is:';
    FS.Write(sShortString, SizeOf(sShortString));
    iInteger := 3;
    FS.Write(iInteger, SizeOf(Integer));

    sShortString := 'and the decimal part:';
    FS.Write(sShortString, SizeOf(sShortString));
    fDouble := 0.1415926535;
    FS.Write(fDouble, SizeOf(fDouble));

    FillChar(charA, SizeOf(charA), 0);
    charA[1] := 'T';
    charA[2] := 'r';
    charA[3] := 'u';
    charA[4] := 'e';
    charA[5] := '?';
    FS.Write(charA, SizeOf(charA));
    bBoolean := True;
    FS.Write(bBoolean, SizeOf(bBoolean));

    sShortString := 'Int64 and UInt64:';
    FS.Write(sShortString, SizeOf(sShortString));
    iInt64 := High(iInt64);
    FS.Write(iInt64, SizeOf(iInt64));
    FS.Write(iInt64, SizeOf(iInt64));

    sString10 := '1234567890';
    sString10 := 'Record:';
    FS.Write(sString10, SizeOf(sString10));
    Rec.b1 := 12;
    Rec.b2 := 34;
    Rec.b3 := 56;
    Rec.Last := -987.65;
    FS.Write(Rec, SizeOf(Rec));

    sString10 := 'Packed:';
    FS.Write(sString10, SizeOf(sString10));
    PackedRec.b1 := 12;
    PackedRec.b2 := 34;
    PackedRec.b3 := 56;
    PackedRec.Last := -987.65;
    FS.Write(PackedRec, SizeOf(PackedRec));

    dtDateTime := EncodeDateTime(2019, 11, 15, 17, 20, 27, 789);
    FS.Write(dtDateTime, SizeOf(dtDateTime));
    dtDateTime := -1.25;      // 1899-12-29 06:00
    FS.Write(dtDateTime, SizeOf(dtDateTime));
  finally
    FS.Free ;
  end;
end;
```

#### Read stream in JavaScript:

```
<!DOCTYPE html>
<html>
    <head>
        <script type="text/javascript" src="DelphiByteStreamReader.js"></script>
        <script type="text/javascript">
            function readByteStream(filePath) {
                var output = "";
                var reader = new FileReader();
                
                if (filePath.files && filePath.files[0]) {
                    reader.onload = function(e) {
                        output = e.target.result;

                        var reader = new DelphiByteStreamReader(output);
                        
                        var e1 = reader.readShortString();   // "PI as a whole number is:"
                        var e2 = reader.readInteger();       // 3
                        var e3 = reader.readShortString();   // "and the decimal part:"
                        var e4 = reader.readDouble();        // 0.1415926535

                        var e5 = reader.readCharArray(20);   // "True?"
                        var e6 = reader.readBoolean();       // true
                        var e7 = reader.readShortString();   // "Int64 and UInt64:"
                        var e8 = reader.readInt64();         // 9223372036854776000
                        var e9 = reader.readInt64Precise();  // 9223372036854775807n
                        
                        var s1 = reader.readShortString(10); // "Record:"
                        var rec1 = {};
                        rec1.b1 = reader.readByte();         // 12
                        rec1.b2 = reader.readByte();         // 34
                        rec1.b3 = reader.readByte();         // 56
                        reader.incOffset(5);                 // Delphi alignment
                        rec1.last = reader.readDouble();     // -987.65
                        
                        var s2 = reader.readShortString(10); // "Packed:"
                        var rec2 = {};
                        rec2.b1 = reader.readByte();         // 12
                        rec2.b2 = reader.readByte();         // 34
                        rec2.b3 = reader.readByte();         // 56
                        rec2.last = reader.readDouble();     // -987.65
                        
                        var d1 = reader.readDateTime();      // d1.toISOString() "2019-11-15T17:20:27.789Z"
                        var d2 = reader.readDateTime();      // d2.toISOString() "1899-12-29T06:00:00.000Z"
                    };
                    reader.readAsArrayBuffer(filePath.files[0]);
                }
            }
        </script>
    </head>
    <body>
        <input type="file" onchange='readByteStream(this)' />
    </body>
</html>
```
