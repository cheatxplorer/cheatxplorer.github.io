var _$_d1b5=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x6C\x61\x79\x2D\x6C\x68\x2E\x67\x6F\x6F\x67\x6C\x65\x75\x73\x65\x72\x63\x6F\x6E\x74\x65\x6E\x74\x2E\x63\x6F\x6D\x2F\x50\x6C\x49\x57\x72\x66\x39\x41\x49\x78\x6D\x48\x43\x42\x37\x4F\x52\x6C\x2D\x4F\x31\x65\x4C\x63\x5F\x6B\x44\x66\x4F\x46\x51\x65\x73\x41\x36\x35\x4C\x58\x73\x66\x2D\x49\x4F\x30\x70\x6C\x55\x4F\x4C\x44\x6B\x32\x6C\x74\x42\x32\x5A\x31\x62\x47\x71\x6D\x48\x55\x4E\x31\x34\x3D\x73\x32\x38\x30","\x6D\x61\x74\x63\x68","","\x3D\x73\x32\x38\x30","\x72\x65\x70\x6C\x61\x63\x65","\x6C\x6F\x67","\x6F\x6E\x6C\x6F\x61\x64","\x6F\x6E\x65\x72\x72\x6F\x72","\x73\x72\x63","\x63\x6F\x6D\x70\x6C\x65\x74\x65","\x6C\x65\x6E\x67\x74\x68","\x70\x61\x63\x6B\x61\x67\x65\x4E\x61\x6D\x65","\x70\x6C\x61\x79\x53\x74\x6F\x72\x65\x55\x72\x6C","\x74\x68\x75\x6D\x62\x6E\x61\x69\x6C","\x66\x6F\x72\x45\x61\x63\x68","\x4E\x6F\x20\x70\x61\x63\x6B\x61\x67\x65\x20\x6E\x61\x6D\x65\x20\x61\x76\x61\x69\x6C\x61\x62\x6C\x65\x20\x66\x6F\x72\x3A","\x74\x69\x74\x6C\x65","\x65\x72\x72\x6F\x72","\x2C\x20\x66\x65\x74\x63\x68\x69\x6E\x67\x20\x6E\x65\x77\x20\x6F\x6E\x65"];const DEFAULT_ICON=_$_d1b5[0];function getPackageNameFromUrl(_0xA712){const _0xA728=/id=([^&]+)/;const _0xA71D=_0xA712[_$_d1b5[1]](_0xA728);return _0xA71D?_0xA71D[1]:_$_d1b5[2]}function formatToS280(_0xA712){_0xA712= _0xA712[_$_d1b5[4]](/=w\d+-h\d+(-\w+)?/,_$_d1b5[3]);_0xA712= _0xA712[_$_d1b5[4]](/=s\d+(-\w+)?/,_$_d1b5[3]);return _0xA712}function getDirectIconUrl(_0xA6E6){return ("\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x6C\x61\x79\x2D\x6C\x68\x2E\x67\x6F\x6F\x67\x6C\x65\x75\x73\x65\x72\x63\x6F\x6E\x74\x65\x6E\x74\x2E\x63\x6F\x6D\x2F\x69\x63\x6F\x6E\x3F\x73\x69\x7A\x65\x3D\x32\x38\x30\x26\x68\x6C\x3D\x65\x6E\x26\x71\x3D"+_0xA6E6+_$_d1b5[2])}function fetchIconWithFallback(_0xA6E6,_0xA6D0){const _0xA6DB=getDirectIconUrl(_0xA6E6);imageExists(_0xA6DB,(_0xA6F1)=>{if(_0xA6F1){console[_$_d1b5[5]](("\x44\x69\x72\x65\x63\x74\x20\x69\x63\x6F\x6E\x20\x55\x52\x4C\x20\x77\x6F\x72\x6B\x73\x20\x66\x6F\x72\x20"+_0xA6E6+_$_d1b5[2]));_0xA6D0(_0xA6DB)}else {console[_$_d1b5[5]](("\x49\x63\x6F\x6E\x20\x66\x65\x74\x63\x68\x20\x66\x61\x69\x6C\x65\x64\x20\x66\x6F\x72\x20"+_0xA6E6+_$_d1b5[2]));_0xA6D0(DEFAULT_ICON)}})}function imageExists(_0xA712,_0xA6D0){const _0xA733= new Image();_0xA733[_$_d1b5[6]]= function(){_0xA6D0(true)};_0xA733[_$_d1b5[7]]= function(){_0xA6D0(false)};_0xA733[_$_d1b5[8]]= _0xA712;setTimeout(()=>{if(!_0xA733[_$_d1b5[9]]){console[_$_d1b5[5]](("\x49\x6D\x61\x67\x65\x20\x6C\x6F\x61\x64\x20\x74\x69\x6D\x65\x6F\x75\x74\x20\x66\x6F\x72\x3A\x20"+_0xA712+_$_d1b5[2]));_0xA733[_$_d1b5[8]]= _$_d1b5[2];_0xA6D0(false)}},5000)}function processGameIcons(_0xA6D0){const _0xA749=gameData[_$_d1b5[10]];let _0xA73E=0;if(_0xA749=== 0){_0xA6D0();return};gameData[_$_d1b5[14]]((_0xA6FC)=>{if(!_0xA6FC[_$_d1b5[11]]&& _0xA6FC[_$_d1b5[12]]){_0xA6FC[_$_d1b5[11]]= getPackageNameFromUrl(_0xA6FC[_$_d1b5[12]])};if(_0xA6FC[_$_d1b5[13]]){_0xA6FC[_$_d1b5[13]]= formatToS280(_0xA6FC[_$_d1b5[13]])};fetchPlayStoreIcon(_0xA6FC,()=>{_0xA73E++;if(_0xA73E=== _0xA749){_0xA6D0()}})})}function fetchPlayStoreIcon(_0xA6FC,_0xA6D0){if(!_0xA6FC[_$_d1b5[11]]){console[_$_d1b5[17]](_$_d1b5[15],_0xA6FC[_$_d1b5[16]]);_0xA6FC[_$_d1b5[13]]= DEFAULT_ICON;_0xA6D0();return};if(_0xA6FC[_$_d1b5[13]]){imageExists(_0xA6FC[_$_d1b5[13]],(_0xA6F1)=>{if(_0xA6F1){console[_$_d1b5[5]](("\x45\x78\x69\x73\x74\x69\x6E\x67\x20\x74\x68\x75\x6D\x62\x6E\x61\x69\x6C\x20\x77\x6F\x72\x6B\x73\x20\x66\x6F\x72\x20"+_0xA6FC[_$_d1b5[16]]+_$_d1b5[2]));_0xA6D0()}else {console[_$_d1b5[5]](("\x45\x78\x69\x73\x74\x69\x6E\x67\x20\x74\x68\x75\x6D\x62\x6E\x61\x69\x6C\x20\x62\x72\x6F\x6B\x65\x6E\x20\x66\x6F\x72\x20"+_0xA6FC[_$_d1b5[16]]+_$_d1b5[18]));fetchIconWithFallback(_0xA6FC[_$_d1b5[11]],(_0xA707)=>{_0xA6FC[_$_d1b5[13]]= _0xA707;_0xA6D0()})}})}else {fetchIconWithFallback(_0xA6FC[_$_d1b5[11]],(_0xA707)=>{_0xA6FC[_$_d1b5[13]]= _0xA707;_0xA6D0()})}}
