# Welcome to @patrissoljuns/react-click-outside 🎉

[![npm version](https://badge.fury.io/js/@patrissoljuns%2Freact-click-outside.svg)](https://badge.fury.io/js/@patrissoljuns%2Freact-click-outside)
[![codecov](https://codecov.io/gh/PatrissolJuns/react-click-outside/branch/master/graph/badge.svg?token=SG6YLK9DMU)](https://codecov.io/gh/PatrissolJuns/react-click-outside)
[![Build Status](https://github.com/PatrissolJuns/react-click-outside/actions/workflows/test.yml/badge.svg)](https://github.com/USERNAME/REPOSITORY/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Looking for an easy and efficient way to handle click-away interactions in your React application? Look no further! Introducing **@patrissoljuns/react-click-outside**, a lightweight and powerful package that offers a hassle-free solution for handling click-away events in React applications.
Whether you're working on dropdowns, modals, or any other UI components that need to close when a user interacts outside of them, this package has got your back.

## 🔥 Features
- **Versatile**: Support for both functional components (hooks) and class components. Choose the method that works best for you!
- **Flexible**: Customizable event types (click, mousedown, mouseup, keydown, touchstart, etc.)
- **Scoped**: Define the target element or document where the event listeners will be attached, making it ideal for restricting click-away detection to a particular section or container in your application.
- **Optimized**: Streamlined event handling and clean-up ensure top-notch performance and silky-smooth user experiences.
- **Type-safe**: Crafted with TypeScript for built-in type safety.

## 📦 Installation
````shell
npm install @patrissoljuns/react-click-outside
# or
yarn add @patrissoljuns/react-click-outside
````

## 🚀 Usage

### Declarative Component

Here's a simple example of using the `ClickOutsideListener` component to close a dropdown menu:

````tsx
import React, { useState } from 'react';
import ClickOutsideListener from '@patrissoljuns/react-click-outside';

const MyComponent = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClickOutside = () => {
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div>
      <button onClick={toggleDropdown}>Toggle Dropdown</button>
      {dropdownOpen && (
        <ClickOutsideListener onClickOutside={handleClickOutside}>
          <div className="dropdown">
            {/* Dropdown content */}
            Click outside this element to close it!
          </div>
        </ClickOutsideListener>
      )}
    </div>
  );
};
````

### useClickOutsideListener Hook

Alternatively, you can use the `useClickAwayListener` hook to programmatically handle click-away events
````tsx
import React, { useState } from 'react';
import { useClickOutsideListener } from '@patrissoljuns/react-click-outside';

const ExampleComponent = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  
  const containerRef = useClickOutsideListener<HTMLDivElement>({
    onClickOutside: () => setShowDrawer(false), 
    events: ['keydown', 'touchstart']
  });

  return (
    <div ref={containerRef}>
      <button onClick={() => setShowDrawer(true)}>Toggle drawer</button>
      {showDrawer && <div>My beautiful drawer</div>}
    </div>
  );
};
````

### 📚 API

#### useClickOutsideListener

| Prop     |      Type     |  Description  |
|----------|:-------------:|:-------------:|
| **onClickOutside** `required` |  <code>(event: MouseEvent &#124; TouchEvent &#124; KeyboardEvent &#124; FocusEvent) => void</code> | A callback function that is triggered when an event specified in the `events` prop occurs outside the children element. </br> It receives the event object as its argument, allowing you to perform custom actions based on the event type, target, or other properties
| **events** </br> Default to `['mousedown']` | <code>Array<'mousedown' &#124; 'mouseup' &#124; 'mouseover' &#124; 'click' &#124; 'touchstart' &#124; 'touchend' &#124; 'keydown' &#124; 'keyup' &#124; 'focus' &#124; 'blur'></code>   |  An array of event types to listen for. This allows you to customize the events that trigger the **onClickOutside** callback | 
| **scope** </br> Default to `document` | <code>HTMLElement &#124; Document &#124; null</code> | An optional parameter that allows you to specify the target element, document, or null where the event listeners will be attached. This can be useful in cases where you want to limit the click-away detection to a specific section or container of your application. </br> If `scope` is set to `null`, no event listener will be attached. If `scope` is `undefined`, the document will be used as the default value. This flexibility helps handling the initial state of refs more easily and avoid potential issues or unexpected behavior when working with the useClickOutsideListener hook. |

#### ClickOutsideListener

Same with useClickOutsideListener above plus the following:

| Prop     | Type |  Description  |
|----------|:-------------:|:-------------:|
| **children** `required` | `React.ReactElement` | A single React element that the ClickOutsideListener will wrap. This element will be monitored for click events happening outside of it. The ClickOutsideListener will execute the provided `onClickOutside` callback when such an event occurs |
| **wrapperComponent** |   `React.ElementType`    | An optional custom component that will be used as the wrapper for the `children` element. By default, ClickOutsideListener uses a React fragment to avoid altering the DOM structure. However, if you need to use a specific HTML element or custom component as the wrapper, you can provide it through this prop | 
| **wrapperProps** |  `React.HTMLAttributes<HTMLElement>` | Optional object containing any additional props to apply to the `wrapperComponent` if present


## 📖 Examples

<details>
<summary>Closing a modal only when pressing 'Escape' or 'p'</summary>

````tsx
import React, { useState } from 'react';
import ClickOutsideListener, { UseClickOutsideListenerOptions } from '@patrissoljuns/react-click-outside';

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal: UseClickOutsideListenerOptions['onClickOutside'] = (event) => {
        if (event instanceof KeyboardEvent && (event.key === 'p' || event.key === 'Escape')) {
            setIsModalOpen(false);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div>
            <button onClick={openModal}>Open Modal</button>
            {isModalOpen && (
                <ClickOutsideListener onClickOutside={closeModal} events={['keydown']}>
                    <div className="modal">
                        <h2>Modal Title</h2>
                        <p>Modal content...</p>
                    </div>
                </ClickOutsideListener>
            )}
        </div>
    );
};

export default App;
````
</details>

<details>
<summary>Close a @mui/Popover on any key press </summary>

````tsx
import React, {useState} from 'react';
import useClickOutsideListener from "@patrissoljuns/react-click-outside";
import { Button, Popover, MenuList, MenuItem } from '@mui/material';

const MuiPopoverExample: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'popover-example' : undefined;

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClick}>
                Open Popover
            </Button>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <ClickOutsideListener
                    onClickOutside={handleClose}
                    events={['keyup']}
                >
                    <MenuList id="my-menu">
                        <MenuItem onClick={handleClose}>Option 1</MenuItem>
                        <MenuItem onClick={handleClose}>Option 2</MenuItem>
                        <MenuItem onClick={handleClose}>Option 3</MenuItem>
                    </MenuList>
                </ClickOutsideListener>
            </Popover>
        </div>
    );
};
````
</details>

<details>
<summary>Touchable panel: close on touch away with Ant Design</summary>

````tsx
import React, { useState } from 'react';
import useClickOutsideListener from '@patrissoljuns/react-click-outside';
import { Button, Typography, Card } from 'antd';

const TouchPanelExample: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const panelRef = useClickOutsideListener({
        onClickOutside: handleClose,
        events: ['touchstart'],
    });

    return (
        <div>
            <Button type="primary" onClick={handleOpen}>
                Open Panel
            </Button>
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                    ref={panelRef}
                >
                    <Card title="Touch Panel" bordered={false}>
                        <Typography.Text>
                            Touch anywhere outside this panel to close it.
                        </Typography.Text>
                    </Card>
                </div>
            )}
        </div>
    );
};
````
</details>

## 🙌 Contributing
We welcome your contributions! To get started, follow these steps:

1. Fork the repository and create a new branch for your changes.
2. Install the necessary dependencies by running `npm install` or `yarn install`.
3. Make your changes, ensuring that they adhere to the project's coding standards.
4. Test your changes by running the appropriate test command (e.g., `npm test` or `yarn test`). You may also update tests.
5. Submit a pull request for your changes, and we'll review them as soon as possible.

## 📄 License
MIT © Patrissol KENFACK
