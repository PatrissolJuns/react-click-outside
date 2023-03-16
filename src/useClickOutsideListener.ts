import { useEffect, useRef, MutableRefObject } from 'react';

type EventType =
    | 'mousedown'
    | 'mouseup'
    | 'click'
    | 'touchstart'
    | 'touchend'
    | 'keydown'
    | 'keyup'
    | 'focus'
    | 'blur';

export interface UseClickOutsideListenerOptions {
    onClickOutside: (event: MouseEvent | TouchEvent | KeyboardEvent | FocusEvent) => void;
    events?: EventType[];
    scope?: HTMLElement | Document | null;
}

const useClickOutsideListener = <T extends HTMLElement>(
    options: UseClickOutsideListenerOptions
): MutableRefObject<T | null> => {
    const { onClickOutside, events = ['mousedown'], scope } = options;
    const nodeRef = useRef<T | null>(null);

    // @ts-ignore
    const handleClickOutside: EventListener = (
        event: MouseEvent | TouchEvent | KeyboardEvent | FocusEvent,
    ) => {
        if (!nodeRef.current) return;

        // Handle keyboard events
        if (event instanceof KeyboardEvent) {
            if (event.type === 'keydown' || event.type === 'keyup') {
                onClickOutside(event);
            }
            return;
        }

        // Handle focus and blur events
        if (event instanceof FocusEvent) {
            if (event.type === 'focus' || event.type === 'blur') {
                onClickOutside(event);
            }
            return;
        }

        // Handle click and touch events
        if (!nodeRef.current.contains(event.target as Node)) {
            onClickOutside(event);
        }
    };

    useEffect(() => {
        const _scope = scope === null ? null : scope || document
        if (_scope !== null) {
            events.forEach((event) => _scope.addEventListener(event, handleClickOutside));

            return () => {
                events.forEach((event) => _scope.removeEventListener(event, handleClickOutside));
            };
        }
    }, [events, scope, handleClickOutside]);

    return nodeRef;
};

export default useClickOutsideListener;
