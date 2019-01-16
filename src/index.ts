import { Observable, Subject } from 'rxjs';
import { buffer, filter, map, tap } from 'rxjs/operators';

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
  OS = 'OS',
}

/**
 * Class for observe physical barcode reading
 */
export class PhysicalBarcodeReaderObserver {
  /**
   * The usable observable to subscribe to
   */
  public onBarcodeRead$: Observable<string>;

  public onDebug$: Subject<{ text: string; info: any }> = new Subject<{ text: string; info: any }>();
  /**
   * Keypress event on document to Observable
   */
  private readonly onKeypress$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keypress');
  /**
   * The enter key pressed event
   */
  private readonly onEnter$: Observable<KeyboardEvent> = this.onKeypress$.pipe(
    filter(ev => ev.key === SpecialKeys.ENTER.toString()),
  );
  /**
   * Getting reader with specific prefix
   * @param prefixes
   * @param debug
   */
  constructor(prefixes: string[] = []) {
    this.onBarcodeRead$ = this.onKeypress$.pipe(
      tap(ev => this.onDebug$.next({ text: `Keypress: `, info: ev })),
      buffer(this.onEnter$),
      tap(chars => this.onDebug$.next({ text: `Chars: `, info: chars })),
      filter(chars => {
        const charsBegin = chars.slice(0, prefixes.length).join();
        this.onDebug$.next({ text: `Begin: `, info: charsBegin });
        this.onDebug$.next({ text: `Prefixes: `, info: prefixes.join() });
        return charsBegin === prefixes.join();
      }),
      map(events => events.filter(ev => ev.key.length === 1).reduce((acc, cur) => acc + cur.key, '')),
      tap(value => this.onDebug$.next({ text: `Result: `, info: value })),
    );
  }
}
