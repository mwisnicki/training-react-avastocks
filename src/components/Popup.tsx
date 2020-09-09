import React, { useState } from 'react';

export interface PopupProps {
    visible: boolean;
    setVisible(show: boolean): void;
}

export function usePopupState() {
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false)
    return { visible, setVisible, show, hide };
}

export const Popup: React.FC<PopupProps> = (props) => {
    const { visible, setVisible } = props;

    const modalOpClass = `modal__OP`; // TODO modal__${op}

    const handleClose = () => setVisible(false);

    if (!visible) return <></>;

    return (
        <div className={`modal ${modalOpClass} visible`}>
            <div className="modal__overlay"></div>
            <div className="modal__content modal__content--large">
                <div className="modal__close" onClick={handleClose}>x</div>
                {props.children}
            </div>
        </div>
    );
}
