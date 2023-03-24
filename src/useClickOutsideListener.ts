import { useEffect, useRef, MutableRefObject } from 'react';

type EventType =
    | 'mousedown'
    | 'mouseup'
    | 'mouseover'
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
    exclude?: MutableRefObject<HTMLElement | null>[] | null;
}

const useClickOutsideListener = <T extends HTMLElement>(
    options: UseClickOutsideListenerOptions
): MutableRefObject<T | null> => {
    const { onClickOutside, events = ['mousedown'], scope, exclude } = options;
    const nodeRef = useRef<T | null>(null);

    /**
    * Handles click outside events.
    * Calls the onClickOutside callback if the click outside event occurs
    * outside the node specified by the nodeRef.
    */
    // @ts-ignore
    const handleClickOutside: EventListener = (
        event: MouseEvent | TouchEvent | KeyboardEvent | FocusEvent,
    ) => {
        if (!nodeRef.current) return;

        // Get the event source target
        const eventTarget = event.target as Node

        if (exclude) {
            // Get all node ref who have current property set
            const excludedTarget = exclude.filter(ref => !(!ref.current))
                // Check whether the click came from excluded Nodes
                .filter((ref) => ref.current && ref.current.contains(eventTarget));

            if (excludedTarget.length !== 0) {
                return;
            }
        }

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
        const _scope = scope || document
        if (_scope !== null) {
            events.forEach((event) => _scope.addEventListener(event, handleClickOutside));

            return () => {
                events.forEach((event) => _scope.removeEventListener(event, handleClickOutside));
            };
        }
    }, [events, scope, exclude, handleClickOutside]);

    return nodeRef;
};

export default useClickOutsideListener;