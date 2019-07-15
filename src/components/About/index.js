import React from "react";
import {connect} from "react-redux";
import styles from "./about.module.less";

import {setPlatform, setUserAgent, asyncSetReactVersion} from "../../store/modules/env/actions";

class About extends React.Component
{
    componentDidMount()
    {
        const {
            setPlatform,
            setUserAgent,
            setReactVersion
        } = this.props;

        setPlatform(window.navigator.platform);
        setUserAgent(window.navigator.userAgent);
        setReactVersion();
    }

    render()
    {
        const {platform, userAgent, version} = this.props;
        const vendor = window.navigator.vendor;

        return (
            <div className={styles.about}>
                <div className={styles.logo}></div>

                <table>
                    <tr>
                        <td className={styles.title}>version</td>
                        <td>anu.js {version}</td>
                    </tr>
                    <tr>
                        <td className={styles.title}>platform</td>
                        <td>{platform}</td>
                    </tr>
                    <tr>
                        <td className={styles.title}>userAgent</td>
                        <td>{userAgent}</td>
                    </tr>
                    <tr>
                        <td className={styles.title}>vendor</td>
                        <td>{vendor}</td>
                    </tr>
                </table>
            </div>
        );
    }
}

function mapStateToProps(state)
{
    const {platform, userAgent, reactVersion} = state.env;

    return {
        platform,
        userAgent,
        version: reactVersion
    };
}

function mapDispatchToProps(dispatch)
{
    return {
        setPlatform(platform)
        {
            dispatch(setPlatform(platform));
        },
        setUserAgent(userAgent)
        {
            dispatch(setUserAgent(userAgent));
        },
        setReactVersion()
        {
            dispatch(asyncSetReactVersion());
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(About);