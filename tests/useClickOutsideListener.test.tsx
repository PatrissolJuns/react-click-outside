import { renderHook, act } from '@testing-library/react-hooks';
import { fireEvent } from '@testing-library/react';
import { useClickOutsideListener, UseClickOutsideListenerOptions } from '../src';

describe('useClickOutsideListener', () => {
    let options: UseClickOutsideListenerOptions;
    let target: HTMLDivElement;

    beforeEach(() => {
        options = {
            onClickOutside: jest.fn(),
            events: ['mousedown'],
        };
        target = document.createElement('div');
        document.body.appendChild(target);
    });

    afterEach(() => {
        document.body.removeChild(target);
    });

    test('should call onClickOutside when clicking outside the element', () => {
        const { result } = renderHook(() => useClickOutsideListener(options));
        const nodeRef = result.current;
        nodeRef.current = target;

        act(() => {
            fireEvent.mouseDown(document.body);
        });

        expect(options.onClickOutside).toHaveBeenCalledTimes(1);
    });

    test('should not call onClickOutside when clicking inside the element', () => {
        const { result } = renderHook(() => useClickOutsideListener(options));
        const nodeRef = result.current;
        nodeRef.current = target;

        act(() => {
            fireEvent.mouseDown(target);
        });

        expect(options.onClickOutside).toHaveBeenCalledTimes(0);
    });

    test('should handle multiple event types', () => {
        options.events = ['mousedown', 'mouseup'];
        const { result } = renderHook(() => useClickOutsideListener(options));
        const nodeRef = result.current;
        nodeRef.current = target;

        act(() => {
            fireEvent.mouseDown(document.body);
            fireEvent.mouseUp(document.body);
        });

        expect(options.onClickOutside).toHaveBeenCalledTimes(2);
    });

    test('should clean up event listeners when unmounting', () => {
        const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
        const { result, unmount } = renderHook(() => useClickOutsideListener(options));
        const nodeRef = result.current;
        nodeRef.current = target;

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledTimes(options.events!.length);
    });
});
