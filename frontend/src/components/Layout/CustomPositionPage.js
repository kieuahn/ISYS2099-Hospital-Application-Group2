import React from 'react';

const CustomPositionPage = ({ children, maxWidth }) => {
    return (
        <div className="flex justify-center py-5 mt-5">
            <div className={`w-[95%] flex justify-center ${maxWidth ? maxWidth : 'max-w-[1000px]'}`}>
                <div className="flex flex-col w-full md:w-[100%] md:mr-4">
                    {children} {/* Renders all children passed to the component */}
                </div>

            </div>
        </div>
    );
};

export default CustomPositionPage;