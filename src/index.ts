import { Observable } from 'rxjs';
import { buffer, filter, map } from 'rxjs/operators';

/**
 * Special keyboard keys
 */
export enum SpecialKeys {
    ALT = 'Alt',
    SHIFT = 'Shift',
    ENTER = 'Enter',
    CTRL = 'Control',
    CAPS = 'CapsLock',
    ALT_GR = 'AltGraph',
    OS = 'OS'
}

/**
 * Class for observe physical barcode reading
 */
export class PhysicalBarcodeReaderObserver {
  /**
   * The usable observable to subscribe to
   */
  public onBarcodeRead$: Observable<string>;
  /**
   * Keypress event on document to Observable
   */
  private readonly onKeypress$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keypress');
  /**
   * The enter key pressed event
   */
  private readonly onEnter$: Observable<KeyboardEvent> = this.onKeypress$.pipe(filter(ev => ev.key === SpecialKeys.ENTER.toString()));
  /**
   * Getting reader with specific prefix
   * @param prefixes
   */
  constructor(prefixes?: string[]) {
    this.onBarcodeRead$ = this.onKeypress$.pipe(
      buffer(this.onEnter$),
      filter(chars => !prefixes || prefixes.length === 0 || chars.slice(0, prefixes.length).join() === prefixes.join()),
      map(events => events.filter(ev => ev.key.length === 1).reduce((acc, cur) => acc + cur.key, '')),
    );
  }
}
