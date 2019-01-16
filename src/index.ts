import {Observable} from 'rxjs';
import {bufferToggle, filter, map} from 'rxjs/operators';

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
    private readonly onEnter$: Observable<KeyboardEvent> = this.onKeypress$.pipe(filter(ev => ev.key === 'Enter'));
    /**
     * Getting reader with specific prefix
     * @param prefix
     */
    constructor(prefix?: string) {
        const onStart$ = this.onKeypress$.pipe(filter(ev => !prefix || ev.key === prefix));
        this.onBarcodeRead$ = this.onKeypress$.pipe(
            bufferToggle(onStart$, () => this.onEnter$),
            map(events => events.filter(ev => ev.key.length === 1).reduce((acc, cur) => acc + cur.key, '')),
        );
    }
}
