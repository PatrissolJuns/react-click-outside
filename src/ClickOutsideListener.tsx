import React, { ReactNode, ElementType } from 'react';
import useClickOutsideListener, {UseClickOutsideListenerOptions} from './useClickOutsideListener';

export interface ClickOutsideListenerProps extends UseClickOutsideListenerOptions {
    children: ReactNode;
    wrapperComponent?: ElementType;
}

const ClickOutsideListener: React.FC<ClickOutsideListenerProps> = ({
        onClickOutside,
        events,
        scope,
        children,
        wrapperComponent: WrapperComponent = 'div',
    }) => {
    const nodeRef = useClickOutsideListener({ onClickOutside, events, scope });

    return (
        <WrapperComponent ref={nodeRef}>
            {children}
        </WrapperComponent>
    );
};

export default ClickOutsideListener;
