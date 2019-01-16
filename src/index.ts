import {Observable} from 'rxjs';
import {bufferToggle, filter, map} from 'rxjs/operators';

export class PhysicalBarcodeReaderObserver {
    private readonly onKeypress$: Observable<KeyboardEvent> = Observable.fromEvent(document, 'keypress');
    private readonly onEnter$: Observable<KeyboardEvent> = this.onKeypress$.pipe(filter(ev => ev.key === 'Enter'));
    private readonly onStart$: Observable<KeyboardEvent>;
    public onBarcodeRead$: Observable<string> = this.onKeypress$.pipe(
        bufferToggle(this.onStart$, () => this.onEnter$),
        map(events => events.filter(ev => ev.key.length === 1).reduce((acc, cur) => acc + cur.key, '')),
    );

    constructor(prefix?: string) {
        this.onStart$ = this.onKeypress$.pipe(filter(ev => !prefix || ev.key === prefix));
    }
}
