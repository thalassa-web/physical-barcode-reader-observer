# Physical Barcode Reader Observer

This library allows you to easily listen an HID barcode reader events on the document (DOM).  
It uses the RxJS 6 library, to know more about it : https://rxjs-dev.firebaseapp.com/

## Installation
### For node / Angular / Ionic … projects
Make sure you have node and npm installed globally

    node -v
    npm -v
    
Then install the library
   
    $npm i --save physical-barcode-reader-observer 
    
### For simple web project
Just put the file pbro.min.js (look into release assets in GitHub) in your folder of JS libraries and add an HTML script node 

    <script type="text/javascript" src="[path_to_js_lib]/pbro.min.js" />
    
## Use it

The RxJS created observable emits a BarcodeResult when a barcode is read.

     BarcodeResult {
         barcode: string,
         type: BarcodeType,
         target: EventTarget
     }
    
Currently, there is only four types :
  - EAN_13 : Only 13 digits + control key checking
  - UPC_A : Only 12 digits + control key checking
  - EAN_8 : Only 8 digits + control key checking
  - UNKNOWN
  
To help you to avoid typing errors, I made an enum with some special keys :

    SpecialKeys {
        ALT = 'Alt',
        SHIFT = 'Shift',
        ENTER = 'Enter',
        CTRL = 'Control',
        CAPS = 'CapsLock',
        ALT_GR = 'AltGraph',
        OS = 'OS',
        NUM_LOCK = 'NumLock',
    }

### Project with npm

First of all, import the main function :

    import {onBarcodeRead} from "physical-barcode-reader-observer";
    
To use SpecialKeys :

    import {SpecialKeys} from "physical-barcode-reader-observer/lib/enums";

Listen event without any prefix, all keys pressed on keyboard will be concatenated until the time between two strokes is longer than 200ms.

    onBarcodeRead().subscribe(result => {
        const barcode = result.barcode;
        const type = result.type;
        const lastTarget = result.target;
    });
    
The barcode reader adds some prefixes before sending data, you can avoid to listen all keyboard inputs but just when strokes begin with the prefixes suite.  
In the example bellow, event will emit only if the NumLock key is stroke twice and until the time between two strokes is longer than 100ms.

    onBarcodeRead([SpecialKeys.NUM_LOCK, SpecialKeys.NUM_LOCK], 100)
        .subscribe(result => {…});
    
### For simple web project
The library is build as a standalone project in the pbro.min.js file and under the "PBro" name.  

    var event = PBro.onBarcodeRead().subscribe(function (result) {
        console.log(result);
    });

### Be careful
When you don't need to listen the event anymore, don't forget to unsubscribe it ...

    event.unsubscribe();
