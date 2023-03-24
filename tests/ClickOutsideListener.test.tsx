import React from 'react';
import '@testing-library/jest-dom'
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import ClickOutsideListener from '../src';

describe('ClickOutsideListener', () => {
    const onClickOutside = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders without errors', () => {
        const { container } = render(
            <ClickOutsideListener onClickOutside={onClickOutside}>
                <div>Wrapped Component</div>
            </ClickOutsideListener>
        );

        expect(container).toMatchSnapshot();
    });

    test('click outside triggers the event', () => {
        render(
            <div>
                <ClickOutsideListener onClickOutside={onClickOutside} events={['click']}>
                    <div>Wrapped Component</div>
                </ClickOutsideListener>
                <div data-testid="outside">Outside</div>
            </div>
        );

        fireEvent.click(screen.getByTestId('outside'));
        expect(onClickOutside).toHaveBeenCalledTimes(1);
    });

    test('click inside does not trigger the event', () => {
        render(
            <ClickOutsideListener onClickOutside={onClickOutside}>
                <div data-testid="inside">Wrapped Component</div>
            </ClickOutsideListener>
        );

        fireEvent.click(screen.getByTestId('inside'));
        expect(onClickOutside).toHaveBeenCalledTimes(0);
    });

    test('handles multiple events correctly', () => {
        const onClickOutside = jest.fn();

        render(
            <div>
                <ClickOutsideListener onClickOutside={onClickOutside} events={['mousedown', 'touchstart']}>
                    <div data-testid="inside">Wrapped Component</div>
                </ClickOutsideListener>
                <div data-testid="outside">Outside</div>
            </div>
        );

        fireEvent.mouseDown(screen.getByTestId('outside'));
        fireEvent.touchStart(screen.getByTestId('outside'));

        expect(onClickOutside).toHaveBeenCalledTimes(2);
    });

    test('handles custom scope correctly', async () => {
        const onClickOutside = jest.fn();

        const Component = () => {
            const [ref, setRef] = React.useState<HTMLElement | null>(null);

            return (
                <div>
                    <div ref={_ref => { setRef(_ref) }}>
                        <ClickOutsideListener
                            onClickOutside={onClickOutside}
                            scope={ref}>
                            <div data-testid="inside">Wrapped Component</div>
                        </ClickOutsideListener>
                        <div data-testid="outside-scope">Outside Scope</div>
                    </div>
                    <div data-testid="outside">Outside</div>
                </div>
            )
        }

        render(<Component />)

        await waitFor(() => {
            fireEvent.mouseDown(screen.getByTestId('outside'));
            expect(onClickOutside).toHaveBeenCalledTimes(0);

            fireEvent.mouseDown(screen.getByTestId('outside-scope'));
            expect(onClickOutside).toHaveBeenCalledTimes(1);
        })
    });

    test('uses wrapperComponent and wrapperProps correctly', () => {
        const onClickOutside = jest.fn();
        const customClassName = 'custom-wrapper';
        const customId = 'custom-id';

        render(
            <div>
                <ClickOutsideListener
                    events={['click']}
                    onClickOutside={onClickOutside}
                    wrapperComponent="section"
                    wrapperProps={{
                        className: customClassName,
                        id: customId,
                    }}
                >
                    <div data-testid="inside">Wrapped Component</div>
                </ClickOutsideListener>
                <div data-testid="outside">Outside</div>
            </div>
        );

        const wrapperElement = screen.getByTestId('inside').closest('section');
        expect(wrapperElement).toBeInTheDocument();
        expect(wrapperElement).toHaveClass(customClassName);
        expect(wrapperElement).toHaveAttribute('id', customId);

        fireEvent.click(screen.getByTestId('outside'));
        expect(onClickOutside).toHaveBeenCalledTimes(1);
    });
});
