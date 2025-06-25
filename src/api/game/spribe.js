const SFS2X = require("sfs2x-api");
const zlib = require('zlib');

const _CONTROLLER_ID = "c", _ACTION_ID = "a", _PARAM_ID = "p";

class DataStream {
    static BIG_ENDIAN = false;
    static LITTLE_ENDIAN = true;

    constructor(source, byteOffset = 0, endianness = DataStream.LITTLE_ENDIAN) {
        this._byteOffset = byteOffset;
        this.position = 0;
        this.endianness = endianness;
        this._dynamicSize = true;

        if (source instanceof ArrayBuffer) {
            this.buffer = source;
        } else if (source instanceof DataView) {
            this.dataView = source;
            if (byteOffset) this._byteOffset += byteOffset;
        } else {
            this.buffer = new ArrayBuffer(source || 1);
        }
    }

    get dynamicSize() {
        return this._dynamicSize;
    }

    set dynamicSize(value) {
        if (!value) this._trimAlloc();
        this._dynamicSize = value;
    }

    get byteLength() {
        return this._byteLength - this._byteOffset;
    }

    get buffer() {
        this._trimAlloc();
        return this._buffer;
    }

    set buffer(value) {
        this._buffer = value;
        this._dataView = new DataView(this._buffer, this._byteOffset);
        this._byteLength = this._buffer.byteLength;
    }

    get byteOffset() {
        return this._byteOffset;
    }

    set byteOffset(value) {
        this._byteOffset = value;
        this._dataView = new DataView(this._buffer, this._byteOffset);
        this._byteLength = this._buffer.byteLength;
    }

    get dataView() {
        return this._dataView;
    }

    set dataView(view) {
        this._byteOffset = view.byteOffset;
        this._buffer = view.buffer;
        this._dataView = new DataView(this._buffer, this._byteOffset);
        this._byteLength = this._byteOffset + view.byteLength;
    }

    _realloc(additionalBytes) {
        if (!this._dynamicSize) return;

        const requiredSize = this._byteOffset + this.position + additionalBytes;
        let currentSize = this._buffer.byteLength;

        if (requiredSize <= currentSize) {
            if (requiredSize > this._byteLength) {
                this._byteLength = requiredSize;
            }
            return;
        }

        let newSize = Math.max(1, currentSize);
        while (newSize < requiredSize) newSize *= 2;

        const newBuffer = new ArrayBuffer(newSize);
        new Uint8Array(newBuffer).set(new Uint8Array(this._buffer));
        this.buffer = newBuffer;
        this._byteLength = requiredSize;
    }

    _trimAlloc() {
        if (this._byteLength !== this._buffer.byteLength) {
            const trimmedBuffer = new ArrayBuffer(this._byteLength);
            new Uint8Array(trimmedBuffer).set(new Uint8Array(this._buffer, 0, this._byteLength));
            this.buffer = trimmedBuffer;
        }
    }

    mapUint8Array(length) {
        this._realloc(length);
        const arr = new Uint8Array(this._buffer, this.byteOffset + this.position, length);
        this.position += length;
        return arr;
    }

    readUint8Array(length) {
        if (length == null) length = this.byteLength - this.position;
        const result = new Uint8Array(length);
        DataStream.memcpy(result.buffer, 0, this.buffer, this.byteOffset + this.position, length);
        this.position += length;
        return result;
    }

    readUint32(littleEndian = this.endianness) {
        const value = this._dataView.getUint32(this.position, littleEndian);
        this.position += 4;
        return value;
    }

    readUint16(littleEndian = this.endianness) {
        const value = this._dataView.getUint16(this.position, littleEndian);
        this.position += 2;
        return value;
    }

    readUint8() {
        const value = this._dataView.getUint8(this.position);
        this.position += 1;
        return value;
    }

    writeUint32(value, littleEndian = this.endianness) {
        this._realloc(4);
        this._dataView.setUint32(this.position, value, littleEndian);
        this.position += 4;
    }

    writeUint16(value, littleEndian = this.endianness) {
        this._realloc(2);
        this._dataView.setUint16(this.position, value, littleEndian);
        this.position += 2;
    }

