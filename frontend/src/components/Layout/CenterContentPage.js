import React from 'react';

const CenterContentPage = ({ children, maxWidth }) => {
    return (
        <div className="flex justify-center py-5 mt-5">
            <div className={`w-[95%] flex justify-center ${maxWidth ? maxWidth : 'max-w-[860px]'}`}>
                <div className="flex flex-col w-full md:w-[60%] md:mr-6">
                    {children} {/* Renders all children passed to the component */}
                </div>
            </div>
        </div>
    );
};

export default CenterContentPage;
