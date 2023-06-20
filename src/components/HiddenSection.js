import React from "react";

const HiddenSection = ({open, children, index}) => {
    if (index) {
        return(
            <section className="collapse-section overflow-hidden position-relative my-0" style={{height:(open ? open : 0)}}>
                <div className="collapse-content position-relative w-100" id={'collapseSection' + index}>
                    {children}
                </div>
            </section>
        )
    }
};

export default HiddenSection;