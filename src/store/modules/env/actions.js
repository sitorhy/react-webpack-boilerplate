import React from "react";

export const SET_PLATFORM = "SET_TEXT";
export const SET_USERAGENT = "SET_USERAGENT";
export const SET_REACT_VERSION = "SET_REACT_VERSION";

export function setPlatform(platform)
{
    return {type: SET_PLATFORM, payload: {platform}};
}

export function setUserAgent(userAgent)
{
    return {type: SET_USERAGENT, payload: {userAgent}};
}

export function setReactVersion(version)
{
    return {type: SET_REACT_VERSION, payload: {reactVersion: version}};
}

/* test only */
export function asyncSetReactVersion()
{
    return (dispatch, getState) =>
    {
        return new Promise((resolve) =>
        {
            setTimeout(() =>
            {
                dispatch(setReactVersion(React.version));
                const {env} = getState();
                resolve(env);
            }, 2000);
        });
    };
}