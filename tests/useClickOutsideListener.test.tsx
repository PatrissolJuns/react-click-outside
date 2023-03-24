import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useClickOutsideListener, UseClickOutsideListenerOptions } from '../src';
import { MutableRefObject } from 'react';
import React from 'react';

describe('useClickOutsideListener', () => {
    let options: UseClickOutsideListenerOptions;
    let target: HTMLDivElement;
    let excluded: MutableRefObject<HTMLElement | null>[];

    beforeEach(() => {
        options = {
            onClickOutside: jest.fn(),
            events: ['mousedown'],
            exclude: excluded,
        };
        target = document.createElement('div');
        document.body.appendChild(target);
    });

    afterEach(() => {
        document.body.removeChild(target);
    });

    test('should call onClickOutside when clicking outside the element', async () => {
        options.events = ['keydown', 'keyup', 'mousedown', 'focus',]
        const { result } = renderHook(() => useClickOutsideListener(options));
        const nodeRef = result.current;
        nodeRef.current = target;

        await waitFor(() => {
            fireEvent.mouseDown(document.body);
            fireEvent.keyDown(document.body);
            fireEvent.keyUp(document.body);
            fireEvent.keyUp(document.body);
            fireEvent.focusIn(document.body);
        });

        expect(options.onClickOutside).toHaveBeenCalledTimes(4);
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

    test('should not call onClickOutside when clicking inside exluded elements', async () => {
        const onClickOutside = jest.fn();

        const Component = () => {
            const ref1 = React.useRef<HTMLDivElement | null>(null);
            const ref2 = React.useRef<HTMLDivElement | null>(null);

            options.exclude = [ref1, ref2]
            options.onClickOutside = onClickOutside;

            const result = useClickOutsideListener<HTMLDivElement>(options);
            result.current = target;

            return (
                <div>
                    <div ref={ref1} data-testid="outside-1"></div>
                    <div ref={ref2} data-testid="outside-2"></div>
                    <div data-testid="outside-3"></div>
                </div>
            )
        }

        render(<Component />)

        await waitFor(() => {
            fireEvent.mouseDown(screen.getByTestId('outside-1'));
            expect(onClickOutside).toHaveBeenCalledTimes(0);

            fireEvent.mouseDown(screen.getByTestId('outside-2'));
            expect(onClickOutside).toHaveBeenCalledTimes(0);

            fireEvent.mouseDown(screen.getByTestId('outside-3'));
            expect(onClickOutside).toHaveBeenCalledTimes(1);
        })
    });

});
