import { useEffect, useRef } from 'react';

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
    scope?: HTMLElement | Document;
}

const useClickOutsideListener = (options: UseClickOutsideListenerOptions) => {
    const { onClickOutside, events = ['mousedown'], scope = document } = options;
    const nodeRef = useRef<Element | null>(null);

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
        events.forEach((event) => scope.addEventListener(event, handleClickOutside));

        return () => {
            events.forEach((event) => scope.removeEventListener(event, handleClickOutside));
        };
    }, [events, scope, handleClickOutside]);

    return nodeRef;
};

export default useClickOutsideListener;
