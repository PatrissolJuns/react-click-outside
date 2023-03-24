import React, { ReactElement, ElementType, HTMLAttributes } from 'react';
import useClickOutsideListener, {UseClickOutsideListenerOptions} from './useClickOutsideListener';

export interface ClickOutsideListenerProps<T extends HTMLElement> extends UseClickOutsideListenerOptions {
    children: ReactElement;
    wrapperComponent?: ElementType;
    wrapperProps?: HTMLAttributes<HTMLElement>;
}

const ClickOutsideListener = <T extends HTMLElement>({
        onClickOutside,
        events,
        scope,
        exclude,
        children,
        wrapperComponent,
        wrapperProps,
    }: ClickOutsideListenerProps<T>) => {
    const nodeRef = useClickOutsideListener<T>({ onClickOutside, events, scope, exclude });

    if (wrapperComponent) {
        const WrapperComponent = wrapperComponent;
        return <WrapperComponent ref={nodeRef} {...wrapperProps}>{children}</WrapperComponent>;
    }

    return (
        <>
            {React.Children.only(
                React.cloneElement(children, { ref: nodeRef }),
            )}
        </>
    )
};

export default ClickOutsideListener;