    writeUint8(value) {
        this._realloc(1);
        this._dataView.setUint8(this.position, value);
        this.position += 1;
    }

    writeUint8Array(array) {
        this._realloc(array.length);
        if (array instanceof Uint8Array && (this.byteOffset + this.position) % array.BYTES_PER_ELEMENT === 0) {
            DataStream.memcpy(this._buffer, this.byteOffset + this.position, array.buffer, array.byteOffset, array.byteLength);
            this.mapUint8Array(array.length);
        } else {
            for (let i = 0; i < array.length; i++) {
                this.writeUint8(array[i]);
            }
        }
    }

    static memcpy(dstBuffer, dstOffset, srcBuffer, srcOffset, byteLength) {
        const dst = new Uint8Array(dstBuffer, dstOffset, byteLength);
        const src = new Uint8Array(srcBuffer, srcOffset, byteLength);
        dst.set(src);
    }
}

const Zlib = {
  Deflate(input) {
    return {
      compress() {
        const buffer = Buffer.from(input);
        const compressed = zlib.deflateSync(buffer);
        return new Uint8Array(compressed);
      }
    };
  },

  Inflate(input) {
    return {
      decompress() {
        const buffer = Buffer.from(input);
        const decompressed = zlib.inflateSync(buffer);
        return new Uint8Array(decompressed);
      }
    };
  }
};

export const binaryToMsg = (msg) =>  {
    const readBuffer = new ArrayBuffer(msg.length);
    const readView = new Uint8Array(readBuffer);
    for (let i = 0; i < msg.length; i++) readView[i] = msg[i];
    const readerObject = new DataStream(readBuffer, 0, false);
    const flag = readerObject.readUint8();
    const isCompressed = (flag & 32) > 0; 
    const dataLength = (flag & 8) > 0 ? readerObject.readUint32() : readerObject.readUint16();
    const mainData = isCompressed ? Zlib.Inflate(mainData).decompress() : readerObject.readUint8Array(dataLength);
    const sfs2x = SFS2X.SFSObject.newFromBinaryData(mainData);
    const action = sfs2x.get(_ACTION_ID);
    const controllerID = sfs2x.get(_CONTROLLER_ID);
    const paramInfo = sfs2x.get(_PARAM_ID);

    console.log(`>----< action::${action}, controllerID::${controllerID} >----<`);
    console.log("paramInfo =", paramInfo);
    return {
        action: action,
        cid: controllerID,
        paramInfo: paramInfo
    }
}

const uint8ArrayToHexArray = (uint8arr) => {
    return Array.from(uint8arr, byte => '0x' + byte.toString(16).padStart(2, '0'));
}

export const msgToBinary = ( aid, cid, paramObj ) => {
    const sfsObject = new SFS2X.SFSObject;
    sfsObject.put(_CONTROLLER_ID, cid, SFS2X.SFSDataType.BYTE);
    sfsObject.put(_ACTION_ID, aid, SFS2X.SFSDataType.SHORT);
    sfsObject.put(_PARAM_ID, paramObj, SFS2X.SFSDataType.SFS_OBJECT);
    let binaryData = sfsObject.toBinary();
    let binaryLength = binaryData.byteLength;
    let writer = new DataStream(new ArrayBuffer(0), 0, false);
    
    let flag = 128;
    
    if(binaryLength > 1024) {
        flag += 32;
        binaryData = Zlib.Deflate(binaryData).compress();
        binaryLength = binaryData.byteLength;
    }
    
    const useExtendedLength = binaryLength > 65335;
    if( useExtendedLength > 65335 ) flag +=8
    writer.writeUint8(flag);

    
    if (useExtendedLength) {
        writer.writeUint32(binaryLength);
    } else {
        writer.writeUint16(binaryLength);
    }
    
    writer.writeUint8Array(binaryData);
    const finalMessage = new Uint8Array(writer.buffer)
    const hexArray = uint8ArrayToHexArray(finalMessage);;

    // console.log("finalMessage", hexArray);
    return hexArray;
}
